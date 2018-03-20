<?php
global $woocommerce;
$items  = $woocommerce->cart->get_cart_contents_count();
?>

<div class="navbar-fixed">
    <nav>
        <div class="nav-wrapper">
            <a class="logo-group" href="/">
                <div id="rls-logo"></div>
                <div id="rls-title">Royal Legal Solutions</div>
            </a>
            <a id="mobile-menu"
               href="#"
               data-activates="sidebar-nav"
               class="button-collapse">
                <i class="material-icons">menu</i>
            </a>

            <!-- Left Menu -->
            <?php wp_nav_menu(array(
                "theme_location" => "main-nav",
                "menu_id" => "nav-left",
                "menu_class"=> "float-left hide-on-med-and-down",
                'walker' => new Main_Nav_Walker
            )) ?>

            <!-- Right Menu -->
            <?php
            $user   = wp_get_current_user();
            $first  = $user->user_firstname;
            $logout = esc_url(wc_logout_url(wc_get_page_permalink('myaccount')));
            ?>
            <ul id="nav-right" class="float-right hide-on-med-and-down">
                <?php if (current_user_can('edit_posts')) { ?>
                    <li><a href="/quick-cart">
                        <i class="material-icons left">shopping_cart</i>
                        Cart (<span id="cart-count"><?php echo $items; ?></span>)
                    </a></li>
                <?php } ?>
                <li id="user-account">
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
                </li>
                <li><a id="consultation" class="blue to-blue ghost button" href="/consulting/consultation/">Consultation</a></li>
            </ul>
        </div>
    </nav>
</div>
