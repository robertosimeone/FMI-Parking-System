<?php
require_once('./Calendar.php');

function generateCalendarOnInput(){
    $calendarInfo = json_decode(file_get_contents("php://input"), true);
        // $calendarInfo = [
        //     "type" => $month_year["type"],
        //     "month" => $month_year["month"],
        //     "year" => $month_year["year"]
        // ];
        // echo json_encode($calendarInfo);

        $calendar = new Calendar();
        if ($calendarInfo["type"] === "default") {
            $currentDate = date('Y-m-d');
            $arrDate = explode('-', $currentDate);
            $calendar->setYear($arrDate[0]);
            $calendar->setMonthNumber($arrDate[1]);
            $calendar->create();
            echo json_encode($calendar->getWeeks());
        } elseif ($calendarInfo["type"] === "custom") {
            $calendar->setYear($calendarInfo["year"]);
            $calendar->setMonthNumber($calendarInfo["month"]);
            $calendar->create();
             echo json_encode($calendar->getWeeks());
         }
     


}

generateCalendarOnInput();
?>
