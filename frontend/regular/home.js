previous_data='';
window.addEventListener('load',()=>{
    fetch("../../backend/api/getMatrixSize.php")
    .then(data =>{
        if(data.ok){
            return data.json();
        }
        return data.json().then(error => {
            throw { error, url: data.url };
        });
    })
    .then(data =>{
       

        data.forEach(element => {
            const current_faculty = document.getElementById(`${element.code}`);
            rows = element.matrix_row_length;
            cols = element.matrix_col_length;
            current_faculty.innerHTML="";
            for(let i = 0;i < rows; i++){
                const current_row = current_faculty.insertRow(-1);
                for(let j = 0; j < cols ;j++){
                    current_cell = current_row.insertCell(-1);
                }
            }
        });
        fetch("../../backend/api/getCellsInfo.php")
        .then(cell_data=>{
            if(cell_data.ok){
                return cell_data.json();
            }
            return cell_data.json().then(error => {
                throw { error, url: data.url };
            });
        })
        .then(cell_data =>{
           
            var arr = [];
            for(let i = 0;i<cell_data.length;i++){
                current_element = cell_data[i];
    
                current_cell = {};
                current_cell.faculty = current_element["code"];
                current_cell.row = current_element["row"];
                current_cell.col = current_element["col"];
                if(arr[current_element["number"]] == undefined){
                arr[current_element["number"]] = [];
                }
                arr[current_element["number"]].push(current_cell);
            }
            keys = arr.keys();
            for(key of keys){
                if(arr[key]!=undefined){
                    let current_park = arr[key];
                    current_park.forEach(park_space=>{
                        let parking_faculty = park_space.faculty;
                        const fac_table = document.getElementById(`${parking_faculty}`);
                        let parking_cells = [park_space.row,park_space.col];
                        let parking_number = key;
                        fac_table.rows[parking_cells[0]].cells[parking_cells[1]].innerHTML=parking_number;
                        fac_table.rows[parking_cells[0]].cells[parking_cells[1]].classList.add(`${parking_number}`);
                        fac_table.rows[parking_cells[0]].cells[parking_cells[1]].addEventListener('click',(ev)=>{
                            const modal = document.getElementById("modal");
                            console.log("ev.target.className",ev.target.className);
                            openModal(modal,ev.target.className); 
                        });
                        fac_table.rows[parking_cells[0]].cells[parking_cells[1]].style.backgroundColor = "red";
                        fac_table.rows[parking_cells[0]].cells[parking_cells[1]].addEventListener('mouseenter',(ev)=>{
                            current_park.forEach(pp_space=>{
                                fac_table.rows[pp_space.row].cells[pp_space.col].style.backgroundColor = "blue";
                            })
                        });
                        fac_table.rows[parking_cells[0]].cells[parking_cells[1]].addEventListener('mouseleave',(ev)=>{
                            current_park.forEach(pp_space=>{
                                fac_table.rows[pp_space.row].cells[pp_space.col].style.backgroundColor = "red";
                            })
                        });
                    });
                    

                    

                    
                }
            }
        }
        )
        .catch(error=>{
            console.log(error);
        })

    })
    .catch(error =>{
        console.log(error);
    })
});


// ________________________________________________________________________________________________


// const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById("overlay");
// openModalButtons.forEach(button => {
//     button.addEventListener('click',()=>{
//         const modal = document.querySelector(button.dataset.modalTarget);
//         openModal(modal);
//     })
// })
overlay.addEventListener('click',()=>{
const modals = document.querySelectorAll('.modal.active');
modals.forEach(modal => {
    closeModal(modal);
});
});
closeModalButtons.forEach(button => {
    button.addEventListener('click',()=>{
        const modal = button.closest('.modal');
        closeModal(modal);
    })
})
function openModal(modal,cell_id){
    if(modal == null){
        return;
    }
    var scroll = document.getElementsByClassName('scrollable');
    const formcontainer = document.getElementById("formcontainer");
    formcontainer.innerHTML = "<form class='dateform' id='dateform'> <div class='month'><label for='month'>Дата : </label><input id='month' type='month' name='month'> </div> <button class='goto-custom-date' id='goto-custom-date' type='button'>Go</button> </form>"
    const buttonGoCustomMonth = document.getElementById("goto-custom-date");
    buttonGoCustomMonth.addEventListener('click',(ev)=>{
    const month = document.getElementById("month").value;
    var monthArray = month.split('-');
    new_year = parseInt(monthArray[0]);
    var new_month = parseInt(monthArray[1]);
    const mod_bod = document.getElementById('modal-body');
    mod_bod.innerHTML = "";
    createDateTable(mod_bod,"custom",new_month,new_year);
});
    const modal_body = document.getElementById('modal-body');
    const title = document.getElementById('title');
    modal_body.innerHTML="";
    title.innerText=`Паркомясто номер: ${cell_id}`;
    // //call default fetch function here
    // //put function here
    createDateTable(modal_body,"default");
    

    modal.classList.add('active');
    overlay.classList.add('active');
}
function closeModal(modal){
    if(modal == null){
        return;
    }
    modal.classList.remove('active');
    overlay.classList.remove('active');
}
function fillUserOutput(){
    fetch("../../backend/api/getUserData.php")
    .then(data =>{
        if(data.ok){
            return data.json();
        }
        return data.json().then(error => {
            throw { error, url: data.url };
        });
    })
    .then(data => {
        
        const output = document.getElementById("user_output");
        let role_id = data["roles_id"];
        var role;
        if(role_id === 1){
            role = "Админ";
        }
        else if (role_id === 2){
            role = "Студент";
        }
        else if (role_id === 3){
            role = "Преподавател";
        }
        output.innerHTML = `Моите резервации(${role} : ${data["username"]})`
        
        
    })
    
}
fillUserOutput();
//The function below needs to be called when creating callender - it will be either custom date or the default date
function fetchInformation(type,month,year){
        var month_year = {type:type,month:month,year:year};

    return fetch("../../backend/api/getCalendarInfo.php", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(month_year),
    })
    .then(data =>{
        if(data.ok){
            return data.json();
        }
        return data.json().then(error => {
            throw { error, url: data.url };
        });
    })
    .then(data =>{
        return data;
    })
    .catch(error => {
        console.log(error);
    });

}
function createDateTable(element,type,month,year){
    date_pplace ={};
    var weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const form = document.getElementById('formcontainer');
    fetchInformation(type,month,year)
    .then(data=>{
        const table =  document.createElement('table');
        element.appendChild(table);
        table.classList.add("table-dynamic");
        // const th = document.createElement('th');
        const tr = document.createElement('tr');
        table.appendChild(tr);
        // th.appendChild(tr);
        weekdays.forEach(day =>{
            const td = document.createElement('td');
            td.classList.add('table-header');
            tr.appendChild(td);
            const day_name = document.createTextNode(day);
            td.appendChild(day_name);
            
        })
        data.forEach(line =>{
        
        const tr = document.createElement('tr');
        table.appendChild(tr);
        line.forEach(days =>{
            const td = document.createElement('td');
            tr.appendChild(td);
            if(days!=''){
            const day_name = document.createTextNode(days);
            td.appendChild(day_name);
            td.classList.add("td-hover");
            td.addEventListener('click',(ev) =>{
                const title = document.getElementById("title");
                const formcontainer = document.getElementById("formcontainer");
                element.innerHTML = "";
                formcontainer.innerHTML = "";
                var rx = /[0-9]+/;

                let res = title.innerText.match(rx);
                park_number = parseInt(res[0]);
                if(type == "default"){
                    dateobj = new Date();
                    date_pplace.day = days;
                    date_pplace.month = dateobj.getMonth()+1;
                    date_pplace.year=dateobj.getFullYear();
                    date_pplace.num = park_number;
                    console.log(date_pplace);
                    title.innerText = `Резервации за парокомясто номер ${park_number} на дата ${days}-${date_pplace.month}-${date_pplace.year}`;
                   
                    
               
            }
            else{
                title.innerText = `Резервации за парокомясто номер ${park_number} на дата ${days}-${month}-${year}`;
                date_pplace.day = days;
                date_pplace.month = month;
                date_pplace.year=year;
                date_pplace.num = park_number;
                console.log(date_pplace);
                
            }
            //add reser
            fetch("../../backend/api/getReservationInformation.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(date_pplace),
                })
                .then(data =>{
                    if(data.ok){
                        return data.json();
                    }
                    return data.json().then(error => {
                        throw { error, url: data.url };
                    });
                })
                .then(data=>{
                console.log("data form resinfo",data);
                var mod = document.getElementById('modal-body');
                fillElBody(element,data);
                const fm = document.createElement('form');
                fm.classList.add('res-container');
                mod.appendChild(fm);
                const label_from_time = document.createElement('label');
                label_from_time.innerText ="От: "
                label_from_time.htmlFor="from_time";
                const input_from_time = document.createElement('input');
                input_from_time.setAttribute('required','');
                input_from_time.type = "time";
                input_from_time.setAttribute('name','from_time');
                input_from_time.setAttribute('id','from_time');
                const label_to_time = document.createElement('label');
                label_to_time.htmlFor="to_time";
                const input_to_time = document.createElement('input');
                input_to_time.type = "time";
                input_to_time.setAttribute('required','');
                label_to_time.innerText ="До: "
                input_to_time.setAttribute('name','to_time');
                input_to_time.setAttribute('id','to_time');
                const label_car_brand = document.createElement('label');
                label_car_brand.htmlFor="car_brand";
                label_car_brand.innerText = "Номер: "
                const car_brand = document.createElement('input');
                car_brand.setAttribute('id','car_brand');
                input_to_time.setAttribute('name','car_brand');
                car_brand.type = "text";
                car_brand.setAttribute('required','');
                fm.appendChild(label_from_time);
                fm.appendChild(input_from_time);
                fm.appendChild(label_to_time);
                fm.appendChild(input_to_time);
                fm.appendChild(label_car_brand);
                fm.appendChild(car_brand);
                    const button_reserve = document.createElement('button');
                    fm.appendChild(button_reserve);
                    button_reserve.classList.add('reserve');
                    button_reserve.innerHTML = "Резервирай мястото";
                    button_reserve.addEventListener('click',(ev)=>{
                       ev.preventDefault();
                       var res_info = {}
                       res_info.day = date_pplace.day;
                       res_info.month = date_pplace.month;
                       res_info.year = date_pplace.year;
                       res_info.num = date_pplace.num;
                       res_info.from = input_from_time.value;
                       res_info.to = input_to_time.value;
                       res_info.car = car_brand.value;


                       fetch("../../backend/api/reserveSpace.php", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(res_info),
                        })
                        .then(data =>{
                            if(data.ok){
                                return data.json();
                            }
                            return data.json().then(error => {
                                throw { error, url: data.url };
                            });
                        })
                       .then(data=>{
                        console.log(data);
                            // closeModal(modal);
                            const m = document.getElementById('modal-body');
                            const h_title = document.getElementById('title');
                            if(data["status"] == "fail" || data["message"]=="miss"){
                             h_title.innerText = "Грешка"   ;
                            }
                            else{
                                h_title.innerText = "Успешно резервиране!";
                            }
                            const pop = document.createElement('div');
                            pop.innerText = data["message"];
                            pop.classList.add('message');
                            m.innerHTML="";
                            m.appendChild(pop);


                       })
                       .catch(error=>{
                        console.log(error);
                       });
                       
                        
                    });
                    

                })
                .catch(error=>{
                    console.log(error);
                });
                
            });
            
            }
        });
        });
    })
    
}
function fillElBody(element,data){
    if(!data.length == 0){
        var header = document.createElement('div')
        header.classList.add('div-header');
        header.classList.add('fx');
        header.innerHTML = "<span>Потребителско име</span><span>Кола</span><span>От</span><span>До</span>"
        element.appendChild(header);
        var div = document.createElement('div');
        //////////
        div.setAttribute('id','new_div_container');
        element.appendChild(div);
        div.classList.add("scrollable");
        data.forEach(res =>{
            let insideDiv = document.createElement('div');
            insideDiv.classList.add('fx');
            div.appendChild(insideDiv);
            let from_time = document.createElement('time');
            from_time.innerText = `${res["from_time"]}`;
            let to_time = document.createElement('time');
            to_time.innerText = `${res["to_time"]}`;
            let car = document.createElement('span');
            car.innerText = `${res["car"]}`;
            let username = document.createElement('span');
            username.innerText = `${res["username"]}`;
            insideDiv.appendChild(username);
            insideDiv.appendChild(car);
            insideDiv.appendChild(from_time);
            insideDiv.appendChild(to_time);
        });
    }
    else{
        const par = document.createElement('p');
        console.log("nqma nikoi tuk");
        par.classList.add('center');
        par.innerText = "Имаш късмет, няма други резервации на този ден...Изпревари всички и се запиши!";
        element.appendChild(par);
    }
}
const badge = document.getElementById("user_output")
// badge.addEventListener('click',)

function openResModal(modal){
    if (modal == null){
        return;
    }
    var form = document.getElementById("formcontainer");
    var modal_body = document.getElementById("modal-body");
    var title = document.getElementById('title');
    form.innerHTML="";
    modal_body.innerHTML="";
    title.innerHTML="Моите резервации";
    modal.classList.add('active');
    overlay.classList.add('active');
    fetch("../../backend/api/getReservationsOfCurrentUser.php")
    .then(data =>{
        if(data.ok){
            return data.json();
        }
        return data.json().then(error => {
            throw { error, url: data.url };
        });
    })
    .then(data=>{
        console.log(data);
        fillElBodyUser(modal_body,data);


    })
    .catch(error=>{
        console.log(error);
    })
}
badge.addEventListener('click',()=>{
    openResModal(modal);
    
   
});
function fillElBodyUser(element,data){
    if(!data.length == 0){
        var header = document.createElement('div')
        header.classList.add('div-header');
        header.classList.add('fx');
        var div = document.createElement('div');
        element.appendChild(header);
        div.classList.add("scrollable");
        console.log("data from fillelbodyuser function",data);
        header.innerHTML = "<span>Факултет</span><span>Паркомясто No</span><span>Дата</span><span>От</span><span>До</span><span>Номер</span>"
        element.appendChild(div);
        data.forEach(res =>{
            let insideDiv = document.createElement('div');
            insideDiv.classList.add('fx');
            var fac = document.createElement('span');
            console.log("res functuin name",res["name"]);
            fac.innerText = res["name"];
            var pn = document.createElement('span');
            pn.innerText = res["number"];
            var date = document.createElement('date');
            date.innerText = res["res_date"];
            var from_time = document.createElement('time');
            from_time.innerText = res["from_time"];
            var to_time = document.createElement('time');
            to_time.innerText = res["to_time"];
            var car = document.createElement('span');
            car.innerText = res["car"];
            var deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-reservation-button');
            deleteButton.innerHTML = "Изтрий";
            insideDiv.appendChild(fac);
            insideDiv.appendChild(pn);
            insideDiv.appendChild(date);
            insideDiv.appendChild(from_time);
            insideDiv.appendChild(to_time);
            insideDiv.appendChild(car);
            insideDiv.appendChild(deleteButton);
            div.appendChild(insideDiv);
            deleteButton.addEventListener('click',(ev)=>{
                fetch("../../backend/api/deleteReservation.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(res["id"]),
                    })
                    .then(data =>{
                        if(data.ok){
                            return data.json();
                        }
                        return data.json().then(error => {
                            throw { error, url: data.url };
                        });
                    })
                    .then(data=>{
                        console.log(data);
                        if(data["message"] == "success"){
                            div.removeChild(insideDiv);
                            console.log(div.childElementCount);
                            if(div.childElementCount == 0){
                                const par = document.createElement('p');
                                par.classList.add('center');
                                par.innerText = "Нямаш никакви резервации!";
                                element.innerHTML="";
                                element.appendChild(par);
                            }
                        }
                    })
                    .catch(error=>{
                        console.log(error);
                    });
                
            });
        });
    }
    else{
        const par = document.createElement('p');
        console.log("nqma nikoi tuk");
        par.classList.add('center');
        par.innerText = "Нямаш никакви резервации!";
        element.appendChild(par);
    }
}
//fillElBody(element,data); izpolzwai tazi funckiq za da populirash dannite za rezerviranite parkomesta