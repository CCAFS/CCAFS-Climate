<?php
  error_reporting(E_ALL);
  ini_set('display_errors', 'On');
  define("PG_DB"  , "ccafs_climate");
  // define("PG_DB"  , "stations");
  define("PG_HOST", "172.22.52.62"); 
  define("PG_USER", "postgres");
  define("PG_PASS", "PASSWORD");
//  define("PG_PORT", "5432"); 
//  define("SRID",   "4326");
  

$vars = $_REQUEST;
  
// echo "<pre>CCC".print_r($_REQUEST,true)."</pre>";
$period = explode(";",$_REQUEST['period']);
$periodh = explode(";", $_REQUEST['periodh']);

$serverData='/mnt/data_cluster_4/portals/ccafs_climate/download_data/files/data/bc_platform';
$downData='http://gisweb.ciat.cgiar.org/ccafs_climate/files/data/bc_platform';
$dirWork='/home/temp';
$dirgcm = '/mnt/data_cluster_2/gcm/cmip5/raw/daily';
$dirobs = '/mnt/data_cluster_5/cropdata';
$dataset = $_REQUEST['observation-acronym'];
$methBCList = $_REQUEST['methods'];
$varlist = $_REQUEST['variables-acronym'];
$Obyi = $periodh[0];
$Obyf = $periodh[1];
$fuyi = $period[0];
$fuyf = $period[1];
$rcpList = $_REQUEST['scenarios-acronym'];
$lon = $_REQUEST['lon'];;
$lat = $_REQUEST['lat'];;
$gcmlist = $_REQUEST['model'];
$statList= $_REQUEST['formats'];
$file = $_REQUEST['file'];
$delimit = $_REQUEST['delimitator'];
$order = $_REQUEST['order'];
/*$dataset = 'wfd';
$methBCList = '1';
$varlist = 'tasmax,pr';
$Obyi = '1975';
$Obyf = '1980';
$fuyi = '2030';
$fuyf = '2035';
$rcpList = 'rcp45';
$lon = '-73.5';
$lat = '3.4';
$gcmlist = 'bcc_csm1_1';
$statList= '1';*/
  
  $dbcon = pg_connect("dbname=".PG_DB." host=".PG_HOST." user=".PG_USER." password=".PG_PASS);
  
  if(!$dbcon){
    echo "Error : Unable to open database\n";
    exit;
  } else {
    echo "successs\n";
  }
   
   
	$dirfilesStations = $_SERVER["DOCUMENT_ROOT"]."/downloads";
	date_default_timezone_set();
	// $Date_Submitted=date("d-M-Y h:i:s");
   // $EmailAddress= $_REQUEST['email'];
	// $type=1
	
	$vars['type'] = 1;
	$vars['Date_Submitted'] = $_REQUEST['Date_Submitted'];//date("d-M-Y h:i:s");;
	$vars['EmailAddress'] = $_REQUEST['email'];
	$vars['rcpList'] = $rcpList;
	$vars['varlist'] = $varlist;
	$vars['Obyi'] = $Obyi;
	$vars['Obyf'] = $Obyf;
	$vars['fuyi'] = $fuyi;
	$vars['fuyf'] = $fuyf;
	$vars['gcmlist'] = $gcmlist;
	$vars['statList'] = $statList;
	$vars['dataset'] = $dataset;
	$vars['order'] = $_REQUEST['order'];


	$url = "http://gisweb.ciat.cgiar.org/Bc_Downscale/PHPMailer/correctedTest.php";
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_POST, count($vars));
	curl_setopt($curl, CURLOPT_POSTFIELDS, $vars);
	curl_setopt($curl, CURLOPT_TIMEOUT, 4); 
	$data = curl_exec($curl);
	curl_close($curl);
	
	// $sql ="select bc_processing(
	// '$serverData'::text, 
	// '$downData'::text, 
	// '$dirWork'::text,
	// '$dirgcm'::text,
	// '$dirobs'::text,
	// '$dataset'::text,
	// '$methBCList'::text,
	// '$varlist'::text,
	// '$Obyi'::text,
	// '$Obyf'::text,
	// '$fuyi'::text,
	// '$fuyf'::text,
	// '$rcpList'::text,
	// '$lon'::text,
	// '$lat'::text,
	// '$gcmlist'::text,
	// '$statList'::text,
	// '$file'::text,
	// '$delimit'::text,
	// '$order'::text);";
	$coors=$lon.','.$lat;
	$xyfile="";
	$dircdo="cdo";
	$sql ="select bc_processing(
	'$serverData'::text, 
	'$downData'::text, 
	'$dirWork'::text,
	'$dirgcm'::text,
	'$dirobs'::text,
	'$dataset'::text,
	'$methBCList'::text,
	'$varlist'::text,
	'$Obyi'::text,
	'$Obyf'::text,
	'$fuyi'::text,
	'$fuyf'::text,
	'$rcpList'::text,
	'$coors'::text,
	'$xyfile'::text,
	'$gcmlist'::text,
	'$statList'::text,
	'$file'::text,
	'$delimit'::text,
	'$order'::text,
	'$dircdo'::text);";
	
	
	$ret = pg_query($dbcon, $sql);
	if(!$ret){
	  echo pg_last_error($dbcon);
	  exit;
	}   
	$files = pg_fetch_all($ret);

	if (is_array($files) && count($files) > 0) {

		$register="INSERT INTO datasets_download_bias(lon, lat, models, scenarios, observation, periodh, periodf, variables, methods, formats,email,send)VALUES (".$lon.",".$lat.",'".$gcmlist."','".$rcpList."','".$dataset."','".$_REQUEST['periodh']."','".$_REQUEST['period']."','".$varlist."','".$methBCList."','".$_REQUEST['formats']."','".$_REQUEST['email']."','OK');";
		$ret = pg_query($dbcon, $register);
		// $ch = pg_fetch_all($ret);
	
		$url_file = $files[0]['bc_processing'];
		$vars['url_file'] = $url_file;
		$vars['type'] = 2;
		$vars['order'] = $_REQUEST['order'];
		
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_HEADER, false);
		curl_setopt($curl, CURLOPT_POST, count($vars));
		curl_setopt($curl, CURLOPT_POSTFIELDS, $vars);
		curl_setopt($curl, CURLOPT_TIMEOUT, 4); 
		$data = curl_exec($curl);
		curl_close($curl);	  
	  
	}else{
		$register="INSERT INTO datasets_download_bias(lon, lat, models, scenarios, observation, periodh, periodf, variables, methods, formats,email,send)VALUES (".$lon.",".$lat.",'".$gcmlist."','".$rcpList."','".$dataset."','".$_REQUEST['periodh']."','".$_REQUEST['period']."','".$varlist."','".$methBCList."','".$_REQUEST['formats']."','".$_REQUEST['email']."','NO');";
		$ret = pg_query($dbcon, $register);
		// $ch = pg_fetch_all($ret);
	}
	pg_close($dbcon);

