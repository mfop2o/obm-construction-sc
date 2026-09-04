<?php
require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client(['cookies' => true, 'http_errors' => false]);

echo "1. GET /\n";
$res1 = $client->request('GET', 'http://127.0.0.1:8000/');
$token = null;
$session = null;
foreach ($client->getConfig('cookies')->toArray() as $cookie) {
    if ($cookie['Name'] === 'XSRF-TOKEN') $token = urldecode($cookie['Value']);
    if ($cookie['Name'] === 'obm-construction-session') $session = $cookie['Value'];
}
echo "XSRF-TOKEN: " . substr($token, 0, 10) . "...\n";
echo "Session: " . substr($session, 0, 10) . "...\n\n";

echo "2. POST /login\n";
$res2 = $client->request('POST', 'http://127.0.0.1:8000/login', [
    'headers' => [
        'X-XSRF-TOKEN' => $token,
        'Accept' => 'application/json',
    ],
    'json' => [
        'email' => 'admin@example.com',
        'password' => 'password',
    ]
]);
echo "Status: " . $res2->getStatusCode() . "\n";
echo "Body: " . $res2->getBody() . "\n";
$newSession = null;
foreach ($client->getConfig('cookies')->toArray() as $cookie) {
    if ($cookie['Name'] === 'obm-construction-session') $newSession = $cookie['Value'];
}
echo "New Session: " . substr($newSession, 0, 10) . "...\n\n";

echo "3. GET /api/user\n";
$res3 = $client->request('GET', 'http://127.0.0.1:8000/api/user', [
    'headers' => [
        'X-XSRF-TOKEN' => $token,
        'Accept' => 'application/json',
    ]
]);
echo "Status: " . $res3->getStatusCode() . "\n";
echo "Body: " . $res3->getBody() . "\n";
