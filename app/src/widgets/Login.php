<?php

namespace app\widgets;

use yii\base\Widget;
use yii\helpers\Html;
use Yii;
use app\widgets\assets\LoginAssets;

class Login extends Widget{

    public function run(){
        LoginAssets::register($this->view);
        return $this->render('login', []);
    }
}