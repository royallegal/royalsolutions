<?php
get_header();
global $post;
?>


<main id="<?= $post->post_name; ?>-page">
    <?php
    the_content();

    if (have_rows('component')) {
        while (have_rows('component')) {
            the_row();
            // Component
            $name      = str_replace("component_", "", get_row_layout());
            $component = get_sub_field($name);

            // Panel Settings
            $panel_height  = get_sub_field('panel_height');
            $panel_width   = get_sub_field('panel_width');
            $panel_padding = get_sub_field('panel_padding');
            $panel_margin  = get_sub_field('panel_margin');
            $panel_classes = $panel_width.' '.$panel_padding.' '.$panel_margin;

            // Media
            $image_src = get_sub_field('image')['url'];
            $image_alt = get_sub_field('image')['alt'];

            // Parallax
            $parallax = false;
            $has_cta = false;
            if (!empty(get_sub_field('options'))) {
                foreach (get_sub_field('options') as $option) {
                    if ($option == 'cta') {
                        $has_cta = true;
                    }
                    elseif ($option == 'parallax') {
                        $parallax = true;
                    }
                }
            }
            $container = $parallax ? "parallax" : "hero";

            // Colorize
            $has_color     = get_sub_field('has_color');
            $color         = get_sub_field($name.'_color');
            $color_themed  = $color['color'];
            $color_variant = $color['color_variant'];
            $color_custom  = $color['color_custom'];
            $color_hover   = $color['color_hover'];
            $colorize      = $color_custom ? $color_custom : $color_themed.' '.$color_variant;

            // Call to Action
            $cta            = get_sub_field('cta');
            $cta_style      = $cta['cta_style'];
            $cta_background = $cta['cta_background'];
            $cta_position   = $cta['cta_position'];
            $cta_text_align = $cta['cta_text_align'];
            $cta_classes    = $cta_style.' '.$cta_background.' '.$cta_text_align;

            // Title Group
            $titles        = $cta['title_group'];
            $title         = $titles['title'];
            $title_elem    = $titles['title_element'];
            $title_size    = $titles['title_size'];
            $subtitle      = $titles['subtitle'];
            $subtitle_elem = $titles['subtitle_element'];
            $subtitle_size = $titles['subtitle_size'];
            $description   = $titles['description'];

            // Button Group
            $buttons = $cta['button_group'];
            $button_size = $buttons['button_size'];

            /* foreach ($buttons['button'] as $button) {
             *     echo '<pre>';
             *     print_r($button);
             *     echo '</pre>';
             * }*/

            // Modals
            $modal_id = 'modal-'.substr(md5(microtime()),rand(0,26),10);

            // Child Templates
            $template  = str_replace("component_", "", $name);
            include(locate_template("snippets/page-builder/".$template.".php"));
        }
    }
    ?>
</main>


<?php get_footer(); ?>
