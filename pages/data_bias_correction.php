<?php
require_once '../config/smarty.php';
require_once '../config/db.php';

// $query = "SELECT df.id, df.name, dfc.name as 'category' FROM datasets_fileset df ";
// $query .= "INNER JOIN datasets_fileset_category dfc ON df.category_id = dfc.id ";
// $query .= "ORDER BY dfc.id, df.name DESC ";
$query = "SELECT * FROM datasets_fileset_bias df  ";

$fileSets = $db->getAll($query);

$query = "SELECT id, name, acronym FROM datasets_scenario_bias where id <> 1 order by name asc";
$scenarios = $db->getAll($query);

$query = "SELECT id, name, acronym FROM datasets_model_bias ORDER BY acronym";
$models = $db->getAll($query);

$query = "SELECT id, name FROM datasets_observation_bias ORDER BY name";
$observations = $db->getAll($query);

// Only the first 7 variables will be listed. The rest will be marked as other.
$query = "SELECT id, name, acronym FROM datasets_variable_bias ORDER BY name";
$variables = $db->getAll($query);

$query = "SELECT id, name FROM datasets_correction_method_bias";
$methods = $db->getAll($query);

$query = "SELECT id, name FROM datasets_format_bias";
$formats = $db->getAll($query);

//$query = "SELECT id, name FROM datasets_extent";
//$extents = $db->getAll($query);
//
//$query = "SELECT id, name FROM datasets_tile";
//$tiles = $db->getAll($query);

$smarty->assign("fileSets", $fileSets);
$smarty->assign("scenarios", $scenarios);
$smarty->assign("models", $models);
$smarty->assign("observations", $observations);
$smarty->assign("variables", $variables);
$smarty->assign("methods", $methods);
$smarty->assign("formats", $formats);
$smarty->assign("vars", array(1,2,3,4,5));
//$smarty->assign("extents", $extents);
//$smarty->assign("tiles", $tiles);

$smarty->display("data_bias_correction.tpl");
?>