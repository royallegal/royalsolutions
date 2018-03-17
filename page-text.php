<?php
/* Template Name: Test */
get_header();
?>


<main id="test" class="row">
    <?php
    /**
     * Payment methods
     *
     * Shows customer payment methods on the account page.
     *
     * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/payment-methods.php.
     *
     * HOWEVER, on occasion WooCommerce will need to update template files and you
     * (the theme developer) will need to copy the new files to your theme to
     * maintain compatibility. We try to do this as little as possible, but it does
     * happen. When this occurs the version of the template file will be bumped and
     * the readme will list any important changes.
     *
     * @see 	https://docs.woocommerce.com/document/template-structure/
     * @author  WooThemes
     * @package WooCommerce/Templates
     * @version 2.6.0
     */
    if ( ! defined( 'ABSPATH' ) ) {
	exit;
    }

    $saved_methods = wc_get_customer_saved_methods_list( get_current_user_id() );
    $has_methods   = (bool) $saved_methods;
    $types         = wc_get_account_payment_methods_types();
    do_action( 'woocommerce_before_account_payment_methods', $has_methods ); ?>

        <?php
        foreach ($saved_methods as $type=>$methods) {
            foreach ($methods as $method) {
                echo '<p>'.$method['method']['brand'].' ending in '.$method['method']['last4'].'</p>';
            }
        }
        ?>
</main>


<?php get_footer(); ?>
