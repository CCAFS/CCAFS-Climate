<?php

require_once '../../config/db.php';
require_once '../../config/smarty.php';

global $db;
$where = "";
$result = array();

$query = "SELECT * FROM station WHERE TRUE $where";
//echo $query;
$stations = $db->getAll($query);
echo '{ "type": "FeatureCollection",
          "features": [';
foreach ($stations as $key => $station) {
  echo '
             { "type": "Feature",
              "id": "' . $station['id'] . '",
              "geometry": {"type": "Point", "coordinates": [' . $station['lat_dec'] . ', ' . $station['lon_dec'] . ']},
              "properties": {
                 ';
  echo '"code":"' . $station['code'] . '", '
  . '"name":"' . $station['name'] . '", '
  . '"elev":"' . $station['elev'] . '", '
  . '"instalation":"' . $station['instalation'] . '", '
  . '"suspension":"' . $station['suspension'] . '", '
  . '"url_online":"' . $station['url_online'] . '", '
  . '"station_category":"' . $station['station_category_id'] . '", '
  . '"station_country":"' . $station['station_country_id'] . '", '
  . '"station_state":"' . $station['station_state_id'] . '", '
  . '"station_city":"' . $station['station_city_id'] . '", '
  . '"station_institute":"' . $station['station_institute_id'] . '", '
  . '"station_copyright":"' . $station['station_copyright_id'] . '", '
  . '"station_type":"' . $station['station_type_id'] . '", '
  . '"station_status":"' . $station['station_status_id'] . '", ';

  echo '}
             }, 
            ';
}

echo ']
     };';
