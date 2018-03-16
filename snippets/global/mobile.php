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

    <li class="no-padding">
        <ul class="collapsible collapsible-accordion">
            <li>
                <a class="collapsible-header">
                    LLCs
                    <i class="material-icons right">arrow_drop_down</i>
                </a>
                <div class="collapsible-body">
                    <ul>
                        <li><a href="/product/series-llc">Series LLC</a></li>
                        <li><a href="/product/traditional-llc">Traditional</a></li>
                        <li><a href="/product/ira-owned-llc">IRA Owned</a></li>
                        <li><a href="/product/assignment-of-interest">Assignment of Interest</a></li>
                    </ul>
                </div>
            </li>
        </ul>
    </li>

    <li class="no-padding">
        <ul class="collapsible collapsible-accordion">
            <li>
                <a class="collapsible-header">
                    Trusts
                    <i class="material-icons right">arrow_drop_down</i>
                </a>
                <div class="collapsible-body">
                    <ul>
                        <li><a href="/product/delaware-statutory-trust/">Delaware Statutory</a></li>
                        <li><a href="/product/anonymous-land-trust">Anonymous Land</a></li>
                        <li><a href="/product/ira-owned-trust">IRA Owned</a></li>
                    </ul>
                </div>
            </li>
        </ul>
    </li>

    <li class="no-padding">
        <ul class="collapsible collapsible-accordion">
            <li>
                <a class="collapsible-header">
                    Agreements
                    <i class="material-icons right">arrow_drop_down</i>
                </a>
                <div class="collapsible-body">
                    <ul>
                        <li><a href="/product/limited-partnership">Limited Partnership</a></li>
                        <li><a href="/product/joint-venture">Joint Venture</a></li>
                        <li><a href="/product/property-transfer">Property Transfer</a></li>
                    </ul>
                </div>
            </li>
        </ul>
    </li>

    <li class="no-padding">
        <ul class="collapsible collapsible-accordion">
            <li>
                <a class="collapsible-header">
                    Strategy
                    <i class="material-icons right">arrow_drop_down</i>
                </a>
                <div class="collapsible-body">
                    <ul>
                        <li><a href="/product/family-office">Family Office</a></li>
                        <li><a href="/product/estate-planning">Estate Planning</a></li>
                        <li><a href="/product/hourly-consulting">Hourly Consulting</a></li>
                    </ul>
                </div>
            </li>
        </ul>
    </li>

    <!-- <li><a href="/members/webinar">
         <i class="material-icons left">videocam</i> Webinar
         </a></li> -->
    <li><a href="/blog">
        <i class="material-icons left">bookmark</i>
        Blog
    </a></li>
    <li><a href="/contact-us">
        <i class="material-icons left">email</i>
        Contact Us
    </a></li>
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
    </li>
</ul>
