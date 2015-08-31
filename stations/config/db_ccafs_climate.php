<?php
  define("PG_DB"  , "ccafs_climate");
  // define("PG_DB"  , "stations");
  define("PG_HOST", "172.22.52.48"); 
  define("PG_USER", "postgres");
  define("PG_PASS", "gistations*2014");
  define("PG_PORT", "5432"); 
  define("SRID",   "4326"); 
 
define("DB_SERVER", "172.22.52.48");
define("DB_NAME", "ccafs_climate");
define ("DB_USER", "postgres");
define ("DB_PASSWORD", "gistations*2014");

 
  $dbcon = pg_connect("dbname=".PG_DB." host=".PG_HOST." user=".PG_USER." password=".PG_PASS." port=".PG_PORT);
  
	if(!$dbcon){
		echo "Error : Unable to open database\n";
	}
   
  $dirfilesStations = $_SERVER["DOCUMENT_ROOT"]."/downloads";
  
  
?>