<?php
include($_SERVER['DOCUMENT_ROOT']."/classes/access_user/access_user_class.php"); 
$index_protect= new Access_user;

$index_protect->access_page();
// $index_protect->log_out();





?>
<html>
<head>

</head>

<body>

<?php echo $act_password->user; ?>

hola


</body>
</html>
