<?php
/**
 * Email the parent comment's author when a reply is approved.
 * The address can opt out from the link at the bottom of the message.
 */

if (!defined('ABSPATH')) {
    exit;
}

const GALAXISOK_REPLY_OPTOUT_OPTION = 'galaxisok_reply_notice_optout';

add_action('init', 'galaxisok_handle_reply_unsubscribe', 0);
add_action('wp_insert_comment', 'galaxisok_notify_reply_on_insert', 20, 2);
add_action('transition_comment_status', 'galaxisok_notify_reply_on_status', 20, 3);

function galaxisok_notify_reply_on_insert(int $comment_id, $comment): void
{
    unset($comment);
    galaxisok_send_reply_notification($comment_id);
}

function galaxisok_notify_reply_on_status(string $new_status, string $old_status, $comment): void
{
    if ($new_status !== 'approved' || $old_status === 'approved') {
        return;
    }

    $comment_id = $comment instanceof WP_Comment ? (int) $comment->comment_ID : (int) $comment;
    galaxisok_send_reply_notification($comment_id);
}

function galaxisok_send_reply_notification(int $comment_id): void
{
    static $handled = [];

    if ($comment_id < 1 || isset($handled[$comment_id])) {
        return;
    }

    $comment = get_comment($comment_id);
    if (!$comment instanceof WP_Comment || (string) $comment->comment_approved !== '1') {
        return;
    }

    if ((int) $comment->comment_parent < 1 || !in_array($comment->comment_type, ['', 'comment'], true)) {
        return;
    }

    if (get_comment_meta($comment_id, '_galaxisok_reply_notified', true)) {
        return;
    }

    $parent = get_comment((int) $comment->comment_parent);
    if (!$parent instanceof WP_Comment) {
        return;
    }

    $email = strtolower(trim((string) $parent->comment_author_email));
    $reply_email = strtolower(trim((string) $comment->comment_author_email));
    if ($email === '' || !is_email($email) || $email === $reply_email || galaxisok_reply_is_opted_out($email)) {
        update_comment_meta($comment_id, '_galaxisok_reply_notified', '1');
        return;
    }

    $handled[$comment_id] = true;
    update_comment_meta($comment_id, '_galaxisok_reply_notified', '1');

    $sent = wp_mail(
        $email,
        '[Galaxisok] Válaszoltak a hozzászólásodra',
        galaxisok_reply_notification_body($parent, $comment),
        ['Content-Type: text/plain; charset=UTF-8']
    );

    if (!$sent) {
        delete_comment_meta($comment_id, '_galaxisok_reply_notified');
        unset($handled[$comment_id]);
        error_log('Galaxisok reply notice failed for comment ' . $comment_id);
    }
}

function galaxisok_reply_notification_body(WP_Comment $parent, WP_Comment $reply): string
{
    $post = get_post((int) $reply->comment_post_ID);
    $title = $post ? galaxisok_reply_plain_text(get_the_title($post)) : 'Galaxisok';
    $slug = $post ? (string) $post->post_name : '';
    $url = $slug !== '' ? 'https://galaxisok.hu/blog/' . rawurlencode($slug) : 'https://galaxisok.hu/blog';
    $reply_author = galaxisok_reply_plain_text((string) $reply->comment_author);
    if ($reply_author === '') {
        $reply_author = 'Valaki';
    }

    $lines = [
        'Szia!',
        '',
        'Valaki válaszolt a hozzászólásodra a Galaxisok oldalán.',
        '',
        'Bejegyzés: ' . $title,
        $url,
        '',
        'A te hozzászólásod:',
        galaxisok_reply_plain_text((string) $parent->comment_content),
        '',
        $reply_author . ' ezt írta:',
        galaxisok_reply_plain_text((string) $reply->comment_content),
        '',
        '—',
        'Nem szeretnél több ilyen e-mailt kapni? Kattints ide:',
        galaxisok_reply_unsubscribe_url((string) $parent->comment_author_email),
    ];

    return implode("\n", $lines) . "\n";
}

function galaxisok_reply_plain_text(string $value): string
{
    $value = wp_specialchars_decode(wp_strip_all_tags($value), ENT_QUOTES);
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = trim($value);
    if (mb_strlen($value) > 1000) {
        $value = mb_substr($value, 0, 1000) . '…';
    }

    return $value;
}

function galaxisok_reply_unsubscribe_url(string $email): string
{
    return add_query_arg(
        'galaxisok_comment_unsubscribe',
        galaxisok_reply_unsubscribe_token($email),
        home_url('/')
    );
}

function galaxisok_reply_unsubscribe_token(string $email): string
{
    $email = strtolower(trim($email));
    $payload = rtrim(strtr(base64_encode($email), '+/', '-_'), '=');

    return $payload . '.' . hash_hmac('sha256', $email, wp_salt('auth'));
}

function galaxisok_reply_email_from_token(string $token): string
{
    $parts = explode('.', $token, 2);
    if (count($parts) !== 2 || $parts[0] === '' || $parts[1] === '') {
        return '';
    }

    $encoded = strtr($parts[0], '-_', '+/');
    $pad = strlen($encoded) % 4;
    if ($pad !== 0) {
        $encoded .= str_repeat('=', 4 - $pad);
    }

    $email = base64_decode($encoded, true);
    if (!is_string($email)) {
        return '';
    }

    $email = strtolower(trim($email));
    if ($email === '' || strlen($email) > 100 || !is_email($email)) {
        return '';
    }

    $expected = hash_hmac('sha256', $email, wp_salt('auth'));
    if (!hash_equals($expected, $parts[1])) {
        return '';
    }

    return $email;
}

function galaxisok_reply_optout_hashes(): array
{
    $stored = get_option(GALAXISOK_REPLY_OPTOUT_OPTION, []);
    if (!is_array($stored)) {
        return [];
    }

    return array_values(array_filter($stored, 'is_string'));
}

function galaxisok_reply_is_opted_out(string $email): bool
{
    $hash = hash('sha256', strtolower(trim($email)));

    return in_array($hash, galaxisok_reply_optout_hashes(), true);
}

function galaxisok_reply_optout_add(string $email): void
{
    $hash = hash('sha256', strtolower(trim($email)));
    $hashes = galaxisok_reply_optout_hashes();
    if (in_array($hash, $hashes, true)) {
        return;
    }

    $hashes[] = $hash;
    update_option(GALAXISOK_REPLY_OPTOUT_OPTION, $hashes, false);
}

function galaxisok_reply_optout_remove(string $email): void
{
    $hash = hash('sha256', strtolower(trim($email)));
    $hashes = array_values(array_filter(
        galaxisok_reply_optout_hashes(),
        static function (string $stored) use ($hash): bool {
            return $stored !== $hash;
        }
    ));
    update_option(GALAXISOK_REPLY_OPTOUT_OPTION, $hashes, false);
}

function galaxisok_handle_reply_unsubscribe(): void
{
    $from_post = isset($_POST['galaxisok_comment_unsubscribe']);
    if (!$from_post && !isset($_GET['galaxisok_comment_unsubscribe'])) {
        return;
    }

    $raw = $from_post ? $_POST['galaxisok_comment_unsubscribe'] : $_GET['galaxisok_comment_unsubscribe'];
    $token = is_string($raw) ? rawurldecode(wp_unslash($raw)) : '';
    $email = galaxisok_reply_email_from_token($token);
    $confirmed = false;

    if ($email !== '' && $from_post) {
        galaxisok_reply_optout_add($email);
        $confirmed = true;
    }

    nocache_headers();
    status_header(200);
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Robots-Tag: noindex, nofollow');
    echo galaxisok_reply_unsubscribe_page($email, $token, $confirmed);
    exit;
}

function galaxisok_reply_unsubscribe_page(string $email, string $token, bool $confirmed): string
{
    $title = 'Válasz-értesítők';
    if ($email === '') {
        $body = '<p>Ez a leiratkozó link érvénytelen.</p>';
    } elseif ($confirmed || galaxisok_reply_is_opted_out($email)) {
        $title = 'Leiratkoztál';
        $body = '<p>Rendben. A <strong>' . esc_html($email) . '</strong> címre nem küldünk több értesítőt, ha valaki válaszol a hozzászólásodra.</p>';
    } else {
        $body = '<p>A <strong>' . esc_html($email) . '</strong> címre eddig levelet küldtünk, ha valaki válaszolt a hozzászólásodra.</p>';
        $body .= '<form method="post" action="' . esc_url(home_url('/')) . '">';
        $body .= '<input type="hidden" name="galaxisok_comment_unsubscribe" value="' . esc_attr($token) . '" />';
        $body .= '<button type="submit">Nem kérek több ilyen e-mailt</button>';
        $body .= '</form>';
    }

    $body .= '<p><a href="https://galaxisok.hu">Vissza a galaxisok.hu-ra</a></p>';

    return '<!DOCTYPE html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>'
        . esc_html($title)
        . '</title><style>body{margin:0;font-family:Georgia,serif;background:#f6f1e8;color:#1c140c}main{max-width:34rem;margin:0 auto;padding:3rem 1.25rem}h1{font-size:1.8rem;font-weight:500}button{font:inherit;background:#1c140c;color:#f6f1e8;border:0;padding:.8rem 1.1rem;cursor:pointer}a{color:#1c140c}</style></head><body><main><h1>'
        . esc_html($title)
        . '</h1>'
        . $body
        . '</main></body></html>';
}
