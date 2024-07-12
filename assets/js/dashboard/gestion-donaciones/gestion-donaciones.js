const contenedorPadre = document.querySelector(".contenedor-registros");
const url = "https://andreagzlez.alwaysdata.net/donaciones";

async function solicitarDonaciones(url) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      console.log("Error de coneción a la base de datos", respuesta.status);
      return;
    }
    const dato = await respuesta.json();

    return dato;
  } catch (error) {
    console.error("Error al solicitar donaciones", error);
  }
}

async function renderizarDonaciones(url) {
  try {
    const donacionesLista = await solicitarDonaciones(url);

    if (donacionesLista) {
      iterarDonacionesLista(donacionesLista);
      return donacionesLista;
    }
  } catch (error) {
    console.log("Error al renderizar donaciones", error);
  }
}

function iterarDonacionesLista(donacionesLista) {
  donacionesLista.map((donacion) => {
    const donacionContenedor = document.createElement("tr");

    donacionContenedor.setAttribute("data-id", `${donacion.ID}`);
    const contenidoDonacion = `  
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>`;

    donacionContenedor.innerHTML = contenidoDonacion;
    contenedorPadre.appendChild(donacionContenedor);

    const campos = donacionContenedor.querySelectorAll("td");
    campos[0].textContent = donacion.nombre;
    campos[1].textContent = donacion.email;
    campos[2].textContent = donacion.fechaDonacion;
    campos[3].textContent = donacion.montoDonacion;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  let donaciones = await renderizarDonaciones(url);
});
