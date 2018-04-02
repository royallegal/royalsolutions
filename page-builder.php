<?php
/* Template Name: Page Builder */
get_header();
global $post;
include(plugin_dir_path(__FILE__).'classes/page-builder.php');
?>


<main id="<?= $post->post_name; ?>-page" class="page-builder">
    <?php
    the_content();

    // This is used for JavaScript helper functions (see note below)
    if (have_rows('component')) {
        $components = array(
            "image"     => "",
            "video"     => "",
            "form"      => "",
            "promotion" => "",
            "modal"     => "",
            "cta"       => "",
            "title"     => "",
            "buttons"   => "",
            "container" => "hero"
        );

        while (have_rows('component')) {
            the_row();
            $pb = new PageBuilder;
            // Adds info to component array
            foreach ($pb->options as $option=>$val) {
                if ($option == "container") {
                    if ($val == "parallax") {
                        $components[$option] = "parallax";
                    }
                }
                else {
                    $components[$option] = $option;
                }
            }
        }
    }

    // PB-COMPONENTS
    // This contains classes of active components
    // It's used to determine which Materialize JS functions to run
    ?>
    <div id="pb-components" class="hide <?= implode(" ", $components); ?>"></div>
</main>


<?php get_footer(); ?>
