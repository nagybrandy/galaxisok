<?php
/**
 * Plugin Name: Galaxisok Headless
 * Description: Koncertek, galéria, REST mezők, és a WP front átirányítása a galaxisok.hu-ra.
 * Version: 1.7.1
 * Author: Galaxisok
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/includes/newsletter.php';
require_once __DIR__ . '/includes/comment-reply-mail.php';

add_action('after_setup_theme', 'galaxisok_theme_supports');
add_action('init', 'galaxisok_register_types');
add_action('add_meta_boxes', 'galaxisok_register_metaboxes');
add_action('save_post_koncert', 'galaxisok_save_koncert_meta');
add_action('save_post_page', 'galaxisok_save_fohir_meta');
add_action('template_redirect', 'galaxisok_redirect_public_front');
add_action('admin_menu', 'galaxisok_register_site_menus');
add_action('admin_init', 'galaxisok_redirect_site_page_menus');
add_action('admin_init', 'galaxisok_save_fohir_screen');
add_action('admin_init', 'galaxisok_site_identity');
add_action('admin_init', 'galaxisok_discourage_indexing');
add_action('send_headers', 'galaxisok_noindex_headers');
add_filter('parent_file', 'galaxisok_parent_file');
add_filter('wp_robots', 'galaxisok_wp_robots');
add_filter('robots_txt', 'galaxisok_robots_txt', 999, 2);
add_filter('wpseo_robots', 'galaxisok_yoast_robots');
add_filter('wpseo_robots_array', 'galaxisok_yoast_robots_array');
// The Next.js site relays visitor comments without a WordPress login.
add_filter('rest_allow_anonymous_comments', '__return_true');
add_filter('wp_sitemaps_enabled', '__return_false');
add_filter('wpseo_sitemap_index', '__return_false');
add_filter('wpseo_enable_xml_sitemap_transient_caching', '__return_false');
add_action('init', 'galaxisok_schedule_comment_cleanup');
add_action('galaxisok_purge_old_comments', 'galaxisok_purge_old_comments');
add_action('init', 'galaxisok_comment_notification_settings');
add_filter('comment_moderation_recipients', 'galaxisok_comment_notification_recipients');
add_filter('comment_notification_recipients', 'galaxisok_comment_notification_recipients');
// REST creates go through wp_insert_comment(), which never fires comment_post,
// so WordPress would otherwise skip the moderation and author emails.
add_action('rest_after_insert_comment', 'galaxisok_notify_rest_comment', 10, 3);
// The Next.js site shows the approved comment count under each post title.
add_action('rest_api_init', 'galaxisok_register_comment_count_field');

function galaxisok_theme_supports(): void
{
    add_theme_support('post-thumbnails');
}

function galaxisok_register_types(): void
{
    register_post_type('koncert', [
        'labels' => [
            'name' => 'Koncertek',
            'singular_name' => 'Koncert',
            'add_new' => 'Új koncert',
            'add_new_item' => 'Új koncert felvitele',
            'edit_item' => 'Koncert szerkesztése',
            'view_item' => 'Koncert megtekintése',
            'search_items' => 'Koncertek keresése',
            'not_found' => 'Nincs koncert',
            'menu_name' => 'Koncertek',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'koncertek',
        'menu_icon' => 'dashicons-tickets-alt',
        'supports' => ['title', 'editor', 'excerpt', 'revisions', 'custom-fields'],
        'has_archive' => false,
        'rewrite' => ['slug' => 'koncert'],
    ]);

    register_post_type('galeria', [
        'labels' => [
            'name' => 'Galéria',
            'singular_name' => 'Kép',
            'add_new' => 'Új kép',
            'add_new_item' => 'Új kép a galériába',
            'edit_item' => 'Kép szerkesztése',
            'menu_name' => 'Galéria',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'galeria',
        'menu_icon' => 'dashicons-format-gallery',
        'supports' => ['title', 'thumbnail', 'excerpt'],
        'has_archive' => false,
    ]);

    foreach (['helyszin', 'varos', 'idopont', 'jegy_url', 'komment'] as $key) {
        register_post_meta('koncert', $key, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback' => static function () {
                return current_user_can('edit_posts');
            },
        ]);
    }

    register_post_meta('page', 'fohir_url', [
        'type' => 'string',
        'single' => true,
        'show_in_rest' => true,
        'sanitize_callback' => 'galaxisok_sanitize_fohir_url',
        'auth_callback' => static function () {
            return current_user_can('edit_pages');
        },
    ]);
}

function galaxisok_sanitize_fohir_url($value): string
{
    $url = trim((string) $value);
    if ($url === '') {
        return '';
    }

    if (isset($url[0]) && $url[0] === '/') {
        return '/' . ltrim(sanitize_text_field($url), '/');
    }

    return esc_url_raw($url);
}

function galaxisok_site_pages(): array
{
    return [
        'fohir' => [
            'title' => 'Főhír',
            'content' => '',
            'icon' => 'dashicons-format-status',
            'position' => 3,
        ],
        'rolunk' => [
            'title' => 'Rólunk',
            'content' => '<p>A <strong>Galaxisok</strong> magyar gitáros zenekar. <strong>Szabó Benedek</strong> dalai köré épül: éjszakai város, stadionfény, hosszú utak, és azok a mondatok, amik utána is bent maradnak.</p>',
            'icon' => 'dashicons-groups',
            'position' => 4,
        ],
        'kontakt' => [
            'title' => 'Kontakt',
            'content' => '<h2>Levél</h2><p><a href="mailto:bsidemusichu@gmail.com">bsidemusichu@gmail.com</a></p><h2>Booking</h2><p><a href="mailto:bsidemusichu@gmail.com">bsidemusichu@gmail.com</a></p><h2>Telefon</h2><p><a href="tel:+36306235677">+36 30 623 5677</a></p>',
            'icon' => 'dashicons-email-alt',
            'position' => 5,
        ],
    ];
}

function galaxisok_ensure_site_page(string $slug): int
{
    $pages = galaxisok_site_pages();
    $spec = $pages[$slug] ?? null;
    if ($spec === null) {
        return 0;
    }

    $existing = get_posts([
        'name' => $slug,
        'post_type' => 'page',
        'post_status' => ['publish', 'draft', 'private'],
        'numberposts' => 1,
    ]);
    if ($existing) {
        return (int) $existing[0]->ID;
    }

    $id = wp_insert_post([
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_name' => $slug,
        'post_title' => $spec['title'],
        'post_content' => $spec['content'],
    ], true);

    return is_wp_error($id) ? 0 : (int) $id;
}

function galaxisok_register_site_menus(): void
{
    if (!current_user_can('edit_pages')) {
        return;
    }

    add_menu_page(
        'Főhír',
        'Főhír',
        'edit_pages',
        'galaxisok-fohir',
        'galaxisok_render_fohir_screen',
        'dashicons-format-status',
        3
    );

    add_menu_page(
        'Rólunk',
        'Rólunk',
        'edit_pages',
        'galaxisok-rolunk',
        '__return_null',
        'dashicons-groups',
        4
    );

    add_menu_page(
        'Kontakt',
        'Kontakt',
        'edit_pages',
        'galaxisok-kontakt',
        '__return_null',
        'dashicons-email-alt',
        5
    );
}

function galaxisok_redirect_site_page_menus(): void
{
    if (!is_admin() || !isset($_GET['page'])) {
        return;
    }

    $map = [
        'galaxisok-rolunk' => 'rolunk',
        'galaxisok-kontakt' => 'kontakt',
    ];
    $slug = $map[sanitize_key((string) $_GET['page'])] ?? '';
    if ($slug === '' || !current_user_can('edit_pages')) {
        return;
    }

    $id = galaxisok_ensure_site_page($slug);
    if ($id < 1) {
        return;
    }

    wp_safe_redirect(admin_url('post.php?post=' . $id . '&action=edit'));
    exit;
}

function galaxisok_parent_file(string $parent): string
{
    $post_id = isset($_GET['post']) ? (int) $_GET['post'] : 0;
    if ($post_id < 1) {
        return $parent;
    }

    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'page') {
        return $parent;
    }

    if ($post->post_name === 'rolunk') {
        return 'galaxisok-rolunk';
    }

    if ($post->post_name === 'kontakt') {
        return 'galaxisok-kontakt';
    }

    if ($post->post_name === 'fohir') {
        return 'galaxisok-fohir';
    }

    return $parent;
}

function galaxisok_render_fohir_screen(): void
{
    if (!current_user_can('edit_pages')) {
        wp_die(esc_html__('Nincs jogosultságod ehhez.', 'galaxisok'));
    }

    $id = galaxisok_ensure_site_page('fohir');
    $post = $id ? get_post($id) : null;
    $text = $post ? wp_strip_all_tags((string) $post->post_content) : '';
    $url = $id ? (string) get_post_meta($id, 'fohir_url', true) : '';
    $saved = isset($_GET['updated']);

    echo '<div class="wrap">';
    echo '<h1>Főhír</h1>';
    if ($saved) {
        echo '<div class="notice notice-success is-dismissible"><p>Elmentve. A főoldali fotón ez jelenik meg.</p></div>';
    }
    echo '<p>Ez a szöveg a főoldali fotóra kerül, a Play gomb fölé. A gomb a megadott linkre visz. Ha a feliratot és a linket üresen mented, a főoldalon nem jelenik meg főhír.</p>';
    echo '<form method="post">';
    wp_nonce_field('galaxisok_fohir_screen', 'galaxisok_fohir_screen_nonce');
    echo '<table class="form-table" role="presentation"><tbody>';
    echo '<tr><th scope="row"><label for="galaxisok_fohir_text">Felirat</label></th><td>';
    echo '<textarea class="large-text" rows="5" id="galaxisok_fohir_text" name="galaxisok_fohir_text" placeholder="Új évad, új dalok. A nyár után újra stúdióba mentünk.">' . esc_textarea($text) . '</textarea>';
    echo '<p class="description">Két-három mondat elég. Üresen hagyva nincs főhír a címlapon.</p></td></tr>';
    echo '<tr><th scope="row"><label for="galaxisok_fohir_url">Play gomb linkje</label></th><td>';
    echo '<input type="text" class="regular-text" id="galaxisok_fohir_url" name="galaxisok_fohir_url" value="' . esc_attr($url) . '" placeholder="/blog/uj-evad vagy https://…" />';
    echo '<p class="description">Belső oldal: <code>/blog/cikk-slug</code> vagy <code>/koncertek</code>. Külső: teljes https:// cím.</p></td></tr>';
    echo '</tbody></table>';
    submit_button('Mentés');
    echo '</form></div>';
}

function galaxisok_save_fohir_screen(): void
{
    if (!is_admin() || !isset($_POST['galaxisok_fohir_screen_nonce'])) {
        return;
    }

    if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['galaxisok_fohir_screen_nonce'])), 'galaxisok_fohir_screen')) {
        return;
    }

    if (!current_user_can('edit_pages')) {
        return;
    }

    $id = galaxisok_ensure_site_page('fohir');
    if ($id < 1) {
        return;
    }

    $text = isset($_POST['galaxisok_fohir_text']) ? sanitize_textarea_field(wp_unslash($_POST['galaxisok_fohir_text'])) : '';
    $url = isset($_POST['galaxisok_fohir_url']) ? galaxisok_sanitize_fohir_url(wp_unslash($_POST['galaxisok_fohir_url'])) : '';

    wp_update_post([
        'ID' => $id,
        'post_status' => 'publish',
        'post_content' => $text,
    ]);
    update_post_meta($id, 'fohir_url', $url);

    wp_safe_redirect(add_query_arg('updated', '1', admin_url('admin.php?page=galaxisok-fohir')));
    exit;
}

function galaxisok_register_metaboxes(): void
{
    add_meta_box(
        'galaxisok_koncert_meta',
        'Koncert adatai',
        'galaxisok_render_koncert_metabox',
        'koncert',
        'normal',
        'high'
    );

    $editing = isset($_GET['post']) ? get_post((int) $_GET['post']) : null;
    if ($editing && $editing->post_name === 'fohir') {
        add_meta_box(
            'galaxisok_fohir_meta',
            'Play gomb',
            'galaxisok_render_fohir_metabox',
            'page',
            'side',
            'high'
        );
    }
}

function galaxisok_render_koncert_metabox(WP_Post $post): void
{
    wp_nonce_field('galaxisok_koncert_meta', 'galaxisok_koncert_nonce');

    $helyszin = (string) get_post_meta($post->ID, 'helyszin', true);
    $varos = (string) get_post_meta($post->ID, 'varos', true);
    $idopont = (string) get_post_meta($post->ID, 'idopont', true);
    $jegy = (string) get_post_meta($post->ID, 'jegy_url', true);
    $komment = (string) get_post_meta($post->ID, 'komment', true);

    echo '<p><label for="galaxisok_helyszin"><strong>Helyszín</strong></label><br />';
    echo '<input type="text" class="widefat" id="galaxisok_helyszin" name="galaxisok_helyszin" value="' . esc_attr($helyszin) . '" placeholder="A38 Hajó" /></p>';

    echo '<p><label for="galaxisok_varos"><strong>Város</strong></label><br />';
    echo '<input type="text" class="widefat" id="galaxisok_varos" name="galaxisok_varos" value="' . esc_attr($varos) . '" placeholder="Budapest" /></p>';

    echo '<p><label for="galaxisok_idopont"><strong>Időpont</strong></label><br />';
    echo '<input type="datetime-local" class="widefat" id="galaxisok_idopont" name="galaxisok_idopont" value="' . esc_attr($idopont) . '" /></p>';

    echo '<p><label for="galaxisok_jegy_url"><strong>Jegyvásárlás link</strong></label><br />';
    echo '<input type="url" class="widefat" id="galaxisok_jegy_url" name="galaxisok_jegy_url" value="' . esc_attr($jegy) . '" placeholder="https://" /></p>';

    echo '<p><label for="galaxisok_komment"><strong>Komment</strong> <span style="font-weight:400;color:#646970;">(opcionális)</span></label><br />';
    echo '<textarea class="widefat" rows="2" id="galaxisok_komment" name="galaxisok_komment" placeholder="Support, fesztivál, nyitóest…">' . esc_textarea($komment) . '</textarea></p>';
}

function galaxisok_render_fohir_metabox(WP_Post $post): void
{
    if ($post->post_name !== 'fohir') {
        echo '<p>A főoldali feliratot a <a href="' . esc_url(admin_url('admin.php?page=galaxisok-fohir')) . '">Főhír</a> menüpontban lehet szerkeszteni.</p>';
        return;
    }

    wp_nonce_field('galaxisok_fohir_meta', 'galaxisok_fohir_nonce');
    $url = (string) get_post_meta($post->ID, 'fohir_url', true);
    echo '<p><label for="galaxisok_fohir_url_meta"><strong>Play gomb linkje</strong></label></p>';
    echo '<p><input type="text" class="widefat" id="galaxisok_fohir_url_meta" name="galaxisok_fohir_url" value="' . esc_attr($url) . '" placeholder="/blog/cikk-slug" /></p>';
}

function galaxisok_save_koncert_meta(int $post_id): void
{
    if (!isset($_POST['galaxisok_koncert_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['galaxisok_koncert_nonce'])), 'galaxisok_koncert_meta')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $helyszin = isset($_POST['galaxisok_helyszin']) ? sanitize_text_field(wp_unslash($_POST['galaxisok_helyszin'])) : '';
    $varos = isset($_POST['galaxisok_varos']) ? sanitize_text_field(wp_unslash($_POST['galaxisok_varos'])) : '';
    $idopont = isset($_POST['galaxisok_idopont']) ? sanitize_text_field(wp_unslash($_POST['galaxisok_idopont'])) : '';
    $jegy = isset($_POST['galaxisok_jegy_url']) ? esc_url_raw(wp_unslash($_POST['galaxisok_jegy_url'])) : '';
    $komment = isset($_POST['galaxisok_komment']) ? sanitize_textarea_field(wp_unslash($_POST['galaxisok_komment'])) : '';

    update_post_meta($post_id, 'helyszin', $helyszin);
    update_post_meta($post_id, 'varos', $varos);
    update_post_meta($post_id, 'idopont', $idopont);
    update_post_meta($post_id, 'jegy_url', $jegy);
    update_post_meta($post_id, 'komment', $komment);
}

function galaxisok_save_fohir_meta(int $post_id): void
{
    if (!isset($_POST['galaxisok_fohir_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['galaxisok_fohir_nonce'])), 'galaxisok_fohir_meta')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $post = get_post($post_id);
    if (!$post || $post->post_name !== 'fohir') {
        return;
    }

    $url = isset($_POST['galaxisok_fohir_url']) ? galaxisok_sanitize_fohir_url(wp_unslash($_POST['galaxisok_fohir_url'])) : '';
    update_post_meta($post_id, 'fohir_url', $url);
}

function galaxisok_redirect_public_front(): void
{
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    if (defined('REST_REQUEST') && REST_REQUEST) {
        return;
    }

    if (isset($_GET['galaxisok_comment_unsubscribe'])) {
        return;
    }

    wp_redirect('https://galaxisok.hu', 302);
    exit;
}

function galaxisok_site_identity(): void
{
    if (get_option('blogname') !== 'Galaxisok') {
        update_option('blogname', 'Galaxisok');
    }

    if (get_option('blogdescription') === 'Just another WordPress site') {
        update_option('blogdescription', 'A Galaxisok hivatalos oldala.');
    }
}

function galaxisok_discourage_indexing(): void
{
    if ((string) get_option('blog_public') !== '0') {
        update_option('blog_public', '0');
    }

    $yoast = get_option('wpseo', []);
    if (is_array($yoast) && !empty($yoast['enable_xml_sitemap'])) {
        $yoast['enable_xml_sitemap'] = false;
        $yoast['enable_index_now'] = false;
        update_option('wpseo', $yoast);
    }
}

function galaxisok_noindex_headers(): void
{
    if (headers_sent()) {
        return;
    }

    header('X-Robots-Tag: noindex, nofollow, noarchive', true);
}

function galaxisok_wp_robots(array $robots): array
{
    $robots['noindex'] = true;
    $robots['nofollow'] = true;
    $robots['noarchive'] = true;
    unset($robots['index'], $robots['follow']);
    return $robots;
}

function galaxisok_robots_txt(string $output, bool $public): string
{
    unset($output, $public);
    return "User-agent: *\nDisallow: /\n";
}

function galaxisok_yoast_robots(): string
{
    return 'noindex, nofollow, noarchive';
}

function galaxisok_yoast_robots_array(array $robots): array
{
    return [
        'index' => 'noindex',
        'follow' => 'nofollow',
    ];
}

function galaxisok_comment_notification_settings(): void
{
    if ((string) get_option('comments_notify') !== '1') {
        update_option('comments_notify', '1');
    }

    if ((string) get_option('moderation_notify') !== '1') {
        update_option('moderation_notify', '1');
    }
}

function galaxisok_comment_notification_recipients(array $emails): array
{
    $emails[] = 'szabo.benedek.mail@gmail.com';
    $emails = array_filter($emails, static function ($email): bool {
        return is_string($email) && is_email($email);
    });

    return array_values(array_unique($emails));
}

function galaxisok_notify_rest_comment(WP_Comment $comment, WP_REST_Request $request, bool $creating): void
{
    if (!$creating) {
        return;
    }

    $comment_id = (int) $comment->comment_ID;
    if ($comment_id < 1) {
        return;
    }

    // Send in this request. Deferring until after fastcgi_finish_request()
    // dropped the mail on this host, so nobody was notified.
    if (function_exists('wp_new_comment_notify_moderator')) {
        wp_new_comment_notify_moderator($comment_id);
    }

    if (function_exists('wp_new_comment_notify_postauthor')) {
        wp_new_comment_notify_postauthor($comment_id);
    }
}

function galaxisok_schedule_comment_cleanup(): void
{
    if (wp_next_scheduled('galaxisok_purge_old_comments')) {
        return;
    }

    wp_schedule_event(time() + DAY_IN_SECONDS, 'daily', 'galaxisok_purge_old_comments');
}

function galaxisok_purge_old_comments(): void
{
    $cutoff = gmdate('Y-m-d H:i:s', time() - (30 * DAY_IN_SECONDS));

    foreach (['hold', 'spam'] as $status) {
        $comments = get_comments([
            'status' => $status,
            'number' => 200,
            'date_query' => [
                [
                    'column' => 'comment_date_gmt',
                    'before' => $cutoff,
                    'inclusive' => true,
                ],
            ],
        ]);

        foreach ($comments as $comment) {
            wp_delete_comment((int) $comment->comment_ID, true);
        }
    }
}

function galaxisok_register_comment_count_field(): void
{
    register_rest_field('post', 'comment_count', [
        'get_callback' => static function (array $post): int {
            return (int) get_comments_number((int) $post['id']);
        },
        'schema' => [
            'description' => 'Approved comment count.',
            'type' => 'integer',
            'context' => ['view', 'embed'],
            'readonly' => true,
        ],
    ]);
}
