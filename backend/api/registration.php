<?php
session_start();

    require_once("../db/db.php");

    function isUserDataValid($userData) {
        if (!isset($userData["username"]) || !isset($userData["email"]) || !isset($userData["password"])) {
            return ["isValid" => false, "message" => "Некоректни данни!"];
        }
        if(strlen($userData["username"]) > 20) {
            return ["isValid" => false , "message" => "Потребителско име трябва да е максимум 20 символа"];
        }
        if(strlen($userData["password"]) < 3) {
            return ["isValid" => false , "message" => "Паролата трябва да е поне 3 символа"];
        }

        $regex = "/^[a-z0-9_]+@[a-z]+\.[a-z]+$/";

        if (!preg_match($regex, $userData["email"])) {
            return ["isValid" => false, "message" => "Невалиден имейл!"];
        }

        return ["isValid" => true, "message" => "Данните са валидни!"];
    }

    function getUsersRoleId(PDO $connection,$code) {
        $sql = "SELECT id FROM roles WHERE code = ?";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$code]);
        $id = $stmt->fetch(PDO::FETCH_ASSOC)["id"];
        return $id;
    }

    $userData = json_decode(file_get_contents("php://input"), true);
    // exit(json_encode($userData));

    if ($userData) {

        $valid = isUserDataValid($userData);
        // exit(json_encode($valid));
        if (!$valid["isValid"]) {
            http_response_code(400);
            exit(json_encode(["status" => "ERROR", "message" => $valid["message"]]));
        }

        $userData["password"] = password_hash($userData["password"], PASSWORD_DEFAULT);

        try {

            $db = new DB();
            $connection = $db->getConnection();

            $code = '';
            if($userData["role_choice"] == "teacher"){
                $code = "teacher";
            }
            else{
                $code = "regular_user";
            }

            $roles_id = getUsersRoleId($connection,$code);
            // exit(json_encode($roles_id));
            $userData["roles_id"] = $roles_id;
            unset($userData["role_choice"]);
            // exit(json_encode($userData));
            $sql = "INSERT INTO users (username,email, password, roles_id) 
                    VALUES (:username,:email, :password, :roles_id)";
            // exit(json_encode("im here1"));
            $stmt = $connection->prepare($sql);
            $stmt->execute($userData);

            echo json_encode(["status" => "SUCCES", "message" => "Регистрацията е успешна!"]);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "ERROR", "message" => "Грешка при регистрация! Потребителското име е вече заето или не е възможно записване в базата данни !"]);
        }


    } else {
        http_response_code(400);
        echo json_encode(["status" => "ERROR", "message" => "Некоректни данни!"]); 
    }

?>
