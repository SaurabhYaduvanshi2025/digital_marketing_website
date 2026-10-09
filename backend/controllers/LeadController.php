<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

class LeadController
{
    // Create a new lead
    public static function create(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $address = trim($data['address'] ?? '');
        $message = trim($data['message'] ?? '');

        if ($name === '' || $email === '' || $phone === '') {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Name, email and phone are required.',
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

        if (
            strlen($name) > 100 ||
            strlen($email) > 150 ||
            strlen($phone) > 20 ||
            strlen($address) > 255
        ) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Input length is invalid.',
            ]);
            return;
        }

        $db = Database::connect();

        $statement = $db->prepare(
            'INSERT INTO leads (name, email, phone, address, message)
             VALUES (:name, :email, :phone, :address, :message)'
        );

        $statement->execute([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'address' => $address,
            'message' => $message,
        ]);

        http_response_code(201);

        echo json_encode([
            'success' => true,
            'message' => 'Lead created successfully.',
            'lead_id' => $db->lastInsertId(),
        ]);
    }

    // Get all leads, optionally search by name, email or phone
    public static function index(): void
    {
        $search = trim($_GET['search'] ?? '');

        $db = Database::connect();

        $statement = $db->prepare(
            'SELECT id, name, email, phone, address, message, status,
                    lead_date, created_at, updated_at
             FROM leads
             WHERE name LIKE :name
                OR email LIKE :email
                OR phone LIKE :phone
             ORDER BY id DESC'
        );

        $searchValue = '%' . $search . '%';

        $statement->execute([
            'name' => $searchValue,
            'email' => $searchValue,
            'phone' => $searchValue,
        ]);

        $leads = $statement->fetchAll();

        echo json_encode([
            'success' => true,
            'leads' => $leads,
        ]);
    }

    // Get one lead by ID
    public static function show(): void
    {
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid lead ID.',
            ]);
            return;
        }

        $db = Database::connect();

        $statement = $db->prepare(
            'SELECT id, name, email, phone, address, message, status,
                    lead_date, created_at, updated_at
             FROM leads
             WHERE id = :id
             LIMIT 1'
        );

        $statement->execute(['id' => $id]);

        $lead = $statement->fetch();

        if (!$lead) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Lead not found.',
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'lead' => $lead,
        ]);
    }

    // Update a lead's status
    public static function updateStatus(): void
    {
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        $data = json_decode(file_get_contents('php://input'), true);

        $status = trim($data['status'] ?? '');

        $allowedStatuses = [
            'new',
            'contacted',
            'converted',
            'closed',
        ];

        if (
            !$id || $id < 1 ||
            !in_array($status, $allowedStatuses, true)
        ) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid lead ID or status.',
            ]);
            return;
        }

        $db = Database::connect();

        // Check whether the lead exists first
        $check = $db->prepare(
            'SELECT id FROM leads WHERE id = :id'
        );
        $check->execute(['id' => $id]);

        if (!$check->fetch()) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Lead not found.',
            ]);
            return;
        }

        $statement = $db->prepare(
            'UPDATE leads SET status = :status WHERE id = :id'
        );

        $statement->execute([
            'status' => $status,
            'id' => $id,
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Lead status updated successfully.',
        ]);
    }

    // Delete one lead by ID
    public static function delete(): void
    {
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid lead ID.',
            ]);
            return;
        }

        $db = Database::connect();

        $statement = $db->prepare(
            'DELETE FROM leads WHERE id = :id'
        );

        $statement->execute(['id' => $id]);

        if ($statement->rowCount() === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Lead not found.',
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Lead deleted successfully.',
        ]);
    }
}