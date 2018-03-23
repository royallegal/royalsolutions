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
        while (have_rows('component')) {
            the_row();
            $pb = new PageBuilder;
        }
    }
    ?>
</main>


<?php get_footer(); ?>
