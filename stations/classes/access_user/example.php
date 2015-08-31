<?php 
include($_SERVER['DOCUMENT_ROOT']."/stations/classes/access_user/access_user_class.php"); 

$page_protect = new Access_user;
// $page_protect->login_page = "login.php"; // change this only if your login is on another page
$page_protect->access_page(); // only set this this method to protect your page
$page_protect->get_user_info();
$hello_name = ($page_protect->user_full_name != "") ? $page_protect->user_full_name : $page_protect->user;

if (isset($_GET['action']) && $_GET['action'] == "log_out") {
	$page_protect->log_out(); // the method to log off
}

echo $page_protect->get_access_level();
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Example page "access_user Class"</title>
</head>

<body>
<h2><?php echo "Hello ".$hello_name." !"; ?></h2>
<p>You are currently logged in.</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<!-- Notice! you have to change this links here, if the files are not in the same folder -->
<p><a href="./update_user.php">Update user account</a></p>
<p><a href="./update_user_profile.php">Update user PROFILE</a> (also user) </p>
<p><a href="/classes/access_user/test_access_level.php">test access level </a>(level 5 is used) </p>
<p><a href="/classes/access_user/admin_user.php">Admin page (user / access level update) </a>(only access for admin accounts with level: <?php echo DEFAULT_ADMIN_LEVEL; ?>) </p>
<p><a href="<?php echo $_SERVER['PHP_SELF']; ?>?action=log_out">Click here to log out.</a></p>
</body>

</html>

