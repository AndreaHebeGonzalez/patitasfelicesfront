// Definicion de variables globales y funciones

const adoptanteActualizado = {
  nombre_apellido: "",
  telefono: "",
  email: "",
  dni: "",
  vivienda: "",
};

// Obtener el ID del adoptante desde la URL
const urlParams = new URLSearchParams(window.location.search);
const adoptanteId = urlParams.get("id");

// Obtener formulario
const formulario = document.querySelector("#formulario_adoptante");

/* Ventana modal aparece cuando se borra un adoptante */
function mostrarVentanaModal() {
  const ventanaModal = document.querySelector(".ventana-modal");
  ventanaModal.classList.add("mostrar-ventana-modal"); /* Muestro ventana modal */
  setTimeout(() => {
    ventanaModal.classList.remove("mostrar-ventana-modal"); /* Saco ventana modal despues de 4 segundos */
    setTimeout(() => {
      location.reload(); // Recarga la página
    }, 500); // Espera 500ms para asegurarse de que el modal esté completamente cerrado antes de recargar
  }, 3000);
}

// Solicito la información del adoptante por su id guardada en la base de datos
async function obtenerAdoptante(id) {
  try {
    const respuesta = await fetch(`http://localhost:3000/adoptantes/${id}`);
    if (!respuesta.ok) {
      console.log("Error al solicitar adoptante por su id, código de estado: ", respuesta.status);
      return;
    }
    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.log("Error", error);
  }
}

async function agregarValores() {
  const adoptanteActual = await obtenerAdoptante(adoptanteId);
  if (adoptanteActual) {
    for (const key in adoptanteActual) {
      const input = formulario.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = adoptanteActual[key];
      }
    }
    return adoptanteActual;
  }
  return null;
}

document.addEventListener("DOMContentLoaded", async () => {
  const adoptanteActual = await agregarValores();

  formulario.addEventListener("input", (e) => {
    adoptanteActualizado[e.target.name] = e.target.value.trim();
  });

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Combinar adoptanteActual y adoptanteActualizado
    const adoptanteCombinado = { ...adoptanteActual };

    // Solo agregar campos actualizados que no están vacíos
    for (const key in adoptanteActualizado) {
      if (adoptanteActualizado[key]) {
        adoptanteCombinado[key] = adoptanteActualizado[key];
      }
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/adoptantes/${adoptanteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adoptanteCombinado),
      });
      if (!respuesta.ok) {
        console.error("Error al enviar el formulario, código de estado: ", respuesta.status);
        return;
      }
      // Mostrar spinner
      const spinnerActual = document.querySelector(".spinner");
      spinnerActual.classList.remove("d-none");
      setTimeout(() => {
        spinnerActual.classList.add("d-none");
        mostrarVentanaModal();
      }, 3000);
    } catch (error) {
      console.error("Error al enviar la información", error);
    }
  });
});
