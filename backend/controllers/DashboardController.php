
<?php

require_once __DIR__ . '/../config/database.php';

class DashboardController
{
    public static function stats(): void
    {
        header('Content-Type: application/json');

        try {
            $db = Database::connect();

            $stmt = $db->query(
                "SELECT
                    COUNT(*) AS total_blogs,
                    COALESCE(SUM(status = 'published'), 0) AS published_blogs,
                    COALESCE(SUM(status = 'draft'), 0) AS draft_blogs
                 FROM blogs"
            );

            $stats = $stmt->fetch(PDO::FETCH_ASSOC);

            $imageStmt = $db->query(
                "SELECT COUNT(*) AS total_gallery_images
                 FROM blog_images"
            );

            $images = $imageStmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'data' => [
                    'total_blogs' => (int) $stats['total_blogs'],
                    'published_blogs' => (int) $stats['published_blogs'],
                    'draft_blogs' => (int) $stats['draft_blogs'],
                    'total_gallery_images' => (int) $images['total_gallery_images'],
                ],
            ]);
        } catch (Throwable $e) {
            error_log($e->getMessage());

            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Failed to load dashboard statistics.',
            ]);
        }
    }

    //total leads aur new, contacted, converted, closed leads ki count return




public static function leadStats(): void
{
    header('Content-Type: application/json');

    try {
        $db = Database::connect();

        $stmt = $db->query(
            "SELECT
                COUNT(*) AS total_leads,
                SUM(status = 'new') AS new_leads,
                SUM(status = 'contacted') AS contacted_leads,
                SUM(status = 'converted') AS converted_leads,
                SUM(status = 'closed') AS closed_leads
             FROM leads"
        );

        $stats = $stmt->fetch(PDO::FETCH_ASSOC);

        foreach ($stats as $key => $value) {
            $stats[$key] = (int) ($value ?? 0);
        }

        echo json_encode([
            'success' => true,
            'data' => $stats
        ]);

    } catch (Throwable $e) {
        error_log($e->getMessage());

        http_response_code(500);

        echo json_encode([
            'success' => false,
            'message' => 'Failed to load lead statistics.'
        ]);
    }
}
//Latest 10 leads  details return  by this section


public static function recentLeads(): void
{
    header('Content-Type: application/json');

    try {
        $db = Database::connect();

        $stmt = $db->query(
            "SELECT id, name, email, phone, status, lead_date
             FROM leads
             ORDER BY lead_date DESC
             LIMIT 10"
        );

        echo json_encode([
            'success' => true,
            'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);

    } catch (Throwable $e) {
        error_log($e->getMessage());

        http_response_code(500);

        echo json_encode([
            'success' => false,
            'message' => 'Failed to load recent leads.'
        ]);
    }
}



//API pagination


public static function listLeads(): void
{
    header('Content-Type: application/json');

    $page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT);
    $page = ($page && $page > 0) ? $page : 1;

    $limit = 10;
    $offset = ($page - 1) * $limit;

    try {
        $db = Database::connect();

        $countStmt = $db->query(
            'SELECT COUNT(*) FROM leads'
        );
        $total = (int) $countStmt->fetchColumn();

        $stmt = $db->prepare(
            'SELECT id, name, email, phone, address,
                    message, status, lead_date
             FROM leads
             ORDER BY lead_date DESC, id DESC
             LIMIT :limit OFFSET :offset'
        );

        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode([
            'success' => true,
            'data' => $stmt->fetchAll(PDO::FETCH_ASSOC),
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total_records' => $total,
                'total_pages' => (int) ceil($total / $limit)
            ]
        ]);

    } catch (Throwable $e) {
        error_log($e->getMessage());
        http_response_code(500);

        echo json_encode([
            'success' => false,
            'message' => 'Failed to load leads.'
        ]);
    }
}

//PHP syntax errors check


public static function updateLeadStatus(): void
{
    header('Content-Type: application/json');

    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    $data = json_decode(file_get_contents('php://input'), true);

    $allowedStatuses = ['new', 'contacted', 'converted', 'closed'];

    if (
        !$id || $id < 1 ||
        !is_array($data) ||
        !isset($data['status']) ||
        !in_array($data['status'], $allowedStatuses, true)
    ) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Valid lead ID and status are required.'
        ]);
        return;
    }

    try {
        $db = Database::connect();

        $stmt = $db->prepare(
            'UPDATE leads SET status = :status WHERE id = :id'
        );

        $stmt->execute([
            'status' => $data['status'],
            'id' => $id
        ]);

        if ($stmt->rowCount() === 0) {
            $check = $db->prepare(
                'SELECT id FROM leads WHERE id = :id'
            );
            $check->execute(['id' => $id]);

            if (!$check->fetch()) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Lead not found.'
                ]);
                return;
            }
        }

        echo json_encode([
            'success' => true,
            'message' => 'Lead status updated successfully.'
        ]);

    } catch (Throwable $e) {
        error_log($e->getMessage());
        http_response_code(500);

        echo json_encode([
            'success' => false,
            'message' => 'Failed to update lead status.'
        ]);
    }
}

//Lead Delete API

public static function deleteLead(): void
{
    header('Content-Type: application/json');

    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    if (!$id || $id < 1) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Valid lead ID is required.'
        ]);
        return;
    }

    try {
        $db = Database::connect();

        $stmt = $db->prepare(
            'DELETE FROM leads WHERE id = :id'
        );

        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Lead not found.'
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Lead deleted successfully.'
        ]);

    } catch (Throwable $e) {
        error_log($e->getMessage());
        http_response_code(500);

        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete lead.'
        ]);
    }
}

// Admin dashbord  mean profile section of admin 


public static function adminProfile(): void
{
    header('Content-Type: application/json');

    try {
        $db = Database::connect();

        // AuthMiddleware se logged-in admin ki identity leni hogi.
        // Exact implementation tumhare middleware par depend karti hai.
        $adminId = $_SESSION['admin_id'] ?? null;

        if (!$adminId) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Admin session not found.'
            ]);
            return;
        }

        $stmt = $db->prepare(
            'SELECT id, name, email FROM admins WHERE id = :id'
        );
        $stmt->execute(['id' => $adminId]);

        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$admin) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Admin not found.'
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'data' => $admin
        ]);

    } catch (Throwable $e) {
        error_log($e->getMessage());
        http_response_code(500);

        echo json_encode([
            'success' => false,
            'message' => 'Failed to load admin profile.'
        ]);
    }
}





}
