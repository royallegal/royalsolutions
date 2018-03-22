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

            <?php wp_nav_menu(array(
                "theme_location" => "main-right-nav",
                "menu_id" => "nav-right",
                "menu_class" => "float-right hide-on-med-and-down",
                'walker' => new Main_Right_Nav_Walker
            ))?>
            
        </div>
    </nav>
</div>
