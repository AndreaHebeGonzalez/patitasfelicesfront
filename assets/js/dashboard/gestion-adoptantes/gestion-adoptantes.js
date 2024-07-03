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
    // Verificar que adoptanteLista contenga algo
    if (adoptantesLista) {
      iterarAdoptantesLista(adoptantesLista);
      return adoptantesLista; // Retorno el array de adoptante que viene de la base de datos para usarlo en el filtrado por nombre
    }
  } catch (error) {
    console.error("Error al renderizar los adoptantes:", error);
  }
}

function iterarAdoptantesLista(adoptantesLista) {
  console.log(adoptantesLista);
  adoptantesLista.map((adoptante) => {
    const adoptanteContenedor = document.createElement("tr");
    adoptanteContenedor.setAttribute("class", "adoptante");
    adoptanteContenedor.setAttribute("data-id", `${adoptante.id}`); // es común y estandarizado usar atributos personalizados de datos con el prefijo data-, como data-id.

    const contenidoAdoptante = `
      <td>${adoptante.nombre_apellido}</td>
      <td>${adoptante.telefono}</td>
      <td>${adoptante.email}</td>
      <td>${adoptante.dni}</td>
      <td>${adoptante.vivienda}</td>
      <td> 
        <div class="btn__contenedor">
          <button class="btn__icono btn__icono-table" onclick="window.location.href='./editar-adoptante.html?id=${adoptante.id}';">
            <img src="../../assets/img/iconos/ico-editar-primary.svg" alt="ícono lápiz" />
          </button>
          <button class="btn__icono btn__icono-table btn__borrar">
            <img src="../../assets/img/iconos/ico-borrar-gray.svg" alt="ícono tachito de basura" />
          </button>
        </div>
      </td>`;

    adoptanteContenedor.innerHTML = contenidoAdoptante;
    contenedorPadre.appendChild(adoptanteContenedor);
  });
}

/* Ventana modal aparece cuando se borra un adoptante */
function mostrarVentanaModal() {
  const ventanaModal = document.querySelector(".ventana-modal");
  ventanaModal.classList.add(
    "mostrar-ventana-modal"
  ); /* Muestro ventana modal */
  setTimeout(() => {
    ventanaModal.classList.remove(
      "mostrar-ventana-modal"
    ); /* Saco ventana modal despues de 4 segundos */
    setTimeout(() => {
      location.reload(); // Recarga la página
    }, 500); // Espera 500ms para asegurarse de que el modal esté completamente cerrado antes de recargar
  }, 3000);
}

/* Consulta para eliminar adoptante */
async function eliminarAdoptante(id, contenedorAdoptante) {
  try {
    const respuesta = await fetch(`http://localhost:3000/adoptantes/${id}`, {
      method: "DELETE",
    });
    if (!respuesta.ok) {
      console.error(
        "Error al eliminar la persona. Codigo de estado: ",
        respuesta.status
      );
      return;
    }
    console.log(`La persona con ${id} fue borrada exitosamente`);

    // Verificar si el contenedorAdoptante es null antes de acceder a classList
    if (contenedorAdoptante) {
      const spinnerActual = contenedorAdoptante.querySelector(".spinner");
      if (spinnerActual) {
        spinnerActual.classList.remove("d-none");
        setTimeout(() => {
          spinnerActual.classList.add("d-none");
          mostrarVentanaModal();
        }, 3000);
      } else {
        console.log(
          "No se encontró el spinner dentro del contenedor del adoptante."
        );
      }
    } else {
      console.log(
        "El contenedor del adoptante no se encontró para mostrar el spinner."
      );
    }
  } catch (error) {
    console.error("Error al eliminar la persona:", error);
  }
}

function limpiarRenderizado() {
  while (contenedorPadre.firstChild) {
    contenedorPadre.removeChild(contenedorPadre.firstChild);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let adoptantes = await renderizarAdoptantes(url);

  contenedorPadre.addEventListener("click", async (e) => {
    if (e.target.closest(".btn__borrar")) {
      const contenedorAdoptante = e.target.closest(".adoptante");

      if (contenedorAdoptante) {
        const id_adoptante = contenedorAdoptante.getAttribute("data-id");
        eliminarAdoptante(id_adoptante, contenedorAdoptante);
      } else {
        console.log("No se encontró el elemento asociado al botón de borrar.");
      }
    }
  });

  // Filtrar
  const porNombre = document.querySelector("#fNombre");
  const porVivienda = document.querySelector("#fVivienda");

  porNombre.addEventListener("input", (e) => {
    limpiarRenderizado();
    const adoptanteFiltrado = adoptantes.filter((adoptante) => {
      return adoptante.nombre_apellido
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    iterarAdoptantesLista(adoptanteFiltrado);
  });

  porVivienda.addEventListener("input", () => {
    if (porVivienda.value != "") {
      const urlVivienda = `http://localhost:3000/adoptantes/filtrarporvivienda/${porVivienda.value}`;
      limpiarRenderizado();
      renderizarAdoptantes(urlVivienda);
    } else {
      limpiarRenderizado();
      renderizarAdoptantes(url);
    }
  });
});
