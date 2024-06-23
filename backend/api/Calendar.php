<?php

class Calendar extends DateTime{
    protected $year;
    protected $monthNumber;
    protected  $weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    protected $weeks = [];
    protected $currentDate;
    public function getWeekDays(){
        return $this->weekDays;
    }
    public function getYear(){
        return $this->year;
    }
    public function setYear($year){
        $this->year = $year;
    }
    public function getMonthNumber(){
        return $this->monthNumber;
    }
    public function setMonthNumber($number){
        $this->monthNumber = $number;
    }
    public function getWeeks(){
        return $this->weeks;
    }
    public function create(){
        $date = $this->setDate($this->getYear(),$this->getMonthNumber(),1);
        $daysInMonth = $date->format('t');
        $dayMonthStarts = $date->format('N');
        $days = array_fill(0,$dayMonthStarts-1,'');
        for($i = 1;$i<=$daysInMonth;$i++){
            $days[] = $i;
        }
        $this->weeks = array_chunk($days,7);
        $size = count($this->weeks);
        if (count($this->weeks[$size-1]) <= 6){
            $new_size = count($this->weeks[$size-1]);
            for($j = $new_size;$j<7;$j++){
                $this->weeks[$size-1][] = '';
            }   
        }
    }
}


?>