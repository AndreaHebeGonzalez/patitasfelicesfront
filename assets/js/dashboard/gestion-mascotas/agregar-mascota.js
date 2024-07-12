//Definicion de variables globales y funciones

const perrito = {
    nombre: '',
    genero: 'macho',
    edad: '',
    condicion_medica: '',
    tamano: 'pequeño',
    estado_adopcion: 'libre',
    url_img: '',
};


//Seleccionar los elemetos de la interfaz
const formulario = document.querySelector('#formulario_mascota');
const btnSubmit = document.querySelector('#formulario_mascota button[type="submit"]');
const btnReset = document.querySelector('#formulario_mascota button[type="reset"]');


function validar(e) {
    /* e.target devuelve el elemento html en especifico donde se genero el evento, devuelve el input donde se esta escribiendo */
    /* e.target.value devuelve el valor ingresado en el campo*/
    /* e.target.name devuelve el nombre del campo */
    /* console.log(e.target.parentElement) */ /* Me devuelve el primer padre del elemento */
    /* console.log(e.target.parentElement.nextElementSibling); */ /* Me devuelve el elemento siguiente del mismo nivel */


    if(e.target.value.trim() === '') {
        mostrarAlerta('Este campo es obligatorio', e.target.parentElement);
        perrito[e.target.name] = '';
        estadoBtnEnviar();
        console.log(perrito);
        return; /* Detengo la ejecucion del codigo que sigue si la condicion de este bloque se cumple */
    };

    //Agregar valores al objeto perrito:
    if(e.target.name === 'url_img') {
        perrito[e.target.name] = e.target.files[0];
    } else {
        perrito[e.target.name] = e.target.value.trim().toLowerCase();
    } 
    
    console.log(perrito);
    
    estadoBtnEnviar();
    limpiarAlerta(e.target.parentElement);                  
};

// Creo funcion para crear alerta de error, uso al padre del Input para agregar al final de ese div el mesaje de error
function mostrarAlerta(mensajeError, padreDelInput) {
    //Compruebo si existe una alerta dentro del contenedor del input, si existe no creo una nueva alerta si el evento vuelve a producirse
    const alerta = padreDelInput.querySelector('.error');
    if(!alerta) {
        const error = document.createElement('P');
        error.setAttribute('class', 'error');
        error.textContent = mensajeError;
        padreDelInput.appendChild(error); /* Agrego el parrafo creado al final del contenedor del input */
    }
};


function limpiarAlerta(padreDelInput) {
    const alerta = padreDelInput.querySelector('.error');
    //Si la alerta esta la remuevo
    if (alerta) {
        alerta.remove(); //metodo nativo para remover la alerta
    }
};


function estadoBtnEnviar() {
    if(Object.values(perrito).includes('')) { /* Si uno de todos los campos del objeto mail tiene comillas vacias entoces entra al bloque */
        btnSubmit.classList.add('deshabilitar-btn');
        btnSubmit.disabled = true;
        return;
    };
    btnSubmit.classList.remove('deshabilitar-btn');
    btnSubmit.disabled = false;
};

/* Ventana modal aparece cuando se borra un perrito */

function mostrarVentanaModal() {
    const ventanaModal = document.querySelector(".ventana-modal");
    ventanaModal.classList.add('mostrar-ventana-modal'); /* Muestro ventana modal */
    setTimeout(() => {
        ventanaModal.classList.remove('mostrar-ventana-modal'); /* Saco ventana modal despues de 4 segundos */
        setTimeout(() => {
            location.reload(); // Recarga la página
        }, 500); // Espera 500ms para asegurarse de que el modal esté completamente cerrado antes de recargar
    }, 3000);
};

document.addEventListener('DOMContentLoaded', () => {
    
    estadoBtnEnviar();

     //Agrego escuchador de evento input a la etiqueta form, al pasarle el evento e, y usar e.target se va a detectar el input en el cual se esta escribiendo:
    formulario.addEventListener('input', (e) => {
        validar(e);
    });

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData(); /* Lo necesito porque envio un archivo img */
        console.log(perrito)

        for(const key in perrito) {
            formData.append(key, perrito[key]);
        };

        try {
            const respuesta = await fetch('https://andreagzlez.alwaysdata.net/perritos', {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${token}`,
                },
                body: formData
            });
            if(!respuesta.ok) {
                console.error('Error al enviar el formulario, código de estado: ', respuesta.status);
                return;
            };
            /* Agregar spinner */
            const spinnerActual = document.querySelector('.spinner');
            spinnerActual.classList.remove('d-none');
            setTimeout(() => {
                spinnerActual.classList.add('d-none');
                mostrarVentanaModal();
            }, 3000);

        } catch (error) {
            console.error('Error al enviar la informacion', error);
        }

    });
});