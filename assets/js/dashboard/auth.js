const urlAuth = 'http://localhost:3000/sesion'

const checkAuth = () => {
    fetch(urlAuth, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': document.cookie.split('=')[1]
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Su sesion ha expirado.");
                window.location.href = "../login.html";
            }
        })
        .catch(error => console.log(error));
}

checkAuth();