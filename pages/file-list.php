<?php
require_once '../config/smarty.php';
require_once '../config/db.php';

$methodId = isset($_GET["method"]) && is_numeric($_GET["method"]) && $_GET["method"] >= 0 ? $_GET["method"] : null;
$variableId = isset($_GET["variables"]) ?  implode( ",", $_GET["variables"] ) : null;
$scenarioId = isset($_GET["scenarios"]) ? implode( ",", $_GET["scenarios"] ) : null;
$resolutionId = isset($_GET["resolution"]) && is_numeric($_GET["resolution"]) && $_GET["resolution"] >= 0 ? $_GET["resolution"] : null;
$modelId = isset($_GET["model"]) ?  implode( ",", $_GET["model"] ) : null;
$formatId = isset($_GET["format"]) && is_numeric($_GET["format"]) && $_GET["format"] >= 0 ? $_GET["format"] : null;
$periodId = isset($_GET["period"]) ?  implode( ",", $_GET["period"] ) : null;
$fileSetId = isset($_GET["fileSet"]) && is_numeric($_GET["fileSet"]) && $_GET["fileSet"] >= 0 ? $_GET["fileSet"] : null;
$extentId = isset($_GET["extent"]) && is_numeric($_GET["extent"]) && $_GET["extent"] >= 0 ? $_GET["extent"] : null;
$tile = isset($_GET["tile_name"]) && $_GET["tile_name"] != "" ? $_GET["tile_name"] : null;
$tile = getTileID($tile);

function getTileID($tileName){
    global $db;
	if(!is_null($tileName)){
    $query = "SELECT id FROM datasets_tile WHERE name = '" . $tileName . "';";
    $result = $db->GetRow($query);
    $tileID = $result["id"];
	}else{
		$tileID = null;
	}
	return $tileID;
}
$query = "SELECT df.id, df.local_url, df.name, da.id as availability_id, da.name as availability, fset.name as fileset
    FROM datasets_file df, datasets_dataavailability da, datasets_fileset fset
    WHERE df.availability_status_id = da.id
    AND df.file_set_id = fset.id";
if(!is_null($methodId)) $query .= " AND df.method_id = ".$methodId;
if(!is_null($variableId)) $query .= " AND df.variable_id IN ( ".$variableId . ")";
if(!is_null($scenarioId)) $query .= " AND df.scenario_id IN ( ".$scenarioId . ")";
if(!is_null($resolutionId)) $query .= " AND df.resolution_id = ".$resolutionId;
if(!is_null($modelId)) $query .= " AND df.model_id IN ( ".$modelId . ")";
if(!is_null($formatId)) $query .= " AND df.format_id = ".$formatId;
if(!is_null($periodId)) $query .= " AND df.period_id IN ( ".$periodId . ")";
if(!is_null($fileSetId)) $query .= " AND df.file_set_id = ".$fileSetId;
if(!is_null($extentId)) $query .= " AND df.extent_id = ".$extentId;
if(!is_null($tile)) $query .= " AND df.tile_id = ".$tile;

// $files = $db->getAll($query);
$files = $db->Execute($query);
$count = $files->RecordCount();
// foreach ($files as $row) {
    // print_r($row);
// }
// var_dump($files[0]);
$smarty->assign("files", $files);
$smarty->assign("count", $count);

$smarty->display("file-list.tpl");
?>
