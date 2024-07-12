const formulario = document.querySelector('#login-form');
const enviar = formulario.querySelector('button[type= "submit"]');

const datosUsuario = {
    email: '',
    password: '',
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

function estadoSubmit() {
    const alerta = formulario.querySelector('.error');
    if(Object.values(datosUsuario).includes('') || alerta) {
        enviar.disabled = true;
        enviar.classList.add('deshabilitar-btn');
        return;
    };
    enviar.disabled = false;
    enviar.classList.remove('deshabilitar-btn');
};

function validar(e) {
    if(e.target.value.trim() === '') {
        limpiarError(e.target.parentElement);
        generarAlerta('Este campo es obligatorio', e.target.parentElement);
        datosUsuario[e.target.name]= '';
        return;
    }; 
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
};

estadoSubmit();

formulario.addEventListener('input', (e) => {
    validar(e);
    estadoSubmit();
});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(datosUsuario);
    try {
        const respuesta =  await fetch('https://andreagzlez.alwaysdata.net/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosUsuario) 
        });
        if(!respuesta.ok) {
            console.error('Error al autenticar', respuesta.status);
        }
        const autenticacion = await respuesta.json(respuesta);

        if(autenticacion.auth) {
            localStorage.setItem('token', autenticacion.token);
            window.location.href = 'https://patitasfelices-omega.vercel.app/dashboard/gestion-mascotas/gestion-mascotas.html';
        } else {
            console.error('Error en la autenticación:', autenticacion.error);
        };

    } catch (error) {
        console.error('Error al comunicarse con el servidor', error);
    }
});