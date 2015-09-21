<?php 


// $my_access->save_login // use a cookie to remember the client login, possible values are "yes" or "no"
// $my_access->count_visit = true // if this is true then the last visit date is saved in the database (field extra_info)
// $my_access->login_user($user, $password) // call the login method
// $my_access->activate_account($activate_key, $key_id) // the account activation method
// $my_access->validate_email($validation_key, $key_id) // (updated) e-mail address validation

include($_SERVER['DOCUMENT_ROOT']."/classes/access_user/access_user_class.php"); 

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
<title>Register page example</title>
<style type="text/css">
<!--
label {
	display: block;
	float: left;
	width: 130px;
}
-->
</style>
</head>

<body>
<h2>Please register:</h2>
<p>Please fill in the following fields (fields with a * are required).</p>
<form name="form1" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
  <label for="login">Login:</label>
  <input type="text" name="login" size="12" value="<?php echo (isset($_POST['login'])) ? $_POST['login'] : ""; ?>">
  * (min. 6 chars.) <br>
  <label for="password">Password:</label>
  <input type="password" name="password" size="6" value="<?php echo (isset($_POST['password'])) ? $_POST['password'] : ""; ?>">
  * (min. 4 chars.) <br>
  <label for="confirm">Confirm password:</label>
  <input type="password" name="confirm" size="6" value="<?php echo (isset($_POST['confirm'])) ? $_POST['confirm'] : ""; ?>">
  * <br>
  <label for="name">Real name:</label>
  <input type="text" name="name" size="30" value="<?php echo (isset($_POST['name'])) ? $_POST['name'] : ""; ?>">
  <br>
  <label for="email">E-mail:</label>
  <input type="text" name="email" size="30" value="<?php echo (isset($_POST['email'])) ? $_POST['email'] : ""; ?>">
  *<br>
  <label for="info">Extra info:</label>
  <input type="text" name="info" size="50" value="<?php echo (isset($_POST['info'])) ? $_POST['info'] : ""; ?>">
  <br>
  <input type="submit" name="Submit" value="Submit">
</form>
<p><b><?php echo (isset($error)) ? $error : "&nbsp;"; ?></b></p>
<p>&nbsp;</p>
<!-- Notice! you have to change this links here, if the files are not in the same folder -->
<p><a href="<?php echo $new_member->login_page; ?>">Login</a></p>
</body>
</html>
