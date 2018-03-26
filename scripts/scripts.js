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

    // Form status
    /* $('form#login .form-status').status();*/


    // ---- CONTROLS ---- //
    // Transitions to login form
    $('[data-goto-login]').on('click', function() {
        // Desktop animation
        $('#loginModal .splash').removeClass('shift');
        // Mobile portrait animation
        $('#loginModal #login').removeClass('toggle-login');
        $('#loginModal #passwordLost').addClass('toggle-login');
        $('#loginModal .reset').addClass('toggle-login');
    })

    // Transition to password recovery form
    $('[data-goto-lost]').on('click', function() {
        // Desktop animation
        $('#loginModal .splash').addClass('shift');
        // Mobile portrait animation
        $('#loginModal #login').addClass('toggle-login');
        $('#loginModal #passwordLost').removeClass('toggle-login');
        $('#loginModal .reset').addClass('toggle-login');
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
    /* if ($('.hero-container, .parallax-container').length) {
     *     $('nav').addClass('transparent');
     * }*/
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
}

// Init Status prototype
Status.init.prototype = Status.prototype;


$.fn.status = function(methodOrOptions) {
    Status(this, arguments[0]);
    return this;
}

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhY3QuanMiLCJsb2dpbi5qcyIsIm1lbnVzLmpzIiwibW9kYWxzLmpzIiwibm90aWNlLmpzIiwicGFnZS1idWlsZGVyLmpzIiwicXVpei5qcyIsInJlYWR5LmpzIiwicmVzaXplLmpzIiwic2Nyb2xsLmpzIiwic2lkZWJhci5qcyIsInN0YXR1cy5qcyIsIndvb2NvbW1lcmNlLmpzIiwiZmVlZC9hamF4LmpzIiwiZmVlZC9hcnRpY2xlLmpzIiwiZmVlZC9mZWVkLmpzIiwiZmVlZC9maWx0ZXJQb3N0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiByb3lhbF9jb250YWN0KCkge1xyXG4gICAgLy8gU3VibWlzc2lvblxyXG4gICAgJCgnZm9ybScpLnN1Ym1pdChmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBmaXJzdCAgID0gJChcIiNmaXJzdFwiKS52YWwoKTtcclxuICAgICAgICB2YXIgbGFzdCAgICA9ICQoXCIjbGFzdFwiKS52YWwoKTtcclxuICAgICAgICB2YXIgcGhvbmUgICA9ICQoXCIjcGhvbmVcIikudmFsKCk7XHJcbiAgICAgICAgdmFyIGVtYWlsICAgPSAkKFwiI2VtYWlsXCIpLnZhbCgpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gJChcIiNtZXNzYWdlXCIpLnZhbCgpO1xyXG4gICAgICAgIHZhciBzdWJtaXQgID0gJChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKTtcclxuICAgICAgICB2YXIgY2lyY2xlcyA9ICQoXCIucHJlbG9hZGVyLXdyYXBwZXJcIikucGFyZW50KCk7XHJcbiAgICAgICAgdmFyIGNvbmZpcm0gPSAkKFwiLmNvbmZpcm1cIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gUmVtb3ZlcyBleGlzdGluZyB2YWxpZGF0aW9uXHJcbiAgICAgICAgY29uZmlybS5yZW1vdmVDbGFzcygncGluayBncmVlbicpLmFkZENsYXNzKCdoaWRlJykuZmluZCgncCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoJy5pbnZhbGlkLCAudmFsaWQnKS5yZW1vdmVDbGFzcygnaW52YWxpZCB2YWxpZCcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFZhbGlkYXRpb25cclxuICAgICAgICBpZiAoZmlyc3QgPT0gXCJcIiB8fCBsYXN0ID09IFwiXCIgfHwgcGhvbmUgPT0gXCJcIiB8fCBlbWFpbCA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNvbmZpcm0uYWRkQ2xhc3MoJ3BpbmsnKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5Pb3BzLCBsb29rcyBsaWtlIHdlJ3JlIG1pc3Npbmcgc29tZSBpbmZvcm1hdGlvbi4gUGxlYXNlIGZpbGwgb3V0IGFsbCB0aGUgZmllbGRzLjwvcD5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBUb2dnbGUgUHJlbG9hZGVyXHJcbiAgICAgICAgICAgIHN1Ym1pdC5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICBjaXJjbGVzLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi93cC1hZG1pbi9hZG1pbi1hamF4LnBocFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2NvbnRhY3RfdXNfZm9ybScsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IGZpcnN0LFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3Q6IGxhc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLnJlcGxhY2UoLyg/OlxcclxcbnxcXHJ8XFxuKS9nLCAnPGJyLz4nKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSA9PSBcIjBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFcnJvciBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpcm0uYWRkQ2xhc3MoJ3BpbmsnKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5Pb3BzLCBsb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0hIENoZWNrIGJhY2sgbGF0ZXIgb3IgZW1haWwgdXMgZGlyZWN0bHkgYXQgPGEgaHJlZj0nbWFpbHRvOnNjb3R0QHJveWFsbGVnYWxzb2x1dGlvbnMuY29tJz5zY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbTwvYT4uPC9wPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Nlc3MgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdncmVlbicpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChcIjxwPlN1Y2Nlc3MhIENoZWNrIHlvdXIgZW1haWwuIFdlJ2xsIGJlIGluIHRvdWNoIHNob3J0bHkuPC9wPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm0uYWRkQ2xhc3MoJ3BpbmsnKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5Pb3BzLCBsb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0hIENoZWNrIGJhY2sgbGF0ZXIgb3IgZW1haWwgdXMgZGlyZWN0bHkgYXQgPGEgaHJlZj0nbWFpbHRvOnNjb3R0QHJveWFsbGVnYWxzb2x1dGlvbnMuY29tJz5zY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbTwvYT4uPC9wPlwiKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdmb3JtJylbMF0ucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBNYXRlcmlhbGl6ZS51cGRhdGVUZXh0RmllbGRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnZm9ybSB0ZXh0YXJlYScpLnRyaWdnZXIoJ2F1dG9yZXNpemUnKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBUb2dnbGUgUHJlbG9hZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlcy5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdC5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4iLCJmdW5jdGlvbiByb3lhbF9sb2dpbigpIHtcclxuXHJcbiAgICAvLyBNYXRlcmlhbGl6ZSBNb2RhbFxyXG4gICAgJCgnI2xvZ2luTW9kYWwnKS5tb2RhbCh7XHJcbiAgICAgICAgaW5EdXJhdGlvbjogMjAwLFxyXG4gICAgICAgIG91dER1cmF0aW9uOiAxNTAsXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjbG9naW5Nb2RhbCAubG9naW4nKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgekluZGV4OiAxLFxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCgnI2xvZ2luTW9kYWwgLnNwbGFzaCcpLnJlbW92ZUNsYXNzKCdzaGlmdCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEZvcm0gc3RhdHVzXHJcbiAgICAvKiAkKCdmb3JtI2xvZ2luIC5mb3JtLXN0YXR1cycpLnN0YXR1cygpOyovXHJcblxyXG5cclxuICAgIC8vIC0tLS0gQ09OVFJPTFMgLS0tLSAvL1xyXG4gICAgLy8gVHJhbnNpdGlvbnMgdG8gbG9naW4gZm9ybVxyXG4gICAgJCgnW2RhdGEtZ290by1sb2dpbl0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBEZXNrdG9wIGFuaW1hdGlvblxyXG4gICAgICAgICQoJyNsb2dpbk1vZGFsIC5zcGxhc2gnKS5yZW1vdmVDbGFzcygnc2hpZnQnKTtcclxuICAgICAgICAvLyBNb2JpbGUgcG9ydHJhaXQgYW5pbWF0aW9uXHJcbiAgICAgICAgJCgnI2xvZ2luTW9kYWwgI2xvZ2luJykucmVtb3ZlQ2xhc3MoJ3RvZ2dsZS1sb2dpbicpO1xyXG4gICAgICAgICQoJyNsb2dpbk1vZGFsICNwYXNzd29yZExvc3QnKS5hZGRDbGFzcygndG9nZ2xlLWxvZ2luJyk7XHJcbiAgICAgICAgJCgnI2xvZ2luTW9kYWwgLnJlc2V0JykuYWRkQ2xhc3MoJ3RvZ2dsZS1sb2dpbicpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBUcmFuc2l0aW9uIHRvIHBhc3N3b3JkIHJlY292ZXJ5IGZvcm1cclxuICAgICQoJ1tkYXRhLWdvdG8tbG9zdF0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBEZXNrdG9wIGFuaW1hdGlvblxyXG4gICAgICAgICQoJyNsb2dpbk1vZGFsIC5zcGxhc2gnKS5hZGRDbGFzcygnc2hpZnQnKTtcclxuICAgICAgICAvLyBNb2JpbGUgcG9ydHJhaXQgYW5pbWF0aW9uXHJcbiAgICAgICAgJCgnI2xvZ2luTW9kYWwgI2xvZ2luJykuYWRkQ2xhc3MoJ3RvZ2dsZS1sb2dpbicpO1xyXG4gICAgICAgICQoJyNsb2dpbk1vZGFsICNwYXNzd29yZExvc3QnKS5yZW1vdmVDbGFzcygndG9nZ2xlLWxvZ2luJyk7XHJcbiAgICAgICAgJCgnI2xvZ2luTW9kYWwgLnJlc2V0JykuYWRkQ2xhc3MoJ3RvZ2dsZS1sb2dpbicpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBBdXRvLW9wZW5zIG1vZGFsIGlmIHVzZXIgaXMgY29taW5nIHZpYSBhIHJlc2V0IGxpbmtcclxuICAgIGlmIChsb2NhdGlvbi5zZWFyY2guaW5jbHVkZXMoXCJhY3Rpb249cnBcIikpIHtcclxuICAgICAgICAkKCcjbG9naW5Nb2RhbCAubG9naW4nKS5jc3Moe1xyXG4gICAgICAgICAgICB6SW5kZXg6IDAsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2xvZ2luTW9kYWwnKS5tb2RhbCgnb3BlbicpO1xyXG4gICAgICAgIH0sIDc1MCk7XHJcbiAgICB9XHJcbiAgICAkKCcjbG9naW5Nb2RhbCAucmVzZXQgI2xvc3QtbGluaycpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNsb2dpbk1vZGFsIC5sb2dpbicpLmNzcyhcInotaW5kZXhcIiwgMSkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgfSwgMzUwKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyAtLS0tIE1FVEhPRFMgLS0tLSAvL1xyXG4gICAgLy8gUGVyZm9ybSBBSkFYIGxvZ2luIG9uIGZvcm0gc3VibWl0XHJcbiAgICAkKCdmb3JtI2xvZ2luJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvLyBIaWRlIGVycm9yIGFuZCBzdWNlc3MgbWVzc2FnZSBcclxuICAgICAgICAkKCdmb3JtI2xvZ2luIC5zdGF0dXMgLmVycm9yLCBmb3JtI2xvZ2luIC5zdGF0dXMgLnN1Y2Nlc3MnKS5hZGRDbGFzcygnaGlkZScpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgLy8gRmFkZW91dCB0aGUgbG9naW4gYnV0dG9uIGFuZCBmb3JnZXQgbGlua1xyXG4gICAgICAgICQoXCJmb3JtI2xvZ2luIC5zdGF0dXMtc3dhcFwiKS5mYWRlT3V0KDMwMCk7XHJcblxyXG4gICAgICAgIC8vIERpc3BsYXkgbG9hZGluZyBzcGlubmVyXHJcbiAgICAgICAgJChcImZvcm0jbG9naW4gLnN0YXR1cyAubG9hZGluZ1wiKS5kZWxheSgzNTApLmhpZGUoKS5yZW1vdmVDbGFzcygnaGlkZScpLmZhZGVJbigzMDApO1xyXG5cclxuICAgICAgICAvLyBEaXNwbGF5IHRleHQgbmV4dCB0byBsb2FkaW5nIHNwaW5uZXIgXHJcbiAgICAgICAgJCgnZm9ybSNsb2dpbiAuc3RhdHVzIC5sb2FkaW5nIC5tZXNzYWdlJykudGV4dChcIldlJ3JlIGxvZ2dpbmcgeW91IGluIVwiKTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgdXJsOiAnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgJ2FjdGlvbic6ICdhamF4X2xvZ2luJyxcclxuICAgICAgICAgICAgICAgICd1c2VybmFtZSc6ICQoJ2Zvcm0jbG9naW4gI2xvZ2luVXNlcm5hbWUnKS52YWwoKSxcclxuICAgICAgICAgICAgICAgICdwYXNzd29yZCc6ICQoJ2Zvcm0jbG9naW4gI2xvZ2luUGFzc3dvcmQnKS52YWwoKSxcclxuICAgICAgICAgICAgICAgICdyZW1lbWJlcic6ICQoJ2Zvcm0jbG9naW4gI2xvZ2luUmVtZW1iZXInKS5hdHRyKFwiY2hlY2tlZFwiKSxcclxuICAgICAgICAgICAgICAgICdsb2dpblNlY3VyaXR5JzogJCgnZm9ybSNsb2dpbiAjbG9naW5TZWN1cml0eScpLnZhbCgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEubG9nZ2VkaW4gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gSGlkZSBzdWNlc3MgbWVzc2FnZSBcclxuICAgICAgICAgICAgICAgICQoJ2Zvcm0jbG9naW4gLnN0YXR1cyAuc3VjY2VzcycpLnJlbW92ZUNsYXNzKCdoaWRlJykuc2hvdygpLmRlbGF5KDUwMDApLmZhZGVPdXQoMzAwKTtcclxuICAgICAgICAgICAgICAgICQoJ2Zvcm0jbG9naW4gLnN0YXR1cyAuc3VjY2VzcyAubWVzc2FnZScpLnRleHQoZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gRGlzcGxheSB0aGUgc3RhdHVzIGRpdlxyXG4gICAgICAgICAgICAgICAgJChcIi5zdGF0dXMtc3dhcFwiKS5kZWxheSgzNTApLmZhZGVJbigzMDApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhpZGUgZXJyb3IgbWVzc2FnZSBcclxuICAgICAgICAgICAgICAgICQoJ2Zvcm0jbG9naW4gLnN0YXR1cyAuZXJyb3InKS5yZW1vdmVDbGFzcygnaGlkZScpLnNob3coKS5kZWxheSg1MDAwKS5mYWRlT3V0KDMwMCk7XHJcbiAgICAgICAgICAgICAgICAkKCdmb3JtI2xvZ2luIC5zdGF0dXMgLmVycm9yIC5tZXNzYWdlJykudGV4dChkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIEhpZGUgZXJyb3IgbWVzc2FnZSBcclxuICAgICAgICAgICAgJCgnZm9ybSNsb2dpbiAuc3RhdHVzIC5lcnJvcicpLnJlbW92ZUNsYXNzKCdoaWRlJykuc2hvdygpLmRlbGF5KDUwMDApLmZhZGVPdXQoMzAwKTtcclxuICAgICAgICAgICAgJCgnZm9ybSNsb2dpbiAuc3RhdHVzIC5lcnJvciAubWVzc2FnZScpLnRleHQoZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICB9KS5hbHdheXMoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAvLyBIaWRlIHNwaW5uZXIgYW5kIGxvZ2dpbmcgaW4gdGV4dFxyXG4gICAgICAgICAgICAkKFwiLnN0YXR1cyAubG9hZGluZ1wiKS5mYWRlT3V0KDMwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTsgIFxyXG5cclxuICAgIC8vIFBlcmZvcm0gQUpBWCBsb2dpbiBvbiBmb3JtIHN1Ym1pdFxyXG4gICAgJCgnZm9ybSNwYXNzd29yZExvc3QnKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHVybDogJy93cC1hZG1pbi9hZG1pbi1hamF4LnBocCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICdhY3Rpb24nOiAnbG9zdF9wYXNzJyxcclxuICAgICAgICAgICAgICAgICd1c2VyX2xvZ2luJzogJCgnZm9ybSNwYXNzd29yZExvc3QgI2xvc3RVc2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgJ2xvc3RTZWN1cml0eSc6ICQoJ2Zvcm0jcGFzc3dvcmRMb3N0ICNsb3N0U2VjdXJpdHknKS52YWwoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdmb3JtI3Bhc3N3b3JkTG9zdCBwLnN0YXR1cycpLnRleHQoZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnZm9ybSNwYXNzd29yZFJlc2V0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHVybDogJy93cC1hZG1pbi9hZG1pbi1hamF4LnBocCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogICAgICAgICAncmVzZXRfcGFzcycsXHJcbiAgICAgICAgICAgICAgICBwYXNzMTpcdFx0JCgnZm9ybSNwYXNzd29yZFJlc2V0ICNyZXNldFBhc3MxJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzMjpcdFx0JCgnZm9ybSNwYXNzd29yZFJlc2V0ICNyZXNldFBhc3MyJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICB1c2VyX2tleTpcdCQoJ2Zvcm0jcGFzc3dvcmRSZXNldCAjdXNlcl9rZXknKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHVzZXJfbG9naW46XHQkKCdmb3JtI3Bhc3N3b3JkUmVzZXQgI3VzZXJfbG9naW4nKS52YWwoKSxcclxuICAgICAgICAgICAgICAgICdyZXNldFNlY3VyaXR5JzogJCgnZm9ybSNwYXNzd29yZFJlc2V0ICNyZXNldFNlY3VyaXR5JykudmFsKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAkKCdmb3JtI3Bhc3N3b3JkTG9zdCBwLnN0YXR1cycpLnRleHQoZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUGVyZm9ybSBBSkFYIGxvZ2luIG9uIGZvcm0gc3VibWl0XHJcbiAgICAkKCdmb3JtI2xvZ291dCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICB1cmw6ICcvd3AtYWRtaW4vYWRtaW4tYWpheC5waHAnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAnYWN0aW9uJzogJ2FqYXhfbG9nb3V0JyxcclxuICAgICAgICAgICAgICAgICdsb2dvdXRTZWN1cml0eSc6ICQoJ2Zvcm0jbG9nb3V0ICNsb2dvdXRTZWN1cml0eScpLnZhbCgpIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubG9nZ2Vkb3V0ID09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG4iLCJmdW5jdGlvbiByb3lhbF9tZW51cygpIHtcclxuICAgIC8vIE1vYmlsZSBNZW51XHJcbiAgICAkKFwiI21vYmlsZS1tZW51XCIpLnNpZGVOYXYoe1xyXG4gICAgICAgIG1lbnVXaWR0aDogMjYwLFxyXG4gICAgICAgIGVkZ2U6ICdyaWdodCdcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBEcm9wZG93bnNcclxuICAgICQoXCJuYXYgLmRyb3Bkb3duLWJ1dHRvblwiKS5kcm9wZG93bih7XHJcbiAgICAgICAgY29uc3RyYWluV2lkdGg6IGZhbHNlXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gSGVybyBEaXNwbGF5c1xyXG4gICAgLyogaWYgKCQoJy5oZXJvLWNvbnRhaW5lciwgLnBhcmFsbGF4LWNvbnRhaW5lcicpLmxlbmd0aCkge1xyXG4gICAgICogICAgICQoJ25hdicpLmFkZENsYXNzKCd0cmFuc3BhcmVudCcpO1xyXG4gICAgICogfSovXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByb3lhbF90b2dnbGVfbWVudXModG9wKSB7XHJcbiAgICBpZiAodG9wID4gNSAmJiAkKCduYXYnKS5oYXNDbGFzcygndHJhbnNwYXJlbnQnKSkge1xyXG4gICAgICAgICQoJ25hdicpLnJlbW92ZUNsYXNzKCd0cmFuc3BhcmVudCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodG9wIDwgNSAmJiAhJCgnbmF2JykuaGFzQ2xhc3MoJ3RyYW5zcGFyZW50JykpIHtcclxuICAgICAgICAkKCduYXYnKS5hZGRDbGFzcygndHJhbnNwYXJlbnQnKTtcclxuICAgIH1cclxufVxyXG4iLCJmdW5jdGlvbiByb3lhbF9tb2RhbHMoKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0b3BsYXkodmlkZW8pIHtcclxuICAgICAgICB2aWRlby5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCd7XCJldmVudFwiOlwiY29tbWFuZFwiLFwiZnVuY1wiOlwicGxheVZpZGVvXCIsXCJhcmdzXCI6XCJcIn0nLCAnKicpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYXV0b3N0b3AodmlkZW8pIHtcclxuICAgICAgICB2aWRlby5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCd7XCJldmVudFwiOlwiY29tbWFuZFwiLFwiZnVuY1wiOlwicGF1c2VWaWRlb1wiLFwiYXJnc1wiOlwiXCJ9JywgJyonKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBCbG9nIFZpZGVvc1xyXG4gICAgaWYgKCQoJyNmZWVkJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQoJy5tb2RhbCcpLm1vZGFsKHtcclxuICAgICAgICAgICAgcmVhZHk6IGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJG1vZGFsID0gJChtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlkZW9TcmMgPSAkbW9kYWwuZGF0YSgndmlkZW8tc3JjJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGlmcmFtZSA9ICRtb2RhbC5maW5kKCdpZnJhbWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkaWZyYW1lICYmICEkaWZyYW1lLmF0dHIoJ3NyYycpKXtcclxuICAgICAgICAgICAgICAgICAgICAkaWZyYW1lLmF0dHIoJ3NyYycsIHZpZGVvU3JjICsgXCI/ZW5hYmxlanNhcGk9MSZzaG93aW5mbz0wXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgJGlmcmFtZS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheSgkaWZyYW1lLmdldCgwKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihtb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRtb2RhbCA9ICQobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRpZnJhbWUgPSAkbW9kYWwuZmluZCgnaWZyYW1lJyk7XHJcbiAgICAgICAgICAgICAgICBhdXRvc3RvcCgkaWZyYW1lLmdldCgwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCQoJ1toZXJvLXZpZGVvLW1vZGFsXScpLmxlbmd0aCA+IDAgKXtcclxuICAgICAgICAvL1dlIG5lZWQgdG8gbW92ZSB0aGUgZG9tIGVsZW1lbnQgdG8gdGhlIGJvZHkgc28gdGhlIHotaW5kZXggd29ya3MgYW5kIHRoZSBcclxuICAgICAgICAvL21vZGFsIGlzIG5vdCBkaXNwbGF5ZWQgYmVsb3cgdGhlIG92ZXJsYXlcclxuICAgICAgICAkKFwiW2hlcm8tdmlkZW8tbW9kYWxdXCIpLmRldGFjaCgpLmFwcGVuZFRvKCdib2R5Jyk7XHJcblxyXG4gICAgICAgICQoJ1toZXJvLXZpZGVvLW1vZGFsXScpLm1vZGFsKHtcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJG1vZGFsID0gJChtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGlmcmFtZSA9ICRtb2RhbC5maW5kKCdpZnJhbWUnKTtcclxuICAgICAgICAgICAgICAgIGF1dG9zdG9wKCRpZnJhbWUuZ2V0KDApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyBcclxuICAgIH1cclxufVxyXG4iLCIvLyBNb3ZlcyB0aGUgV29vQ29tbWVyY2Ugbm90aWNlIHRvIHRoZSB0b3Agb2YgdGhlIHBhZ2VcclxuZnVuY3Rpb24gcm95YWxfbW92ZU5vdGljZSgpIHtcclxuICAgICQoJy5ub3RpY2UnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykucHJlcGVuZFRvKCQoJ21haW4nKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbi8vIE1vdmVzIG5ld2x5IGFkZGVkIFdvb0NvbW1lcmNlIGNhcnQgbm90aWNlcyB0byB0aGUgdG9wIG9mIHRoZSBwYWdlXHJcbmZ1bmN0aW9uIHJveWFsX3JlZnJlc2hDYXJ0Tm90aWNlKCkge1xyXG4gICAgdmFyIGNhcnRMb29wID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQoJ21haW4gLmNvbnRhaW5lciAubm90aWNlJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByb3lhbF9tb3ZlTm90aWNlKCk7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoY2FydExvb3ApO1xyXG4gICAgICAgIH1cclxuICAgIH0sIDI1MCk7XHJcbn1cclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKCdbZGF0YS1uZXdzbGV0dGVyLWZvcm1dJykuZWFjaChmdW5jdGlvbihpbmRleCwgZm9ybSl7XHJcbiAgICAgICAgJGZvcm0gPSAkKGZvcm0pO1xyXG4gICAgICAgICRmb3JtLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkZW1haWwgPSAkZm9ybS5maW5kKFwiW25hbWU9ZW1haWxdXCIpLnZhbCgpO1xyXG4gICAgICAgICAgICAkdGhhbmtfeW91ID0gJGZvcm0uZmluZChcIltkYXRhLWZvcm0tc3VjY2Vzc11cIilcclxuICAgICAgICAgICAgJGNvbnRlbnQgPSAkZm9ybS5maW5kKFwiW2RhdGEtZm9ybS1jb250ZW50XVwiKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJHRoYW5rX3lvdS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgJGNvbnRlbnQuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pO1xyXG4iLCJmdW5jdGlvbiByb3lhbF9xdWl6KCkge1xyXG5cclxuICAgIC8vIEFzc2V0IFByb3RlY3Rpb24gUXVpelxyXG4gICAgaWYgKCQoJyNhc3NldC1wcm90ZWN0aW9uLXF1aXonKS5sZW5ndGgpIHtcclxuICAgICAgICAvLyBNYXRlcmlhbGl6ZSBjYXJvdXNlbCBzZXR0aW5nc1xyXG4gICAgICAgICQoJy5jYXJvdXNlbC5jYXJvdXNlbC1zbGlkZXInKS5jYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIGZ1bGxXaWR0aDogdHJ1ZSxcclxuICAgICAgICAgICAgaW5kaWNhdG9yczp0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFF1ZXN0aW9ucyBwYW5lbCBkaXNwbGF5ICYgbmF2aWdhdGlvblxyXG4gICAgICAgICQoJy50b2dnbGUtc2VjdGlvbicpLmhpZGUoKTtcclxuICAgICAgICAkKCcuYnRuLXF1aXotdG9nZ2xlJykudW5iaW5kKCdjbGljaycpLmJpbmQoJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKCcudG9nZ2xlLXNlY3Rpb24nKS5zbGlkZVRvZ2dsZSgnZmFzdCcsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmKCQoJy50b2dnbGUtc2VjdGlvbicpLmNzcygnZGlzcGxheScpPT0nYmxvY2snKXtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuYnRuLXF1aXotdG9nZ2xlJykuaHRtbChcIkNMT1NFIFFVSVpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLmFkZENsYXNzKFwiY2xvc2VcIik7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuYnRuLXF1aXotdG9nZ2xlJykuaHRtbChcIlRBS0UgVEhFIFFVSVpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLnJlbW92ZUNsYXNzKFwiY2xvc2VcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBSZXN1bHRzICYgZW1haWxcclxuICAgICAgICAvLyBDb2RlIGdvZXMgaGVyZS4uLlxyXG4gICAgfVxyXG5cclxufVxyXG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyAtLS0tIEdMT0JBTCAtLS0tIC8vXHJcbiAgICByb3lhbF9tZW51cygpO1xyXG4gICAgcm95YWxfbG9naW4oKTtcclxuICAgIHJveWFsX3NpZGViYXIoKTtcclxuXHJcblxyXG4gICAgLy8gLS0tLSBHRU5FUkFMIC0tLS0gLy9cclxuICAgIGlmICgkLmZuLnBhcmFsbGF4ICYmICQoJy5wYXJhbGxheCcpLmxlbmd0aCl7XHJcbiAgICAgICAgJCgnLnBhcmFsbGF4JykucGFyYWxsYXgoKTtcclxuICAgIH1cclxuICAgIGlmICgkLmZuLmNhcm91c2VsICYmICQoJy5jYXJvdXNlbC1zbGlkZXInKS5sZW5ndGgpe1xyXG4gICAgICAgICQoJy5jYXJvdXNlbC1zbGlkZXInKS5jYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzNTAsXHJcbiAgICAgICAgICAgIGZ1bGxXaWR0aDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBcclxuXHJcblxyXG4gICAgLy8gLS0tLSBNT0JJTEUgLS0tLSAvL1xyXG5cclxuXHJcbiAgICAvLyAtLS0tIExBTkRJTkcgUEFHRVMgLS0tLSAvL1xyXG4gICAgaWYgKCQoJyNob21lJykubGVuZ3RoKSB7XHJcbiAgICAgICAgJCgnI2hvbWUgLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKHtcclxuICAgICAgICAgICAgZHVyYXRpb246IDM1MCxcclxuICAgICAgICAgICAgZnVsbFdpZHRoOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0VGltZW91dChhdXRvcGxheSwgOTAwMCk7XHJcbiAgICAgICAgZnVuY3Rpb24gYXV0b3BsYXkoKSB7XHJcbiAgICAgICAgICAgICQoJyNob21lIC5jYXJvdXNlbC1zbGlkZXInKS5jYXJvdXNlbCgnbmV4dCcpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGF1dG9wbGF5LCAxMjAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyAtLS0tIFBST01PVElPTlMgLS0tLSAvL1xyXG4gICAgaWYgKCQoJy5tb2RhbC10cmlnZ2VyJykubGVuZ3RoKSB7XHJcbiAgICAgICAgcm95YWxfbW9kYWxzKCk7XHJcbiAgICB9XHJcbiAgICAvKiBpZiAoJCgnLnF1aXonKS5sZW5ndGgpe1xyXG4gICAgICogICAgIHJveWFsX3F1aXooKTtcclxuICAgICAqIH0qL1xyXG5cclxuXHJcbiAgICAvLyAtLS0tIEZFRUQgLS0tLSAvL1xyXG4gICAgaWYgKCQoJyNmZWVkJykubGVuZ3RoKSB7XHJcbiAgICAgICAgcm95YWxfZmVlZCgpO1xyXG4gICAgfVxyXG4gICAgaWYgKCQoJ21haW4jYXJ0aWNsZScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByb3lhbF9hcnRpY2xlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIC0tLS0gV09PQ09NTUVSQ0UgLS0tLSAvL1xyXG4gICAgaWYgKCQoJ2JvZHkud29vY29tbWVyY2UnKS5sZW5ndGgpIHtcclxuICAgICAgICByb3lhbF93b29jb21tZXJjZSgpO1xyXG4gICAgfVxyXG59KTtcclxuIiwiLyogJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuICogICAgIGlmICgkKCcubXktYWNjb3VudCcpLmxlbmd0aCkge1xyXG4gKiAgICAgfVxyXG4gKiB9KSovXHJcbiIsInZhciBkaWRTY3JvbGw7XHJcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKXtcclxuICAgIGRpZFNjcm9sbCA9IHRydWU7XHJcbiAgICB2YXIgdG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgIC8qIGlmICgkKCcuaGVyby1jb250YWluZXIsIC5wYXJhbGxheC1jb250YWluZXInKS5sZW5ndGgpIHtcclxuICAgICAqICAgICByb3lhbF90b2dnbGVfbWVudXModG9wKTtcclxuICAgICAqIH0qL1xyXG5cclxuICAgIGlmICgkKCcuY29uc3VsdGF0aW9uJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHZhciBoZXJvID0gJCgnLmhlcm8tY29udGFpbmVyJykuaGVpZ2h0KCk7XHJcbiAgICAgICAgaWYgKHRvcCA+IGhlcm8gJiYgJCgnbmF2JykuaGFzQ2xhc3MoJ25vLXNoYWRvdycpKSB7XHJcbiAgICAgICAgICAgICQoJ25hdicpLnJlbW92ZUNsYXNzKCduby1zaGFkb3cnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodG9wIDwgaGVybyAmJiAhJCgnbmF2JykuaGFzQ2xhc3MoJ25vLXNoYWRvdycpKSB7XHJcbiAgICAgICAgICAgICQoJ25hdicpLmFkZENsYXNzKCduby1zaGFkb3cnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZigkKCcjZmVlZCcpLmxlbmd0aCAmJiAkKCdbZGF0YS1sb2FkLW1vcmUtc3Bpbm5lcl0nKS5oYXNDbGFzcygnaGlkZScpKXtcclxuICAgICAgICBpZigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgKyAkKCdmb290ZXInKS5oZWlnaHQoKSA+ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XHJcbiAgICAgICAgICAgIHZhciAkc3Bpbm5lciA9ICQoJ1tkYXRhLWxvYWQtbW9yZS1zcGlubmVyXScpO1xyXG4gICAgICAgICAgICAkc3Bpbm5lci5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gJHNwaW5uZXIuZGF0YShcIm9mZnNldFwiKTtcclxuICAgICAgICAgICAgdmFyIHBvc3RzUGVyUGFnZSA9ICRzcGlubmVyLmRhdGEoXCJwb3N0cy1wZXItcGFnZVwiKTtcclxuICAgICAgICAgICAgZ2V0TW9yZVBvc3RzKG9mZnNldCwgcG9zdHNQZXJQYWdlKS50aGVuKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHJlcyA9ICQocmVzKTtcclxuICAgICAgICAgICAgICAgICQoJy5tYXNvbnJ5JykuYXBwZW5kKCAkcmVzICkubWFzb25yeSggJ2FwcGVuZGVkJywgJHJlcyApO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld09mZnNldCA9IG9mZnNldCtwb3N0c1BlclBhZ2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3UGFyYW1zID0gJz9vZmZzZXQ9JysgbmV3T2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt1cmxQYXRoOm5ld1BhcmFtc30sXCJcIixuZXdQYXJhbXMpXHJcbiAgICAgICAgICAgICAgICAkc3Bpbm5lci5kYXRhKFwib2Zmc2V0XCIsbmV3T2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICRzcGlubmVyLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXsgXHJcbiAgICAgICAgICAgICAgICAkc3Bpbm5lci5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgIGlmIChkaWRTY3JvbGwpIHtcclxuICAgICAgICAvKiB0b2dnbGVOYXYoKTsqL1xyXG4gICAgICAgIGRpZFNjcm9sbCA9IGZhbHNlO1xyXG4gICAgfVxyXG59LCAyNTApO1xyXG4iLCJmdW5jdGlvbiByb3lhbF9zaWRlYmFyKCkge1xyXG4gICAgLy8gU2hvdyBzaWRlYmFyIGJ5IGRlZmF1bHQgb24gZmVlZCBwYWdlc1xyXG4gICAgaWYgKCQoJyNmZWVkJykubGVuZ3RoKSB7XHJcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzaWRlYmFyLW9wZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUb2dnbGUgc2lkZWJhciBvbiBjbGlja1xyXG4gICAgJCgnI3NpZGViYXItZmFiJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpZGViYXItb3BlbicpO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiLy8gQ2hhaW5hYmxlIHN0YXR1cyB2YXJpYWJsZVxyXG4vLyBleDogZWxlbS5zdGF0dXMubWV0aG9kKCk7XHJcbnZhciBTdGF0dXMgPSBmdW5jdGlvbihlbGVtLCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IFN0YXR1cy5pbml0KGVsZW0sIG9wdGlvbnMpO1xyXG59XHJcblxyXG5cclxuLy8gU3RhdHVzIE1ldGhvZHNcclxuLy8gUGxhY2VkIG9uIHByb3RvdHlwZSB0byBpbXByb3ZlIHBlcmZvcm1hbmNlXHJcblN0YXR1cy5wcm90b3R5cGUgPSB7XHJcbiAgICBzdGFydDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCcuc3RhdHVzLXN3YXAnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLnN0YXR1cycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVuZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCcuc3RhdHVzJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJy5zdGF0dXMtc3dhcCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnZGl2JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJy5sb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnZGl2JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJy5lcnJvcicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnZGl2JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJy5zdWNjZXNzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vIEluaXQgU3RhdHVzXHJcblN0YXR1cy5pbml0ID0gZnVuY3Rpb24oZWxlbSwgb3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIF9kZWZhdWx0cyA9IHtcclxuICAgICAgICBsb2FkZXI6ICdzcGlubmVyJyxcclxuICAgICAgICByZWFkeTogdW5kZWZpbmVkXHJcbiAgICB9XHJcbiAgICBzZWxmLmVsZW0gPSBlbGVtIHx8ICcnO1xyXG4gICAgc2VsZi5vcHRpb25zID0gJC5leHRlbmQoe30sIF9kZWZhdWx0cywgb3B0aW9ucyk7XHJcbn1cclxuXHJcbi8vIEluaXQgU3RhdHVzIHByb3RvdHlwZVxyXG5TdGF0dXMuaW5pdC5wcm90b3R5cGUgPSBTdGF0dXMucHJvdG90eXBlO1xyXG5cclxuXHJcbiQuZm4uc3RhdHVzID0gZnVuY3Rpb24obWV0aG9kT3JPcHRpb25zKSB7XHJcbiAgICBTdGF0dXModGhpcywgYXJndW1lbnRzWzBdKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59XHJcbiIsImZ1bmN0aW9uIHJveWFsX3dvb2NvbW1lcmNlKCkge1xyXG5cclxuICAgIC8vIC0tLS0gTm90aWNlcyAtLS0tIC8vXHJcbiAgICBpZiAoJCgnLm5vdGljZScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByb3lhbF9tb3ZlTm90aWNlKCk7XHJcbiAgICB9XHJcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCd1cGRhdGVkX2NhcnRfdG90YWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcm95YWxfbW92ZU5vdGljZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gLS0tLSBQcm9kdWN0cyAtLS0tIC8vXHJcbiAgICBpZiAoJCgnbWFpbiNwcm9kdWN0JykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQoJ3NlbGVjdCcpLm1hdGVyaWFsX3NlbGVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0gQ2FydCAtLS0tIC8vXHJcbiAgICBpZiAoJCgnLndvb2NvbW1lcmNlLWNhcnQtZm9ybScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKCcucHJvZHVjdC1yZW1vdmUgYScpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByb3lhbF9yZWZyZXNoQ2FydE5vdGljZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0gQ2hlY2tvdXQgLS0tLS0gLy9cclxuICAgIC8qICQoJyNwYXltZW50IFt0eXBlPXJhZGlvXScpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICogICAgIGNvbnNvbGUubG9nKCdjbGljaycpO1xyXG4gICAgICogfSk7Ki9cclxufVxyXG4iLCJmdW5jdGlvbiBnZXRNb3JlUG9zdHMob2Zmc2V0LCBwb3N0c19wZXJfcGFnZSwgY2F0ZWdvcnkpe1xyXG4gICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgIHVybDogJy93cC1hZG1pbi9hZG1pbi1hamF4LnBocCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnksXHJcbiAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0LFxyXG4gICAgICAgICAgICBwb3N0c19wZXJfcGFnZTogcG9zdHNfcGVyX3BhZ2UsXHJcbiAgICAgICAgICAgIGFjdGlvbjogJ3Jsc19tb3JlX3Bvc3RzJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbiIsImZ1bmN0aW9uIHJveWFsX2FydGljbGUoKSB7XHJcbiAgICAvLyBSZXNwb25zaXZlIGlGcmFtZXNcclxuICAgIC8qICQoJ2lmcmFtZScpLndyYXAoJzxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj48L2Rpdj4nKTsqL1xyXG5cclxuICAgIC8vIFBhcmFsbGF4XHJcbiAgICBpZiAoJCgnLnBhcmFsbGF4LWNvbnRhaW5lcicpLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciBmZWF0dXJlZCA9ICQoJy5mZWF0dXJlZC1pbWFnZSAucGFyYWxsYXgnKTtcclxuICAgICAgICB2YXIgcHJvbW90aW9uID0gJCgnLnByb21vdGlvbi1pbWFnZSAucGFyYWxsYXgnKTtcclxuXHJcbiAgICAgICAgaWYgKGZlYXR1cmVkLmxlbmd0aCAmJiBwcm9tb3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZlYXR1cmVkLnBhcmFsbGF4KCk7XHJcbiAgICAgICAgICAgIHByb21vdGlvbi5wYXJhbGxheCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChmZWF0dXJlZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZmVhdHVyZWQucGFyYWxsYXgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvbW90aW9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBwcm9tb3Rpb24ucGFyYWxsYXgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5wYXJhbGxheCcpLnBhcmFsbGF4KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImZ1bmN0aW9uIHJveWFsX2ZlZWQoKSB7XHJcbiAgICAvKiB2YXIgY29sdW1ucyA9ICAkKCcjZmVlZCAuY29sJykuZmlyc3QoKS5oYXNDbGFzcygnbTknKSA/IDIgOiAzO1xyXG4gICAgICogdmFyIG1hc29ucnkgPSAkKCcubWFzb25yeScpLm1hc29ucnkoe1xyXG4gICAgICogICAgIGl0ZW1TZWxlY3RvcjogJ2FydGljbGUnLFxyXG4gICAgICogICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcclxuICAgICAqICAgICBmaXRXaWR0aDogdHJ1ZSxcclxuICAgICAqICAgICBoaWRkZW5TdHlsZToge1xyXG4gICAgICogICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDEwMHB4KScsXHJcbiAgICAgKiAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAqICAgICB9LFxyXG4gICAgICogICAgIHZpc2libGVTdHlsZToge1xyXG4gICAgICogICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDBweCknLFxyXG4gICAgICogICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogfSk7Ki9cclxuXHJcbiAgICAvKiAkKCcubWFzb25yeScpLm1hc29ucnkoKTsqL1xyXG5cclxuICAgIC8qIGlmICgkLmZuLmltYWdlc0xvYWRlZCkge1xyXG4gICAgICogICAgIG1hc29ucnkuaW1hZ2VzTG9hZGVkKCkucHJvZ3Jlc3MoZnVuY3Rpb24oaW5zdGFuY2UsIGltYWdlKSB7XHJcbiAgICAgKiAgICAgICAgIG1hc29ucnkubWFzb25yeSgnbGF5b3V0Jyk7XHJcbiAgICAgKiAgICAgICAgIHJlc2l6ZUltYWdlcygpO1xyXG4gICAgICogICAgIH0pO1xyXG4gICAgICogICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgKiAgICAgICAgIG1hc29ucnkubWFzb25yeSgnbGF5b3V0Jyk7XHJcbiAgICAgKiAgICAgICAgIHJlc2l6ZUltYWdlcygpO1xyXG4gICAgICogICAgIH0pO1xyXG4gICAgICogfSovXHJcblxyXG4gICAgLy9idXR0b24gdG8gbG9hZCBtb3JlIHBvc3RzIHZpYSBhamF4XHJcbiAgICAvKiAkKCdbZGF0YS1sb2FkLW1vcmUtcG9zdHNdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAqICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICogICAgICR0aGlzLmRhdGEoJ2FjdGl2ZS10ZXh0JywgJHRoaXMudGV4dCgpKS50ZXh0KFwiTG9hZGluZyBwb3N0cy4uLlwiKS5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICogICAgIHZhciBvZmZzZXQgPSAkdGhpcy5kYXRhKFwib2Zmc2V0XCIpO1xyXG4gICAgICogICAgIHZhciBwb3N0c1BlclBhZ2UgPSAkdGhpcy5kYXRhKFwicG9zdHMtcGVyLXBhZ2VcIik7XHJcbiAgICAgKiAgICAgZ2V0TW9yZVBvc3RzKG9mZnNldCwgcG9zdHNQZXJQYWdlKS50aGVuKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgKiAgICAgICAgIHZhciAkcmVzID0gJChyZXMpO1xyXG4gICAgICogICAgICAgICBtYXNvbnJ5LmFwcGVuZCggJHJlcyApLm1hc29ucnkoICdhcHBlbmRlZCcsICRyZXMgKTtcclxuICAgICAqICAgICAgICAgdmFyIG5ld09mZnNldCA9IG9mZnNldCtwb3N0c1BlclBhZ2U7XHJcbiAgICAgKiAgICAgICAgIHZhciBuZXdQYXJhbXMgPSAnP29mZnNldD0nKyBuZXdPZmZzZXQ7XHJcbiAgICAgKiAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7dXJsUGF0aDpuZXdQYXJhbXN9LFwiXCIsbmV3UGFyYW1zKVxyXG4gICAgICogICAgICAgICAkdGhpcy5kYXRhKFwib2Zmc2V0XCIsbmV3T2Zmc2V0KTtcclxuICAgICAqICAgICAgICAgJHRoaXMudGV4dCgkdGhpcy5kYXRhKCdhY3RpdmUtdGV4dCcpKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAqICAgICB9KVxyXG4gICAgICogfSkqL1xyXG5cclxuICAgIHJveWFsX2ZpbHRlclBvc3RzKCk7XHJcbn1cclxuIiwiZnVuY3Rpb24gcm95YWxfZmlsdGVyUG9zdHMoKSB7XHJcbiAgICAkKCcjc2VhcmNoJykuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBmaWx0ZXIgPSAkKHRoaXMpLnZhbCgpO1xyXG5cclxuICAgICAgICAvLyBFeHRlbmQgOmNvbnRhaW5zIHNlbGVjdG9yXHJcbiAgICAgICAgalF1ZXJ5LmV4cHJbJzonXS5jb250YWlucyA9IGZ1bmN0aW9uKGEsIGksIG0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeShhKS50ZXh0KCkudG9VcHBlckNhc2UoKS5pbmRleE9mKG1bM10udG9VcHBlckNhc2UoKSkgPj0gMDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBIaWRlcyBjYXJkcyB0aGF0IGRvbid0IG1hdGNoIGlucHV0XHJcbiAgICAgICAgJChcIiNmZWVkIC5jb250ZW50IC5jYXJkLWNvbnRhaW5lcjp2aXNpYmxlIGFydGljbGUgLmNhcmQtdGl0bGUgYTpub3QoOmNvbnRhaW5zKFwiK2ZpbHRlcitcIikpXCIpLmNsb3Nlc3QoJy5jYXJkLWNvbnRhaW5lcicpLmZhZGVPdXQoKTtcclxuXHJcbiAgICAgICAgLy8gU2hvd3MgY2FyZHMgdGhhdCBtYXRjaCBpbnB1dFxyXG4gICAgICAgICQoXCIjZmVlZCAuY29udGVudCAuY2FyZC1jb250YWluZXI6bm90KDp2aXNpYmxlKSBhcnRpY2xlIC5jYXJkLXRpdGxlIGE6Y29udGFpbnMoXCIrZmlsdGVyK1wiKVwiKS5jbG9zZXN0KCcuY2FyZC1jb250YWluZXInKS5mYWRlSW4oKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGVtcHR5IG1lc3NhZ2Ugd2hlbiBpZiBubyBwb3N0cyBhcmUgdmlzaWJsZVxyXG4gICAgICAgIHZhciBtZXNzYWdlID0gJCgnI2ZlZWQgI25vLXJlc3VsdHMnKTtcclxuICAgICAgICBpZiAoJChcIiNmZWVkIC5jb250ZW50IC5jYXJkLWNvbnRhaW5lcjp2aXNpYmxlIGFydGljbGUgLmNhcmQtdGl0bGUgYTpjb250YWlucyhcIitmaWx0ZXIrXCIpXCIpLnNpemUoKSA9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLmhhc0NsYXNzKCdoaWRlJykpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2ZlZWQgI25vLXJlc3VsdHMnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgfSwgNDAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXNzYWdlLmZpbmQoJy50YXJnZXQnKS50ZXh0KGZpbHRlcik7XHJcbiAgICAgICAgfSBlbHNlIHsgbWVzc2FnZS5hZGRDbGFzcygnaGlkZScpOyB9XHJcblxyXG4gICAgfSkua2V5dXAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcclxuICAgIH0pO1xyXG59XHJcbiJdfQ==

})(jQuery);