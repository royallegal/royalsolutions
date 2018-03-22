<?php
    $user   = wp_get_current_user();
    $first  = $user->user_firstname;
    $logout = esc_url(wc_logout_url(wc_get_page_permalink('myaccount')));
?>
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