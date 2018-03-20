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
                foreach($children as $child) {
                    $output .="<div class=\"service-column\">";
                    $output .="<div class=\"service-heading\">".$child->title."</div>";
                    $sub_children = $children_elements[$child->ID];
                    if($sub_children){
                        foreach($sub_children as $sub_child) {
                            $output .="<div class=\"service-item\">";
                            $output .="<a href=\"".$sub_child->url."\">".$sub_child->title."</a>";
                            $output .="</div>";
                        }
                    }
                    $output .="</div>";
                }
                $output .="</ul>";

            } else {
                $output .="<a href=\"".$item->url."\">".$item->title."</a>" ;
            }
            $output .= "</li>";
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