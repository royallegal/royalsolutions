<?php
/* IMAGE
 * Receives variables from ./page.php */
?>


<div class="<?= $panel_classes.' '.$cta_position.' '.$container;?>-container flex panel"
     style="height: <?= $panel_height;?>vh;">

    <div class="<?= $container; ?>"
         style="<?= (! $parallax) ? 'background-image: url('.$image_src.');' : ''; ?>">

        <?php if ($parallax) : ?>
            <img alt="<?= $image_alt; ?>" src="<?= $image_src; ?>"/>
        <?php endif; ?>

        <?php if ($has_color) : ?>
            <div class="<?= $colorize; ?> mask trans-70"
                 style="background-color:<?= $colorize; ?>;"></div>
        <?php endif; ?>
    </div>

    <?php if ($has_cta) : ?>
        <div class="<?= $cta_classes; ?> cta-group">
        <?php
        if ($titles) {
            include(locate_template('snippets/page-builder/title-group.php'));
        }
        if ($buttons) {
            include(locate_template('snippets/page-builder/button-group.php'));
        }
        /* elseif ($form) {
         * }
         * elseif ($promotion) {
         * }*/
        ?>
    </div>
    <?php endif; ?>
</div>
