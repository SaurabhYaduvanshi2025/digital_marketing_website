<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

class DashboardController
{
    public static function stats(): void
    {
        header('Content-Type: application/json');

        try {
            $db = Database::connect();

            // 1. Leads Metrics (COALESCE ensures 0 instead of NULL when table is empty)
            $leadStmt = $db->query("
                SELECT 
                    COUNT(*) AS total,
                    COALESCE(SUM(status = 'new'), 0) AS new_leads,
                    COALESCE(SUM(status = 'contacted'), 0) AS contacted_leads,
                    COALESCE(SUM(status = 'closed'), 0) AS closed_leads
                FROM leads
            ");
            $leadCounts = $leadStmt->fetch(PDO::FETCH_ASSOC);

            // 2. Blog Metrics (Strict enum checks matching your schema: 'draft', 'published')
            $blogStmt = $db->query("
                SELECT 
                    COUNT(*) AS total,
                    COALESCE(SUM(status = 'published'), 0) AS published_blogs,
                    COALESCE(SUM(status = 'draft'), 0) AS draft_blogs
                FROM blogs
            ");
            $blogCounts = $blogStmt->fetch(PDO::FETCH_ASSOC);

            // 3. Media Counter (From blog_images table)
            $mediaStmt = $db->query('SELECT COUNT(*) FROM blog_images');
            $totalImages = (int) $mediaStmt->fetchColumn();

            // 4. Latest 5 Leads (Safe column selection matching leads table)
            $recentLeadsStmt = $db->query('
                SELECT id, name, email, phone, status, created_at 
                FROM leads 
                ORDER BY id DESC 
                LIMIT 5
            ');
            $recentLeads = $recentLeadsStmt->fetchAll(PDO::FETCH_ASSOC);

            // 5. Latest 5 Blogs (Safe column selection matching blogs table)
            $recentBlogsStmt = $db->query('
                SELECT id, title, slug, status, published_at, created_at 
                FROM blogs 
                ORDER BY id DESC 
                LIMIT 5
            ');
            $recentBlogs = $recentBlogsStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'data' => [
                    'counts' => [
                        'total_leads' => (int) ($leadCounts['total'] ?? 0),
                        'new_leads' => (int) ($leadCounts['new_leads'] ?? 0),
                        'contacted_leads' => (int) ($leadCounts['contacted_leads'] ?? 0),
                        'closed_leads' => (int) ($leadCounts['closed_leads'] ?? 0),
                        'total_blogs' => (int) ($blogCounts['total'] ?? 0),
                        'published_blogs' => (int) ($blogCounts['published_blogs'] ?? 0),
                        'draft_blogs' => (int) ($blogCounts['draft_blogs'] ?? 0),
                        'total_gallery_images' => $totalImages,
                    ],
                    'recent_leads' => $recentLeads ?: [],
                    'recent_blogs' => $recentBlogs ?: [],
                ],
            ]);
        } catch (Throwable $e) {
            error_log('Dashboard Controller Error: ' . $e->getMessage());

            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch dashboard metrics.',
            ]);
        }
    }
}