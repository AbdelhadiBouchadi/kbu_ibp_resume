<?php

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $subject = filter_var($_POST["subject"], FILTER_SANITIZE_STRING);
    $message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);
    
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode([
            "status" => "error",
            "message" => "Please fill in all fields."
        ]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "status" => "error",
            "message" => "Please enter a valid email address."
        ]);
        exit;
    }
    
    
    $recipient = "contact@abdelhadev.com";
    
    $headers = 'From: ' . $name . ' <' . $email . '>' . "\r\n" .
               'Reply-To: ' . $email . "\r\n" .
               'X-Mailer: PHP/' . phpversion();
    
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";
    
    $mail_sent = mail($recipient, $subject, $email_content, $headers);
    
    if ($mail_sent) {
        echo json_encode([
            "status" => "success",
            "message" => "Your message has been sent! I will get back to you soon."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Sorry, there was an error sending your message. Please try again later."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method."
    ]);
}
?>