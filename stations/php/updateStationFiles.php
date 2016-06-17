<?php
	include_once('../config/db_ccafs_climate.php');
	if(!$dbcon){
      echo "Error : Unable to open database\n";
   } else {
	  //echo "Opened database successfully\n";
   }
	//echo $dirfilesStations."<br>";
	$files = listFolderFiles(array(), $dirfilesStations."/data_stations");
	$files = validfile ($dbcon,$files);
	$out = $files;
	readFiles($dbcon,$files);
	echo "<pre>".print_r($out,true)."</pre>";
	
	function readFiles ($dbcon,$files) {
		$ouput = array();
		//$myfile = fopen( $files['dir'] . "/" . $files['name'], "r") or die("Unable to open file!"); //realpath(dirname(__FILE__))
		foreach ($files as $file) {
			$myfile = file( $file['dir'] . "/" . $file['name']);
			$start = explode("\t", $myfile[1]);
			$start = substr($start[0], 0, 4)."-".substr($start[0], 4, 2)."-".substr($start[0], 6, 2);
			$end   = explode("\t", $myfile[count($myfile)-1]);
			$end   = substr($end[0], 0, 4)."-".substr($end[0], 4, 2)."-".substr($end[0], 6, 2);
			$datetime1 = strtotime($start);
			$datetime2 = strtotime($end);

			$secs = $datetime2 - $datetime1;// == <seconds between the two times>
			$days = floor(($secs / 86400)/365);
			$name = explode('_',$file['name']);
			//echo str_replace(".txt","",$name[5])."<br>";
			$var = getVarID ($dbcon,str_replace(".txt","",$name[5]));
			$url = explode('downloads',$file['dir']);
			$sql = "INSERT INTO station_file (date_start, date_end, age, file_name, local_url, station_id, station_variable_id, station_time_step_id, station_ctrl_quality_id) 
			VALUES ('".$start."','".$end."',".$days.",'".$file['name']."','".$url[1]."', ".$name[0].", ".$var.", 2, 2)";
			
			//echo $sql;
			$sqldata = pg_query($dbcon, $sql);
			if (pg_num_rows($sqldata)) {
				//echo "File successfully added!<br/>";
			} else {
				//echo "File not added! :(<br/>";
			}
		}
		//$line = fgets($myfile);
		//$i = 0;
		/*while (!feof($myfile) && $i < 2000) {
			$line = fgets($myfile);
			$line = explode("\t", $line);
		}*/
	}
	
	function getVarID ($dbcon,$acronym) {
		$sql_t =	"select id
				from station_variable
				where acronym='".$acronym."'";		
			$sqldata = pg_query($dbcon, $sql_t);
			$id = pg_fetch_row($sqldata);
		return $id[0];
	}
	
	function validfile ($dbcon,$files) {
		foreach ($files as $key => $file) {
			$sql_t =	"select id
				from station_file as l
				where l.file_name='".$file['name']."'";		
			$sqldata = pg_query($dbcon, $sql_t);
			$id = pg_fetch_row($sqldata);
			if ($id) unset($files[$key]);
		}
		return $files;
	}
	
	function listFolderFiles($arr,$dir){
		$ffs = scandir($dir);
		foreach($ffs as $ff){
			if($ff != '.' && $ff != '..'){
				if(is_dir($dir.'/'.$ff)) { 
					$arr = array_merge($arr,listFolderFiles(array(), $dir.'/'.$ff));
				} else {
					$arr[] = array('name'=>$ff,'dir'=>$dir);
				}
			}
		}
		return $arr;
	}

	