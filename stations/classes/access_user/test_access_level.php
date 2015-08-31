<?php 
include($_SERVER['DOCUMENT_ROOT']."/classes/access_user/access_user_class.php"); 
// this simple example will show you the access level functionality
$test_access_level = new Access_user;
$test_access_level->access_page($_SERVER['PHP_SELF'], "", 5); // change this value to test differnet access levels (default: 1 = low and 10 high)
$hello_name = ($test_access_level->user_full_name != "") ? $test_access_level->user_full_name : $test_access_level->user;

if (isset($_GET['action']) && $_GET['action'] == "log_out") {
	$test_access_level->log_out(); // the method to log off
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Test page "access levels"</title>
</head>

<body>
<h2><?php echo "Hello ".$hello_name." !"; ?></h2>
<p>According the access level from your account it's allowed to view this page!</p>
<p>&nbsp;</p>
<p><a href="<?php echo START_PAGE; ?>">... to the start page (example.php)</a></p>
<p><a href="<?php echo $_SERVER['PHP_SELF']; ?>?action=log_out">Click here to log out.</a></p>
</body>

</html>
