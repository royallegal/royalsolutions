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
            $('form#login .success .message').text(data.message);
            if (data.loggedin == true) {
                location.reload();
            }
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


    // ---- PAGE BUILDER ---- //
    if ($('main[id$="-page"]').length) {
        page_builder();
    }


    // ---- GENERAL ---- //
    /* if ($.fn.parallax && $('.parallax').length){
     *     $('.parallax').parallax();
     * }
     * if ($.fn.carousel && $('.carousel-slider').length){
     *     $('.carousel-slider').carousel({
     *         duration: 350,
     *         fullWidth: true
     *     });
     * } */


    // ---- MOBILE ---- //


    // ---- LANDING PAGES ---- //
    /* if ($('#home').length) {
     *     $('#home .carousel-slider').carousel({
     *         duration: 350,
     *         fullWidth: true
     *     });
     *     setTimeout(autoplay, 9000);
     *     function autoplay() {
     *         $('#home .carousel-slider').carousel('next');
     *         setTimeout(autoplay, 12000);
     *     }
     * }*/


    // ---- PROMOTIONS ---- //
    /* if ($('.modal-trigger').length) {
     *     royal_modals();
     * }*/
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhY3QuanMiLCJsb2dpbi5qcyIsIm1lbnVzLmpzIiwibW9kYWxzLmpzIiwibm90aWNlLmpzIiwicGFnZS1idWlsZGVyLmpzIiwicXVpei5qcyIsInJlYWR5LmpzIiwicmVzaXplLmpzIiwic2Nyb2xsLmpzIiwic2lkZWJhci5qcyIsInN0YXR1cy5qcyIsIndvb2NvbW1lcmNlLmpzIiwiZmVlZC9hamF4LmpzIiwiZmVlZC9hcnRpY2xlLmpzIiwiZmVlZC9mZWVkLmpzIiwiZmVlZC9maWx0ZXJQb3N0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gcm95YWxfY29udGFjdCgpIHtcclxuICAgIC8vIFN1Ym1pc3Npb25cclxuICAgICQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgZmlyc3QgICA9ICQoXCIjZmlyc3RcIikudmFsKCk7XHJcbiAgICAgICAgdmFyIGxhc3QgICAgPSAkKFwiI2xhc3RcIikudmFsKCk7XHJcbiAgICAgICAgdmFyIHBob25lICAgPSAkKFwiI3Bob25lXCIpLnZhbCgpO1xyXG4gICAgICAgIHZhciBlbWFpbCAgID0gJChcIiNlbWFpbFwiKS52YWwoKTtcclxuICAgICAgICB2YXIgbWVzc2FnZSA9ICQoXCIjbWVzc2FnZVwiKS52YWwoKTtcclxuICAgICAgICB2YXIgc3VibWl0ICA9ICQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIik7XHJcbiAgICAgICAgdmFyIGNpcmNsZXMgPSAkKFwiLnByZWxvYWRlci13cmFwcGVyXCIpLnBhcmVudCgpO1xyXG4gICAgICAgIHZhciBjb25maXJtID0gJChcIi5jb25maXJtXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFJlbW92ZXMgZXhpc3RpbmcgdmFsaWRhdGlvblxyXG4gICAgICAgIGNvbmZpcm0ucmVtb3ZlQ2xhc3MoJ3BpbmsgZ3JlZW4nKS5hZGRDbGFzcygnaGlkZScpLmZpbmQoJ3AnKS5yZW1vdmUoKTtcclxuICAgICAgICAkKCcuaW52YWxpZCwgLnZhbGlkJykucmVtb3ZlQ2xhc3MoJ2ludmFsaWQgdmFsaWQnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBWYWxpZGF0aW9uXHJcbiAgICAgICAgaWYgKGZpcnN0ID09IFwiXCIgfHwgbGFzdCA9PSBcIlwiIHx8IHBob25lID09IFwiXCIgfHwgZW1haWwgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdwaW5rJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+T29wcywgbG9va3MgbGlrZSB3ZSdyZSBtaXNzaW5nIHNvbWUgaW5mb3JtYXRpb24uIFBsZWFzZSBmaWxsIG91dCBhbGwgdGhlIGZpZWxkcy48L3A+XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVG9nZ2xlIFByZWxvYWRlclxyXG4gICAgICAgICAgICBzdWJtaXQuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgY2lyY2xlcy5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogXCIvd3AtYWRtaW4vYWRtaW4tYWpheC5waHBcIixcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdjb250YWN0X3VzX2Zvcm0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0OiBmaXJzdCxcclxuICAgICAgICAgICAgICAgICAgICBsYXN0OiBsYXN0LFxyXG4gICAgICAgICAgICAgICAgICAgIHBob25lOiBwaG9uZSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZS5yZXBsYWNlKC8oPzpcXHJcXG58XFxyfFxcbikvZywgJzxici8+JyksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdwaW5rJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+T29wcywgbG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtISBDaGVjayBiYWNrIGxhdGVyIG9yIGVtYWlsIHVzIGRpcmVjdGx5IGF0IDxhIGhyZWY9J21haWx0bzpzY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbSc+c2NvdHRAcm95YWxsZWdhbHNvbHV0aW9ucy5jb208L2E+LjwvcD5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdWNjZXNzIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlybS5hZGRDbGFzcygnZ3JlZW4nKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5TdWNjZXNzISBDaGVjayB5b3VyIGVtYWlsLiBXZSdsbCBiZSBpbiB0b3VjaCBzaG9ydGx5LjwvcD5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdwaW5rJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+T29wcywgbG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtISBDaGVjayBiYWNrIGxhdGVyIG9yIGVtYWlsIHVzIGRpcmVjdGx5IGF0IDxhIGhyZWY9J21haWx0bzpzY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbSc+c2NvdHRAcm95YWxsZWdhbHNvbHV0aW9ucy5jb208L2E+LjwvcD5cIik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnZm9ybScpWzBdLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgTWF0ZXJpYWxpemUudXBkYXRlVGV4dEZpZWxkcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2Zvcm0gdGV4dGFyZWEnKS50cmlnZ2VyKCdhdXRvcmVzaXplJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVG9nZ2xlIFByZWxvYWRlclxyXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZXMuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJtaXQucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiZnVuY3Rpb24gcm95YWxfbG9naW4oKSB7XHJcblxyXG4gICAgLy8gTWF0ZXJpYWxpemUgTW9kYWxcclxuICAgICQoJyNsb2dpbk1vZGFsJykubW9kYWwoe1xyXG4gICAgICAgIGluRHVyYXRpb246IDIwMCxcclxuICAgICAgICBvdXREdXJhdGlvbjogMTUwLFxyXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2xvZ2luTW9kYWwgLmxvZ2luJykuY3NzKHtcclxuICAgICAgICAgICAgICAgIHpJbmRleDogMSxcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJyNsb2dpbk1vZGFsIC5zcGxhc2gnKS5yZW1vdmVDbGFzcygnc2hpZnQnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gLS0tLSBDT05UUk9MUyAtLS0tIC8vXHJcbiAgICAvLyBUcmFuc2l0aW9ucyB0byBsb2dpbiBmb3JtXHJcbiAgICAkKCdbZGF0YS1nb3RvLWxvZ2luXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJyNsb2dpbk1vZGFsIC5zcGxhc2gnKS5yZW1vdmVDbGFzcygnc2hpZnQnKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8gVHJhbnNpdGlvbiB0byBwYXNzd29yZCByZWNvdmVyeSBmb3JtXHJcbiAgICAkKCdbZGF0YS1nb3RvLWxvc3RdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnI2xvZ2luTW9kYWwgLnNwbGFzaCcpLmFkZENsYXNzKCdzaGlmdCcpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBBdXRvLW9wZW5zIG1vZGFsIGlmIHVzZXIgaXMgY29taW5nIHZpYSBhIHJlc2V0IGxpbmtcclxuICAgIGlmIChsb2NhdGlvbi5zZWFyY2guaW5jbHVkZXMoXCJhY3Rpb249cnBcIikpIHtcclxuICAgICAgICAkKCcjbG9naW5Nb2RhbCAubG9naW4nKS5jc3Moe1xyXG4gICAgICAgICAgICB6SW5kZXg6IDAsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2xvZ2luTW9kYWwnKS5tb2RhbCgnb3BlbicpO1xyXG4gICAgICAgIH0sIDc1MCk7XHJcbiAgICB9XHJcbiAgICAkKCcjbG9naW5Nb2RhbCAucmVzZXQgI2xvc3QtbGluaycpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNsb2dpbk1vZGFsIC5sb2dpbicpLmNzcyhcInotaW5kZXhcIiwgMSkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgfSwgMzUwKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyAtLS0tIE1FVEhPRFMgLS0tLSAvL1xyXG4gICAgLy8gUGVyZm9ybSBBSkFYIGxvZ2luIG9uIGZvcm0gc3VibWl0XHJcbiAgICAkKCdmb3JtI2xvZ2luJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICB1cmw6ICcvd3AtYWRtaW4vYWRtaW4tYWpheC5waHAnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAnYWN0aW9uJzogJ2FqYXhfbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogJCgnZm9ybSNsb2dpbiAjbG9naW5Vc2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgJ3Bhc3N3b3JkJzogJCgnZm9ybSNsb2dpbiAjbG9naW5QYXNzd29yZCcpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgJ3JlbWVtYmVyJzogJCgnZm9ybSNsb2dpbiAjbG9naW5SZW1lbWJlcicpLmF0dHIoXCJjaGVja2VkXCIpLFxyXG4gICAgICAgICAgICAgICAgJ2xvZ2luU2VjdXJpdHknOiAkKCdmb3JtI2xvZ2luICNsb2dpblNlY3VyaXR5JykudmFsKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAkKCdmb3JtI2xvZ2luIC5zdWNjZXNzIC5tZXNzYWdlJykudGV4dChkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5sb2dnZWRpbiA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUGVyZm9ybSBBSkFYIGxvZ2luIG9uIGZvcm0gc3VibWl0XHJcbiAgICAkKCdmb3JtI3Bhc3N3b3JkTG9zdCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgdXJsOiAnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgJ2FjdGlvbic6ICdsb3N0X3Bhc3MnLFxyXG4gICAgICAgICAgICAgICAgJ3VzZXJfbG9naW4nOiAkKCdmb3JtI3Bhc3N3b3JkTG9zdCAjbG9zdFVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICAnbG9zdFNlY3VyaXR5JzogJCgnZm9ybSNwYXNzd29yZExvc3QgI2xvc3RTZWN1cml0eScpLnZhbCgpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICQoJ2Zvcm0jcGFzc3dvcmRMb3N0IHAuc3RhdHVzJykudGV4dChkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdmb3JtI3Bhc3N3b3JkUmVzZXQnKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgdXJsOiAnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAgICAgICAgICdyZXNldF9wYXNzJyxcclxuICAgICAgICAgICAgICAgIHBhc3MxOlx0XHQkKCdmb3JtI3Bhc3N3b3JkUmVzZXQgI3Jlc2V0UGFzczEnKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHBhc3MyOlx0XHQkKCdmb3JtI3Bhc3N3b3JkUmVzZXQgI3Jlc2V0UGFzczInKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHVzZXJfa2V5Olx0JCgnZm9ybSNwYXNzd29yZFJlc2V0ICN1c2VyX2tleScpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgdXNlcl9sb2dpbjpcdCQoJ2Zvcm0jcGFzc3dvcmRSZXNldCAjdXNlcl9sb2dpbicpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgJ3Jlc2V0U2VjdXJpdHknOiAkKCdmb3JtI3Bhc3N3b3JkUmVzZXQgI3Jlc2V0U2VjdXJpdHknKS52YWwoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICQoJ2Zvcm0jcGFzc3dvcmRMb3N0IHAuc3RhdHVzJykudGV4dChkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBQZXJmb3JtIEFKQVggbG9naW4gb24gZm9ybSBzdWJtaXRcclxuICAgICQoJ2Zvcm0jbG9nb3V0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHVybDogJy93cC1hZG1pbi9hZG1pbi1hamF4LnBocCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICdhY3Rpb24nOiAnYWpheF9sb2dvdXQnLFxyXG4gICAgICAgICAgICAgICAgJ2xvZ291dFNlY3VyaXR5JzogJCgnZm9ybSNsb2dvdXQgI2xvZ291dFNlY3VyaXR5JykudmFsKCkgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sb2dnZWRvdXQgPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbiIsImZ1bmN0aW9uIHJveWFsX21lbnVzKCkge1xyXG4gICAgLy8gTW9iaWxlIE1lbnVcclxuICAgICQoXCIjbW9iaWxlLW1lbnVcIikuc2lkZU5hdih7XHJcbiAgICAgICAgbWVudVdpZHRoOiAyNjAsXHJcbiAgICAgICAgZWRnZTogJ3JpZ2h0J1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIERyb3Bkb3duc1xyXG4gICAgJChcIm5hdiAuZHJvcGRvd24tYnV0dG9uXCIpLmRyb3Bkb3duKHtcclxuICAgICAgICBjb25zdHJhaW5XaWR0aDogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBIZXJvIERpc3BsYXlzXHJcbiAgICBpZiAoJCgnLmhlcm8tY29udGFpbmVyLCAucGFyYWxsYXgtY29udGFpbmVyJykubGVuZ3RoKSB7XHJcbiAgICAgICAgJCgnbmF2JykuYWRkQ2xhc3MoJ3RyYW5zcGFyZW50Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByb3lhbF90b2dnbGVfbWVudXModG9wKSB7XHJcbiAgICBpZiAodG9wID4gNSAmJiAkKCduYXYnKS5oYXNDbGFzcygndHJhbnNwYXJlbnQnKSkge1xyXG4gICAgICAgICQoJ25hdicpLnJlbW92ZUNsYXNzKCd0cmFuc3BhcmVudCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodG9wIDwgNSAmJiAhJCgnbmF2JykuaGFzQ2xhc3MoJ3RyYW5zcGFyZW50JykpIHtcclxuICAgICAgICAkKCduYXYnKS5hZGRDbGFzcygndHJhbnNwYXJlbnQnKTtcclxuICAgIH1cclxufVxyXG4iLCJmdW5jdGlvbiByb3lhbF9tb2RhbHMoKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0b3BsYXkodmlkZW8pIHtcclxuICAgICAgICB2aWRlby5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCd7XCJldmVudFwiOlwiY29tbWFuZFwiLFwiZnVuY1wiOlwicGxheVZpZGVvXCIsXCJhcmdzXCI6XCJcIn0nLCAnKicpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYXV0b3N0b3AodmlkZW8pIHtcclxuICAgICAgICB2aWRlby5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCd7XCJldmVudFwiOlwiY29tbWFuZFwiLFwiZnVuY1wiOlwicGF1c2VWaWRlb1wiLFwiYXJnc1wiOlwiXCJ9JywgJyonKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBCbG9nIFZpZGVvc1xyXG4gICAgaWYgKCQoJyNmZWVkJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQoJy5tb2RhbCcpLm1vZGFsKHtcclxuICAgICAgICAgICAgcmVhZHk6IGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJG1vZGFsID0gJChtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlkZW9TcmMgPSAkbW9kYWwuZGF0YSgndmlkZW8tc3JjJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGlmcmFtZSA9ICRtb2RhbC5maW5kKCdpZnJhbWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkaWZyYW1lICYmICEkaWZyYW1lLmF0dHIoJ3NyYycpKXtcclxuICAgICAgICAgICAgICAgICAgICAkaWZyYW1lLmF0dHIoJ3NyYycsIHZpZGVvU3JjICsgXCI/ZW5hYmxlanNhcGk9MSZzaG93aW5mbz0wXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgJGlmcmFtZS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheSgkaWZyYW1lLmdldCgwKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihtb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRtb2RhbCA9ICQobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRpZnJhbWUgPSAkbW9kYWwuZmluZCgnaWZyYW1lJyk7XHJcbiAgICAgICAgICAgICAgICBhdXRvc3RvcCgkaWZyYW1lLmdldCgwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIE1vdmVzIHRoZSBXb29Db21tZXJjZSBub3RpY2UgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZVxyXG5mdW5jdGlvbiByb3lhbF9tb3ZlTm90aWNlKCkge1xyXG4gICAgJCgnLm5vdGljZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5wcmVwZW5kVG8oJCgnbWFpbicpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuLy8gTW92ZXMgbmV3bHkgYWRkZWQgV29vQ29tbWVyY2UgY2FydCBub3RpY2VzIHRvIHRoZSB0b3Agb2YgdGhlIHBhZ2VcclxuZnVuY3Rpb24gcm95YWxfcmVmcmVzaENhcnROb3RpY2UoKSB7XHJcbiAgICB2YXIgY2FydExvb3AgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoJCgnbWFpbiAuY29udGFpbmVyIC5ub3RpY2UnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJveWFsX21vdmVOb3RpY2UoKTtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjYXJ0TG9vcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgMjUwKTtcclxufVxyXG4iLCJmdW5jdGlvbiBwYWdlX2J1aWxkZXIoKSB7XHJcblxyXG4gICAgLy8gTW9kYWxzXHJcbiAgICAvLyBJIGhhdmVuJ3QgZ290IHRoaXMgd29ya2luZyB5ZXRcclxuXHJcbiAgICAvKiB2YXIgbW9kYWxzID0gJCgnW2lkXj1cIiNtb2RhbC1cIl0nKTtcclxuICAgICAqICQuZWFjaChtb2RhbHMsIGZ1bmN0aW9uKGksIHYpIHtcclxuICAgICAqICAgICBjb25zb2xlLmxvZyh2KTtcclxuICAgICAqICAgICAkKHYpLm1vZGFsKHtcclxuICAgICAqICAgICAgICAgcmVhZHk6IGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICAgKiAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVhZHknKTtcclxuICAgICAqICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vZGFsKTtcclxuICAgICAqICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICAgKiAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29tcGxldGUnKTtcclxuICAgICAqICAgICAgICAgfVxyXG4gICAgICogICAgIH0pO1xyXG4gICAgICogfSk7Ki9cclxuXHJcbiAgICAvKiAkKCcubW9kYWwnKS5tb2RhbCh7XHJcbiAgICAgKiAgICAgcmVhZHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICogICAgICAgICBjb25zb2xlLmxvZygncmVhZHknKTtcclxuICAgICAqICAgICB9LFxyXG4gICAgICogICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAqICAgICAgICAgY29uc29sZS5sb2coJ2NvbXBsZXRlJyk7XHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogICAgIGNvbXBsZXRlOiBmdW5jdGlvbihtb2RhbCkge1xyXG4gICAgICogICAgICAgICB2YXIgJG1vZGFsID0gJChtb2RhbCk7XHJcbiAgICAgKiAgICAgICAgIHZhciAkaWZyYW1lID0gJG1vZGFsLmZpbmQoJ2lmcmFtZScpO1xyXG4gICAgICogICAgICAgICBhdXRvc3RvcCgkaWZyYW1lLmdldCgwKSk7XHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogfSk7ICovXHJcblxyXG5cclxuICAgIC8vIE5ld3NsZXR0ZXJcclxuICAgICQoJ1tkYXRhLW5ld3NsZXR0ZXItZm9ybV0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBmb3JtKXtcclxuICAgICAgICAkZm9ybSA9ICQoZm9ybSk7XHJcbiAgICAgICAgJGZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICRlbWFpbCA9ICRmb3JtLmZpbmQoXCJbbmFtZT1lbWFpbF1cIikudmFsKCk7XHJcbiAgICAgICAgICAgICR0aGFua195b3UgPSAkZm9ybS5maW5kKFwiW2RhdGEtZm9ybS1zdWNjZXNzXVwiKVxyXG4gICAgICAgICAgICAkY29udGVudCA9ICRmb3JtLmZpbmQoXCJbZGF0YS1mb3JtLWNvbnRlbnRdXCIpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkdGhhbmtfeW91LnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAkY29udGVudC5hZGRDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbiIsImZ1bmN0aW9uIHJveWFsX3F1aXooKSB7XHJcblxyXG4gICAgLy8gQXNzZXQgUHJvdGVjdGlvbiBRdWl6XHJcbiAgICBpZiAoJCgnI2Fzc2V0LXByb3RlY3Rpb24tcXVpeicpLmxlbmd0aCkge1xyXG4gICAgICAgIC8vIE1hdGVyaWFsaXplIGNhcm91c2VsIHNldHRpbmdzXHJcbiAgICAgICAgJCgnLmNhcm91c2VsLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKHtcclxuICAgICAgICAgICAgZnVsbFdpZHRoOiB0cnVlLFxyXG4gICAgICAgICAgICBpbmRpY2F0b3JzOnRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUXVlc3Rpb25zIHBhbmVsIGRpc3BsYXkgJiBuYXZpZ2F0aW9uXHJcbiAgICAgICAgJCgnLnRvZ2dsZS1zZWN0aW9uJykuaGlkZSgpO1xyXG4gICAgICAgICQoJy5idG4tcXVpei10b2dnbGUnKS51bmJpbmQoJ2NsaWNrJykuYmluZCgnY2xpY2snLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQoJy50b2dnbGUtc2VjdGlvbicpLnNsaWRlVG9nZ2xlKCdmYXN0JyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYoJCgnLnRvZ2dsZS1zZWN0aW9uJykuY3NzKCdkaXNwbGF5Jyk9PSdibG9jaycpe1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5idG4tcXVpei10b2dnbGUnKS5odG1sKFwiQ0xPU0UgUVVJWlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuYnRuLXF1aXotdG9nZ2xlJykuYWRkQ2xhc3MoXCJjbG9zZVwiKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5idG4tcXVpei10b2dnbGUnKS5odG1sKFwiVEFLRSBUSEUgUVVJWlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuYnRuLXF1aXotdG9nZ2xlJykucmVtb3ZlQ2xhc3MoXCJjbG9zZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFJlc3VsdHMgJiBlbWFpbFxyXG4gICAgICAgIC8vIENvZGUgZ29lcyBoZXJlLi4uXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8vIC0tLS0gR0xPQkFMIC0tLS0gLy9cclxuICAgIHJveWFsX21lbnVzKCk7XHJcbiAgICByb3lhbF9sb2dpbigpO1xyXG4gICAgcm95YWxfc2lkZWJhcigpO1xyXG5cclxuXHJcbiAgICAvLyAtLS0tIFBBR0UgQlVJTERFUiAtLS0tIC8vXHJcbiAgICBpZiAoJCgnbWFpbltpZCQ9XCItcGFnZVwiXScpLmxlbmd0aCkge1xyXG4gICAgICAgIHBhZ2VfYnVpbGRlcigpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyAtLS0tIEdFTkVSQUwgLS0tLSAvL1xyXG4gICAgLyogaWYgKCQuZm4ucGFyYWxsYXggJiYgJCgnLnBhcmFsbGF4JykubGVuZ3RoKXtcclxuICAgICAqICAgICAkKCcucGFyYWxsYXgnKS5wYXJhbGxheCgpO1xyXG4gICAgICogfVxyXG4gICAgICogaWYgKCQuZm4uY2Fyb3VzZWwgJiYgJCgnLmNhcm91c2VsLXNsaWRlcicpLmxlbmd0aCl7XHJcbiAgICAgKiAgICAgJCgnLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKHtcclxuICAgICAqICAgICAgICAgZHVyYXRpb246IDM1MCxcclxuICAgICAqICAgICAgICAgZnVsbFdpZHRoOiB0cnVlXHJcbiAgICAgKiAgICAgfSk7XHJcbiAgICAgKiB9ICovXHJcblxyXG5cclxuICAgIC8vIC0tLS0gTU9CSUxFIC0tLS0gLy9cclxuXHJcblxyXG4gICAgLy8gLS0tLSBMQU5ESU5HIFBBR0VTIC0tLS0gLy9cclxuICAgIC8qIGlmICgkKCcjaG9tZScpLmxlbmd0aCkge1xyXG4gICAgICogICAgICQoJyNob21lIC5jYXJvdXNlbC1zbGlkZXInKS5jYXJvdXNlbCh7XHJcbiAgICAgKiAgICAgICAgIGR1cmF0aW9uOiAzNTAsXHJcbiAgICAgKiAgICAgICAgIGZ1bGxXaWR0aDogdHJ1ZVxyXG4gICAgICogICAgIH0pO1xyXG4gICAgICogICAgIHNldFRpbWVvdXQoYXV0b3BsYXksIDkwMDApO1xyXG4gICAgICogICAgIGZ1bmN0aW9uIGF1dG9wbGF5KCkge1xyXG4gICAgICogICAgICAgICAkKCcjaG9tZSAuY2Fyb3VzZWwtc2xpZGVyJykuY2Fyb3VzZWwoJ25leHQnKTtcclxuICAgICAqICAgICAgICAgc2V0VGltZW91dChhdXRvcGxheSwgMTIwMDApO1xyXG4gICAgICogICAgIH1cclxuICAgICAqIH0qL1xyXG5cclxuXHJcbiAgICAvLyAtLS0tIFBST01PVElPTlMgLS0tLSAvL1xyXG4gICAgLyogaWYgKCQoJy5tb2RhbC10cmlnZ2VyJykubGVuZ3RoKSB7XHJcbiAgICAgKiAgICAgcm95YWxfbW9kYWxzKCk7XHJcbiAgICAgKiB9Ki9cclxuICAgIC8qIGlmICgkKCcucXVpeicpLmxlbmd0aCl7XHJcbiAgICAgKiAgICAgcm95YWxfcXVpeigpO1xyXG4gICAgICogfSovXHJcblxyXG5cclxuICAgIC8vIC0tLS0gRkVFRCAtLS0tIC8vXHJcbiAgICBpZiAoJCgnI2ZlZWQnKS5sZW5ndGgpIHtcclxuICAgICAgICByb3lhbF9mZWVkKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoJCgnbWFpbiNhcnRpY2xlJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJveWFsX2FydGljbGUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gLS0tLSBXT09DT01NRVJDRSAtLS0tIC8vXHJcbiAgICBpZiAoJCgnYm9keS53b29jb21tZXJjZScpLmxlbmd0aCkge1xyXG4gICAgICAgIHJveWFsX3dvb2NvbW1lcmNlKCk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCIvKiAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gKiAgICAgaWYgKCQoJy5teS1hY2NvdW50JykubGVuZ3RoKSB7XHJcbiAqICAgICB9XHJcbiAqIH0pKi9cclxuIiwidmFyIGRpZFNjcm9sbDtcclxuJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpe1xyXG4gICAgZGlkU2Nyb2xsID0gdHJ1ZTtcclxuICAgIHZhciB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG4gICAgLyogaWYgKCQoJy5oZXJvLWNvbnRhaW5lciwgLnBhcmFsbGF4LWNvbnRhaW5lcicpLmxlbmd0aCkge1xyXG4gICAgICogICAgIHJveWFsX3RvZ2dsZV9tZW51cyh0b3ApO1xyXG4gICAgICogfSovXHJcblxyXG4gICAgaWYgKCQoJy5jb25zdWx0YXRpb24nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdmFyIGhlcm8gPSAkKCcuaGVyby1jb250YWluZXInKS5oZWlnaHQoKTtcclxuICAgICAgICBpZiAodG9wID4gaGVybyAmJiAkKCduYXYnKS5oYXNDbGFzcygnbm8tc2hhZG93JykpIHtcclxuICAgICAgICAgICAgJCgnbmF2JykucmVtb3ZlQ2xhc3MoJ25vLXNoYWRvdycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0b3AgPCBoZXJvICYmICEkKCduYXYnKS5oYXNDbGFzcygnbm8tc2hhZG93JykpIHtcclxuICAgICAgICAgICAgJCgnbmF2JykuYWRkQ2xhc3MoJ25vLXNoYWRvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmKCQoJyNmZWVkJykubGVuZ3RoICYmICQoJ1tkYXRhLWxvYWQtbW9yZS1zcGlubmVyXScpLmhhc0NsYXNzKCdoaWRlJykpe1xyXG4gICAgICAgIGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSArICQoJ2Zvb3RlcicpLmhlaWdodCgpID4gJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcclxuICAgICAgICAgICAgdmFyICRzcGlubmVyID0gJCgnW2RhdGEtbG9hZC1tb3JlLXNwaW5uZXJdJyk7XHJcbiAgICAgICAgICAgICRzcGlubmVyLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSAkc3Bpbm5lci5kYXRhKFwib2Zmc2V0XCIpO1xyXG4gICAgICAgICAgICB2YXIgcG9zdHNQZXJQYWdlID0gJHNwaW5uZXIuZGF0YShcInBvc3RzLXBlci1wYWdlXCIpO1xyXG4gICAgICAgICAgICBnZXRNb3JlUG9zdHMob2Zmc2V0LCBwb3N0c1BlclBhZ2UpLnRoZW4oZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICAgICAgICAgIHZhciAkcmVzID0gJChyZXMpO1xyXG4gICAgICAgICAgICAgICAgJCgnLm1hc29ucnknKS5hcHBlbmQoICRyZXMgKS5tYXNvbnJ5KCAnYXBwZW5kZWQnLCAkcmVzICk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3T2Zmc2V0ID0gb2Zmc2V0K3Bvc3RzUGVyUGFnZTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdQYXJhbXMgPSAnP29mZnNldD0nKyBuZXdPZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe3VybFBhdGg6bmV3UGFyYW1zfSxcIlwiLG5ld1BhcmFtcylcclxuICAgICAgICAgICAgICAgICRzcGlubmVyLmRhdGEoXCJvZmZzZXRcIixuZXdPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgJHNwaW5uZXIuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpeyBcclxuICAgICAgICAgICAgICAgICRzcGlubmVyLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGRpZFNjcm9sbCkge1xyXG4gICAgICAgIC8qIHRvZ2dsZU5hdigpOyovXHJcbiAgICAgICAgZGlkU2Nyb2xsID0gZmFsc2U7XHJcbiAgICB9XHJcbn0sIDI1MCk7XHJcbiIsImZ1bmN0aW9uIHJveWFsX3NpZGViYXIoKSB7XHJcbiAgICAvLyBTaG93IHNpZGViYXIgYnkgZGVmYXVsdCBvbiBmZWVkIHBhZ2VzXHJcbiAgICBpZiAoJCgnI2ZlZWQnKS5sZW5ndGgpIHtcclxuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NpZGViYXItb3BlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvZ2dsZSBzaWRlYmFyIG9uIGNsaWNrXHJcbiAgICAkKCcjc2lkZWJhci1mYWInKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2lkZWJhci1vcGVuJyk7XHJcbiAgICB9KTtcclxufVxyXG4iLCIvLyBDaGFpbmFibGUgc3RhdHVzIHZhcmlhYmxlXHJcbi8vIGV4OiBlbGVtLnN0YXR1cy5tZXRob2QoKTtcclxudmFyIFN0YXR1cyA9IGZ1bmN0aW9uKGVsZW0sIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgU3RhdHVzLmluaXQoZWxlbSwgb3B0aW9ucyk7XHJcbn1cclxuXHJcblxyXG4vLyBTdGF0dXMgTWV0aG9kc1xyXG4vLyBQbGFjZWQgb24gcHJvdG90eXBlIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcclxuU3RhdHVzLnByb3RvdHlwZSA9IHtcclxuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJy5zdGF0dXMtc3dhcCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCcuc3RhdHVzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJy5zdGF0dXMnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLnN0YXR1cy1zd2FwJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCdkaXYnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLmxvYWRpbmcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlcnJvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCdkaXYnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLmVycm9yJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCdkaXYnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLnN1Y2Nlc3MnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gSW5pdCBTdGF0dXNcclxuU3RhdHVzLmluaXQgPSBmdW5jdGlvbihlbGVtLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgX2RlZmF1bHRzID0ge1xyXG4gICAgICAgIGxvYWRlcjogJ3NwaW5uZXInLFxyXG4gICAgICAgIHJlYWR5OiB1bmRlZmluZWRcclxuICAgIH1cclxuICAgIHNlbGYuZWxlbSA9IGVsZW0gfHwgJyc7XHJcbiAgICBzZWxmLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgX2RlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICAvKiBjb25zb2xlLmxvZyhzZWxmLmVsZW0pO1xyXG4gICAgICogY29uc29sZS5sb2coc2VsZi5vcHRpb25zKTsqL1xyXG59XHJcblxyXG4vLyBJbml0IFN0YXR1cyBwcm90b3R5cGVcclxuU3RhdHVzLmluaXQucHJvdG90eXBlID0gU3RhdHVzLnByb3RvdHlwZTtcclxuXHJcblxyXG4kLmZuLnN0YXR1cyA9IGZ1bmN0aW9uKG1ldGhvZE9yT3B0aW9ucykge1xyXG4gICAgU3RhdHVzKHRoaXMsIGFyZ3VtZW50c1swXSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuXHJcbi8vIFN1cGVyIGF3ZXNvbWUhISFcclxuJCgnZm9ybSNsb2dpbiAuZm9ybS1zdGF0dXMnKS5zdGF0dXMoKTtcclxuIiwiZnVuY3Rpb24gcm95YWxfd29vY29tbWVyY2UoKSB7XHJcblxyXG4gICAgLy8gLS0tLSBOb3RpY2VzIC0tLS0gLy9cclxuICAgIGlmICgkKCcubm90aWNlJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJveWFsX21vdmVOb3RpY2UoKTtcclxuICAgIH1cclxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ3VwZGF0ZWRfY2FydF90b3RhbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByb3lhbF9tb3ZlTm90aWNlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyAtLS0tIFByb2R1Y3RzIC0tLS0gLy9cclxuICAgIGlmICgkKCdtYWluI3Byb2R1Y3QnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJCgnc2VsZWN0JykubWF0ZXJpYWxfc2VsZWN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLSBDYXJ0IC0tLS0gLy9cclxuICAgIGlmICgkKCcud29vY29tbWVyY2UtY2FydC1mb3JtJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQoJy5wcm9kdWN0LXJlbW92ZSBhJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJveWFsX3JlZnJlc2hDYXJ0Tm90aWNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLSBDaGVja291dCAtLS0tLSAvL1xyXG4gICAgLyogJCgnI3BheW1lbnQgW3R5cGU9cmFkaW9dJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgKiAgICAgY29uc29sZS5sb2coJ2NsaWNrJyk7XHJcbiAgICAgKiB9KTsqL1xyXG59XHJcbiIsImZ1bmN0aW9uIGdldE1vcmVQb3N0cyhvZmZzZXQsIHBvc3RzX3Blcl9wYWdlLCBjYXRlZ29yeSl7XHJcbiAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgdXJsOiAnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXHJcbiAgICAgICAgICAgIHBvc3RzX3Blcl9wYWdlOiBwb3N0c19wZXJfcGFnZSxcclxuICAgICAgICAgICAgYWN0aW9uOiAncmxzX21vcmVfcG9zdHMnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiZnVuY3Rpb24gcm95YWxfYXJ0aWNsZSgpIHtcclxuICAgIC8vIFJlc3BvbnNpdmUgaUZyYW1lc1xyXG4gICAgLyogJCgnaWZyYW1lJykud3JhcCgnPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjwvZGl2PicpOyovXHJcblxyXG4gICAgLy8gUGFyYWxsYXhcclxuICAgIGlmICgkKCcucGFyYWxsYXgtY29udGFpbmVyJykubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1BBUkFMTEFYJyk7XHJcbiAgICAgICAgdmFyIGZlYXR1cmVkID0gJCgnLmZlYXR1cmVkLWltYWdlIC5wYXJhbGxheCcpO1xyXG4gICAgICAgIHZhciBwcm9tb3Rpb24gPSAkKCcucHJvbW90aW9uLWltYWdlIC5wYXJhbGxheCcpO1xyXG5cclxuICAgICAgICBpZiAoZmVhdHVyZWQubGVuZ3RoICYmIHByb21vdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0JPVEgnKTtcclxuICAgICAgICAgICAgZmVhdHVyZWQucGFyYWxsYXgoKTtcclxuICAgICAgICAgICAgcHJvbW90aW9uLnBhcmFsbGF4KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGZlYXR1cmVkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRkVBVFVSRUQnKTtcclxuICAgICAgICAgICAgZmVhdHVyZWQucGFyYWxsYXgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvbW90aW9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUFJPTU9USU8nKTtcclxuICAgICAgICAgICAgcHJvbW90aW9uLnBhcmFsbGF4KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRUxTRScpO1xyXG4gICAgICAgICAgICAkKCcucGFyYWxsYXgnKS5wYXJhbGxheCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJmdW5jdGlvbiByb3lhbF9mZWVkKCkge1xyXG4gICAgLyogdmFyIGNvbHVtbnMgPSAgJCgnI2ZlZWQgLmNvbCcpLmZpcnN0KCkuaGFzQ2xhc3MoJ205JykgPyAyIDogMztcclxuICAgICAqIHZhciBtYXNvbnJ5ID0gJCgnLm1hc29ucnknKS5tYXNvbnJ5KHtcclxuICAgICAqICAgICBpdGVtU2VsZWN0b3I6ICdhcnRpY2xlJyxcclxuICAgICAqICAgICBwZXJjZW50UG9zaXRpb246IHRydWUsXHJcbiAgICAgKiAgICAgZml0V2lkdGg6IHRydWUsXHJcbiAgICAgKiAgICAgaGlkZGVuU3R5bGU6IHtcclxuICAgICAqICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxMDBweCknLFxyXG4gICAgICogICAgICAgICBvcGFjaXR5OiAwXHJcbiAgICAgKiAgICAgfSxcclxuICAgICAqICAgICB2aXNpYmxlU3R5bGU6IHtcclxuICAgICAqICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwcHgpJyxcclxuICAgICAqICAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICogICAgIH1cclxuICAgICAqIH0pOyovXHJcblxyXG4gICAgLyogJCgnLm1hc29ucnknKS5tYXNvbnJ5KCk7Ki9cclxuXHJcbiAgICAvKiBpZiAoJC5mbi5pbWFnZXNMb2FkZWQpIHtcclxuICAgICAqICAgICBtYXNvbnJ5LmltYWdlc0xvYWRlZCgpLnByb2dyZXNzKGZ1bmN0aW9uKGluc3RhbmNlLCBpbWFnZSkge1xyXG4gICAgICogICAgICAgICBtYXNvbnJ5Lm1hc29ucnkoJ2xheW91dCcpO1xyXG4gICAgICogICAgICAgICByZXNpemVJbWFnZXMoKTtcclxuICAgICAqICAgICB9KTtcclxuICAgICAqICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICogICAgICAgICBtYXNvbnJ5Lm1hc29ucnkoJ2xheW91dCcpO1xyXG4gICAgICogICAgICAgICByZXNpemVJbWFnZXMoKTtcclxuICAgICAqICAgICB9KTtcclxuICAgICAqIH0qL1xyXG5cclxuICAgIC8vYnV0dG9uIHRvIGxvYWQgbW9yZSBwb3N0cyB2aWEgYWpheFxyXG4gICAgLyogJCgnW2RhdGEtbG9hZC1tb3JlLXBvc3RzXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgKiAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAqICAgICAkdGhpcy5kYXRhKCdhY3RpdmUtdGV4dCcsICR0aGlzLnRleHQoKSkudGV4dChcIkxvYWRpbmcgcG9zdHMuLi5cIikuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAqICAgICB2YXIgb2Zmc2V0ID0gJHRoaXMuZGF0YShcIm9mZnNldFwiKTtcclxuICAgICAqICAgICB2YXIgcG9zdHNQZXJQYWdlID0gJHRoaXMuZGF0YShcInBvc3RzLXBlci1wYWdlXCIpO1xyXG4gICAgICogICAgIGdldE1vcmVQb3N0cyhvZmZzZXQsIHBvc3RzUGVyUGFnZSkudGhlbihmdW5jdGlvbihyZXMpe1xyXG4gICAgICogICAgICAgICB2YXIgJHJlcyA9ICQocmVzKTtcclxuICAgICAqICAgICAgICAgbWFzb25yeS5hcHBlbmQoICRyZXMgKS5tYXNvbnJ5KCAnYXBwZW5kZWQnLCAkcmVzICk7XHJcbiAgICAgKiAgICAgICAgIHZhciBuZXdPZmZzZXQgPSBvZmZzZXQrcG9zdHNQZXJQYWdlO1xyXG4gICAgICogICAgICAgICB2YXIgbmV3UGFyYW1zID0gJz9vZmZzZXQ9JysgbmV3T2Zmc2V0O1xyXG4gICAgICogICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe3VybFBhdGg6bmV3UGFyYW1zfSxcIlwiLG5ld1BhcmFtcylcclxuICAgICAqICAgICAgICAgJHRoaXMuZGF0YShcIm9mZnNldFwiLG5ld09mZnNldCk7XHJcbiAgICAgKiAgICAgICAgICR0aGlzLnRleHQoJHRoaXMuZGF0YSgnYWN0aXZlLXRleHQnKSkuYXR0cignZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgKiAgICAgfSlcclxuICAgICAqIH0pKi9cclxuXHJcbiAgICByb3lhbF9maWx0ZXJQb3N0cygpO1xyXG59XHJcbiIsImZ1bmN0aW9uIHJveWFsX2ZpbHRlclBvc3RzKCkge1xyXG4gICAgJCgnI3NlYXJjaCcpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZmlsdGVyID0gJCh0aGlzKS52YWwoKTtcclxuXHJcbiAgICAgICAgLy8gRXh0ZW5kIDpjb250YWlucyBzZWxlY3RvclxyXG4gICAgICAgIGpRdWVyeS5leHByWyc6J10uY29udGFpbnMgPSBmdW5jdGlvbihhLCBpLCBtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnkoYSkudGV4dCgpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZihtWzNdLnRvVXBwZXJDYXNlKCkpID49IDA7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gSGlkZXMgY2FyZHMgdGhhdCBkb24ndCBtYXRjaCBpbnB1dFxyXG4gICAgICAgICQoXCIjZmVlZCAuY29udGVudCAuY2FyZC1jb250YWluZXI6dmlzaWJsZSBhcnRpY2xlIC5jYXJkLXRpdGxlIGE6bm90KDpjb250YWlucyhcIitmaWx0ZXIrXCIpKVwiKS5jbG9zZXN0KCcuY2FyZC1jb250YWluZXInKS5mYWRlT3V0KCk7XHJcblxyXG4gICAgICAgIC8vIFNob3dzIGNhcmRzIHRoYXQgbWF0Y2ggaW5wdXRcclxuICAgICAgICAkKFwiI2ZlZWQgLmNvbnRlbnQgLmNhcmQtY29udGFpbmVyOm5vdCg6dmlzaWJsZSkgYXJ0aWNsZSAuY2FyZC10aXRsZSBhOmNvbnRhaW5zKFwiK2ZpbHRlcitcIilcIikuY2xvc2VzdCgnLmNhcmQtY29udGFpbmVyJykuZmFkZUluKCk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBlbXB0eSBtZXNzYWdlIHdoZW4gaWYgbm8gcG9zdHMgYXJlIHZpc2libGVcclxuICAgICAgICB2YXIgbWVzc2FnZSA9ICQoJyNmZWVkICNuby1yZXN1bHRzJyk7XHJcbiAgICAgICAgaWYgKCQoXCIjZmVlZCAuY29udGVudCAuY2FyZC1jb250YWluZXI6dmlzaWJsZSBhcnRpY2xlIC5jYXJkLXRpdGxlIGE6Y29udGFpbnMoXCIrZmlsdGVyK1wiKVwiKS5zaXplKCkgPT0gMCkge1xyXG4gICAgICAgICAgICBpZiAobWVzc2FnZS5oYXNDbGFzcygnaGlkZScpKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNmZWVkICNuby1yZXN1bHRzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgIH0sIDQwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWVzc2FnZS5maW5kKCcudGFyZ2V0JykudGV4dChmaWx0ZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7IG1lc3NhZ2UuYWRkQ2xhc3MoJ2hpZGUnKTsgfVxyXG5cclxuICAgIH0pLmtleXVwKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykuY2hhbmdlKCk7XHJcbiAgICB9KTtcclxufVxyXG4iXX0=

})(jQuery);