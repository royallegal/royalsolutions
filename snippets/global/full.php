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
            <ul id="nav-left" class="float-left hide-on-med-and-down">
                <li><a class="dropdown-button"
                       href="#"
                       data-activates="services"
                       data-constrainwidth="false">
                    Services
                    <i class="small material-icons right">arrow_drop_down</i>
                </a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact-us">Contact Us</a></li>
                <li><a href="tel:5127573994">1.512.757.3994</a></li>
            </ul>

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


<ul id="services" class="dropdown-content" data-constrainwidth="false">
    <div class="service-column recommendations">
        <div class="service-heading">Recommendations</div>
        <div class="service-item"><a href="/product/consultation">Consultation (Get $150)</a></div>
        <div class="service-item"><a href="/product/life-squared/">Life Squared (Save 33%)</a></div>
        <div class="service-item"><a href="/product/family-office">Family Office Subscription</a></div>
    </div>
    <div class="service-column llcs">
        <div class="service-heading">LLCs</div>
        <div class="service-item"><a href="/product/series-llc">Series LLC</a></div>
        <div class="service-item"><a href="/product/traditional-llc">Traditional</a></div>
        <div class="service-item"><a href="/product/ira-owned-llc">IRA Owned</a></div>
        <div class="service-item"><a href="/product/assignment-of-interest">Assignment of Interest</a></div>
        <div class="service-item"><a href="/product/series-document">Series Document</a></div>
    </div>
    <div class="service-column trusts">
        <div class="service-heading">Trusts</div>
        <div class="service-item"><a href="/product/delaware-statutory-trust/">Delaware Statutory</a></div>
        <div class="service-item"><a href="/product/anonymous-land-trust">Anonymous Land</a></div>
        <div class="service-item"><a href="/product/ira-owned-trust">IRA Owned</a></div>
    </div>
    <div class="service-column agreements">
        <div class="service-heading">Agreements</div>
        <div class="service-item"><a href="/product/limited-partnership">Limited Partnership</a></div>
        <div class="service-item"><a href="/product/joint-venture">Joint Venture</a></div>
        <div class="service-item"><a href="/product/property-transfer">Property Transfer</a></div>
        <div class="service-item"><a href="/product/deed">Deed</a></div>
    </div>
    <div class="service-column plans">
        <div class="service-heading">Strategy</div>
        <div class="service-item"><a href="/product/estate-planning">Estate Planning</a></div>
        <div class="service-item"><a href="/product/hourly-consulting">Hourly Consulting</a></div>
    </div>
</ul>
