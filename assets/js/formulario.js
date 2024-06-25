const form = document.querySelector(".form");

const nombre = document.querySelector("#nombre");
const email = document.querySelector("#email");
const errorContainer = document.querySelector("#errorContainer"); 
let errorN = document.querySelector(".errorNombre"); 
let errorE = document.querySelector(".errorEmail"); 

const enviado = document.querySelector("#enviado");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let errorValidacion = false;

  if (nombre.value.trim().length < 3 && nombre.value.trim().length > 0 ) {
    errorValidacion = true;
    errorContainer.classList.add("mostrar-error");
    errorN.textContent =
      "El nombre y apellido son demasiado cortos. Por favor, asegúrate de ingresar al menos 3 caracteres.";
  } else if (nombre.value.trim().length === 0) { 
    errorValidacion = true;
    errorContainer.classList.add("mostrar-error");
    errorN.textContent =
      "El nombre y apellido es un campo requerido.";
  }

  if (email.value.trim().length < 7 && nombre.value.trim().length > 0) {
    errorValidacion = true;
    errorContainer.classList.add("mostrar-error");
    errorE.textContent = "El correo electrónico ingresado no es válido. Por favor, asegúrate de escribir una dirección de correo electrónico válida.";
  } else if (email.value.trim().length === 0) {
    errorValidacion = true; 
    errorContainer.classList.add("mostrar-error");
    errorE.textContent =
      "El email es un campo requerido.";
  }

  if (!errorValidacion) {
    enviado.style.display = "block";
    enviado.textContent = "Hemos recibido tu solicitud de adopción. Nos pondremos en contacto contigo en los próximos días. ¡Gracias por darle a un perrito la oportunidad de tener una familia!";
  }
});

nombre.addEventListener("input", () => {
  if (nombre.value.trim().length > 3) {
    errorN.textContent = "";
    errorContainer.classList.remove("mostrar-error");
  }
});

email.addEventListener("input", () => {
  if (email.value.trim().length > 7) {
    errorE.textContent = "";
    errorContainer.classList.remove("mostrar-error");
  }
});
