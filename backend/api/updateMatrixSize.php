<?php
       require_once('../db/db.php');
       try {
        
           $userData = json_decode(file_get_contents("php://input"), true);
           $db = new DB();
           $connection = $db->getConnection();
           $sql= "UPDATE faculty SET matrix_row_length=? ,matrix_col_length=? WHERE code=? ;";
           $stmt = $connection->prepare($sql);
           $stmt->execute([$userData["row"] , $userData["col"], $userData["faculty-code"]]);
           echo json_encode(["message" => "Успех при update на matricata size от базата данни!"]);
       }
       catch (PDOException $e)
       {
         http_response_code(500);
         exit(json_encode(["message" => "Грешка приupdate на matricata size от базата данни!"]));
       }
?>