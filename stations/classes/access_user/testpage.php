<?php 
include($_SERVER['DOCUMENT_ROOT']."/stations/classes/access_user/access_user_class.php"); 
// call this page to test referer function
// test this page like "testpage.php?var=test" if you are using a querystring
$test_page_protect = new Access_user;
// $test_page_protect->login_page = "login.php"; // change this only if your login is on another page
$test_page_protect->access_page($_SERVER['PHP_SELF'], $_SERVER['QUERY_STRING']); // set this  method, including the server vars to protect your page and get redirected to here after login
$hello_name = ($test_page_protect->user_full_name != "") ? $test_page_protect->user_full_name : $test_page_protect->user;

if (isset($_GET['action']) && $_GET['action'] == "log_out") {
	$test_page_protect->log_out(); // the method to log off
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Test page "access_user Class"</title>
</head>

<body>
<h2><?php echo "Hello ".$hello_name." !"; ?></h2>
<p>Now you have access to this testpage.</p>
<p><?php echo (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] != "") ? "Query string: <b>".$_SERVER['QUERY_STRING']."</b>" : "&nbsp;"; ?></p>
<p>&nbsp;</p>
<p><a href="<?php echo START_PAGE; ?>">... to the start page (example.php)</a></p>
<p><a href="<?php echo $_SERVER['PHP_SELF']; ?>?action=log_out">Click here to log out.</a></p>
</body>

</html>

