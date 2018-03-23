<?php
get_header();
global $post;
?>


<main id="<?= $post->post_name; ?>-page">
    <?php the_content(); ?>
</main>


<?php get_footer(); ?>
