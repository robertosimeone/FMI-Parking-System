<?php
       require_once('../db/db.php');
       try {
           $userData = json_decode(file_get_contents("php://input"), true);
           $db = new DB();
           $connection = $db->getConnection();
           $sql= "DELETE FROM parking_cell WHERE id IN 
           ( SELECT pc.id FROM parking_cell AS pc INNER JOIN parking_space AS ps ON pc.parking_space_id = ps.id INNER JOIN faculty AS f ON ps.faculty_id = f.id WHERE f.code = ? );
           ";
           $stmt = $connection->prepare($sql);
           $stmt->execute([$userData["faculty-code"]]);
           echo json_encode(["message" => "Успех при триенето на клетки от базата данни!"]);
       }
       catch (PDOException $e)
       {
         http_response_code(500);
         exit(json_encode(["message" => "Грешка при триенето на клетки от базата данни!"]));
       }
?>