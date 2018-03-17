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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhY3QuanMiLCJsb2dpbi5qcyIsIm1lbnVzLmpzIiwibW9kYWxzLmpzIiwibm90aWNlLmpzIiwicGFnZS1idWlsZGVyLmpzIiwicXVpei5qcyIsInJlYWR5LmpzIiwicmVzaXplLmpzIiwic2Nyb2xsLmpzIiwic2lkZWJhci5qcyIsInN0YXR1cy5qcyIsIndvb2NvbW1lcmNlLmpzIiwiZmVlZC9hamF4LmpzIiwiZmVlZC9hcnRpY2xlLmpzIiwiZmVlZC9mZWVkLmpzIiwiZmVlZC9maWx0ZXJQb3N0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHJveWFsX2NvbnRhY3QoKSB7XG4gICAgLy8gU3VibWlzc2lvblxuICAgICQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBmaXJzdCAgID0gJChcIiNmaXJzdFwiKS52YWwoKTtcbiAgICAgICAgdmFyIGxhc3QgICAgPSAkKFwiI2xhc3RcIikudmFsKCk7XG4gICAgICAgIHZhciBwaG9uZSAgID0gJChcIiNwaG9uZVwiKS52YWwoKTtcbiAgICAgICAgdmFyIGVtYWlsICAgPSAkKFwiI2VtYWlsXCIpLnZhbCgpO1xuICAgICAgICB2YXIgbWVzc2FnZSA9ICQoXCIjbWVzc2FnZVwiKS52YWwoKTtcbiAgICAgICAgdmFyIHN1Ym1pdCAgPSAkKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpO1xuICAgICAgICB2YXIgY2lyY2xlcyA9ICQoXCIucHJlbG9hZGVyLXdyYXBwZXJcIikucGFyZW50KCk7XG4gICAgICAgIHZhciBjb25maXJtID0gJChcIi5jb25maXJtXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVtb3ZlcyBleGlzdGluZyB2YWxpZGF0aW9uXG4gICAgICAgIGNvbmZpcm0ucmVtb3ZlQ2xhc3MoJ3BpbmsgZ3JlZW4nKS5hZGRDbGFzcygnaGlkZScpLmZpbmQoJ3AnKS5yZW1vdmUoKTtcbiAgICAgICAgJCgnLmludmFsaWQsIC52YWxpZCcpLnJlbW92ZUNsYXNzKCdpbnZhbGlkIHZhbGlkJyk7XG4gICAgICAgIFxuICAgICAgICAvLyBWYWxpZGF0aW9uXG4gICAgICAgIGlmIChmaXJzdCA9PSBcIlwiIHx8IGxhc3QgPT0gXCJcIiB8fCBwaG9uZSA9PSBcIlwiIHx8IGVtYWlsID09IFwiXCIpIHtcbiAgICAgICAgICAgIGNvbmZpcm0uYWRkQ2xhc3MoJ3BpbmsnKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5Pb3BzLCBsb29rcyBsaWtlIHdlJ3JlIG1pc3Npbmcgc29tZSBpbmZvcm1hdGlvbi4gUGxlYXNlIGZpbGwgb3V0IGFsbCB0aGUgZmllbGRzLjwvcD5cIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gVG9nZ2xlIFByZWxvYWRlclxuICAgICAgICAgICAgc3VibWl0LmFkZENsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICBjaXJjbGVzLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogXCIvd3AtYWRtaW4vYWRtaW4tYWpheC5waHBcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2NvbnRhY3RfdXNfZm9ybScsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0OiBmaXJzdCxcbiAgICAgICAgICAgICAgICAgICAgbGFzdDogbGFzdCxcbiAgICAgICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UucmVwbGFjZSgvKD86XFxyXFxufFxccnxcXG4pL2csICc8YnIvPicpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSA9PSBcIjBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlybS5hZGRDbGFzcygncGluaycpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChcIjxwPk9vcHMsIGxvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbSEgQ2hlY2sgYmFjayBsYXRlciBvciBlbWFpbCB1cyBkaXJlY3RseSBhdCA8YSBocmVmPSdtYWlsdG86c2NvdHRAcm95YWxsZWdhbHNvbHV0aW9ucy5jb20nPnNjb3R0QHJveWFsbGVnYWxzb2x1dGlvbnMuY29tPC9hPi48L3A+XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3VjY2VzcyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdncmVlbicpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChcIjxwPlN1Y2Nlc3MhIENoZWNrIHlvdXIgZW1haWwuIFdlJ2xsIGJlIGluIHRvdWNoIHNob3J0bHkuPC9wPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvciBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm0uYWRkQ2xhc3MoJ3BpbmsnKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5Pb3BzLCBsb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0hIENoZWNrIGJhY2sgbGF0ZXIgb3IgZW1haWwgdXMgZGlyZWN0bHkgYXQgPGEgaHJlZj0nbWFpbHRvOnNjb3R0QHJveWFsbGVnYWxzb2x1dGlvbnMuY29tJz5zY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbTwvYT4uPC9wPlwiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnZm9ybScpWzBdLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIE1hdGVyaWFsaXplLnVwZGF0ZVRleHRGaWVsZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnZm9ybSB0ZXh0YXJlYScpLnRyaWdnZXIoJ2F1dG9yZXNpemUnKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSBQcmVsb2FkZXJcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlcy5hZGRDbGFzcygnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXQucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwiZnVuY3Rpb24gcm95YWxfbG9naW4oKSB7XG5cbiAgICAvLyBNYXRlcmlhbGl6ZSBNb2RhbFxuICAgICQoJyNsb2dpbk1vZGFsJykubW9kYWwoe1xuICAgICAgICBpbkR1cmF0aW9uOiAyMDAsXG4gICAgICAgIG91dER1cmF0aW9uOiAxNTAsXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJyNsb2dpbk1vZGFsIC5sb2dpbicpLmNzcyh7XG4gICAgICAgICAgICAgICAgekluZGV4OiAxLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2xvZ2luTW9kYWwgLnNwbGFzaCcpLnJlbW92ZUNsYXNzKCdzaGlmdCcpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8vIC0tLS0gQ09OVFJPTFMgLS0tLSAvL1xuICAgIC8vIFRyYW5zaXRpb25zIHRvIGxvZ2luIGZvcm1cbiAgICAkKCdbZGF0YS1nb3RvLWxvZ2luXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcjbG9naW5Nb2RhbCAuc3BsYXNoJykucmVtb3ZlQ2xhc3MoJ3NoaWZ0Jyk7XG4gICAgfSlcblxuICAgIC8vIFRyYW5zaXRpb24gdG8gcGFzc3dvcmQgcmVjb3ZlcnkgZm9ybVxuICAgICQoJ1tkYXRhLWdvdG8tbG9zdF0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnI2xvZ2luTW9kYWwgLnNwbGFzaCcpLmFkZENsYXNzKCdzaGlmdCcpO1xuICAgIH0pXG5cbiAgICAvLyBBdXRvLW9wZW5zIG1vZGFsIGlmIHVzZXIgaXMgY29taW5nIHZpYSBhIHJlc2V0IGxpbmtcbiAgICBpZiAobG9jYXRpb24uc2VhcmNoLmluY2x1ZGVzKFwiYWN0aW9uPXJwXCIpKSB7XG4gICAgICAgICQoJyNsb2dpbk1vZGFsIC5sb2dpbicpLmNzcyh7XG4gICAgICAgICAgICB6SW5kZXg6IDAsXG4gICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcjbG9naW5Nb2RhbCcpLm1vZGFsKCdvcGVuJyk7XG4gICAgICAgIH0sIDc1MCk7XG4gICAgfVxuICAgICQoJyNsb2dpbk1vZGFsIC5yZXNldCAjbG9zdC1saW5rJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcjbG9naW5Nb2RhbCAubG9naW4nKS5jc3MoXCJ6LWluZGV4XCIsIDEpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgIH0sIDM1MCk7XG4gICAgfSk7XG5cblxuICAgIC8vIC0tLS0gTUVUSE9EUyAtLS0tIC8vXG4gICAgLy8gUGVyZm9ybSBBSkFYIGxvZ2luIG9uIGZvcm0gc3VibWl0XG4gICAgJCgnZm9ybSNsb2dpbicpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICB1cmw6ICcvd3AtYWRtaW4vYWRtaW4tYWpheC5waHAnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICdhY3Rpb24nOiAnYWpheF9sb2dpbicsXG4gICAgICAgICAgICAgICAgJ3VzZXJuYW1lJzogJCgnZm9ybSNsb2dpbiAjbG9naW5Vc2VybmFtZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgICdwYXNzd29yZCc6ICQoJ2Zvcm0jbG9naW4gI2xvZ2luUGFzc3dvcmQnKS52YWwoKSxcbiAgICAgICAgICAgICAgICAncmVtZW1iZXInOiAkKCdmb3JtI2xvZ2luICNsb2dpblJlbWVtYmVyJykuYXR0cihcImNoZWNrZWRcIiksXG4gICAgICAgICAgICAgICAgJ2xvZ2luU2VjdXJpdHknOiAkKCdmb3JtI2xvZ2luICNsb2dpblNlY3VyaXR5JykudmFsKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAkKCdmb3JtI2xvZ2luIC5zdWNjZXNzIC5tZXNzYWdlJykudGV4dChkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgaWYgKGRhdGEubG9nZ2VkaW4gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFBlcmZvcm0gQUpBWCBsb2dpbiBvbiBmb3JtIHN1Ym1pdFxuICAgICQoJ2Zvcm0jcGFzc3dvcmRMb3N0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHVybDogJy93cC1hZG1pbi9hZG1pbi1hamF4LnBocCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJ2FjdGlvbic6ICdsb3N0X3Bhc3MnLFxuICAgICAgICAgICAgICAgICd1c2VyX2xvZ2luJzogJCgnZm9ybSNwYXNzd29yZExvc3QgI2xvc3RVc2VybmFtZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgICdsb3N0U2VjdXJpdHknOiAkKCdmb3JtI3Bhc3N3b3JkTG9zdCAjbG9zdFNlY3VyaXR5JykudmFsKClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgJCgnZm9ybSNwYXNzd29yZExvc3QgcC5zdGF0dXMnKS50ZXh0KGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJCgnZm9ybSNwYXNzd29yZFJlc2V0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgdXJsOiAnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICAgICAgICAgJ3Jlc2V0X3Bhc3MnLFxuICAgICAgICAgICAgICAgIHBhc3MxOlx0XHQkKCdmb3JtI3Bhc3N3b3JkUmVzZXQgI3Jlc2V0UGFzczEnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBwYXNzMjpcdFx0JCgnZm9ybSNwYXNzd29yZFJlc2V0ICNyZXNldFBhc3MyJykudmFsKCksXG4gICAgICAgICAgICAgICAgdXNlcl9rZXk6XHQkKCdmb3JtI3Bhc3N3b3JkUmVzZXQgI3VzZXJfa2V5JykudmFsKCksXG4gICAgICAgICAgICAgICAgdXNlcl9sb2dpbjpcdCQoJ2Zvcm0jcGFzc3dvcmRSZXNldCAjdXNlcl9sb2dpbicpLnZhbCgpLFxuICAgICAgICAgICAgICAgICdyZXNldFNlY3VyaXR5JzogJCgnZm9ybSNwYXNzd29yZFJlc2V0ICNyZXNldFNlY3VyaXR5JykudmFsKClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAkKCdmb3JtI3Bhc3N3b3JkTG9zdCBwLnN0YXR1cycpLnRleHQoZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBQZXJmb3JtIEFKQVggbG9naW4gb24gZm9ybSBzdWJtaXRcbiAgICAkKCdmb3JtI2xvZ291dCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHVybDogJy93cC1hZG1pbi9hZG1pbi1hamF4LnBocCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJ2FjdGlvbic6ICdhamF4X2xvZ291dCcsXG4gICAgICAgICAgICAgICAgJ2xvZ291dFNlY3VyaXR5JzogJCgnZm9ybSNsb2dvdXQgI2xvZ291dFNlY3VyaXR5JykudmFsKCkgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmxvZ2dlZG91dCA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImZ1bmN0aW9uIHJveWFsX21lbnVzKCkge1xuICAgIC8vIE1vYmlsZSBNZW51XG4gICAgJChcIiNtb2JpbGUtbWVudVwiKS5zaWRlTmF2KHtcbiAgICAgICAgbWVudVdpZHRoOiAyNjAsXG4gICAgICAgIGVkZ2U6ICdyaWdodCdcbiAgICB9KTtcblxuXG4gICAgLy8gRHJvcGRvd25zXG4gICAgJChcIm5hdiAuZHJvcGRvd24tYnV0dG9uXCIpLmRyb3Bkb3duKHtcbiAgICAgICAgY29uc3RyYWluV2lkdGg6IGZhbHNlXG4gICAgfSk7XG5cblxuICAgIC8vIEhlcm8gRGlzcGxheXNcbiAgICBpZiAoJCgnLmhlcm8tY29udGFpbmVyLCAucGFyYWxsYXgtY29udGFpbmVyJykubGVuZ3RoKSB7XG4gICAgICAgICQoJ25hdicpLmFkZENsYXNzKCd0cmFuc3BhcmVudCcpO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiByb3lhbF90b2dnbGVfbWVudXModG9wKSB7XG4gICAgaWYgKHRvcCA+IDUgJiYgJCgnbmF2JykuaGFzQ2xhc3MoJ3RyYW5zcGFyZW50JykpIHtcbiAgICAgICAgJCgnbmF2JykucmVtb3ZlQ2xhc3MoJ3RyYW5zcGFyZW50Jyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRvcCA8IDUgJiYgISQoJ25hdicpLmhhc0NsYXNzKCd0cmFuc3BhcmVudCcpKSB7XG4gICAgICAgICQoJ25hdicpLmFkZENsYXNzKCd0cmFuc3BhcmVudCcpO1xuICAgIH1cbn1cbiIsImZ1bmN0aW9uIHJveWFsX21vZGFscygpIHtcblxuICAgIGZ1bmN0aW9uIGF1dG9wbGF5KHZpZGVvKSB7XG4gICAgICAgIHZpZGVvLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ3tcImV2ZW50XCI6XCJjb21tYW5kXCIsXCJmdW5jXCI6XCJwbGF5VmlkZW9cIixcImFyZ3NcIjpcIlwifScsICcqJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGF1dG9zdG9wKHZpZGVvKSB7XG4gICAgICAgIHZpZGVvLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ3tcImV2ZW50XCI6XCJjb21tYW5kXCIsXCJmdW5jXCI6XCJwYXVzZVZpZGVvXCIsXCJhcmdzXCI6XCJcIn0nLCAnKicpO1xuICAgIH1cblxuICAgIC8vIEJsb2cgVmlkZW9zXG4gICAgaWYgKCQoJyNmZWVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAkKCcubW9kYWwnKS5tb2RhbCh7XG4gICAgICAgICAgICByZWFkeTogZnVuY3Rpb24obW9kYWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgJG1vZGFsID0gJChtb2RhbCk7XG4gICAgICAgICAgICAgICAgdmFyIHZpZGVvU3JjID0gJG1vZGFsLmRhdGEoJ3ZpZGVvLXNyYycpO1xuICAgICAgICAgICAgICAgIHZhciAkaWZyYW1lID0gJG1vZGFsLmZpbmQoJ2lmcmFtZScpO1xuXG4gICAgICAgICAgICAgICAgaWYoJGlmcmFtZSAmJiAhJGlmcmFtZS5hdHRyKCdzcmMnKSl7XG4gICAgICAgICAgICAgICAgICAgICRpZnJhbWUuYXR0cignc3JjJywgdmlkZW9TcmMgKyBcIj9lbmFibGVqc2FwaT0xJnNob3dpbmZvPTBcIilcbiAgICAgICAgICAgICAgICAgICAgJGlmcmFtZS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRvcGxheSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXkoJGlmcmFtZS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24obW9kYWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgJG1vZGFsID0gJChtb2RhbCk7XG4gICAgICAgICAgICAgICAgdmFyICRpZnJhbWUgPSAkbW9kYWwuZmluZCgnaWZyYW1lJyk7XG4gICAgICAgICAgICAgICAgYXV0b3N0b3AoJGlmcmFtZS5nZXQoMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGlmKCQoJ1toZXJvLXZpZGVvLW1vZGFsXScpLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgLy9XZSBuZWVkIHRvIG1vdmUgdGhlIGRvbSBlbGVtZW50IHRvIHRoZSBib2R5IHNvIHRoZSB6LWluZGV4IHdvcmtzIGFuZCB0aGUgXG4gICAgICAgIC8vbW9kYWwgaXMgbm90IGRpc3BsYXllZCBiZWxvdyB0aGUgb3ZlcmxheVxuICAgICAgICAkKFwiW2hlcm8tdmlkZW8tbW9kYWxdXCIpLmRldGFjaCgpLmFwcGVuZFRvKCdib2R5Jyk7XG5cbiAgICAgICAgJCgnW2hlcm8tdmlkZW8tbW9kYWxdJykubW9kYWwoe1xuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKG1vZGFsKSB7XG4gICAgICAgICAgICAgICAgdmFyICRtb2RhbCA9ICQobW9kYWwpO1xuICAgICAgICAgICAgICAgIHZhciAkaWZyYW1lID0gJG1vZGFsLmZpbmQoJ2lmcmFtZScpO1xuICAgICAgICAgICAgICAgIGF1dG9zdG9wKCRpZnJhbWUuZ2V0KDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7IFxuICAgIH1cbn1cbiIsIi8vIE1vdmVzIHRoZSBXb29Db21tZXJjZSBub3RpY2UgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZVxuZnVuY3Rpb24gcm95YWxfbW92ZU5vdGljZSgpIHtcbiAgICAkKCcubm90aWNlJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS5wcmVwZW5kVG8oJCgnbWFpbicpKTtcbiAgICB9KTtcbn1cblxuXG4vLyBNb3ZlcyBuZXdseSBhZGRlZCBXb29Db21tZXJjZSBjYXJ0IG5vdGljZXMgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZVxuZnVuY3Rpb24gcm95YWxfcmVmcmVzaENhcnROb3RpY2UoKSB7XG4gICAgdmFyIGNhcnRMb29wID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKCdtYWluIC5jb250YWluZXIgLm5vdGljZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJveWFsX21vdmVOb3RpY2UoKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoY2FydExvb3ApO1xuICAgICAgICB9XG4gICAgfSwgMjUwKTtcbn1cbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnW2RhdGEtbmV3c2xldHRlci1mb3JtXScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGZvcm0pe1xyXG4gICAgICAgICRmb3JtID0gJChmb3JtKTtcclxuICAgICAgICAkZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJGVtYWlsID0gJGZvcm0uZmluZChcIltuYW1lPWVtYWlsXVwiKS52YWwoKTtcclxuICAgICAgICAgICAgJHRoYW5rX3lvdSA9ICRmb3JtLmZpbmQoXCJbZGF0YS1mb3JtLXN1Y2Nlc3NdXCIpXHJcbiAgICAgICAgICAgICRjb250ZW50ID0gJGZvcm0uZmluZChcIltkYXRhLWZvcm0tY29udGVudF1cIilcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICR0aGFua195b3UucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgICRjb250ZW50LmFkZENsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KTtcclxuIiwiZnVuY3Rpb24gcm95YWxfcXVpeigpIHtcblxuICAgIC8vIEFzc2V0IFByb3RlY3Rpb24gUXVpelxuICAgIGlmICgkKCcjYXNzZXQtcHJvdGVjdGlvbi1xdWl6JykubGVuZ3RoKSB7XG4gICAgICAgIC8vIE1hdGVyaWFsaXplIGNhcm91c2VsIHNldHRpbmdzXG4gICAgICAgICQoJy5jYXJvdXNlbC5jYXJvdXNlbC1zbGlkZXInKS5jYXJvdXNlbCh7XG4gICAgICAgICAgICBmdWxsV2lkdGg6IHRydWUsXG4gICAgICAgICAgICBpbmRpY2F0b3JzOnRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUXVlc3Rpb25zIHBhbmVsIGRpc3BsYXkgJiBuYXZpZ2F0aW9uXG4gICAgICAgICQoJy50b2dnbGUtc2VjdGlvbicpLmhpZGUoKTtcbiAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLnVuYmluZCgnY2xpY2snKS5iaW5kKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQoJy50b2dnbGUtc2VjdGlvbicpLnNsaWRlVG9nZ2xlKCdmYXN0JyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmKCQoJy50b2dnbGUtc2VjdGlvbicpLmNzcygnZGlzcGxheScpPT0nYmxvY2snKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLmh0bWwoXCJDTE9TRSBRVUlaXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuYnRuLXF1aXotdG9nZ2xlJykuYWRkQ2xhc3MoXCJjbG9zZVwiKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLmh0bWwoXCJUQUtFIFRIRSBRVUlaXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuYnRuLXF1aXotdG9nZ2xlJykucmVtb3ZlQ2xhc3MoXCJjbG9zZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVzdWx0cyAmIGVtYWlsXG4gICAgICAgIC8vIENvZGUgZ29lcyBoZXJlLi4uXG4gICAgfVxuXG59XG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tIEdMT0JBTCAtLS0tIC8vXG4gICAgcm95YWxfbWVudXMoKTtcbiAgICByb3lhbF9sb2dpbigpO1xuICAgIHJveWFsX3NpZGViYXIoKTtcblxuXG4gICAgLy8gLS0tLSBHRU5FUkFMIC0tLS0gLy9cbiAgICBpZiAoJC5mbi5wYXJhbGxheCAmJiAkKCcucGFyYWxsYXgnKS5sZW5ndGgpe1xuICAgICAgICAkKCcucGFyYWxsYXgnKS5wYXJhbGxheCgpO1xuICAgIH1cbiAgICBpZiAoJC5mbi5jYXJvdXNlbCAmJiAkKCcuY2Fyb3VzZWwtc2xpZGVyJykubGVuZ3RoKXtcbiAgICAgICAgJCgnLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzNTAsXG4gICAgICAgICAgICBmdWxsV2lkdGg6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSBcblxuXG4gICAgLy8gLS0tLSBNT0JJTEUgLS0tLSAvL1xuXG5cbiAgICAvLyAtLS0tIExBTkRJTkcgUEFHRVMgLS0tLSAvL1xuICAgIGlmICgkKCcjaG9tZScpLmxlbmd0aCkge1xuICAgICAgICAkKCcjaG9tZSAuY2Fyb3VzZWwtc2xpZGVyJykuY2Fyb3VzZWwoe1xuICAgICAgICAgICAgZHVyYXRpb246IDM1MCxcbiAgICAgICAgICAgIGZ1bGxXaWR0aDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dChhdXRvcGxheSwgOTAwMCk7XG4gICAgICAgIGZ1bmN0aW9uIGF1dG9wbGF5KCkge1xuICAgICAgICAgICAgJCgnI2hvbWUgLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKCduZXh0Jyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGF1dG9wbGF5LCAxMjAwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIC0tLS0gUFJPTU9USU9OUyAtLS0tIC8vXG4gICAgaWYgKCQoJy5tb2RhbC10cmlnZ2VyJykubGVuZ3RoKSB7XG4gICAgICAgIHJveWFsX21vZGFscygpO1xuICAgIH1cbiAgICAvKiBpZiAoJCgnLnF1aXonKS5sZW5ndGgpe1xuICAgICAqICAgICByb3lhbF9xdWl6KCk7XG4gICAgICogfSovXG5cblxuICAgIC8vIC0tLS0gRkVFRCAtLS0tIC8vXG4gICAgaWYgKCQoJyNmZWVkJykubGVuZ3RoKSB7XG4gICAgICAgIHJveWFsX2ZlZWQoKTtcbiAgICB9XG4gICAgaWYgKCQoJ21haW4jYXJ0aWNsZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcm95YWxfYXJ0aWNsZSgpO1xuICAgIH1cblxuXG4gICAgLy8gLS0tLSBXT09DT01NRVJDRSAtLS0tIC8vXG4gICAgaWYgKCQoJ2JvZHkud29vY29tbWVyY2UnKS5sZW5ndGgpIHtcbiAgICAgICAgcm95YWxfd29vY29tbWVyY2UoKTtcbiAgICB9XG59KTtcbiIsIi8qICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gKiAgICAgaWYgKCQoJy5teS1hY2NvdW50JykubGVuZ3RoKSB7XG4gKiAgICAgfVxuICogfSkqL1xuIiwidmFyIGRpZFNjcm9sbDtcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKXtcbiAgICBkaWRTY3JvbGwgPSB0cnVlO1xuICAgIHZhciB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAvKiBpZiAoJCgnLmhlcm8tY29udGFpbmVyLCAucGFyYWxsYXgtY29udGFpbmVyJykubGVuZ3RoKSB7XG4gICAgICogICAgIHJveWFsX3RvZ2dsZV9tZW51cyh0b3ApO1xuICAgICAqIH0qL1xuXG4gICAgaWYgKCQoJy5jb25zdWx0YXRpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBoZXJvID0gJCgnLmhlcm8tY29udGFpbmVyJykuaGVpZ2h0KCk7XG4gICAgICAgIGlmICh0b3AgPiBoZXJvICYmICQoJ25hdicpLmhhc0NsYXNzKCduby1zaGFkb3cnKSkge1xuICAgICAgICAgICAgJCgnbmF2JykucmVtb3ZlQ2xhc3MoJ25vLXNoYWRvdycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRvcCA8IGhlcm8gJiYgISQoJ25hdicpLmhhc0NsYXNzKCduby1zaGFkb3cnKSkge1xuICAgICAgICAgICAgJCgnbmF2JykuYWRkQ2xhc3MoJ25vLXNoYWRvdycpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmKCQoJyNmZWVkJykubGVuZ3RoICYmICQoJ1tkYXRhLWxvYWQtbW9yZS1zcGlubmVyXScpLmhhc0NsYXNzKCdoaWRlJykpe1xuICAgICAgICBpZigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgKyAkKCdmb290ZXInKS5oZWlnaHQoKSA+ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICB2YXIgJHNwaW5uZXIgPSAkKCdbZGF0YS1sb2FkLW1vcmUtc3Bpbm5lcl0nKTtcbiAgICAgICAgICAgICRzcGlubmVyLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gJHNwaW5uZXIuZGF0YShcIm9mZnNldFwiKTtcbiAgICAgICAgICAgIHZhciBwb3N0c1BlclBhZ2UgPSAkc3Bpbm5lci5kYXRhKFwicG9zdHMtcGVyLXBhZ2VcIik7XG4gICAgICAgICAgICBnZXRNb3JlUG9zdHMob2Zmc2V0LCBwb3N0c1BlclBhZ2UpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICB2YXIgJHJlcyA9ICQocmVzKTtcbiAgICAgICAgICAgICAgICAkKCcubWFzb25yeScpLmFwcGVuZCggJHJlcyApLm1hc29ucnkoICdhcHBlbmRlZCcsICRyZXMgKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3T2Zmc2V0ID0gb2Zmc2V0K3Bvc3RzUGVyUGFnZTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3UGFyYW1zID0gJz9vZmZzZXQ9JysgbmV3T2Zmc2V0O1xuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7dXJsUGF0aDpuZXdQYXJhbXN9LFwiXCIsbmV3UGFyYW1zKVxuICAgICAgICAgICAgICAgICRzcGlubmVyLmRhdGEoXCJvZmZzZXRcIixuZXdPZmZzZXQpO1xuICAgICAgICAgICAgICAgICRzcGlubmVyLmFkZENsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7IFxuICAgICAgICAgICAgICAgICRzcGlubmVyLmFkZENsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIGlmIChkaWRTY3JvbGwpIHtcbiAgICAgICAgLyogdG9nZ2xlTmF2KCk7Ki9cbiAgICAgICAgZGlkU2Nyb2xsID0gZmFsc2U7XG4gICAgfVxufSwgMjUwKTtcbiIsImZ1bmN0aW9uIHJveWFsX3NpZGViYXIoKSB7XHJcbiAgICAvLyBTaG93IHNpZGViYXIgYnkgZGVmYXVsdCBvbiBmZWVkIHBhZ2VzXHJcbiAgICBpZiAoJCgnI2ZlZWQnKS5sZW5ndGgpIHtcclxuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NpZGViYXItb3BlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvZ2dsZSBzaWRlYmFyIG9uIGNsaWNrXHJcbiAgICAkKCcjc2lkZWJhci1mYWInKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2lkZWJhci1vcGVuJyk7XHJcbiAgICB9KTtcclxufVxyXG4iLCIvLyBDaGFpbmFibGUgc3RhdHVzIHZhcmlhYmxlXHJcbi8vIGV4OiBlbGVtLnN0YXR1cy5tZXRob2QoKTtcclxudmFyIFN0YXR1cyA9IGZ1bmN0aW9uKGVsZW0sIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgU3RhdHVzLmluaXQoZWxlbSwgb3B0aW9ucyk7XHJcbn1cclxuXHJcblxyXG4vLyBTdGF0dXMgTWV0aG9kc1xyXG4vLyBQbGFjZWQgb24gcHJvdG90eXBlIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcclxuU3RhdHVzLnByb3RvdHlwZSA9IHtcclxuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJy5zdGF0dXMtc3dhcCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCcuc3RhdHVzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGVsZW0pLmZpbmQoJy5zdGF0dXMnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLnN0YXR1cy1zd2FwJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCdkaXYnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLmxvYWRpbmcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlcnJvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCdkaXYnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLmVycm9yJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChlbGVtKS5maW5kKCdkaXYnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICQoZWxlbSkuZmluZCgnLnN1Y2Nlc3MnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gSW5pdCBTdGF0dXNcclxuU3RhdHVzLmluaXQgPSBmdW5jdGlvbihlbGVtLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgX2RlZmF1bHRzID0ge1xyXG4gICAgICAgIGxvYWRlcjogJ3NwaW5uZXInLFxyXG4gICAgICAgIHJlYWR5OiB1bmRlZmluZWRcclxuICAgIH1cclxuICAgIHNlbGYuZWxlbSA9IGVsZW0gfHwgJyc7XHJcbiAgICBzZWxmLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgX2RlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICAvKiBjb25zb2xlLmxvZyhzZWxmLmVsZW0pO1xyXG4gICAgICogY29uc29sZS5sb2coc2VsZi5vcHRpb25zKTsqL1xyXG59XHJcblxyXG4vLyBJbml0IFN0YXR1cyBwcm90b3R5cGVcclxuU3RhdHVzLmluaXQucHJvdG90eXBlID0gU3RhdHVzLnByb3RvdHlwZTtcclxuXHJcblxyXG4kLmZuLnN0YXR1cyA9IGZ1bmN0aW9uKG1ldGhvZE9yT3B0aW9ucykge1xyXG4gICAgU3RhdHVzKHRoaXMsIGFyZ3VtZW50c1swXSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuXHJcbi8vIFN1cGVyIGF3ZXNvbWUhISFcclxuJCgnZm9ybSNsb2dpbiAuZm9ybS1zdGF0dXMnKS5zdGF0dXMoKTtcclxuIiwiZnVuY3Rpb24gcm95YWxfd29vY29tbWVyY2UoKSB7XG5cbiAgICAvLyAtLS0tIE5vdGljZXMgLS0tLSAvL1xuICAgIGlmICgkKCcubm90aWNlJykubGVuZ3RoID4gMCkge1xuICAgICAgICByb3lhbF9tb3ZlTm90aWNlKCk7XG4gICAgfVxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ3VwZGF0ZWRfY2FydF90b3RhbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcm95YWxfbW92ZU5vdGljZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gLS0tLSBQcm9kdWN0cyAtLS0tIC8vXG4gICAgaWYgKCQoJ21haW4jcHJvZHVjdCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCgnc2VsZWN0JykubWF0ZXJpYWxfc2VsZWN0KCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLSBDYXJ0IC0tLS0gLy9cbiAgICBpZiAoJCgnLndvb2NvbW1lcmNlLWNhcnQtZm9ybScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCgnLnByb2R1Y3QtcmVtb3ZlIGEnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJveWFsX3JlZnJlc2hDYXJ0Tm90aWNlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIC0tLS0gQ2hlY2tvdXQgLS0tLS0gLy9cbiAgICAvKiAkKCcjcGF5bWVudCBbdHlwZT1yYWRpb10nKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgY29uc29sZS5sb2coJ2NsaWNrJyk7XG4gICAgICogfSk7Ki9cbn1cbiIsImZ1bmN0aW9uIGdldE1vcmVQb3N0cyhvZmZzZXQsIHBvc3RzX3Blcl9wYWdlLCBjYXRlZ29yeSl7XHJcbiAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgdXJsOiAnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXHJcbiAgICAgICAgICAgIHBvc3RzX3Blcl9wYWdlOiBwb3N0c19wZXJfcGFnZSxcclxuICAgICAgICAgICAgYWN0aW9uOiAncmxzX21vcmVfcG9zdHMnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiZnVuY3Rpb24gcm95YWxfYXJ0aWNsZSgpIHtcbiAgICAvLyBSZXNwb25zaXZlIGlGcmFtZXNcbiAgICAvKiAkKCdpZnJhbWUnKS53cmFwKCc8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+PC9kaXY+Jyk7Ki9cblxuICAgIC8vIFBhcmFsbGF4XG4gICAgaWYgKCQoJy5wYXJhbGxheC1jb250YWluZXInKS5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1BBUkFMTEFYJyk7XG4gICAgICAgIHZhciBmZWF0dXJlZCA9ICQoJy5mZWF0dXJlZC1pbWFnZSAucGFyYWxsYXgnKTtcbiAgICAgICAgdmFyIHByb21vdGlvbiA9ICQoJy5wcm9tb3Rpb24taW1hZ2UgLnBhcmFsbGF4Jyk7XG5cbiAgICAgICAgaWYgKGZlYXR1cmVkLmxlbmd0aCAmJiBwcm9tb3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQk9USCcpO1xuICAgICAgICAgICAgZmVhdHVyZWQucGFyYWxsYXgoKTtcbiAgICAgICAgICAgIHByb21vdGlvbi5wYXJhbGxheCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZlYXR1cmVkLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZFQVRVUkVEJyk7XG4gICAgICAgICAgICBmZWF0dXJlZC5wYXJhbGxheCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHByb21vdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQUk9NT1RJTycpO1xuICAgICAgICAgICAgcHJvbW90aW9uLnBhcmFsbGF4KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRUxTRScpO1xuICAgICAgICAgICAgJCgnLnBhcmFsbGF4JykucGFyYWxsYXgoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImZ1bmN0aW9uIHJveWFsX2ZlZWQoKSB7XHJcbiAgICAvKiB2YXIgY29sdW1ucyA9ICAkKCcjZmVlZCAuY29sJykuZmlyc3QoKS5oYXNDbGFzcygnbTknKSA/IDIgOiAzO1xyXG4gICAgICogdmFyIG1hc29ucnkgPSAkKCcubWFzb25yeScpLm1hc29ucnkoe1xyXG4gICAgICogICAgIGl0ZW1TZWxlY3RvcjogJ2FydGljbGUnLFxyXG4gICAgICogICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcclxuICAgICAqICAgICBmaXRXaWR0aDogdHJ1ZSxcclxuICAgICAqICAgICBoaWRkZW5TdHlsZToge1xyXG4gICAgICogICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDEwMHB4KScsXHJcbiAgICAgKiAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAqICAgICB9LFxyXG4gICAgICogICAgIHZpc2libGVTdHlsZToge1xyXG4gICAgICogICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDBweCknLFxyXG4gICAgICogICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogfSk7Ki9cclxuXHJcbiAgICAvKiAkKCcubWFzb25yeScpLm1hc29ucnkoKTsqL1xyXG5cclxuICAgIC8qIGlmICgkLmZuLmltYWdlc0xvYWRlZCkge1xyXG4gICAgICogICAgIG1hc29ucnkuaW1hZ2VzTG9hZGVkKCkucHJvZ3Jlc3MoZnVuY3Rpb24oaW5zdGFuY2UsIGltYWdlKSB7XHJcbiAgICAgKiAgICAgICAgIG1hc29ucnkubWFzb25yeSgnbGF5b3V0Jyk7XHJcbiAgICAgKiAgICAgICAgIHJlc2l6ZUltYWdlcygpO1xyXG4gICAgICogICAgIH0pO1xyXG4gICAgICogICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgKiAgICAgICAgIG1hc29ucnkubWFzb25yeSgnbGF5b3V0Jyk7XHJcbiAgICAgKiAgICAgICAgIHJlc2l6ZUltYWdlcygpO1xyXG4gICAgICogICAgIH0pO1xyXG4gICAgICogfSovXHJcblxyXG4gICAgLy9idXR0b24gdG8gbG9hZCBtb3JlIHBvc3RzIHZpYSBhamF4XHJcbiAgICAvKiAkKCdbZGF0YS1sb2FkLW1vcmUtcG9zdHNdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAqICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICogICAgICR0aGlzLmRhdGEoJ2FjdGl2ZS10ZXh0JywgJHRoaXMudGV4dCgpKS50ZXh0KFwiTG9hZGluZyBwb3N0cy4uLlwiKS5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICogICAgIHZhciBvZmZzZXQgPSAkdGhpcy5kYXRhKFwib2Zmc2V0XCIpO1xyXG4gICAgICogICAgIHZhciBwb3N0c1BlclBhZ2UgPSAkdGhpcy5kYXRhKFwicG9zdHMtcGVyLXBhZ2VcIik7XHJcbiAgICAgKiAgICAgZ2V0TW9yZVBvc3RzKG9mZnNldCwgcG9zdHNQZXJQYWdlKS50aGVuKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgKiAgICAgICAgIHZhciAkcmVzID0gJChyZXMpO1xyXG4gICAgICogICAgICAgICBtYXNvbnJ5LmFwcGVuZCggJHJlcyApLm1hc29ucnkoICdhcHBlbmRlZCcsICRyZXMgKTtcclxuICAgICAqICAgICAgICAgdmFyIG5ld09mZnNldCA9IG9mZnNldCtwb3N0c1BlclBhZ2U7XHJcbiAgICAgKiAgICAgICAgIHZhciBuZXdQYXJhbXMgPSAnP29mZnNldD0nKyBuZXdPZmZzZXQ7XHJcbiAgICAgKiAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7dXJsUGF0aDpuZXdQYXJhbXN9LFwiXCIsbmV3UGFyYW1zKVxyXG4gICAgICogICAgICAgICAkdGhpcy5kYXRhKFwib2Zmc2V0XCIsbmV3T2Zmc2V0KTtcclxuICAgICAqICAgICAgICAgJHRoaXMudGV4dCgkdGhpcy5kYXRhKCdhY3RpdmUtdGV4dCcpKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAqICAgICB9KVxyXG4gICAgICogfSkqL1xyXG5cclxuICAgIHJveWFsX2ZpbHRlclBvc3RzKCk7XHJcbn1cclxuIiwiZnVuY3Rpb24gcm95YWxfZmlsdGVyUG9zdHMoKSB7XG4gICAgJCgnI3NlYXJjaCcpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpbHRlciA9ICQodGhpcykudmFsKCk7XG5cbiAgICAgICAgLy8gRXh0ZW5kIDpjb250YWlucyBzZWxlY3RvclxuICAgICAgICBqUXVlcnkuZXhwclsnOiddLmNvbnRhaW5zID0gZnVuY3Rpb24oYSwgaSwgbSkge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeShhKS50ZXh0KCkudG9VcHBlckNhc2UoKS5pbmRleE9mKG1bM10udG9VcHBlckNhc2UoKSkgPj0gMDtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBIaWRlcyBjYXJkcyB0aGF0IGRvbid0IG1hdGNoIGlucHV0XG4gICAgICAgICQoXCIjZmVlZCAuY29udGVudCAuY2FyZC1jb250YWluZXI6dmlzaWJsZSBhcnRpY2xlIC5jYXJkLXRpdGxlIGE6bm90KDpjb250YWlucyhcIitmaWx0ZXIrXCIpKVwiKS5jbG9zZXN0KCcuY2FyZC1jb250YWluZXInKS5mYWRlT3V0KCk7XG5cbiAgICAgICAgLy8gU2hvd3MgY2FyZHMgdGhhdCBtYXRjaCBpbnB1dFxuICAgICAgICAkKFwiI2ZlZWQgLmNvbnRlbnQgLmNhcmQtY29udGFpbmVyOm5vdCg6dmlzaWJsZSkgYXJ0aWNsZSAuY2FyZC10aXRsZSBhOmNvbnRhaW5zKFwiK2ZpbHRlcitcIilcIikuY2xvc2VzdCgnLmNhcmQtY29udGFpbmVyJykuZmFkZUluKCk7XG5cbiAgICAgICAgLy8gQWRkIGVtcHR5IG1lc3NhZ2Ugd2hlbiBpZiBubyBwb3N0cyBhcmUgdmlzaWJsZVxuICAgICAgICB2YXIgbWVzc2FnZSA9ICQoJyNmZWVkICNuby1yZXN1bHRzJyk7XG4gICAgICAgIGlmICgkKFwiI2ZlZWQgLmNvbnRlbnQgLmNhcmQtY29udGFpbmVyOnZpc2libGUgYXJ0aWNsZSAuY2FyZC10aXRsZSBhOmNvbnRhaW5zKFwiK2ZpbHRlcitcIilcIikuc2l6ZSgpID09IDApIHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLmhhc0NsYXNzKCdoaWRlJykpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjZmVlZCAjbm8tcmVzdWx0cycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lc3NhZ2UuZmluZCgnLnRhcmdldCcpLnRleHQoZmlsdGVyKTtcbiAgICAgICAgfSBlbHNlIHsgbWVzc2FnZS5hZGRDbGFzcygnaGlkZScpOyB9XG5cbiAgICB9KS5rZXl1cChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcbiAgICB9KTtcbn1cbiJdfQ==

})(jQuery);