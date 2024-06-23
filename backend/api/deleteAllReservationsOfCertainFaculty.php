<?php
       require_once('../db/db.php');
       try {
           $userData = json_decode(file_get_contents("php://input"), true);
           $db = new DB();
           $connection = $db->getConnection();
           $sql= "DELETE FROM reservations WHERE id IN (SELECT r.id FROM reservations as r INNER JOIN parking_space as ps on r.parking_space_id= ps.id INNER JOIN faculty as f on ps.faculty_id=f.id WHERE f.code=?);";
           $stmt = $connection->prepare($sql);
           $stmt->execute([$userData["faculty-code"]]);
           echo json_encode(["message" => "Успех при триенето на резервациите  от базата данни!"]);
       }
       catch (PDOException $e)
       {
         http_response_code(500);
         exit(json_encode(["message" => "Грешка при триенето на резервациите от базата данни!"]));
       }
?>