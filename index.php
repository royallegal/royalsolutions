<?php
get_header();

/* if ($_GET["offset"]) {
 *     query_posts('posts_per_page='.$_GET["offset"]);
 * }*/
query_posts('posts_per_page=-1');
?>


<main id="feed" class="masonry sidebar-sibling">
    <?php
    if (have_posts()) {
        while (have_posts()) {
            the_post();
            if (get_post_type() != 'product') {
                get_template_part('snippets/feed/posts/index');
            }
        }
    }
    ?>
</main>

<?php get_template_part('sidebar'); ?>


<?php get_footer();
