<?php
    require_once('../db/db.php');

    function getUserRole($userData)
    {   
        $db = new DB();
        $connection = $db->getConnection();

        $sql="SELECT rol.code FROM users as u INNER JOIN roles as rol on u.roles_id=rol.id WHERE u.username=?;";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$userData["username"]]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
    }
    function login($userData) {
        try {
            $db = new DB();
            $connection = $db->getConnection();

            $sql = "SELECT * from users where username = ?";
            $stmt = $connection->prepare($sql);
            $stmt->execute([$userData["username"]]);

            if ($stmt->rowCount() === 1) {
                $user = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                
                $isPasswordValid = password_verify($userData["password"], $user["password"]);
                if ($isPasswordValid) {
                    return $user;
                } else {
                    return null;
                }
            } else {
                return null;
            }

        } catch (PDOException $exc) {
            throw new Error($exc->getMessage());
        }
    }

    $userData = json_decode(file_get_contents("php://input"), true);

    if (!isset($userData["username"]) || !isset($userData["password"]) || strlen($userData["password"]) === 0) {
        http_response_code(400);
        exit(json_encode(["message" => "Невалидни данни"]));
    } else {
       
        try {
            $user = login($userData);

            if (!$user) {
                http_response_code(400);
                exit(json_encode(["message" => "Входът е неуспешен"]));
            }

            session_start();
            $_SESSION["user"] = $user;

            http_response_code(200);
            echo json_encode(["message" => "Входът е успешен" , "role" => getUserRole($userData)]); 

        } catch (Error $exc) {
            http_response_code(500);
            echo json_encode(["message" => "Грешка при вход"]);
        }
    }


?>