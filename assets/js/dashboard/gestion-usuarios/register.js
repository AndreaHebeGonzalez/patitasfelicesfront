const formulario = document.querySelector('#register-form');
const enviar = formulario.querySelector('button[type= "submit"]');

const datosUsuario = {
    nombre: '',
    apellido: '',
    email: '',
    rol: 'admin',
    password: '',
    rPassword : ''
};

function compararPassword(password, rPassword, padreDelInput) {
    if(password != rPassword) {
        generarAlerta('Las contraseñas no coinciden', padreDelInput)
        return;
    }; 
    limpiarError(padreDelInput);
}

function estadoSubmit() {
    const alerta = formulario.querySelector('.error');
    if(Object.values(datosUsuario).includes('') || alerta) {
        enviar.disabled = true;
        enviar.classList.add('deshabilitar-btn');
        return;
    };
    enviar.disabled = false;
    enviar.classList.remove('deshabilitar-btn');
}

function validarPassword(password) {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const resultado = regexPassword.test(password);
    return resultado;
};

function validarEmail(email) {
    const regex =  /^\w+([.-_+]?\w+)@\w+([.-]?\w+)(.\w{2,10})+$/; // Expresion regular
    const resultado = regex.test(email);
    return resultado;
}

function generarAlerta(mensaje, padreDelInput) {
    const alertaExiste = padreDelInput.querySelector('.error');
    if(!alertaExiste) {
        const alerta = document.createElement('P');
        alerta.setAttribute('class', 'error');
        alerta.textContent = mensaje;
        alerta.style.whiteSpace = 'pre-line';
        padreDelInput.appendChild(alerta);
    };
};

function limpiarError(padreDelInput) {
    const alerta = padreDelInput.querySelector('.error');
    if(alerta) {
        alerta.remove();
    };
};

function validar(e) {
    if(e.target.value.trim() === '') {
        limpiarError(e.target.parentElement);//es para el campo email
        generarAlerta('Este campo es obligatorio', e.target.parentElement);
        datosUsuario[e.target.name]= '';
        return;
    } 
    limpiarError(e.target.parentElement);
    datosUsuario[e.target.name] = e.target.value.trim();
    if (e.target.name === 'email') {
        const resultado = validarEmail(e.target.value.trim());
        if(!resultado) {
            generarAlerta('Debe ingresar un email valido', e.target.parentElement);
            return;
        };
        limpiarError(e.target.parentElement);
    }; 
    if (e.target.name === 'password') {
        const resultado = validarPassword(e.target.value.trim());
        if(!resultado) {
            generarAlerta(`La contraseña debe tener entre 8 y 16 caracteres,\nal menos un dígito,\nal menos una minúscula,\nal menos una mayúscula,\nal menos un carácter especial (como @, #, $, etc.)`, e.target.parentElement);
            if(datosUsuario.rPassword) {
                compararPassword(e.target.parentElement.nextElementSibling);
            };
            return;
        };
        limpiarError(e.target.parentElement);
        if(datosUsuario.rPassword) {
            compararPassword(e.target.value.trim(), datosUsuario.rPassword, e.target.parentElement.nextElementSibling);
        };
    };
    if(e.target.name === 'rPassword') {
        compararPassword(datosUsuario.password, e.target.value.trim(), e.target.parentElement);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    estadoSubmit();
    
    formulario.addEventListener('input', (e) => {
        validar(e);
        estadoSubmit();
    });

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const {rPassword, ...usuario} = datosUsuario;
        console.log(usuario);
        try {
            const respuesta =  await fetch('https://andreagzlez.alwaysdata.net/auth/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usuario) 
            });
            if(!respuesta.ok) {
                console.error('Hubo un error al enviar la informacion al servidor', respuesta.status);
            }

            //Ventana modal mostrando que será redirigido para el inicio de sesion
            if(respuesta.status === 201) {
                window.location.href = '../dashboard/login.html';
            };
            //verificar si el registro fue exitoso y recibir el token.
            /* const autenticacion = await respuesta.json(respuesta); */

            /* if (autenticacion.auth) {
                localStorage.setItem('token', autenticacion.token);
                window.location.href = 'http://127.0.0.1:5501/dashboard/gestion-mascotas/gestion-mascotas.html';
            } else {
                console.error('Error en la autenticación:', autenticacion.error);
            }
 */
        } catch (error) {
            console.error('Hubo un error al comunicarse con el servidor cai aca', error)
        };
    });
});