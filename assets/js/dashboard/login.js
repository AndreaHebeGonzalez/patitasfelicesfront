function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const user = JSON.stringify({ email: email, password: password });
    const data = new FormData(document.getElementById('login-form'));
    console.log(data);
    console.log(user);
    fetch('http://localhost:3000/sesion/login', {
        method: 'POST',
        body: data
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.token);
            if (data.error) {
                alert(data.error, "Email o contraseña incorrectos");
            }
            else {
                document.cookie = "token3=" + data.token;
                window.location.href = "./gestion-mascotas/gestion-mascotas.html";
            }
        }
        )
        .catch(error => console.log(error));
}

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    login();
});