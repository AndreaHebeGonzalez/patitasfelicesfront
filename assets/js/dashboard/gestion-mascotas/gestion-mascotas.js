
const contenedorPadre = document.querySelector('.contenido-dinamico');
console.log(contenedorPadre);

async function mostrarPerritos() {
    try {
        const respuesta = await fetch('http://localhost:3000/perritos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': document.cookie.split('=')[1]
            },
        }); /* Metodo get por defecto */
        if (!respuesta.ok) {
            console.log('Error al solicitar los perritos');
            return
        };
        const data = await respuesta.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error al solicitar los perritos', error);
    }
}

async function renderizarCard() {
    try {
        const perritosLista = await mostrarPerritos(); /* Esto es un array de objetos, cada objeto es un perrito */
        //! Verificar que perrito contenga algo
        perritosLista.map((perrito) => {
            const urlbase = "http://localhost:3000/";

            const urlCompleta = `${urlbase}${perrito.img_url}`;

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
                                <div id="spinner" class="spinner">
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
                                <a href="./editar-mascota.html" class="btn__secundary btn__icono">
                                    <img src="../assets/img/iconos/ico-editar.svg" alt="icono de editar"> Editar
                                </a>
                                <button class="btn__secundary btn__secundary--dark btn__icono">
                                    <img src="../assets/img/iconos/ico-borrar.svg" alt="icono de eliminar"> Borrar
                                </button>
                                <button class="btn__secundary btn__secundary--azul">Postulantes</button>
                            </div>`;
            mascotaContenedor.innerHTML = contenidoMascota;
            contenedorPadre.appendChild(mascotaContenedor);
            const campos = mascotaContenedor.querySelectorAll('.mascota__valor');
            campos[0].textContent = perrito.nombre;
            campos[1].textContent = perrito.genero;
            campos[2].textContent = perrito.edad;
            campos[3].textContent = perrito.tamaño;
            campos[4].textContent = perrito.condicion_medica;
            campos[5].textContent = perrito.estado_adopcion;
            campos[6].textContent = perrito.fecha_ingreso;
        });
    } catch (error) {
        console.error('Error al renderizar las cards de perritos:', error);
    }
}

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
        console.log(`Mascota con ${id} fue borrada exitosamente`);
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

contenedorPadre.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn__borrar')) {
        console.log('se hizo clic en el boton borrar');
        const contenedorMascota = e.target.closest('.mascota');
        console.log(contenedorMascota);
        if (contenedorMascota) {
            id_perrito = contenedorMascota.getAttribute('data-id');
            eliminarPerrito(id_perrito, contenedorMascota);
        } else {
            console.log('No se encontró el elemento asociado al botón de borrar.');
        }
    };
});

document.addEventListener('DOMContentLoaded', mostrarPerritos);