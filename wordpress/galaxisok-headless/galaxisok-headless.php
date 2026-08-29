<?php
/**
 * Plugin Name: Galaxisok Headless
 * Description: Koncertek, galéria, REST mezők, és a WP front átirányítása a galaxisok.hu-ra.
 * Version: 1.2.0
 * Author: Galaxisok
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('after_setup_theme', 'galaxisok_theme_supports');
add_action('init', 'galaxisok_register_types');
add_action('add_meta_boxes', 'galaxisok_register_metaboxes');
add_action('save_post_koncert', 'galaxisok_save_koncert_meta');
add_action('template_redirect', 'galaxisok_redirect_public_front');
add_action('admin_init', 'galaxisok_site_identity');
add_action('admin_init', 'galaxisok_discourage_indexing');
add_action('send_headers', 'galaxisok_noindex_headers');
add_filter('wp_robots', 'galaxisok_wp_robots');
add_filter('robots_txt', 'galaxisok_robots_txt', 999, 2);
add_filter('wpseo_robots', 'galaxisok_yoast_robots');
add_filter('wpseo_robots_array', 'galaxisok_yoast_robots_array');
add_filter('wp_sitemaps_enabled', '__return_false');
add_filter('wpseo_sitemap_index', '__return_false');
add_filter('wpseo_enable_xml_sitemap_transient_caching', '__return_false');

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

    foreach (['helyszin', 'idopont', 'jegy_url'] as $key) {
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
}

function galaxisok_render_koncert_metabox(WP_Post $post): void
{
    wp_nonce_field('galaxisok_koncert_meta', 'galaxisok_koncert_nonce');

    $helyszin = (string) get_post_meta($post->ID, 'helyszin', true);
    $idopont = (string) get_post_meta($post->ID, 'idopont', true);
    $jegy = (string) get_post_meta($post->ID, 'jegy_url', true);

    echo '<p><label for="galaxisok_helyszin"><strong>Helyszín</strong></label><br />';
    echo '<input type="text" class="widefat" id="galaxisok_helyszin" name="galaxisok_helyszin" value="' . esc_attr($helyszin) . '" placeholder="A38 Hajó, Budapest" /></p>';

    echo '<p><label for="galaxisok_idopont"><strong>Időpont</strong></label><br />';
    echo '<input type="datetime-local" class="widefat" id="galaxisok_idopont" name="galaxisok_idopont" value="' . esc_attr($idopont) . '" /></p>';

    echo '<p><label for="galaxisok_jegy_url"><strong>Jegyvásárlás link</strong></label><br />';
    echo '<input type="url" class="widefat" id="galaxisok_jegy_url" name="galaxisok_jegy_url" value="' . esc_attr($jegy) . '" placeholder="https://" /></p>';
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
    $idopont = isset($_POST['galaxisok_idopont']) ? sanitize_text_field(wp_unslash($_POST['galaxisok_idopont'])) : '';
    $jegy = isset($_POST['galaxisok_jegy_url']) ? esc_url_raw(wp_unslash($_POST['galaxisok_jegy_url'])) : '';

    update_post_meta($post_id, 'helyszin', $helyszin);
    update_post_meta($post_id, 'idopont', $idopont);
    update_post_meta($post_id, 'jegy_url', $jegy);
}

function galaxisok_redirect_public_front(): void
{
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    if (defined('REST_REQUEST') && REST_REQUEST) {
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
