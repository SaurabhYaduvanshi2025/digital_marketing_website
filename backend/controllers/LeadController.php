<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

class LeadController
{
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

        if (strlen($name) > 100 || strlen($email) > 150 || strlen($phone) > 20) {
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

        echo json_encode([
            'success' => true,
            'message' => 'Lead created successfully.',
            'lead_id' => $db->lastInsertId(),
        ]);
    }


    public static function index(): void
    {
        $db = Database::connect();

        $statement = $db->query(
            'SELECT id, name, email, phone, address, message, status, lead_date, created_at, updated_at
             FROM leads
             ORDER BY id DESC'
        );

        $leads = $statement->fetchAll();

        echo json_encode([
            'success' => true,
            'leads' => $leads,
        ]);
    }


   // lead Count in signle to multiple section 

public static function show(): void
{
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    if (!$id) {
        http_response_code(422);

        echo json_encode([
            'success' => false,
            'message' => 'Invalid lead ID.',
        ]);

        return;
    }

    $db = Database::connect();

    $statement = $db->prepare(
        'SELECT id, name, email, phone, address, message, status, lead_date, created_at, updated_at
         FROM leads
         WHERE id = :id
         LIMIT 1'
    );

    $statement->execute([
        'id' => $id,
    ]);

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


// leads delete section code 

public static function delete(): void
{
    // URL se lead ID lena
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    // ID valid hai ya nahi
    if (!$id) {
        http_response_code(422);

        echo json_encode([
            'success' => false,
            'message' => 'Invalid lead ID.',
        ]);

        return;
    }

    // Database connection
    $db = Database::connect();

    // Delete query
    $statement = $db->prepare(
        'DELETE FROM leads
         WHERE id = :id'
    );

    // Query execute
    $statement->execute([
        'id' => $id,
    ]);

    // Check karo lead actually delete hui ya nahi
    if ($statement->rowCount() === 0) {
        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'Lead not found.',
        ]);

        return;
    }

    // Successful delete
    echo json_encode([
        'success' => true,
        'message' => 'Lead deleted successfully.',
    ]);
}






}

