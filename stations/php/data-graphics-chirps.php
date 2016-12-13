<?php

	/*require_once '../../config/db.php';
	require_once '../../config/smarty.php';*/
	// include_once('../config/db_ccafs_climate.php');
	//http://172.22.52.48/stations/php/data-graphics-chirps.php?lon=-76&lat=4&yi=1981&yf=1981&mi=1&mf=1
	define("PG_DB"  , "ccafs_climate");
	define("PG_HOST", "172.22.52.15"); 
	define("PG_USER", "jtarapues");
	define("PG_PASS", "Jaime881");
	define("PG_PORT", "5432"); 
	define("SRID",   "4326"); 

	  $dbcon = pg_connect("dbname=".PG_DB." host=".PG_HOST." user=".PG_USER." password=".PG_PASS." port=".PG_PORT);
	// $dirfilesStations="C:\xampp\htdocs\CCAFS-Climate\downloads";

	$lon=$_REQUEST["lon"]; 
	$lat=$_REQUEST["lat"]; 
	$yi=$_REQUEST["yi"];
	$yf=$_REQUEST["yf"];
	$mi=$_REQUEST["mi"]; 
	$mf=$_REQUEST["mf"]; 
	
	$sql ="select * from getValuesChirpsGlobal($lon,$lat,$yi,$yf,$mi,$mf)"; 
	$result = pg_query($dbcon, $sql);
	// $row = pg_fetch_row($result);
	// print $row[0];
	if($mi<10){
		$mi="0".$mi;
	}
	$geojson = array(
			"prec" => array(
					'sdate' => $yi.'-'.$mi.'-01',
					'data' => array()
					),
			"monthly" => array(
					'sdate' => $yi.'-'.$mi.'-01',
					'data' => array()
					),	
			"clim" => array(
					'sdate' => $yi.'-'.$mi.'-01',
					'data' => array()
					),
			"stats" => array(
					'data' => array()
					)					
	);
				
	// $json=array();			
	while($line = pg_fetch_assoc($result)){
		if($line['type']=="1"){
			array_push($geojson['prec']['data'],floatval($line['prec']));
		}
		if($line['type']=="2"){
			array_push($geojson['monthly']['data'],floatval($line['prec']));
		}
		if($line['type']=="3"){
			array_push($geojson['clim']['data'],floatval($line['prec']));
		}	
		if($line['type']=="4"){
			array_push($geojson['stats']['data'],floatval($line['prec']));
		}		
	}
	pg_close($dbcon);
	echo json_encode($geojson);	  
	// $especie = json_encode($geojson);
	

	// header('Content-type: application/json',true);
	
	// echo $especie;  	
	
	/*		
	// print $access_level." ".$copyrigth ." ".$copyright;
	if (isset($_REQUEST['qc'])) {
	  // $qc = json_decode($_REQUEST["qc"]);
	  $qc = $_REQUEST["qc"];
	}

	$where = "";
	$result = array();
	if (isset($_REQUEST["station"]) && isset($_REQUEST["station"]) != "") {
	  $where .= " AND station_id = " . $_REQUEST["station"];
	}
	//$period = isset($_REQUEST["period"]) && $_REQUEST["period"] != "" ? $_REQUEST["period"] : null;
	$period=1;
	$vars = $_REQUEST["variable"];
	 $where .= " AND b.id IN (" . $vars . ")";

	if (isset($qc) && $qc != "") {
	//print_r($varList);
		if($qc=='qc'){
			$where .= " AND station_ctrl_quality_id=2";
		}elseif($qc=='raw'){
			$where .= " AND station_ctrl_quality_id=1";
		}
	}

	   $sql ="SELECT a.file_name, a.local_url, a.station_variable_id, a.date_start FROM station_file a INNER JOIN station_variable b ON (a.station_variable_id = b.id)  WHERE TRUE $where";
		// print $sql;
	   $ret = pg_query($dbcon, $sql);
	   if(!$ret){
		  echo pg_last_error($dbcon);
		  exit;
	   } 
	   
	   $files = pg_fetch_all($ret);

	   // echo "Operation done successfully\n";
	   pg_close($dbcon);

	foreach ($files as $file) {
		
	  if ($period == 3) {
		//precipitacion
		if ($file['station_variable_id'] == 1) {
		  $result['prec']['sdate'] = $file['date_start'];
		  $result['prec']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['prec']['data']) ? $result['prec']['data'] : array());
		  $result['prec']['data'] = stationSum($result['prec']['data']);
		}
	  } else if ($period == 2) {
		//precipitacion
		if ($file['station_variable_id'] == 1) {
		  $result['prec']['sdate'] = $file['date_start'];
		  $result['prec']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['prec']['data']) ? $result['prec']['data'] : array());
		  $result['prec']['data'] = stationSum($result['prec']['data']);
		}
	  } else if ($period == 1) {
		//precipitacion
		if ($file['station_variable_id'] == 1) {
		  $result['prec']['sdate'] = $file['date_start'];
		  $result['prec']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['prec']['data']) ? $result['prec']['data'] : array());
		}
	  }
	}

	echo json_encode($result);

	function stationReadFile($url, $name, $period) {
	//  global $smarty;
	//  print_r($smarty->getTemplateDir());
	// print_r($dirfilesStations.$url . "/" . $name);

		global $dirfilesStations;
	  $ouput = array();
	  $myfile = fopen( $dirfilesStations.$url . "/" . $name, "r") or die("Unable to open file!"); //realpath(dirname(__FILE__))
	  $line = fgets($myfile);
	  $i = 0;
	  while (!feof($myfile) && $i < 2000) {
		$line = fgets($myfile);
		if ($period == 1) {
		  $line = explode("\t", $line);
		  if (isset($line[1])) {
			$line[1] = trim(preg_replace('/\s\s+/', ' ', $line[1]));
			if ($line[1] != 'NA' && $line[1] != '') {
			  $ouput[] = floatval($line[1]);
			} else {
			  $ouput[] = null;
			}
		  }
		} else if ($period == 2) {
		  $line = explode("\t", $line);
		  if (isset($line[1])) {
			$line[1] = trim(preg_replace('/\s\s+/', ' ', $line[1]));
			if ($line[1] != 'NA' && $line[1] != '') {
			  $line[1] = floatval($line[1]);
			} else {
			  $line[1] = null;
			}
			$key = trim(preg_replace('/\s\s+/', ' ', $line[0]));
			$keym = substr($key, 0, -2);
			$ouput[$keym][] = $line[1];
		  }
		} else if ($period == 3) {
		  $line = explode("\t", $line);
		  if (isset($line[1])) {
			$line[1] = trim(preg_replace('/\s\s+/', ' ', $line[1]));
			if ($line[1] != 'NA' && $line[1] != '') {
			  $line[1] = floatval($line[1]);
			} else {
			  $line[1] = null;
			}
			$key = trim(preg_replace('/\s\s+/', ' ', $line[0]));
			$keym = substr($key, 0, -4);
			$ouput[$keym][] = $line[1];
		  }
		}
	//    $i++;
	  }
	//  echo "<pre>".print_r($ouput,true)."</pre>";
	  fclose($myfile);
	  return $ouput;
	}

	function stationMean($mothValues) {
	  $output = array();
	  foreach ($mothValues as $key => $values) {
	//    $num_args = count ($values);
		$sum = 0;
		$num_args = 0;
		foreach ($values as $value) {
			$sum += $value;
			if($value!=0 && $value!='') {
			  $num_args++;
			}
		}
		$mean = ($num_args!=0)?($sum / $num_args):0;
		$output[] = ($mean != 0)? round($mean,2):null;
	  }
	  return $output;
	}

	function stationSum($mothValues) {
	  $output = array();
	  foreach ($mothValues as $key => $values) {
		$sum = 0;
		foreach ($values as $value) {
			$sum += $value;
		}
		$output[] = $sum;
	  }
	  return $output;
	}
*/
