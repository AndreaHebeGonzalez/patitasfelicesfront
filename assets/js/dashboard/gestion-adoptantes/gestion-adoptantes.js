const contenedorPadre = document.querySelector(".adoptantes");

let url = "http://localhost:3000/adoptantes";

async function solicitarAdoptantes(url) {
  try {
    const respuesta = await fetch(url); /* Metodo get por defecto */
    if (!respuesta.ok) {
      console.log("Error al solicitar los adoptantes");
      return;
    }
    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.error("Error al solicitar los adoptantes", error);
  }
}

async function renderizarAdoptantes(url) {
  try {
    const adoptantesLista = await solicitarAdoptantes(url);
    console.log(adoptantesLista);
    //Verificar que adoptanteLista contenga algo
    if (adoptantesLista) {
      iterarAdoptantesLista(adoptantesLista);
      return adoptantesLista; //Retorno el array de adoptante que viene de la base de datos para usarlo en el filtrado por nombre
    }
  } catch (error) {
    console.error("Error al renderizar los adoptantes:", error);
  }
}

function iterarAdoptantesLista(adoptantesLista) {
  console.log(adoptantesLista);
  adoptantesLista.map((adoptante) => {
    const adoptanteContenedor = document.createElement("tr");

    adoptanteContenedor.setAttribute("data-id", `${adoptante.id}`); // es común y estandarizado usar atributos personalizados de datos con el prefijo data-, como data-id.

    const contenidoAdoptante = `
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td> 
                                            <div class="btn__contenedor">
                                                <button class="btn__icono btn__icono-table" onclick="window.location.href='./editar-adoptante.html?id=${adoptante.id}';">
                                                    <img
                                                    src="../../assets/img/iconos/ico-editar-primary.svg"
                                                    alt="ícono lápiz"
                                                    />
                                                </button>
                                                <button class="btn__icono btn__icono-table">
                                                    <img
                                                    src="../../assets/img/iconos/ico-borrar-gray.svg"
                                                    alt="ícono tachito de basura"
                                                    />
                                                </button>
                                            </div>
                                        </td>`;
    adoptanteContenedor.innerHTML = contenidoAdoptante;
    contenedorPadre.appendChild(adoptanteContenedor);
    const campos = adoptanteContenedor.querySelectorAll("td");
    campos[0].textContent = adoptante.nombre_apellido;
    campos[1].textContent = adoptante.telefono;
    campos[2].textContent = adoptante.email;
    campos[3].textContent = adoptante.dni;
    campos[4].textContent = adoptante.vivienda;
    campos[5].textContent = adoptante.ID_perrito;

    //Agrego la url del formulario al boton editar y paso el id como parámetro en la url
    // const btnTable = adoptanteContenedor.querySelector(
    //   ".btn__icono .btn__icono-table"
    // );
    // btnTable.setAttribute("href", `./editar-mascota.html?id=${adoptante.id}`);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  let adoptantes = await renderizarAdoptantes(url);
});
