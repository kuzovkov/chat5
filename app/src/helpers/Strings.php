<?php
namespace app\helpers;

class Strings {
    public static function generateNonce($len=32){
        $chars="qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP";
        $size=strlen($chars)-1;
        $nonce = [];
        while($len--) {
            $nonce[] = $chars[rand(0, $size)];
        }
        return implode('', $nonce);
    }

    /**
     * transliterate string
     * @param $str
     * @return sting
     */
    public static function transliterate($str)
    {
        $str = strtolower(str_replace([' ', "\t", "\n"], '-', $str));
        return transliterator_transliterate('Any-Latin; Latin-ASCII; [\u0100-\u7fff] remove', $str);
    }
}
