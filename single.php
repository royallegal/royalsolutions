<?php
get_header();

if (have_posts()) : the_post();
$image = get_post_custom()['featured_image'][0];
$video = get_post_custom()['featured_video'][0];
?>
    <main id="article" class="with-sidebar">

        <?php if (!empty($image)) {?>
            <!-- Parallax Image -->
            <div class="vh-40 valign-wrapper center-align parallax-container">
                <div class="parallax"><img src="<?= $image ?>"></div>
            </div>
        <?php } ?>

        <div class="container">
            <!-- Mobile Widgets -->
            <?php if (wp_is_mobile() && is_active_sidebar('mobile-widgets')) { ?>
                <div id="mobile-widgets">
                    <?php dynamic_sidebar('mobile-widgets'); ?>
                </div>
            <?php } ?>

            <!-- Top Widgets -->
            <?php if (is_active_sidebar('top-widgets')) { ?>
                <div id="top-widgets">
                    <?php dynamic_sidebar('top-widgets'); ?>
                </div>
            <?php } ?>

            <!-- Post -->
            <div class="content">
                <!-- Articles -->
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

                    <!-- Dynamic Title -->
                    <h1><?php the_title(); ?></h1>

                    <?php if (!empty($video)) {?>
                        <!-- Video Embed -->
                        <div class="video-container responsive-video">
                            <?php
                            if (strpos($video, "embed")) : ?>
                                <iframe src="<?= $video; ?>"
                                        frameborder="0"
                                        allow="autoplay; encrypted-media"
                                        allowfullscreen>
                                </iframe>
                            <?php else : ?>
                                <iframe src="'https://www.youtube.com/embed/'<?= substr($video, strpos($video, "=")+1); ?>"
                                        frameborder="0"
                                        allow="autoplay; encrypted-media"
                                        allowfullscreen>
                                </iframe>
                            <?php endif;?>
                        </div>
                    <?php } ?>

                    <?php the_content(); ?>

                    <!-- Bottom Widgets -->
                    <?php if (is_active_sidebar('bottom-widgets')) { ?>
                        <div id="bottom-widgets">
                            <?php dynamic_sidebar('bottom-widgets'); ?>
                        </div>
                    <?php } ?>
                </article>

                <!-- Sidebar -->
                <?php get_sidebar(); ?>
            </div>
        </div>

        <!-- Promotion -->
        <div class="valign-wrapper center-align vh-30 parallax-container" style="margin:25px 0;">
            <div class="parallax">
                <img alt="Don't let a legal disaster destroy your life" src="https://royallegalsolutions.com/wp-content/uploads/2018/01/iStock-545347988.jpg"/>
            </div>
            <div class="blue mask" style="z-index:1;"></div>
            <div class="container t-depth-2 white-text center title-group" style="z-index:1;">
                <h2 class="title">Can you survive a legal disaster?</h2>
                <h4 class="sub-title">Cover your assets with an asset protection plan from Royal Legal Solutions.</h4>
                <div class="button-group">
                    <a class="btn-flat light ghost" href="/product/consultation/">Get a Consultation</a>
                </div>
            </div>
        </div>

        <!-- Related Posts -->
        <div class="panel">
            <?php
            $related = ci_get_related_posts(get_the_ID(), 3);
            remove_filter('excerpt_more', 'rls_read_more_button');
            if ($related->have_posts()):
	    ?>
	        <div class="related-posts container row">
		    <?php
                    while ($related->have_posts()):
                    $related->the_post();
                    $related_image = get_post_custom()['featured_image'][0];
                    ?>
		        <div class="col s12 m4">
                            <div class="card">
                                <?php if (!empty($related_image)) : ?>
                                    <div class="card-image" style="background-image:url('<?= $related_image ?>');"></div>
                                <?php endif ?>
                                <div class="card-content">
			            <h4>
                                        <a href="<?= the_permalink() ?>">
                                            <?php the_title(); ?>
                                        </a>
                                    </h4>
                                </div>
                                <div class="card-action">
                                    <a href="<?= the_permalink() ?>">Read More</a>
                                </div>
                            </div>
		        </div>
		    <?php endwhile; ?>
	        </div>
	    <?php
            endif;
            wp_reset_postdata();
            ?>
        </div>

        <!-- Comments -->
        <div class="container">
            <?php comments_open() ? comments_template() : ''; ?>            
        </div>
    </main>


<?php else : ?>
    <?php get_template_part('404'); ?>
<?php endif; ?>


<?php get_footer(); ?>
