const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (event) => {

    const inputs = document.querySelectorAll('input');
    const userData = {};
    inputs.forEach((input) => {
        userData[input.name] = input.value;
    })
    fetch('./backend/api/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then((httpData) => {
            console.log(httpData);
            if (httpData.ok) {
                return httpData.json();
            }
            return httpData.json().then(error => {
                throw { error, url: httpData.url };
            });
        })
        .then((data) => {
            console.log(data);
            const success = document.getElementById('error-state');
            setTimeout(function () {
                if (data["role"]["code"] === 'admin') {
                    window.location.href = './frontend/admin/home.html';
                }
                else if(data["role"]["code"] === 'regular_user' || data["role"]["code"] === 'teacher') {
                    window.location.href = './frontend/regular/home.html';
                }
            }, 4000);
            document.styleSheets[0].cssRules[12].style.display = "block";
            success.innerText = data["message"];


        })
        .catch((error) => {
            console.log("error", error);
            const errorMessage = document.getElementById('error-state');
            errorMessage.innerText = error["error"]["message"];

        });



    event.preventDefault();
});