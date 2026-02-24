/* CATALOG.JS */
import { fetchAnimes } from '../services/animeService.js';
import { renderGrid } from '../components/ui.js';
import { 
    cargarUsuario, 
    limpiarUsuario, 
    actualizarPerfil, 
    gestionarSuscripcionAnime, 
    quitarAnimeDeLista 
} from '../services/userService.js';
import { qs, on, create, clear } from '../utils/dom.js';

const gridContainer = qs('#anime-grid');
const searchInput = qs('#search-input');
const genreFilter = qs('#genre-filter');
const userDisplay = qs('#user-display');
const btnLogout = qs('#btn-logout');
const btnEditProfile = qs('#btn-edit-profile'); 
const suscripcionesContainer = qs('#mis-suscripciones-lista');

let allAnimes = []; 

const cargarCatalogoJSON = async () => {
    try {
        allAnimes = await fetchAnimes();
        if (!allAnimes || allAnimes.length === 0) throw new Error("Base de datos vacía");
        renderizarYEscuchar(allAnimes);
        renderizarSuscripciones(); 
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error', text: 'No se pudo cargar el catálogo.', icon: 'error' });
    }
};

const renderizarSuscripciones = () => {
    const usuario = cargarUsuario();
    if (!suscripcionesContainer) return;
    clear(suscripcionesContainer);

    if (usuario.planContratado && usuario.suscrito) {
        const planCard = create('div', 'plan-status-card mb-3');
        planCard.append(create('p', 'plan-badge', 'MI SUSCRIPCIÓN:'), create('p', 'plan-name', `${usuario.planContratado.nombre} ✅`));
        suscripcionesContainer.appendChild(planCard);
    }

    suscripcionesContainer.appendChild(create('p', 'sidebar-title', 'MI LISTA DE ANIMES:'));

    if (!usuario.suscripciones || usuario.suscripciones.length === 0) {
        suscripcionesContainer.appendChild(create('p', 'text-muted small', 'Tu lista está vacía.'));
        return;
    }

    usuario.suscripciones.forEach(anime => {
        const item = create('div', 'list-group-item d-flex justify-content-between align-items-center bg-dark text-white p-2 mb-1');
        const span = create('span', 'small anime-link', anime.nombre);
        on(span, 'click', () => seleccionarAnime(anime));
        const btnRemove = create('button', 'btn-cancelar', '×');
        on(btnRemove, 'click', (e) => {
            e.stopPropagation();
            quitarAnimeDeLista(anime.id);
            renderizarSuscripciones();
        });
        item.append(span, btnRemove);
        suscripcionesContainer.appendChild(item);
    });
};

const renderizarYEscuchar = (lista) => {
    renderGrid(lista, gridContainer);
    
    // Asignar eventos a los botones de la grilla
    gridContainer.querySelectorAll('.btn-suscribir').forEach(boton => {
        on(boton, 'click', (e) => {
            e.stopPropagation();
            const id = parseInt(boton.getAttribute('data-id'));
            const anime = allAnimes.find(a => a.id === id);
            const res = gestionarSuscripcionAnime(anime);
            if (res.success) renderizarSuscripciones();
            else Swal.fire({ text: res.message, icon: 'info', timer: 1000, showConfirmButton: false });
        });
    });

    gridContainer.querySelectorAll('.anime-card').forEach(card => {
        on(card, 'click', () => {
            const id = parseInt(card.getAttribute('data-id'));
            const anime = allAnimes.find(a => a.id === id);
            seleccionarAnime(anime);
        });
    });
};

const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    const filtered = allAnimes.filter(a => (a.nombre.toLowerCase().includes(searchTerm)) && (selectedGenre === "all" || a.genero === selectedGenre));
    renderizarYEscuchar(filtered);
};

const seleccionarAnime = (anime) => {
    localStorage.setItem('selectedAnime', JSON.stringify(anime));
    location.assign('reproductor.html'); 
};

const init = async () => {
    const datosUsuario = cargarUsuario();
    if (!datosUsuario) return location.replace('login.html');
    if (userDisplay) userDisplay.textContent = `Hola, ${datosUsuario.nombre} 👋`;

    on(btnLogout, 'click', () => { limpiarUsuario(); location.assign('../index.html'); });

    on(btnEditProfile, 'click', async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Perfil',
            html: `<input id="swal-name" class="swal2-input" value="${datosUsuario.nombre}">`,
            preConfirm: () => ({ nombre: qs('#swal-name').value })
        });
        if (formValues) {
            actualizarPerfil(formValues);
            location.reload();
        }
    });

    await cargarCatalogoJSON();
    on(searchInput, 'input', applyFilters);
    on(genreFilter, 'change', applyFilters);
};

init();