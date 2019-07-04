<?php
$filePath = $_POST['filePath'];
if(!isset($imageNameArray = $_POST['imageArray'])){
    $imageNameArray = [];
}

exit(json_encode([
    "status" => 1,
    "imageNames" => $imageNameArray
]));
// if(!isset($filePath) || empty($filePath)){
//     exit(json_encode([
//         "status" => 0,
//         "Message" => "Kill yourself"
//     ]));
// }
require_once("include/start.php");

$allImages = getFileNamesInDirectory("content/practice/images");
$validImages
foreach($imageNameArray as $key => $image){
    if(in_array($image, $allImages)){

    }else{

    }
}

pd($allImages);

exit(json_encode([
    "status" => 1,
    'imageNames' => $allImages
]));

