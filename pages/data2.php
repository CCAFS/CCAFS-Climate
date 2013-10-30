<?php
require_once '../config/smarty.php';
require_once '../config/db.php';

$query = "SELECT id, name FROM datasets_fileset ORDER BY name ASC";
$fileSets = $db->getAll($query);

//$query = "SELECT id, name FROM datasets_method";
//$methods = $db->getAll($query);

$query = "SELECT id, name FROM datasets_scenario";
$scenarios = $db->getAll($query);

$query = "SELECT id, name, acronym FROM datasets_model";
$models = $db->getAll($query);

$query = "SELECT id, name FROM datasets_period";
$periods = $db->getAll($query);

// Only the first 7 variables will be listed. The rest will be marked as other.
$query = "SELECT id, name FROM datasets_variable WHERE id <= 7";
$variables = $db->getAll($query);

$query = "SELECT id, name FROM datasets_resolution";
$resolutions = $db->getAll($query);

$query = "SELECT id, name FROM datasets_format";
$formats = $db->getAll($query);

$query = "SELECT id, name FROM datasets_tile";
$tiles = $db->getAll($query);

$smarty->assign("fileSets", $fileSets);
//$smarty->assign("methods", $methods);
$smarty->assign("scenarios", $scenarios);
$smarty->assign("models", $models);
$smarty->assign("periods", $periods);
$smarty->assign("variables", $variables);
$smarty->assign("resolutions", $resolutions);
$smarty->assign("formats", $formats);
$smarty->assign("tiles", $tiles);

$smarty->display("data2.tpl");
?>