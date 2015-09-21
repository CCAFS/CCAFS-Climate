
<?php
include_once('../config/db_ccafs_climate.php');
include($_SERVER['DOCUMENT_ROOT']."/stations/classes/access_user/access_user_class.php"); 

$cond = $_REQUEST['cond'];

if($cond=="login"){
	$my_access = new Access_user(false);

	$my_access->login_reader(); // version 1.86 no guarda los cookies de los campos

	$my_access->login_user($_REQUEST['login'], $_REQUEST['password']); // call the login method

	if($my_access){
		// echo "{success: false}";
		echo "error";
		// echo "hola ".$_SESSION['user'];	
	} else {
		echo "{success: false, errors: { reason: 'Login failed. Try again.' }}";
	}
}else{
	$page_protect = new Access_user;
	$page_protect->log_out();
}



// http://172.22.52.48/stations/php/Login.php?_dc=1440437646884&login=admin&password=1234

// define ("USER", "admin");
// define ("PASSWORD", "1234");

// $loginUsername = isset($_REQUEST["login"]) ? $_REQUEST["login"] : "";
// $loginPassword = isset($_REQUEST["password"]) ? $_REQUEST["password"] : "";
 
// if($loginUsername == USER and $loginPassword == PASSWORD){
    // echo "{success: true}";
// } else {
    // echo "{success: false, errors: { reason: 'Login failed. Try again.' }}";
// }


?>