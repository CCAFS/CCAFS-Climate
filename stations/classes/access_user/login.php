<?php 


// $my_access->save_login // use a cookie to remember the client login, possible values are "yes" or "no"
// $my_access->count_visit = true // if this is true then the last visit date is saved in the database (field extra_info)
// $my_access->login_user($user, $password) // call the login method
// $my_access->activate_account($activate_key, $key_id) // the account activation method
// $my_access->validate_email($validation_key, $key_id) // (updated) e-mail address validation

include($_SERVER['DOCUMENT_ROOT']."/stations/classes/access_user/access_user_class.php"); 

$my_access = new Access_user(false);
//$my_access = new Access_user; // ver. 1.86

$my_access->login_reader(); // version 1.86 no guarda los cookies de los campos


// $my_access->language = "de"; // use this selector to get messages in other languages
if (isset($_GET['activate']) && isset($_GET['ident'])) { // this two variables are required for activating/updating the account/password
	$my_access->auto_activation = true; // use this (true/false) to stop the automatic activation
	$my_access->activate_account($_GET['activate'], $_GET['ident']); // the activation method 
	echo $_GET['activate'];
}
if (isset($_GET['validate']) && isset($_GET['id'])) { // this two variables are required for activating/updating the new e-mail address
	$my_access->validate_email($_GET['validate'], $_GET['id']); // the validation method 
}
if (isset($_POST['Submit'])) {
	$my_access->save_login = (isset($_POST['remember'])) ? $_POST['remember'] : "no"; // use a cookie to remember the login
	$my_access->count_visit = true; // if this is true then the last visitdate is saved in the database (field extra info)
	$my_access->login_user($_POST['login'], $_POST['password']); // call the login method
} 
$error = $my_access->the_msg; 

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Login page example</title>
<style type="text/css">
<!--
label {
	display: block;
	float: left;
	width: 120px;
}
-->
</style>
</head>

<body>
<h2>Login:</h2>
<p>Please enter your login and password.</p>
<form name="form1" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
  <label for="login">Login:</label>
  <input type="text" name="login" size="20" value="<?php echo (isset($_POST['login'])) ? $_POST['login'] : $my_access->user; ?>"><br>
  <label for="password">Password:</label>
  <input type="password" name="password" size="8" value="<?php if (isset($_POST['password'])) echo $_POST['password']; ?>"><br>
  <label for="remember">Automatic login?</label>
  <input type="checkbox" name="remember" value="yes"<?php echo ($my_access->is_cookie == true) ? " checked" : ""; ?>>
  <br>
  <input type="submit" name="Submit" value="Login">
</form>
<p><b><?php echo (isset($error)) ? $error : "&nbsp;"; ?></b></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<!-- Notice! you have to change this links here, if the files are not in the same folder -->
<p>Not registered yet? <a href="./register.php">Click here.</a></p>
<p><a href="./forgot_password.php">Forgot your password?</a></p>
<p><a href="login_local.php">Login with messages according user's language settings </a><br>(only for users with a profile)</p>
</body>
</html>
