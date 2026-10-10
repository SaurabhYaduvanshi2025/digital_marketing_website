<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

class BlogController
{
    public static function create(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid JSON data.',
            ]);
            return;
        }

        $title = trim($data['title'] ?? '');
        $slug = trim($data['slug'] ?? '');
        $content = $data['content'] ?? '';
        $excerpt = trim($data['excerpt'] ?? '');
        $status = $data['status'] ?? 'draft';

        if ($title === '' || $slug === '' || trim($content) === '') {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Title, slug and content are required.',
            ]);
            return;
        }

        if (
            mb_strlen($title) > 200 ||
            mb_strlen($slug) > 220 ||
            !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)
        ) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid title or slug.',
            ]);
            return;
        }

        if (!in_array($status, ['draft', 'published'], true)) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid blog status.',
            ]);
            return;
        }

        $db = Database::connect();

        try {
            $statement = $db->prepare(
                'INSERT INTO blogs
                    (title, slug, excerpt, content, status, published_at)
                 VALUES
                    (:title, :slug, :excerpt, :content, :status, :published_at)'
            );

            $statement->execute([
                'title' => $title,
                'slug' => $slug,
                'excerpt' => $excerpt,
                'content' => $content,
                'status' => $status,
                'published_at' => $status === 'published' ? date('Y-m-d H:i:s') : null,
            ]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'message' => 'This blog slug already exists.',
                ]);
                return;
            }

            throw $e;
        }

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Blog created successfully.',
            'blog_id' => $db->lastInsertId(),
        ]);
    }

// this method provide all blogs list 


public static function index(): void
{
    $db = Database::connect();

    $statement = $db->query(
        'SELECT id, title, slug, excerpt, featured_image,
                status, published_at, created_at, updated_at
         FROM blogs
         ORDER BY id DESC'
    );

    $blogs = $statement->fetchAll();

    echo json_encode([
        'success' => true,
        'blogs' => $blogs,
    ]);
}

// THis is blog show method



public static function show(): void
{
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    if (!$id || $id < 1) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid blog ID.',
        ]);
        return;
    }

    $db = Database::connect();

    $statement = $db->prepare(
        'SELECT * FROM blogs WHERE id = :id LIMIT 1'
    );

    $statement->execute(['id' => $id]);
    $blog = $statement->fetch();

    if (!$blog) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Blog not found.',
        ]);
        return;
    }

    echo json_encode([
        'success' => true,
        'blog' => $blog,
    ]);
}

// update feature Start from here 


public static function update(): void
{
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$id || $id < 1 || !is_array($data)) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid blog ID or JSON data.',
        ]);
        return;
    }

    $title = trim($data['title'] ?? '');
    $slug = trim($data['slug'] ?? '');
    $content = $data['content'] ?? '';
    $excerpt = trim($data['excerpt'] ?? '');
    $status = $data['status'] ?? 'draft';

    if (
        $title === '' ||
        $slug === '' ||
        trim($content) === '' ||
        mb_strlen($title) > 200 ||
        mb_strlen($slug) > 220 ||
        !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug) ||
        !in_array($status, ['draft', 'published'], true)
    ) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid title, slug, content or status.',
        ]);
        return;
    }

    $db = Database::connect();

    $check = $db->prepare('SELECT id, published_at FROM blogs WHERE id = :id');
    $check->execute(['id' => $id]);
    $existingBlog = $check->fetch();

    if (!$existingBlog) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Blog not found.',
        ]);
        return;
    }

    $publishedAt = $status === 'draft'
        ? null
        : ($existingBlog['published_at'] ?? date('Y-m-d H:i:s'));

    try {
        $statement = $db->prepare(
            'UPDATE blogs
             SET title = :title,
                 slug = :slug,
                 excerpt = :excerpt,
                 content = :content,
                 status = :status,
                 published_at = :published_at
             WHERE id = :id'
        );

        $statement->execute([
            'title' => $title,
            'slug' => $slug,
            'excerpt' => $excerpt,
            'content' => $content,
            'status' => $status,
            'published_at' => $publishedAt,
            'id' => $id,
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'This blog slug already exists.',
            ]);
            return;
        }

        throw $e;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Blog updated successfully.',
    ]);
}


// blog delete method



public static function delete(): void
{
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    if (!$id || $id < 1) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid blog ID.',
        ]);
        return;
    }

    $db = Database::connect();

    $statement = $db->prepare(
        'DELETE FROM blogs WHERE id = :id'
    );

    $statement->execute(['id' => $id]);

    if ($statement->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Blog not found.',
        ]);
        return;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Blog deleted successfully.',
    ]);
}

// blog publish options showing 


public static function publicIndex(): void
{
    $db = Database::connect();

    $statement = $db->query(
        "SELECT id, title, slug, excerpt, featured_image,
                meta_title, meta_description, published_at
         FROM blogs
         WHERE status = 'published'
         ORDER BY published_at DESC, id DESC"
    );

    echo json_encode([
        'success' => true,
        'blogs' => $statement->fetchAll(),
    ]);
}

// blog draft to public posting feature


public static function publish(): void
{
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    if (!$id || $id < 1) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid blog ID.',
        ]);
        return;
    }

    $db = Database::connect();

    $check = $db->prepare(
        'SELECT id, status, published_at FROM blogs WHERE id = :id'
    );
    $check->execute(['id' => $id]);
    $blog = $check->fetch();

    if (!$blog) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Blog not found.',
        ]);
        return;
    }

    $statement = $db->prepare(
        "UPDATE blogs
         SET status = 'published',
             published_at = COALESCE(published_at, CURRENT_TIMESTAMP)
         WHERE id = :id"
    );
    $statement->execute(['id' => $id]);

    echo json_encode([
        'success' => true,
        'message' => 'Blog published successfully.',
    ]);
}


// single blog on page 


public static function publicShow(): void
{
    $slug = trim($_GET['slug'] ?? '');

    if ($slug === '') {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Blog slug is required.',
        ]);
        return;
    }

    $db = Database::connect();

    $statement = $db->prepare(
        "SELECT id, title, slug, excerpt, content, featured_image,
                meta_title, meta_description, published_at
         FROM blogs
         WHERE slug = :slug AND status = 'published'
         LIMIT 1"
    );

    $statement->execute(['slug' => $slug]);
    $blog = $statement->fetch();

    if (!$blog) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Published blog not found.',
        ]);
        return;
    }

    echo json_encode([
        'success' => true,
        'blog' => $blog,
    ]);
}

// blog cover images , images content upload system 


public static function uploadImage(): void
{
    header('Content-Type: application/json');

    $purpose = $_POST['purpose'] ?? '';
    $allowedPurposes = ['cover', 'gallery', 'content'];

    if (!in_array($purpose, $allowedPurposes, true)) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Purpose must be cover, gallery or content.'
        ]);
        return;
    }

    $blogId = filter_var(
        $_POST['blog_id'] ?? null,
        FILTER_VALIDATE_INT
    );

    if ($purpose !== 'content' && (!$blogId || $blogId < 1)) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Valid blog_id is required.'
        ]);
        return;
    }

    if (
        !isset($_FILES['file']) ||
        $_FILES['file']['error'] !== UPLOAD_ERR_OK
    ) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please select a valid image.'
        ]);
        return;
    }

    $file = $_FILES['file'];
    $maxSize = (int) ($_ENV['UPLOAD_MAX_SIZE'] ?? 2097152);

    if ($file['size'] <= 0 || $file['size'] > $maxSize) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Image must not exceed 2 MB.'
        ]);
        return;
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);

    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif'
    ];

    if (
        !isset($allowedTypes[$mime]) ||
        @getimagesize($file['tmp_name']) === false
    ) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Only valid JPG, PNG, WEBP or GIF images are allowed.'
        ]);
        return;
    }

    $db = Database::connect();
    $transactionStarted = false;
    $savedPath = null;

    try {
        if ($purpose !== 'content') {
            $check = $db->prepare(
                'SELECT id FROM blogs WHERE id = :id'
            );
            $check->execute(['id' => $blogId]);

            if (!$check->fetch()) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Blog not found.'
                ]);
                return;
            }
        }

        if ($purpose === 'gallery') {
            $db->beginTransaction();
            $transactionStarted = true;

            $lock = $db->prepare(
                'SELECT id FROM blogs WHERE id = :id FOR UPDATE'
            );
            $lock->execute(['id' => $blogId]);

            $count = $db->prepare(
                'SELECT COUNT(*) FROM blog_images WHERE blog_id = :id'
            );
            $count->execute(['id' => $blogId]);

            if ((int) $count->fetchColumn() >= 3) {
                $db->rollBack();
                $transactionStarted = false;

                http_response_code(422);
                echo json_encode([
                    'success' => false,
                    'message' => 'A blog can have at most 3 gallery images.'
                ]);
                return;
            }
        }

        $folder = __DIR__ . '/../uploads/blogs/' . $purpose;

        if (!is_dir($folder) || !is_writable($folder)) {
            throw new RuntimeException('Upload directory is unavailable.');
        }

        $filename = bin2hex(random_bytes(16))
            . '.' . $allowedTypes[$mime];

        $destination = $folder . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new RuntimeException('Image upload failed.');
        }

        $savedPath = 'uploads/blogs/' . $purpose . '/' . $filename;

        if ($purpose === 'cover') {
            $statement = $db->prepare(
                'UPDATE blogs SET featured_image = :path WHERE id = :id'
            );
            $statement->execute([
                'path' => $savedPath,
                'id' => $blogId
            ]);
        } elseif ($purpose === 'gallery') {
            $statement = $db->prepare(
                'INSERT INTO blog_images (blog_id, image_path)
                 VALUES (:blog_id, :path)'
            );
            $statement->execute([
                'blog_id' => $blogId,
                'path' => $savedPath
            ]);
        }

        if ($transactionStarted) {
            $db->commit();
            $transactionStarted = false;
        }

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Image uploaded successfully.',
            'purpose' => $purpose,
            'image_path' => $savedPath,
            'location' => '/' . $savedPath
        ]);

    } catch (Throwable $e) {
        if ($transactionStarted && $db->inTransaction()) {
            $db->rollBack();
        }

        if ($savedPath !== null) {
            $fullPath = __DIR__ . '/../' . $savedPath;

            if (is_file($fullPath)) {
                unlink($fullPath);
            }
        }

        error_log('Blog image upload failed: ' . $e->getMessage());

        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Image upload failed.'
        ]);
    }
}

// delete gallery images 

public static function deleteGalleryImage(): void
    {
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid image ID.',
            ]);
            return;
        }

        $db = Database::connect();

        $stmt = $db->prepare('SELECT image_path FROM blog_images WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $image = $stmt->fetch();

        if (!$image) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Image not found.',
            ]);
            return;
        }

        $deleteStmt = $db->prepare('DELETE FROM blog_images WHERE id = :id');
        $deleteStmt->execute(['id' => $id]);

        $fullPath = __DIR__ . '/../' . $image['image_path'];
        if (is_file($fullPath)) {
            unlink($fullPath);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Gallery image deleted successfully.',
        ]);
    }


    // 11. Update Gallery Image Details (alt_text, caption, sort_order)

// 11. Update Gallery Image Details
public static function updateGalleryImage(): void
{
    header('Content-Type: application/json');

    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate image ID and JSON payload
    if (!$id || $id < 1 || !is_array($data)) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid image ID or JSON payload.',
        ]);
        return;
    }

    // Validate input fields
    $altText = trim($data['alt_text'] ?? '');
    $caption = trim($data['caption'] ?? '');

    $sortOrder = filter_var(
        $data['sort_order'] ?? 0,
        FILTER_VALIDATE_INT
    );

    if (
        mb_strlen($altText) > 255 ||
        mb_strlen($caption) > 255 ||
        $sortOrder === false ||
        $sortOrder < 0 ||
        $sortOrder > 255
    ) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid image details or sort order.',
        ]);
        return;
    }

    try {
        $db = Database::connect();

        // Check whether the gallery image exists
        $check = $db->prepare(
            'SELECT id FROM blog_images WHERE id = :id'
        );
        $check->execute(['id' => $id]);

        if (!$check->fetch()) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Gallery image not found.',
            ]);
            return;
        }

        // Update image details
        $stmt = $db->prepare(
            'UPDATE blog_images
             SET alt_text = :alt_text,
                 caption = :caption,
                 sort_order = :sort_order
             WHERE id = :id'
        );

        $stmt->execute([
            'alt_text' => $altText !== '' ? $altText : null,
            'caption' => $caption !== '' ? $caption : null,
            'sort_order' => $sortOrder,
            'id' => $id,
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Gallery image details updated successfully.',
        ]);

    } catch (Throwable $e) {
        error_log($e->getMessage());

        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update gallery image details.',
        ]);
    }
}

// 12. List Gallery Images for a Blog
public static function listGalleryImages(): void
{
    header('Content-Type: application/json');

    $blogId = filter_input(
        INPUT_GET,
        'blog_id',
        FILTER_VALIDATE_INT
    );

    if (!$blogId || $blogId < 1) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Valid blog ID is required.',
        ]);
        return;
    }

    try {
        $db = Database::connect();

        // Check whether the blog exists
        $check = $db->prepare(
            'SELECT id FROM blogs WHERE id = :id'
        );
        $check->execute(['id' => $blogId]);

        if (!$check->fetch()) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Blog not found.',
            ]);
            return;
        }

        // Fetch gallery images
        $stmt = $db->prepare(
            'SELECT id, blog_id, image_path, alt_text,
                    caption, sort_order, created_at
             FROM blog_images
             WHERE blog_id = :blog_id
             ORDER BY sort_order ASC, id ASC'
        );

        $stmt->execute(['blog_id' => $blogId]);

        echo json_encode([
            'success' => true,
            'images' => $stmt->fetchAll(PDO::FETCH_ASSOC),
        ]);

    } catch (Throwable $e) {
        error_log($e->getMessage());

        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to retrieve gallery images.',
        ]);
    }
}

}