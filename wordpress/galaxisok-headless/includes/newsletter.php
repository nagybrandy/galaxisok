<?php
/**
 * Mailchimp newsletter bridge for the headless Galaxisok site.
 * Settings live in WP admin; the public REST route is called by Next.js.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'galaxisok_newsletter_admin_menu');
add_action('admin_init', 'galaxisok_newsletter_register_settings');
add_action('rest_api_init', 'galaxisok_newsletter_register_rest');

function galaxisok_newsletter_admin_menu(): void
{
    add_options_page(
        'Galaxisok Hírlevél',
        'Galaxisok Hírlevél',
        'manage_options',
        'galaxisok-newsletter',
        'galaxisok_newsletter_render_settings'
    );
}

function galaxisok_newsletter_register_settings(): void
{
    register_setting('galaxisok_newsletter', 'galaxisok_mailchimp_api_key', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '',
    ]);
    register_setting('galaxisok_newsletter', 'galaxisok_mailchimp_list_id', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '',
    ]);
    register_setting('galaxisok_newsletter', 'galaxisok_mailchimp_double_optin', [
        'type' => 'boolean',
        'sanitize_callback' => static function ($value): bool {
            return (bool) $value;
        },
        'default' => true,
    ]);
}

function galaxisok_newsletter_render_settings(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    $api_key = (string) get_option('galaxisok_mailchimp_api_key', '');
    $list_id = (string) get_option('galaxisok_mailchimp_list_id', '');
    $double = (bool) get_option('galaxisok_mailchimp_double_optin', true);
    $mc4wp = function_exists('mc4wp_get_api_v3');

    echo '<div class="wrap"><h1>Galaxisok Hírlevél · Mailchimp</h1>';
    if ($mc4wp) {
        echo '<p>A <strong>MC4WP: Mailchimp for WordPress</strong> plugin aktív. Ha ott is megadod az API kulcsot, az is használható tartalékként.</p>';
    }
    echo '<p>A nyilvános feliratkozás a <code>/wp-json/galaxisok/v1/newsletter</code> végponton keresztül megy a Mailchimp Audience-be.</p>';
    echo '<form method="post" action="options.php">';
    settings_fields('galaxisok_newsletter');
    echo '<table class="form-table" role="presentation"><tbody>';
    echo '<tr><th scope="row"><label for="galaxisok_mailchimp_api_key">Mailchimp API kulcs</label></th><td>';
    echo '<input type="password" class="regular-text" id="galaxisok_mailchimp_api_key" name="galaxisok_mailchimp_api_key" value="' . esc_attr($api_key) . '" autocomplete="off" />';
    echo '<p class="description">Mailchimp → Account → Extras → API keys. Formátum: <code>…-us21</code></p></td></tr>';
    echo '<tr><th scope="row"><label for="galaxisok_mailchimp_list_id">Audience / List ID</label></th><td>';
    echo '<input type="text" class="regular-text" id="galaxisok_mailchimp_list_id" name="galaxisok_mailchimp_list_id" value="' . esc_attr($list_id) . '" />';
    echo '<p class="description">Audience → Settings → Audience name and defaults → Audience ID</p></td></tr>';
    echo '<tr><th scope="row">Double opt-in</th><td>';
    echo '<label><input type="checkbox" name="galaxisok_mailchimp_double_optin" value="1"' . checked($double, true, false) . ' /> Megerősítő e-mail kell a feliratkozáshoz</label>';
    echo '</td></tr>';
    echo '</tbody></table>';
    submit_button('Mentés');
    echo '</form></div>';
}

function galaxisok_newsletter_register_rest(): void
{
    register_rest_route('galaxisok/v1', '/newsletter', [
        'methods' => 'POST',
        'callback' => 'galaxisok_newsletter_subscribe',
        'permission_callback' => '__return_true',
        'args' => [
            'email' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_email',
            ],
            'name' => [
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);
}

function galaxisok_newsletter_server_prefix(string $api_key): string
{
    $parts = explode('-', $api_key);
    $suffix = end($parts);
    return is_string($suffix) && $suffix !== '' ? $suffix : 'us1';
}

function galaxisok_newsletter_response(array $payload, int $status): WP_REST_Response
{
    return new WP_REST_Response($payload, $status);
}

function galaxisok_newsletter_subscribe(WP_REST_Request $request): WP_REST_Response
{
    $email = sanitize_email((string) $request->get_param('email'));
    if ($email === '' || !is_email($email)) {
        return galaxisok_newsletter_response([
            'ok' => false,
            'message' => 'Érvényes e-mail-címet adj meg.',
        ], 400);
    }

    $name = mb_substr(sanitize_text_field((string) $request->get_param('name')), 0, 60);
    $member = [
        'email_address' => $email,
        'status_if_new' => '',
        'status' => '',
        'tags' => ['galaxisok-web'],
    ];
    if ($name !== '') {
        $member['merge_fields'] = ['FNAME' => $name];
    }

    $api_key = trim((string) get_option('galaxisok_mailchimp_api_key', ''));
    $list_id = trim((string) get_option('galaxisok_mailchimp_list_id', ''));
    $double = (bool) get_option('galaxisok_mailchimp_double_optin', true);
    $status = $double ? 'pending' : 'subscribed';
    $member['status_if_new'] = $status;
    $member['status'] = $status;

    if ($api_key === '' && function_exists('mc4wp_get_options')) {
        $mc4wp = mc4wp_get_options();
        if (is_array($mc4wp) && !empty($mc4wp['api_key'])) {
            $api_key = trim((string) $mc4wp['api_key']);
        }
    }

    if ($api_key === '' || $list_id === '') {
        return galaxisok_newsletter_response([
            'ok' => false,
            'message' => 'A hírlevél még nincs beállítva a WordPressben (Mailchimp API kulcs / Audience ID).',
        ], 503);
    }

    if (function_exists('mc4wp_get_api_v3')) {
        try {
            $api = mc4wp_get_api_v3();
            $api->add_list_member($list_id, $member);

            return galaxisok_newsletter_response([
                'ok' => true,
                'pending' => $double,
                'message' => $double
                    ? 'Köszönjük! Nézd meg a postaládádat, és erősítsd meg a feliratkozást.'
                    : 'Köszönjük, feliratkoztál a hírlevélre.',
            ], 200);
        } catch (Throwable $error) {
            $message = $error->getMessage();
            if (stripos($message, 'Member Exists') !== false || stripos($message, 'already a list member') !== false) {
                return galaxisok_newsletter_response([
                    'ok' => true,
                    'pending' => false,
                    'message' => 'Ez az e-mail-cím már fel van iratkozva.',
                ], 200);
            }

            return galaxisok_newsletter_response([
                'ok' => false,
                'message' => 'A feliratkozás nem sikerült. Próbáld újra később.',
            ], 502);
        }
    }

    $dc = galaxisok_newsletter_server_prefix($api_key);
    $subscriber_hash = md5(strtolower($email));
    $url = sprintf(
        'https://%s.api.mailchimp.com/3.0/lists/%s/members/%s',
        rawurlencode($dc),
        rawurlencode($list_id),
        rawurlencode($subscriber_hash)
    );

    $response = wp_remote_request($url, [
        'method' => 'PUT',
        'timeout' => 15,
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode('galaxisok:' . $api_key),
            'Content-Type' => 'application/json',
        ],
        'body' => wp_json_encode($member),
    ]);

    if (is_wp_error($response)) {
        return galaxisok_newsletter_response([
            'ok' => false,
            'message' => 'Nem sikerült elérni a Mailchimpet.',
        ], 502);
    }

    $code = (int) wp_remote_retrieve_response_code($response);
    if ($code >= 200 && $code < 300) {
        return galaxisok_newsletter_response([
            'ok' => true,
            'pending' => $double,
            'message' => $double
                ? 'Köszönjük! Nézd meg a postaládádat, és erősítsd meg a feliratkozást.'
                : 'Köszönjük, feliratkoztál a hírlevélre.',
        ], 200);
    }

    $body = json_decode((string) wp_remote_retrieve_body($response), true);
    $title = is_array($body) ? (string) ($body['title'] ?? '') : '';
    if ($code === 400 && stripos($title, 'Member Exists') !== false) {
        return galaxisok_newsletter_response([
            'ok' => true,
            'pending' => false,
            'message' => 'Ez az e-mail-cím már fel van iratkozva.',
        ], 200);
    }

    return galaxisok_newsletter_response([
        'ok' => false,
        'message' => 'A feliratkozás nem sikerült. Próbáld újra később.',
    ], 502);
}
