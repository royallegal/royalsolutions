<?php 
class Main_Nav_Walker extends Walker_Nav_Menu {
    function display_element($item, &$children_elements, $max_depth, $depth, $args, &$output) {
        if($max_depth == 0){
            $children = $children_elements[$item->ID];
            $id = $item->post_name.$item->ID;
            $output .="<li class=\"".implode(" ", $item->classes)."\">";
            if($children) {
                $output .="<a href=\"".$item->url."\" class=\"dropdown-button\" ";
                $output .="data-activates=\"".$id."\" data-constrainwidth=\"false\">";
                $output .=$item->title."<i class=\"small material-icons right\">arrow_drop_down</i></a>";

                $output .="<ul id=\"".$id."\" class=\"dropdown-content\" data-constrainwidth=\"false\">";

                // here we will collect children that dont have children so we can group them and display
                // diplay them in a single column
                $childs_with_no_children = array();

                foreach($children as $child) {
                    $sub_children = $children_elements[$child->ID];
                    if($sub_children){
                        $output .="<div class=\"service-column\">";
                        $output .="<div class=\"service-heading\">".$child->title."</div>";
                        foreach($sub_children as $sub_child) {
                            $output .="<div class=\"service-item\">";
                            $icon = get_field('icon', $sub_child);
                            $iconHtml =  $icon ? "<i class=\"material-icons left\">$icon</i>" : "";
                            $output .="<a href=\"".$sub_child->url."\">".$iconHtml.$sub_child->title."</a>";
                            $output .="</div>";
                        }
                        $output .="</div>";
                    } else {
                        $childs_with_no_children[] = $child;
                    }
                }

                if(count($childs_with_no_children) > 0){
                    $output .="<div class=\"service-column\">"; 
                    foreach($childs_with_no_children as $child) {
                        $output .="<div class=\"service-item\">";
                        $icon = get_field('icon', $child);
                        $iconHtml =  $icon ? "<i class=\"material-icons left\">$icon</i>" : "";
                        $output .="<a href=\"".$child->url."\">".$iconHtml.$child->title."</a>";
                        $output .="</div>";
                    }
                    $output .="</div>";

                }


                $output .="</ul>";

            } else {
                $icon = get_field('icon', $item);
                $iconHtml =  $icon ? "<i class=\"material-icons left\">$icon</i>" : "";
                $output .="<a href=\"".$item->url."\">".$iconHtml.$item->title."</a>" ;
            }
            $output .= "</li>";
        }
    }
}

class Main_Right_Nav_Walker extends Walker_Nav_Menu {
    function display_element($item, &$children_elements, $max_depth, $depth, $args, &$output) {
        $menu = wp_get_nav_menu_object($args[0]->menu);
        $display_cart = get_field("display_cart", $menu);
        $display_account_information = get_field("display_account_information", $menu);

        var_dump($item->menu_order);
        
        if($display_cart){
            ob_start();
            include(locate_template('snippets/global/cart-nav.php'));
            $cart_data = ob_get_clean();
            $output .= $cart_data;
        }
        
        if($display_account_information){
            ob_start();
            include(locate_template('snippets/global/account-nav.php'));
            $account_data = ob_get_clean();
            $output .= $account_data;
        }
        if($max_depth == 0){
            $customize_color = get_field("customize_color", $item);
            $button_styles = ""; 
            if($customize_color) {
                $color = get_field("color", $item);
                $color_variant = get_field("color_variant", $item);
                $button_styles .= "button $color $color_variant";
            }   
            
            $output .= "<li><a class=\"$button_styles\" href=\"$item->url\">$item->title</a></li>";
        }

    }
}

class Main_Mobile_Nav_Walker extends Walker_Nav_Menu {
    function display_element($item, &$children_elements, $max_depth, $depth, $args, &$output) {
        if($max_depth == 0){
            $children = $children_elements[$item->ID];
            $output .= "<li class=\"no-padding\">";
            if($children) {
                $output .= "<ul class=\"collapsible collapsible-accordion\">";
                $output .= "<li><a class=\"collapsible-header\">".$item->title."<i class=\"material-icons right\">arrow_drop_down</i></a>";
                $output .= "<div class=\"collapsible-body\"><ul>";
                foreach($children as $child) {
                    $sub_children = $children_elements[$child->ID];
                    if($sub_children){
                        $output .= "<ul class=\"collapsible collapsible-accordion\">";
                        $output .= "<li><a class=\"collapsible-header\">".$child->title."<i class=\"material-icons right\">arrow_drop_down</i></a>";
                        $output .= "<div class=\"collapsible-body\"><ul>";
                        foreach($sub_children as $sub_child) {
                            $icon = get_field('icon', $sub_child);
                            $iconHtml =  $icon ? "<i class=\"material-icons left\">$icon</i>" : "";
                            $output .="<li><a href=\"".$sub_child->url."\">".$iconHtml.$sub_child->title."</a></li>" ;
                        }
                        $output .= "</ul></div>";
                        $output .= "</li>";
                        $output .= "</ul>";
                    } else {
                        $icon = get_field('icon', $child);
                        $iconHtml =  $icon ? "<i class=\"material-icons left\">$icon</i>" : "";
                        $output .="<li><a href=\"".$child->url."\">".$iconHtml.$child->title."</a></li>" ;
                    }
                }
                $output .= "</ul></div>";
                $output .= "</li>";
                $output .= "</ul>";
            } else {
                $icon = get_field('icon', $item);
                $iconHtml =  $icon ? "<i class=\"material-icons left\">$icon</i>" : "";
                $output .="<a href=\"".$item->url."\">".$iconHtml.$item->title."</a>" ;
            }
            $output .= "</li>";
        }
        $menu = wp_get_nav_menu_object($args[0]->menu);        
        $display_cart = get_field("display_cart", $menu);
        $display_account_information = get_field("display_account_information", $menu);
        
        if($display_cart){
            ob_start();
            include(locate_template('snippets/global/cart-nav.php'));
            $cart_data = ob_get_clean();
            $output .= $cart_data;
        }
        
        if($display_account_information){
            ob_start();
            include(locate_template('snippets/global/account-nav.php'));
            $account_data = ob_get_clean();
            $output .= $account_data;
        }
    }
} 

class Footer_Nav_Walker extends Walker_Nav_Menu {
    function display_element($item, &$children_elements, $max_depth, $depth, $args, &$output) {
        if($max_depth == 0){
            $output .="<div class=\"".implode(" ", $item->classes)." col m3 s12\">";
            $output .="<h6>".$item->title."</h6>";
            $children = $children_elements[$item->ID];
            if($children){
                foreach($children as $child) {
                    $output .="<a href=".$child->url."><p>".$child->title."</p></a>";
                }
            }
            $output .="</div>";
        } 
    }
} 