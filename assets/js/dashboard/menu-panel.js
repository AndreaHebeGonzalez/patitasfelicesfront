document.addEventListener('DOMContentLoaded', () => {
    /* Elementos del menu mobile de barra lateral */
    const iconoNav = document.querySelector('.barra-lateral__icono-nav');
    const menuDashboard = document.querySelector('.barra-lateral');

    iconoNav.addEventListener('click', (e) => {
        menuDashboard.classList.toggle('mostrar-menu');
    });
});


