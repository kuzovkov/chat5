<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Cookie;
use yii\web\Response;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class SiteController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::class,
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

    public function actionGo()
    {
        $room = Yii::$app->request->getBodyParam('room');
        $username = Yii::$app->request->getBodyParam('username');
        $room = \app\helpers\Strings::transliterate($room);
        if (!$username){
            $username = \app\helpers\Strings::generateNonce(10);
        } else {
            $username = \app\helpers\Strings::transliterate($username);
        }
        $cookies = Yii::$app->response->cookies;
        $cookies->add(new Cookie(['name' => 'username', 'value' => $username]));
        return $this->redirect(Yii::$app->urlManager->createUrl(sprintf('/room/%s', $room)));
    }

    public function actionRoom($room)
    {
        $username = \Yii::$app->request->cookies->getValue('username');
        $this->view->params['room'] = $room;
        $this->view->params['username'] = $username;
        return $this->render('room', ['room' => $room, 'username' => $username]);
    }


}
