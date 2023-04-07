<?php
	class Auth{
		
		static public function login($login, $room){
            $domain = (isset($_SERVER['SERVER_NAME']))? $_SERVER['SERVER_NAME'] : ".kuzovkov12.ru";
		    setrawcookie("nicname", $login , time() + (86400 * 30*356), "/" , $domain);
		    setrawcookie("room", $room , time() + (86400 * 30*356), "/" , $domain);
		}
		

		static protected function _hash($str){
			return md5($str);
		}

		static public function logout(){
            $domain = (isset($_SERVER['SERVER_NAME']))? $_SERVER['SERVER_NAME'] : ".kuzovkov12.ru";
            setrawcookie("nicname", '' , time() - (86400 * 30*356), "/" , $domain);
            setrawcookie("room", '' , time() - (86400 * 30*356), "/" , $domain);
		}
		
		static public function checkPass($login, $pass){
			self::getUsers();
			foreach(self::$users as $user){
				if ($login == $user['login'] && self::_hash($pass) == $user['hash'])
					return true;
			}
			return false;
		}
		
		static public function isAuth(){
            if (isset($_COOKIE['nicname']) && strlen($_COOKIE['nicname']) && isset($_COOKIE['room']) && strlen($_COOKIE['room'])){
                return true;
            }
            return false;
		}

		public static function getCurrentUser(){
            if (isset($_COOKIE['nicname']) && strlen($_COOKIE['nicname'])){
                return $_COOKIE['nicname'];
            }
            return 'quest';
		}

	}
	
	
	