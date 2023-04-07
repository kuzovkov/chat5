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
    <script>
        var NICNAME = "<?=(isset($_COOKIE['nicname']))? $_COOKIE['nicname'] : 'null'?>";
        var ROOM = "<?=(isset($_COOKIE['room']))? $_COOKIE['room'] : 'null'?>";
    </script>
    <script type="text/javascript" src="/vendor/jquery/jquery-1.12.4.js"></script>
    <script type="text/javascript" src="/vendor/jquery-ui/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/js/ui.js"></script>
    <script src="/vendor/muaz-khan/DetectRTC.js"></script>
    <script type="text/javascript" src="/js/ajax.js"></script>
    <script type="text/javascript" src="/js/socket.js"></script>
    <script type="text/javascript" src="/js/files.js"></script>
    <script type="text/javascript" src="/js/filesp2p.js"></script>
    <script type="text/javascript" src="/js/wrtc.js"></script>
    <script type="text/javascript" src="/js/audioapi.js"></script>
    <script type="text/javascript" src="/js/iface.js"></script>
    <script type="text/javascript" src="/js/app.js"></script>
    <script type="text/javascript" src="/js/index.js"></script>
    <script type="text/javascript" src="/js/cookie.js"></script>


</head>
<body>
<div class="content-wrapper">