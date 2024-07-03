const formulario = document.querySelector(".form");
const nombre = document.querySelector("#nombre")
const telefono = document.querySelector("#telefono")
const email = document.querySelector("#email")
const dni = document.querySelector("#dni")
const vivienda = document.querySelector('input[name="vivienda"]');
const errorContainer = document.querySelector("#errorContainer");

const nombreMascota = document.querySelector('.nombre-mascota');

const enviar = document.querySelector('input[type="submit"]');

let errorValidacion;

const adoptante = {
    nombre_apellido: "",
    telefono: "",
    email: "",
    dni: "",
    vivienda: "",
    ID_perrito: "",
};

const urlParams = new URLSearchParams(window.location.search);
const ID_perrito = urlParams.get("id");
adoptante.ID_perrito = ID_perrito;
nombreMascota.textContent = urlParams.get("nombre");



const error = (mensaje) => {
    errorValidacion = true;
    errorContainer.classList.add("mostrar-error");
    errorContainer.innerHTML += `
    <p>${mensaje}</p>`;
}

const validar = (dato, min) => {
    if(dato.name === "vivienda") {
        if(adoptante.vivienda === '') {
            error(`El tipo de ${dato.name} es un campo requerido.`)
        }
    }

    if (dato.name != "email" && dato.name != "vivienda") {
        if (dato.value.trim().length === 0) {
            error(`El ${dato.name} es un campo requerido.`)
        } else if (dato.value.trim().length < min) {
            error(`El ${dato.name} es demasiado corto. Por favor, asegúrate de ingresar al menos ${min} caracteres.</p>`);
        }
    }
    else  {
        if (dato.value.trim().length === 0) {
            error(`El ${dato.name} es un campo requerido.`)
        } else if (dato.value.trim().length < min) {
            error(`El correo electrónico ingresado no es válido. Por favor, asegúrate de escribir una dirección de correo electrónico válida.`);
        }
    }
}

const limpiar = (dato) => {
    dato.addEventListener("input", () => {
        if (dato.value.trim().length > 3) {
            errorContainer.classList.remove("mostrar-error");
            console.log('removio')
        }
        if(dato.name == 'vivienda') {
            if(adoptante.vivienda != '') {
                errorContainer.classList.remove("mostrar-error");
            }
        }
    });
}

function capturandoDatos() {
    formulario.addEventListener('input', (e) => {
        adoptante[e.target.name] = e.target.value.trim();
        console.log(adoptante)
    });
}

async function soliEnvioDatos() {
    try {
        const respuesta = await fetch('http://localhost:3000/adoptantes', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adoptante)
        });
    
        if (!respuesta.ok && respuesta.status != 400) {
            console.error(
                "Error al enviar el formulario, código de estado: ",
                respuesta.status
            );
            return;
        };
        if(respuesta.status === 400) {
            console.log('Error 400 recibido desde el servidor');
            generarMensajeError();
            return;
        };
        const status =  respuesta.status;
        return status;
    } catch (error) {
        console.error("Error al enviar la informacion", error);
    }
}


async function cambiarEstadoPerrito() {
    try {
        const respuesta = await fetch(`http://localhost:3000/perritos/cambiarestado/${ID_perrito}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ estado_adopcion: 'en proceso'} )
        });
    
        if (!respuesta.ok) {
            console.error(
                "Error al cambiar estado de adopcion, código de estado: ",
                respuesta.status
            );
            return;
        };
        const statusCambioEstado =  respuesta.status;
        return statusCambioEstado;
    } catch (error) {
        console.error("Error al cambiar estado de adopcion", error);
    }
};

async function enviarDatos() {
    const status = await soliEnvioDatos();
    console.log('status envio de informacion', status)
    if(status === 201) {
        const statusCambioEstado  = await cambiarEstadoPerrito();
        console.log('status cambio de estado', statusCambioEstado);
        if(statusCambioEstado === 201) {
            enviado.style.display = "block";
            enviado.textContent = "Hemos recibido tu solicitud de adopción. Nos pondremos en contacto contigo en los próximos días. ¡Gracias por darle a un perrito la oportunidad de tener una familia!";
            enviar.disabled = true;
        };
    };
};

function generarMensajeError() {
    console.log('se ejecuto la generacion de mensaje')
    const contenedorPadre = document.querySelector('.section__form');
    const error = document.createElement('P');
    error.setAttribute('class', 'mensaje-error');
    error.textContent = 'Tu solicitud para este perrito ya ha sido registrada!';
    contenedorPadre.appendChild(error);
    enviar.disabled = true;
    setTimeout(() => {
        location.reload();
    }, 3000);
};

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    errorContainer.innerHTML = "";
    errorContainer.classList.remove("mostrar-error");
    errorValidacion = false;

    validar(nombre, 3)
    validar(telefono, 10)
    validar(email, 3)
    validar(dni, 10);
    validar(vivienda);

    if (!errorValidacion) {
        enviarDatos();
    };
});

capturandoDatos();

limpiar(nombre);
limpiar(telefono);
limpiar(email);
limpiar(dni);
limpiar(vivienda)

