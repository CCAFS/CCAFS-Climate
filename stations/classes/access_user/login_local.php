<?php 
include($_SERVER['DOCUMENT_ROOT']."/classes/access_user/ext_user_profile.php"); 

$my_local_access = new Users_profile;

if (isset($_POST['Submit'])) {
	$my_local_access->save_login = (isset($_POST['remember'])) ? $_POST['remember'] : "no"; // use a cookie to remember the login
	$my_local_access->count_visit = true; // if this is true then the last visitdate is saved in the database
	$my_local_access->login_local($_POST['login'], $_POST['password']); // call the login method
} 
$error = $my_local_access->the_msg; 
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
<h2>Login (with user's language settings):</h2>
<p>Please enter your login and password.</p>
<form name="form1" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
  <label for="login">Login:</label>
  <input type="text" name="login" value="<?php echo (isset($_POST['login'])) ? $_POST['login'] : $my_local_access->user; ?>"><br>
  <label for="password">Password:</label>
  <input type="password" name="password" value="<?php if (isset($_POST['password'])) echo $_POST['password']; ?>"><br>
  <label for="remember">Automatic login?</label>
  <input type="checkbox" name="remember" value="yes"<?php echo ($my_local_access->is_cookie == true) ? " checked" : ""; ?>>
  <br>
  <input type="submit" name="Submit" value="Login">
</form>
<p><b><?php echo (isset($error)) ? $error : "&nbsp;"; ?></b></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<!-- Notice! you have to change this links here, if the files are not in the same folder -->
</body>
</html>
