document.addEventListener("DOMContentLoaded", () => {
  const iconoNav = document.querySelector(".header__icono-nav");
  const menuMobile = document.querySelector(".navegacion");

  abrirMenu();
  
  function abrirMenu() {
    iconoNav.addEventListener("click", (e) => {
      if (e.target.src.includes("/assets/img/hamburguesa.svg")) {
        iconoNav.src = "./assets/img/cruz-cerrar.svg";
        menuMobile.classList.add("mostrar-menu-mobile");
      } else {
        iconoNav.src = "./assets/img/hamburguesa.svg";
        menuMobile.classList.remove("mostrar-menu-mobile");
      }
    });
  }
});
