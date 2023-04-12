<?php
use yii\helpers\Html;
use yii\bootstrap5\ActiveForm;
?>

<h1><?= Html::encode('Free chat without registration') ?></h1>

<p>Please fill out the following fields to start chat:</p>

<?php echo Html::beginForm(['/go'], 'post', ['id' => 'login-form']); ?>

<?= Html::textInput('username', null, ['autofocus' => true, 'require' => true, 'placeholder' => 'Username'])?>
<?= Html::textInput('room', null, ['require' => true, 'placeholder' => 'Room'])?>
<?= Html::submitButton('Go', ['class' => 'btn btn-primary', 'name' => 'login-button', ]) ?>
<div class="error"></div>

<?php echo Html::endForm(); ?>