<?php 
include($_SERVER['DOCUMENT_ROOT']."/classes/access_user/access_user_class.php"); 

$act_password = new Access_user;

if (!empty($_GET['activate'])) { // this two variables are required for activating/updating the account/password
	if ($act_password->check_activation_password($_GET['activate'])) { // the activation/validation method 
		$_SESSION['activation'] = $_GET['activate']; // put the activation string into a session or into a hdden field
	} 
}
if (isset($_POST['Submit'])) {
	if ($act_password->activate_new_password($_POST['password'], $_POST['confirm'], $_SESSION['activation'], $_POST['user'])) { // this will change the password
		unset($_SESSION['activation']);
	}
	$act_password->user = $_POST['user']; // to hold the user name in this screen (new in version > 1.77)
} 
$error = $act_password->the_msg;
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Example new Passwort activation</title>
</head>

<body>
<?php if (isset($_SESSION['activation'])) { ?>
<h2>Enter your new password:</h2>
<p>Enter here your new password, (login: <b><?php echo $act_password->user; ?></b>).</p>
<form name="form1" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
  <label for="password"><b>(new)</b> Password:</label>
  <input type="password" name="password" value="<?php echo (isset($_POST['password'])) ? $_POST['password'] : ""; ?>">
  <label for="confirm">Confirm password:</label>
  <input type="password" name="confirm" value="<?php echo (isset($_POST['confirm'])) ? $_POST['confirm'] : ""; ?>">
  <input type="hidden" name="user" value="<?php echo $act_password->user; ?>">
  <input type="submit" name="Submit">
</form>
<?php } else { ?>
<h2>Att. !</h2>
<?php } ?>
<p style="color:#FF0000;"><b><?php echo (isset($error)) ? $error : "&nbsp;"; ?></b></p>
<p>&nbsp;</p>
<!-- Notice! you have to change this links here, if the files are not in the same folder -->
<p><a href="<?php echo $act_password->login_page; ?>">Login</a></p>
</body>
</html>
