<?php
	include_once('../config/db_ccafs_climate.php');
	
	if (isset($_REQUEST['countryID'])){$country = $_REQUEST["countryID"];}
	if (isset($_REQUEST['stateID'])){$state = $_REQUEST["stateID"];}
	if (isset($_REQUEST['type'])){$type = $_REQUEST["type"];}
	
	
	if($type==2){
		$sql_tabla = "select id_2 as value, name_2 as label from gadm_lev2 where id_0 = '".$country."' and id_1 = '".$state."' group by name_2,id_2 order by name_2 ASC;";
	}else{
		$sql_tabla = "select id_1 as value, name_1 as label from gadm_lev2 where id_0 = '".$country."' group by name_1,id_1 order by name_1 ASC;";
	}

	$i = 0;	

	$result = pg_query($dbcon, $sql_tabla);
	$num = pg_numrows($result);



	while ($row = pg_fetch_assoc($result)) {
		$categories["data"][$i] = $row;
		$i++;
	}

	echo json_encode($categories);
	

	
?>