<?php
session_start();
require_once("../db/db.php");
function validateUserInput(){ 
    $data = json_decode(file_get_contents("php://input"), true);
    if($data["car"] =='' or $data["from"] == '' or  $data["to"] == ''){
        exit(json_encode(["message" => "Има непопълнено поле!"]));
    }
    $ps_id = '';
        $day = $data["day"];
        $month = $data["month"];
        $from = (int)str_replace(":","",$data["from"]);
        $to = (int)str_replace(":","",$data["to"]);
        if ($data["day"] <= '9'){
            $day = '0'.$data["day"];
        }
        if ($data["month"] <= '9'){
            $month = '0'.$data["month"];
        }
        $date = $data["year"].'-'.$month.'-'.$day;
        // exit(json_encode(["inserted"=>$data["to"],"from date func"=>date("H:i:s")]));
        // exit(json_encode(["inserted"=>$data["to"],"from date function"=>date("Y-m-d")]));

        date_default_timezone_set('Europe/Sofia');
        $currenTime = date('H:i:s');
        if($date < date("Y-m-d")){
            exit(json_encode(["status"=>"fail","message" => "Невалидна дата!Опитвате се да резервирате дата в миналото!"]));
        }
        if($date == date("Y-m-d") and convertTimeFormat($data["from"]) < $currenTime){
            exit(json_encode(["status"=>"fail","message" => "Изберете време по-голямо от текущото"]));
        }
        // exit(json_encode($date));
        // exit(json_encode(["from"=>convertTimeFormat($data["from"]),"to"=>convertTimeFormat($data["to"])]));
        $number = $data["num"].'';
        if($from < $to){
            try {
                $db = new DB();
                $connection = $db->getConnection();
                $max_mins = getUserTime($connection,$_SESSION["user"]["id"]);
                $flagMins = isFromToGreaterThanMaxTime($data["from"],$data["to"],$max_mins);
                if($flagMins == 0){
                    exit(json_encode(["status"=>"fail","message" => "Нямата толкова време.Максималното ви време за престой е : {$max_mins} минути"]));
                }
                $ps_id = getParkingSpaceId($connection,$data["num"]);
                $result = getPreviousReservations($connection,$ps_id,$date);
                        $result[] = [convertTimeFormat($data["from"]),convertTimeFormat($data["to"])];
                        $overlaps_count = numOverlaps($result);
                        if($overlaps_count == 0){
                            reserveParkSpace($connection,$ps_id,$date,$data);
                            $df = $data['from'];
                            $dt = $data['to'];
                            echo json_encode(["status"=>"success","message" => "Резервацията ви на {$date} от {$df} до {$dt} е успешна!"]);
                        }
                        else{
                            echo json_encode(["status"=>"fail","message" => "Изглежда вече има записан човек във това време - Моля започнете отначало!"]);
                        }
                
                    }
                    catch (PDOException $e)
                    {
                      http_response_code(500);
                      exit(json_encode(["message" => "Грешка2"]));
                    }

        
        }
    else{
        echo json_encode(["status"=>"fail","message" => "Невалидно време"]);
    }
}
function isFromToGreaterThanMaxTime($from,$to,$max_time_mins){
    $from_arr = explode(":", $from);
    $to_arr = explode(":", $to);
    $from_mins = (int)$from_arr[0]*60 + (int)$from_arr[1];
    $to_mins = (int)$to_arr[0]*60 + (int)$to_arr[1];
    $mins = $to_mins-$from_mins;
    if($max_time_mins < $mins){
        return 0;
    }
    return 1;
}
function getUserTime($connection,$id){
    try{
        $sql = "SELECT roles.max_minutes
        FROM users as user 
        INNER JOIN roles on roles.id=user.roles_id
        WHERE user.id = ?";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$_SESSION["user"]["id"]]);
        $result = $stmt->fetch();
        return $result["max_minutes"];
    }
    catch (PDOException $e)
       {
         http_response_code(500);
         exit(json_encode(["status"=>"fail","message" => "Грешка при взимането на максимално време"]));
       }
}
    function reserveParkSpace(PDO $connection,$ps_id,$date,$data){
       try{

        $sql = "INSERT INTO reservations (id, users_id, parking_space_id, res_date, from_time, to_time, car) 
        VALUES (NULL, ?, ?, ?, ?, ?, ?);";
        $stmt = $connection->prepare($sql);
        $from_formatted = convertTimeFormat($data["from"]);
        $to_formatted = convertTimeFormat($data["to"]);
        $stmt->execute([$_SESSION["user"]["id"],$ps_id,$date,$from_formatted,$to_formatted,$data["car"]]);
       }
       catch (PDOException $e)
       {
         exit(json_encode(["status"=>"fail","message" => "Грешка при запазването на парко място"]));
       }
    }
    function getParkingSpaceId(PDO $connection,$number){
        try{
        $sql = "SELECT ps.id
                        FROM parking_space as ps
                        WHERE ps.number = ?";
                $stmt = $connection->prepare($sql);
                $stmt->execute([$number]);
                $result = $stmt->fetch();
                return $result["id"];
        }
        catch (PDOException $e)
        {
          http_response_code(500);
          exit(json_encode(["status"=>"fail","message" => "Грешка при взинамено на ид"]));
        }
    }
    function getPreviousReservations(PDO $connection,$id,$date){
        try{
        $sql= "SELECT res.from_time,res.to_time
        FROM reservations as res
        WHERE res.parking_space_id = ?
        AND res.res_date = ?
        ORDER BY res.to_time ASC";
 $stmt = $connection->prepare($sql);
 $stmt->execute([$id,$date]);
 $result = $stmt->fetchAll(PDO::FETCH_BOTH);
 return $result;
        }catch (PDOException $e)
        {
          http_response_code(500);
          exit(json_encode(["status"=>"fail","message" => "Грешка при взинамено на парко-местата"]));
        }
        
    }

        
        

        function numOverlaps($intervals)
            {
                $len = count($intervals);
                if ($len < 2) return 0;

                usort($intervals, function($a, $b) {
                    if ($a[1] === $b[1]) {
                        return 0;
                    }
                    return ($a[1] < $b[1]) ? -1 : 1;
                });

                $count = 0;
                $end = PHP_INT_MIN;
                foreach ($intervals as $interval) {
                    if ($interval[0] >= $end) {
                        $end = $interval[1];
                    } else {
                        $count++;
                    }
                }
                return $count;
    
            }
validateUserInput();
function convertTimeFormat($time){
$arr = explode(":",$time);
foreach($arr as &$st){
    if(strlen($st) < 2){
    $st = '0'.$st;
    }
}
$arr[] = "00";
$fdate = implode(":",$arr);
return $fdate;
}
?>