function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const user = { email: email, password: password };
    console.log(user);
    fetch('http://localhost:3000/sesion/login', {
        method: 'POST',
        body: {
            "email": "fernando@gmail.com",
            "password": "Fernando123"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                alert(data.error, "Email o contraseña incorrectos");
            }
            else {
                document.cookie = "token=" + data;
            }
        }
        )
        .catch(error => console.log(error));
}

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    login();
});