//Definicion de variables globales y funciones:

const perritoActualizado = {
    nombre: '',
    genero: '',
    edad: '',
    condicion_medica: '',
    tamano: '',
    estado_adopcion: '',
    url_img: '',
};


// Obtener el ID del perrito desde la URL
const urlParams = new URLSearchParams(window.location.search);
const perritoId = urlParams.get('id');

// Obetener formualario 
const formulario = document.querySelector('#formulario_mascota');
const btnSubmit = document.querySelector('#formulario_mascota button[type="submit"]');
const btnReset = document.querySelector('#formulario_mascota button[type="reset"]');

 /* Ventana modal aparece cuando se borra un perrito */

function mostrarVentanaModal() {
    const ventanaModal = document.querySelector(".ventana-modal");
    ventanaModal.classList.add('mostrar-ventana-modal'); /* Muestro ventana modal */
    setTimeout(() => {
        ventanaModal.classList.remove('mostrar-ventana-modal'); /* Saco ventana modal despues de 4 segundos */
        setTimeout(() => {
            location.reload(); 
        }, 500); 
    }, 3000);
};

//Solicito la informacion del perrito por su id guardada en la base de datos

async function obtenerPerrito() {
    const token = localStorage.getItem('token');
    try {
        const respuesta = await fetch(`https://andreagzlez.alwaysdata.net/perritos/${perritoId}`, {
            headers: {
                'authorization': `Bearer ${token}`,
            },
        });
        if(!respuesta.ok) {
            console.log('Error al solicitar perrito por su id, codigo de estado: ', respuesta.status);
            return null;
        };
        const data = await respuesta.json();
        return data;
    } catch(error) {
        console.log('Error', error);
    };
};

async function agregarValores() {
    const perritoActual = await obtenerPerrito();
    console.log(perritoActual);
    if(perritoActual) {
        for(const key in perritoActual) {
            const input = formulario.querySelector(`[name="${key}"]`);
            if(input) {
                if(input.tagName != 'SELECT' && input.type != 'file') {
                    input.value = perritoActual[key].charAt(0).toUpperCase() + perritoActual[key].slice(1);
                } else if (input.type != 'file') {
                    input.value = perritoActual[key];
                };
            };
        };
    };
};

document.addEventListener('DOMContentLoaded', () => {

    agregarValores();

    formulario.addEventListener('input', (e) => {
        perritoActualizado[e.target.name] = e.target.value.trim();
        console.log(perritoActualizado);
    });

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        /* for(const key in perritoActualizado) {
            perritoActualizado[key] = perritoActualizado[key] || perritoActual[key];
        };
 */
        console.log(perritoActualizado);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        for(const key in perritoActualizado) {
            formData.append(key, perritoActualizado[key]);
        };

        try {
            const respuesta = await fetch(`https://andreagzlez.alwaysdata.net/perritos/${perritoId}`, {
                method: 'PUT',
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
            console.log('llegue hasta aca')
            const spinnerActual = document.querySelector('.spinner');
            spinnerActual.classList.remove('d-none');
            setTimeout(() => {
                spinnerActual.classList.add('d-none');
                mostrarVentanaModal();
            }, 3000);

        } catch (error) {
            console.error('Error al enviar la informacion', error);
        }
        
        console.log(formData);
    });
});