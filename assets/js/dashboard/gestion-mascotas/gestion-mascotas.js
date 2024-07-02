
const contenedorPadre = document.querySelector('.contenido-dinamico');

const url = 'http://localhost:3000/perritos'

async function solicitarPerritos(url) {
    try {
        const respuesta = await fetch(url); /* Metodo get por defecto */
        if (!respuesta.ok) {
            console.log('Error al solicitar los perritos');
            return 
        };
        const datos = await respuesta.json();
        return datos;
        
    } catch (error) {
        console.error('Error al solicitar los perritos', error);
    }
}

function iterarPerritosLista(perritosLista) {
    perritosLista.map((perrito) => {
        let indicefinal = perrito.fecha_ingreso.indexOf('T');
        let fechaIngreso = perrito.fecha_ingreso.slice(0, indicefinal);

        const urlbase = "http://localhost:3000/";
        const urlCompleta= `${urlbase}${perrito.url_img}`;

        const mascotaContenedor = document.createElement('div');
        mascotaContenedor.setAttribute('class', 'mascota');
        mascotaContenedor.setAttribute('data-id', `${perrito.id}`); // es común y estandarizado usar atributos personalizados de datos con el prefijo data-, como data-id. 

        const contenidoMascota = 
                        `<div class="mascota__card">
                            <figure class="card__imagen">
                                <img src=${urlCompleta} alt="Imagen de mascota">
                            </figure>
                            <table class="mascota__informacion">
                                <tr class="mascota__fila">
                                    <td class="mascota__campo"><strong>Nombre:</strong></td>
                                    <td class="mascota__valor"></td>
                                </tr>
                                <tr class="mascota__fila">
                                    <td class="mascota__campo"><strong>Género</strong></td>
                                    <td class="mascota__valor"></td>
                                </tr>
                                <tr class="mascota__fila">
                                    <td class="mascota__campo"><strong>Edad:</strong></td>
                                    <td class="mascota__valor"></td>
                                </tr>
                                <tr class="mascota__fila">
                                    <td class="mascota__campo"><strong>Condición Médica:</strong></td>
                                    <td class="mascota__valor"></td>
                                </tr>
                                <tr class="mascota__fila">
                                    <td class="mascota__campo"><strong>Tamaño:</strong></td>
                                    <td class="mascota__valor"></td>
                                </tr>
                                <tr class="mascota__fila">
                                    <td class="mascota__campo"><strong>Estado de adopción:</strong></td>
                                    <td class="mascota__valor"></td>
                                </tr>
                                <tr class="mascota__fila">
                                    <td class="mascota__campo"><strong>Fecha de ingreso:</strong></td>
                                    <td class="mascota__valor"></td>
                                </tr>
                            </table>
                            <div id="spinner" class="spinner d-none">
                                <div class="sk-chase">
                                    <div class="sk-chase-dot"></div>
                                    <div class="sk-chase-dot"></div>
                                    <div class="sk-chase-dot"></div>
                                    <div class="sk-chase-dot"></div>
                                    <div class="sk-chase-dot"></div>
                                    <div class="sk-chase-dot"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mascota__acciones">
                            <a href="./editar-mascota.html" class="btn__secundary btn__icono btn_editar">
                                <img src="../../assets/img/iconos/ico-editar.svg" alt="icono de editar"> Editar
                            </a>
                            <button class="btn__secundary btn__secundary--dark btn__icono btn__borrar">
                                <img src="../../assets/img/iconos/ico-borrar.svg" alt="icono de eliminar"> Borrar
                            </button>
                            <a class="btn__secundary btn__secundary--azul d-none btn__postulantes">Postulantes</a>
                        </div>`;
        mascotaContenedor.innerHTML = contenidoMascota;
        contenedorPadre.appendChild(mascotaContenedor);
        const campos = mascotaContenedor.querySelectorAll('.mascota__valor');
        campos[0].textContent = perrito.nombre;
        campos[1].textContent = perrito.genero;
        campos[2].textContent = perrito.edad;
        campos[3].textContent = perrito.condicion_medica;
        campos[4].textContent = perrito.tamano; 
        campos[5].textContent = perrito.estado_adopcion;
        campos[6].textContent = fechaIngreso;

        if(perrito.estado_adopcion === 'en proceso') {
            const btnPostulantes = mascotaContenedor.querySelector('.btn__postulantes');
            if(btnPostulantes) {
                btnPostulantes.classList.remove('d-none');
            }
        };
        //Agrego la url del formulario al boton editar y paso el id como parámetro en la url
        const btnEditar = mascotaContenedor.querySelector('.btn_editar');
        btnEditar.setAttribute('href', `./editar-mascota.html?id=${perrito.id}`);
    });
};

async function renderizarCards(url) {
    try {
        const perritosLista = await solicitarPerritos(url); /* Esto es un array de objetos, cada objeto es un perrito */
        //Verificar que perritoLista contenga algo
        if(perritosLista) {
            iterarPerritosLista(perritosLista); 
            return perritosLista; //Retorno el array de perrito que viene de la base de datos para usarlo en el filtrado por nombre
        };
    } catch (error) {
        console.error('Error al renderizar las cards: ', error);
    };
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

/* Consulta para eliminar perrito */

async function eliminarPerrito(id, contenedorMascota) {
    try {
        const respuesta = await fetch(`http://localhost:3000/perritos/${id}`, {
            method: 'DELETE',
        });
        if (!respuesta.ok) {
            console.error('Error al eliminar la mascota. Codigo de estado: ', respuesta.status);
            return;
        } 
        console.log(`Mascota con id ${id} fue borrada exitosamente`);
        /* Activo spinner */
        const spinnerActual = contenedorMascota.querySelector('.spinner');
        spinnerActual.classList.remove('d-none');
        setTimeout(() => {
            spinnerActual.classList.add('d-none');
            mostrarVentanaModal();
        }, 3000);
    } catch (error) {
        ('Error al eliminar la mascota:', error);
    };     
};


function limpiarRenderizado() {
    while(contenedorPadre.firstChild) {
        contenedorPadre.removeChild(contenedorPadre.firstChild);
    };
};


function clickBtn(btnClase) { //paso clase
    //Campturo click en boton postulantes 
    contenedorPadre.addEventListener('click', async (e) => {
        if(e.target.classList.contains(btnClase)) {
            console.log('se hizo clic en el boton postulantes');
            const contenedorMascota = e.target.closest('.mascota'); //Ancestro mas cercano con la clase mascota
            console.log(contenedorMascota);
            if(contenedorMascota) {
                const id = contenedorMascota.getAttribute('data-id'); 
                if(btnClase == 'btn__postulantes') {
                    e.target.setAttribute('href', `../gestion-adoptantes/dashboard-postulaciones.html?id=${id}`)
                } else {
                    eliminarPerrito(id, contenedorMascota); 
                }
            } else {
                console.log('No se encontró el elemento asociado al botón');
            }
        };
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    //Guardo en variable let la lista de perritos
    let perritos = await renderizarCards(url);

    //Capturo el click en el boton borrar

    clickBtn('btn__borrar');
    clickBtn('btn__postulantes');

    //filtrados -------> 
    
    const porNombre = document.querySelector('#fNombre');
    const porTamaño = document.querySelector('#ftamaño');
    const porEstadoAdopcion = document.querySelector('#fEstadoAdopcion');

    porNombre.addEventListener('input', (e) => {
        limpiarRenderizado();
        const perritoFiltrado = perritos.filter((perrito) => {
            return perrito.nombre.toLowerCase().includes(e.target.value.toLowerCase());
        });
        iterarPerritosLista(perritoFiltrado);
    })

    porTamaño.addEventListener('input', () => {
        if(porTamaño.value === 'pequeño') {
            const urlFTamaño = 'http://localhost:3000/perritos/filtrarportamano/pequeno';
            limpiarRenderizado();
            renderizarCards(urlFTamaño);
            
        }else if(porTamaño.value === 'mediano' || porTamaño.value === 'grande')  {
            const urlFTamaño = `http://localhost:3000/perritos/filtrarportamano/${porTamaño.value}`;
            limpiarRenderizado();
            renderizarCards(urlFTamaño);
        }else {
            limpiarRenderizado();
            renderizarCards(url);
        };
    });

    porEstadoAdopcion.addEventListener('input', () => {
        if(porEstadoAdopcion.value != '') {
            const urlEstadoAdopcion = `http://localhost:3000/perritos/filtrarporestado/${porEstadoAdopcion.value}`;
            limpiarRenderizado();
            renderizarCards(urlEstadoAdopcion);
        } else {
            limpiarRenderizado();
            renderizarCards(url);
        }
    });
});
