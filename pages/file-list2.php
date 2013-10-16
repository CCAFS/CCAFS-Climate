<?php

require_once '../config/smarty.php';
require_once '../config/db.php';
/*
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

  $smarty->assign("files", $files); */

$fileSetId = isset($_GET["fileSet"]) && is_numeric($_GET["fileSet"]) && $_GET["fileSet"] >= 0 ? $_GET["fileSet"] : null;
$periodIds = isset($_GET["periods"]) && is_array($_GET["periods"]) && sizeof($_GET["periods"]) >= 0 ? $_GET["periods"] : null;
$variableIds = isset($_GET["variables"]) && is_array($_GET["variables"]) && sizeof($_GET["variables"]) >= 0 ? $_GET["variables"] : null;
$resolutionId = isset($_GET["resolution"]) && is_numeric($_GET["resolution"]) && $_GET["resolution"] >= 0 ? $_GET["resolution"] : null;
$formatId = isset($_GET["format"]) && is_numeric($_GET["format"]) && $_GET["format"] >= 0 ? $_GET["format"] : null;
$scenarioIds = isset($_GET["scenarios"]) && is_array($_GET["scenarios"]) && sizeof($_GET["scenarios"]) >= 0 ? $_GET["scenarios"] : null;
$modelsIds = isset($_GET["models"]) && is_array($_GET["models"]) && sizeof($_GET["models"]) >= 0 ? $_GET["models"] : null;

$query = "SELECT df.id, df.local_url, df.name, da.name as availability, fset.name as fileset
    FROM datasets_file df
    INNER JOIN datasets_dataavailability da ON da.id = df.availability_status_id
    INNER JOIN datasets_fileset fset ON fset.id = df.file_set_id
    WHERE";

// FileSet
$query .= " df.file_set_id = " . $fileSetId;

// Periods
if(!is_null($periodIds)) {
    $isFirst = true;
    foreach($periodIds as $periodId) {
        if($isFirst) {
            $query .= " AND (";
            $isFirst = false;
        } else {
            $query .= " OR ";
        }
        $query .= "df.period_id = ".$periodId;
    }
    $query .= ")";
}

// Variables
if(!is_null($variableIds)) {
    $isFirst = true;
    foreach($variableIds as $variableId) {
        if($isFirst) {
            $query .= " AND (";
            $isFirst = false;
        } else {
            $query .= " OR ";
        }
        // Option "other" was selected?
        if($variableId == "9999") {
            $query .= "df.variable_id > 7";
        } else {
            $query .= "df.variable_id = ".$variableId;
        }
    }
    
    $query .= ")";
}

// Resolution
$query .= " AND df.resolution_id = " . $resolutionId;

// Format
$query .= " AND df.format_id = ".$formatId;

// Scenarios
if(!is_null($scenarioIds)) {
    $isFirst = true;
    foreach($scenarioIds as $scenarioId) {
        if($isFirst) {
            $query .= " AND (";
            $isFirst = false;
        } else {
            $query .= " OR ";
        }
        $query .= "df.scenario_id = ".$scenarioId;
    }
    $query .= ")";
}

// Models
if(!is_null($modelsIds)) {
    $isFirst = true;
    foreach($modelsIds as $modelId) {
        if($isFirst) {
            $query .= " AND (";
            $isFirst = false;
        } else {
            $query .= " OR ";
        }
        $query .= "df.model_id = ".$modelId;
    }
    $query .= ")";
}
print_r($query);

$files = $db->getAll($query);

$smarty->assign("files", $files);


//include "data2.php";

$smarty->display("file-list.tpl");
?>
