<?php
  error_reporting(E_ALL | E_STRICT);
  ini_set('display_errors', 'On');
  define("PG_DB"  , "postgres");
  // define("PG_DB"  , "stations");
  define("PG_HOST", "localhost"); 
  define("PG_USER", "postgres");
  define("PG_PASS", "123456");
//  define("PG_PORT", "5432"); 
//  define("SRID",   "4326");
  
//  $_REQUEST['lon'];
//  $_REQUEST['lat'];
//  $_REQUEST['fileSet'];
//  $_REQUEST['scenarios'];
//  $_REQUEST['model'];
//  $_REQUEST['variables'];
//  $_REQUEST['method'];
//  $_REQUEST['format'];
//  $_REQUEST['period'];
//  $_REQUEST['observation'];
  
  
  $dbcon = pg_connect("dbname=".PG_DB." host=".PG_HOST." user=".PG_USER." password=".PG_PASS);
  
  if(!$dbcon){
    echo "Error : Unable to open database\n";
    exit;
  } else {
    echo "success\n";
  }
   
  $dirfilesStations = $_SERVER["DOCUMENT_ROOT"]."/downloads";
  
//  $sql ="select plr_array('hello','world');";
  $sql ="SELECT * from test_processing('station','/tmp');";
   $ret = pg_query($dbcon, $sql);
   if(!$ret){
      // echo pg_last_error($db);
      exit;
   } 
   
   $files = pg_fetch_all($ret);
   // echo "Operation done successfully\n";
   pg_close($dbcon);
   
//   echo "<pre>CCC".print_r($files,true)."</pre>";
?>
