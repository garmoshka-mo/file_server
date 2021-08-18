<?php

$filePath = $argv[1];
$metadata = $argv[2];
$contentType = $argv[3];
$xAuthToken = $argv[4];
$xApp = isset($argv[5]) && !empty($argv[5]) && $argv[5] != "undefined" ? $argv[5] : 'Inspections';

$server = 'test.activatecustomers.com';
if (isset($_ENV['UPLOAD_SERVER'])) {
	$server = $_ENV['UPLOAD_SERVER'];
}
$url = 'http://' . $server . '/api/inspection/process-uploaded-media';

// what post fields?
$fields = array(
   'filePath' => $filePath,
   'metadata' => $metadata,
   'contentType' => $contentType,
   'xAuthToken' => $xAuthToken
);

// build the urlencoded data
$postvars = http_build_query($fields);

// Set header
$headr = array();
$headr[] = 'X-AUTH-TOKEN: ' . $xAuthToken;
$headr[] = 'X-APP: ' . $xApp;

// open connection
$ch = curl_init();

// set the url, number of POST vars, POST data
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);
curl_setopt($ch, CURLOPT_POST, count($fields));
curl_setopt($ch, CURLOPT_POSTFIELDS, $postvars);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

// execute post
$result = json_decode(curl_exec($ch));

// close connection
curl_close($ch);
echo ($result->success == true ? "OK" : "FAIL");
?>