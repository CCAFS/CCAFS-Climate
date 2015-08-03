<?php
	include_once('../config/db_ccafs_climate.php');

  // define("PG_DB"  , "stations");
  // define("PG_HOST", "172.22.52.48"); 
  // define("PG_USER", "postgres");
  // define("PG_PASS", "gistations*2014");
  // define("PG_PORT", "5432"); 
  // define("SRID",   "4326"); 

// $dbcon = pg_connect("dbname=".PG_DB." host=".PG_HOST." user=".PG_USER." password=".PG_PASS." port=".PG_PORT);
 // pg_query($dbcon, 'SET search_path TO schema_data');	
 
	$country = $_REQUEST["country"];
	$state = $_REQUEST["state"];
	$municip = $_REQUEST["municip"];
	$type = $_REQUEST["type"];

	
	// $country ="Colombia";
	// $state = "Cundinamarca";
	// $municip ="Tausa";
	
  
	if($country and $state and $municip){
		$sqlTemp =	"select zv.idsta, l.NAME_0, l.NAME_1,l.NAME_2
			from gadm_v1_lev2 as l , stations as zv
			where st_intersects(zv.geom , l.geom) and l.NAME_0='".$country."' and l.NAME_1='".$state."' and l.NAME_2='".$municip."'";

		$sql_tabla = "SELECT * from viewGridWater($$
			".$sqlTemp."
			$$,'2') as (idsta character varying, name character varying, min character varying, max character varying,var character varying,name_0 character varying,name_1 character varying,name_2 character varying);";
	}
	elseif($country and $state and !$municip){
		$sqlTemp =	"select zv.idsta, l.NAME_0, l.NAME_1,l.NAME_2
			from gadm_v1_lev2 as l , stations as zv
			where st_intersects(zv.geom , l.geom) and l.NAME_0='".$country."' and l.NAME_1='".$state."'";	

		$sql_tabla = "SELECT * from viewGridWater($$
			".$sqlTemp."
			$$,'2') as (idsta character varying, name character varying, min character varying, max character varying,var character varying,name_0 character varying,name_1 character varying,name_2 character varying);";

			
	}
	elseif($country and !$state and !$municip){
		$sqlTemp =	"select zv.idsta, l.NAME_0, l.NAME_1,l.NAME_2
			from gadm_v1_lev2 as l , stations as zv
			where st_intersects(zv.geom , l.geom) and l.NAME_0='".$country."'";	
			
		$sql_tabla = "SELECT * from viewGridWater($$
			".$sqlTemp."
			$$,'2') as (idsta character varying, name character varying, min character varying, max character varying,var character varying,name_0 character varying,name_1 character varying,name_2 character varying);";
			
	}
  
  
 	$result1 = pg_query($dbcon, $sqlTemp);
	if(pg_numrows($result1)){
		 
		$result = pg_query($dbcon, $sql_tabla);


		$geojson = array(
						'totalCount' => pg_numrows($result),
						'topics' => array()
					);
		
		$i = 0;
		while($line = pg_fetch_assoc($result)){
			$feature = array(
							'id' => $i+1,					
							'idsta' => $line['idsta'],
							'name' => $line['name'],
							'min' => $line['min'],
							'max' => $line['max'],
							'var' => $line['var'],
							'name_0' => $line['name_0'],
							'name_1' => $line['name_1'],
							'name_2' => $line['name_2'],
		
							
						);
					
			array_push($geojson['topics'],$feature);

			$i++;
		}

		$especie = json_encode($geojson);
		
		pg_close($dbcon);
		header('Content-type: application/json',true);
		
		echo $especie;  
  
	}


?>