<?php
/* BUTTON GROUP
 * Receives variables from /classes/page-builder.php */
?>

<div class="button-group">
    <?php foreach ($c["buttons"] as $button) : ?>
        <a href="<?= $button["target"]; ?>"
           class="<?= $button["classes"]; ?> <?= ($button["type"] == "modal") ? "modal-trigger" : ""?> button">
            <?= $button["icon"]; ?>
            <?= trim($button["title"]); ?>
        </a>

        <?php if ($button["type"] == "modal") : ?>
            <div id="<?= $button["target"]; ?>" class="modal">
                <?php if ($iframe) : ?>
                    <div class="video-container">
                        <?php echo $iframe; ?>
                    </div>
                <?php
                elseif ($video) : echo $video;
                endif;
                ?>
            </div>
        <?php endif; ?>

    <?php endforeach; ?>
</div>
