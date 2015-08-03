<?php
	include_once('../../../config/db_config.php');

  // define("PG_DB"  , "stations");
  // define("PG_HOST", "172.22.52.48"); 
  // define("PG_USER", "postgres");
  // define("PG_PASS", "gistations*2014");
  // define("PG_PORT", "5432"); 
  // define("SRID",   "4326"); 

// $dbcon = pg_connect("dbname=".PG_DB." host=".PG_HOST." user=".PG_USER." password=".PG_PASS." port=".PG_PORT);
// pg_query($dbcon, 'SET search_path TO schema_data');

	$stdate = $_REQUEST['id'];
	
// $id=1;
	
	$sql_tabla = "select id_1 as value, name_1 as label from gadm_v1_lev2 where name_0 = '".$stdate."' group by name_1,id_1 order by name_1 ASC;";

	
	

	
  $i = 0;	


 $result = pg_query($dbcon, $sql_tabla);
  $num = pg_numrows($result);
  

  
  while ($row = pg_fetch_assoc($result)) {
    $categories["data"][$i] = $row;
    $i++;

  }

  echo json_encode($categories);
	

// $countries = array('Argentina','España','México','Perú','United States');
// $states = array(
	// array('Buenos Aires','Córdoba','Rosario','Mendoza','Santa Fe'),
	// array('Madrid','Valencia','Barcelona','Pamplona'),
	// array('Distrito Federal','Monterrey','Guadalajara'),
	// array('La Victoria','Piura','Surco','Lima'),
	// array('Texas','California','New york','Virginia')
// );

// $id = isset($_POST['id'])?$_POST['id']:-1;
	
// if($id > -1){

	// echo toJSON($states[$id]);
// }else{

	// echo toJSON($countries);
// }

// function toJSON($array){
	// $data=array(); $i=0;
	// $total = count($array);
	// foreach($array as $key=>$value){
		// array_push($data,array(
			// 'value'=>$i++,
			// 'label'=>$value
		// ));
	// }
	
	// return json_encode(array(
		///////////////'total'=>$total,
		// 'data'=>$data
	// ));
// }
	
	
?>