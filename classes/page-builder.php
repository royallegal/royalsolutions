<?php
class PageBuilder {

    function __construct() {
        // Returns component name (ie "text")
        $this->name = str_replace("component_", "", get_row_layout());
        $this->options = array(
            "has_cta"       => false,
            "has_title"     => false,
            "has_buttons"   => false,
            "has_form"      => false,
            "has_promotion" => false,
            "has_container" => "hero"
        );

        // Returns component
        switch ($this->name) {
            case "text":
                $c = $this->get_text();
                break;
            case "image":
                $c = $this->get_image();
                break;
            case "video":
                $c = $this->get_video();
                break;
            default:
                // code to be executed if n is different from all labels;
        }

        // Loads component template
        include(locate_template("snippets/page-builder/".$this->name.".php"));
    }


    function get_options() {
        if (!empty(get_sub_field('options'))) {
            foreach (get_sub_field('options') as $option) {

                // Checks for optional cta content
                if ($option == "cta") {
                    $this->options["has_cta"] = true;
                    
                    // Updates options array with selected sub components
                    foreach (get_sub_field("cta")["cta_content"] as $option) {
                        if ($option == "title_group") {
                            $this->options["has_title"] = true;
                        }
                        elseif ($option == "button_group") {
                            $this->options["has_buttons"] = true;
                        }
                        elseif ($option == "form_group") {
                            $this->options["has_form"] = true;
                        }
                        elseif ($option == "promotion_group") {
                            $this->options["has_promotion"] = true;
                        }
                    }
                }

                // Changes hero to parallax
                elseif ($option == 'parallax') {
                    $this->options["container"] = "parallax";
                }
            }
        }
    }


    function get_layout() {
        // Grid
        if ($this->name == "grid") {
            // do stuff...
        }

        // Panel
        else {
            $styles = array(
                get_sub_field("panel_width"),
                get_sub_field("panel_margin"),
                get_sub_field("panel_padding")
            );
            $classes; // generates a string of classes
            foreach ($styles as $style) {
                $value = is_array($style) ? $style[0] : $style;
                if ($value != "none" && $value != "default") {
                    $classes = empty($classes) ? $value : $classes." ".$value;
                }
            }
            $panel = array(
                "height"  => get_sub_field("panel_height"),
                "classes" => $classes
            );
            return $panel;
        }
    }


    function get_color() {
        if (get_sub_field("has_color")) {
            $src = get_sub_field($this->name."_color");
            // Theme colors vs custom colors
            if ($src["color_source"] == "theme") {
                $col = $src["color"]." ".$this->unique($src["color_variant"]);
            }
            elseif ($src["color_source"] == "custom") {
                $col = $src["color_custom"];
            }
            $hover = $this->unique($src["color_hover"]);
            $color = array(
                "source" => $src["color_source"],
                "color"  => $col." ".$hover
            );
            return $color;
        }
    }


    function get_cta() {
        $src = get_sub_field("cta");
        $cta = array(
            "position" => $src["cta_position"],
            "classes"  => $src["cta_style"]." ".$src["cta_background"]." ".$src["cta_text_align"]
        );
        return $cta;
    }


    function get_buttons() {
        $src = ($this->name == "text")
             ? get_sub_field("text_buttons")
             : get_sub_field("cta")["button_group"];

        // Gets global size
        $size = $this->unique($src["button_size"]);

        $btns = $src["button"];
        $buttons = array();
        foreach ($btns as $btn) {
            // Links vs modals
            if ($btn["button_behavior"] == "modal") {
                $title  = $btn["button_title"];
                $target = 'modal'.substr(md5(microtime()),rand(0,26),10);
            }
            else {
                $title  = $btn["button_link"]["title"];
                $target = $btn["button_link"]["url"];
            }

            // Custom colors vs theme color / variants. Includes hover colors at end
            if ($btn["color_source"] == "theme") {
                $color   = $this->unique($btn["color"]);
                $variant = $this->unique($btn["color_variant"]);
            }
            elseif ($btn["color_source"] == "custom") {
                $color = $btn["color_custom"];
            }
            $hover = $this->unique($btn["color_hover"]);
            $colors = $color." ".$variant." ".$hover;

            // Gets button styles (ie ghost, rounded, raised, icon)
            $styles = implode(" ", $btn["button_styles"]);

            // Icons
            if (in_array("icon", $btn["button_styles"])) {
                $icon = $btn["button_icon"];
                $pos  = $btn["button_icon_position"];
            }

            // Values for each button
            $button = array(
                "type"    => $btn["button_behavior"],
                "title"   => $title,
                "target"  => $target,
                "classes" => $size." ".$colors." ".$styles." ".$pos,
                "icon"    => $icon,
            );
            array_push($buttons, $button);
        }
        return $buttons;
    }


    function get_text() {
        $text = array(
            "layout"  => $this->get_layout(),
            "text"    => get_sub_field("text"),
            "cta"     => array(
                "position" => get_sub_field("cta_position")
            ),
            "buttons" => $this->get_buttons()
        );
        return $text;
    }


    function get_image() {
        $this->get_options();
        $image = array(
            "container" => $this->options["has_container"],
            "layout"    => $this->get_layout(),
            "color"     => $this->get_color(),
            "image"     => get_sub_field("image"),
            "cta"       => $this->get_cta(),
            "title"     => get_sub_field("cta")["title_group"],
            "buttons"   => $this->get_buttons(),
            "form"      => $this->get_form(),
            "promotion" => $this->get_promotion()
        );
        return $image;
    }


    function get_video() {
        
    }


    function get_slider() {
        
    }


    function get_form() {
        
    }


    function get_promotion() {
        
    }


    function get_feature() {
        
    }


    function get_table() {
        
    }


    // ---- HELPERS ---- //
    // Only returns unique data
    function unique($data) {
        if ($data != "default" && $data != "empty") {
            return $data;
        }
    }

    function get_value($data) {
        if (is_array($data)) {
            return $data[0];
        }
        else {
            return $data;
        }
    }


    function load_template($name) {
        $this->component = get_sub_field($this->name);

        $component = str_replace("component_", "", $name);
        include(locate_template("snippets/page-builder/".$component.".php"));
    }
}
?>
