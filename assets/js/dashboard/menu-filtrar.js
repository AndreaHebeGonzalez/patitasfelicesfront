document.addEventListener('DOMContentLoaded', () => {

    /* Elemetos del menu filtro */
    const btnFiltrar = document.querySelector('.filtro__btn');
    const filtroOpciones = document.querySelector('.filtro__opciones');

    let menuAparece = false;

    btnFiltrar.addEventListener('click', ()  => {
        if(!menuAparece) {
            filtroOpciones.classList.add('mostrar-opciones');
            menuAparece = true;
        } else {
            filtroOpciones.style.transition = 'visibility .2s, opacity .2s, transform .3s .3s'
            filtroOpciones.classList.remove('mostrar-opciones');
            setTimeout(() => {
                filtroOpciones.style.transition = 'all .3s'
                menuAparece = false;
            }, 300);
        };
    });
});