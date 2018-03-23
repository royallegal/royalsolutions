<?php
/* TEXT
 * Receives variables from /classes/page-builder.php */
$cta = !empty($c["cta"]) ? "has-cta" : "";
?>


<div class="<?= $c["layout"]["classes"]." ".$c["cta"]["position"];?> flex wrap panel">

    <div class="text <?= $cta; ?>">
        <?= $c["text"]; ?>
    </div>

    <?php if ($cta) : ?>
        <div class="cta-group">
            <?php
            if (!empty($c["buttons"])) {
                include(locate_template('snippets/page-builder/button-group.php'));
            }
            ?>
        </div>
    <?php endif; ?>

</div>
