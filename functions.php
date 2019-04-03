<?php

require_once __DIR__ . '/vendor/autoload.php';

$enqueue = new \WPackio\Enqueue('wpack', 'dist', '1.0.0', 'theme', __FILE__);

function wp_theme_scripts()
{
    // Enqueue assets through wpackio/enqueue
    /**
     * @var \WPackio\Enqueue
     */
    global $enqueue;
    $enqueue->enqueue('theme', 'main', ['in_footer' => false]);
}

add_action('wp_enqueue_scripts', 'wp_theme_scripts');