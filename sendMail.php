<?php
require_once("include/start.php");

$subject = filter_input(INPUT_POST, "subject", FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$message = filter_input(INPUT_POST, "message", FILTER_SANITIZE_STRING);

if(empty($subject) || empty($email) || empty($message)){
    exit(json_encode([
        "status" => 0,
        "message" => "Midagi on tühi"
    ]));
}

$from = "From: " . $email . "\r\n";
$message = $message . "\n\n\n" . "Sent from portfolio.";

mail(myEmail, $subject, $message, $from);

exit(json_encode([
    "status" => 1,
    "message" => $from
]));