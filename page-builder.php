<?php
/* Template Name: Page Builder */
get_header();
global $post;
include(plugin_dir_path(__FILE__).'classes/page-builder.php');
?>


<main id="<?= $post->post_name; ?>-page" class="page-builder">
    <?php
    the_content();

    if (have_rows('component')) {
        $components = array();
        while (have_rows('component')) {
            the_row();
            $pb = new PageBuilder;

            // Adds info to component array
            array_push($components, $pb->name);
            foreach ($pb->options as $option=>$bool) {
                if ($option == "has_container") {
                    array_push($components, $bool);
                }
                else {
                    array_push($components, $option);
                }
            }

            echo '<pre>';
            print_r($components);
            echo '</pre>';
        }
    }
    
    ?>
    <div id="pb-components" class="<?= implode(" ", $components); ?>"></div>
</main>


<?php get_footer(); ?>
