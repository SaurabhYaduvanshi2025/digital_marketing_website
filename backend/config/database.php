<?php

declare(strict_types=1);

namespace App\Config;

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use PDO;
use PDOException;
use RuntimeException;
use Throwable;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

final class Database
{
    private static ?PDO $connection = null;

    public static function connect(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $host     = $_ENV['DB_HOST'] ?? '127.0.0.1';
        $port     = $_ENV['DB_PORT'] ?? '3306';
        $database = $_ENV['DB_DATABASE'] ?? '';
        $username = $_ENV['DB_USERNAME'] ?? '';
        $password = $_ENV['DB_PASSWORD'] ?? '';

        if ($database === '' || $username === '') {
            throw new RuntimeException(
                'Database configuration is missing. Check your .env file.'
            );
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $host,
            $port,
            $database
        );

        try {
            self::$connection = new PDO(
                $dsn,
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );

            return self::$connection;

        } catch (PDOException $exception) {
            throw new RuntimeException(
                'Database connection failed.',
                0,
                $exception
            );
        }
    }
}

