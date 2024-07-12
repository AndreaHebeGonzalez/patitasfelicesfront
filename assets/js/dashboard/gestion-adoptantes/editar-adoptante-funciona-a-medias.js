//Definicion de variables globales y funciones

const adoptanteActualizado = {
  nombre_apellido: "",
  telefono: "",
  email: "",
  DNI: "",
  vivienda: "",
};

// Obtener el ID del adoptante desde la URL
const urlParams = new URLSearchParams(window.location.search);
const adoptanteId = urlParams.get("id");

// Obetener formualario
const formulario = document.querySelector("#formulario_adoptante");
const btnSubmit = document.querySelector(
  '#formulario_adoptante button[type="submit"]'
);
const btnReset = document.querySelector(
  '#formulario_adoptante button[type="reset"]'
);

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

//Solicito la informacion del adoptante por su id guardada en la base de datos

async function obtenerAdoptante(id) {
  try {
    const respuesta = await fetch(`https://andreagzlez.alwaysdata.net/adoptantes/${id}`);
    console.log(respuesta);
    if (!respuesta.ok) {
      console.log(
        "Error al solicitar adoptante por su id, codigo de estado: ",
        respuesta.status
      );
      return;
    }
    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.log("Error", error);
  }
}

async function agregarValores() {
  let adoptanteActual = await obtenerAdoptante(adoptanteId);
  console.log(adoptanteActual);
  if (adoptanteActual) {
    for (const key in adoptanteActual) {
      const input = formulario.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.tagName != "SELECT") {
          input.value =
            adoptanteActual[key].charAt(0).toUpperCase() +
            adoptanteActual[key].slice(1);
        } else {
          input.value = adoptanteActual[key];
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  agregarValores();

  formulario.addEventListener("input", (e) => {
    adoptanteActualizado[e.target.name] = e.target.value.trim();
  });

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log(adoptanteActualizado);

    try {
      const respuesta = await fetch(
        `https://andreagzlez.alwaysdata.net/adoptantes/${adoptanteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(adoptanteActualizado)
        }
      );
      if (!respuesta.ok) {
        console.error(
          "Error al enviar el formulario, código de estado: ",
          respuesta.status
        );
        return;
      }
      /* Agregar spinner */
      console.log("llegue hasta aca");
      const spinnerActual = document.querySelector(".spinner");
      spinnerActual.classList.remove("d-none");
      setTimeout(() => {
        spinnerActual.classList.add("d-none");
        mostrarVentanaModal();
      }, 3000);
    } catch (error) {
      console.error("Error al enviar la informacion", error);
    }
  });
});