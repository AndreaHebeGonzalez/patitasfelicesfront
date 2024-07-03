const contenedorPadre = document.querySelector(".adopciones");

let url = "http://localhost:3000/relaciones/adopciones";

async function solicitarAdopciones(url) {
  try {
    const respuesta = await fetch(url); /* Metodo get por defecto */
    if (!respuesta.ok) {
      console.log("Error al solicitar las adopciones");
      return;
    }
    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.error("Error al solicitar las adopciones", error);
  }
}

async function renderizarAdopciones(url) {
  try {
    const adopcionesLista = await solicitarAdopciones(url);
    console.log(adopcionesLista);
    if (adopcionesLista) {
      iterarAdopcionesLista(adopcionesLista);
      return adopcionesLista;
    }
  } catch (error) {
    console.error("Error al renderizar los postulantes:", error);
  } 
}

function iterarAdopcionesLista(adopcionesLista) {
  console.log(adopcionesLista);
  adopcionesLista.map((adopcion) => {
    let indicefinal = adopcion.fecha_adopcion.indexOf('T');
    let fechaAdopcion = adopcion.fecha_adopcion.slice(0, indicefinal);
    const adopcionesContenedor = document.createElement("tr");

    adopcionesContenedor.setAttribute("data-id", `${adopcion.id}`); // es común y estandarizado usar atributos personalizados de datos con el prefijo data-, como data-id.

    const contenidoAdopciones = `
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>`;
    adopcionesContenedor.innerHTML = contenidoAdopciones;
    contenedorPadre.appendChild(adopcionesContenedor);
    let nombrePerrito = adopcion.nombre_perrito;
    nombrePerrito = nombrePerrito.charAt(0).toUpperCase() + nombrePerrito.slice(1);
    const campos = adopcionesContenedor.querySelectorAll("td");
    campos[0].textContent = adopcion.nombre_apellido;
    campos[1].textContent = adopcion.telefono;
    campos[2].textContent = adopcion.email;
    campos[3].textContent = nombrePerrito; 
    campos[4].textContent = adopcion.id_perrito; 
    campos[5].textContent = fechaAdopcion; 
  });
} 

document.addEventListener("DOMContentLoaded", async () => {
    renderizarAdopciones(url);
});