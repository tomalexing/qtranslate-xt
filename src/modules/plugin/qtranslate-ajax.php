<?php
/**
 * Switch languaage for Gutenberg page and site editor pages.
 * @author: tomalexing
 */

require QTRANSLATE_DIR . '/src/modules/plugin/utils/Integration.php';

class QtranslateAjax extends Integration
{

    private static $qtranslate_default_language_key ;
    private static $qtranslate_language_config_key ;
    private $plugin_basename;
    private $plugin_path;
    private $assets_dir;
    public $version = '1.0.0';

    public function __construct()
    {

        self::$qtranslate_default_language_key = 'qtranslate_default_language';
        self::$qtranslate_language_config_key = 'qtranslate_enabled_languages';

        $this->add_ajax(
            [
                'qtranslate_options'     => [
                    'callback' => 'get_qtranslate_options',
                    'public'   => true
                 ]
             ]
        );

        $this->plugin_basename = basename(plugin_dir_path( __FILE__ ));
        $this->plugin_path = plugin_dir_path( __FILE__ );

        add_action( 'admin_init', [ $this, 'localize_enqueue_scripts' ] );
    }
    
    public function localize_enqueue_scripts(){
        
        $this->enqueue('qtranslateAjax-localize', 'localize.js');
        //  var_dump(plugin_dir_url(__FILE__) . basename('/  localize.js'));
        // wp_enqueue_script('plugin-qtranslateAjax-localize', plugin_dir_url(__FILE__) . basename('/localize.js')); 
        $localize_array = [
            'admin_url'                  => get_admin_url(),
            'rest_rootURL'               => get_rest_url(),
            'ajax_url'                   => admin_url( 'admin-ajax.php' ),
        ];

              
        $settings = $this->get_options();

        $localize_array['settings'] = $settings;
        if ( is_admin() ) {
            $admin_localize_array = [
                'admin_nonce'         => wp_create_nonce( 'admin-nonce' ),
             ];

            $localize_array = array_merge( $localize_array, $admin_localize_array );
        }

        $this->localize( 'qtranslateAjax-localize', 'QtranslateAjax', $localize_array );
    }

    
    public function enqueue( $handle, $filename = null, $dependencies = [], $args = null ) {
        $handle = $this->handle( $handle );
        $config = $this->asset_config( $filename, $dependencies, $args );
   
        $this->call_wp_func( 'wp_enqueue', $handle, $config );
    }


  
    public function handle( $handle ) {
        return $this->plugin_basename . '-' . $handle;
    }

    public function localize( $handle, $name, $args ) {
        $handle = $this->handle( $handle );
        // wp_enqueue_script($handle, plugin_dir_url( __FILE__ ) . 'localize.js');
        wp_localize_script( $handle, $name, $args );
    }

 
    private function get_options(){
        $default_language = get_option( self::$qtranslate_default_language_key );
        $language_config = get_option( self::$qtranslate_language_config_key );
        $lang_cfg = array();
        foreach ( $language_config as $i => $lang ) {
            $language_config[ $lang ] = array();
            $lang_cfg                = &$language_config[ $lang ];
            $lang_cfg['name']         = qtranxf_default_language_name()[ $lang ];
            unset($language_config[$i]);
        }
        $settings = [];
        if(isset($default_language))
        $settings['default_language'] = $default_language;
        if(isset($default_language))
        $settings['language_config'] = $language_config;
        return $settings;
    }

    public function get_qtranslate_options(){
        if ( ! wp_verify_nonce( sanitize_key( $_POST[ 'admin_nonce' ] ), 'admin-nonce' ) ) {
            wp_send_json_error( __( 'Nonce did not match!', 'essential-blocks' ) );
            wp_die();
        }

        $settings = $this->get_options();

        if ( is_array( $settings ) && count( $settings ) > 0 ) {
            wp_send_json_success( $settings );
        } else {
            wp_send_json_error( "Couldn't found settings" );
        }
        exit;
    }



    private function call_wp_func( $action, $handle, $config ) {
        call_user_func( $action . '_' . $config['type'], $handle, $config['url'], $config['dependencies'], $config['version'], $config['args'] );

        if ( 'script' === $config['type'] && in_array( 'wp-i18n', $config['dependencies'], true ) ) {
            wp_set_script_translations( $handle, 'qtanslate-xt' );
        }
    }

    public function asset_config( $filename, $dependencies = [], $args = null ) {
        $is_js             = preg_match( '/\.js$/', $filename );
        $basename          = preg_replace( '/\.\w+$/', '', $filename );
        $file_basename     = basename( $filename );
        $url               = $this->asset_url( $filename, $file_basename );
        $asset_config_path = $this->dist_path( $basename . '.asset.php' );

        if ( ! empty( $args['is_js'] ) ) {
            $is_js = (bool) $args['is_js'];
            $args  = null;
        }

        if ( file_exists( $asset_config_path ) ) {
            $asset_config = require $asset_config_path;

            if ( $is_js ) {
                $dependencies = array_unique( array_merge( $asset_config['dependencies'], $dependencies ) );
            }
            $version = $asset_config['version'];
        }

        return [
            'url'          => $url,
            'dependencies' => $dependencies,
            'version'      => $this->version ?? $version,
            'type'         => $is_js ? 'script' : 'style',
            'args'         => null !== $args ? $args : ( $is_js ? true : 'all' )
        ];
    }

    private function filename( $name ) {
        if ( strpos( $name, '..' ) === 0 ) {
            $name             = str_replace( '../', '', $name );
            $this->assets_dir = '';
        }

        return $name;
    }

    private function get_dir( $name ) {
        $name = $this->filename( $name );
        if ( strpos( $name, $this->plugin_path ) === 0 ) {
            return $name;
        }

        return $this->plugin_path . $this->assets_dir . $name;
    }

    public function asset_url( $filename, $file_basename ) {
        if ( filter_var( $filename, FILTER_VALIDATE_URL ) ) {
            return $filename;
        }
        return plugin_dir_url( $this->get_dir( $filename ) ) . $file_basename;
    }

    public function dist_path( $file ) {
        return $this->get_dir( $file );
    }


}




if(!function_exists('qtranxf_default_language_name')){

/**
 * Names for languages in the corresponding native language.
 * @since 3.3
 */
function qtranxf_default_language_name(): array {
    return array(
        'en' => 'English',
        'zh' => '中文',   // 简体中
        'de' => 'Deutsch',
        'ru' => 'Русский',
        'fi' => 'suomi',
        'fr' => 'Français',
        'nl' => 'Nederlands',
        'sv' => 'Svenska',
        'it' => 'Italiano',
        'ro' => 'Română',
        'md' => 'Moldovenească',
        'hu' => 'Magyar',
        'ja' => '日本語',
        'es' => 'Español',
        'vi' => 'Tiếng Việt',
        'ar' => 'العربية',
        'pt' => 'Português',
        'pb' => 'Português do Brasil',
        'pl' => 'Polski',
        'gl' => 'galego',
        'tr' => 'Turkish',
        'et' => 'Eesti',
        'hr' => 'Hrvatski',
        'eu' => 'Euskera',
        'el' => 'Ελληνικά',
        'uk' => 'Українська',
        'ua' => 'Українська',  // TODO: disambiguate uk vs ua
        'cy' => 'Cymraeg',
        'ca' => 'Català',
        'sk' => 'Slovenčina',
        'lt' => 'Lietuvių',
        'kk' => 'Қазақ тілі',
        'cs' => 'Čeština',
        // tw => '繁體中文',
    );
}

}