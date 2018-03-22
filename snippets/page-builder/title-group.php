<?php
/* TITLE GROUP
 * Receives variables from ./page.php */
?>


<div class="title-group">
    <?php if ($title) { ?>
        <<?= $title_elem; ?> class="title <?= $title_size; ?>">
        <?php echo $title ?>
        </<?= $title_elem; ?>>
    <?php } ?>

    <?php if ($subtitle) { ?>
        <<?= $subtitle_elem; ?> class="subtitle <?= $subtitle_size; ?>">
        <?php echo $subtitle ?>
        </<?= $subtitle_elem; ?>>
    <?php } ?>

    <?php if ($description) {
        echo '<p class="description">';
        echo $description;
        echo '</p>';
    } ?>
</div>
