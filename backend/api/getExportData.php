<?php
       require_once('../db/db.php');
       try {
           $db = new DB();
           $connection = $db->getConnection();
           $sql= "SELECT f.code,f.matrix_row_length,f.matrix_col_length, ps.number,pc.row,pc.col FROM faculty as f 
           LEFT JOIN parking_space as ps on f.id=ps.faculty_id 
           LEFT JOIN parking_cell as pc on ps.id=pc.parking_space_id;";
           $stmt = $connection->prepare($sql);
           $stmt->execute();
           $output = $stmt->fetchAll(PDO::FETCH_ASSOC);
           echo json_encode($output);
       }
       catch (PDOException $e)
       {
         http_response_code(500);
         exit(json_encode(["message" => "Грешка при взимането на информациятата за експортване от базата данни!"]));
       }
?>