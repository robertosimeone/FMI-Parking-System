<?php
require_once('../db/db.php');
function DeleteReservation(){
    $data = json_decode(file_get_contents("php://input"), true);
    // echo json_encode($data);
    try {
        $db = new DB();
        $connection = $db->getConnection();
        $sql = "DELETE from reservations  WHERE id=?";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$data]);
        if($stmt->rowCount() > 0){
            echo json_encode(["message"=>"success"]);
        }
        else{
            echo json_encode(["message"=>"fail"]);
        }
        }
        catch (PDOException $e)
        {
          http_response_code(500);
          exit(json_encode(["message" => "Грешка"]));
        }
}
DeleteReservation();
?>