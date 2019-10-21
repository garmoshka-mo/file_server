<?php

$filePath = $argv[1];
$metadata = $argv[2];
$contentType = $argv[3];
$xAuthToken = $argv[4];

if (rand(0, 1) == 0) {
  echo "OK";
} else {
  echo "Random emulated error for ".$filePath."; metadata: ".$metadata;
}

?>