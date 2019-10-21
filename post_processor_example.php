<?php

$filePath = $argv[1];
$metadata = $argv[2];

if (rand(0, 1) == 0) {
  echo "OK1";
} else {
  echo "Random emulated error for ".$filePath."; metadata: ".$metadata;
}

?>