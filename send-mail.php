<?php
/**
 * Contact Form Email Handler
 * Werner Lichy Website - Basic Email Sending Function
 */

// Set content type for JSON response
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Configuration
$config = [
    'recipient_email' => 'lisa.guenzler@googlemail.com', // Change this to your email for testing
    'sender_email' => 'noreply@lichy-berlin.de',
    'subject_prefix' => 'Werner Lichy Contact Form',
    'max_message_length' => 2000,
    'min_message_length' => 10,
    'rate_limit_minutes' => 5,
    'rate_limit_attempts' => 3
];

// Function to sanitize input
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Function to validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Function to check rate limiting
function checkRateLimit($ip, $config) {
    $rate_limit_file = sys_get_temp_dir() . '/contact_form_rate_' . md5($ip) . '.txt';
    
    if (file_exists($rate_limit_file)) {
        $data = json_decode(file_get_contents($rate_limit_file), true);
        $current_time = time();
        
        // Clean old attempts
        $data['attempts'] = array_filter($data['attempts'], function($timestamp) use ($current_time, $config) {
            return ($current_time - $timestamp) < ($config['rate_limit_minutes'] * 60);
        });
        
        // Check if limit exceeded
        if (count($data['attempts']) >= $config['rate_limit_attempts']) {
            return false;
        }
        
        // Add current attempt
        $data['attempts'][] = $current_time;
    } else {
        $data = ['attempts' => [time()]];
    }
    
    file_put_contents($rate_limit_file, json_encode($data));
    return true;
}

try {
    // Get client IP
    $client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Check rate limiting
    if (!checkRateLimit($client_ip, $config)) {
        throw new Exception('Too many attempts. Please try again later.');
    }
    
    // Get and sanitize form data
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    $consent = isset($_POST['consent']) ? true : false;
    $honeypot = $_POST['website'] ?? '';
    
    // Validate honeypot (should be empty)
    if (!empty($honeypot)) {
        throw new Exception('Spam detected');
    }
    
    // Validate required fields
    if (empty($name)) {
        throw new Exception('Name is required');
    }
    
    if (empty($email)) {
        throw new Exception('Email is required');
    }
    
    if (!isValidEmail($email)) {
        throw new Exception('Please enter a valid email address');
    }
    
    if (empty($message)) {
        throw new Exception('Message is required');
    }
    
    if (strlen($message) < $config['min_message_length']) {
        throw new Exception('Please write a short message');
    }
    
    if (strlen($message) > $config['max_message_length']) {
        throw new Exception('Message is too long');
    }
    
    if (!$consent) {
        throw new Exception('Please confirm that you\'ve read our Privacy Policy');
    }
    
    // Prepare email content
    $subject = $config['subject_prefix'] . ' - ' . date('Y-m-d H:i:s');
    
    $html_message = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #38618c; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #38618c; }
            .value { margin-top: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
                <p>Werner Lichy Website</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Name:</div>
                    <div class='value'>" . htmlspecialchars($name) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'>" . htmlspecialchars($email) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Submitted:</div>
                    <div class='value'>" . date('Y-m-d H:i:s') . "</div>
                </div>
                <div class='field'>
                    <div class='label'>IP Address:</div>
                    <div class='value'>" . htmlspecialchars($client_ip) . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This message was sent from the Werner Lichy contact form.</p>
                <p>Please reply directly to: " . htmlspecialchars($email) . "</p>
            </div>
        </div>
    </body>
    </html>";
    
    // Prepare headers
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $config['sender_email'],
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'X-Priority: 3'
    ];
    
    // Send email
    $mail_sent = mail(
        $config['recipient_email'],
        $subject,
        $html_message,
        implode("\r\n", $headers)
    );
    
    // Debug information
    $debug_info = [
        'mail_function_exists' => function_exists('mail'),
        'mail_sent' => $mail_sent,
        'recipient' => $config['recipient_email'],
        'sender' => $config['sender_email'],
        'subject' => $subject,
        'headers' => implode("\r\n", $headers)
    ];
    
    if (!$mail_sent) {
        // Return debug info instead of generic error
        throw new Exception('Failed to send email. Debug info: ' . json_encode($debug_info));
    }
    
    // Log successful submission (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Contact form submission from: " . $email . " (IP: " . $client_ip . ")\n";
    error_log($log_entry, 3, sys_get_temp_dir() . '/contact_form_log.txt');
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message. We will get back to you soon!'
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log("Contact form error: " . $e->getMessage() . " (IP: " . ($client_ip ?? 'unknown') . ")", 0);
    
    // Return error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
