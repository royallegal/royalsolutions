<?php
/**
 * The template for displaying product content in the single-product.php template
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-single-product.php.
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
 * @version     3.0.0
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
global $product;
$sku = $product->get_sku();
$color = get_post_meta($product->id, 'color', true);
?>


<?php
/**
 * woocommerce_before_single_product hook.
 *
 * @hooked wc_print_notices - 10
 */
do_action( 'woocommerce_before_single_product' );
if ( post_password_required() ) {
    echo get_the_password_form();
    return;
}
?>

<div id="product-<?php echo $sku; ?>" <?php post_class(); ?>>
    <?php
    /**
     * Hook: woocommerce_before_single_product_summary.
     *
     * @hooked woocommerce_show_product_sale_flash - 10
     * @hooked woocommerce_show_product_images - 20
     */
    do_action( 'woocommerce_before_single_product_summary' );
    ?>

    <div class="center-align panel <?php echo $color;?> gradient">
        <?php
        /**
	 * Hook: Woocommerce_single_product_summary.
	 *
	 * @hooked woocommerce_template_single_title - 5
	 * @hooked woocommerce_template_single_rating - 10
	 * @hooked woocommerce_template_single_price - 10
	 * @hooked woocommerce_template_single_excerpt - 20
	 * @hooked woocommerce_template_single_add_to_cart - 30
	 * @hooked woocommerce_template_single_meta - 40
	 * @hooked woocommerce_template_single_sharing - 50
	 * @hooked WC_Structured_Data::generate_product_data() - 60
	 */
        ?>
        <h1 class="product_title entry-title"><?= $product->get_title();?></h1>
        <a class="white to-blue ghost button" href="/contact-us">Get a Consultation</a>
    </div>

    <?php
    $description = do_shortcode($product->get_description());
    if ($description) : ?>
        <div class="container">
            <?php echo wpautop($description, $br); ?>
        </div>
    <?php endif; ?>

    <!-- Product Offerings -->
    <?php get_template_part('snippets/promotions/product-offerings'); ?>
</div>


<?php do_action( 'woocommerce_after_single_product' ); ?>
