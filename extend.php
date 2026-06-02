<?php

namespace forumaker\Bento;

use Flarum\Extend;

return [
    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Frontend('forum'))
        ->css(__DIR__ . '/resources/less/forum.less')
        ->js(__DIR__ . '/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->css(__DIR__ . '/resources/less/admin.less')
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Settings())
        ->default('forumaker-bento.columns_desktop', '4')
        ->default('forumaker-bento.plain_create_button', '1')
        ->default('forumaker-bento.layout', 'tiles')
        ->default('forumaker-bento.pill_shape', 'capsule')

        ->serializeToForum('forumaker-bento.columns_desktop', 'forumaker-bento.columns_desktop', 'intval')
        ->serializeToForum('forumaker-bento.plain_create_button', 'forumaker-bento.plain_create_button', 'boolval')
        ->serializeToForum('forumaker-bento.layout', 'forumaker-bento.layout')
        ->serializeToForum('forumaker-bento.pill_shape', 'forumaker-bento.pill_shape'),
];
