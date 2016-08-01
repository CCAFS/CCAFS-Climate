<?php

	include_once('../config/db_ccafs_climate.php');
    $start = (integer) (isset($_REQUEST['start']) ? $_REQUEST['start'] : $_REQUEST['start']);
    $end = (integer) (isset($_REQUEST['limit']) ? $_REQUEST['limit'] : $_REQUEST['limit']);  
	if (isset($_REQUEST['query'])){$query = $_REQUEST["query"];}
//## para usar paging.js	
$sort = (isset($_POST['sort']) ? $_POST['sort'] : $_GET['sort']);
$dir = (isset($_POST['dir']) ? $_POST['dir'] : $_GET['dir']);
//## para usar paging.js	
$sql_count ="select DISTINCT s.id, s.code,s.name, c.name category,i.name institute,s.instalation,s.suspension,s.access_level,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,cop.name copyright,l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
					,s.ctrl_quali_var from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_status as t ON (t.id = s.status)
					JOIN station_type as p ON (p.id = s.type)  JOIN station_time_step as a ON (a.id = s.time_step) JOIN station_ctrl_quality as q ON (q.id = s.ctrl_quali)
					JOIN station_category as c ON (c.id = s.category) JOIN station_institute as i ON (i.id = s.institute) JOIN station_copyright as cop ON (s.copyrigth=cop.id)	
					JOIN gadm_lev2 as l ON (l.id_2=s.city)	
					where l.NAME_0='Colombia' ORDER BY ". $sort .' '. $dir; 	


if (isset($_REQUEST['query'])){
// $sql_count ="select DISTINCT s.id, s.code,s.name, c.name category,i.name institute,s.instalation,s.suspension,s.access_level,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,cop.name copyright,l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
					// ,s.ctrl_quali_var from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_status as t ON (t.id = s.status)
					// JOIN station_type as p ON (p.id = s.type)  JOIN station_time_step as a ON (a.id = s.time_step) JOIN station_ctrl_quality as q ON (q.id = s.ctrl_quali)
					// JOIN station_category as c ON (c.id = s.category) JOIN station_institute as i ON (i.id = s.institute) JOIN station_copyright as cop ON (s.copyrigth=cop.id)	
					// JOIN gadm_lev2 as l ON (l.id_2=s.city)	
					// where l.NAME_0='Colombia' and s.code ILIKE '%".$query."%' or s.name ILIKE '%".$query."%' or c.name ILIKE '%".$query."%' or i.name ILIKE '%".$query."%' or q.name ILIKE '%".$query."%' or p.name ILIKE '%".$query."%' or  s.variables ILIKE '%".$query."%' or  s.lon ILIKE '%".$query."%' or s.lat ILIKE '%".$query."%' or cop.name ILIKE '%".$query."%' or l.NAME_0 ILIKE '%".$query."%' or  l.NAME_1 ILIKE '%".$query."%' or l.NAME_2 ILIKE '%".$query."%' or s.ctrl_quali_var ILIKE '%".$query."%'";	
	
	
}else{
$sql_count ="select DISTINCT s.id, s.code,s.name, c.name category,i.name institute,s.instalation,s.suspension,s.access_level,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,cop.name copyright,l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
					,s.ctrl_quali_var from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_status as t ON (t.id = s.status)
					JOIN station_type as p ON (p.id = s.type)  JOIN station_time_step as a ON (a.id = s.time_step) JOIN station_ctrl_quality as q ON (q.id = s.ctrl_quali)
					JOIN station_category as c ON (c.id = s.category) JOIN station_institute as i ON (i.id = s.institute) JOIN station_copyright as cop ON (s.copyrigth=cop.id)	
					JOIN gadm_lev2 as l ON (l.id_2=s.city)	
					where l.NAME_0='Colombia'"; 	
	
}					
					
					
$sql_tabla =$sql_count .' LIMIT ' . $end . ' offset '. $start.";";
					
// print_r($sql_tabla );					
	$result_count = pg_query($dbcon, $sql_count);
	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => (string)pg_numrows($result_count),
					'topics' => array());
					
		$i = 0;			
	while($line = pg_fetch_assoc($result)){
		
		$feature = array(
						'id' => $line['id'],					
						'code' => $line['code'],
						'name' => $line['name'],
						'category' => $line['category'],
						'institute' => $line['institute'],
						'instalation' => $line['instalation'],
						'suspension' => $line['suspension'],
						'ctrl_quali_var' => $line['ctrl_quali_var'],
						'quality' => $line['quality'],
						'model' => $line['model'],
						'variables' => $line['variables'],
						'lon' => $line['lon'],
						'lat' => $line['lat'],
						'elev' => $line['elev'],
						'country' => $line['country'],
						'state' => $line['state'],
						'city' => $line['city']
				
					);
				
			array_push($geojson['topics'],$feature);

			$i++;
		}

		$especie = json_encode($geojson);


		
// $callback = $_GET['callback'];
		
pg_close($dbcon);

// if ($callback) {
    // header('Content-Type: text/javascript');
    // echo $callback . '(' . $especie . ');';
// } else {
    // header('Content-Type: application/x-json');
    // echo $especie;
// }
		header('Content-type: application/json',true);
		echo $especie;  		
		
