<?php
    require_once('../db/db.php');
    try {
        $db = new DB();
        $connection = $db->getConnection();
        $sql= "SELECT code,matrix_row_length,matrix_col_length FROM faculty";
        $stmt = $connection->prepare($sql);
        $stmt->execute();
        $output = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($output);
    }
    catch (PDOException $e)
    {
                http_response_code(500);
                exit(json_encode(["message" => "Грешка при взимането на размерите на матриците от базата данни!"]));
    }


?>