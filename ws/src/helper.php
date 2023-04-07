<?php

function getIce(){
    return base64_encode(file_get_contents(__DIR__ . '/ice.json'));
}