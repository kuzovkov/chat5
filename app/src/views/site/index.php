<?php
use yii\bootstrap5\ActiveForm;
use yii\bootstrap5\Html;

/** @var yii\web\View $this */

$this->title = 'Chat 5';
?>
<div class="site-index">
    <h1><?= Html::encode('Free chat without registration') ?></h1>

    <p>Please fill out the following fields to start chat:</p>

    <?php $form = ActiveForm::begin([
        'action' => \Yii::$app->urlManager->createUrl('/go'),
        'method' => 'post',
        'layout' => 'horizontal',
        'fieldConfig' => [
            'template' => "{label}\n{input}\n{error}",
            'labelOptions' => ['class' => 'col-lg-1 col-form-label mr-lg-3'],
            'inputOptions' => ['class' => 'col-lg-3 form-control'],
            'errorOptions' => ['class' => 'col-lg-7 invalid-feedback'],
        ],
    ]); ?>

    <?= Html::textInput('username', null, ['autofocus' => true, 'require' => true, 'placeholder' => 'Username'])?>
    <?= Html::textInput('room', null, ['require' => true, 'placeholder' => 'Room'])?>
    <?= Html::submitButton('Go', ['class' => 'btn btn-primary', 'name' => 'login-button', ]) ?>

    <?php ActiveForm::end(); ?>

</div>
