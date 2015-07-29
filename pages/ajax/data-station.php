<?php

require_once '../../config/db.php';
global $db;
$stationsCount = $_REQUEST["stations-count"];
$error = false;

for ($i = 0; $i < $stationsCount; $i++) {
  $code = $_REQUEST["code$i"];
  $cat = $_REQUEST["cat$i"];
  $type = $_REQUEST["type$i"];
  $name = $_REQUEST["name$i"];
  $lon = $_REQUEST["lon$i"];
  $lat = $_REQUEST["lat$i"];
  $elev = $_REQUEST["elev$i"];
  $ins = $_REQUEST["ins$i"];
  $url = $_REQUEST["url$i"];
  $date = $_REQUEST["date$i"];
  $vars = $_REQUEST["vars$i"];
  if ($code != '') {
    $query = "select l.id_0 country, l.id_1 state,l.id_2 city from gadm_lev2_sel as l where st_intersects(st_setsrid(ST_MakePoint($lon,$lat),4326) , l.geom);";
    $location = $db->GetRow($query);
    $query = "INSERT INTO geostation (code, category, name, country, state, city, elev, lon_dec, lat_dec, institute, time_step, copyrigth, ctrl_quali, type, status, url_online, geom, instalation, variables) VALUES "
            . "(" . $code . ", " . $cat . ", '" . $name . "', " . $location['country'] . ", " . $location['state'] . ", " . $location['city'] . ", " . $elev . ", " . $lon . ", " . $lat . ", " . $ins . ", 2, 1, 1, " . $type . ", 1, '" . $url . "', ST_GeomFromText('POINT($lon $lat)', 4326), to_date('$date', 'YYYY-MM-DD'), '" . $vars . "')";
    if (!$db->Execute($query)) {
      $error = true;
    }
  }
}

if ($error) {
  echo '0';
} else {
  echo '1';
}

