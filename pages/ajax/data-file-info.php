<?php

require_once '../../config/db.php';

$section = isset($_POST["section"]) ? $_POST["section"] : null;
$ids = array();
$ids["method_id"] = isset($_POST["methodId"]) && $_POST["methodId"] != "" ? $_POST["methodId"] : null;
$ids["scenario_id"] = isset($_POST["scenarioId"]) && $_POST["scenarioId"] != "" ? $_POST["scenarioId"] : null;
$ids["model_id"] = isset($_POST["modelId"]) && $_POST["modelId"] != "" ? $_POST["modelId"] : null;
$ids["period_id"] = isset($_POST["periodId"]) && $_POST["periodId"] != "" ? $_POST["periodId"] : null;
$ids["variable_id"] = isset($_POST["variableId"]) && $_POST["variableId"] != "" ? $_POST["variableId"] : null;
$ids["resolution_id"] = isset($_POST["resolutionId"]) && $_POST["resolutionId"] != "" ? $_POST["resolutionId"] : null;
$ids["format_id"] = isset($_POST["formatId"]) && $_POST["formatId"] != "" ? $_POST["formatId"] : null;
$ids["extent_id"] = isset($_POST["extendId"]) && $_POST["extendId"] != "" ? $_POST["extendId"] : null;
$ids["file_set_id"] = isset($_POST["filesetId"]) && $_POST["filesetId"] != "" ? $_POST["filesetId"] : null;
$ids["tile_id"] = isset($_POST["tileName"]) && $_POST["tileName"] != "" ? $_POST["tileName"] : null;

if (!is_null($section)) {
    switch ($section) {
        case "method":
            filesFound("datasets_method", $ids["method_id"]);
            break;
        case "scenarios[]":
            filesFound("datasets_scenario", $ids["scenario_id"]);
            break;
        case "model[]":
            filesFound("datasets_model", $ids["model_id"]);
            break;
        case "period[]":
            filesFound("datasets_period", $ids["period_id"]);
            break;
        case "variables[]":
            filesFound("datasets_variable", $ids["variable_id"]);
            break;
        case "resolution":
            filesFound("datasets_resolution", $ids["resolution_id"]);
            break;
        case "formats[]":
            filesFound("datasets_format", $ids["format_id"]);
            break;
        case "extent":
            filesFound("datasets_extent", $ids["extent_id"]);
            break;    
        case "fileSet":
            filesFound("datasets_fileset", $ids["file_set_id"]);
            break;
        case "tile":
            $ids["tile_id"] = getTileID($ids["tile_id"]);
            filesFound("datasets_tile", $ids["tile_id"]);
            break;
        default:
            break;
    }
}

function getTileID($tileName){
    global $db;
    $query = "SELECT id FROM datasets_tile WHERE name = " . $tileName . ";";
    $result = $db->GetRow($query);

    $tileID = $result["id"];
    return $tileID;
}

function filesFound($databaseName, $id) {
    global $db, $ids;
    $info = new stdClass();
    $info->description= new stdClass();

    if (!is_null($id)) {
        $optionsIds = explode(",", $id);

        foreach($optionsIds as $oId){
            // 'Others' option for 'variables' filter
            if($oId == "9999" && $databaseName == "datasets_variable"){
                $query = "SELECT id, description FROM " . $databaseName . " WHERE id > 7";
            }else{
                $query = "SELECT id, description FROM " . $databaseName . " WHERE id = " . $oId;
            }

            $result = $db->GetRow($query);
            $info->description->$oId= $result["description"];
        }
    } else {
        $info->description = "";
    }

    $isFirst = true;
    $query = "SELECT count(id) FROM datasets_file WHERE ";
    foreach ($ids as $key => $value) {
        if (!is_null($value)) {
            if (!$isFirst) {
                $query .= " AND ";
            } else {
                $isFirst = false;
            }

            // 'Others' option for 'variables' filter
            if($key == "variable_id" && $value == 9999) {
                $query .= $key . " > 7 ";
            }else{
                $query .= $key . " IN ( " . $value . " )";
            }
        }
    }

    if($isFirst) {
        $info->filesFound = -1;
    } else {
        $info->filesFound = $db->GetOne($query);
    }
    $info->query = $query;
    $info->filtersAvailable = getFiltersAvailable();

    echo json_encode($info);
}

function getFiltersAvailable(){
    global $ids, $db;

    $sql = "SELECT GROUP_CONCAT( DISTINCT `scenario_id` ) as 'scenario', GROUP_CONCAT( DISTINCT `period_id` ) as 'period', ";
    $sql .= "GROUP_CONCAT( DISTINCT `model_id` ) as 'model', GROUP_CONCAT( DISTINCT `variable_id` ) as 'variable', ";
    $sql .= "GROUP_CONCAT( DISTINCT `resolution_id` ) as 'resolution', GROUP_CONCAT( DISTINCT `format_id` ) as 'format', ";
    $sql .= "GROUP_CONCAT( DISTINCT `extent_id` ) as 'extent' ";
    $sql .= "FROM `datasets_file` WHERE 1";

    if( isset($ids["file_set_id"]) && $ids["file_set_id"] != "" ){
        $sql .= " AND file_set_id = " . $ids["file_set_id"];
    }

    // Adjust the db to only return the assoc array
    $db->SetFetchMode(ADODB_FETCH_ASSOC); 
    $result = $db->GetRow($sql);

    // Returning the fetch mode to default
    $db->SetFetchMode(ADODB_FETCH_BOTH); 

    return $result;
}

?>
