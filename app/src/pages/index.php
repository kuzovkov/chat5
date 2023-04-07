<?php
if (Auth::isAuth()){
    header('Location: ' . '/room/'.$_POST['room']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' &&
    isset($_POST['nicname']) && strlen($_POST['nicname'])
    && isset($_POST['room']) && strlen($_POST['room'])
    && !in_array($_POST['room'], ['info', 'login', 'logout'])
){
    Auth::login($_POST['nicname'], $_POST['room']);
    header('Location: ' . '/room/'.$_POST['room']);
    exit();
}
?>


<?php require_once('_header_login.php') ?>

    <div class="input-nicname ui-widget-content">

        <form method="post" action="/" id="login-form">
            <div class="error"></div>
            <label>Choose You NicName and Room: </label>
            <div>
                <input type="text" name="nicname" placeholder="nicname"/>
                <input type="text" name="room" placeholder="room"/>
                <button>Go</button>
            </div>
        </form>
        <div class="header ui-widget-header">
            <h1>Free chat without registration</h1>
        </div>
    </div>

    <script>
        if (!navigator.cookieEnabled) {
            alert( 'Включите cookie для комфортной работы с этим сайтом' );
        }
    </script>

<?php require_once('_footer.php')?>