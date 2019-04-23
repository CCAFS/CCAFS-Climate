<?php
require_once '../config/smarty.php';
//require_once '../config/db.php';

// $query = "SELECT df.id, df.name, dfc.name as 'category' FROM datasets_fileset df ";
// $query .= "INNER JOIN datasets_fileset_category dfc ON df.category_id = dfc.id ";
// $query .= "ORDER BY dfc.id, df.name DESC ";
/*$query = "SELECT df.id, df.name, dfc.name as \"category\" FROM datasets_fileset df INNER JOIN datasets_fileset_category dfc ON df.category_id = dfc.id ORDER BY (CASE df.id ";
$query .= "WHEN '12' 	 THEN 1 ";
$query .= "WHEN '4' 	 THEN 2 ";
$query .= "WHEN '9' 	 THEN 3 ";
$query .= "WHEN '10' 	 THEN 4 ";
$query .= "WHEN '7' 	 THEN 5 ";
$query .= "WHEN '8' 	 THEN 6 ";
$query .= "WHEN '11' 	 THEN 7 ";
$query .= "WHEN '3' 	 THEN 8 ";
$query .= "WHEN '2' 	 THEN 9 ";
$query .= "WHEN '5' 	 THEN 10 ";
$query .= "ELSE 100 END) ASC ";
$fileSets = $db->getAll($query);

//$query = "SELECT id, name FROM datasets_method";
//$methods = $db->getAll($query);

$query = "SELECT id, name FROM datasets_scenario";
$scenarios = $db->getAll($query);

$query = "SELECT id, name, acronym FROM datasets_model ORDER BY acronym";
$models = $db->getAll($query);

$query = "SELECT id, name FROM datasets_period ORDER BY name";
$periods = $db->getAll($query);

// Only the first 7 variables will be listed. The rest will be marked as other.
$query = "SELECT id, name FROM datasets_variable WHERE id <= 7 ORDER BY name";
$variables = $db->getAll($query);

$query = "SELECT id, name FROM datasets_resolution";
$resolutions = $db->getAll($query);

$query = "SELECT id, name FROM datasets_format";
$formats = $db->getAll($query);

$query = "SELECT id, name FROM datasets_extent";
$extents = $db->getAll($query);

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
$smarty->assign("extents", $extents);
$smarty->assign("tiles", $tiles);
*/
$smarty->display("climatewizard.tpl");
?>