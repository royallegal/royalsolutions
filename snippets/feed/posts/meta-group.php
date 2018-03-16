<div class="meta-group">
    <div class="chips">
        <div class="meta-item chip">
            <i class="close material-icons">remove_red_eye</i>
            300
        </div>
        <div class="meta-item chip">
            <i class="close material-icons">share</i>
            300
        </div>
        <div class="meta-item chip">
            <i class="close material-icons">mode_comment</i>
            300
        </div>
    </div>

    <?php if ($type == "text") : ?>
        <a class="accent blue button" href="<?= get_permalink($post->ID); ?>">
            Read More
        </a>
    <?php endif; ?>
</div>
