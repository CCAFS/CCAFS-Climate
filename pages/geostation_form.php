<?php

require_once '../config/smarty.php';
require_once '../config/db.php';

$query = "SELECT id, name FROM station_category ORDER BY name";
$categories = $db->getAll($query);

$query = "SELECT id, name FROM station_institute ORDER BY name";
$institutes = $db->getAll($query);

$query = "SELECT id, name FROM station_type ORDER BY name";
$types = $db->getAll($query);

$smarty->assign("categories", $categories);
$smarty->assign("institutes", $institutes);
$smarty->assign("types", $types);
$smarty->display("geostation_form.tpl");
?>