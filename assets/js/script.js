const formulario = document.querySelector(".form");
const nombre = document.querySelector("#nombre")
const telefono = document.querySelector("#telefono")
const domicilio = document.querySelector("#domicilio")
const email = document.querySelector("#email")
const errorContainer = document.querySelector("#errorContainer");

let errorValidacion;

const error = (mensaje) => {
    errorValidacion = true;
    errorContainer.classList.add("mostrar-error");
    errorContainer.innerHTML += `
    <p>${mensaje}</p>`;
}

const validar = (dato, min) => {
    if (dato != "email") {
        if (dato.value.trim().length === 0) {
            error(`El ${dato.name} es un campo requerido.`)
        } else if (dato.value.trim().length < min) {
            error(`El ${dato.name} es demasiado corto. Por favor, asegúrate de ingresar al menos ${min} caracteres.</p>`);
        }
    }
    else {
        if (dato.value.trim().length === 0) {
            error(`El ${dato.name} es un campo requerido.`)
        } else if (dato.value.trim().length < min) {
            error(`El correo electrónico ingresado no es válido. Por favor, asegúrate de escribir una dirección de correo electrónico válida.`);
        }
    }
}

const limpiar = (dato) => {
    dato.addEventListener("input", () => {
        if (dato.value.trim().length > 3) {
            errorContainer.classList.remove("mostrar-error");
        }
    });
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    errorContainer.innerHTML = "";
    errorContainer.classList.remove("mostrar-error");
    errorValidacion = false;

    validar(nombre, 3)
    validar(telefono, 10)
    validar(domicilio, 3)
    validar(email, 3)

    if (!errorValidacion) {
        enviado.style.display = "block";
        enviado.textContent = "Hemos recibido tu solicitud de adopción. Nos pondremos en contacto contigo en los próximos días. ¡Gracias por darle a un perrito la oportunidad de tener una familia!";
    }
})

limpiar(nombre);
limpiar(telefono);
limpiar(domicilio);
limpiar(email);
