<?php

/* require_once '../../config/db.php';
  require_once '../../config/smarty.php'; */
include_once('../config/db_ccafs_climate.php');
include($_SERVER['DOCUMENT_ROOT']."/stations/classes/access_user/access_user_class.php");

//user info
$user = new Access_user;
$user->get_user_info();

//global $db;
$where = "";
$whereStation = "";
$result = array();

if (isset($_REQUEST['station'])) {
  $statList = json_decode($_REQUEST["station"]);
}
if (isset($_REQUEST['variable'])) {
  $varList = json_decode($_REQUEST["variable"]);
}
if (isset($_REQUEST['typedwn'])) {
  $typedwn = $_REQUEST["typedwn"];
}
if (isset($_REQUEST['country'])) {
  $country = $_REQUEST["country"];
}
if (isset($_REQUEST['state'])) {
  $state = $_REQUEST["state"];
}
if (isset($_REQUEST['municip'])) {
  $municip = $_REQUEST["municip"];
}


$admin = "gadm_lev2";

// echo $varList; # [2,3,1] 3
// echo 'hols';
// exit();

if (isset($statList) && $statList != "") {
//print_r($statList);
  $where .= " AND station_id IN (" . implode(",", $statList) . ")";
  $whereStation .= " AND a.id IN (" . implode(",", $statList) . ")";
}
if (isset($varList) && $varList != "") {
//print_r($varList);
  $where .= " AND station_variable_id IN (" . implode(",", $varList) . ")";
}


if (!$dbcon) {
  echo "Error : Unable to open database\n";
} else {
  //echo "Opened database successfully\n";
}

if ($country != "null" && $state != "null" && $municip != "null") {
  $sql_t = "select hasc_2
			from " . $admin . " as l
			where l.id_0=" . $country . " and l.id_1=" . $state . " and l.id_2=" . $municip . ";";
  $sqldata = pg_exec($dbcon, $sql_t);
  $getregion = pg_fetch_result($sqldata, 0, 0);
  $outfile = "ccafs-climate_stations_" . $getregion . ".zip";
} elseif ($country != "null" && $state != "null" && $municip == "null") {
  $sql_t = "select hasc_1
			from gadm_lev1 as l
			where l.id_0=" . $country . " and l.id_1=" . $state . ";";
  $sqldata = pg_exec($dbcon, $sql_t);
  $getregion = pg_fetch_result($sqldata, 0, 0);
  $outfile = "ccafs-climate_stations_" . $getregion . ".zip";
} elseif ($country != "null" && $state == "null" && $municip == "null") {
  $sql_t = "select iso
			from gadm_lev1 as l 
			where l.id_0=" . $country . ";";
  $sqldata = pg_exec($dbcon, $sql_t);
  $getregion = pg_fetch_result($sqldata, 0, 0);
  $outfile = "ccafs-climate_stations_" . $getregion . ".zip";
}



if ($country == "null" && $state == "null" && $municip == "null" && count($statList) == 1) {
  $outfile = "ccafs-climate_stations_id" . $statList[0] . ".zip";
}
if (isset($typedwn)) {
  if ($typedwn == 'selection') {
    $outfile = "ccafs-climate_stations_sel.zip";
  }
}
if (isset($typedwn)) {
  if ($typedwn == 'query') {
    $outfile = "ccafs-climate_stations_query.zip";
  }
}


$sql = "SELECT file_name, local_url, station_variable_id, date_start FROM station_file WHERE TRUE $where";

$ret = pg_query($dbcon, $sql);
if (!$ret) {
  echo pg_last_error($dbcon);
  exit;
}
$filesArray = pg_fetch_all($ret);

$sql = "SELECT a.id, a.code, a.name, b.name as institute, c.name as model, d.name as category, a.instalation, a.lon, a.lat, a.elev, e.name as country, f.name as state, g.name as city, array_to_string(array_agg(DISTINCT i.acronym), '|') as variables
			FROM geostation a 
			inner join station_institute b ON (b.id = a.institute) 
			inner join station_type c ON (c.id = a.type)
			inner join station_category d ON (d.id = a.category)
			inner join station_country e ON (e.id = a.country)
			inner join station_state f ON (f.id = a.state)
			inner join station_city g ON (g.id = a.city)
			inner join station_file h on (a.id = h.station_id)
			inner join station_variable i ON (i.id = h.station_variable_id) 
			WHERE TRUE $whereStation group by a.id, a.code, a.name, b.name , c.name , d.name , a.instalation, a.lon, a.lat, a.elev, e.name , f.name , g.name ";
   $ret = pg_query($dbcon, $sql);
   if(!$ret){
      echo pg_last_error($dbcon);
      exit;
   } 
   $stations = pg_fetch_all($ret);
   $output = "";
   $output .= implode(",", array_keys($stations[0]))."\r\n";
   foreach ($stations as $station) {
	$output .= implode(",", $station)."\r\n";
   }
   file_put_contents('stations.txt', $output);
   //echo "Operation done successfully\n";
   pg_close($dbcon);
	$files = array();
	$files[] = 'stations.txt';
	//echo "files found: ".count($filesArray);
	foreach ($filesArray as $file) {
		$files[] = $dirfilesStations.$file['local_url'] . "/" . $file['file_name'];
		//echo $dirfilesStations."<br>";
	}
	
	$db = pg_connect("dbname=".PG_DB." host=".PG_HOST." user=".PG_USER." password=".PG_PASS." port=".PG_PORT);
//$query = "SELECT * FROM Quote WHERE estid='$poid' AND distid='$distid'";
	$id = 0;
	if ($user->id) {
		$id = $user->id;
	}
	$sqli ="INSERT INTO station_downloads (user_id, stations, variables) VALUES
	(".$id.", '".serialize($statList)."', '".serialize($varList)."'); ";
   //$ret = pg_query($dbcon, $sqli);
   $ret = pg_exec($db, $sqli);
	pg_close($db);
   if(!$ret){
      echo pg_last_error($dbcon);
	  exit;
   }
//stationReadFile($file['local_url'], $file['file_name'], $period);
/* function stationReadFile($url, $name, $period) {
  //  global $smarty;
  //  print_r($smarty->getTemplateDir());
  $ouput = array();
  $myfile = fopen( realpath(dirname(__FILE__)).$url . "/" . $name, "r") or die("Unable to open file!");
  //  echo "<pre>".print_r($ouput,true)."</pre>";
  fclose($myfile);
  return $ouput;
  } */



//$files = array('station.js','index.php');
# create new zip opbject
$zip = new ZipArchive();

# create a temp file & open it
$tmp_file = tempnam('.', '');
$zip->open($tmp_file, ZipArchive::CREATE);

# loop through each file
foreach ($files as $file) {

  # download file
  $download_file = file_get_contents($file);

  #add it to the zip
  $zip->addFromString(basename($file), $download_file);
}

# close zip
$zip->close();

ob_clean();
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
header('Content-Type: application/x-download');
header('Content-Disposition: attachment; filename="'.$outfile.'"');
readfile($tmp_file);
unlink($tmp_file);
exit;


//# send the file to the browser as a download
//header("Content-disposition: attachment; filename=" . $outfile);
//header('Content-type: application/zip');
//readfile($tmp_file);
//unlink($tmp_file);

// echo 'done';