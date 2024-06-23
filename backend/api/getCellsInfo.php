<?php
       require_once('../db/db.php');
       try {
           $db = new DB();
           $connection = $db->getConnection();
           $sql= "SELECT pc.row, pc.col, ps.number,f.code FROM parking_cell as pc 
           INNER JOIN parking_space as ps on pc.parking_space_id=ps.id
           INNER JOIN faculty as f on ps.faculty_id=f.id
           ";
           $stmt = $connection->prepare($sql);
           $stmt->execute();
           $output = $stmt->fetchAll(PDO::FETCH_ASSOC);
           echo json_encode($output);
       }
       catch (PDOException $e)
       {
         http_response_code(500);
         exit(json_encode(["message" => "Грешка при взимането на информацията за клетките от базата данни!"]));
       }
?>