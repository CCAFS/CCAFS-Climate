<?php 
include($_SERVER['DOCUMENT_ROOT']."/classes/access_user/ext_user_profile.php"); 

$profile = new Users_profile(true); 
// note the boolean, this will check that a profile record exists, if not redirect to the update profile page


if (isset($_GET['action']) && $_GET['action'] == "log_out") {
	$page_protect->log_out(); // the method to log off
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Example page Show profile</title>
</head>

<body>
<h2>User profile example</h2>
<p>I you see this page a valid profile record exists.</p>
<p>&nbsp;</p>
<!-- Notice! you have to change this links here, if the files are not in the same folder -->
<p><a href="./update_user_profile.php">Update user PROFILE</a> (also user) </p>
<p><a href="<?php echo $_SERVER['PHP_SELF']; ?>?action=log_out">Click here to log out.</a></p>
</body>

</html>

