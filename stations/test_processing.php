<?php
$url = "http://172.22.52.62/correctedTest_J.php";
  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_HEADER, false);
  curl_setopt($curl, CURLOPT_POST, count($_REQUEST));
  curl_setopt($curl, CURLOPT_POSTFIELDS, $_REQUEST);
//  curl_setopt($curl, CURLOPT_ENCODING ,"");
  $data = curl_exec($curl);
  curl_close($curl);
  echo $data;