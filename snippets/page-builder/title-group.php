<?php
/* TITLE GROUP
 * Receives variables from /classes/page-builder.php */
$t = $c["title"];
?>


<div class="title-group">
    <?php if ($t["title"]) { ?>
        <<?= $t["title_element"]; ?> class="title <?= $t["title_size"]; ?>">
        <?php echo trim($t["title"]) ?>
        </<?= $t["title_element"]; ?>>
    <?php } ?>

    <?php if ($t["subtitle"]) { ?>
        <<?= $t["subtitle_element"]; ?> class="subtitle <?= $t["subtitle_size"]; ?>">
        <?php echo trim($t["subtitle"]) ?>
        </<?= $t["subtitle_element"]; ?>>
    <?php } ?>

    <?php if ($t["description"]) {
        echo '<p class="description">';
        echo trim($t["description"]);
        echo '</p>';
    } ?>
</div>
