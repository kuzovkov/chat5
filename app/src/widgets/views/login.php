<?php
use yii\helpers\Html;
use yii\bootstrap5\ActiveForm;
?>


<?php echo Html::endForm(); ?>

<div class="main-container">
    <p>&nbsp;</p>
    <h3><?= Html::encode('Free chat without registration') ?></h3>
    <div class="center">
<!--        <input type="text" value="" placeholder="Enter room" id="room" size="30"> <button id="start-call" class="control-btn"><i class="fa-brands fa-golang"></i></button>-->
        <p>Please fill out the following fields to start chat:</p>

        <?php echo Html::beginForm(['/go'], 'post', ['id' => 'login-form']); ?>

        <?= Html::textInput('username', null, ['autofocus' => true, 'require' => true, 'placeholder' => 'Username'])?>
        <?= Html::textInput('room', null, ['require' => true, 'placeholder' => 'Room'])?>
        <?= Html::submitButton('Go', ['class' => 'btn btn-primary', 'name' => 'login-button', ]) ?>
        <div class="error"></div>
    </div>
    <span>&copy; Kuzovkov.A.V. 2023</span>
    <span>&nbsp;</span>

</div>
