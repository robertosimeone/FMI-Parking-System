<?php
require_once("../db/db.php");
function getReservationInformation(){
    $data = json_decode(file_get_contents("php://input"), true);
    // exit(json_encode(["message"=>"u are from the resinfo.php"]));
    if ($data["day"] <= 9){
        $day = '0'.$data["day"];
    }
    else{
        $day = $data["day"];
    }
    if ($data["month"] <= 9){
        $month = '0'.$data["month"];
    }
    $date = $data["year"].'-'.$month.'-'.$day;
    $number = $data["num"].'';
    try {
        $db = new DB();
        $connection = $db->getConnection();
        $sql= "SELECT  user.username,res.from_time,res.to_time,res.car from users as user
        INNER JOIN reservations as res on  res.users_id=user.id
        INNER JOIN parking_space as ps on ps.id=res.parking_space_id
        WHERE ps.number = ? and res.res_date = ?
        ORDER BY res.from_time ASC";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$number,$date]);
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