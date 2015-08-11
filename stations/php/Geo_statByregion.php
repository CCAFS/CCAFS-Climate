<?php
	include_once('../config/db_ccafs_climate.php');
	
		
	if (isset($_REQUEST['country'])){$country = $_REQUEST["country"];}
	if (isset($_REQUEST['state'])){$state = $_REQUEST["state"];}
	if (isset($_REQUEST['municip'])){$municip = $_REQUEST["municip"];}
	if (isset($_REQUEST['type'])){$type = $_REQUEST["type"];}
	if (isset($_REQUEST['stdate'])){$stdate = date('Y-m-d',strtotime($_REQUEST["stdate"]));}
	if (isset($_REQUEST['endate'])){$endate = date('Y-m-d',strtotime($_REQUEST["endate"]));}
	if (isset($_REQUEST['path'])){$path = $_REQUEST["path"];}
	if (isset($_REQUEST['folder'])){$folder = $_REQUEST["folder"];}
	if (isset($_REQUEST['fileData'])){$fileData = $_REQUEST["fileData"];}
	if (isset($_REQUEST['variables'])){$var = $_REQUEST['variables'];}
	if (isset($_REQUEST['idstat'])){$idstat = $_REQUEST["idstat"];}
	if (isset($_REQUEST['radioCh'])){$radioCh = $_REQUEST["radioCh"];}
	if (isset($_REQUEST['getStat'])){$getStat = $_REQUEST["getStat"];}
	if (isset($_REQUEST['idCond'])){$idCond = $_REQUEST["idCond"];}
	$Cond = isset($_GET['condit']) ? $_GET['condit'] : '';
	if (isset($_REQUEST['children'])){$children = $_REQUEST["children"];}
	if(isset($_REQUEST['cadena'])){
		$cadena= implode(",",json_decode ($_REQUEST['cadena']));
	}
	
	$tableStation = "geostation";
	$admin = "gadm_lev2";
	
	// $country ="Colombia";
	// $state = "Cundinamarca";
	// $municip ="Tausa";
	// $type =3;

	// $stdate = "2000-01-01";
	// $endate ="2000-01-30";
	// $path	= 'C:\ms4w\Apache\htdocs\CIAT';
	// $folder = 'swat';
	
	
		
	// $sql =  "SELECT s.id,s.actual_name  from ".$tableStation." as s where st_intersects( ST_GeomFromText('$wkt',4326) , s.geom ); ";
	
if($type==1){
	if($country and $state and $municip){
		$sql =	"select st_asgeojson(l.geom)
			from ".$admin." as l
			where l.NAME_0='".$country."' and l.NAME_1='".$state."' and l.NAME_2='".$municip."';";	
			
		$sql_t =	"select ST_Extent(l.geom)
			from ".$admin." as l
			where l.NAME_0='".$country."' and l.NAME_1='".$state."' and l.NAME_2='".$municip."';";				
			
	
	}
	elseif($country and $state and !$municip){
		$sql =	"select st_asgeojson(l.geom)
			from gadm_lev1 as l
			where l.NAME_0='".$country."' and l.NAME_1='".$state."';";	
			
		$sql_t =	"select ST_Extent(l.geom)
			from gadm_lev1 as l
			where l.NAME_0='".$country."' and l.NAME_1='".$state."';";				
	
	}
	elseif($country and !$state and !$municip){
		$sql =	"select st_asgeojson(l.geom)
			from world_adm0 as l 
			where l.NAME='".$country."';";	
			
		$sql_t =	"select ST_Extent(l.geom)
			from world_adm0 as l 
			where l.NAME='".$country."';";			
	}
	
	$sqldata = pg_exec($dbcon, $sql_t);

	$extent = pg_fetch_result($sqldata, 0, 0);	

}
if($type==2 or $type==3){
	if($country and $state and $municip){
		$sql =	"select zv.id,zv.code,zv.name, st_asgeojson(zv.geom)
			from ".$admin." as l , ".$tableStation." as zv
			where st_intersects(zv.geom , l.geom) and l.NAME_0='".$country."' and l.NAME_1='".$state."' and l.NAME_2='".$municip."';";	
	
	}
	elseif($country and $state and !$municip){
		$sql =	"select zv.id,zv.code,zv.name,st_asgeojson(zv.geom)
			from ".$admin." as l , ".$tableStation." as zv
			where st_intersects(zv.geom , l.geom) and l.NAME_0='".$country."' and l.NAME_1='".$state."';";	
	
	}
	elseif($country and !$state and !$municip){
		$sql =	"select zv.id,zv.code,zv.name,st_asgeojson(zv.geom)
			from ".$admin." as l , ".$tableStation." as zv
			where st_intersects(zv.geom , l.geom) and l.NAME_0='".$country."';";	
	}
  
}

if($type==9){
	if($radioCh==1){
	$sql="select *,st_asgeojson(g.geom) from geostation as g where g.id=".intval($getStat).";";
	}
	if($radioCh==2){
	$sql="select *,st_asgeojson(g.geom) from geostation as g where g.name='".$getStat."';";
	}
}

	

if($type==4){
	$Geosql =	"select *,st_asgeojson(geom) from geostation;"; //,st_asgeojson(s.geom) 
  
	$result = pg_query($dbcon, $Geosql);

//	echo pg_numrows($result);
	
	$geojson = array(
					'type' => 'FeatureCollection',
					'features' => array()
				);
		
	$i = 0;	
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'geometry' => json_decode($line['st_asgeojson'],true),
						'properties' => $data[]=$line,
						'id' => $i++

					);
		array_push($geojson['features'],$feature);
	}
	
	$especie = json_encode($geojson);

	 echo $especie;	
}


if(isset($sql)){
	$result = pg_query($dbcon, $sql);
	$geojson = array(
					'type' => 'FeatureCollection',
					'features' => array()
				);
		
	$i = 0;
}

if($type==1){
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'geometry' => json_decode($line['st_asgeojson'],true),
						'properties' => $data[]=$line,
						'id' => $i++,
						'extend' => $extent
					);
		array_push($geojson['features'],$feature);
	}
	
	$especie = json_encode($geojson);

	echo $especie;	
}




if($type==3){
	// $sqlresult = pg_exec($dbcon, $sql);

		
	// if( pg_numrows($sqlresult) > 0)
	// {
		// $fields = pg_numrows($sqlresult);
		// $rows = pg_numfields($sqlresult);
		// for($a=0; $a<$fields;$a++)
		// {		
			// $res = pg_result($sqlresult,$a,0);
			
			// $cadena .= 's'.$res.' ';			
		// }	
		
	// }		
		
	$sql_d =  "SELECT download_data('$cadena','".$stdate."','".$endate."','".$path."','".$folder."','".$var."')";
	
	$sqldata = pg_exec($dbcon, $sql_d);


	$edge = pg_fetch_result($sqldata, 0, 0);
	
	if($edge){
		// echo $edge;	
		echo '<a href="'.$edge.'" download>Click here to download</a>';
	}else{echo 'Existe un error!';}	
	
	
}


if($type==5){

	if($country and $state and $municip){
		$sql_tabla = "select s.id,s.code,s.name, c.name category,i.name institute,s.instalation,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
					from gadm_lev2 as l , geostation as s, station_category as c, station_institute as i, station_status as t, station_time_step as a, station_type as p, 
					station_ctrl_quality as q, station_file as f
					where st_intersects(s.geom , l.geom) and s.category=c.id and s.institute=i.id and s.time_step=a.id and s.type=p.id and f.station_ctrl_quality_id=q.id and l.NAME_0='".$country."' and l.NAME_1='".$state."' and l.NAME_2='".$municip."'
					group by s.id, s.name, c.name,i.name,q.name,p.name,l.NAME_0,l.NAME_1,l.NAME_2";			
	}
	elseif($country and $state and !$municip){
		$sql_tabla = "select s.id,s.code,s.name, c.name category,i.name institute,s.instalation,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
					from gadm_lev2 as l , geostation as s, station_category as c, station_institute as i, station_status as t, station_time_step as a, station_type as p, 
					station_ctrl_quality as q, station_file as f
					where st_intersects(s.geom , l.geom) and s.category=c.id and s.institute=i.id and s.time_step=a.id and s.type=p.id and f.station_ctrl_quality_id=q.id and l.NAME_0='".$country."' and l.NAME_1='".$state."'
					group by s.id, s.name, c.name,i.name,q.name,p.name,l.NAME_0,l.NAME_1,l.NAME_2";
	}
	elseif($country and !$state and !$municip){
		$sql_tabla = "select s.id,s.code,s.name, c.name category,i.name institute,s.instalation,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
					from gadm_lev2 as l , geostation as s, station_category as c, station_institute as i, station_status as t, station_time_step as a, station_type as p, 
					station_ctrl_quality as q, station_file as f
					where st_intersects(s.geom , l.geom) and s.category=c.id and s.institute=i.id and s.time_step=a.id and s.type=p.id and f.station_ctrl_quality_id=q.id and l.NAME_0='".$country."'
					group by s.id, s.name, c.name,i.name,q.name,p.name,l.NAME_0,l.NAME_1,l.NAME_2";
	}
  

	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'id' => $line['id'],					
						'code' => $line['code'],
						'name' => $line['name'],
						'category' => $line['category'],
						'institute' => $line['institute'],
						'instalation' => $line['instalation'],
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
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  
  
	
}		

if($type==6){

	if($country and $state and $municip){
		$sql_tabla ="select s.id idstat, v.id idvar, v.name,v.acronym, f.date_start, f.date_end, f.age
		 from gadm_lev2 as l , geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) 
		where st_intersects(s.geom , l.geom) and l.NAME_0='".$country."' and l.NAME_1='".$state."' and l.NAME_2='".$municip."' and s.id=".$idstat."";			
	}
	elseif($country and $state and !$municip){
		$sql_tabla ="select s.id idstat, v.id idvar, v.name,v.acronym, f.date_start, f.date_end, f.age
		 from gadm_lev2 as l , geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) 
		where st_intersects(s.geom , l.geom) and l.NAME_0='".$country."' and l.NAME_1='".$state."' and s.id=".$idstat."";				
	}
	elseif($country and !$state and !$municip){
		$sql_tabla ="select s.id idstat, v.id idvar, v.name,v.acronym, f.date_start, f.date_end, f.age
		 from gadm_lev2 as l , geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) 
		where st_intersects(s.geom , l.geom) and l.NAME_0='".$country."' and s.id=".$idstat."";		
	}




	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'idstat' => $line['idstat'],
						'idvar' => $line['idvar'],
						'name' => $line['name'],
						'acronym' => $line['acronym'],
						'date_start' => $line['date_start'],
						'date_end' => $line['date_end'],
						'age' => $line['age'],
					);
				
		array_push($geojson['topics'],$feature);

		$i++;
	}

	$especie = json_encode($geojson);
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  
	
	
}

if($type==7){
// $sql_tabla ="select v.id, v.name, v.acronym from station_variable as v;";

	if($country and $state and $municip){
		$sql_tabla ="select v.id, v.name, v.acronym
		 from gadm_lev2 as l , geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) 
		where st_intersects(s.geom , l.geom) and l.NAME_0='".$country."' and l.NAME_1='".$state."' and l.NAME_2='".$municip."' group by v.id, v.name, v.acronym";			
	}
	elseif($country and $state and !$municip){
		$sql_tabla ="select v.id, v.name, v.acronym
		 from gadm_lev2 as l , geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) 
		where st_intersects(s.geom , l.geom) and l.NAME_0='".$country."' and l.NAME_1='".$state."' group by v.id, v.name, v.acronym";				
	}
	elseif($country and !$state and !$municip){
		$sql_tabla ="select v.id, v.name, v.acronym
		 from gadm_lev2 as l , geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) 
		where st_intersects(s.geom , l.geom) and l.NAME_0='".$country."' group by v.id, v.name, v.acronym";		
	}

	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'id' => $line['id'],
						'name' => $line['name'],
						'acronym' => $line['acronym']
					);
				
		array_push($geojson['topics'],$feature);

		$i++;
	}

	$especie = json_encode($geojson);
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  
}

if($type==8){

	$i = 0;
	if($radioCh==1){
		$sql_tabla ="select v.id as name,f.name as inst from geostation as v JOIN station_institute as f ON (f.id=v.institute);";	
		$result = pg_query($dbcon, $sql_tabla);


		$geojson = array(
						'totalCount' => pg_numrows($result),
						'topics' => array()
					);
		while($line = pg_fetch_assoc($result)){
			$feature = array(
							'name' => $line['name'],
							'inst' => $line['inst']
						);
			array_push($geojson['topics'],$feature);
			$i++;
		}		
	}else{
		$sql_tabla ="select v.id,v.name,f.name as inst from geostation as v JOIN station_institute as f ON (f.id=v.institute);";	
		$result = pg_query($dbcon, $sql_tabla);


		$geojson = array(
						'totalCount' => pg_numrows($result),
						'topics' => array()
					);
		while($line = pg_fetch_assoc($result)){
			$feature = array(
							'id' => $line['id'],
							'name' => $line['name'],
							'inst' => $line['inst']
						);
			array_push($geojson['topics'],$feature);
			$i++;
		}		
	}


	$especie = json_encode($geojson);
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  
}


if($type==10){

	if($radioCh==1){
		// $sql_tabla = "select s.id,s.code,s.name, c.name category,i.name institute,s.instalation,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,
		 // l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
		 // from gadm_lev2 as l, geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.id) JOIN station_status as t ON (t.id = s.status) 
				// JOIN station_type as p ON (p.id = s.type)  JOIN station_time_step as a ON (a.id = s.time_step) JOIN station_ctrl_quality as q ON (q.id = s.ctrl_quali)
				// JOIN station_category as c ON (c.id = s.category) JOIN station_institute as i ON (i.id = s.institute)
		// where s.id=".$getStat." and st_intersects(s.geom , l.geom)";	
		
$sql_tabla = "select s.id,s.code,s.name, c.name category,i.name institute,s.instalation,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
					from gadm_lev2 as l , geostation as s, station_category as c, station_institute as i, station_status as t, station_time_step as a, station_type as p, 
					station_ctrl_quality as q, station_file as f
					where s.id='".$getStat."' AND st_intersects(s.geom , l.geom) and s.category=c.id and s.institute=i.id and s.time_step=a.id and s.type=p.id and f.station_ctrl_quality_id=q.id and f.station_id=s.id
					group by s.id, s.name, c.name,i.name,q.name,p.name,l.NAME_0,l.NAME_1,l.NAME_2;";			
	}else{
		// $sql_tabla = "select s.id,s.code,s.name, c.name category,i.name institute,s.instalation,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,
		// l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
		 // from gadm_lev2 as l, geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.id) JOIN station_status as t ON (t.id = s.status) 
				// JOIN station_type as p ON (p.id = s.type)  JOIN station_time_step as a ON (a.id = s.time_step) JOIN station_ctrl_quality as q ON (q.id = s.ctrl_quali)
				// JOIN station_category as c ON (c.id = s.category) JOIN station_institute as i ON (i.id = s.institute)
		// where s.name='".$getStat."' and st_intersects(s.geom , l.geom);";	
		
$sql_tabla = "select s.id,s.code,s.name, c.name category,i.name institute,s.instalation,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
					from gadm_lev2 as l , geostation as s, station_category as c, station_institute as i, station_status as t, station_time_step as a, station_type as p, 
					station_ctrl_quality as q, station_file as f
					where s.name='".$getStat."' AND st_intersects(s.geom , l.geom) and s.category=c.id and s.institute=i.id and s.time_step=a.id and s.type=p.id and f.station_ctrl_quality_id=q.id and f.station_id=s.id
					group by s.id, s.name, c.name,i.name,q.name,p.name,l.NAME_0,l.NAME_1,l.NAME_2;";		
		
	}	  

	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'id' => $line['id'],					
						'code' => $line['code'],
						'name' => $line['name'],
						'category' => $line['category'],
						'institute' => $line['institute'],
						'instalation' => $line['instalation'],
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
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  
  
	
}	


if($type==11){

	if($radioCh==1){
	$sql_tabla ="select v.id, v.name, v.acronym
		 from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) 
		where s.id=".$getStat.";";		
	}else{
	$sql_tabla ="select v.id, v.name, v.acronym
		 from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) 
		where s.name='".$getStat."';";	
	}	

	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'id' => $line['id'],
						'name' => $line['name'],
						'acronym' => $line['acronym']
					);
				
		array_push($geojson['topics'],$feature);

		$i++;
	}

	$especie = json_encode($geojson);
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  
}

if($type==12){

	if($radioCh==1){
	$sql_tabla ="select s.id idstat, v.id idvar, v.name,v.acronym, f.date_start, f.date_end, f.age
			from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id)
		where s.id=".$getStat.";";		
	}else{
	$sql_tabla ="select s.id idstat, v.id idvar, v.name,v.acronym, f.date_start, f.date_end, f.age
			from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id)
		where s.name='".$getStat."';";	
	}


	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'idstat' => $line['idstat'],
						'idvar' => $line['idvar'],
						'name' => $line['name'],
						'acronym' => $line['acronym'],
						'date_start' => $line['date_start'],
						'date_end' => $line['date_end'],
						'age' => $line['age'],
					);
				
		array_push($geojson['topics'],$feature);

		$i++;
	}

	$especie = json_encode($geojson);
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  
	
	
}

if($type==13){
	// include_once('../../../config/db_config.php');

	$sql_tabla = "select id_0 as value, name_0 as label from gadm_lev1 group by value,label ORDER BY label ASC;";

	$i = 0;	

	$result = pg_query($dbcon, $sql_tabla);
	$num = pg_numrows($result);

	while ($row = pg_fetch_assoc($result)) {
	$categories["data"][$i] = $row;
	$i++;

	}

	echo json_encode($categories);
	
	
}
if($type==14){
	$whereStation = "";
	
	$statList=json_decode($_REQUEST["listStatSel"]);
	if (isset($statList) && $statList != "") {
	  $whereStation .= " AND s.id IN (" . implode(",",$statList).")";
	}	

	// $sql_tabla = "select s.id,s.code,s.name, c.name category,i.name institute,s.instalation,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,
	// l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
	 // from gadm_lev2 as l, geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.id) JOIN station_status as t ON (t.id = s.status) 
			// JOIN station_type as p ON (p.id = s.type)  JOIN station_time_step as a ON (a.id = s.time_step) JOIN station_ctrl_quality as q ON (q.id = s.ctrl_quali)
			// JOIN station_category as c ON (c.id = s.category) JOIN station_institute as i ON (i.id = s.institute)
	// where TRUE $whereStation and st_intersects(s.geom , l.geom);";	

$sql_tabla = "select s.id,s.code,s.name, c.name category,i.name institute,s.instalation,q.name quality,p.name model, s.variables, s.lon,s.lat,s.elev,l.NAME_0 country, l.NAME_1 state,l.NAME_2 city
					from gadm_lev2 as l , geostation as s, station_category as c, station_institute as i, station_status as t, station_time_step as a, station_type as p, 
					station_ctrl_quality as q, station_file as f
					where TRUE $whereStation AND st_intersects(s.geom , l.geom) and s.category=c.id and s.institute=i.id and s.time_step=a.id and s.type=p.id and f.station_ctrl_quality_id=q.id and f.station_id=s.id
					group by s.id, s.name, c.name,i.name,q.name,p.name,l.NAME_0,l.NAME_1,l.NAME_2;";
	

	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'id' => $line['id'],					
						'code' => $line['code'],
						'name' => $line['name'],
						'category' => $line['category'],
						'institute' => $line['institute'],
						'instalation' => $line['instalation'],
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
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  	
	
}
if($type==15){

	$whereStation = "";
	
	$statList=json_decode($_REQUEST["listStatSel"]);
	if (isset($statList) && $statList != "") {
	  $whereStation .= " AND s.id IN (" . implode(",",$statList).")";
	}	
	
	
	$sql_tabla ="select v.id, v.name, v.acronym
		 from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) 
		where TRUE $whereStation;";	


	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'id' => $line['id'],
						'name' => $line['name'],
						'acronym' => $line['acronym']
					);
				
		array_push($geojson['topics'],$feature);

		$i++;
	}

	$especie = json_encode($geojson);
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  
}

if($type==16){
	$sql_tabla ="select column_name from information_schema.columns where table_name='geostation'";

	$result = pg_query($dbcon, $sql_tabla);
	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
			"name" => $line["column_name"]
						// "age" => ine["age"],
						// "category" => ine["category"],
						// "city"     => ine["city"],
						// "code"     => ine["code"],
						// "copyrigth"   => ine["copyrigth"],
						// "country"  => ine["country"],
						// "ctrl_quali"  => ine["ctrl_quali"],
						// "date_end" => ine["date_end"],
						// "date_start"  => ine["date_start"],
						// "elev"     => ine["elev"],
						// "geom"     => ine["geom"],
						// "id"  => ine["id"],
						// "instalation" => ine["instalation"],
						// "institute"   => ine["institute"],
						// "lat" => ine["lat"],
						// "lat_dec"  => ine["lat_dec"],
						// "lon" => ine["lon"],
						// "lon_dec"  => ine["lon_dec"],
						// "name"     => ine["name"],
						// "state"    => ine["state"],
						// "status"   => ine["status"],
						// "suspension"  => ine["suspension"],
						// "time_step"   => ine["time_step"],
						// "type"     => ine["type"],
						// "url_online"  => ine["url_online"],
						// "variable" => ine["variable"],
						// "variables"   => ine["variables"

					);
				
		array_push($geojson['topics'],$feature);

		$i++;
	}
	$especie = json_encode($geojson);
	pg_close($dbcon);
	header('Content-type: application/json',true);
	echo $especie;  
}

if($type==17){

	$sql_tabla ="select s.id idstat, v.id idvar, v.name,v.acronym, f.date_start, f.date_end, f.age
			from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id)
		where s.id=".$idstat.";";		



	$result = pg_query($dbcon, $sql_tabla);


	$geojson = array(
					'totalCount' => pg_numrows($result),
					'topics' => array()
				);
	
	$i = 0;
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'idstat' => $line['idstat'],
						'idvar' => $line['idvar'],
						'name' => $line['name'],
						'acronym' => $line['acronym'],
						'date_start' => $line['date_start'],
						'date_end' => $line['date_end'],
						'age' => $line['age'],
					);
				
		array_push($geojson['topics'],$feature);

		$i++;
	}

	$especie = json_encode($geojson);
	
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie;  
	
	
}

if($type==18){

	if($idCond==2){ // Variables
		// $sql_tabla ="SELECT id, name,acronym FROM station_variable;";	
		$sql_tabla ="select v.id, v.acronym as name from geostation as s JOIN station_file as f ON (f.station_id=s.id) JOIN station_variable as v ON (v.id = f.station_variable_id) group by v.id;";	
	}
	if($idCond==3){ // status
		$sql_tabla ="SELECT id, name FROM station_status;";	
	}
	if($idCond==6){ // Institute
		$sql_tabla ="SELECT id, name FROM station_institute;";	
	}
	if($idCond==7){ // Quality
		$sql_tabla ="SELECT id, name FROM station_ctrl_quality;";	
	}
	if($idCond==8){ // Category
		$sql_tabla ="SELECT id, name FROM station_category;";	
	}
	if($idCond==9){ // Model
		$sql_tabla ="SELECT id, name FROM station_type;";	
	}
	if($idCond==10){ // Country
		$sql_tabla ="SELECT id_0 as id, name_0 as name FROM gadm_lev1 group by id_0,name_0 order by name_0 ASC;";	
	}
	if($idCond==11){ // State
		$sql_tabla ="SELECT id_1 as id, name_1 as name FROM gadm_lev1 group by id_1,name_1 order by name_1 ASC;";	
	}
	if($idCond==11){ // Municipality
		$sql_tabla ="SELECT id_2 as id, name_2 as name FROM gadm_lev2 group by id_2,name_2 order by name_2 ASC;";	
	}
	if($idCond==12){ // timespet
		$sql_tabla ="SELECT id, name FROM station_time_step;";	
	}
	
	if($idCond!=1 && $idCond!=2 && $idCond!=4 && $idCond!=5){
		$result = pg_query($dbcon, $sql_tabla);
		$geojson = array(
						'totalCount' => pg_numrows($result),
						'topics' => array()
					);
		
		$i = 0;
		while($line = pg_fetch_assoc($result)){
			$feature = array(
							'id' => $line['id'],
							'name' => $line['name']
						);
					
			array_push($geojson['topics'],$feature);

			$i++;
		}	
 
	}elseif ($idCond==2) {
		$result = pg_query($dbcon, $sql_tabla);


		$geojson = array(
						'totalCount' => pg_numrows($result),
						'topics' => array()
					);
		
		$i = 0;
		while($line = pg_fetch_assoc($result)){
			$feature = array(
							'id' => $line['id'],
							'name' => $line['name'],
							// 'acronym' => $line['acronym']

						);
					
			array_push($geojson['topics'],$feature);

			$i++;
		}

	}else{
		$geojson = array(
						'totalCount' => null,
						'topics' => array()
					);
		$feature = array(
						'id' => null,
						'name' => null
					);
		array_push($geojson['topics'],$feature);
	
	}
	
	$especie = json_encode($geojson);
	pg_close($dbcon);
	header('Content-type: application/json',true);
	
	echo $especie; 	
	
}

if($type==19){
	$statList=json_decode($children);
	$xc= array_chunk($statList, 3);
	if($Cond=="any"){$typeCon="or";}
	if($Cond=="all"){$typeCon="and";}
	
	$sqltemp=array();
	for ($i = 0; $i <= count($xc) - 1; $i++) {
			if($xc[$i][0]==3){
				array_push($sqltemp,"st.id".$xc[$i][1]." ".$xc[$i][2]);
			}
			if($xc[$i][0]==6){
				array_push($sqltemp,"i.id".$xc[$i][1]." ".$xc[$i][2]);
			}		
			if($xc[$i][0]==1){
				array_push($sqltemp,"f.age".$xc[$i][1]." ".$xc[$i][2]);
			}
			if($xc[$i][0]==2){
				array_push($sqltemp,"v.id".$xc[$i][1]." ".$xc[$i][2]);
			}	
			if($xc[$i][0]==4){
				array_push($sqltemp,"s.elev".$xc[$i][1]." ".$xc[$i][2]);
			}		
			if($xc[$i][0]==7){
				array_push($sqltemp,"q.id".$xc[$i][1]." ".$xc[$i][2]);
			}		
			if($xc[$i][0]==8){
				array_push($sqltemp,"c.id".$xc[$i][1]." ".$xc[$i][2]);
			}
			if($xc[$i][0]==9){
				array_push($sqltemp,"t.id".$xc[$i][1]." ".$xc[$i][2]);
			}
			if($xc[$i][0]==10){
				array_push($sqltemp,"s.country".$xc[$i][1]." ".$xc[$i][2]);
			}		
			if($xc[$i][0]==11){
				array_push($sqltemp,"s.state".$xc[$i][1]." ".$xc[$i][2]);
			}
			if($xc[$i][0]==12){
				array_push($sqltemp,"s.city".$xc[$i][1]." ".$xc[$i][2]);
			}		
	}
	
	$sql_tabla1="SELECT s.id,st_asgeojson(s.geom) FROM station_file as f JOIN geostation as s ON (f.station_id=s.id) JOIN station_status as st ON (s.status=st.id)".
	"JOIN station_institute as i ON (s.institute=i.id) JOIN station_variable as v ON (f.station_variable_id=v.id)".
	"JOIN station_time_step as a ON (f.station_time_step_id=a.id) JOIN station_ctrl_quality as q ON (f.station_ctrl_quality_id=q.id)".
	"JOIN station_category as c ON (s.category=c.id) JOIN station_type as t ON (s.type=t.id) where ".implode(" ".$typeCon." ",$sqltemp).' group by s.id;';
	
	$result = pg_query($dbcon, $sql_tabla1);
	$geojson = array(
					'type' => 'FeatureCollection',
					'features' => array()
				);
		
	$i = 0;


}

if($type==20){
	if($idCond==1 || $idCond==4){ // Variables
		$feature = 	array("topics:",
			array("id"=>"1","name"=> '='),
			array("id"=>"2","name"=> '>'),
			array("id"=>"3","name"=> '<'),
			array("id"=>"4","name"=> '>='), 
			array("id"=>"5","name"=> '>=')
		);			
	}else{
		$feature = 	array("topics:",
			array("id"=>"1","name"=> '='),
		);	
	}
	$especie = json_encode($feature);
	header('Content-type: application/json',true);
	echo $especie; 	

}

if($type==21){
	$whereStation = "";
	
	$statList=json_decode($_REQUEST["listStatSel"]);


	if (isset($statList) && $statList != "") {
		if(count($statList)==1){
			$whereStation .= " AND s.id IN (" .$statList.")";
		}else{
			$whereStation .= " AND s.id IN (" . implode(",",$statList).")";
		}
	}	
	
	$sql ="select *, st_asgeojson(s.geom)
		 from geostation as s
		where TRUE $whereStation;";	

	$result = pg_query($dbcon, $sql);
	$geojson = array(
					'type' => 'FeatureCollection',
					'features' => array()
				);
		
	$i = 0;	
	
}


if($type==2 or $type==9  or $type==19 or $type==21){
	while($line = pg_fetch_assoc($result)){
		$feature = array(
						'geometry' => json_decode($line['st_asgeojson'],true),
						'properties' => $data[]=$line,
						'id' => $i++

					);
		array_push($geojson['features'],$feature);
	}
	
	$especie = json_encode($geojson);

	echo $especie;		
	
}



?>