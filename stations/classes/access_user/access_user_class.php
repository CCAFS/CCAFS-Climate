<?php
/************************************************************************
Access_user Class ver. 1.99
A complete PHP suite to protect pages and maintain members

Copyright (c) 2004 - 2008, Olaf Lederer
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of the finalwebsites.com nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

_________________________________________________________________________
available at http://www.finalwebsites.com/snippets.php?id=10
Comments & suggestions: http://www.finalwebsites.com/forums/forum/php-classes-support-forum

*************************************************************************/

// header("Cache-control: private"); // //IE 6 Fix 
// error_reporting (E_ALL); // I use this only for testing
require_once($_SERVER['DOCUMENT_ROOT']."/stations/classes/access_user/db_config.php"); // this path works for me...

// new since version 1.92: storage of sessions in MySQL
if (USE_MYSQL_SESSIONS) {
	include_once($_SERVER['DOCUMENT_ROOT']."/stations/classes/access_user/session_handler.php"); 
} else {
	session_start();
}

class Access_user {
	
	var $table_name = USER_TABLE; 
	
	var $user;
	var $user_pw;
	var $user_full_name;
	var $user_info;
	var $user_email;
	var $save_login = "yes";
	var $cookie_name = COOKIE_NAME;
	var $cookie_path = COOKIE_PATH; 
	var $is_cookie;
	
	var $count_visit;
	
	var $id;
	var $language = "en"; // change this property to use messages in another language 
	var $the_msg;
	var $auto_activation; // use this variable in your login script
	var $send_copy = true; // send a mail copy (after activation) to the administrator 
	
	var $webmaster_mail = WEBMASTER_MAIL;
	var $webmaster_name = WEBMASTER_NAME;
	var $admin_mail = ADMIN_MAIL;
	var $admin_name = ADMIN_NAME;
	
	var $login_page = LOGIN_PAGE;
	var $main_page = START_PAGE;
	var $password_page = ACTIVE_PASS_PAGE;
	var $deny_access_page = DENY_ACCESS_PAGE;
	var $admin_page = ADMIN_PAGE;
	
	function Access_user($redirect = true) {
		$this->connect_db();
		if (empty($_SESSION['logged_in'])) {
			$this->login_reader();
			if ($this->is_cookie) {
				$this->set_user($redirect);
			}
		} 		
		if (isset($_SESSION['user'], $_SESSION['pw'])) {
			$this->user = $_SESSION['user'];
			$this->user_pw = $_SESSION['pw'];
		}
		// exit;
	}
	// removed check for encoded var $this->user_pw
	// replaced in default case var $password with $this->user_pw
	// added MD5 to sql statement for "new_pass"
	
	function check_user($pass = "") {
		switch ($pass) {
			case "new": 
			$sql = sprintf("SELECT COUNT(*) AS test FROM %s WHERE email = %s OR login = %s", $this->table_name, $this->ins_string($this->user_email), $this->ins_string($this->user));
			break;
			case "lost":
			$sql = sprintf("SELECT COUNT(*) AS test FROM %s WHERE email = %s AND active = 'y'", $this->table_name, $this->ins_string($this->user_email));
			break;
			// new login name based check before new password activation
			case "new_pass":
			$sql = sprintf("SELECT COUNT(*) AS test FROM %s WHERE MD5(CONCAT(login, %s)) = %s", $this->table_name, $this->ins_string(SECRET_STRING), $this->ins_string($this->check_user));
			break;
			case "active":
			$sql = sprintf("SELECT COUNT(*) AS test FROM %s WHERE id = %d AND active = 'n'", $this->table_name, $this->id);
			break;
			case "validate":
			$sql = sprintf("SELECT COUNT(*) AS test FROM %s WHERE id = %d AND tmp_mail <> ''", $this->table_name, $this->id);
			break;
			default:
			$sql = sprintf("SELECT COUNT(*) AS test FROM %s WHERE login = %s AND pw = %s AND active = 'y'", $this->table_name, $this->ins_string($this->user), $this->ins_string($this->user_pw));
		}
		$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
		$result = pg_query($conn_str, $sql);
		
		if (pg_fetch_row($result)[0] == 1) {
			return true;
		} else {
			return false;
		}
		
		
	}
	// New methods to handle the access level	
	function get_access_level() {
		$sql = sprintf("SELECT access_level FROM %s WHERE login = %s AND active = 'y'", $this->table_name, $this->ins_string($this->user));
		
		$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
		$result = pg_query($conn_str, $sql);
		
		$level= pg_fetch_row($result)[0];

		if (!$result = $level) { //mysql_query($sql)
		   $this->the_msg = $this->messages(14);
		   
		} else {
			return $level;
		}
	}
	function set_user($goto_page) {
		$_SESSION['user'] = $this->user;
		$_SESSION['pw'] = $this->user_pw;
		$_SESSION['logged_in'] =  time(); // to offer a time limited access (later)
		// print_r("usuario->".$this->user);
		// exit;

		if (!empty($_SESSION['referer'])) {
			$next_page = $_SESSION['referer']; //$_SERVER['HTTP_REFERER']; 
			
			unset($_SESSION['referer']);


		} else {
			// $next_page = $this->main_page;
			// echo "{success: true}";
			// echo "OK";

		}
		if ($goto_page) {
			// header("Location: ".$next_page);
			// echo "success: true";
			// print $goto_page;
			echo "OK";
			//header('Location: http://'.$_SERVER['HTTP_HOST'].'/ejemplos/phpUserClass/example-jquery.php');
			// header('Location: http://'.$_SERVER['HTTP_HOST'].'/Pagina_web/Pagina/SigturValle.php');
			//header('Location: http://'.$_SERVER['HTTP_HOST'].'/classes/access_user/index.php');
			//header('Location: http://'.$_SERVER['HTTP_HOST'].'/classes/access_user/testpage.php');
			exit;
		}
	}
	function connect_db() {
		$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
	}
	// added md5 to var $password
	// changed argument for req_visit to $this->user_pw
	function login_user($user, $password) {
		if ($user != "" && $password != "") {
			$this->user = $user;
			$this->user_pw = md5($password);
			if ($this->check_user()) {
				$this->login_saver();
				if ($this->count_visit) {
					$this->reg_visit($user, $this->user_pw);
				}
				$this->set_user(true);

			} else {
				// $this->the_msg = $this->messages(10); //El Nombre de usuario y/o Contrase&ntilde;a son incorrectas.
				echo 10;
								
			}
		} else {
			$this->the_msg = $this->messages(11);

		}
	}

	function login_saver() {
		if ($this->save_login == "no") {
			if (isset($_COOKIE[$this->cookie_name])) {
				$expire = time()-3600;
			} else {
				return;
			}
		} else {
			$expire = time()+2592000;
		}	
		$cookie_str = $this->user.chr(31).base64_encode($this->user_pw);
		setcookie($this->cookie_name, $cookie_str, $expire, $this->cookie_path);
	}
	function login_reader() {
		if (isset($_COOKIE[$this->cookie_name])) {
			$cookie_parts = explode(chr(31), $_COOKIE[$this->cookie_name]);
			$this->user = $cookie_parts[0];
			$this->user_pw = base64_decode($cookie_parts[1]);
			if ($this->check_user()) {
				$this->is_cookie = true;
			} else {
				unset($this->user);
				unset($this->user_pw);
			}
		}			 
	}
	// removed the md5 from var $pass
	function reg_visit($login, $pass) {
		$visit_sql = sprintf("UPDATE %s SET extra_info = '%s' WHERE login = %s AND pw = %s", $this->table_name, date("Y-m-d H:i:s"), $this->ins_string($login), $this->ins_string($pass));
		$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
		pg_query($conn_str, $visit_sql);		
		// mysql_query($visit_sql);
	}
	function log_out() {
		unset($_SESSION['user']);
		unset($_SESSION['pw']);
		unset($_SESSION['logged_in']);
		session_destroy(); // new in version 1.92
		// header("Location: ".LOGOUT_PAGE);
		exit;
	}
	function access_page($refer = "", $qs = "", $level = DEFAULT_ACCESS_LEVEL) {
		$refer_qs = $refer;
		$refer_qs .= ($qs != "") ? "?".$qs : "";
		if (!$this->check_user()) {
		// print_r("usuario->".$_SESSION['user']);
		// exit;
			$_SESSION['referer'] = $_SERVER['REQUEST_URI']; // $refer_qs;
			// header("Location: ".$this->login_page);
			exit;

		}
		if ($this->get_access_level() < $level) {
			// header("Location: ".$this->deny_access_page);
			exit;
		}
	}

	function get_user_info() {
		$sql_info = sprintf("SELECT id, real_name, extra_info, email FROM %s WHERE login = %s AND pw = %s", $this->table_name, $this->ins_string($this->user), $this->ins_string($this->user_pw));
		$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
		$res_info = pg_query($conn_str, $sql_info);
		
		// $res_info = mysql_query($sql_info);
		$this->id = pg_fetch_row($res_info)[0];
		$this->user_full_name = pg_fetch_row($res_info)[1];
		$this->user_info = pg_fetch_row($res_info)[2];
		$this->user_email = pg_fetch_row($res_info)[3];
	}
	function update_user($new_password, $new_confirm, $new_name, $new_info, $new_mail) {
		if ($new_password != "") {
			if ($this->check_new_password($new_password, $new_confirm)) {
				$ins_password = md5($new_password);
				$update_pw = true;
			} else {
				return;
			}
		} else {
			$ins_password = $this->user_pw;
			$update_pw = false;
		}
		if (trim($new_mail) <> $this->user_email) {
			if  ($this->check_email($new_mail)) {
				$this->user_email = $new_mail;
				if (!$this->check_user("lost")) {
					$update_email = true;
				} else {
					$this->the_msg = $this->messages(31);
					return;
				}
			} else {
				$this->the_msg = $this->messages(16);
				return;
			}
		} else {
			$update_email = false;
			$new_mail = "";
		}
		$upd_sql = sprintf("UPDATE %s SET pw = %s, real_name = %s, extra_info = %s, tmp_mail = %s WHERE id = %d", 
			$this->table_name,
			$this->ins_string($ins_password),
			$this->ins_string($new_name),
			$this->ins_string($new_info),
			$this->ins_string($new_mail),
			$this->id);
		// $upd_res = mysql_query($upd_sql);
		$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
		$upd_res = pg_query($conn_str, $upd_sql);		
		
		if ($upd_res) {
			if ($update_pw) {
				$_SESSION['pw'] = $this->user_pw = $ins_password;
				if (isset($_COOKIE[$this->cookie_name])) {
					$this->save_login = "yes";
					$this->login_saver();
				}
			}
			$this->the_msg = $this->messages(30);
			if ($update_email) {
				if ($this->send_mail($new_mail, 33)) {
					$this->the_msg = $this->messages(27);
				} else {
					// mysql_query(sprintf("UPDATE %s SET tmp_mail = ''", $this->table_name));
					pg_query($conn_str, sprintf("UPDATE %s SET tmp_mail = ''", $this->table_name));
					$this->the_msg = $this->messages(14);
					
					
				} 
			}
		} else {
			$this->the_msg = $this->messages(15);
		}
	}
	function check_new_password($pass, $pw_conform) {
		if ($pass == $pw_conform) {
			if (strlen($pass) >= PW_LENGTH) {
				return true;
			} else {
				$this->the_msg = $this->messages(32);
				return false;
			}
		} else {
			$this->the_msg = $this->messages(38);
			return false;
		}	
	}
	function check_email($mail_address) {
		if (preg_match("/^[0-9a-z]+(([\.\-_])[0-9a-z]+)*@[0-9a-z]+(([\.\-])[0-9a-z-]+)*\.[a-z]{2,4}$/i", $mail_address)) {
		//if ($mail_address = "jaime.tm8@gmail.com") {
			return true;
		} else {
			return false;
		}
	}
	function ins_string($value) {
		if (preg_match("/^(.*)(##)(int|date|eu_date)$/", $value, $parts)) {
			$value = $parts[1];
			$type = $parts[3];
		} else {
			$type = "";
		}
		$value = (!get_magic_quotes_gpc()) ? addslashes($value) : $value;
		switch ($type) {
			case "int":
			$value = ($value != "") ? intval($value) : NULL;
			break;
			case "eu_date":
			$date_parts = preg_split ("/[\-\/\.]/", $value); 
			$time = mktime(0, 0, 0, $date_parts[1], $date_parts[0], $date_parts[2]);
			$value = strftime("'%Y-%m-%d'", $time);
			break;
			case "date":
			$value = "'".preg_replace("/[\-\/\.]/", "-", $value)."'";
			break;
			default:
			$value = ($value != "") ? "'" . $value . "'" : "''";
		}
		return $value;
	}
	function register_user($first_login, $first_password, $confirm_password, $first_name, $first_info, $first_email) {
		if ($this->check_new_password($first_password, $confirm_password)) {
			if (strlen($first_login) >= LOGIN_LENGTH) {
				if ($this->check_email($first_email)) {
					$this->user_email = $first_email;
					$this->user = $first_login;
					if ($this->check_user("new")) {
						$this->the_msg = $this->messages(12); //Lo siento, un usuario con este Nombre de usuario y/o correo electronico ya existe.
						
						return;
					} else {
						$sql = sprintf("INSERT INTO %s (login, pw, real_name, extra_info, email, access_level, active) VALUES (%s, %s, %s, %s, %s, %d, 'y')",
						
							$this->table_name,
							$this->ins_string($first_login),
							$this->ins_string(md5($first_password)),
							$this->ins_string($first_name),
							$this->ins_string($first_info),
							$this->ins_string($this->user_email),
							DEFAULT_ACCESS_LEVEL);
						// $ins_res = mysql_query($sql); //or die(mysql_error());
						
						$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
						$ins_res = pg_query($conn_str, $sql);						
						
						if ($ins_res) {
							$this->id = pg_fetch_row($ins_res)[0];
							$this->user_pw = $first_password; //md5($first_password);   ver. 1.86
							if ($this->send_mail($this->user_email)){   //, 29, 28)) {
								// $this->the_msg = $this->messages(13);
								echo "OK";
							} else {
								// mysql_query(sprintf("DELETE FROM %s WHERE id = %d", $this->table_name, $this->id));
								pg_query($conn_str, sprintf("DELETE FROM %s WHERE id = %d", $this->table_name, $this->id));
								$this->the_msg = $this->messages(14);
								
								
							}
						} else {
							$this->the_msg = $this->messages(15);
						}
					}
				} else {
					$this->the_msg = $this->messages(16);
				}
			} else {
				$this->the_msg = $this->messages(17);
			}
		}
	}
	function validate_email($validation_key, $key_id) {
		if ($validation_key != "" && strlen($validation_key) == 32 && $key_id > 0) {
			$this->id = $key_id;
			if ($this->check_user("validate")) {
				$upd_sql = sprintf("UPDATE %s SET email = tmp_mail, tmp_mail = '' WHERE id = %d AND MD5(pw) = %s", $this->table_name, $key_id, $this->ins_string($validation_key));
				$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
				$result = pg_query($conn_str, $upd_sql);
				// if (mysql_query($upd_sql)) {
				if ($result) {
					$this->the_msg = $this->messages(18);
					
				} else {
					$this->the_msg = $this->messages(19);
				}
			} else {
				$this->the_msg = $this->messages(34);
			}
		} else {
			$this->the_msg = $this->messages(21);
			echo "hola";
		}
	}
	// upd. version 1.97 only activate status active = 'n', update the database table:
	// ALTER TABLE `users` CHANGE `active` `active` ENUM( 'y', 'n', 'b' ) DEFAULT 'n' NOT NULL 

/* 		function activate_account($activate_key, $key_id) {
		if ($activate_key != "" && strlen($activate_key) == 32 && $key_id > 0) {
			$this->id = $key_id;
			if ($this->check_user("active")) {
				if ($this->auto_activation) {
					$upd_sql = sprintf("UPDATE %s SET active = 'y' WHERE id = %d AND MD5(pw) = %s AND active = 'n'", $this->table_name, $key_id, $this->ins_string($activate_key));
					if (mysql_query($upd_sql)) {
						if ($this->send_confirmation($key_id)) {
							$this->the_msg = $this->messages(18);
							//echo "hola";
						} else {
							$this->the_msg = $this->messages(14);
							
						}
					} else {
						$this->the_msg = $this->messages(19);
					}
				} else {
					if ($this->send_mail($this->admin_mail, 40, 39)) {
						$this->the_msg = $this->messages(36);
					} else {
						$this->the_msg = $this->messages(14);
					}
				}
			} else {
				$this->the_msg = $this->messages(20);
			}
		} else {
			$this->the_msg = $this->messages(21);
		}
	} */
	
	function activate_account($activate_key, $key_id) { // ver. 1.86
		if ($activate_key != "" && strlen($activate_key) == 32 && $key_id > 0) {
			$this->id = $key_id;
			if ($this->check_user("active")) {
				if ($this->auto_activation) {
					$upd_sql = sprintf("UPDATE %s SET active = 'y' WHERE id = %s AND pw = '%s'", $this->table_name, $key_id, $activate_key);
					$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
					$result = pg_query($conn_str, $upd_sql);					
					// if (mysql_query($upd_sql)) {
					if ($result) {
						if ($this->send_confirmation($key_id)) {
							$this->the_msg = $this->messages(18);
						} else {
							$this->the_msg = $this->messages(14);
						
						}
					} else {
						$this->the_msg = $this->messages(19);
					}
				} else {
					if ($this->send_mail($this->admin_mail, 0, true)) {
						$this->the_msg = $this->messages(36);
					} else {
						$this->the_msg = $this->messages(14);
					}
				}
			} else {
				$this->the_msg = $this->messages(20);
			}
		} else {
			$this->the_msg = $this->messages(21);
		}
	}	
	

	function forgot_password($forgot_email) { 
		if ($this->check_email($forgot_email)) {
			$this->user_email = $forgot_email;
			if (!$this->check_user("lost")) {
				$this->the_msg = $this->messages(22);
			} else {
				// changed from pw to login for verification string
				$forgot_sql = sprintf("SELECT login FROM %s WHERE email = %s", $this->table_name, $this->ins_string($this->user_email));
				$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
				$result = pg_query($conn_str, $forgot_sql);				
				// if ($forgot_result = mysql_query($forgot_sql)) {
				if ($forgot_result = pg_fetch_row($result)[0]) {
					$this->user = mysql_result($forgot_result, 0, "login");
					if ($this->send_mail($this->user_email, 35, 26)) {
						$this->the_msg = $this->messages(23);
					} else {
						$this->the_msg = $this->messages(14);
						
					}
				} else {
					$this->the_msg = $this->messages(15);
				}
			}
		} else {
			$this->the_msg = $this->messages(16);
		}
	}
	function check_activation_password($controle_str) {
		if ($controle_str != "" && strlen($controle_str) == 32) {
			$this->check_user = $controle_str;
			if ($this->check_user("new_pass")) {
				// this is a fix for version 1.76
				// we need this login name that teh user will remember the name too
				$sql_get_user = sprintf("SELECT login FROM %s WHERE MD5(CONCAT(login, %s)) = %s", $this->table_name, $this->ins_string(SECRET_STRING), $this->ins_string($this->check_user));
				//$sql_get_user = sprintf("SELECT login FROM %s WHERE login = %s", $this->table_name, $this->ins_string($this->check_user)); 
				// $get_user = mysql_query($sql_get_user);
				$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
				$get_user = pg_query($conn_str, $sql_get_user);				
				
				$this->user = pg_fetch_row($get_user)[0];//mysql_result($get_user, 0, "login"); // end fix
				return true;
			} else {
				$this->the_msg = $this->messages(21);
				return false;
			}
		} else {
			$this->the_msg = $this->messages(21);
			return false;
		}
	}
	function activate_new_password($new_pass, $new_confirm, $verif_str,$user) {
		if ($this->check_new_password($new_pass, $new_confirm)) {
			
			// new password is set based on user name now
			$sql_new_pass = sprintf("UPDATE %s SET pw = '%s' WHERE login = %s", $this->table_name, md5($new_pass), $this->ins_string($user)); // MODIFICADO
			//$sql_new_pass = sprintf("UPDATE %s SET pw = '%s' WHERE MD5(CONCAT(login, %s)) = %s", $this->table_name, md5($new_pass), $this->ins_string(SECRET_STRING), $this->ins_string($verif_str));
			$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
			$result = pg_query($conn_str, $sql_new_pass);
			// if (mysql_query($sql_new_pass)) {
			if ($result) {
				$this->the_msg = $this->messages(30);
				return true;
			} else {
				$this->the_msg = $this->messages(14);
				
				return false;
			}
		} else {
			return false;
		}
	}
	function send_confirmation($id) {
		$sql = sprintf("SELECT real_name, email FROM %s WHERE id = %d", $this->table_name, $id);
		// $res = mysql_query($sql);
		$conn_str = pg_connect("dbname=".DB_NAME." host=".DB_SERVER." user=".DB_USER." password=".DB_PASSWORD." port=".PG_PORT);
		$result = pg_query($conn_str, $sql);		
		
		$user_email = pg_fetch_row($result)[1];//mysql_result($res, 0, "email");
		$this->user_full_name = pg_fetch_row($result)[0];//mysql_result($res, 0, "real_name");
		if ($this->user_full_name == "") $this->user_full_name = "User"; // change "User" to whatever you want, it's just a default name
		if ($this->send_mail($user_email, 37, 24, $this->send_copy)) {
			return true;
		} else {
			return false;
		}
	}
	// new in version 1.99 support for phpmailer as alternative mail program
	function send_mail($mail_address, $msg = 29, $subj = 28, $send_admin = false) {
		$subject = $this->messages($subj);
		$body = $this->messages($msg);
		if (USE_PHP_MAILER) {
			$mail = new PHPMailer();
			if (PHP_MAILER_SMTP) {
				$mail->IsSMTP();
				$mail->Host = SMTP_SERVER;
				$mail->SMTPAuth = true;  
				$mail->Username = SMTP_LOGIN;
				$mail->Password = SMTP_PASSWD;
				 
				
			} else {
				$mail->IsSendmail(); 
			}
			$mail->From = $this->webmaster_mail;
			$mail->FromName = $this->webmaster_name;
			$mail->AddAddress($mail_address);
			if ($send_admin) $mail->AddBCC(ADMIN_MAIL);
			$mail->Subject = $subject;
			$mail->Body = $body;
			$mail->Send();
			
			if($mail->Send()) {
				return true;
			} else {
				return false;
			}
		} else {
			$header = "From: \"".$this->webmaster_name."\" <".$this->webmaster_mail.">\n";
			if ($send_admin) $header .= "Bcc: ".ADMIN_MAIL."\n";
			$header .= "MIME-Version: 1.0\n";
			$header .= "Content-Type: text/plain; charset=\"iso-8859-1\"\n";
			$header .= "Content-Transfer-Encoding: 7bit\n";
			if (mail($mail_address, $subject, $body, $header)) {
				return true;
			} else {
				return false;
			} 
		}
	}
	
	// message no. 35 is changed because the verification string based in the user name now
	function messages($num) {
		$host = "http://".$_SERVER['HTTP_HOST'];
		switch ($this->language) {
			case "de":           
			$msg[10] = "Login und/oder Passwort finden keinen Treffer in der Datenbank.";
			$msg[11] = "Login und/oder Passwort sind leer!";
			$msg[12] = "Leider existiert bereits ein Benutzer mit diesem Login und/oder E-mailadresse.";
			$msg[13] = "Weitere Anweisungen wurden per E-mail versandt, folgen Sie nun den Instruktionen.";
			$msg[14] = "Es is ein Fehler entstanden probieren Sie es erneut.";
			$msg[15] = "Es is ein Fehler entstanden probieren Sie es später nochmal.";
			$msg[16] = "Die eingegebene E-mailadresse ist nicht gültig.";
			$msg[17] = "Das Feld login (min. ".LOGIN_LENGTH." Zeichen) muss eingegeben sein.";
			$msg[18] = "Ihr Benutzerkonto ist aktiv. Sie können sich nun anmelden.";
			$msg[19] = "Ihr Aktivierungs ist nicht gültig.";
			$msg[20] = "Da ist kein Konto zu aktivieren.";
			$msg[21] = "Der benutzte Aktivierung-Code is nicht gültig!";
			$msg[22] = "Keine Konto gefunden dass mit der eingegeben E-mailadresse übereinkommt.";
			$msg[23] = "Kontrollieren Sie Ihre E-Mail um Ihr neues Passwort zu erhalten.";
			$msg[24] = "Ihr Benutzerkonto wurde aktiviert.";
			$msg[25] = "Kann Ihr Passwort nicht aktivieren.";
			$msg[26] = "Sie haben Ihr Passwort vergessen...";
			$msg[27] = "Kontrollieren Sie Ihre E-Mailbox und bestätigen Sie Ihre Änderung(en).";
			$msg[28] = "Ihre Anfrage bestätigen...";
			$msg[29] = "Hallo,\r\n\r\num Ihre Anfrage zu aktivieren klicken Sie bitte auf den folgenden Link:\r\n".$host.$this->login_page."?ident=".$this->id."&activate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nmit freundlichen Grüssen\r\n".$this->admin_name;
			$msg[30] = "Ihre Änderung ist durchgeführt.";
			$msg[31] = "Diese E-mailadresse wird bereits genutzt, bitte wählen Sie eine andere.";
			$msg[32] = "Das Feld Passwort (min. ".PW_LENGTH." Zeichen) muss eingegeben sein.";
			$msg[33] = "Hallo,\r\n\r\nIhre neue E-mailadresse muss noch überprüft werden, bitte klicken Sie auf den folgenden Link:\r\n".$host.$this->login_page."?id=".$this->id."&validate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nmit freundlichen Grüssen\r\n".$this->admin_name;
			$msg[34] = "Da ist keine E-mailadresse zu überprüfen.";
			$msg[35] = "Hallo,\r\n\r\nIhr neues Passwort kann nun eingegeben werden, bitte klicken Sie auf den folgenden Link:\r\n".$host.$this->password_page."?activate=".md5($this->user.SECRET_STRING)."&language=".$this->language."\r\n\r\nmit freundlichen Grüssen\r\n".$this->admin_name;
			$msg[36] = "Ihr Antrag ist verarbeitet und wird nun durch den Administrator kontrolliert. \r\nSie erhalten eine Nachricht wenn dies geschehen ist.";
			$msg[37] = "Hallo ".$this->user_full_name.",\r\n\r\nIhr Konto ist nun eigerichtet und Sie können sich nun anmelden.\r\n\r\nKlicken Sie hierfür auf den folgenden Link:\r\n".$host.$this->login_page."\r\n\r\nmit freundlichen Grüssen\r\n".$this->admin_name;
			$msg[38] = "Das best&auml;tigte Passwort hat keine &Uuml;bereinstimmung mit dem ersten Passwort, bitte probieren Sie es erneut.";
			$msg[39] = "Neuer Benutzer...";
			$msg[40] = "Es hat sich am ".date("Y-m-d")." ein neuer Benutzer angemeldet.\r\n\r\nKlicken Sie hier um zur Verwaltungsseite zu gelangen:\r\n\r\n".$host.$this->admin_page."?login_id=".$this->id;
			$msg[41] = "Bestätigen Sie Ihre E-mailadresse...";
			$msg[42] = "Ihre E-mailadresse wurde geändert.";
			break;
			break;
			case "nl":
			$msg[10] = "Gebruikersnaam en/of wachtwoord vinden geen overeenkomst in de database.";
			$msg[11] = "Gebruikersnaam en/of wachtwoord zijn leeg!";
			$msg[12] = "Helaas bestaat er al een gebruiker met deze gebruikersnaam en/of e-mail adres.";
			$msg[13] = "Er is een e-mail is aan u verzonden, volg de instructies die daarin vermeld staan.";
			$msg[14] = "Het is een fout ontstaan, probeer het opnieuw.";
			$msg[15] = "Het is een fout ontstaan, probeer het later nog een keer.";
			$msg[16] = "De opgegeven e-mail adres is niet geldig.";
			$msg[17] = "De gebruikersnaam (min. ".LOGIN_LENGTH." teken) moet opgegeven zijn.";
			$msg[18] = "Het gebruikersaccount is aangemaakt, u kunt u nu aanmelden.";
			$msg[19] = "Kan uw account niet activeren.";
			$msg[20] = "Er is geen account te activeren.";
			$msg[21] = "De gebruikte activeringscode is niet geldig!";
			$msg[22] = "Geen account gevonden dat met de opgegeven e-mail adres overeenkomt.";
			$msg[23] = "Er is een e-mail is aan u verzonden, daarin staat hoe uw een nieuw wachtwoord kunt aanmaken.";
			$msg[24] = "Uw gebruikersaccount is geactiveerd... ";
			$msg[25] = "Kan het wachtwoord niet activeren.";
			$msg[26] = "U bent uw wachtwoord vergeten...";
			$msg[27] = "Er is een e-mail is aan u verzonden, volg de instructies die daarin vermeld staan.";
			$msg[28] = "Bevestig uw aanvraag ...";
			$msg[29] = "Hallo,\r\n\r\nBedankt voor uw aanvraag,\r\n\r\nklik op de volgende link om de aanvraag te verwerken:\r\n".$host.$this->login_page."?ident=".$this->id."&activate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nmet vriendelijke groet\r\n".$this->admin_name;
			$msg[30] = "Uw wijzigingen zijn doorgevoerd.";
			$msg[31] = "Dit e-mailadres bestaat al, gebruik en andere.";
			$msg[32] = "Het veld wachtwoord (min. ".PW_LENGTH." teken) mag niet leeg zijn.";
			$msg[33] = "Beste gebruiker,\r\n\r\nde nieuwe e-mailadres moet nog gevalideerd worden, klik hiervoor op de volgende link:\r\n".$host.$this->login_page."?id=".$this->id."&validate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nmet vriendelijke groet\r\n".$this->admin_name;
			$msg[34] = "Er is geen e-mailadres te valideren.";
			$msg[35] = "Hallo,\r\n\r\nuw nieuw wachtwoord kan nu ingevoerd worden, klik op deze link om verder te gaan:\r\n".$host.$this->password_page."?activate=".md5($this->user.SECRET_STRING)."&language=".$this->language."\r\n\r\nmet vriendelijke groet\r\n".$this->admin_name;
			$msg[36] = "U aanvraag is verwerkt en wordt door de beheerder binnenkort activeert. \r\nU krijgt bericht wanneer dit gebeurt is.";
			$msg[37] = "Hallo ".$this->user_full_name.",\r\n\r\nHet account is nu gereed en u kunt zich aanmelden.\r\n\r\nKlik hiervoor op de volgende link:\r\n".$host.$this->login_page."\r\n\r\nmet vriendelijke groet\r\n".$this->admin_name;
			$msg[38] = "Het bevestigings wachtwoord komt niet overeen met het wachtwoord, probeer het opnieuw.";
			$msg[39] = "Nieuwe gebuiker...";
			$msg[40] = "Er heeft zich een nieuwe gebruiker aangemeld op ".date("Y-m-d").":\r\n\r\nKlik hier voor toegang tot de beheer pagina:\r\n\r\n".$host.$this->admin_page."?login_id=".$this->id; 
			$msg[41] = "Bevestiging e-mail adres...";
			$msg[42] = "Uw e-mailadres is gewijzigd.";
			break;
			case "fr":
			$msg[10] = "Le login et/ou mot de passe ne correspondent pas.";
			$msg[11] = "Le login et/ou mot de passe est vide !";
			$msg[12] = "Désolé, un utilisateur avec le même email et/ou login existe déjà.";
			$msg[13] = "Vérifiez votre email et suivez les instructions.";
			$msg[14] = "Désolé, une erreur s'est produite. Veuillez réessayer.";
			$msg[15] = "Désolé, une erreur s'est produite. Veuillez réessayer plus tard.";
			$msg[16] = "L'adresse email n'est pas valide.";
			$msg[17] = "Le champ \"Nom d'usager\" doit être composé d'au moins ".LOGIN_LENGTH." caratères.";
			$msg[18] = "Votre requete est complète. Enregistrez vous pour continuer.";
			$msg[19] = "Désolé, nous ne pouvons pas activer votre account.";
			$msg[20] = "Désolé, il n'y à pas d'account à activer.";
			$msg[21] = "Désolé, votre clef d'authorisation n'est pas valide";
			$msg[22] = "Désolé, il n'y à pas d'account actif avec cette adresse email.";
			$msg[23] = "Veuillez consulter votre email pour recevoir votre nouveau mot de passe.";
			$msg[24] = "Votre compte est prêt à l'usage";
			$msg[25] = "Désolé, nous ne pouvons pas activer votre mot de passe.";
			$msg[26] = "Vous avez oublié votre mot de passe...";
			$msg[27] = "Veuillez consulter votre email pour activer les modifications.";
			$msg[28] = "Votre requete doit etre exécuter...";
			$msg[29] = "Bonjour,\r\n\r\npour activer votre account clickez sur le lien suivant:\r\n".$host.$this->login_page."?ident=".$this->id."&activate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nCordialement\r\n".$this->admin_name;
			$msg[30] = "Votre account à été modifié.";
			$msg[31] = "Désolé, cette adresse email existe déjà, veuillez en utiliser une autre.";
			$msg[32] = "Le champ password (min. ".PW_LENGTH." char) est requis.";
			$msg[33] = "Bonjour,\r\n\r\nvotre nouvelle adresse email doit être validée, clickez sur le liens suivant:\r\n".$host.$this->login_page."?id=".$this->id."&validate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nCordialement\r\n".$this->admin_name;
			$msg[34] = "Il n'y à pas d'email à valider.";
			$msg[35] = "Bonjour,\r\n\r\nPour entrer votre nouveaux mot de passe, clickez sur le lien suivant:\r\n".$host.$this->password_page."?activate=".md5($this->user.SECRET_STRING)."&language=".$this->language."\r\n\r\nCordialement\r\n".$this->admin_name;
			$msg[36] = "Votre demande a été bien traitée et d'ici peu l'administrateur va l 'activer. Nous vous informerons quand ceci est arrivé.";
			$msg[37] = "Bonjour ".$this->user_full_name.",\r\n\r\nVotre compte est maintenant actif et il est possible d'y avoir accès.\r\n\r\nCliquez sur le lien suivant afin de rejoindre la page d'accès:\r\n".$host.$this->login_page."\r\n\r\nCordialement\r\n".$this->admin_name;
			$msg[38] = "Le mot de passe de confirmation de concorde pas avec votre mot de passe. Veuillez réessayer";
			$msg[39] = "Nouvel utilisateur...";
			$msg[40] = "Nouvel utilisateur s'est enregistré ".date("Y-m-d").":\r\n\r\nCliquez ici pour accéder au page d'administration:\r\n\r\n".$host.$this->admin_page."?login_id=".$this->id;
			$msg[41] = "Confirmez l'adresse email...";
			$msg[26] = "Votre adresse email est modifiée.";
			break;
			// case "es":
			default:
			$msg[10] = "El Nombre de usuario y/o Contrase&ntilde;a son incorrectas.";
			$msg[11] = "El Nombre de usuario y/o Contrase&ntilde;a esta vacia!";
			$msg[12] = "Lo siento, un usuario con este Nombre de usuario y/o correo electronico ya existe.";
			$msg[13] = "Por favor verifica tu cuenta de correo electronico y sigue las instrucciones.";
			$msg[14] = "Lo siento, un error a ocurrido por favor intenta de nuevo.";
			$msg[15] = "Lo siento, un error a ocurrido por favor intenta de nuevo mas tarde.";
			$msg[16] = "La cuenta de correo electronico no es valida.";
			$msg[17] = "El campo Nombre de usuario (minimo. ".LOGIN_LENGTH." caracteres) es necesario.";
			$msg[18] = "Tu peticion fue procesada. Ingresa a tu cuenta para poder continuar.";
			$msg[19] = "Lo siento, no se pudo activar tu cuenta.";
			$msg[20] = "No hay cuenta para activar.";
			$msg[21] = "Lo siento, esta clave de activacion no es valida!";
			$msg[22] = "Lo siento, no hay una cuenta activada que concuerda con esta cuenta de correo electronico.";
			$msg[23] = "Por favor verificar tu cuenta de correo electronico para recibir la nueva contrase&ntilde;a.";
			$msg[24] = "Tu cuenta de usuario esta activada...";
			$msg[25] = "Lo siento, no se pudo activar tu contrase&ntilde;a.";
			$msg[26] = "Olvidaste tu contraseña..."; 
			$msg[27] = "Por favor verifica tu cuenta de correo electronico y activa tus modificaciones.";
			$msg[28] = "Tu peticion necesita ser procesada...";
			$msg[29] = "Hola,\r\n\r\npara activar tu peticion click en el siguiente enlace:\r\n".$host.$this->login_page."?ident=".$this->id."&activate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nSaludos cordiales\r\n".$this->admin_name;
			$msg[30] = "Tu cuenta fue modificada.";
			$msg[31] = "Esta cuenta de correo electronico ya existe, por favor utiliza otra cuenta.";
			$msg[32] = "El campo Contrase&ntilde;a (minimo. ".PW_LENGTH." caracteres) es necesario.";
			$msg[33] = "Hola,\r\n\r\nla nueva cuenta e-mail necesita ser validada, click en el siguiente enlace:\r\n".$host.$this->login_page."?id=".$this->id."&validate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nSaludos cordiales\r\n".$this->admin_name;
			$msg[34] = "No hay cuenta de correo electronico para validar.";
			$msg[35] = "Hola,\r\n\r\nIngresa tu nueva contraseña a continuacion, por favor click en el siguiente enlace para ingresar en el formulario:\r\n".$host.$this->password_page."?activate=".md5($this->user.SECRET_STRING)."&language=".$this->language."\r\n\r\nSaludos cordiales\r\n".$this->admin_name;
			$msg[36] = "Tu peticion fue procesada y pendiente de validacion del administrador. \r\nTu recibiras un correo electronico si todo esta bien hecho.";
			$msg[37] = "Hola ".$this->user_full_name.",\r\n\r\nLa cuenta esta activada y ahora es posible ingresar con tu Nombre de usuario y contrase&ntilde;a.\r\n\r\nClick en el siguiente enlace para ir a ingresar:\r\n".$host.$this->login_page."\r\n\r\nSaludos cordiales\r\n".$this->admin_name;
			$msg[38] = "La contrase&ntilde;a de verificacion no coincide con la contrase&ntilde;a. Por favor intenta de nuevo.";
			$msg[39] = "Un nuevo usuario...";
			$msg[40] = "Un nuevo usuario fue registrado el ".date("Y-m-d").":\r\n\r\nClick aqui para ingresar a la pagina de administrador:\r\n\r\n".$host.$this->admin_page."?login_id=".$this->id;
			$msg[41] = "Valida tu cuenta de correo electronico"; // subject in e-mail	
			$msg[42] = "Tu direccion Email esta modificada";			
			// break;
			
			
			// default:
			// $msg[10] = "Login and/or password did not match to the database.";
			// $msg[11] = "Login and/or password is empty!";
			// $msg[12] = "Sorry, a user with this login and/or e-mail address already exist.";
			// $msg[13] = "Please check your e-mail and follow the instructions.";
			// $msg[14] = "Sorry, an error occurred please try it again.";
			// $msg[15] = "Sorry, an error occurred please try it again later.";
			// $msg[16] = "The e-mail address is not valid.";
			// $msg[17] = "The field login (min. ".LOGIN_LENGTH." char.) is required.";
			// $msg[18] = "Your request is processed. Login to continue.";
			// $msg[19] = "Sorry, cannot activate your account.";
			// $msg[20] = "There is no account to activate.";
			// $msg[21] = "Sorry, this activation key is not valid!";
			// $msg[22] = "Sorry, there is no active account which match with this e-mail address.";
			// $msg[23] = "Please check your e-mail to get your new password.";
			// $msg[24] = "Your user account is activated... ";
			// $msg[25] = "Sorry, cannot activate your password.";
			// $msg[26] = "Your forgotten password..."; 
			// $msg[27] = "Please check your e-mail and activate your modification(s).";
			// $msg[28] = "Your request must be processed...";
			// $msg[29] = "Hello,\r\n\r\nto activate your request click the following link:\r\n".$host.$this->login_page."?ident=".$this->id."&activate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nkind regards\r\n".$this->admin_name;
			// $msg[30] = "Your account is modified.";
			// $msg[31] = "This e-mail address already exist, please use another one.";
			// $msg[32] = "The field password (min. ".PW_LENGTH." char) is required.";
			// $msg[33] = "Hello,\r\n\r\nthe new e-mail address must be validated, click the following link:\r\n".$host.$this->login_page."?id=".$this->id."&validate=".md5($this->user_pw)."&language=".$this->language."\r\n\r\nkind regards\r\n".$this->admin_name;
			// $msg[34] = "There is no e-mail address for validation.";
			// $msg[35] = "Hello,\r\n\r\nEnter your new password next, please click the following link to enter the form:\r\n".$host.$this->password_page."?activate=".md5($this->user.SECRET_STRING)."&language=".$this->language."\r\n\r\nkind regards\r\n".$this->admin_name;
			// $msg[36] = "Your request is processed and is pending for validation by the admin. \r\nYou will get an e-mail if it's done.";
			// $msg[37] = "Hello ".$this->user_full_name.",\r\n\r\nThe account is active and it's possible to login now.\r\n\r\nClick on this link to access the login page:\r\n".$host.$this->login_page."\r\n\r\nkind regards\r\n".$this->admin_name;
			// $msg[38] = "The confirmation password does not match the password. Please try again.";
			// $msg[39] = "A new user...";
			// $msg[40] = "There was a new user registration on ".date("Y-m-d").":\r\n\r\nClick here to enter the admin page:\r\n\r\n".$host.$this->admin_page."?login_id=".$this->id;
			// $msg[41] = "Validate your e-mail address..."; // subject in e-mail
			// $msg[42] = "Your e-mail address is modified.";
		}
		return $msg[$num];
	}
	
	}

?>