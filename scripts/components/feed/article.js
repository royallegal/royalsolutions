function royal_article() {
    // Responsive iFrames
    /* $('iframe').wrap('<div class="video-container"></div>');*/

    // Parallax
    if ($('.parallax-container').length) {
        var featured = $('.featured-image .parallax');
        var promotion = $('.promotion-image .parallax');

        if (featured.length && promotion.length) {
            featured.parallax();
            promotion.parallax();
        }
        else if (featured.length) {
            featured.parallax();
        }
        else if (promotion.length) {
            promotion.parallax();
        }
        else {
            $('.parallax').parallax();
        }
    }
}
