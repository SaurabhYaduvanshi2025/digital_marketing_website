<?php

require_once __DIR__ . '/../controllers/AuthController.php';

return [
    'GET /api/v1/health' => function (): array {
        return [
            'success' => true,
            'message' => 'CMS API is running',
        ];
    },

    'POST /api/v1/auth/login' => function (): void {
        AuthController::login();
    },

    'GET /api/v1/admin/me' => function (): void {
        require_once __DIR__ . '/../middleware/AuthMiddleware.php';

        AuthMiddleware::handle();

        echo json_encode([
            'success' => true,
            'admin' => [
                'id' => $_SESSION['admin_id'],
                'name' => $_SESSION['admin_name'],
                'email' => $_SESSION['admin_email'],
            ],
        ]);
    },
];