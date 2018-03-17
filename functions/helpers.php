<?php
function get_featured_image() {
    $wpimg = has_post_thumbnail() ? get_the_post_thumbnail_url() : '';
    $cpimg = get_post_custom()['featured_image'] ? get_post_custom()['featured_image'] : '';

    if ($wpimg && $cpimg) {
        return array($wpimg, $cpimg);
    }
    else if ($wpimg) {
        return array($wpimg);
    }
    else if ($wpimg) {
        return array($cpimg);
    }
    else {
        return false;
    }
}


function get_featured_video() {
    $video = get_post_custom()['featured_video'];

    if ($video) {
        return $video;
    }
    else {
        return false;
    }
}


function get_responsive_image(
    $attachment_id, 
    $size = array('800', '600'), 
    $icon = "", 
    $attr = array( "class" => "img-responsive" ) ) {
    return wp_get_attachment_image( $attachment_id, $size, $icon, $attr); 
}
?>
