<?php

/*require_once '../../config/db.php';
require_once '../../config/smarty.php';*/
include_once('../config/db_ccafs_climate.php');
	
// $dirfilesStations="C:\xampp\htdocs\CCAFS-Climate\downloads";

//global $db;

		
// print $access_level." ".$copyrigth ." ".$copyright;


	$where = "";
	$result = array();
	if (isset($_POST["station"]) && isset($_POST["station"]) != "") {
	  $where .= " AND station_id = " . $_POST["station"];
	}
	$period = isset($_POST["period"]) && $_POST["period"] != "" ? $_POST["period"] : null;
	if (isset($_REQUEST['variable'])){$vars = json_decode($_POST["variable"]);}
	if (isset($vars) && $vars != "" && count($vars) && !in_array(0, $vars)) {
	  $where .= " AND b.id IN (" . implode(",",$vars) . ")";
	}



	   $sql ="SELECT a.file_name, a.local_url, a.station_variable_id, a.date_start FROM station_file a INNER JOIN station_variable b ON (a.station_variable_id = b.id)  WHERE TRUE $where";

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
		} else if ($file['station_variable_id'] == 2) {
		  $result['tmax']['sdate'] = $file['date_start'];
		  $result['tmax']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['tmax']['data']) ? $result['tmax']['data'] : array());
		  $result['tmax']['data'] = stationMean($result['tmax']['data']);
		} else if ($file['station_variable_id'] == 3) {
		  $result['tmin']['sdate'] = $file['date_start'];
		  $result['tmin']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['tmin']['data']) ? $result['tmin']['data'] : array());
		  $result['tmin']['data'] = stationMean($result['tmin']['data']);
		} else if ($file['station_variable_id'] == 4) {
		  $result['tmean']['sdate'] = $file['date_start'];
		  $result['tmean']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['tmean']['data']) ? $result['tmean']['data'] : array());
		  $result['tmean']['data'] = stationMean($result['tmean']['data']);
		} else if ($file['station_variable_id'] == 5) {
		  $result['sbright']['sdate'] = $file['date_start'];
		  $result['sbright']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['sbright']['data']) ? $result['sbright']['data'] : array());
		  $result['sbright']['data'] = stationMean($result['sbright']['data']);
		} else if ($file['station_variable_id'] == 6) {
		  $result['rhum']['sdate'] = $file['date_start'];
		  $result['rhum']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['rhum']['data']) ? $result['rhum']['data'] : array());
		  $result['rhum']['data'] = stationMean($result['rhum']['data']);
		}
	  } else if ($period == 2) {
		//precipitacion
		if ($file['station_variable_id'] == 1) {
		  $result['prec']['sdate'] = $file['date_start'];
		  $result['prec']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['prec']['data']) ? $result['prec']['data'] : array());
		  $result['prec']['data'] = stationSum($result['prec']['data']);
		} else if ($file['station_variable_id'] == 2) {
		  $result['tmax']['sdate'] = $file['date_start'];
		  $result['tmax']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['tmax']['data']) ? $result['tmax']['data'] : array());
		  $result['tmax']['data'] = stationMean($result['tmax']['data']);
		} else if ($file['station_variable_id'] == 3) {
		  $result['tmin']['sdate'] = $file['date_start'];
		  $result['tmin']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['tmin']['data']) ? $result['tmin']['data'] : array());
		  $result['tmin']['data'] = stationMean($result['tmin']['data']);
		} else if ($file['station_variable_id'] == 4) {
		  $result['tmean']['sdate'] = $file['date_start'];
		  $result['tmean']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['tmean']['data']) ? $result['tmean']['data'] : array());
		  $result['tmean']['data'] = stationMean($result['tmean']['data']);
		} else if ($file['station_variable_id'] == 5) {
		  $result['sbright']['sdate'] = $file['date_start'];
		  $result['sbright']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['sbright']['data']) ? $result['sbright']['data'] : array());
		  $result['sbright']['data'] = stationMean($result['sbright']['data']);
		} else if ($file['station_variable_id'] == 6) {
		  $result['rhum']['sdate'] = $file['date_start'];
		  $result['rhum']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['rhum']['data']) ? $result['rhum']['data'] : array());
		  $result['rhum']['data'] = stationMean($result['rhum']['data']);
		}
	  } else if ($period == 1) {
		//precipitacion
		if ($file['station_variable_id'] == 1) {
		  $result['prec']['sdate'] = $file['date_start'];
		  $result['prec']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['prec']['data']) ? $result['prec']['data'] : array());
		} else if ($file['station_variable_id'] == 2) {
		  $result['tmax']['sdate'] = $file['date_start'];
		  $result['tmax']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['tmax']['data']) ? $result['tmax']['data'] : array());
		} else if ($file['station_variable_id'] == 3) {
		  $result['tmin']['sdate'] = $file['date_start'];
		  $result['tmin']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['tmin']['data']) ? $result['tmin']['data'] : array());
		} else if ($file['station_variable_id'] == 4) {
		  $result['tmean']['sdate'] = $file['date_start'];
		  $result['tmean']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['tmean']['data']) ? $result['tmean']['data'] : array());
		} else if ($file['station_variable_id'] == 5) {
		  $result['sbright']['sdate'] = $file['date_start'];
		  $result['sbright']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['sbright']['data']) ? $result['sbright']['data'] : array());
		} else if ($file['station_variable_id'] == 6) {
		  $result['rhum']['sdate'] = $file['date_start'];
		  $result['rhum']['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name'], $period), isset($result['rhum']['data']) ? $result['rhum']['data'] : array());
		}
	  }
	}

	echo json_encode($result);

	function stationReadFile($url, $name, $period) {
	//  global $smarty;
	//  print_r($smarty->getTemplateDir());
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
