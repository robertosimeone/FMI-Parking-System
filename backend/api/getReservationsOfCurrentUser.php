<?php
session_start();
require_once("../db/db.php");
// echo json_encode($_SESSION["user"]);
function getReservationInformation(){
    try {
    $db = new DB();
    $connection = $db->getConnection();
    $sql = "SELECT res.id,res.res_date,res.from_time,res.to_time,res.car,ps.number,fac.name
    FROM users as user
    INNER JOIN reservations as res on user.id=res.users_id
    INNER JOIN parking_space as ps on res.parking_space_id=ps.id
    INNER JOIN faculty as fac on ps.faculty_id=fac.id
    WHERE user.id = ?";
    $stmt = $connection->prepare($sql);
    $stmt->execute([$_SESSION["user"]["id"]]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
    }
    catch (PDOException $e)
    {
      http_response_code(500);
      exit(json_encode(["message" => "Грешка"]));
    }
    
}
getReservationInformation();
?>