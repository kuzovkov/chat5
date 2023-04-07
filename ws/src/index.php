<?php
require __DIR__ . '/user_repository.php';
require __DIR__ . '/store_repository.php';
require __DIR__ . '/message_repository.php';
require __DIR__ . '/helper.php';
require __DIR__ . '/ws_server.php';

$ws = new \App\WebsocketServer();