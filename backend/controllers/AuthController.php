<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

class AuthController
{
    public static function login(): void
    {
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

        session_start();

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
}