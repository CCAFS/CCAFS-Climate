<?php

require_once '../../config/db.php';
require_once '../../config/smarty.php';

global $db;
$where = "";
$result = array();
if (isset($_POST["station"]) && $_POST["station"] != "")
  $where .= " AND station_id = " . $_POST["station"];
$period = isset($_POST["period"]) && $_POST["period"] != "" ? $_POST["period"] : null;

$query = "SELECT file_name, local_url, station_variable_id, date_start FROM station_file WHERE TRUE $where";
//echo $query;
$files = $db->getAll($query);

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
//      echo "<pre>".print_r($result['tmean']['data'],true)."</pre>";
      $result['tmean']['data'] = stationMean($result['tmean']['data']);
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
    }
  }
}

echo json_encode($result);

function stationReadFile($url, $name, $period) {
//  global $smarty;
//  print_r($smarty->getTemplateDir());
  $ouput = array();
  $myfile = fopen(WORKSPACE_DIR . "/downloads" . $url . "/" . $name, "r") or die("Unable to open file!");
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
