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
$ids["fileset_id"] = isset($_POST["filesetId"]) && $_POST["filesetId"] != "" ? $_POST["filesetId"] : null;
$ids["observation_id"] = isset($_POST["observation"]) && $_POST["observation"] != "" ? $_POST["observation"] : null;
$ids["tile_id"] = isset($_POST["tileName"]) && $_POST["tileName"] != "" ? $_POST["tileName"] : null;
$ids["tile_id"] = getTileID($ids["tile_id"]);

if (!is_null($section)) {
  switch ($section) {
    case "methods[]":
      filesFound("datasets_correction_method_bias", $ids["method_id"]);
      break;
    case "scenarios[]":
      filesFound("datasets_scenario_bias", $ids["scenario_id"]);
      break;
    case "model[]":
      filesFound("datasets_model_bias", $ids["model_id"]);
      break;
    case "period[]":
//      filesFound("datasets_period", $ids["period_id"]);
      break;
    case "variables[]":
      filesFound("datasets_variable_bias", $ids["variable_id"]);
      break;
    case "resolution":
//      filesFound("datasets_resolution", $ids["resolution_id"]);
      break;
    case "formats[]":
      filesFound("datasets_format_bias", $ids["format_id"]);
      break;
    case "extent":
//      filesFound("datasets_extent", $ids["extent_id"]);
      break;
    case "fileSet":
      filesFound("datasets_fileset_bias", $ids["fileset_id"]);
      break;
    case "observation":
      filesFound("datasets_observation_bias", $ids["observation_id"]);
      break;
    case "tile":
      // $ids["tile_id"] = getTileID($ids["tile_id"]);
//      filesFound("datasets_tile", $ids["tile_id"]);
      break;
    default:
      break;
  }
}

function getTileID($tileName) {
  global $db;
  $query = "SELECT id FROM datasets_tile WHERE name = " . $tileName . ";";
  $result = $db->GetRow($query);

  $tileID = (isset($result["id"])) ? $result["id"] : null;
  return $tileID;
}

function filesFound($databaseName, $id) {
  global $db, $ids;
  $info = new stdClass();
  $info->description = new stdClass();

  if (!is_null($id)) {
    $optionsIds = explode(",", $id);

    foreach ($optionsIds as $oId) {
      // 'Others' option for 'variables' filter
//      if ($oId == "9999" && $databaseName == "datasets_variable_bias") {
//        $query = "SELECT id, description FROM " . $databaseName . " WHERE id > 7";
//      } else {
        $query = "SELECT id, description FROM " . $databaseName . " WHERE id = " . $oId;
//      }
      $result = $db->GetRow($query);
      $info->description->$oId = $result["description"];
      // print_r($info);
    }
  } else {
    $info->description = "";
  }

  $isFirst = true;
 
  $query = "SELECT count(id) FROM datasets_file_bias WHERE ";
  foreach ($ids as $key => $value) {
	if($key!="method_id" && $key!= "observation_id"){ 
		if (!is_null($value)) {
		  if (!$isFirst) {
			$query .= " AND ";
		  } else {
			$isFirst = false;
		  }

		  // 'Others' option for 'variables' filter
	//      if ($key == "variable_id" && $value == 9999) {
	//        $query .= $key . " > 7 ";
	//      } else {
			$query .= $key . " IN ( " . $value . " )";
	//      }
		}
	  
	}
  }

  if ($isFirst) {
    $info->filesFound = -1;
  } else {
    $info->filesFound = $db->GetOne($query);
  }
  $info->query = $query;
  $info->filtersAvailable = getFiltersAvailable();

  echo json_encode($info);
}

function getFiltersAvailable() {
  global $ids, $db;
  //SQL only for mysql
//    $sql = "SELECT GROUP_CONCAT( DISTINCT scenario_id ) as \"scenario\", GROUP_CONCAT( DISTINCT period_id ) as \"period\", ";
//    $sql .= "GROUP_CONCAT( DISTINCT model_id ) as \"model\", GROUP_CONCAT( DISTINCT variable_id ) as \"variable\", ";
//    $sql .= "GROUP_CONCAT( DISTINCT resolution_id ) as \"resolution\", GROUP_CONCAT( DISTINCT format_id ) as \"format\", ";
//    $sql .= "GROUP_CONCAT( DISTINCT extent_id ) as \"extent\" ";
//    $sql .= "FROM datasets_file WHERE TRUE";
  //SQL only for postgres
	// $sql = "SELECT array_to_string(array_agg(DISTINCT variable_id ), ',') as \"variable\"
			// FROM datasets_fileobservations_bias 
			// WHERE status = 2;";

	$sql = "SELECT array_to_string(array_agg(DISTINCT model_id ), ',') as \"model\"
			FROM datasets_file_bias 
			WHERE TRUE";			
			
  // if (isset($ids["observation_id"]) && $ids["observation_id"] != "") {
    // $sql .= " AND obsset_id = " . $ids["observation_id"];
  // }
     if( isset($ids["scenario_id"]) && $ids["scenario_id"] != "" ){
        $sql .= " AND scenario_id = " . $ids["scenario_id"];
    }  
	
  // Adjust the db to only return the assoc array
  $db->SetFetchMode(ADODB_FETCH_ASSOC);
 // echo $sql;  
  $result = $db->GetRow($sql);
// print_r($result);
  // Returning the fetch mode to default
  $db->SetFetchMode(ADODB_FETCH_BOTH);

  return $result;
}

?>
