<?php
    global $woocommerce;
    $items  = $woocommerce->cart->get_cart_contents_count();
?>
<?php if (current_user_can('edit_posts')) { ?>
    <li>
        <a href="/quick-cart">
            <i class="material-icons left">shopping_cart</i>
            Cart (<span id="cart-count"><?= $items; ?></span>)
        </a>
    </li>
<?php } ?>