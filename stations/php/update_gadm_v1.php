<?php
 // quita las tildes
// create or replace function sinacentos (text) returns text AS $$
   // select translate($1,'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜ','aeiouAEIOUaeiouAEIOU');
// $$ language sql;

include_once('../config/db_ccafs_climate.php');

#$sql =	"select id_1, name_1 from gadm_lev2";
$sql =	"select id_2, name_2 from gadm_lev2";
set_time_limit(10000);
$result = pg_query($dbcon, $sql);


for ($j = 0; $j < pg_num_rows($result); ++$j) {
	$id=pg_fetch_result($result, $j, 0);
	$name=pg_fetch_result($result, $j, 1); 
	
	
	$sql2 ="select * from sinacentos('$name')";
	$result2 = pg_query($dbcon, $sql2);
	$new_name = pg_fetch_result($result2, 0, 0); 
	
	$sql3 ="UPDATE gadm_lev2 SET name_2='".$new_name."' WHERE id_2=$id;";
	$result3 = pg_query($dbcon, $sql3);
	
	// echo $new_name;
	// echo "<br>";	
	echo "done";	
	
}

