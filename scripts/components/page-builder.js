function page_builder() {

    // Modals
    // I haven't got this working yet

    /* var modals = $('[id^="#modal-"]');
     * $.each(modals, function(i, v) {
     *     console.log(v);
     *     $(v).modal({
     *         ready: function(modal) {
     *             console.log('ready');
     *             console.log(modal);
     *         },
     *         complete: function(modal) {
     *             console.log('complete');
     *         }
     *     });
     * });*/

    /* $('.modal').modal({
     *     ready: function() {
     *         console.log('ready');
     *     },
     *     complete: function() {
     *         console.log('complete');
     *     }
     *     complete: function(modal) {
     *         var $modal = $(modal);
     *         var $iframe = $modal.find('iframe');
     *         autostop($iframe.get(0));
     *     }
     * }); */


    // Newsletter
    $('[data-newsletter-form]').each(function(index, form){
        $form = $(form);
        $form.on('submit', function(e){
            e.preventDefault();
            $email = $form.find("[name=email]").val();
            $thank_you = $form.find("[data-form-success]")
            $content = $form.find("[data-form-content]")
            
            $thank_you.removeClass("hidden");
            $content.addClass("hidden");
        });
    });
}
