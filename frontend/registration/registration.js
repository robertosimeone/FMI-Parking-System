const registrationForm= document.getElementById('registration-form');
registrationForm.addEventListener('submit', (event) => {
    const inputs = document.querySelectorAll('input');
    const userData= {};
    var role = document.getElementsByName('role_choice');
    var selected_role;
    for(let i = 0;i<role.length;i++){
        if(role[i].checked){
            selected_role=role[i];
        }
    }
    inputs.forEach((input) => {
        if(input.name!='role_choice'){
        userData[input.name]=input.value;
        }
        userData[selected_role.name] = selected_role.value;
    });
    
    fetch('../../backend/api/registration.php' , {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then((httpData) => {
        if (httpData.ok) {
            return httpData.json();
        }

        return httpData.json().then(error => {
            throw {error, url: httpData.url};
        });
    })
    .then((data) => {
        console.log(data);
        const successMessage=document.getElementById('error-state');
        setTimeout(function () {
            window.location.href = '../../index.html';
        },4000);
        document.styleSheets[0].cssRules[12].style.display= "block";
        successMessage.innerText=data["message"];
    })
    .catch((error) => {
        
        console.log(error)
        const errorMessage=document.getElementById('error-state');
        errorMessage.innerText=error["error"]["message"];
        console.log(error);
    });



    event.preventDefault();
});
