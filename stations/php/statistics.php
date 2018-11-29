<?php

/*require_once '../../config/db.php';
require_once '../../config/smarty.php';*/
include_once('../config/db_ccafs_climate.php');
//global $dbcon;
$where = "";
$result = array();
$stations = json_decode($_REQUEST["stations"]);
//if (isset($_REQUEST["stations"]) && $_REQUEST["stations"] != "") {
if (isset($stations) && $stations != "" && count($stations)) {
  $where .= " AND a.station_id IN (" . implode(",",$stations). ")";
}

$vars = json_decode($_REQUEST["variable"]);
if (isset($vars) && $vars != "" && count($vars) && !in_array(0, $vars)) {
  $where .= " AND b.id IN (" . implode(",",$vars) . ")";
}


   $sql ="SELECT a.file_name, a.local_url, a.station_variable_id, a.date_start, b.acronym, c.code, c.id, c.name, qc.name quality,a.date_start, a.date_end FROM station_file a INNER JOIN station_variable b ON (a.station_variable_id = b.id) INNER JOIN geostation c ON (a.station_id = c.id) INNER JOIN station_ctrl_quality qc ON (a.station_ctrl_quality_id = qc.id) WHERE TRUE $where order by c.id DESC";

   $ret = pg_query($dbcon, $sql);
   if(!$ret){
      // echo pg_last_error($db);
      exit;
   } 
   
   $files = pg_fetch_all($ret);
   // echo "Operation done successfully\n";
   pg_close($dbcon);
$output = array();
$result['output']['totalCount'] = count($files);
$i=0;
foreach ($files as $file) {
	$result[$file['id']][$file['acronym']]['data'] = array_merge(stationReadFile($file['local_url'], $file['file_name']), isset($result['prec']['data']) ? $result['prec']['data'] : array());
	$result['output']['topics'][$i]['idstat'] = $file['id'];
	$result['output']['topics'][$i]['code'] = $file['code'];
	$result['output']['topics'][$i]['name'] = $file['name'];
	$result['output']['topics'][$i]['quality'] = $file['quality'];
	$result['output']['topics'][$i]['var'] = $file['acronym'];
	$result['output']['topics'][$i]['date_start'] = $file['date_start'];
	$result['output']['topics'][$i]['date_end'] = $file['date_end'];
	$result['output']['topics'][$i] = array_merge($result['output']['topics'][$i],resumeCalculator($result[$file['id']][$file['acronym']]['data']));
	//unset($result[$file['id']][$file['acronym']]['data']);
	$i++;
}


	// $result['output']['totalCount'] = $i;
 //echo "<pre>".print_r($result['output'],true)."</pre>";
header('Content-type: application/json',true);
echo json_encode($result['output']);




function resumeCalculator($data) {
	$output = array();
	$output['count'] = (string)count($data);
	$output['min'] = strval(minValue($data));
	$output['max'] = strval(maxValue($data));
	$output['mean'] = strval(round(stationMean($data),2));
	$output['variance'] = strval(round(variance($data),2));
	$output['sd'] = strval(round(stdDev($data),2));
	$output['median'] = strval(calculateMedian($data));
	$output['cv_per'] = strval(round(cv($data),2));
	$output['na'] = strval(nullCounterStation($data));
	$output['na_per'] = strval(round(nullCounterStation($data, 'percent'),2));
	 //echo "<pre>".$url.print_r($output,true)."</pre>";
	return $output;
}

function minValue ($values) {
	//$tmp = 0;
	foreach ($values as $value) {
        //$sum += $value;
		if(!isset($tmp)) {
			$tmp = $value;
        } else if($value < $tmp && $value!='') {
          $tmp = $value;
        }
    }
	return $tmp;
}

function maxValue ($values) {
	//$tmp = 0;
	foreach ($values as $value) {
        //$sum += $value;
		if(!isset($tmp)) {
			$tmp = $value;
        } else if($value > $tmp && $value!='') {
          $tmp = $value;
        }
    }
	return $tmp;
}

function stationReadFile($url, $name) {
//  global $smarty;
//  print_r($smarty->getTemplateDir());
	global $dirfilesStations;
  $ouput = array();
  $myfile = fopen( $dirfilesStations.$url . "/" . $name, "r") or die("Unable to open file!");
  $line = fgets($myfile);
  $i = 0;
  while (!feof($myfile)) {
    $line = fgets($myfile);
      // $line = explode("\t", $line);
	if(explode("/", $url)[2]=='hnd-copeco' || explode("/", $url)[2]=='hnd-dgrh-noaa'|| explode("/", $url)[2]=='hnd-enee'){
	  $line = explode(" ", $line);
	}else{
	  $line = explode("\t", $line);
	}	  
      if (isset($line[1])) {
        $line[1] = trim(preg_replace('/\s\s+/', ' ', $line[1]));
        if ($line[1] != 'NA' && $line[1] != '') {
          $ouput[] = floatval($line[1]);
        } else {
          $ouput[] = null;
        }
      }
  }
//  echo "<pre>".print_r($ouput,true)."</pre>";
  fclose($myfile);
  return $ouput;
}


function nullCounterStation ($data, $type = 'counter') {
	$num_args = 0;
	$total = count($data);
	foreach ($data as $value) {
		if(is_null($value)) {
          $num_args++;
        }
    }
	return ($type == 'percent')?($num_args/$total)*100:$num_args;
}

function stationMean($values) {
    $sum = 0;
    //$num_args = 0;
	$num_args = count ($values);
    foreach ($values as $value) {
        $sum += $value;
        if($value!=0 && $value!='') {
          //$num_args++;
        }
    }
    $mean = ($num_args!=0)?($sum / $num_args):0;
  return ($mean != 0)? round($mean,2):null;
}

function calculateMedian ($values) {
  sort($values, SORT_NUMERIC);
  $iCount = count($values);
  $middle_index = floor($iCount / 2);
  if ($iCount % 2 == 0) {
    return ($values[$middle_index] + $values[$middle_index-1])/2;
  } else {
    return $values[$middle_index];
  }
}

function stdDev ($values) {
    $num_args = count ($values);
    $sum = 0;
    foreach ($values as $value) {
        $sum += $value;
    }
    
    $mean = $sum / $num_args;
    $sum = 0;
    foreach ($values as $value) {
      $sum += pow(($value - $mean),2);
    }
    return sqrt($sum / $num_args);
}

function cv ($values) {
    $num_args = count ($values);
    $sum = 0;
    foreach ($values as $value) {
        $sum += $value;
    }
    
    $mean = $sum / $num_args;
    $sum = 0;
    foreach ($values as $value) {
      $sum += pow(($value - $mean),2);
    }
    $sd = sqrt($sum / $num_args);
    
    return ($sd/abs($mean)) *100;
}

function variance ($values) {
    $num_args = count ($values);
    $sum = 0;
    foreach ($values as $value) {
        $sum += $value;
    }
    
    $mean = $sum / $num_args;
    $sum = 0;
    foreach ($values as $value) {
      $sum += pow(($value - $mean),2);
    }
    return $sum / $num_args;
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
