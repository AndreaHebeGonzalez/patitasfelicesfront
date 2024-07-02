const contenedorPadre = document.querySelector(".postulantes");

//Como parametro viene el id del perrito
const urlParametros = new URLSearchParams(window.location.search);
let url = "http://localhost:3000/relaciones/postulaciones";

async function solicitarPostulaciones(url) {
  try {
    const respuesta = await fetch(url); /* Metodo get por defecto */
    if (!respuesta.ok) {
      console.log("Error al solicitar las postulaciones", respuesta.status);
      return;
    }
    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.error("Error al solicitar las postulaciones", error);
  }
}

async function renderizarPostulaciones(url) {
  try {
    const postulantesLista = await solicitarPostulaciones(url);
    console.log(postulantesLista);
    if (postulantesLista) {
      iterarPostulantesLista(postulantesLista);
      return postulantesLista;
    }
  } catch (error) {
    console.error("Error al renderizar los postulantes:", error);
  } 
}

function iterarPostulantesLista(postulantesLista) {
  console.log(postulantesLista);
  postulantesLista.map((postulante) => {
    const postulantesContenedor = document.createElement("tr");
	postulantesContenedor.setAttribute("class", "adopcion-cont")
    postulantesContenedor.setAttribute("data-id", `${postulante.id}`); // es común y estandarizado usar atributos personalizados de datos con el prefijo data-, como data-id.

    const contenidoPostulante = `
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="d-none cont-btn-seleccionar"> 
                                          <div class="btn__contenedor btn__contenedor--center">
                                              <button class="btn__icono btn__seleccionar">
                                                  
                                              </button>
                                          </div>
                                        </td>`;
    postulantesContenedor.innerHTML = contenidoPostulante;
    contenedorPadre.appendChild(postulantesContenedor);
    let nombrePerrito = postulante.nombre_perrito;
    nombrePerrito = nombrePerrito.charAt(0).toUpperCase() + nombrePerrito.slice(1);
    const campos = postulantesContenedor.querySelectorAll("td");
    campos[0].textContent = postulante.nombre_apellido;
    campos[1].textContent = postulante.telefono;
    campos[2].textContent = postulante.email;
    campos[3].textContent = postulante.vivienda;
    campos[4].textContent = nombrePerrito; 
    campos[5].textContent = postulante.id_perrito; 

    if(urlParametros.has('id')){
		const btnSeleccionar = postulantesContenedor.querySelector('.cont-btn-seleccionar');
		btnSeleccionar.classList.remove('d-none');
    }
    
  });
} 


async function agregarAdopcion(id_perrito, id_adoptante) {
	try {
		const respuesta = await fetch('http://localhost:3000/relaciones/adopciones', {
			method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_perrito, id_adoptante })
		}); 
		if (!respuesta.ok) {
		  console.log("Error al generar adopcion", respuesta.status);
		  return;
		}
		const status = respuesta.status;
		return status;
	  } catch (error) {
		console.error("Error al solicitar generar adopcion", error);
	  }
};

async function borrarPostulaciones(id_perrito) {
	try {
        const respuesta = await fetch(`http://localhost:3000/relaciones/postulaciones/${id_perrito}`, {
            method: 'DELETE',
        });
        if (!respuesta.ok) {
            console.error('Error al eliminar postulaciones. Codigo de estado: ', respuesta.status);
            return;
        } 
        const status = respuesta.status;
    } catch (error) {
        ('Error al eliminar la mascota:', error);
    };   
}

async function cambiarEstadoPerrito(id_perrito) {
    try {
        const respuesta = await fetch(`http://localhost:3000/perritos/cambiarestado/${id_perrito}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ estado_adopcion: 'adoptado'} )
        });
    
        if (!respuesta.ok) {
            console.error(
                "Error al cambiar estado de adopcion, código de estado: ",
                respuesta.status
            );
            return;
        };
        console.log('El estado del perrito se cambio a adoptado');
    } catch (error) {
        console.error("Error al cambiar estado de adopcion", error);
    }
};

async function generarAdopcion(id_perrito, id_adoptante) {
	const status = await agregarAdopcion(id_perrito, id_adoptante);
	console.log(status)
	if(status === 201) {
		borrarPostulaciones(id_perrito);
		cambiarEstadoPerrito(id_perrito);
	};
};

function clickBtnSeleccionar(id_perrito) {
	contenedorPadre.addEventListener('click', async (e) => {
		if(e.target.classList.contains('btn__seleccionar')) {
			console.log('se hizo clic en el boton seleccionnar');
			const contenedorRegistro = e.target.closest('.adopcion-cont'); 
			console.log(contenedorRegistro);
			if(contenedorRegistro) {
				const id_adoptante = contenedorRegistro.getAttribute('data-id'); 
				generarAdopcion(id_perrito, id_adoptante);
				window.location.href = `../gestion-adoptantes/dashboard-adopciones.html`;       
			} else {
				console.log('No se encontró el elemento asociado al botón');
			}
		};
	});
}

document.addEventListener("DOMContentLoaded", async () => {

    // Pregunto si hay parametros en la url:
    
    if (urlParametros.has('id')) {
        const id = urlParametros.get('id');
        const acciones = document.querySelector('.acciones');
        acciones.classList.remove('d-none');
        const urlPostulantesPerrito = `http://localhost:3000/relaciones/perritos/${id}/adoptantes`
        renderizarPostulaciones(urlPostulantesPerrito);
		clickBtnSeleccionar(id);
        console.log(id)
    } else {
        //Como no hay parametros renderizo todas las postulaciones
        renderizarPostulaciones(url);
    }
});