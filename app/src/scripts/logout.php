<?php
if (Auth::isAuth()){
    Auth::logout();
}
header('Location: /');
exit();