<?php

class AuthMiddleware
{
    public static function handle(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (!isset($_SESSION['admin_id'])) {
            http_response_code(401);

            echo json_encode([
                'success' => false,
                'message' => 'Unauthorized.',
            ]);

            exit;
        }
    }
}