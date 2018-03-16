<?php
/**
 * The Template for displaying product archives, including the main shop page which is a post type archive
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/archive-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.0.0
 */
if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly
}
global $woocommerce;
get_header('shop');
?>


<main id="store">
    <div class="container">
        <?php
        // Query shop items
        $products = get_posts(array(
            'post_type'      =>'product',
            'posts_per_page' => -1,
            'product_cat'    => 'service'
        ));

        // Shuffle item order
        $product_arr = (array)$products;
        shuffle($product_arr);
        $products = (object)$product_arr;

        // Loop through items
        foreach ($products as $product) {
            $cats = wp_get_post_terms($product->ID, 'product_cat', array('fields'=>'all'));
            $categories = "";
            foreach ($cats as $cat) {
                $categories = $categories." ".strtolower($cat->name);
            }
        ?>

        <div id="product-<?php $product->ID ?>" class="product <?php echo $categories; ?>">
            <a href="<?php echo get_permalink($product->ID); ?>">
                <div class="text valign-wrapper">
                    <h2 class="center-align">
                        <?php echo $product->post_title; ?>
                    </h2>
                    <p class="center-align">
                        Learn More
                    </p>
                </div>
            </a>
        </div>

        <?php } ?>
    </div>
</main>



<?php get_footer('shop'); ?>
