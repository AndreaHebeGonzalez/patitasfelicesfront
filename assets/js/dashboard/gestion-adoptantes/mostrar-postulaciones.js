const contenedorPadre = document.querySelector(".postulantes");

const urlParametros = new URLSearchParams(window.location.search);
let url = "http://localhost:3000/relaciones";

async function solicitarPostulaciones(url) {
  try {
    const respuesta = await fetch(url); /* Metodo get por defecto */
    if (!respuesta.ok) {
      console.log("Error al solicitar las postulaciones");
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
    

    //Agrego la url del formulario al boton editar y paso el id como parámetro en la url
    // const btnTable = adoptanteContenedor.querySelector(
    //   ".btn__icono .btn__icono-table"
    // );
    // btnTable.setAttribute("href", `./editar-mascota.html?id=${adoptante.id}`);
  });
} 

document.addEventListener("DOMContentLoaded", async () => {

    // Pregunto si hay parametros en la url:
    
    if (urlParametros.has('id')) {
      const id = urlParametros.get('id');
        const acciones = document.querySelector('.acciones');
        console.log(acciones)
        acciones.classList.remove('d-none');
        const urlPostulantesPerrito = `http://localhost:3000/relaciones/perritos/${id}/adoptantes`
        renderizarPostulaciones(urlPostulantesPerrito);
        console.log(id)
    } else {
        //Como no hay parametros renderizo todas las postulaciones
        renderizarPostulaciones(url);
    }
});