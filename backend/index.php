<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config/cors.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$routes = require __DIR__ . '/routes/api.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$routeKey = $method . ' ' . $path;

header('Content-Type: application/json');

if (isset($routes[$routeKey])) {
    echo json_encode($routes[$routeKey]());
    exit;
}

http_response_code(404);

echo json_encode([
    'success' => false,
    'message' => 'Route not found',
]);