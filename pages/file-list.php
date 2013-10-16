<?php
require_once '../config/smarty.php';
require_once '../config/db.php';

$methodId = isset($_GET["method"]) && is_numeric($_GET["method"]) && $_GET["method"] >= 0 ? $_GET["method"] : null;
$variableId = isset($_GET["variable"]) && is_numeric($_GET["variable"]) && $_GET["variable"] >= 0 ? $_GET["variable"] : null;
$scenarioId = isset($_GET["scenario"]) && is_numeric($_GET["scenario"]) && $_GET["scenario"] >= 0 ? $_GET["scenario"] : null;
$resolutionId = isset($_GET["resolution"]) && is_numeric($_GET["resolution"]) && $_GET["resolution"] >= 0 ? $_GET["resolution"] : null;
$modelId = isset($_GET["model"]) && is_numeric($_GET["model"]) && $_GET["model"] >= 0 ? $_GET["model"] : null;
$formatId = isset($_GET["format"]) && is_numeric($_GET["format"]) && $_GET["format"] >= 0 ? $_GET["format"] : null;
$periodId = isset($_GET["period"]) && is_numeric($_GET["period"]) && $_GET["period"] >= 0 ? $_GET["period"] : null;

$query = "SELECT df.id, df.local_url, df.name, da.name as availability, fset.name as fileset
    FROM datasets_file df, datasets_dataavailability da, datasets_fileset fset
    WHERE df.availability_status_id = da.id
    AND df.file_set_id = fset.id";
if(!is_null($methodId)) $query .= " AND df.method_id = ".$methodId;
if(!is_null($variableId)) $query .= " AND df.variable_id = ".$variableId;
if(!is_null($scenarioId)) $query .= " AND df.scenario_id = ".$scenarioId;
if(!is_null($resolutionId)) $query .= " AND df.resolution_id = ".$resolutionId;
if(!is_null($modelId)) $query .= " AND df.model_id = ".$modelId;
if(!is_null($formatId)) $query .= " AND df.format_id = ".$formatId;
if(!is_null($periodId)) $query .= " AND df.period_id = ".$periodId;


$files = $db->getAll($query);

$smarty->assign("files", $files);

$smarty->display("file-list.tpl");
?>
