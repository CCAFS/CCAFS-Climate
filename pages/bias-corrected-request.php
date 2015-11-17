<?php
require_once '../config/smarty.php';
require_once '../config/db.php';

$methodId = isset($_GET["method"]) && is_numeric($_GET["method"]) && $_GET["method"] >= 0 ? $_GET["method"] : null;
$lat = isset($_GET["lat"]) && is_numeric($_GET["lat"]) && $_GET["lat"] >= 0 ? $_GET["lat"] : null;
$lon = isset($_GET["lon"]) && is_numeric($_GET["lon"]) && $_GET["lon"] >= 0 ? $_GET["lon"] : null;
$variableId = isset($_GET["variables"]) ?  implode( ",", $_GET["variables"] ) : null;
$scenarioId = isset($_GET["scenarios"]) ? implode( ",", $_GET["scenarios"] ) : null;
$resolutionId = isset($_GET["resolution"]) && is_numeric($_GET["resolution"]) && $_GET["resolution"] >= 0 ? $_GET["resolution"] : null;
$modelId = isset($_GET["model"]) ?  implode( ",", $_GET["model"] ) : null;
// $formatId = isset($_GET["formats"]) && is_numeric($_GET["formats"]) && $_GET["formats"] >= 0 ? $_GET["formats"] : null;
$formatId = isset($_GET["formats"]) ?  implode( ",", $_GET["formats"] ) : null;
$periodId = isset($_GET["period"]) ?  implode( ",", $_GET["period"] ) : null;
$fileSetId = isset($_GET["fileSet"]) && is_numeric($_GET["fileSet"]) && $_GET["fileSet"] >= 0 ? $_GET["fileSet"] : null;
$observation = isset($_GET["observation"]) && is_numeric($_GET["observation"]) && $_GET["observation"] >= 0 ? $_GET["observation"] : null;
//$extentId = isset($_GET["extent"]) && is_numeric($_GET["extent"]) && $_GET["extent"] >= 0 ? $_GET["extent"] : null;
//$tile = isset($_GET["tile_name"]) && $_GET["tile_name"] != "" ? $_GET["tile_name"] : null;
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
echo "<pre>".print_r($_GET,true)."</pre>";
if (isset($_GET["email"]) && $_GET["email"] != "" && $_GET["email"] == $_GET["email_ver"]) {
  
}
$smarty->display("bias-corrected-request.tpl");

