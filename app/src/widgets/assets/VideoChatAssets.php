<?php


namespace app\widgets\assets;

use yii\web\AssetBundle;

class VideoChatAssets extends AssetBundle
{

    public $sourcePath = '@app/widgets/assets';
    public $css = [
        'css/videochat.css'
    ];
    public $js = [
        'js/socket.js',
        'js/ui.js',
        'js/filesp2p',
        'js/vendor/DetectRTC.js',
        'js/wrtc.js',
        'js/app.js',
        'js/index.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];

}