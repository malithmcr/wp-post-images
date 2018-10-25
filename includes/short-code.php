<?php
/**
 * Created by PhpStorm.
 * User: malithmcr
 * Date: 25.10.18
 * Time: 21:56
 */


function get_post_images_data() {
    return get_post_meta( get_the_ID(), 'custom_image_data', true);
}

function post_images_shortcode( $atts ){
    $postImages = json_decode(get_post_images_data(), true);
    if(empty($postImages)) {
        return false;
    }
    foreach ($postImages as $image) {
        echo '<img src="' . $image['url'] . '"/>';
    }

}
add_shortcode( 'postimages', 'post_images_shortcode' );