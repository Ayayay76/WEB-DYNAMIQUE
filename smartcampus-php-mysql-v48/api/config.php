<?php
// Configuration MySQL pour MAMP.
// Windows MAMP utilise souvent root / root.
// Si votre MAMP utilise un mot de passe vide, remplacez DB_PASS par "".
define('DB_HOST', 'localhost');
define('DB_NAME', 'smartcampus_v48');
define('DB_USER', 'root');
define('DB_PASS', 'root');

function get_pdo() {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    return $pdo;
}
?>
