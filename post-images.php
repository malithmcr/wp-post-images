<?php
/*
Plugin Name: Awesome Post Images
Plugin URI: http://blog.malith.pro/wp-post-images-awesome-custom-image-uploader-for-wordpress-posts/
Description: Awesome image upload for Wordpress posts.
Author: Malith Priyashan
Author URI: http://malith.pro
Version: 1.0.0
Text Domain: post-image
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

//Exit if file called directly
if (!defined('ABSPATH')) {
    exit;
}

require_once( dirname( __FILE__ ) . '/includes/short-code.php' );

/**
 * Main plugin class.
 */
class PostImages
{
    /**
     * The single instance of this plugin.
     *
     *
     * @access private
     * @var    PostImages
     */
    private static $instance;
    /**
     * This plugin's version number. Used for busting caches.
     *
     * @var string
     */
    public $version = '1.0.0';

    /**
     * Creates a new instance of this class if one hasn't already been made
     * and then returns the single instance of this class.
     *
     * @return PostImages
     */
    public static function instance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new PostImages;
            self::$instance->setup();
        }

        return self::$instance;
    }

    /**
     * Register all of the needed hooks and actions.
     */
    public function setup()
    {
        add_action('save_post', array( $this, 'save_post_images' ));
        add_action('add_meta_boxes', array( $this, 'register_post_meta_box' ));
        add_action('admin_enqueue_scripts', array( $this, 'register_admin_script' ));
    }

    /**
     * Register image uploader in meta box.
     * register_post_meta_box
     */
    function register_post_meta_box()
    {
        add_meta_box('post_image_meta_box', 'Post Images',  array( $this, 'post_image_process' ));
    }

    /**
     * Insert all script files
     * register_admin_script
     */
    function register_admin_script()
    {
        if (is_admin()) {
            wp_enqueue_script('wp_img_upload', plugin_dir_url(__FILE__) . 'assets/js/post-images.js', array('jquery', 'media-upload'), '0.0.1', true);
            wp_enqueue_style( 'post-images', plugins_url( "assets/css/style.css", __FILE__ ), array(), '001' );
            wp_localize_script('wp_img_upload', 'customUploads', array('imageData' => get_post_meta(get_the_ID(), 'custom_image_data', true)));
        }
    }

    /**
     * Uploader Form
     * post_image_process
     */
    function post_image_process($post_id)
    {
        wp_nonce_field(basename(__FILE__), 'custom_image_nonce'); ?>

        <div id="metabox_wrapper">
            <div id="js-image-wrapper">

            </div>
            <input type="hidden" id="img-hidden-field" name="custom_image_data">
            <!-- Create dynamic hidden field and delete btn-->
            <input type="button" id="post-image-upload-button" class="button" value="Add Image">
            <input type="button" id="post-image-image-delete-button" class="button" onclick="postImages.deleteImages()" value="Delete Images">
        </div>

        <?php
    }

    /**
     * Process the form and save data in db.
     * save_post_images
     */
    function save_post_images($post_id)
    {
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST['custom_image_nonce']) && wp_verify_nonce($_POST['custom_image_nonce'], basename(__FILE__)));
        // Exits script depending on save status
        if ($is_autosave || $is_revision || !$is_valid_nonce) {
            return;
        }
        if (isset($_POST['custom_image_data'])) {
            $image_data = stripslashes_deep($_POST['custom_image_data'], true);

            update_post_meta($post_id, 'custom_image_data', $image_data);
        }
    }




}

/**
 * Returns the single instance of this plugin, creating one if needed.
 *
 * @return PostImages
 */
function post_images()
{
    return PostImages::instance();
}

/**
 * Initialize this plugin once all other plugins have finished loading.
 */
add_action('admin_init', 'post_images');
