<?php
/* IMAGE
 * Receives variables from /classes/page-builder.php */
$hero = ($c["container"] == "hero") ? true : false;

echo '<pre>';
print_r($c);
echo '</pre>';
?>


<div class="<?= $c["layout"]["classes"]." ".$c["cta"]["position"]." ".$c["container"];?>-container flex wrap panel"
     style="height: <?= $c["layout"]["height"];?>vh;">

    <div class="<?= $c["container"]; ?>"
         style="<?= ($hero) ? 'background-image: url('.$c["image"]["url"].');' : ''; ?>">

        <?php // if parallax
        if (!$hero) : ?>
            <img alt="<?= $c["image"]["alt"]; ?>" src="<?= $c["image"]["url"]; ?>"/>
        <?php endif; ?>

        <?php if (!empty($c["color"]["color"] && $c["color"]["source"] == "theme")) : ?>
            <div class="<?= $c["color"]["color"]?> trans-70 mask"></div>
        <?php elseif (!empty($c["color"]["color"] && $c["color"]["source"] == "custom")):?>
            <div class="trans-70 mask" style="background-color:<?=$c["color"]["color"];?>;"></div>
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
