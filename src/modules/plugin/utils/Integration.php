<?php

require QTRANSLATE_DIR . '/src/modules/plugin/utils/HasSingletone.php';


abstract class Integration {
	use HasSingletone;


	public static function is_isset( $value, $default = '' ) {
		return isset( $_POST[ $value ] ) ? sanitize_text_field( $_POST[ $value ] ) : $default;
	}

	public function add_ajax( array $actions = array() ) {
		if ( ! empty( $actions ) ) {
			foreach ( $actions as $action => $method ) {
				if ( is_string( $method ) ) {
					add_action( "wp_ajax_$action", array( $this, $method ) );
					add_action( "wp_ajax_nopriv_$action", array( $this, $method ) );
				} else {
					add_action( "wp_ajax_$action", array( $this, $method['callback'] ) );
					if ( isset( $method['public'] ) && $method['public'] == true ) {
						add_action( "wp_ajax_nopriv_$action", array( $this, $method['callback'] ) );
					}
				}
			}
		}
	}
}
