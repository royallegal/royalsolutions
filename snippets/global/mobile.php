<?php
global $woocommerce;
$items  = $woocommerce->cart->get_cart_contents_count();
$user   = wp_get_current_user();
$first  = $user->user_firstname;
$logout = esc_url(wc_logout_url(wc_get_page_permalink('myaccount')));
?>

<ul class="side-nav" id="sidebar-nav">
    <li>
        <div class="user-view">
            <div class="background">
                <img src="https://royallegalsolutions.com/wp-content/uploads/2017/09/ocean-e1504626585316.jpg">
                <div class="overlay"></div>
            </div>
            <a id="sidebar-logo" href="/">
                <img src="https://royallegalsolutions.com/wp-content/uploads/2017/05/Layer-2-1.png">
            </a>
        </div>
    </li>

    <?php wp_nav_menu(array(
        "theme_location" => "main-mobile-nav",
        "menu_id" => "",
        "menu_class"=> "",
        'walker' => new Main_Mobile_Nav_Walker
    )) ?>

    <!--         
    <?php if (current_user_can('edit')) { ?>
        <li><a href="/quick-cart">
            <i class="material-icons left">shopping_cart</i>
            Cart (<span id="cart-count"><?php echo $items; ?></span>)
        </a></li>
    <?php } ?>

    <li id="sidebar-user-account" class="baseline flex">
        <?php if (is_user_logged_in()) { ?>
            <a id="username" href="/my-account">
                <i class="material-icons left">person</i>
                <?php
                if (!empty($first)) {
                    echo "Hi ".$first;
                } else {
                    echo "My Account";
                }
                ?>
            </a>
            <form id="logout" action="logout" method="post">
                <?php wp_nonce_field( 'ajax-logout-nonce', 'logoutSecurity' ); ?>
                <button type="submit" name="submit">(logout)</button>
            </form> 
        <?php } else { ?>
            <a id="login" class="modal-trigger" href="#loginModal">Log In</a>
        <?php } ?>
    </li> -->
</ul>
