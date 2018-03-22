;(function ($) {
function royal_contact() {
    // Submission
    $('form').submit(function(e) {
        e.preventDefault();
        var first   = $("#first").val();
        var last    = $("#last").val();
        var phone   = $("#phone").val();
        var email   = $("#email").val();
        var message = $("#message").val();
        var submit  = $("button[type='submit']");
        var circles = $(".preloader-wrapper").parent();
        var confirm = $(".confirm");
        
        // Removes existing validation
        confirm.removeClass('pink green').addClass('hide').find('p').remove();
        $('.invalid, .valid').removeClass('invalid valid');
        
        // Validation
        if (first == "" || last == "" || phone == "" || email == "") {
            confirm.addClass('pink').removeClass('hide').html("<p>Oops, looks like we're missing some information. Please fill out all the fields.</p>");
        }
        
        else {
            // Toggle Preloader
            submit.addClass('hide');
            circles.removeClass('hide');
            
            $.ajax({
                type: 'POST',
                url: "/wp-admin/admin-ajax.php",
                data: {
                    action: 'contact_us_form',
                    first: first,
                    last: last,
                    phone: phone,
                    email: email,
                    message: message.replace(/(?:\r\n|\r|\n)/g, '<br/>'),
                },
                
                success: function(data) {
                    if (data == "0") {
                        // Error message
                        confirm.addClass('pink').removeClass('hide').html("<p>Oops, looks like there was a problem! Check back later or email us directly at <a href='mailto:scott@royallegalsolutions.com'>scott@royallegalsolutions.com</a>.</p>");
                    }
                    else {
                        // Success message
                        confirm.addClass('green').removeClass('hide').html("<p>Success! Check your email. We'll be in touch shortly.</p>");
                    }
                },
                
                error: function(err) {
                    // Error message
                    confirm.addClass('pink').removeClass('hide').html("<p>Oops, looks like there was a problem! Check back later or email us directly at <a href='mailto:scott@royallegalsolutions.com'>scott@royallegalsolutions.com</a>.</p>");
                },
                
                complete: function(res) {
                    $('form')[0].reset();
                    Materialize.updateTextFields();
                    $('form textarea').trigger('autoresize');
                    
                    // Toggle Preloader
                    circles.addClass('hide');
                    submit.removeClass('hide');
                }
            });
        }
    });
}

function royal_login() {

    // Materialize Modal
    $('#loginModal').modal({
        inDuration: 200,
        outDuration: 150,
        complete: function() {
            $('#loginModal .login').css({
                zIndex: 1,
                opacity: 1
            });
            $('#loginModal .splash').removeClass('shift');
        }
    });


    // ---- CONTROLS ---- //
    // Transitions to login form
    $('[data-goto-login]').on('click', function() {
        $('#loginModal .splash').removeClass('shift');
    })

    // Transition to password recovery form
    $('[data-goto-lost]').on('click', function() {
        $('#loginModal .splash').addClass('shift');
    })

    // Auto-opens modal if user is coming via a reset link
    if (location.search.includes("action=rp")) {
        $('#loginModal .login').css({
            zIndex: 0,
            opacity: 0
        });

        setTimeout(function() {
            $('#loginModal').modal('open');
        }, 750);
    }
    $('#loginModal .reset #lost-link').click(function() {
        setTimeout(function() {
            $('#loginModal .login').css("z-index", 1).animate({
                opacity: 1
            }, 250);
        }, 350);
    });


    // ---- METHODS ---- //
    // Perform AJAX login on form submit
    $('form#login').on('submit', function(e) {
        // Hide error and sucess message 
        $('form#login .status .error, form#login .status .success').addClass('hide').hide();

        // Fadeout the login button and forget link
        $("form#login .status-swap").fadeOut(300);

        // Display loading spinner
        $("form#login .status .loading").delay(350).hide().removeClass('hide').fadeIn(300);

        // Display text next to loading spinner 
        $('form#login .status .loading .message').text("We're logging you in!");

        e.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/wp-admin/admin-ajax.php',
            data: {
                'action': 'ajax_login',
                'username': $('form#login #loginUsername').val(),
                'password': $('form#login #loginPassword').val(),
                'remember': $('form#login #loginRemember').attr("checked"),
                'loginSecurity': $('form#login #loginSecurity').val()
            }
        }).done(function(data) {
            if (data.loggedin == true) {
                // Hide sucess message 
                $('form#login .status .success').removeClass('hide').show().delay(5000).fadeOut(300);
                $('form#login .status .success .message').text(data.message);
                location.reload();
            } else {
                // Display the status div
                $(".status-swap").delay(350).fadeIn(300);

                // Hide error message 
                $('form#login .status .error').removeClass('hide').show().delay(5000).fadeOut(300);
                $('form#login .status .error .message').text(data.message);
            }
        }).fail(function(data) {
            // Hide error message 
            $('form#login .status .error').removeClass('hide').show().delay(5000).fadeOut(300);
            $('form#login .status .error .message').text(data.message);
        }).always(function(data) {
            // Hide spinner and logging in text
            $(".status .loading").fadeOut(300);
        });
    });  

    // Perform AJAX login on form submit
    $('form#passwordLost').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/wp-admin/admin-ajax.php',
            data: {
                'action': 'lost_pass',
                'user_login': $('form#passwordLost #lostUsername').val(),
                'lostSecurity': $('form#passwordLost #lostSecurity').val()
            },
            success: function(data) {
                $('form#passwordLost p.status').text(data.message);
            }
        });
    });

    $('form#passwordReset').on('submit', function(e){
        e.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/wp-admin/admin-ajax.php',
            data: {
                action:         'reset_pass',
                pass1:		$('form#passwordReset #resetPass1').val(),
                pass2:		$('form#passwordReset #resetPass2').val(),
                user_key:	$('form#passwordReset #user_key').val(),
                user_login:	$('form#passwordReset #user_login').val(),
                'resetSecurity': $('form#passwordReset #resetSecurity').val()
            },
            success: function(data){
                $('form#passwordLost p.status').text(data.message);
            }
        });
    });

    // Perform AJAX login on form submit
    $('form#logout').on('submit', function(e){
        e.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/wp-admin/admin-ajax.php',
            data: {
                'action': 'ajax_logout',
                'logoutSecurity': $('form#logout #logoutSecurity').val() },
            success: function(data){
                if (data.loggedout == true){
                    location.reload();
                }
            }
        });
    });
}

function royal_menus() {
    // Mobile Menu
    $("#mobile-menu").sideNav({
        menuWidth: 260,
        edge: 'right'
    });


    // Dropdowns
    $("nav .dropdown-button").dropdown({
        constrainWidth: false
    });


    // Hero Displays
    if ($('.hero-container, .parallax-container').length) {
        $('nav').addClass('transparent');
    }
}


function royal_toggle_menus(top) {
    if (top > 5 && $('nav').hasClass('transparent')) {
        $('nav').removeClass('transparent');
    }
    else if (top < 5 && !$('nav').hasClass('transparent')) {
        $('nav').addClass('transparent');
    }
}

function royal_modals() {

    function autoplay(video) {
        video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
    function autostop(video) {
        video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }

    // Blog Videos
    if ($('#feed').length > 0) {
        $('.modal').modal({
            ready: function(modal) {
                var $modal = $(modal);
                var videoSrc = $modal.data('video-src');
                var $iframe = $modal.find('iframe');

                if($iframe && !$iframe.attr('src')){
                    $iframe.attr('src', videoSrc + "?enablejsapi=1&showinfo=0")
                    $iframe.on('load', function(){
                        autoplay(this);
                    })
                }else{
                    autoplay($iframe.get(0));
                }
            },
            complete: function(modal) {
                var $modal = $(modal);
                var $iframe = $modal.find('iframe');
                autostop($iframe.get(0));
            }
        })
    }

    if($('[hero-video-modal]').length > 0 ){
        //We need to move the dom element to the body so the z-index works and the 
        //modal is not displayed below the overlay
        $("[hero-video-modal]").detach().appendTo('body');

        $('[hero-video-modal]').modal({
            complete: function(modal) {
                var $modal = $(modal);
                var $iframe = $modal.find('iframe');
                autostop($iframe.get(0));
            }
        }); 
    }
}

// Moves the WooCommerce notice to the top of the page
function royal_moveNotice() {
    $('.notice').each(function() {
        $(this).prependTo($('main'));
    });
}


// Moves newly added WooCommerce cart notices to the top of the page
function royal_refreshCartNotice() {
    var cartLoop = setInterval(function() {
        if ($('main .container .notice').length > 0) {
            royal_moveNotice();
            clearInterval(cartLoop);
        }
    }, 250);
}

$(document).ready(function() {
    $('[data-newsletter-form]').each(function(index, form){
        $form = $(form);
        $form.on('submit', function(e){
            e.preventDefault();
            $email = $form.find("[name=email]").val();
            $thank_you = $form.find("[data-form-success]")
            $content = $form.find("[data-form-content]")
            
            $thank_you.removeClass("hidden");
            $content.addClass("hidden");
        })
    })
});

function royal_quiz() {

    // Asset Protection Quiz
    if ($('#asset-protection-quiz').length) {
        // Materialize carousel settings
        $('.carousel.carousel-slider').carousel({
            fullWidth: true,
            indicators:true
        });

        // Questions panel display & navigation
        $('.toggle-section').hide();
        $('.btn-quiz-toggle').unbind('click').bind('click',function(){
            $('.toggle-section').slideToggle('fast',function(){
                if($('.toggle-section').css('display')=='block'){
                    $('.btn-quiz-toggle').html("CLOSE QUIZ");
                    $('.btn-quiz-toggle').addClass("close");
                }else{
                    $('.btn-quiz-toggle').html("TAKE THE QUIZ");
                    $('.btn-quiz-toggle').removeClass("close");
                }
            });
        });

        // Results & email
        // Code goes here...
    }

}

$(document).ready(function() {
    'use strict';

    // ---- GLOBAL ---- //
    royal_menus();
    royal_login();
    royal_sidebar();


    // ---- GENERAL ---- //
    if ($.fn.parallax && $('.parallax').length){
        $('.parallax').parallax();
    }
    if ($.fn.carousel && $('.carousel-slider').length){
        $('.carousel-slider').carousel({
            duration: 350,
            fullWidth: true
        });
    } 


    // ---- MOBILE ---- //


    // ---- LANDING PAGES ---- //
    if ($('#home').length) {
        $('#home .carousel-slider').carousel({
            duration: 350,
            fullWidth: true
        });
        setTimeout(autoplay, 9000);
        function autoplay() {
            $('#home .carousel-slider').carousel('next');
            setTimeout(autoplay, 12000);
        }
    }


    // ---- PROMOTIONS ---- //
    if ($('.modal-trigger').length) {
        royal_modals();
    }
    /* if ($('.quiz').length){
     *     royal_quiz();
     * }*/


    // ---- FEED ---- //
    if ($('#feed').length) {
        royal_feed();
    }
    if ($('main#article').length > 0) {
        royal_article();
    }


    // ---- WOOCOMMERCE ---- //
    if ($('body.woocommerce').length) {
        royal_woocommerce();
    }
});

/* $(window).resize(function() {
 *     if ($('.my-account').length) {
 *     }
 * })*/

var didScroll;
$(window).scroll(function(){
    didScroll = true;
    var top = $(window).scrollTop();

    /* if ($('.hero-container, .parallax-container').length) {
     *     royal_toggle_menus(top);
     * }*/

    if ($('.consultation').length > 0) {
        var hero = $('.hero-container').height();
        if (top > hero && $('nav').hasClass('no-shadow')) {
            $('nav').removeClass('no-shadow');
        }
        else if (top < hero && !$('nav').hasClass('no-shadow')) {
            $('nav').addClass('no-shadow');
        }
    }
    if($('#feed').length && $('[data-load-more-spinner]').hasClass('hide')){
        if($(window).scrollTop() + $(window).height() + $('footer').height() > $(document).height()) {
            var $spinner = $('[data-load-more-spinner]');
            $spinner.removeClass('hide');
            var offset = $spinner.data("offset");
            var postsPerPage = $spinner.data("posts-per-page");
            getMorePosts(offset, postsPerPage).then(function(res){
                var $res = $(res);
                $('.masonry').append( $res ).masonry( 'appended', $res );
                var newOffset = offset+postsPerPage;
                var newParams = '?offset='+ newOffset;
                window.history.pushState({urlPath:newParams},"",newParams)
                $spinner.data("offset",newOffset);
                $spinner.addClass('hide');
            }).fail(function(){ 
                $spinner.addClass('hide');
            })
        }
    }
});

setInterval(function() {
    if (didScroll) {
        /* toggleNav();*/
        didScroll = false;
    }
}, 250);

function royal_sidebar() {
    // Show sidebar by default on feed pages
    if ($('#feed').length) {
        $('body').addClass('sidebar-open');
    }

    // Toggle sidebar on click
    $('#sidebar-fab').on('click', function(){
        $('body').toggleClass('sidebar-open');
    });
}

// Chainable status variable
// ex: elem.status.method();
var Status = function(elem, options) {
    return new Status.init(elem, options);
}


// Status Methods
// Placed on prototype to improve performance
Status.prototype = {
    start: function() {
        $(elem).find('.status-swap').addClass('hide');
        $(elem).find('.status').removeClass('hide');
    },

    end: function() {
        $(elem).find('.status').addClass('hide');
        $(elem).find('.status-swap').removeClass('hide');
    },

    load: function() {
        $(elem).find('div').addClass('hide');
        $(elem).find('.loading').removeClass('hide');
    },

    error: function() {
        $(elem).find('div').addClass('hide');
        $(elem).find('.error').removeClass('hide');
    },

    success: function() {
        $(elem).find('div').addClass('hide');
        $(elem).find('.success').removeClass('hide');
    }
}


// Init Status
Status.init = function(elem, options) {
    var self = this;
    var _defaults = {
        loader: 'spinner',
        ready: undefined
    }
    self.elem = elem || '';
    self.options = $.extend({}, _defaults, options);

    /* console.log(self.elem);
     * console.log(self.options);*/
}

// Init Status prototype
Status.init.prototype = Status.prototype;


$.fn.status = function(methodOrOptions) {
    Status(this, arguments[0]);
    return this;
}


// Super awesome!!!
$('form#login .form-status').status();

function royal_woocommerce() {

    // ---- Notices ---- //
    if ($('.notice').length > 0) {
        royal_moveNotice();
    }
    $(document.body).on('updated_cart_totals', function() {
        royal_moveNotice();
    });

    // ---- Products ---- //
    if ($('main#product').length > 0) {
        $('select').material_select();
    }

    // ---- Cart ---- //
    if ($('.woocommerce-cart-form').length > 0) {
        $('.product-remove a').click(function() {
            royal_refreshCartNotice();
        });
    }

    // ---- Checkout ----- //
    /* $('#payment [type=radio]').click(function() {
     *     console.log('click');
     * });*/
}

function getMorePosts(offset, posts_per_page, category){
    return $.ajax({
        type: 'POST',
        url: '/wp-admin/admin-ajax.php',
        data: {
            category: category,
            offset: offset,
            posts_per_page: posts_per_page,
            action: 'rls_more_posts'
        }
    });
}

function royal_article() {
    // Responsive iFrames
    /* $('iframe').wrap('<div class="video-container"></div>');*/

    // Parallax
    if ($('.parallax-container').length) {
        console.log('PARALLAX');
        var featured = $('.featured-image .parallax');
        var promotion = $('.promotion-image .parallax');

        if (featured.length && promotion.length) {
            console.log('BOTH');
            featured.parallax();
            promotion.parallax();
        }
        else if (featured.length) {
            console.log('FEATURED');
            featured.parallax();
        }
        else if (promotion.length) {
            console.log('PROMOTIO');
            promotion.parallax();
        }
        else {
            console.log('ELSE');
            $('.parallax').parallax();
        }
    }
}

function royal_feed() {
    /* var columns =  $('#feed .col').first().hasClass('m9') ? 2 : 3;
     * var masonry = $('.masonry').masonry({
     *     itemSelector: 'article',
     *     percentPosition: true,
     *     fitWidth: true,
     *     hiddenStyle: {
     *         transform: 'translateY(100px)',
     *         opacity: 0
     *     },
     *     visibleStyle: {
     *         transform: 'translateY(0px)',
     *         opacity: 1
     *     }
     * });*/

    /* $('.masonry').masonry();*/

    /* if ($.fn.imagesLoaded) {
     *     masonry.imagesLoaded().progress(function(instance, image) {
     *         masonry.masonry('layout');
     *         resizeImages();
     *     });
     *     $(window).on('resize', function() {
     *         masonry.masonry('layout');
     *         resizeImages();
     *     });
     * }*/

    //button to load more posts via ajax
    /* $('[data-load-more-posts]').on('click', function(){
     *     var $this = $(this);
     *     $this.data('active-text', $this.text()).text("Loading posts...").attr('disabled', true);
     *     var offset = $this.data("offset");
     *     var postsPerPage = $this.data("posts-per-page");
     *     getMorePosts(offset, postsPerPage).then(function(res){
     *         var $res = $(res);
     *         masonry.append( $res ).masonry( 'appended', $res );
     *         var newOffset = offset+postsPerPage;
     *         var newParams = '?offset='+ newOffset;
     *         window.history.pushState({urlPath:newParams},"",newParams)
     *         $this.data("offset",newOffset);
     *         $this.text($this.data('active-text')).attr('disabled', false);
     *     })
     * })*/

    royal_filterPosts();
}

function royal_filterPosts() {
    $('#search').change(function() {
        var filter = $(this).val();

        // Extend :contains selector
        jQuery.expr[':'].contains = function(a, i, m) {
            return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
        };

        // Hides cards that don't match input
        $("#feed .content .card-container:visible article .card-title a:not(:contains("+filter+"))").closest('.card-container').fadeOut();

        // Shows cards that match input
        $("#feed .content .card-container:not(:visible) article .card-title a:contains("+filter+")").closest('.card-container').fadeIn();

        // Add empty message when if no posts are visible
        var message = $('#feed #no-results');
        if ($("#feed .content .card-container:visible article .card-title a:contains("+filter+")").size() == 0) {
            if (message.hasClass('hide')) {
                setTimeout(function() {
                    $('#feed #no-results').removeClass('hide');
                }, 400);
            }
            message.find('.target').text(filter);
        } else { message.addClass('hide'); }

    }).keyup(function() {
        $(this).change();
    });
}

})(jQuery);