<?php

require_once '../../config/db.php';

$lat = isset($_POST["lat"]) ? $_POST["lat"] : null;
$lon = isset($_POST["lon"]) ? $_POST["lon"] : null;

global $db;
$query = "SELECT DISTINCT name from world_adm0 as w where ST_Intersects(ST_GeomFromText('POINT(".$lon." ".$lat.")',4326), w.geom)";
$result = $db->GetRow($query);

echo count($result);


?>
