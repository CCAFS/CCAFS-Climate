<?php 
include($_SERVER['DOCUMENT_ROOT']."/classes/access_user/access_user_class.php"); 

$update_member = new Access_user;
// $new_member->language = "de"; // use this selector to get messages in other languages

$update_member->access_page(); // protect this page too.
$update_member->get_user_info(); // call this method to get all other information

if (isset($_POST['Submit'])) {
	$update_member->update_user($_POST['password'], $_POST['confirm'], $_POST['name'], $_POST['info'], $_POST['email']); // the update method
} 
$error = $update_member->the_msg; // error message

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Update page example</title>
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
<h2>Update user information:</h2>
<p>Use this form to modify the account information (fields with a * are required).</p>
<form name="form1" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
  <label for="login">Login:</label>
  <b><?php echo $update_member->user; ?></b><br>
  <label for="password">Password:</label>
  <input name="password" type="password" value="<?php echo (isset($_POST['password'])) ? $_POST['password'] : ""; ?>" size="6">
  * (min. 4 chars.) <br>
  <label for="confirm">Confirm password:</label>
  <input name="confirm" type="password" value="<?php echo (isset($_POST['confirm'])) ? $_POST['confirm'] : ""; ?>" size="6">
  * <br>
  <label for="name">Real name:</label>
  <input name="name" type="text" value="<?php echo (isset($_POST['name'])) ? $_POST['name'] : $update_member->user_full_name; ?>" size="30">
  <br>
  <label for="email">E-mail:</label>
  <input name="email" type="text" value="<?php echo (isset($_POST['email'])) ? $_POST['email'] : $update_member->user_email; ?>" size="30">
  *<br>
  <label for="info">Extra info:</label>
  <input name="info" type="text" value="<?php echo (isset($_POST['info'])) ? $_POST['info'] : $update_member->user_info; ?>" size="50">
  <b><br>
  Important:</b> If you use the feature &quot;Visitor count&quot;, the table field <i>extra_info</i> can't be used for other information!<br>
  <br>
  <input type="submit" name="Submit" value="Update">
</form>
<p><b><?php echo (isset($error)) ? $error : "&nbsp;"; ?></b></p>
<p>&nbsp;</p>
<!-- Notice! you have to change this links here, if the files are not in the same folder -->
<p><a href="<?php echo $update_member->main_page; ?>">Main</a></p>
</body>
</html>
