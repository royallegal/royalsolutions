<?php
// ---- GLOBAL COMPONENTS ---- //
// Login Modal
if (!function_exists('login_popup_modal')) {
    function login_popup_modal(){
        get_template_part("snippets/global/login-modal");
    }
    add_action('wp_footer', 'login_popup_modal');
}

// Floating Action Buttons Group
if (!function_exists('fab_group')) {
    function fab_group(){
        get_template_part("snippets/global/fab-group");
    }
    add_action('wp_footer', 'fab_group');
}
?>
