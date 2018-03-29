<?php
/* BUTTON GROUP
 * Receives variables from /classes/page-builder.php */
?>

<div class="button-group">
    <?php foreach ($c["buttons"] as $button) : ?>
        <a href="#<?= $button["target"]; ?>"
           class="<?= $button["classes"]; ?> <?= ($button["type"] == "modal") ? "modal-trigger" : ""?> button">
            <?= $button["icon"]; ?>
            <?= trim($button["title"]); ?>
        </a>

        <?php
        $modal = $button["modal"];
        if ($button["type"] == "modal" && !empty($modal)) :
        ?>
            <div id="<?= $button["target"]; ?>"
                 class="modal">
                <?php if ($modal["embed"]) : ?>
                    <div class="video-container <?= $modal["auto"].' '.$modal["brand"]; ?>">
                        <?php echo $modal["embed"]; ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    <?php endforeach; ?>
</div>
