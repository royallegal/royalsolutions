<?php wp_nav_menu(array(
    "theme_location" => "footer-nav",
    'items_wrap' => '<div id="%1$s" class="%2$s">%3$s</div>',
    "menu_class"=> "links row container",
    'walker' => new Footer_Nav_Walker
)) ?>
