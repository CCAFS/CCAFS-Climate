<?php
require_once '../config/smarty.php';
require_once '../config/db.php';
//$query = "SELECT * FROM station WHERE station_status_id = 1";
//$stations = $db->getAll($query);
//$smarty->assign("stations", $stations);

$smarty->display("tree.tpl");

?>