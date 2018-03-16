<div class="title-group">
    <?php if ($type == 'audio'): ?>
        <i class="materialize-icons">play</i>
    <?php endif; ?>

    <div class="content">
        <div class="categories">
            <?php
            foreach ($cat_links as $i=>$link) {
                if ($i != 0) {
                    echo '<div class="bullet"></div>';
                }
                echo $link;
            }
            /* $cat_links = implode(" ", $cat_links);*/
            ?>
        </div>
        <h4 itemprop="name headline">
            <a href="<?= the_permalink(); ?>"
               title="<?= the_title(); ?>"
               itemprop="url">
                <?= the_title(); ?>
            </a>
        </h4>
    </div>
</div>
