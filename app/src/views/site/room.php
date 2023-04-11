<?php
use yii\bootstrap5\ActiveForm;
use yii\bootstrap5\Html;
use app\widgets\VideoChat;

/** @var yii\web\View $this */

$this->title = 'Chat5';
?>
<div class="site-index">
    <?php if (isset($this->params['room']) && isset($this->params['username'])):?>
    <?php echo VideoChat::widget(['room' => $this->params['room'], 'username' => $this->params['username']]);?>
    <?php endif;?>
</div>
