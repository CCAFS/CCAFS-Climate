<?php
  define("PG_DB"  , "ccafs_climate");
  // define("PG_DB"  , "stations");
  define("PG_HOST", "localhost"); 
  define("PG_USER", "postgres");
  define("PG_PASS", "bNs2IJ0L6i4h");
  define("PG_PORT", "5432"); 
  define("SRID",   "4326"); 
  
  define("DB_SERVER", "localhost");
define("DB_NAME", "ccafs_climate");
define ("DB_USER", "postgres");
define ("DB_PASSWORD", "bNs2IJ0L6i4h");
  
  $dbcon = pg_connect("dbname=".PG_DB." host=".PG_HOST." user=".PG_USER." password=".PG_PASS." port=".PG_PORT);
  
	if(!$dbcon){
		echo "Error : Unable to open databasex\n";
	}
   
  $dirfilesStations = $_SERVER["DOCUMENT_ROOT"]."/downloads";
  
  
?>