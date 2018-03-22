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
</ul>
