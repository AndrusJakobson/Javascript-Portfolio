<?php
$filePath = $_POST['filePath'];

if(!isset($filePath) || empty($filePath)){
    exit(json_encode([
        "status" => 0,
        "Message" => "Kill yourself"
    ]));
}
require_once("include/start.php");

exit(json_encode([
    "status" => 1,
    'files' => getFileNamesInDirectory($filePath)
]));