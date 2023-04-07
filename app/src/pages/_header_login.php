<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat5</title>
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="/vendor/jquery-ui/jquery-ui.min.css">
    <link rel="stylesheet" href="/vendor/jquery-ui/jquery-ui.theme.min.css">
    <link rel="stylesheet" href="/vendor/jquery-ui/jquery-ui.structure.min.css">
    <script>var NICNAME = <?php if (isset($_COOKIE['nicname'])):?> "<?=$_COOKIE['nicname']?>"<?php else:?> null; <?php endif;?></script>
    <script type="text/javascript" src="/js/socket.js"></script>
    <script type="text/javascript" src="/js/login.js"></script>
    <script type="text/javascript" src="/js/index.js"></script>


</head>
<body>
<div class="content-wrapper">