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
  
echo "<pre>CCC".print_r($_REQUEST,true)."</pre>";
$period = explode(";",$_REQUEST['period']);
$periodh = explode(";", $_REQUEST['periodh']);

$serverData='/mnt/data_cluster_4/portals/ccafs_climate/download_data/files/data/bc_platform';
$downData='http://gisweb.ciat.cgiar.org/ccafs_climate/files/data/bc_platform';
$dirWork='/home/temp';
$dirgcm = '/mnt/data_cluster_2/gcm/cmip5/raw/daily';
$dirobs = '/mnt/data_cluster_5/cropdata/';
$dataset = $_REQUEST['observation'];
$methBCList = $_REQUEST['method'];
$varlist = $_REQUEST['variables'];
$Obyi = $periodh[0];
$Obyf = $periodh[1];
$fuyi = $period[0];
$fuyf = $period[1];
$rcpList = $_REQUEST['scenarios'];
$lon = $_REQUEST['lon'];;
$lat = $_REQUEST['lat'];;
$gcmlist = $_REQUEST['model'];
$statList= $_REQUEST['format'];
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
  '$lon'::text,
  '$lat'::text,
  '$gcmlist'::text,
  '$statList'::text);";
//  $sql ="select * from test;";
    // echo $sql."<br>";
   // $ret = pg_query($dbcon, $sql);
   // if(!$ret){
      // echo pg_last_error($dbcon);
      // exit;
   // }   
   // $files = pg_fetch_all($ret);

   // pg_close($dbcon);
   
   
		// echo "<pre>CCC".print_r($files,true)."</pre>";
		date_default_timezone_set("UTC");
		$Date_Submitted=date("Y-m-d H:i:s");

		$to      = $_REQUEST['email'];
		// $subject = 'the subject';
		// $message = 'hello2 '.$files[0]['bc_processing'];
		// $headers = 'From: admin@ccafs-climate.org' . "\r\n" .
		// 'Reply-To: admin@ccafs-climate.org' . "\r\n" .
		// 'X-Mailer: PHP/' . phpversion();
		// mail($to, $subject, $message, $headers);

		$subject = 'CCAFS-Climate. Climate data request';

		// $headers = 'From: c.r.sanchez@cgiar.org' . "\r\n" .
		// 'Reply-To: c.r.sanchez@cgiar.org' . "\r\n" .
		// 'X-Mailer: PHP/' . phpversion();

		$headers = "From: ccafsclimate@gmail.com\r\n";
		$headers .= "Reply-To: ccafsclimate@gmail.com \r\n";
		// $headers .= "CC: susan@example.com\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=LATIN-1\r\n"; #charset=ISO-8859-1 

		// $message = '<html><body>';	
		// $message .= '<span style="margin-bottom:10px;color:#5c6f26"><b>HELPFUL LINKS</b></span>';
		// $message .= "</body></html>";

		$message ='<html xmlns="http://www.w3.org/1999/xhtml">';
		$message .='<head>';
		// $message .='<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
		$message .='<title>Documento sin t&iacute;tulo</title></head>';
		$message .='';
		$message .='<body>';
		$message .='<div id=":2fw" class="ii gt m150698e8cc3a11ca adP adO"><div id=":23j" class="a3s" style="overflow: hidden;"><u></u>';
		$message .='<div bgcolor="#f4f4f4" color="#000000" marginwidth="0" marginheight="0">';
		$message .='<div bgcolor="#f4f4f4" color="#000000" marginwidth="0" marginheight="0" link="#000099" vlink="#000099" alink="#000099">';
		$message .='<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" align="center">';
		$message .='<tbody>';
		$message .='<tr>';
		$message .='<td width="100%" align="center" valign="top" bgcolor="#f4f4f4">';
		$message .='';
		$message .='<table border="0" cellpadding="0" cellspacing="0" width="800">';
		$message .='<tbody><tr>';
		$message .='<td valign="top" bgcolor="#f4f4f4">';
		$message .='<table border="0" cellpadding="10" cellspacing="0" width="100%">';
		$message .='<tbody><tr>';
		$message .='<td valign="middle" align="center">';
		$message .='<font size="1">You are receiving this email because a request was made using this email address at the CCAFS-Climate Portal website. This email is automatically created and distributed, so please do not reply to this email.<br>';
		$message .='</font>';
		$message .='</td>';
		$message .='';
		$message .='</tr>';
		$message .='</tbody></table>';
		$message .='</td>';
		$message .='</tr>';
		$message .='</tbody></table>';
		$message .='';
		$message .='<table cellpadding="0" cellspacing="0" border="0" style="border:1px solid #ccc;width:800px;margin:0 auto">';
		$message .='<tbody>';
		$message .='<tr>';
		$message .='<td bgcolor="#ffffff" valign="top">';
		$message .='';
		$message .='<table cellpadding="0" cellspacing="0" border="0" width="798">';
		$message .='<tbody>';
		$message .='<tr>';
		$message .='<td bgcolor="#ffffff" align="left" valign="middle">';
		$message .='<a href="http://ccafs-climate.org/" target="_blank"><img src="http://gisweb.ciat.cgiar.org/Bc_Downscale/header_mail.png" alt="CCAFS-Climate" width="600" hspace="0" vspace="0" border="0"></a>	</td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td bgcolor="#ffffff" valign="top" align="center">';
		$message .='<table width="100%" cellpadding="7" cellspacing="0" border="0">';
		$message .='<tbody><tr>';
		$message .='<td width="50" valign="middle" align="right" bgcolor="#81963E">';
		$message .='<img src="https://ci5.googleusercontent.com/proxy/aCoCb9K2Dh7nqCYmIGwysSS30XdYk2VM8w2v11zLghnuAsvWWCFiGnyJRBGmgfKu7U8a-kR7F9kD882cMXy0YAlWczOpNaPSZR6QkY4x0UYSkbqdg4zl=s0-d-e1-ft#https://www.ncdc.noaa.gov/cdo-web/images/icons/cdo_mail_check.png" alt="Success" class="CToWUd">';
		$message .='</td>';
		$message .='<td valign="middle" bgcolor="#81963E">';
		$message .='<div><b>Your data request has been successfully submitted!</b></div>';
		$message .='</td>';
		$message .='</tr>';
		$message .='</tbody></table>';
		$message .='</td>';
		$message .='</tr>';
		$message .='</tbody>';
		$message .='</table>';
		$message .='<table cellpadding="0" cellspacing="0" border="0" width="798" bgcolor="#ffffff">';
		$message .='<tbody>';
		$message .='<tr>';
		$message .='<td valign="top" align="left">';
		$message .='<table width="568" cellpadding="3" cellspacing="0" border="0" style="margin:5px">';
		$message .='<tbody>';
		$message .='<tr>';
		$message .='<td bgcolor="#cccccc" width="139">&nbsp;</td>';
		$message .='<td bgcolor="#cccccc"><b>Order Summary</b></td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td valign="top" align="right" width="139" style="color:#777777"><b>Order Number:</b></td>';
		$message .='<td valign="top">619729</td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td valign="top" align="right" width="139" style="color:#777777"><b>Order Status:</b></td>';
		$message .='<td valign="top">Submitted</td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td valign="top" align="right" width="139" style="color:#777777"><b>Email Address:</b></td>';
		$message .='<td valign="top"><a href="mailto:'.$to.'" target="_blank">'.$to.'</a></td>';
		$message .='</tr>';
		$message .='<tr></tr>';
		$message .='<tr>';
		$message .='<td valign="top" align="right" width="139" style="color:#777777"><b>Date submitted:</b></td>';
		$message .='<td valign="top">'.$Date_Submitted.'</td>';
		$message .='</tr>';
		$message .='</tbody>';
		$message .='</table>';
		$message .='<table width="568" cellpadding="3" cellspacing="0" border="0" bgcolor="#ffffff" style="margin:5px">';
		$message .='<tbody>';
		$message .='<tr>';
		$message .='<td bgcolor="#cccccc" width="139">&nbsp;</td>';
		$message .='<td bgcolor="#cccccc"><b>Requested Data</b></td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Geographic location:</b></td>';
		$message .='<td align="left" valign="top">lon: '.$lon.', lat: '.$lat.'<br></td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td align="right" width="139" style="color:#777777" valign="top"><b>GCM File Set:</b></td>';
		$message .='<td align="left" valign="top">Raw GCM CMIP5 daily<br></td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Scenario:</b></td>';
		$message .='<td align="left" valign="top">'.$rcpList.'<br></td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Observation datset:</b></td>';
		$message .='<td align="left" valign="top">'.$dataset.'<br></td>';
		$message .='</tr>';
		$message .='<tr></tr>';
		$message .='<tr>';
		$message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Period historical:</b></td>';
		$message .='<td align="left" valign="top">'.$Obyi.'-'.$Obyf.'<br>																														</td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Period future:</b></td>';
		$message .='<td align="left" valign="top">'.$fuyi.'-'.$fuyf.'<br></td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Variables:</b></td>';
		$message .='<td align="left" valign="top">'.$varlist.'<br></td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Models:</b></td>';
		$message .='<td align="left" valign="top">'.$gcmlist.'</td>';
		$message .='</tr>';
		$message .='<tr></tr>';
		$message .='<tr>';
		$message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Correction Method</b></td>';
		$message .='<td align="left" valign="top"><br></td>';
		$message .='</tr>';
		// $message .='<tr>';
		// $message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Output format</b></td>';
		// $message .='<td align="left" valign="top">ALL<br></td>';
		// $message .='</tr>';
		// $message .='																																							<tr>';
		// $message .='<td align="right" width="139" style="color:#777777" valign="top"><b>Data Types:</b></td>';
		// $message .='<td align="left" valign="top">';
		// $message .='<b>TMAX</b> - Maximum temperature (tenths of degrees C)<br>';
		// $message .='<b>TMIN</b> - Minimum temperature (tenths of degrees C)<br>';
		// $message .='<b>PRCP</b> - Precipitation (tenths of mm)<br>';
		// $message .='<br>																</td>';
		// $message .='</tr>';
		$message .='</tbody>';
		$message .='</table>';
		$message .='';
		$message .='</td>';
		$message .='<td width="220" bgcolor="#ffffff" valign="top" align="left"style="background-image:url('."'https://www.ncdc.noaa.gov/cdo-web/images/bg/bg_sidegradient.png'".');background-position:top left;background-repeat:repeat-y">';
		$message .='';
		$message .='<table style="padding:10px;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:25px">';
		$message .='<tbody><tr>';
		$message .='<td style="padding-left:0px"><span style="margin-bottom:10px;color:#5c6f26"><b>HELPFUL LINKS</b></span><br>';
		$message .='<a href="http://ccafs-climate.org/" target="_blank">CCAFS-Climate website</a><br><br>';
		$message .='<a href="http://ccafs-climate.org/documentation/" target="_blank">View Documentation</a><br><br>';
		$message .='<a href="http://172.22.52.48/downloading_data/" target="_blank">Downloading data</a><br><br>';
		$message .='<br>';
		$message .='<span style="margin-bottom:10px;color:#5c6f26"><b>CCAFS-Climate</b></span><br>';
		$message .='Data Provided by the CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS)<br>';
		$message .='</td>';
		$message .='</tr>';
		$message .='</tbody></table>';
		$message .='';
		$message .='</td>';
		$message .='</tr>';
		$message .='</tbody>';
		$message .='</table>';
		$message .='';
		$message .='</td>';
		$message .='</tr>';
		$message .='</tbody>';
		$message .='</table>';
		$message .='';
		$message .='<table cellpadding="0" cellspacing="0" border="0" width="800">';
		$message .='<tbody>';
		$message .='<tr>';
		$message .='<td valign="top" align="center" bgcolor="#f4f4f4">';
		$message .='';
		$message .='<table>';
		$message .='<tbody><tr>';
		$message .='<td align="center">';
		$message .='<font size="1"><a href="https://ccafs.cgiar.org/" target="_blank">CCAFS</a> | <a href="https://ciat.cgiar.org/" target="_blank">CIAT Online</a> | <a href="http://ccafs-climate.org/" target="_blank">CCAFS-climate</a> | <a></a><a href="http://ccafs-climate.org/contact/" target="_blank">Contact Us</a></font>';
		$message .='</td>';
		$message .='</tr>';
		$message .='<tr>';
		$message .='<td align="center" valign="middle">';
		$message .='<font size="1">';
		$message .='<b>Mailing Address:</b> A.A. 6713 Cali, Colombia<br>';
		$message .='<b>Phone:</b> +57 2 4450000';
		$message .='</font>';
		$message .='</td>';
		$message .='</tr>';
		$message .='</tbody></table>';
		$message .='';
		$message .='</td>';
		$message .='</tr>';
		$message .='</tbody>';
		$message .='</table>';
		$message .='';
		$message .='</td>';
		$message .='</tr>';
		$message .='</tbody>';
		$message .='</table><div class="yj6qo"></div><div class="adL">';
		$message .='';
		$message .='</div></div><div class="adL">';
		$message .='</div></div></div></div>';
		$message .='';
		$message .='</body>';
		$message .='</html>';

		mail($to, $subject, $message, $headers);	

	//#####################################

		$ret = pg_query($dbcon, $sql);
		if(!$ret){
			echo pg_last_error($dbcon);
			exit;
		}   
		$files = pg_fetch_all($ret);

		pg_close($dbcon);
		
	if (is_array($files) && count($files) > 0) {
		$Date_Completed=date("Y-m-d H:i:s");

		$messageDone ='<html xmlns="http://www.w3.org/1999/xhtml">';
		$messageDone .='<head>';
		$messageDone .='<title>Documento sin t&iacute;tulo</title></head>';
		$messageDone .='<body>';
		$messageDone .='<div id=":2fw" class="ii gt m150698e8cc3a11ca adP adO"><div id=":23j" class="a3s" style="overflow: hidden;"><u></u>';
		$messageDone .='<div bgcolor="#f4f4f4" color="#000000" marginwidth="0" marginheight="0">';
		$messageDone .='<div bgcolor="#f4f4f4" color="#000000" marginwidth="0" marginheight="0" link="#000099" vlink="#000099" alink="#000099">';
		$messageDone .='<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" align="center">';
		$messageDone .='<tbody>';
		$messageDone .='<tr>';
		$messageDone .='<td width="100%" align="center" valign="top" bgcolor="#f4f4f4">';
		$messageDone .='';
		$messageDone .='<table border="0" cellpadding="0" cellspacing="0" width="800">';
		$messageDone .='<tbody><tr>';
		$messageDone .='<td valign="top" bgcolor="#f4f4f4">';
		$messageDone .='<table border="0" cellpadding="10" cellspacing="0" width="100%">';
		$messageDone .='<tbody><tr>';
		$messageDone .='<td valign="middle" align="center">';
		$messageDone .='<font size="1">You are receiving this email because a request was made using this email address at the CCAFS-Climate Portal website. This email is automatically created and distributed, so please do not reply to this email.<br>';
		$messageDone .='</font>';
		$messageDone .='</td>';
		$messageDone .='';
		$messageDone .='</tr>';
		$messageDone .='</tbody></table>';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody></table>';
		$messageDone .='';
		$messageDone .='<table cellpadding="0" cellspacing="0" border="0" style="border:1px solid #ccc;width:800px;margin:0 auto">';
		$messageDone .='<tbody>';
		$messageDone .='<tr>';
		$messageDone .='<td bgcolor="#ffffff" valign="top">';
		$messageDone .='';
		$messageDone .='<table cellpadding="0" cellspacing="0" border="0" width="798">';
		$messageDone .='<tbody>';
		$messageDone .='<tr>';
		$messageDone .='<td bgcolor="#ffffff" align="left" valign="middle">';
		$messageDone .='<a href="http://ccafs-climate.org/" target="_blank"><img src="http://gisweb.ciat.cgiar.org/Bc_Downscale/header_mail.png" alt="CCAFS-Climate" width="600" hspace="0" vspace="0" border="0"></a>	</td>';
		$messageDone .='</tr>';
		$messageDone .='<tr>';
		$messageDone .='<td bgcolor="#ffffff" valign="top" align="center">';
		$messageDone .='<table width="100%" cellpadding="7" cellspacing="0" border="0">';
		$messageDone .='<tbody><tr>';
		$messageDone .='<td width="50" valign="middle" align="right" bgcolor="#81963E">';
		$messageDone .='<img src="https://ci5.googleusercontent.com/proxy/aCoCb9K2Dh7nqCYmIGwysSS30XdYk2VM8w2v11zLghnuAsvWWCFiGnyJRBGmgfKu7U8a-kR7F9kD882cMXy0YAlWczOpNaPSZR6QkY4x0UYSkbqdg4zl=s0-d-e1-ft#https://www.ncdc.noaa.gov/cdo-web/images/icons/cdo_mail_check.png" alt="Success" class="CToWUd">';
		$messageDone .='</td>';
		$messageDone .='<td valign="middle" bgcolor="#81963E">';
		$messageDone .='<div><b>Your data request is complete and ready to download</b></div>';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody></table>';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody>';
		$messageDone .='</table>';
		$messageDone .='<table cellpadding="0" cellspacing="0" border="0" width="798" bgcolor="#ffffff">';
		$messageDone .='<tbody>';
		$messageDone .='<tr>';
		$messageDone .='<td valign="top" align="left">';
		$messageDone .='<table width="568" cellpadding="3" cellspacing="0" border="0" style="margin:5px">';
		$messageDone .='<tbody>';
		$messageDone .='<tr>';
		$messageDone .='<td bgcolor="#cccccc" width="139">&nbsp;</td>';
		$messageDone .='<td bgcolor="#cccccc"><b>Order Summary</b></td>';
		$messageDone .='</tr>';
		$messageDone .='<tr>';
		$messageDone .='<td valign="top" align="right" width="139" style="color:#777777"><b>Order Number:</b></td>';
		$messageDone .='<td valign="top">619729</td>';
		$messageDone .='</tr>';
		$messageDone .='<tr>';
		$messageDone .='<td valign="top" align="right" width="139" style="color:#777777"><b>Order Status:</b></td>';
		$messageDone .='<td valign="top">Complete</td>';
		$messageDone .='</tr>';
		$messageDone .='<tr>';
		$messageDone .='<td valign="top" align="right" width="139" style="color:#777777"><b>Email Address:</b></td>';
		$messageDone .='<td valign="top"><a href="mailto:'.$to.'" target="_blank">'.$to.'</a></td>';$messageDone .='</tr>';
		$messageDone .='<tr></tr>';
		$messageDone .='<tr>';
		$messageDone .='<td valign="top" align="right" width="139" style="color:#777777"><b>Date Submitted:</b></td>';
		$messageDone .='<td valign="top">'.$Date_Submitted.'</td>';
		$messageDone .='</tr>';
		$messageDone .='<tr>';
		$messageDone .='<td valign="top" align="right" width="139" style="color:#777777"><b>Date Completed:</b></td>';
		$messageDone .='<td valign="top">'.$Date_Completed.'</td>';
		$messageDone .='</tr>';
		$messageDone .='<tr>';
		$messageDone .='<td bgcolor="#ffffff" width="139">&nbsp;</td>';
		$messageDone .='<td bgcolor="#ffffff"><b>Downloads</b></td>';
		$messageDone .='</tr>';
		$messageDone .='<tr>';
		$messageDone .='<td align="right" width="139" style="color:#777777;" valign="top"><b>Data:</b></td>';
		$messageDone .='<td bgcolor="#ffffff" align="left" valign="top">';
		$messageDone .='<a href="'.$files[0]['bc_processing'].'" id="anch_5">Download Data</a>';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody>';
		$messageDone .='</table>';
		$messageDone .='<table width="568" cellpadding="3" cellspacing="0" border="0" bgcolor="#ffffff" style="margin:5px">';
		$messageDone .='<tbody>';
		$messageDone .='<tr>';
		$messageDone .='<td bgcolor="#cccccc" width="139">&nbsp;</td>';
		$messageDone .='<td bgcolor="#cccccc"><b>Requested Data</b></td>';
		$messageDone .='</tr>';
		$messageDone .='<tr>';
		$messageDone .='<td align="right" width="139" style="color:#777777" valign="top"><b>Geographic location:</b></td>';
		$messageDone .='<td align="left" valign="top">lon: '.$lon.', lat: '.$lat.'<br></td>';
		$messageDone .='</tr>';
		$messageDone .='<tr></tr>';
		$messageDone .='<tr>';
		$messageDone .='<td align="right" width="139" style="color:#777777" valign="top"><b>GCM File Set:</b></td>';
		$messageDone .='<td align="left" valign="top">Raw GCM CMIP5 daily<br></td>';
		$messageDone .='</tr>';
		$messageDone .='<tr></tr>';
		// $messageDone .='<tr>';
		// $messageDone .='<td align="right" width="139" style="color:#777777" valign="top"><b>Period historical:</b></td>';
		// $messageDone .='<td align="left" valign="top">'.$Obyi.'-'.$Obyf.'<br>																														</td>';
		// $messageDone .='</tr>';
		// $messageDone .='<tr></tr>';
		// $messageDone .='<tr>';
		// $messageDone .='<td align="right" width="139" style="color:#777777" valign="top"><b>Period future:</b></td>';
		// $messageDone .='<td align="left" valign="top">'.$fuyi.'-'.$fuyf.'<br></td>';
		// $messageDone .='</tr>';
		$messageDone .='</tbody>';
		$messageDone .='</table>';
		$messageDone .='';
		$messageDone .='</td>';
		$messageDone .='<td width="220" bgcolor="#ffffff" valign="top" align="left"style="background-image:url('."'https://www.ncdc.noaa.gov/cdo-web/images/bg/bg_sidegradient.png'".');background-position:top left;background-repeat:repeat-y">';
		$messageDone .='';
		$messageDone .='<table style="padding:10px;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:25px">';
		$messageDone .='<tbody><tr>';
		$messageDone .='<td style="padding-left:0px"><span style="margin-bottom:10px;color:#5c6f26"><b>HELPFUL LINKS</b></span><br>';
		$messageDone .='<a href="http://ccafs-climate.org/" target="_blank">CCAFS-Climate website</a><br><br>';
		$messageDone .='<a href="http://ccafs-climate.org/documentation/" target="_blank">View Documentation</a><br><br>';
		$messageDone .='<a href="http://172.22.52.48/downloading_data/" target="_blank">Downloading data</a><br><br>';
		$messageDone .='<br>';
		$messageDone .='<span style="margin-bottom:10px;color:#5c6f26"><b>CCAFS-Climate</b></span><br>';
		$messageDone .='Data Provided by the CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS)<br>';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody></table>';
		$messageDone .='';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody>';
		$messageDone .='</table>';
		$messageDone .='';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody>';
		$messageDone .='</table>';
		$messageDone .='';
		$messageDone .='<table cellpadding="0" cellspacing="0" border="0" width="800">';
		$messageDone .='<tbody>';
		$messageDone .='<tr>';
		$messageDone .='<td valign="top" align="center" bgcolor="#f4f4f4">';
		$messageDone .='';
		$messageDone .='<table>';
		$messageDone .='<tbody><tr>';
		$messageDone .='<td align="center">';
		$messageDone .='<font size="1"><a href="https://ccafs.cgiar.org/" target="_blank">CCAFS</a> | <a href="https://ciat.cgiar.org/" target="_blank">CIAT Online</a> | <a href="http://ccafs-climate.org/" target="_blank">CCAFS-climate</a> | <a href="http://ccafs-climate.org/contact/" target="_blank">Contact Us</a></font>';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='<tr>';
		$messageDone .='<td align="center" valign="middle">';
		$messageDone .='<font size="1">';
		$messageDone .='<b>Mailing Address:</b> A.A. 6713 Cali, Colombia<br>';
		$messageDone .='<b>Phone:</b> +57 2 4450000';
		$messageDone .='</font>';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody></table>';
		$messageDone .='';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody>';
		$messageDone .='</table>';
		$messageDone .='';
		$messageDone .='</td>';
		$messageDone .='</tr>';
		$messageDone .='</tbody>';
		$messageDone .='</table><div class="yj6qo"></div><div class="adL">';
		$messageDone .='';
		$messageDone .='</div></div><div class="adL">';
		$messageDone .='</div></div></div></div>';
		$messageDone .='';
		$messageDone .='</body>';
		$messageDone .='</html>';	

		mail($to, $subject, $messageDone, $headers);	  
	  
    }
