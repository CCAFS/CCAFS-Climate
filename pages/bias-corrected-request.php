<?php

require_once '../config/smarty.php';
require_once '../config/db.php';
$file = 'false';
$method = isset($_REQUEST["method"]) && is_numeric($_REQUEST["method"]) && $_REQUEST["method"] >= 0 ? $_REQUEST["method"] : null;
$lat = isset($_REQUEST["lat"]) && is_numeric($_REQUEST["lat"]) ? $_REQUEST["lat"] : null;
$lon = isset($_REQUEST["lon"]) && is_numeric($_REQUEST["lon"]) ? $_REQUEST["lon"] : null;
$period = isset($_REQUEST["period"]) ? $_REQUEST["period"] : null;
$periodh = isset($_REQUEST["periodh"]) ? $_REQUEST["periodh"] : null;
$fileSet = isset($_REQUEST["fileSet"]) && is_numeric($_REQUEST["fileSet"]) && $_REQUEST["fileSet"] >= 0 ? $_REQUEST["fileSet"] : null;
$observation = isset($_REQUEST["observation"]) ? $_REQUEST["observation"] : null;

//$extentId = isset($_REQUEST["extent"]) && is_numeric($_REQUEST["extent"]) && $_REQUEST["extent"] >= 0 ? $_REQUEST["extent"] : null;
//$tile = isset($_REQUEST["tile_name"]) && $_REQUEST["tile_name"] != "" ? $_REQUEST["tile_name"] : null;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//echo "<pre>" . print_r($_REQUEST, true) . "</pre>";
//echo "<pre>" . print_r($_FILES, true) . "</pre>";
if (isset($_FILES["station-file"]["tmp_name"]) && $_FILES["station-file"]["tmp_name"] != "") {
  $file_url = $_FILES["station-file"]["tmp_name"];
  $upload_dir = WORKSPACE_DIR.'/bias_tmp';
  $file_data = file_get_contents($file_url);
  $filename = basename('file_' . time()). ".txt";
  $uri = $upload_dir . '/' . $filename;
  $res = file_put_contents($uri, $file_data);
  $namefile= $_FILES["station-file"]["name"];
  if ($res) {
    $url = SMARTY_ROOT_URI."bias_tmp/";
    $file = $url.$filename;
  }
}
if (isset($_REQUEST["email"]) && $_REQUEST["email"] != "" && $_REQUEST["email"] == $_REQUEST["email_ver"]) {
  $vars = $_REQUEST;
  $query = "SELECT id, name, acronym FROM datasets_scenario_bias where id in (" . $_REQUEST["scenarios"] . ")";
  $scenarios = $db->getAll($query);
  $sceAcro = "";
  foreach ($scenarios as $sce) {
    $sceAcro .= $sce['acronym'] . ",";
  }

  $query = "SELECT id, name FROM datasets_observation_bias WHERE id =" . $_REQUEST["observation"];
  $observations = $db->getAll($query);

  $query = "SELECT id, name, acronym FROM datasets_variable_bias WHERE id in (" . $_REQUEST["variables"] . ")";
  $variables = $db->getAll($query);
  $varAcro = "";
  foreach ($variables as $var) {
	$varAcro .= $var['acronym'] . ",";
  }	

  $query = "SELECT * FROM datasets_fileset_bias df WHERE id = " . $_REQUEST["fileSet"];
  $fileSets = $db->getAll($query);

  $query = "SELECT id, name FROM datasets_correction_method_bias WHERE id = " . $_REQUEST["method"];
  $methods = $db->getAll($query);
  
  $query = "SELECT id, name, acronym FROM datasets_format_bias WHERE id in (" . $_REQUEST["formats"] . ")";
  $formats = $db->getAll($query);
  $formAcro = "";
  foreach ($formats as $form) {
	$formAcro .= $form['name'] . ",";
  }   
  
  $vars['scenarios-acronym'] = substr($sceAcro, 0, -1);

  

  $vars['variables-acronym'] = substr($varAcro, 0, -1);

  $vars['formats-name'] = substr($formAcro, 0, -1);

  $vars['fileSet-acronym'] = $fileSets[0]['name'];
  
   $vars['method-acronym'] = $methods[0]['name'];

	// $vars['observation-acronym'] = $observations[0]['name'];


 // echo "<pre>".print_r($vars,true)."</pre>";
//  $url = "http://172.22.52.62/correctedTest.php";
// exit();
  $url = "http://gisweb.ciat.cgiar.org/Bc_Downscale/biasCorrected.php";
  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_HEADER, false);
  curl_setopt($curl, CURLOPT_POST, count($vars));
  curl_setopt($curl, CURLOPT_POSTFIELDS, $vars);
  curl_setopt($curl, CURLOPT_TIMEOUT, 4);
  $data = curl_exec($curl);
  curl_close($curl);
  // echo $data;
  $smarty->display("bias-corrected-requested.tpl");
} else {
  $query = "SELECT id, name, acronym FROM datasets_scenario_bias where id in (" . implode(",", $_REQUEST["scenarios"]) . ")";
  $scenarios = $db->getAll($query);
  $sceAcro = "";
  foreach ($scenarios as $sce) {
    $sceAcro .= $sce['acronym'] . ",";
  }

  $query = "SELECT id, name FROM datasets_observation_bias WHERE id =" . $_REQUEST["observation"];
  $observations = $db->getAll($query);
  
	$query = "SELECT id, name, acronym FROM datasets_variable_bias WHERE id in (" . implode(",", $_REQUEST["variables"]) . ")";
	$variables = $db->getAll($query);
	$varAcro = "";
	foreach ($variables as $var) {
		$varAcro .= $var['acronym'] . ",";
	}

  $query = "SELECT * FROM datasets_fileset_bias df WHERE id = " . $_REQUEST["fileSet"];
  $fileSets = $db->getAll($query);

  $query = "SELECT id, name FROM datasets_correction_method_bias WHERE id = " . $_REQUEST["method"];
  $methods = $db->getAll($query);

  $query = "SELECT id, name, acronym FROM datasets_format_bias WHERE id in (" . implode(",", $_REQUEST["formats"]) . ")";
  $formats = $db->getAll($query);
  $formAcro = "";
  $formName = "";
  foreach ($formats as $form) {
    $formAcro .= $form['acronym'] . ",";
    $formName.= $form['name'] . ",";
  }

  $variables = isset($_REQUEST["variables"]) ? implode(",", $_REQUEST["variables"]) : null;
  $scenarios = isset($_REQUEST["scenarios"]) ? implode(",", $_REQUEST["scenarios"]) : null;
  $models = isset($_REQUEST["model"]) ? implode(",", $_REQUEST["model"]) : null;
  $formats = isset($_REQUEST["formats"]) ? implode(",", $_REQUEST["formats"]) : null;
  $delimitator = isset($_REQUEST["delimit"]) ? $_REQUEST["delimit"] : '';
  $smarty->assign("fileSets", $fileSet);
  $smarty->assign("fileSetsAcronym", $fileSets[0]['name']);
  $smarty->assign("scenarios", $scenarios);
  $smarty->assign("scenariosAcronym", substr($sceAcro, 0, -1));
  $smarty->assign("models", $models);
  $smarty->assign("observation", $observation);
  $smarty->assign("variables", $variables);
  if($namefile){  
	$smarty->assign("observationAcronym", "station");
	$smarty->assign("variablesAcronym", "ALL");
  }else{
    $smarty->assign("observationAcronym", $observations[0]['name']);
	$smarty->assign("variablesAcronym", substr($varAcro, 0, -1));
  }
  $smarty->assign("method", $method);
  $smarty->assign("methodAcronym", $methods[0]['name']);
  $smarty->assign("formats", $formats);
  $smarty->assign("formatsAcronym", substr($formName, 0, -1));
  $smarty->assign("lat", $lat);
  $smarty->assign("lon", $lon);
  $smarty->assign("period", $period);
  $smarty->assign("periodh", $periodh);
  $smarty->assign("file", $file);
  $smarty->assign("namefile", $namefile);
  $smarty->assign("delimitator", $delimitator);
  $smarty->display("bias-corrected-request.tpl");
}
