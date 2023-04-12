<?php


namespace app\widgets\assets;

use yii\web\AssetBundle;

class LoginAssets extends AssetBundle
{

    public $sourcePath = '@app/widgets/assets';
    public $css = [
        'css/login.css'
    ];
    public $js = [
        'js/socket.js',
        'js/login.js',
    ];
    public $depends = [

    ];

}