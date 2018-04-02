function page_builder() {

    // Modifies embedded video settings
    if ($('.remove-branding').length) {
        $('.remove-branding').find('iframe').get(0).src += "&rel=0&showinfo=0";
    }

    // INIT MATERIALIZE FUNCTIONS
    // Modals
    if ($('.modal')) {
        $('.modal').modal({
            ready: function(modal) {
                var video = $(modal).find('iframe').get(0);
                if (modal.find('.autoplay')) {
                    autoplay(video);
                }
            },
            complete: function(modal) {
                var video = $(modal).find('iframe').get(0);
                autostop(video);
            }
        });
    }

    // Parallax
    if ($('.parallax')) {
        $('.parallax').parallax();
    }

    // Newsletter
    /* $('[data-newsletter-form]').each(function(index, form){
     *     $form = $(form);
     *     $form.on('submit', function(e){
     *         e.preventDefault();
     *         $email = $form.find("[name=email]").val();
     *         $thank_you = $form.find("[data-form-success]")
     *         $content = $form.find("[data-form-content]")
     *
     *         $thank_you.removeClass("hidden");
     *         $content.addClass("hidden");
     *     });
     * });*/
}
