<?php


namespace app\widgets\assets;

use yii\web\AssetBundle;

class VideoChatAssets extends AssetBundle
{

    public $sourcePath = '@app/widgets/assets';
    public $css = [
        'css/videochat.css'
    ];
    public $js = (YII_DEBUG)?
        [
        'js/socket.js',
        'js/media.js',
        'js/video.js',
        'js/filesp2p.js',
        'js/wrtc.js',
        'js/index.js',
        ] : [
            'build/room.min.js'
        ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap5\BootstrapAsset'
    ];

}