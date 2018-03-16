<?php
// Media Objects
if (get_post_custom()['featured_image']) {
    $img = get_post_custom()['featured_image'][0];
}
elseif (has_post_thumbnail()) {
    $img = get_the_post_thumbnail_url();
}
$video = get_post_custom()['featured_video'][0];
$audio = get_post_custom()['featured_audio'][0];

// Media Types
if ($img) {
    $type = 'image';
}
elseif ($video) {
    $type = 'video';
}
elseif ($audio) {
    $type = 'audio';
}
else {
    $type = 'text';
}

// Tags
$taglist = array();
foreach (wp_get_post_tags(get_the_ID()) as $tag) {
    array_push($taglist, $tag->name);
}
$tags = implode(" ", $taglist);

// Categories
$cat_names = array();
$cat_links = array();
foreach (wp_get_post_categories(get_the_ID()) as $cat_id) {
    $cat_name = get_cat_name($cat_id);
    $cat_link = '<a class="category" href="'.get_category_link($cat_id).'">'.$cat_name.'</a>';
    array_push($cat_names, $cat_name);
    array_push($cat_links, $cat_link);
}
$cat_names = implode(" ", $cat_names);

// Card Height
// selects double or single based on index
$index = $wp_query->current_post +1;
$height = (rand(1, 5) == 1) ? "double" :"single";

// Post Template
/* include(locate_template('snippets/feed/posts/'.$type.'.php'));*/
?>


<div class="mortar">
    <article class="<?= $height.' '.$type; ?> brick"
             tags="<?= $tags; ?>"
             cats="<?= $cat_names; ?>"
             itemscope
             itemtype="http://schema.org/BlogPosting"
             style="background-image: url('<?= $img; ?>')">

        <?php if ($type != "text") : ?>
            <div class="mask"></div>
        <?php endif; ?>

        <div class="floating-content" >
                <?php if ($type == "text") : ?>

                    <?php include(locate_template('snippets/feed/posts/title-group.php')); ?>
                    <?php ($size == "single") ? rlswp_excerpt('500', null) : rlswp_excerpt('1000', null); ?>
                    <?php include(locate_template('snippets/feed/posts/meta-group.php')); ?>

                <?php else : ?>

                    <?php include(locate_template('snippets/feed/posts/title-group.php')); ?>
                    <?php include(locate_template('snippets/feed/posts/meta-group.php')); ?>

                <?php endif; ?>
            </div>

    </article>
</div>
