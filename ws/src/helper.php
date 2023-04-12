<?php

function getIce(){
    return base64_encode(file_get_contents(__DIR__ . '/ice.json'));
}

function generateNonce($len=6){
    $chars="qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP";
    $size=strlen($chars)-1;
    $nonce = [];
    while($len--) {
        $nonce[] = $chars[rand(0, $size)];
    }
    return implode('', $nonce);
}