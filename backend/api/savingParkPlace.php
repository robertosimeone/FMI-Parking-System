<?php 
    require_once('../db/db.php');
    function getFacultyId(PDO $connection, $userData)
    {
        $sql= "SELECT id FROM faculty WHERE code= ?";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$userData["faculty-code"]]);
        $id = $stmt->fetch(PDO::FETCH_ASSOC)["id"];
        return $id;
    }
    function getParkSpaceId(PDO $connection, $userData){
        try { 
            $sql = "SELECT id FROM parking_space WHERE number=? AND faculty_id=?";
            $stmt = $connection->prepare($sql);
            $stmt->execute([$userData["number"],getFacultyId($connection,$userData)]);
            return $stmt->fetch(PDO::FETCH_ASSOC)["id"];
           }
           catch (PDOException $e)
           {
                http_response_code(500);
                exit(json_encode(["message" => "Грешка при извличането на ид на новосъздаденото паркомясто от базата данни!"]));
           }
    
    }
    function createParkCell(PDO $connection, $row,$col, $park_space_id)
    {  
        try { 
            $sql = "INSERT INTO parking_cell (row, col,parking_space_id) VALUES (?,?,?)";
            $stmt = $connection->prepare($sql);
            $stmt->execute([$row,$col,$park_space_id]);
           }
           catch (PDOException $e)
           {
                http_response_code(500);
                exit(json_encode(["message" => "Грешка при вмъкването на новa паркоклетка в базата данни! Ред:  $row, Колона: $col"]));
           }
        
    }
    function createParkSpace(PDO $connection,$userData) {
       try { 
        $sql = "INSERT INTO parking_space (number, faculty_id) VALUES (?,?)";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$userData["number"],getFacultyId($connection,$userData)]);
       }
       catch (PDOException $e)
       {
            http_response_code(500);
            exit(json_encode(["message" => "Грешка при вмъкването на ново паркомясто в базата данни! Номера на място трябва да е уникален"]));
       }
    }
    $userData = json_decode(file_get_contents("php://input"),true);
    $db = new DB();
    $connection = $db->getConnection();
    
    createParkSpace($connection,$userData);
    $created_pp_id = getParkSpaceId($connection,$userData);
    for($i=0;$i < count($userData["cells"]); $i+=1) {
        createParkCell($connection,$userData["cells"][$i][0],$userData["cells"][$i][1],$created_pp_id);
    }

    http_response_code(200);
    echo json_encode(["message" => "insertation was successfully"]);


?>
