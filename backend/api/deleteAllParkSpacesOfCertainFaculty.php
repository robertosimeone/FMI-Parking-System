<?php
       require_once('../db/db.php');
       try {
           $userData = json_decode(file_get_contents("php://input"), true);
           $db = new DB();
           $connection = $db->getConnection();
           $sql= "DELETE FROM parking_space WHERE id IN (SELECT ps.id FROM parking_space as ps INNER JOIN faculty as f on ps.faculty_id=f.id WHERE f.code=?);";
           $stmt = $connection->prepare($sql);
           $stmt->execute([$userData["faculty-code"]]);
           echo json_encode(["message" => "Успех при триенето на паркоместа от базата данни!"]);
       }
       catch (PDOException $e)
       {
         http_response_code(500);
         exit(json_encode(["message" => "Грешка при триенето на паркоместа от базата данни!"]));
       }
?>