<?php

declare(strict_types=1);

return [
    'GET /api/v1/health' => function (): array {
        return [
            'success' => true,
            'message' => 'CMS API is running',
        ];
    },
];