<?php

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/LeadController.php';

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

    'POST /api/v1/auth/logout' => function (): void {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    session_unset();
    session_destroy();

    echo json_encode([
        'success' => true,
        'message' => 'Logout successful.',
    ]);
},



'POST /api/v1/leads' => function (): void {

    LeadController::create();
},

'GET /api/v1/leads' => function (): void {
    require_once __DIR__ . '/../middleware/AuthMiddleware.php';

    AuthMiddleware::handle();

    if (isset($_GET['id'])) {
        LeadController::show();
        return;
    }

    LeadController::index();
},


'PATCH /api/v1/leads' => function (): void {
    require_once __DIR__ . '/../middleware/AuthMiddleware.php';

    AuthMiddleware::handle();


    LeadController::updateStatus();
},


// delete code 

'DELETE /api/v1/leads' => function (): void {
    require_once __DIR__ . '/../middleware/AuthMiddleware.php';

    AuthMiddleware::handle();

    LeadController::delete();
},

];

