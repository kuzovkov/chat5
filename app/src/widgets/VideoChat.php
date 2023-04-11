<?php

namespace app\widgets;


use yii\base\Widget;
use yii\helpers\Html;
use Yii;
use app\widgets\assets\VideoChatAssets;



class VideoChat extends Widget{

    public $room = 'default';
    public $username = null;

    public function run(){
        $options = [
            'room' => $this->room,
            'username' => $this->username,
        ];
        $this->view->registerJs(
            "var videochatOptions = ".\yii\helpers\Json::htmlEncode($options).";",
            \yii\web\View::POS_HEAD,
            'videochatOptions'
        );
        VideoChatAssets::register($this->view);
        return $this->render('videochat', ['room' => $this->room, 'username' => $this->username]);
    }
}