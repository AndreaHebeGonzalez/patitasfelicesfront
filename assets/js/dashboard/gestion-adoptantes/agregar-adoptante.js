const adoptante = {
  nombre_apellido: "",
  telefono: "",
  email: "",
  dni: "",
  vivienda: "",
};

const formulario = document.querySelector("#formulario_adoptante");
const btnSubmit = document.querySelector(
  '#formulario_adoptante button[type="submit"]'
);
const btnReset = document.querySelector(
  '#formulario_adoptante button[type="reset"]'
);

function validar(e) {
  if (e.target.value.trim() === "") {
    mostrarAlerta("Este campo es obligatorio", e.target.parentElement);
    adoptante[e.target.name] = "";
    estadoBtnEnviar();
    return;
  }

  adoptante[e.target.name] = e.target.value.trim();

  estadoBtnEnviar();
  limpiarAlerta(e.target.parentElement);
}

function mostrarAlerta(mensajeError, padreDelInput) {
  const alerta = padreDelInput.querySelector(".error");
  if (!alerta) {
    const error = document.createElement("P");
    error.setAttribute("class", "error");
    error.textContent = mensajeError;
    padreDelInput.appendChild(error);
  }
}

function limpiarAlerta(padreDelInput) {
  const alerta = padreDelInput.querySelector(".error");
  if (alerta) {
    alerta.remove();
  }
}

function estadoBtnEnviar() {
  console.log("Valores del objeto adoptante:", adoptante);
  if (Object.values(adoptante).some((value) => value === "")) {
    btnSubmit.classList.add("deshabilitar-btn");
    btnSubmit.disabled = true;
  } else {
    btnSubmit.classList.remove("deshabilitar-btn");
    btnSubmit.disabled = false;
  }
}

function mostrarVentanaModal() {
  const ventanaModal = document.querySelector(".ventana-modal");
  ventanaModal.classList.add("mostrar-ventana-modal");
  setTimeout(() => {
    ventanaModal.classList.remove("mostrar-ventana-modal");
    setTimeout(() => {
      location.reload();
    }, 500);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  estadoBtnEnviar();

  formulario.addEventListener("input", (e) => {
    validar(e);
  });

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Crear un objeto sin el campo ID_perrito
    const adoptanteSinIDPerrito = { ...adoptante };

    try {
      const respuesta = await fetch("http://localhost:3000/adoptantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adoptanteSinIDPerrito),
      });

      if (!respuesta.ok) {
        console.error(
          "Error al enviar el formulario, código de estado: ",
          respuesta.status
        );
        return;
      }
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
