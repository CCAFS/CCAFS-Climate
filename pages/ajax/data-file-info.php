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
//$ids["tile_id"] = isset($_POST["tileId"]) && $_POST["tileId"] != "" ? $_POST["tileId"] : null;

if (!is_null($section)) {
    switch ($section) {
        case "method":
            filesFound("datasets_method", $ids["method_id"]);
            break;
        case "scenario":
            filesFound("datasets_scenario", $ids["scenario_id"]);
            break;
        case "model":
            filesFound("datasets_model", $ids["model_id"]);
            break;
        case "period":
            filesFound("datasets_period", $ids["period_id"]);
            break;
        case "variable":
            filesFound("datasets_variable", $ids["variable_id"]);
            break;
        case "resolution":
            filesFound("datasets_resolution", $ids["resolution_id"]);
            break;
        case "format":
            filesFound("datasets_format", $ids["format_id"]);
            break;
        //case "tile":
        //filesFound("datasets_tile", $ids["tile_id"]);
        //break;
        default:
            break;
    }
}

function filesFound($databaseName, $id) {
    global $db, $ids;
    $info = new stdClass();
    if (!is_null($id)) {
        $query = "SELECT id, description FROM " . $databaseName . " WHERE id = " . $id;
        $result = $db->GetRow($query);
        $info->description = $result["description"];
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
            $query .= $key . " = " . $value;
        }
    }
    if($isFirst) {
        $info->filesFound = -1;
    } else {
        $info->filesFound = $db->GetOne($query);
    }
    $info->query = $query;
    echo json_encode($info);
}

?>
