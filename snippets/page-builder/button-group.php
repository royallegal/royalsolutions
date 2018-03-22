<?php
/* BUTTON GROUP
 * Receives variables from ./page.php */
?>

<div class="button-group">
    <?php
    foreach ($buttons['button'] as $button) {

        // Styles
        // Can be ghost | rounded | raised | icon
        if (!empty($button['button_styles'])) {
            $button_styles = implode(" ", $button['button_styles']);
        } else {
            $button_styles = null;
        }

        // Button Colors
        $button_color_themed = $button['color'].' '.$button['color_variant'];
        $button_color_custom = $button['color_custom'];
        $button_color_hover  = $button['color_hover'];

        // Classes
        $button_classes = !$button_color_custom
                        ? $button_styles.' '.$button_color_hover.' '.$button_color_themed
                        : $button_styles.' '.$button_color_hover;

        // Button Icon
        $button_icon          = $button['button_icon'];
        $button_icon_position = $button['button_icon_position'];

        // Behavior
        // Can be a link or a modal (see HTML below)
        $button_behavior = $button['button_behavior'];

        // Links
        if ($button_behavior == "link") {
            $button_link = $button['button_link'];
    ?>
        <a class="<?= $button_classes; ?> button"
           style="<?= $button_color_custom ? $button_color_custom : ''; ?>"
           href="<?= $button_link['url']; ?>"
           target="<?= $button_link['target']; ?>">
            <?= $button_link['title']; ?>
        </a>

        <?php
        // Modals
        } elseif ($button_behavior == "modal") {
            $button_title         = $button['button_title'];
            $button_modal         = $button['button_modal'];
        ?>
            <a class="<?= $button_classes; ?> modal-trigger button"
               style="<?= $button_color_custom ? $button_color_custom : ''; ?>"
               href="<?= $modal_id; ?>">
                <i class="material-icons <?= $button_icon_position; ?>">
                    <?= $button_icon; ?>
                </i>
                <?php echo $button_title; ?>
            </a>

            <div id="<?=$modal_id?>" class="modal">
                <?php if ($iframe) : ?>
                    <div class="video-container">
                        <?php echo $iframe; ?>
                    </div>
                <?php
                elseif ($video) : echo $video;
                endif;
                ?>
            </div>
    <?php } // endif ?>

    <?php } // endforeach ?>
</div>
