<?php

function get_template($template_part) { 
    $template_part_with_path = TEMPLATE_PATH . $template_part . ".php"; 
    if(file_exists($template_part_with_path)) { 
        require_once $template_part_with_path; 
    } 
} 

function template_path($template_part) { 
    pd($template_part_with_path = TEMPLATE_PATH . $template_part . ".php");
}

function pd($data){
    echo "<pre>";
    print_r($data);
    echo "</pre>";
    exit();
}

// function pd($data) {
//     if(empty($data)) { 
//         echo "Data missing!";
//         return true;
//     } 

//     if(is_array($data) || is_object($data)) {
//         echo '<pre>'; 
//         print_r($data); 
//         echo '</pre>'; 
//         return; 
//     } 

//     echo $data;
// }

function toJavascriptString($s){
    return '"' . addcslashes($s, "\0..\37\"\\") . '"';
}

function toJavascriptArray($array){
    $temp = array_map('toJavascriptString', $array);
    return '[' . implode(',', $temp) . ']';
}

function getFilesInDirectory($directory){
    $files = scandir($directory);
    foreach ($files as $key => $file) {
        if(is_dir($file) || !strpos($file, ".")){
            unset($files[$key]);
        }
    }
    return toJavascriptArray(array_values($files));
}

function getFileNamesInDirectory($directory){
    $files = scandir($directory);
    foreach ($files as $key => $file) {
        if(is_dir($file) || !strpos($file, ".")){
            unset($files[$key]);
        }
    }
    return array_values($files);
}