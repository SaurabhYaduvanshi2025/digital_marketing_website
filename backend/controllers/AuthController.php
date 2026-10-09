<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

class AuthController
{
    public static function login(): void
    {
        // [CHANGE: Added JSON response header]
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents('php://input'), true);

        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if ($email === '' || $password === '') {
            http_response_code(422);

            echo json_encode([
                'success' => false,
                'message' => 'Email and password are required.',
            ]);

            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(422);

            echo json_encode([
                'success' => false,
                'message' => 'Invalid email format.',
            ]);

            return;
        }

        $db = Database::connect();

        $statement = $db->prepare(
            'SELECT id, name, email, password, status
             FROM admins
             WHERE email = :email
             LIMIT 1'
        );

        $statement->execute([
            'email' => $email,
        ]);

        $admin = $statement->fetch();

        if (!$admin || !password_verify($password, $admin['password'])) {
            http_response_code(401);

            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password.',
            ]);

            return;
        }

        if ($admin['status'] !== 'active') {
            http_response_code(403);

            echo json_encode([
                'success' => false,
                'message' => 'Admin account is inactive.',
            ]);

            return;
        }

        // [CHANGE: Checked if session is already active before calling session_start]
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        session_regenerate_id(true);

        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_email'] = $admin['email'];
        $_SESSION['admin_name'] = $admin['name'];

        echo json_encode([
            'success' => true,
            'message' => 'Login successful.',
            'admin' => [
                'id' => $admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email'],
            ],
        ]);
    }

    // [NEW ADDITION: Method to check if Admin is logged in & fetch details for Dashboard header/sidebar]
    public static function status(): void
    {
        header('Content-Type: application/json');

        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        // Check if admin session exists
        if (!isset($_SESSION['admin_id'])) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'is_authenticated' => false,
                'message' => 'Admin session expired or not logged in.',
            ]);
            return;
        }

        // Return current admin details for top-bar & sidebar
        echo json_encode([
            'success' => true,
            'is_authenticated' => true,
            'admin' => [
                'id' => $_SESSION['admin_id'],
                'name' => $_SESSION['admin_name'],
                'email' => $_SESSION['admin_email'],
                'status' => 'online',
            ],
        ]);
    }

    // [NEW ADDITION: Method to completely destroy session and clear session cookie on Logout]
    public static function logout(): void
    {
        header('Content-Type: application/json');

        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        // Clear session variables
        $_SESSION = [];

        // Delete session cookie from browser
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        // Destroy server session file
        session_destroy();

        echo json_encode([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }
}