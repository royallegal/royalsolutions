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
    /* $('[id^="#modal"]').modal();

     * $('.modal-trigger').click(function() {
     *     console.log('click');
     *     $('[id^="#modal"]').modal('open');
     * });*/

    $('#test').modal();

    /* $('#test').click(function() {
     *     
     * });*/

    /* var modals = $('[id^="#modal-"]');
     * $.each(modals, function(i,v) {
     *     $(v).modal({
     *         ready: function(modal) {
     *             console.log('ready');
     *         },
     *         complete: function(modal) {
     *             console.log('complete');
     *         }
     *     });
     * });*/

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhY3QuanMiLCJsb2dpbi5qcyIsIm1lbnVzLmpzIiwibW9kYWxzLmpzIiwibm90aWNlLmpzIiwicGFnZS1idWlsZGVyLmpzIiwicXVpei5qcyIsInJlYWR5LmpzIiwicmVzaXplLmpzIiwic2Nyb2xsLmpzIiwic2lkZWJhci5qcyIsInN0YXR1cy5qcyIsIndvb2NvbW1lcmNlLmpzIiwiZmVlZC9hamF4LmpzIiwiZmVlZC9hcnRpY2xlLmpzIiwiZmVlZC9mZWVkLmpzIiwiZmVlZC9maWx0ZXJQb3N0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gcm95YWxfY29udGFjdCgpIHtcclxuICAgIC8vIFN1Ym1pc3Npb25cclxuICAgICQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgZmlyc3QgICA9ICQoXCIjZmlyc3RcIikudmFsKCk7XHJcbiAgICAgICAgdmFyIGxhc3QgICAgPSAkKFwiI2xhc3RcIikudmFsKCk7XHJcbiAgICAgICAgdmFyIHBob25lICAgPSAkKFwiI3Bob25lXCIpLnZhbCgpO1xyXG4gICAgICAgIHZhciBlbWFpbCAgID0gJChcIiNlbWFpbFwiKS52YWwoKTtcclxuICAgICAgICB2YXIgbWVzc2FnZSA9ICQoXCIjbWVzc2FnZVwiKS52YWwoKTtcclxuICAgICAgICB2YXIgc3VibWl0ICA9ICQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIik7XHJcbiAgICAgICAgdmFyIGNpcmNsZXMgPSAkKFwiLnByZWxvYWRlci13cmFwcGVyXCIpLnBhcmVudCgpO1xyXG4gICAgICAgIHZhciBjb25maXJtID0gJChcIi5jb25maXJtXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFJlbW92ZXMgZXhpc3RpbmcgdmFsaWRhdGlvblxyXG4gICAgICAgIGNvbmZpcm0ucmVtb3ZlQ2xhc3MoJ3BpbmsgZ3JlZW4nKS5hZGRDbGFzcygnaGlkZScpLmZpbmQoJ3AnKS5yZW1vdmUoKTtcclxuICAgICAgICAkKCcuaW52YWxpZCwgLnZhbGlkJykucmVtb3ZlQ2xhc3MoJ2ludmFsaWQgdmFsaWQnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBWYWxpZGF0aW9uXHJcbiAgICAgICAgaWYgKGZpcnN0ID09IFwiXCIgfHwgbGFzdCA9PSBcIlwiIHx8IHBob25lID09IFwiXCIgfHwgZW1haWwgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdwaW5rJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+T29wcywgbG9va3MgbGlrZSB3ZSdyZSBtaXNzaW5nIHNvbWUgaW5mb3JtYXRpb24uIFBsZWFzZSBmaWxsIG91dCBhbGwgdGhlIGZpZWxkcy48L3A+XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVG9nZ2xlIFByZWxvYWRlclxyXG4gICAgICAgICAgICBzdWJtaXQuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgY2lyY2xlcy5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogXCIvd3AtYWRtaW4vYWRtaW4tYWpheC5waHBcIixcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdjb250YWN0X3VzX2Zvcm0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0OiBmaXJzdCxcclxuICAgICAgICAgICAgICAgICAgICBsYXN0OiBsYXN0LFxyXG4gICAgICAgICAgICAgICAgICAgIHBob25lOiBwaG9uZSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZS5yZXBsYWNlKC8oPzpcXHJcXG58XFxyfFxcbikvZywgJzxici8+JyksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdwaW5rJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+T29wcywgbG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtISBDaGVjayBiYWNrIGxhdGVyIG9yIGVtYWlsIHVzIGRpcmVjdGx5IGF0IDxhIGhyZWY9J21haWx0bzpzY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbSc+c2NvdHRAcm95YWxsZWdhbHNvbHV0aW9ucy5jb208L2E+LjwvcD5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdWNjZXNzIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlybS5hZGRDbGFzcygnZ3JlZW4nKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5TdWNjZXNzISBDaGVjayB5b3VyIGVtYWlsLiBXZSdsbCBiZSBpbiB0b3VjaCBzaG9ydGx5LjwvcD5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdwaW5rJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+T29wcywgbG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtISBDaGVjayBiYWNrIGxhdGVyIG9yIGVtYWlsIHVzIGRpcmVjdGx5IGF0IDxhIGhyZWY9J21haWx0bzpzY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbSc+c2NvdHRAcm95YWxsZWdhbHNvbHV0aW9ucy5jb208L2E+LjwvcD5cIik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnZm9ybScpWzBdLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgTWF0ZXJpYWxpemUudXBkYXRlVGV4dEZpZWxkcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2Zvcm0gdGV4dGFyZWEnKS50cmlnZ2VyKCdhdXRvcmVzaXplJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVG9nZ2xlIFByZWxvYWRlclxyXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZXMuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJtaXQucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiZnVuY3Rpb24gcm95YWxfbG9naW4oKSB7XHJcblxyXG4gICAgLy8gTWF0ZXJpYWxpemUgTW9kYWxcclxuICAgICQoJyNsb2dpbk1vZGFsJykubW9kYWwoe1xyXG4gICAgICAgIGluRHVyYXRpb246IDIwMCxcclxuICAgICAgICBvdXREdXJhdGlvbjogMTUwLFxyXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2xvZ2luTW9kYWwgLmxvZ2luJykuY3NzKHtcclxuICAgICAgICAgICAgICAgIHpJbmRleDogMSxcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJyNsb2dpbk1vZGFsIC5zcGxhc2gnKS5yZW1vdmVDbGFzcygnc2hpZnQnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gLS0tLSBDT05UUk9MUyAtLS0tIC8vXHJcbiAgICAvLyBUcmFuc2l0aW9ucyB0byBsb2dpbiBmb3JtXHJcbiAgICAkKCdbZGF0YS1nb3RvLWxvZ2luXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJyNsb2dpbk1vZGFsIC5zcGxhc2gnKS5yZW1vdmVDbGFzcygnc2hpZnQnKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8gVHJhbnNpdGlvbiB0byBwYXNzd29yZCByZWNvdmVyeSBmb3JtXHJcbiAgICAkKCdbZGF0YS1nb3RvLWxvc3RdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnI2xvZ2luTW9kYWwgLnNwbGFzaCcpLmFkZENsYXNzKCdzaGlmdCcpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBBdXRvLW9wZW5zIG1vZGFsIGlmIHVzZXIgaXMgY29taW5nIHZpYSBhIHJlc2V0IGxpbmtcclxuICAgIGlmIChsb2NhdGlvbi5zZWFyY2guaW5jbHVkZXMoXCJhY3Rpb249cnBcIikpIHtcclxuICAgICAgICAkKCcjbG9naW5Nb2RhbCAubG9naW4nKS5jc3Moe1xyXG4gICAgICAgICAgICB6SW5kZXg6IDAsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnI2xvZ2luTW9kYWwnKS5tb2RhbCgnb3BlbicpO1xyXG4gICAgICAgIH0sIDc1MCk7XHJcbiAgICB9XHJcbiAgICAkKCcjbG9naW5Nb2RhbCAucmVzZXQgI2xvc3QtbGluaycpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNsb2dpbk1vZGFsIC5sb2dpbicpLmNzcyhcInotaW5kZXhcIiwgMSkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgfSwgMzUwKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyAtLS0tIE1FVEhPRFMgLS0tLSAvL1xyXG4gICAgLy8gUGVyZm9ybSBBSkFYIGxvZ2luIG9uIGZvcm0gc3VibWl0XHJcbiAgICAkKCdmb3JtI2xvZ2luJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICB1cmw6ICcvd3AtYWRtaW4vYWRtaW4tYWpheC5waHAnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAnYWN0aW9uJzogJ2FqYXhfbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogJCgnZm9ybSNsb2dpbiAjbG9naW5Vc2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgJ3Bhc3N3b3JkJzogJCgnZm9ybSNsb2dpbiAjbG9naW5QYXNzd29yZCcpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgJ3JlbWVtYmVyJzogJCgnZm9ybSNsb2dpbiAjbG9naW5SZW1lbWJlcicpLmF0dHIoXCJjaGVja2VkXCIpLFxyXG4gICAgICAgICAgICAgICAgJ2xvZ2luU2VjdXJpdHknOiAkKCdmb3JtI2xvZ2luICNsb2dpblNlY3VyaXR5JykudmFsKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAkKCdmb3JtI2xvZ2luIC5zdWNjZXNzIC5tZXNzYWdlJykudGV4dChkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5sb2dnZWRpbiA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUGVyZm9ybSBBSkFYIGxvZ2luIG9uIGZvcm0gc3VibWl0XHJcbiAgICAkKCdmb3JtI3Bhc3N3b3JkTG9zdCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgdXJsOiAnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgJ2FjdGlvbic6ICdsb3N0X3Bhc3MnLFxyXG4gICAgICAgICAgICAgICAgJ3VzZXJfbG9naW4nOiAkKCdmb3JtI3Bhc3N3b3JkTG9zdCAjbG9zdFVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICAnbG9zdFNlY3VyaXR5JzogJCgnZm9ybSNwYXNzd29yZExvc3QgI2xvc3RTZWN1cml0eScpLnZhbCgpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICQoJ2Zvcm0jcGFzc3dvcmRMb3N0IHAuc3RhdHVzJykudGV4dChkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdmb3JtI3Bhc3N3b3JkUmVzZXQnKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgdXJsOiAnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAgICAgICAgICdyZXNldF9wYXNzJyxcclxuICAgICAgICAgICAgICAgIHBhc3MxOlx0XHQkKCdmb3JtI3Bhc3N3b3JkUmVzZXQgI3Jlc2V0UGFzczEnKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHBhc3MyOlx0XHQkKCdmb3JtI3Bhc3N3b3JkUmVzZXQgI3Jlc2V0UGFzczInKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHVzZXJfa2V5Olx0JCgnZm9ybSNwYXNzd29yZFJlc2V0ICN1c2VyX2tleScpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgdXNlcl9sb2dpbjpcdCQoJ2Zvcm0jcGFzc3dvcmRSZXNldCAjdXNlcl9sb2dpbicpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgJ3Jlc2V0U2VjdXJpdHknOiAkKCdmb3JtI3Bhc3N3b3JkUmVzZXQgI3Jlc2V0U2VjdXJpdHknKS52YWwoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICQoJ2Zvcm0jcGFzc3dvcmRMb3N0IHAuc3RhdHVzJykudGV4dChkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBQZXJmb3JtIEFKQVggbG9naW4gb24gZm9ybSBzdWJtaXRcclxuICAgICQoJ2Zvcm0jbG9nb3V0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHVybDogJy93cC1hZG1pbi9hZG1pbi1hamF4LnBocCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICdhY3Rpb24nOiAnYWpheF9sb2dvdXQnLFxyXG4gICAgICAgICAgICAgICAgJ2xvZ291dFNlY3VyaXR5JzogJCgnZm9ybSNsb2dvdXQgI2xvZ291dFNlY3VyaXR5JykudmFsKCkgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sb2dnZWRvdXQgPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbiIsImZ1bmN0aW9uIHJveWFsX21lbnVzKCkge1xyXG4gICAgLy8gTW9iaWxlIE1lbnVcclxuICAgICQoXCIjbW9iaWxlLW1lbnVcIikuc2lkZU5hdih7XHJcbiAgICAgICAgbWVudVdpZHRoOiAyNjAsXHJcbiAgICAgICAgZWRnZTogJ3JpZ2h0J1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIERyb3Bkb3duc1xyXG4gICAgJChcIm5hdiAuZHJvcGRvd24tYnV0dG9uXCIpLmRyb3Bkb3duKHtcclxuICAgICAgICBjb25zdHJhaW5XaWR0aDogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBIZXJvIERpc3BsYXlzXHJcbiAgICBpZiAoJCgnLmhlcm8tY29udGFpbmVyLCAucGFyYWxsYXgtY29udGFpbmVyJykubGVuZ3RoKSB7XHJcbiAgICAgICAgJCgnbmF2JykuYWRkQ2xhc3MoJ3RyYW5zcGFyZW50Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByb3lhbF90b2dnbGVfbWVudXModG9wKSB7XHJcbiAgICBpZiAodG9wID4gNSAmJiAkKCduYXYnKS5oYXNDbGFzcygndHJhbnNwYXJlbnQnKSkge1xyXG4gICAgICAgICQoJ25hdicpLnJlbW92ZUNsYXNzKCd0cmFuc3BhcmVudCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodG9wIDwgNSAmJiAhJCgnbmF2JykuaGFzQ2xhc3MoJ3RyYW5zcGFyZW50JykpIHtcclxuICAgICAgICAkKCduYXYnKS5hZGRDbGFzcygndHJhbnNwYXJlbnQnKTtcclxuICAgIH1cclxufVxyXG4iLCJmdW5jdGlvbiByb3lhbF9tb2RhbHMoKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0b3BsYXkodmlkZW8pIHtcclxuICAgICAgICB2aWRlby5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCd7XCJldmVudFwiOlwiY29tbWFuZFwiLFwiZnVuY1wiOlwicGxheVZpZGVvXCIsXCJhcmdzXCI6XCJcIn0nLCAnKicpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYXV0b3N0b3AodmlkZW8pIHtcclxuICAgICAgICB2aWRlby5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCd7XCJldmVudFwiOlwiY29tbWFuZFwiLFwiZnVuY1wiOlwicGF1c2VWaWRlb1wiLFwiYXJnc1wiOlwiXCJ9JywgJyonKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBCbG9nIFZpZGVvc1xyXG4gICAgaWYgKCQoJyNmZWVkJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQoJy5tb2RhbCcpLm1vZGFsKHtcclxuICAgICAgICAgICAgcmVhZHk6IGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJG1vZGFsID0gJChtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlkZW9TcmMgPSAkbW9kYWwuZGF0YSgndmlkZW8tc3JjJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGlmcmFtZSA9ICRtb2RhbC5maW5kKCdpZnJhbWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkaWZyYW1lICYmICEkaWZyYW1lLmF0dHIoJ3NyYycpKXtcclxuICAgICAgICAgICAgICAgICAgICAkaWZyYW1lLmF0dHIoJ3NyYycsIHZpZGVvU3JjICsgXCI/ZW5hYmxlanNhcGk9MSZzaG93aW5mbz0wXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgJGlmcmFtZS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheSgkaWZyYW1lLmdldCgwKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihtb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRtb2RhbCA9ICQobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRpZnJhbWUgPSAkbW9kYWwuZmluZCgnaWZyYW1lJyk7XHJcbiAgICAgICAgICAgICAgICBhdXRvc3RvcCgkaWZyYW1lLmdldCgwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIE1vdmVzIHRoZSBXb29Db21tZXJjZSBub3RpY2UgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZVxyXG5mdW5jdGlvbiByb3lhbF9tb3ZlTm90aWNlKCkge1xyXG4gICAgJCgnLm5vdGljZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5wcmVwZW5kVG8oJCgnbWFpbicpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuLy8gTW92ZXMgbmV3bHkgYWRkZWQgV29vQ29tbWVyY2UgY2FydCBub3RpY2VzIHRvIHRoZSB0b3Agb2YgdGhlIHBhZ2VcclxuZnVuY3Rpb24gcm95YWxfcmVmcmVzaENhcnROb3RpY2UoKSB7XHJcbiAgICB2YXIgY2FydExvb3AgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoJCgnbWFpbiAuY29udGFpbmVyIC5ub3RpY2UnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJveWFsX21vdmVOb3RpY2UoKTtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjYXJ0TG9vcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgMjUwKTtcclxufVxyXG4iLCJmdW5jdGlvbiBwYWdlX2J1aWxkZXIoKSB7XHJcbiAgICAvKiAkKCdbaWRePVwiI21vZGFsXCJdJykubW9kYWwoKTtcclxuXHJcbiAgICAgKiAkKCcubW9kYWwtdHJpZ2dlcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICogICAgIGNvbnNvbGUubG9nKCdjbGljaycpO1xyXG4gICAgICogICAgICQoJ1tpZF49XCIjbW9kYWxcIl0nKS5tb2RhbCgnb3BlbicpO1xyXG4gICAgICogfSk7Ki9cclxuXHJcbiAgICAkKCcjdGVzdCcpLm1vZGFsKCk7XHJcblxyXG4gICAgLyogJCgnI3Rlc3QnKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAqICAgICBcclxuICAgICAqIH0pOyovXHJcblxyXG4gICAgLyogdmFyIG1vZGFscyA9ICQoJ1tpZF49XCIjbW9kYWwtXCJdJyk7XHJcbiAgICAgKiAkLmVhY2gobW9kYWxzLCBmdW5jdGlvbihpLHYpIHtcclxuICAgICAqICAgICAkKHYpLm1vZGFsKHtcclxuICAgICAqICAgICAgICAgcmVhZHk6IGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICAgKiAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVhZHknKTtcclxuICAgICAqICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICAgKiAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29tcGxldGUnKTtcclxuICAgICAqICAgICAgICAgfVxyXG4gICAgICogICAgIH0pO1xyXG4gICAgICogfSk7Ki9cclxuXHJcbiAgICAvLyBNb2RhbHNcclxuICAgIC8vIEkgaGF2ZW4ndCBnb3QgdGhpcyB3b3JraW5nIHlldFxyXG5cclxuICAgIC8qIHZhciBtb2RhbHMgPSAkKCdbaWRePVwiI21vZGFsLVwiXScpO1xyXG4gICAgICogJC5lYWNoKG1vZGFscywgZnVuY3Rpb24oaSwgdikge1xyXG4gICAgICogICAgIGNvbnNvbGUubG9nKHYpO1xyXG4gICAgICogICAgICQodikubW9kYWwoe1xyXG4gICAgICogICAgICAgICByZWFkeTogZnVuY3Rpb24obW9kYWwpIHtcclxuICAgICAqICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWFkeScpO1xyXG4gICAgICogICAgICAgICAgICAgY29uc29sZS5sb2cobW9kYWwpO1xyXG4gICAgICogICAgICAgICB9LFxyXG4gICAgICogICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24obW9kYWwpIHtcclxuICAgICAqICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb21wbGV0ZScpO1xyXG4gICAgICogICAgICAgICB9XHJcbiAgICAgKiAgICAgfSk7XHJcbiAgICAgKiB9KTsqL1xyXG5cclxuICAgIC8qICQoJy5tb2RhbCcpLm1vZGFsKHtcclxuICAgICAqICAgICByZWFkeTogZnVuY3Rpb24oKSB7XHJcbiAgICAgKiAgICAgICAgIGNvbnNvbGUubG9nKCdyZWFkeScpO1xyXG4gICAgICogICAgIH0sXHJcbiAgICAgKiAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICogICAgICAgICBjb25zb2xlLmxvZygnY29tcGxldGUnKTtcclxuICAgICAqICAgICB9XHJcbiAgICAgKiAgICAgY29tcGxldGU6IGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICAgKiAgICAgICAgIHZhciAkbW9kYWwgPSAkKG1vZGFsKTtcclxuICAgICAqICAgICAgICAgdmFyICRpZnJhbWUgPSAkbW9kYWwuZmluZCgnaWZyYW1lJyk7XHJcbiAgICAgKiAgICAgICAgIGF1dG9zdG9wKCRpZnJhbWUuZ2V0KDApKTtcclxuICAgICAqICAgICB9XHJcbiAgICAgKiB9KTsgKi9cclxuXHJcblxyXG4gICAgLy8gTmV3c2xldHRlclxyXG4gICAgJCgnW2RhdGEtbmV3c2xldHRlci1mb3JtXScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGZvcm0pe1xyXG4gICAgICAgICRmb3JtID0gJChmb3JtKTtcclxuICAgICAgICAkZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJGVtYWlsID0gJGZvcm0uZmluZChcIltuYW1lPWVtYWlsXVwiKS52YWwoKTtcclxuICAgICAgICAgICAgJHRoYW5rX3lvdSA9ICRmb3JtLmZpbmQoXCJbZGF0YS1mb3JtLXN1Y2Nlc3NdXCIpXHJcbiAgICAgICAgICAgICRjb250ZW50ID0gJGZvcm0uZmluZChcIltkYXRhLWZvcm0tY29udGVudF1cIilcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICR0aGFua195b3UucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgICRjb250ZW50LmFkZENsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiZnVuY3Rpb24gcm95YWxfcXVpeigpIHtcclxuXHJcbiAgICAvLyBBc3NldCBQcm90ZWN0aW9uIFF1aXpcclxuICAgIGlmICgkKCcjYXNzZXQtcHJvdGVjdGlvbi1xdWl6JykubGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gTWF0ZXJpYWxpemUgY2Fyb3VzZWwgc2V0dGluZ3NcclxuICAgICAgICAkKCcuY2Fyb3VzZWwuY2Fyb3VzZWwtc2xpZGVyJykuY2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBmdWxsV2lkdGg6IHRydWUsXHJcbiAgICAgICAgICAgIGluZGljYXRvcnM6dHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBRdWVzdGlvbnMgcGFuZWwgZGlzcGxheSAmIG5hdmlnYXRpb25cclxuICAgICAgICAkKCcudG9nZ2xlLXNlY3Rpb24nKS5oaWRlKCk7XHJcbiAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLnVuYmluZCgnY2xpY2snKS5iaW5kKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCgnLnRvZ2dsZS1zZWN0aW9uJykuc2xpZGVUb2dnbGUoJ2Zhc3QnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZigkKCcudG9nZ2xlLXNlY3Rpb24nKS5jc3MoJ2Rpc3BsYXknKT09J2Jsb2NrJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLmh0bWwoXCJDTE9TRSBRVUlaXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5idG4tcXVpei10b2dnbGUnKS5hZGRDbGFzcyhcImNsb3NlXCIpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLmh0bWwoXCJUQUtFIFRIRSBRVUlaXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5idG4tcXVpei10b2dnbGUnKS5yZW1vdmVDbGFzcyhcImNsb3NlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUmVzdWx0cyAmIGVtYWlsXHJcbiAgICAgICAgLy8gQ29kZSBnb2VzIGhlcmUuLi5cclxuICAgIH1cclxuXHJcbn1cclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgLy8gLS0tLSBHTE9CQUwgLS0tLSAvL1xyXG4gICAgcm95YWxfbWVudXMoKTtcclxuICAgIHJveWFsX2xvZ2luKCk7XHJcbiAgICByb3lhbF9zaWRlYmFyKCk7XHJcblxyXG5cclxuICAgIC8vIC0tLS0gUEFHRSBCVUlMREVSIC0tLS0gLy9cclxuICAgIGlmICgkKCdtYWluW2lkJD1cIi1wYWdlXCJdJykubGVuZ3RoKSB7XHJcbiAgICAgICAgcGFnZV9idWlsZGVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIC0tLS0gR0VORVJBTCAtLS0tIC8vXHJcbiAgICAvKiBpZiAoJC5mbi5wYXJhbGxheCAmJiAkKCcucGFyYWxsYXgnKS5sZW5ndGgpe1xyXG4gICAgICogICAgICQoJy5wYXJhbGxheCcpLnBhcmFsbGF4KCk7XHJcbiAgICAgKiB9XHJcbiAgICAgKiBpZiAoJC5mbi5jYXJvdXNlbCAmJiAkKCcuY2Fyb3VzZWwtc2xpZGVyJykubGVuZ3RoKXtcclxuICAgICAqICAgICAkKCcuY2Fyb3VzZWwtc2xpZGVyJykuY2Fyb3VzZWwoe1xyXG4gICAgICogICAgICAgICBkdXJhdGlvbjogMzUwLFxyXG4gICAgICogICAgICAgICBmdWxsV2lkdGg6IHRydWVcclxuICAgICAqICAgICB9KTtcclxuICAgICAqIH0gKi9cclxuXHJcblxyXG4gICAgLy8gLS0tLSBNT0JJTEUgLS0tLSAvL1xyXG5cclxuXHJcbiAgICAvLyAtLS0tIExBTkRJTkcgUEFHRVMgLS0tLSAvL1xyXG4gICAgLyogaWYgKCQoJyNob21lJykubGVuZ3RoKSB7XHJcbiAgICAgKiAgICAgJCgnI2hvbWUgLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKHtcclxuICAgICAqICAgICAgICAgZHVyYXRpb246IDM1MCxcclxuICAgICAqICAgICAgICAgZnVsbFdpZHRoOiB0cnVlXHJcbiAgICAgKiAgICAgfSk7XHJcbiAgICAgKiAgICAgc2V0VGltZW91dChhdXRvcGxheSwgOTAwMCk7XHJcbiAgICAgKiAgICAgZnVuY3Rpb24gYXV0b3BsYXkoKSB7XHJcbiAgICAgKiAgICAgICAgICQoJyNob21lIC5jYXJvdXNlbC1zbGlkZXInKS5jYXJvdXNlbCgnbmV4dCcpO1xyXG4gICAgICogICAgICAgICBzZXRUaW1lb3V0KGF1dG9wbGF5LCAxMjAwMCk7XHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogfSovXHJcblxyXG5cclxuICAgIC8vIC0tLS0gUFJPTU9USU9OUyAtLS0tIC8vXHJcbiAgICAvKiBpZiAoJCgnLm1vZGFsLXRyaWdnZXInKS5sZW5ndGgpIHtcclxuICAgICAqICAgICByb3lhbF9tb2RhbHMoKTtcclxuICAgICAqIH0qL1xyXG4gICAgLyogaWYgKCQoJy5xdWl6JykubGVuZ3RoKXtcclxuICAgICAqICAgICByb3lhbF9xdWl6KCk7XHJcbiAgICAgKiB9Ki9cclxuXHJcblxyXG4gICAgLy8gLS0tLSBGRUVEIC0tLS0gLy9cclxuICAgIGlmICgkKCcjZmVlZCcpLmxlbmd0aCkge1xyXG4gICAgICAgIHJveWFsX2ZlZWQoKTtcclxuICAgIH1cclxuICAgIGlmICgkKCdtYWluI2FydGljbGUnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcm95YWxfYXJ0aWNsZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyAtLS0tIFdPT0NPTU1FUkNFIC0tLS0gLy9cclxuICAgIGlmICgkKCdib2R5Lndvb2NvbW1lcmNlJykubGVuZ3RoKSB7XHJcbiAgICAgICAgcm95YWxfd29vY29tbWVyY2UoKTtcclxuICAgIH1cclxufSk7XHJcbiIsIi8qICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAqICAgICBpZiAoJCgnLm15LWFjY291bnQnKS5sZW5ndGgpIHtcclxuICogICAgIH1cclxuICogfSkqL1xyXG4iLCJ2YXIgZGlkU2Nyb2xsO1xyXG4kKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCl7XHJcbiAgICBkaWRTY3JvbGwgPSB0cnVlO1xyXG4gICAgdmFyIHRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAvKiBpZiAoJCgnLmhlcm8tY29udGFpbmVyLCAucGFyYWxsYXgtY29udGFpbmVyJykubGVuZ3RoKSB7XHJcbiAgICAgKiAgICAgcm95YWxfdG9nZ2xlX21lbnVzKHRvcCk7XHJcbiAgICAgKiB9Ki9cclxuXHJcbiAgICBpZiAoJCgnLmNvbnN1bHRhdGlvbicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB2YXIgaGVybyA9ICQoJy5oZXJvLWNvbnRhaW5lcicpLmhlaWdodCgpO1xyXG4gICAgICAgIGlmICh0b3AgPiBoZXJvICYmICQoJ25hdicpLmhhc0NsYXNzKCduby1zaGFkb3cnKSkge1xyXG4gICAgICAgICAgICAkKCduYXYnKS5yZW1vdmVDbGFzcygnbm8tc2hhZG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRvcCA8IGhlcm8gJiYgISQoJ25hdicpLmhhc0NsYXNzKCduby1zaGFkb3cnKSkge1xyXG4gICAgICAgICAgICAkKCduYXYnKS5hZGRDbGFzcygnbm8tc2hhZG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYoJCgnI2ZlZWQnKS5sZW5ndGggJiYgJCgnW2RhdGEtbG9hZC1tb3JlLXNwaW5uZXJdJykuaGFzQ2xhc3MoJ2hpZGUnKSl7XHJcbiAgICAgICAgaWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpICsgJCgnZm9vdGVyJykuaGVpZ2h0KCkgPiAkKGRvY3VtZW50KS5oZWlnaHQoKSkge1xyXG4gICAgICAgICAgICB2YXIgJHNwaW5uZXIgPSAkKCdbZGF0YS1sb2FkLW1vcmUtc3Bpbm5lcl0nKTtcclxuICAgICAgICAgICAgJHNwaW5uZXIucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9ICRzcGlubmVyLmRhdGEoXCJvZmZzZXRcIik7XHJcbiAgICAgICAgICAgIHZhciBwb3N0c1BlclBhZ2UgPSAkc3Bpbm5lci5kYXRhKFwicG9zdHMtcGVyLXBhZ2VcIik7XHJcbiAgICAgICAgICAgIGdldE1vcmVQb3N0cyhvZmZzZXQsIHBvc3RzUGVyUGFnZSkudGhlbihmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgICAgICAgICAgdmFyICRyZXMgPSAkKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAkKCcubWFzb25yeScpLmFwcGVuZCggJHJlcyApLm1hc29ucnkoICdhcHBlbmRlZCcsICRyZXMgKTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdPZmZzZXQgPSBvZmZzZXQrcG9zdHNQZXJQYWdlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1BhcmFtcyA9ICc/b2Zmc2V0PScrIG5ld09mZnNldDtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7dXJsUGF0aDpuZXdQYXJhbXN9LFwiXCIsbmV3UGFyYW1zKVxyXG4gICAgICAgICAgICAgICAgJHNwaW5uZXIuZGF0YShcIm9mZnNldFwiLG5ld09mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAkc3Bpbm5lci5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7IFxyXG4gICAgICAgICAgICAgICAgJHNwaW5uZXIuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoZGlkU2Nyb2xsKSB7XHJcbiAgICAgICAgLyogdG9nZ2xlTmF2KCk7Ki9cclxuICAgICAgICBkaWRTY3JvbGwgPSBmYWxzZTtcclxuICAgIH1cclxufSwgMjUwKTtcclxuIiwiZnVuY3Rpb24gcm95YWxfc2lkZWJhcigpIHtcclxuICAgIC8vIFNob3cgc2lkZWJhciBieSBkZWZhdWx0IG9uIGZlZWQgcGFnZXNcclxuICAgIGlmICgkKCcjZmVlZCcpLmxlbmd0aCkge1xyXG4gICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc2lkZWJhci1vcGVuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVG9nZ2xlIHNpZGViYXIgb24gY2xpY2tcclxuICAgICQoJyNzaWRlYmFyLWZhYicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdzaWRlYmFyLW9wZW4nKTtcclxuICAgIH0pO1xyXG59XHJcbiIsIi8vIENoYWluYWJsZSBzdGF0dXMgdmFyaWFibGVcclxuLy8gZXg6IGVsZW0uc3RhdHVzLm1ldGhvZCgpO1xyXG52YXIgU3RhdHVzID0gZnVuY3Rpb24oZWxlbSwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIG5ldyBTdGF0dXMuaW5pdChlbGVtLCBvcHRpb25zKTtcclxufVxyXG5cclxuXHJcbi8vIFN0YXR1cyBNZXRob2RzXHJcbi8vIFBsYWNlZCBvbiBwcm90b3R5cGUgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxyXG5TdGF0dXMucHJvdG90eXBlID0ge1xyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLnN0YXR1cy1zd2FwJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJy5zdGF0dXMnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlbmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLnN0YXR1cycpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCcuc3RhdHVzLXN3YXAnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJ2RpdicpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCcubG9hZGluZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVycm9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJ2RpdicpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCcuZXJyb3InKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdWNjZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJ2RpdicpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCcuc3VjY2VzcycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLyBJbml0IFN0YXR1c1xyXG5TdGF0dXMuaW5pdCA9IGZ1bmN0aW9uKGVsZW0sIG9wdGlvbnMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBfZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgbG9hZGVyOiAnc3Bpbm5lcicsXHJcbiAgICAgICAgcmVhZHk6IHVuZGVmaW5lZFxyXG4gICAgfVxyXG4gICAgc2VsZi5lbGVtID0gZWxlbSB8fCAnJztcclxuICAgIHNlbGYub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBfZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgIC8qIGNvbnNvbGUubG9nKHNlbGYuZWxlbSk7XHJcbiAgICAgKiBjb25zb2xlLmxvZyhzZWxmLm9wdGlvbnMpOyovXHJcbn1cclxuXHJcbi8vIEluaXQgU3RhdHVzIHByb3RvdHlwZVxyXG5TdGF0dXMuaW5pdC5wcm90b3R5cGUgPSBTdGF0dXMucHJvdG90eXBlO1xyXG5cclxuXHJcbiQuZm4uc3RhdHVzID0gZnVuY3Rpb24obWV0aG9kT3JPcHRpb25zKSB7XHJcbiAgICBTdGF0dXModGhpcywgYXJndW1lbnRzWzBdKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5cclxuLy8gU3VwZXIgYXdlc29tZSEhIVxyXG4kKCdmb3JtI2xvZ2luIC5mb3JtLXN0YXR1cycpLnN0YXR1cygpO1xyXG4iLCJmdW5jdGlvbiByb3lhbF93b29jb21tZXJjZSgpIHtcclxuXHJcbiAgICAvLyAtLS0tIE5vdGljZXMgLS0tLSAvL1xyXG4gICAgaWYgKCQoJy5ub3RpY2UnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcm95YWxfbW92ZU5vdGljZSgpO1xyXG4gICAgfVxyXG4gICAgJChkb2N1bWVudC5ib2R5KS5vbigndXBkYXRlZF9jYXJ0X3RvdGFscycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJveWFsX21vdmVOb3RpY2UoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIC0tLS0gUHJvZHVjdHMgLS0tLSAvL1xyXG4gICAgaWYgKCQoJ21haW4jcHJvZHVjdCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKCdzZWxlY3QnKS5tYXRlcmlhbF9zZWxlY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tIENhcnQgLS0tLSAvL1xyXG4gICAgaWYgKCQoJy53b29jb21tZXJjZS1jYXJ0LWZvcm0nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJCgnLnByb2R1Y3QtcmVtb3ZlIGEnKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcm95YWxfcmVmcmVzaENhcnROb3RpY2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tIENoZWNrb3V0IC0tLS0tIC8vXHJcbiAgICAvKiAkKCcjcGF5bWVudCBbdHlwZT1yYWRpb10nKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAqICAgICBjb25zb2xlLmxvZygnY2xpY2snKTtcclxuICAgICAqIH0pOyovXHJcbn1cclxuIiwiZnVuY3Rpb24gZ2V0TW9yZVBvc3RzKG9mZnNldCwgcG9zdHNfcGVyX3BhZ2UsIGNhdGVnb3J5KXtcclxuICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICB1cmw6ICcvd3AtYWRtaW4vYWRtaW4tYWpheC5waHAnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5LFxyXG4gICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcclxuICAgICAgICAgICAgcG9zdHNfcGVyX3BhZ2U6IHBvc3RzX3Blcl9wYWdlLFxyXG4gICAgICAgICAgICBhY3Rpb246ICdybHNfbW9yZV9wb3N0cydcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4iLCJmdW5jdGlvbiByb3lhbF9hcnRpY2xlKCkge1xyXG4gICAgLy8gUmVzcG9uc2l2ZSBpRnJhbWVzXHJcbiAgICAvKiAkKCdpZnJhbWUnKS53cmFwKCc8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+PC9kaXY+Jyk7Ki9cclxuXHJcbiAgICAvLyBQYXJhbGxheFxyXG4gICAgaWYgKCQoJy5wYXJhbGxheC1jb250YWluZXInKS5sZW5ndGgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnUEFSQUxMQVgnKTtcclxuICAgICAgICB2YXIgZmVhdHVyZWQgPSAkKCcuZmVhdHVyZWQtaW1hZ2UgLnBhcmFsbGF4Jyk7XHJcbiAgICAgICAgdmFyIHByb21vdGlvbiA9ICQoJy5wcm9tb3Rpb24taW1hZ2UgLnBhcmFsbGF4Jyk7XHJcblxyXG4gICAgICAgIGlmIChmZWF0dXJlZC5sZW5ndGggJiYgcHJvbW90aW9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQk9USCcpO1xyXG4gICAgICAgICAgICBmZWF0dXJlZC5wYXJhbGxheCgpO1xyXG4gICAgICAgICAgICBwcm9tb3Rpb24ucGFyYWxsYXgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZmVhdHVyZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGRUFUVVJFRCcpO1xyXG4gICAgICAgICAgICBmZWF0dXJlZC5wYXJhbGxheCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcm9tb3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQUk9NT1RJTycpO1xyXG4gICAgICAgICAgICBwcm9tb3Rpb24ucGFyYWxsYXgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFTFNFJyk7XHJcbiAgICAgICAgICAgICQoJy5wYXJhbGxheCcpLnBhcmFsbGF4KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImZ1bmN0aW9uIHJveWFsX2ZlZWQoKSB7XHJcbiAgICAvKiB2YXIgY29sdW1ucyA9ICAkKCcjZmVlZCAuY29sJykuZmlyc3QoKS5oYXNDbGFzcygnbTknKSA/IDIgOiAzO1xyXG4gICAgICogdmFyIG1hc29ucnkgPSAkKCcubWFzb25yeScpLm1hc29ucnkoe1xyXG4gICAgICogICAgIGl0ZW1TZWxlY3RvcjogJ2FydGljbGUnLFxyXG4gICAgICogICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcclxuICAgICAqICAgICBmaXRXaWR0aDogdHJ1ZSxcclxuICAgICAqICAgICBoaWRkZW5TdHlsZToge1xyXG4gICAgICogICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDEwMHB4KScsXHJcbiAgICAgKiAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAqICAgICB9LFxyXG4gICAgICogICAgIHZpc2libGVTdHlsZToge1xyXG4gICAgICogICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDBweCknLFxyXG4gICAgICogICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogfSk7Ki9cclxuXHJcbiAgICAvKiAkKCcubWFzb25yeScpLm1hc29ucnkoKTsqL1xyXG5cclxuICAgIC8qIGlmICgkLmZuLmltYWdlc0xvYWRlZCkge1xyXG4gICAgICogICAgIG1hc29ucnkuaW1hZ2VzTG9hZGVkKCkucHJvZ3Jlc3MoZnVuY3Rpb24oaW5zdGFuY2UsIGltYWdlKSB7XHJcbiAgICAgKiAgICAgICAgIG1hc29ucnkubWFzb25yeSgnbGF5b3V0Jyk7XHJcbiAgICAgKiAgICAgICAgIHJlc2l6ZUltYWdlcygpO1xyXG4gICAgICogICAgIH0pO1xyXG4gICAgICogICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgKiAgICAgICAgIG1hc29ucnkubWFzb25yeSgnbGF5b3V0Jyk7XHJcbiAgICAgKiAgICAgICAgIHJlc2l6ZUltYWdlcygpO1xyXG4gICAgICogICAgIH0pO1xyXG4gICAgICogfSovXHJcblxyXG4gICAgLy9idXR0b24gdG8gbG9hZCBtb3JlIHBvc3RzIHZpYSBhamF4XHJcbiAgICAvKiAkKCdbZGF0YS1sb2FkLW1vcmUtcG9zdHNdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAqICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICogICAgICR0aGlzLmRhdGEoJ2FjdGl2ZS10ZXh0JywgJHRoaXMudGV4dCgpKS50ZXh0KFwiTG9hZGluZyBwb3N0cy4uLlwiKS5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICogICAgIHZhciBvZmZzZXQgPSAkdGhpcy5kYXRhKFwib2Zmc2V0XCIpO1xyXG4gICAgICogICAgIHZhciBwb3N0c1BlclBhZ2UgPSAkdGhpcy5kYXRhKFwicG9zdHMtcGVyLXBhZ2VcIik7XHJcbiAgICAgKiAgICAgZ2V0TW9yZVBvc3RzKG9mZnNldCwgcG9zdHNQZXJQYWdlKS50aGVuKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgKiAgICAgICAgIHZhciAkcmVzID0gJChyZXMpO1xyXG4gICAgICogICAgICAgICBtYXNvbnJ5LmFwcGVuZCggJHJlcyApLm1hc29ucnkoICdhcHBlbmRlZCcsICRyZXMgKTtcclxuICAgICAqICAgICAgICAgdmFyIG5ld09mZnNldCA9IG9mZnNldCtwb3N0c1BlclBhZ2U7XHJcbiAgICAgKiAgICAgICAgIHZhciBuZXdQYXJhbXMgPSAnP29mZnNldD0nKyBuZXdPZmZzZXQ7XHJcbiAgICAgKiAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7dXJsUGF0aDpuZXdQYXJhbXN9LFwiXCIsbmV3UGFyYW1zKVxyXG4gICAgICogICAgICAgICAkdGhpcy5kYXRhKFwib2Zmc2V0XCIsbmV3T2Zmc2V0KTtcclxuICAgICAqICAgICAgICAgJHRoaXMudGV4dCgkdGhpcy5kYXRhKCdhY3RpdmUtdGV4dCcpKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAqICAgICB9KVxyXG4gICAgICogfSkqL1xyXG5cclxuICAgIHJveWFsX2ZpbHRlclBvc3RzKCk7XHJcbn1cclxuIiwiZnVuY3Rpb24gcm95YWxfZmlsdGVyUG9zdHMoKSB7XHJcbiAgICAkKCcjc2VhcmNoJykuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBmaWx0ZXIgPSAkKHRoaXMpLnZhbCgpO1xyXG5cclxuICAgICAgICAvLyBFeHRlbmQgOmNvbnRhaW5zIHNlbGVjdG9yXHJcbiAgICAgICAgalF1ZXJ5LmV4cHJbJzonXS5jb250YWlucyA9IGZ1bmN0aW9uKGEsIGksIG0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeShhKS50ZXh0KCkudG9VcHBlckNhc2UoKS5pbmRleE9mKG1bM10udG9VcHBlckNhc2UoKSkgPj0gMDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBIaWRlcyBjYXJkcyB0aGF0IGRvbid0IG1hdGNoIGlucHV0XHJcbiAgICAgICAgJChcIiNmZWVkIC5jb250ZW50IC5jYXJkLWNvbnRhaW5lcjp2aXNpYmxlIGFydGljbGUgLmNhcmQtdGl0bGUgYTpub3QoOmNvbnRhaW5zKFwiK2ZpbHRlcitcIikpXCIpLmNsb3Nlc3QoJy5jYXJkLWNvbnRhaW5lcicpLmZhZGVPdXQoKTtcclxuXHJcbiAgICAgICAgLy8gU2hvd3MgY2FyZHMgdGhhdCBtYXRjaCBpbnB1dFxyXG4gICAgICAgICQoXCIjZmVlZCAuY29udGVudCAuY2FyZC1jb250YWluZXI6bm90KDp2aXNpYmxlKSBhcnRpY2xlIC5jYXJkLXRpdGxlIGE6Y29udGFpbnMoXCIrZmlsdGVyK1wiKVwiKS5jbG9zZXN0KCcuY2FyZC1jb250YWluZXInKS5mYWRlSW4oKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGVtcHR5IG1lc3NhZ2Ugd2hlbiBpZiBubyBwb3N0cyBhcmUgdmlzaWJsZVxyXG4gICAgICAgIHZhciBtZXNzYWdlID0gJCgnI2ZlZWQgI25vLXJlc3VsdHMnKTtcclxuICAgICAgICBpZiAoJChcIiNmZWVkIC5jb250ZW50IC5jYXJkLWNvbnRhaW5lcjp2aXNpYmxlIGFydGljbGUgLmNhcmQtdGl0bGUgYTpjb250YWlucyhcIitmaWx0ZXIrXCIpXCIpLnNpemUoKSA9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLmhhc0NsYXNzKCdoaWRlJykpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2ZlZWQgI25vLXJlc3VsdHMnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgfSwgNDAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXNzYWdlLmZpbmQoJy50YXJnZXQnKS50ZXh0KGZpbHRlcik7XHJcbiAgICAgICAgfSBlbHNlIHsgbWVzc2FnZS5hZGRDbGFzcygnaGlkZScpOyB9XHJcblxyXG4gICAgfSkua2V5dXAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcclxuICAgIH0pO1xyXG59XHJcbiJdfQ==

})(jQuery);