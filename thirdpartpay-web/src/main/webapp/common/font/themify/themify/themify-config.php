<?php
/***************************************************************************
 *
 *    ----------------------------------------------------------------------
 *                            DO NOT EDIT THIS FILE
 *    ----------------------------------------------------------------------
 *
 *                        Copyright (C) Themify
 *
 *    ----------------------------------------------------------------------
 *
 ***************************************************************************/


if (!defined('ABSPATH')) exit; // Exit if accessed directly

function themify_config_init()
{

    /* 	Global Vars
     ***************************************************************************/
    global $themify_config, $pagenow, $ThemifyConfig, $themify_gfonts;

    /*	Activate Theme
     ***************************************************************************/
    if (isset($_GET['activated']) && 'themes.php' == $pagenow) {
        themify_maybe_clear_legacy();
        add_action('init', 'themify_theme_first_run', 20);
    }


    /* 	Theme Config
     ***************************************************************************/
    define('THEMIFY_VERSION', '2.7.2');

    /*	Load Config from theme-config.php or custom-config.php
     ***************************************************************************/
    $themify_config = $ThemifyConfig->get_config();

    /* 	Google Fonts
     ***************************************************************************/
    $themify_gfonts = themify_get_google_font_lists();

    /* 	Run after update
     ***************************************************************************/
    if ('update_ok' === get_option('themify_update_ok_flag')) {
        /**
         * Fires after the updater finished the updating process.
         *
         * @since 1.8.3
         */
        do_action('themify_updater_post_install');
    }

    /* 	Woocommerce
     ***************************************************************************/
    if (themify_is_woocommerce_active()) {
        add_theme_support('woocommerce');
    }

    /**
     * Editor Style
     * @since 2.0.2
     */
    add_editor_style();
    add_theme_support('title-tag');

}

add_action('after_setup_theme', 'themify_config_init');

function themify_theme_first_run()
{
    flush_rewrite_rules();
    header('Location: ' . admin_url() . 'admin.php?page=themify&firsttime=true');
}

///////////////////////////////////////
// Load theme languages
///////////////////////////////////////

load_theme_textdomain('themify', THEME_DIR . '/languages');

/**
 * Load Filesystem Class
 * @since 2.5.8
 */
require_once(THEME_DIR . '/themify/class-themify-filesystem.php');

/**
 * Load Cache
 */
require_once(THEME_DIR . '/themify/class-themify-cache.php');

/**
 * Load Shortcodes
 * @since 1.1.3
 */
require_once(THEME_DIR . '/themify/themify-shortcodes.php');

/**
 * Load Page Builder
 * @since 1.1.3
 */
require_once(THEMIFY_DIR . '/themify-builder/themify-builder.php');

/**
 * Load Customizer
 * @since 1.8.2
 */
require_once THEMIFY_DIR . '/customizer/class-themify-customizer.php';

/**
 * Load Schema.org Microdata
 * @since 2.6.5
 */
require_once THEMIFY_DIR . '/themify-microdata.php';

/**
 * Enqueue framework CSS Stylesheets:
 * 1. themify-skin
 * 2. custom-style
 * 3. fontawesome - added 1.7.8
 *
 * @since 1.7.4
 */
add_action('wp_enqueue_scripts', 'themify_enqueue_framework_assets', 12);

/**
 * Output module styling and Custom CSS:
 * 1. module styling
 * 2. Custom CSS
 */
add_action('wp_head', 'themify_output_framework_styling');

/**
 * Themify - Insert settings page link in WP Admin Bar
 * @since 1.1.2
 */
add_action('wp_before_admin_bar_render', 'themify_admin_bar');

/**
 * Protected meta fields
 */
add_action('admin_init', 'themify_compile_protected_meta_list');
add_filter('is_protected_meta', 'themify_protected_meta', 10, 3);

/**
 * Menu Icons
 */
add_action('init', 'themify_setup_menu_icons');

/**
 * Sets the WP Featured Image size selected for Query Category pages
 */
add_action('template_redirect', 'themify_feature_size_page');

/**
 * Outputs html to display alert messages in post edit/new screens. Excludes pages.
 */
add_action('admin_notices', 'themify_prompt_message');

/**
 * Load Google fonts library
 */
add_action('wp_enqueue_scripts', 'themify_enqueue_gfonts');

/**
 * Removes height in video
 */
add_filter('wp_video_shortcode', 'themify_wp_video_shortcode', 10, 2);

/**
 * Add wmode transparent and post-video container for responsive purpose
 */
add_filter('embed_oembed_html', 'themify_parse_video_embed_vars', 10, 2);

/**
 * Add extra protocols like skype: to WordPress allowed protocols.
 */
add_filter('kses_allowed_protocols', 'themify_allow_extra_protocols');

/**
 * Trigger window resize event on JS
 */
add_action('wp_footer', 'themify_js_window_resize', 99999);

/**
 * Add "js" classname to html element when JavaScript is enabled
 */
add_action('wp_head', 'themify_html_js_class', 0);

/**
 * Checks if WPML is active and if so, sets the correct page number.
 */
if (class_exists('SitePress')) {
    add_action('pre_get_posts', 'themify_wpml_pagination_setup');
}

/**
 * Allows to query by category slug or id
 */
add_filter('themify_query_posts_page_args', 'themify_framework_query_posts_page_args');

/**
 * Set a default title for the front page
 */
add_filter('wp_title', 'themify_filter_wp_title', 10, 2);

/**
 * Filters the title. Removes the default separator.
 */
add_filter('wp_title', 'themify_wp_title', 10, 2);

/**
 * Add different CSS classes to body tag.
 */
add_filter('body_class', 'themify_body_classes');

/**
 * Adds classes to .post based on elements enabled for the currenty entry.
 */
add_filter('post_class', 'themify_post_class');

/**
 * Adds itemprop='image' microdata to avatar called by author box
 */
add_filter('get_avatar', 'themify_authorbox_microdata');

/**
 * Adds .svg and .svgz to list of mime file types supported by WordPress
 */
add_filter('upload_mimes', 'themify_upload_mime_types');

/**
 * Disable responsive design based on user choice.
 */
if ('on' == themify_get('setting-disable_responsive_design')) {
    add_action('init', 'themify_disable_responsive_design');
}

/**
 * Enable pinch to zoom on mobile.
 */
if (themify_get('setting-enable_mobile_zoom') == 'on') {
    add_action('init', 'themify_enable_mobile_zoom');
}

/////////////////////// WooCommerce Routines //////////////////////////

// Remove default WC wrappers
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);

// Remove default WC sidebar
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);

// Remove breadcrumb for later insertion within Themify wrapper
remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20);

// Add Themify wrappers
add_action('woocommerce_before_main_content', 'themify_before_shop_content', 20);
add_action('woocommerce_after_main_content', 'themify_after_shop_content', 20);

// Add Themify sidebar
add_action('themify_content_after', 'themify_wc_compatibility_sidebar', 10);

// Themify theme compatibility with Sensei plugin
add_action('after_setup_theme', 'themify_sensei_support');

// Set correct body class
add_filter('body_class', 'themify_wc_body_class', 99);

// Filter shop title and hide it according to user setting.
add_filter('woocommerce_show_page_title', 'themify_maybe_hide_shop_title');

/**
 * Add support for feeds on the site
 */
add_theme_support('automatic-feed-links');

/**
 * Load Themify Hooks
 * @since 1.2.2
 */
require_once(THEMIFY_DIR . '/themify-hooks.php');
require_once(THEMIFY_DIR . '/class-hook-contents.php');

/**
 * Load Themify Role Access Control
 * @since 2.6.2
 */
require_once(THEMIFY_DIR . '/class-themify-access-role.php');

/**
 * Add buttons to TinyMCE
 *******************************************************/
themify_wpeditor_add_shortcodes_button();

/**
 * Admin Only code follows
 ******************************************************/
if (is_admin()) {

    /**
     * Remove Themify themes from upgrade check
     * @since 1.1.8
     */
    add_filter('http_request_args', 'themify_hide_themes', 5, 2);

    /**
     * Initialize settings page and update permissions.
     * @since 2.1.8
     */
    add_action('init', 'themify_after_user_is_authenticated');

    /**
     * Enqueue jQuery and other scripts
     *******************************************************/
    add_action('admin_enqueue_scripts', 'themify_enqueue_scripts');

    /**
     * Display additional ID column in categories list
     * @since 1.1.8
     */
    add_filter('manage_edit-category_columns', 'themify_custom_category_header', 10, 2);
    add_filter('manage_category_custom_column', 'themify_custom_category', 10, 3);

    /**
     * Ajaxify admin
     *******************************************************/
    require_once(THEMIFY_DIR . '/themify-wpajax.php');
}

/**
 * In this hook current user is authenticated so we can check for capabilities.
 *
 * @since 2.1.8
 */
function themify_after_user_is_authenticated()
{
    if (current_user_can('manage_options')) {
        /**
         * Themify - Admin Menu
         *******************************************************/
        add_action('admin_menu', 'themify_admin_nav');

        /**
         * Themify Updater - In multisite, it's only available to super admins.
         **********************************************************************/
        if (themify_allow_update()) {
            require_once THEMIFY_DIR . '/themify-updater.php';
        }
    }
}

/**
 * Add Themify Settings link to admin bar
 * @since 1.1.2
 */
function themify_admin_bar()
{
    global $wp_admin_bar;
    if (!is_super_admin() || !is_admin_bar_showing())
        return;
    $wp_admin_bar->add_menu(array(
        'id' => 'themify-settings',
        'parent' => 'appearance',
        'title' => __('Themify Settings', 'themify'),
        'href' => admin_url('admin.php?page=themify')
    ));
}

/**
 * Clear legacy themify-ajax.php and strange files that might have been uploaded to or directories created in the uploads folder within the theme.
 * @since 1.6.3
 */
function themify_maybe_clear_legacy()
{
    if (!function_exists('WP_Filesystem')) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
    }

    WP_Filesystem();
    global $wp_filesystem;

    $flag = 'themify_clear_legacy';
    $clear = get_option($flag);
    if (!isset($clear) || !$clear) {
        $legacy = THEMIFY_DIR . '/themify-ajax.php';
        if ($exists = $wp_filesystem->exists($legacy)) {
            $wp_filesystem->delete($legacy);
        }
        $list = $wp_filesystem->dirlist(THEME_DIR . '/uploads/', true, true);
        if (is_array($list)) {
            foreach ($list as $item) {
                if ('d' == $item['type']) {
                    foreach ($item['files'] as $subitem) {
                        if ('d' == $subitem['type']) {
                            // There shouldn't be a directory here, let's delete it
                            $del_dir = THEME_DIR . '/uploads/' . $item['name'] . '/' . $subitem['name'];
                            $wp_filesystem->delete($del_dir, true);
                        } else {
                            $extension = pathinfo($subitem['name'], PATHINFO_EXTENSION);
                            if (!in_array($extension, array('jpg', 'gif', 'png', 'jpeg', 'bmp'))) {
                                $del_file = THEME_DIR . '/uploads/' . $item['name'] . '/' . $subitem['name'];
                                $wp_filesystem->delete($del_file);
                            }
                        }
                    }
                } else {
                    $extension = pathinfo($item['name'], PATHINFO_EXTENSION);
                    if (!in_array($extension, array('jpg', 'gif', 'png', 'jpeg', 'bmp'))) {
                        $del_file = THEME_DIR . '/uploads/' . $item['name'];
                        $wp_filesystem->delete($del_file);
                    }
                }
            }
        }
        update_option($flag, true);
    }
}

add_action('init', 'themify_maybe_clear_legacy', 9);

/**
 * Change setting name where theme settings are stored.
 * Runs after updater succeeded.
 * @since 1.7.6
 */
function themify_migrate_settings_name()
{
    $flag = 'themify_migrate_settings_name';
    $change = get_option($flag);
    if (!isset($change) || !$change) {
        if ($themify_data = get_option(wp_get_theme()->display('Name') . '_themify_data')) {
            themify_set_data($themify_data);
        }
        update_option($flag, true);
    }
}

add_action('after_setup_theme', 'themify_migrate_settings_name', 1);

/**
 * Function called after a successful update through WP Admin.
 * Code to run ONLY ONCE after update must be added here.
 *
 * @since 1.8.3
 */
function themify_theme_updater_post_install()
{
    // Delete option to reset styling behaviour
    delete_option('themify_has_styling_data');

    // Once all tasks have been executed, delete the flag.
    delete_option('themify_update_ok_flag');
}

add_action('themify_updater_post_install', 'themify_theme_updater_post_install');

/**
 * Load files to add the shortcode button to WP Editor
 *
 * @since 1.8.9
 */
function themify_wpeditor_add_shortcodes_button()
{
    require_once THEMIFY_DIR . '/tinymce/class-themify-tinymce.php';
    require_once THEMIFY_DIR . '/tinymce/dialog.php';
}

/**
 * Refresh permalinks to avoid 404 on custom post type fetching.
 * @since 1.9.3
 */
function themify_flush_rewrite_rules_after_manual_update()
{
    $flag = 'themify_flush_rewrite_rules_after_manual_update';
    $change = get_option($flag);
    if (!isset($change) || !$change) {
        flush_rewrite_rules();
        update_option($flag, true);
    }
}

add_action('init', 'themify_flush_rewrite_rules_after_manual_update', 99);
