<?php

session_start(session_name('taxiAdmin'));
$url = "http://api.bishkektaxi.org/GetTaxiOrderList?filter=actual&driver_id=-1";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
$data = curl_exec($ch);
curl_close($ch);

//echo ("[[\"2370\",\"Максим Ухов\",\"2015-04-17 12:56:32\",\"мытищи\",\"москва\",\"выполнен\"],[\"2365\",\"Максим Ухов\",\"2015-04-15 21:35:56\",\"\",\"\",\"выполнен\"],[\"2362\",\"Максим Ухов\",\"2015-04-14 06:37:28\",\"пек\",\"чам\",\"выполнен\"]]");
?>