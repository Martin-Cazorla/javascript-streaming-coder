import { fetchAnimes } from '../services/animeService.js';
import { renderGrid } from '../components/ui.js';
import { 
    cargarUsuario, 
    limpiarUsuario, 
    gestionarSuscripcion, 
    actualizarPerfil, 
    cancelarSuscripcion 
} from '../services/userService.js';

// --- Referencias al DOM ---
const gridContainer = document.getElementById('anime-grid');
const searchInput = document.getElementById('search-input');
const genreFilter = document.getElementById('genre-filter');
const userDisplay = document.getElementById('user-display');
const btnLogout = document.getElementById('btn-logout');
const btnEditProfile = document.getElementById('btn-edit-profile'); 
const suscripcionesContainer = document.getElementById('mis-suscripciones-lista');

let allAnimes = []; 

/**
 * Inicialización asíncrona 
 */
const init = async () => {
    const datosUsuario = cargarUsuario();
    
    // Protección de ruta
    if (!datosUsuario) {
        window.location.href = 'login.html';
        return;
    }

    userDisplay.textContent = `Hola, ${datosUsuario.nombre || 'Titán'} 👋`;

    // Listeners de navegación
    btnLogout.addEventListener('click', () => {
        limpiarUsuario();
        window.location.href = 'index.html';
    });

    // CRUD: Update Perfil 
    btnEditProfile?.addEventListener('click', async () => {
        const usuarioActual = cargarUsuario();
        const { value: formValues } = await Swal.fire({
            title: 'Configuración de Perfil',
            background: '#1a1a1a',
            color: '#fff',
            html: `
                <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${usuarioActual.nombre}">
                <input id="swal-email" class="swal2-input" placeholder="Email" value="${usuarioActual.email}">
            `,
            confirmButtonText: 'Guardar',
            confirmButtonColor: '#9d4edd',
            showCancelButton: true,
            preConfirm: () => {
                const nombre = document.getElementById('swal-nombre').value.trim();
                const email = document.getElementById('swal-email').value.trim();
                if (!nombre || !email) return Swal.showValidationMessage('Campos obligatorios');
                return { nombre, email };
            }
        });

        if (formValues) {
            actualizarPerfil(formValues);
            userDisplay.textContent = `Hola, ${formValues.nombre} 👋`;
        }
    });

    // CARGA DE DATOS ASÍNCRONA
    try {
        allAnimes = await fetchAnimes();
        renderizarYEscuchar(allAnimes);
        renderizarSuscripciones(); 
    } catch (error) {
        Swal.fire('Error', 'No se pudo conectar con el servidor de KaijuStream', 'error');
    }

    // Filtros dinámicos
    searchInput.addEventListener('input', applyFilters);
    genreFilter.addEventListener('change', applyFilters);
};

const renderizarYEscuchar = (lista) => {
    renderGrid(lista, gridContainer);
    
    // Delegación de eventos o listeners específicos
    gridContainer.querySelectorAll('.btn-suscribir').forEach(boton => {
        boton.addEventListener('click', () => {
            const id = parseInt(boton.getAttribute('data-id'));
            const anime = allAnimes.find(a => a.id === id);
            
            if (gestionarSuscripcion(anime)) {
                renderizarSuscripciones();
            }
        });
    });
};

const renderizarSuscripciones = () => {
    const usuario = cargarUsuario();
    if (!suscripcionesContainer) return;

    suscripcionesContainer.innerHTML = "";

    // Mostrar el Plan de Pago Activo 
    if (usuario.planContratado && usuario.suscrito) {
        const planItem = document.createElement('div');
        planItem.className = "plan-status-card mb-3"; 
        planItem.innerHTML = `
            <p style="margin:0; font-weight:bold; color:#9d4edd; font-size:0.8rem;">SUSCRIPCIÓN:</p>
            <p style="margin:0; font-size:0.9rem; color: #fff;">${usuario.planContratado.nombre} ✅</p>
            <hr style="border-color:#333; margin: 8px 0;">
        `;
        suscripcionesContainer.appendChild(planItem);
    }

    // Encabezado para la lista de favoritos
    const tituloLista = document.createElement('p');
    tituloLista.style.cssText = "font-size:0.7rem; color:#888; margin-bottom:5px; font-weight:bold;";
    tituloLista.textContent = "MI LISTA DE ANIMES:";
    suscripcionesContainer.appendChild(tituloLista);

    // Manejo de lista vacía
    if (!usuario.suscripciones || usuario.suscripciones.length === 0) {
        const p = document.createElement('p');
        p.className = 'text-muted small';
        p.textContent = "No tienes animes agregados.";
        suscripcionesContainer.appendChild(p);
        return;
    }

    // Renderizado de cada anime suscrito
    usuario.suscripciones.forEach(anime => {
        const item = document.createElement('div');
        item.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-secondary mb-1 p-2";
        item.innerHTML = `
            <span class="small" style="max-width: 80%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${anime.nombre}
            </span>
            <button class="btn-cancelar" data-id="${anime.id}" aria-label="Eliminar" 
                    style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold;">
                &times;
            </button>
        `;
        suscripcionesContainer.appendChild(item);
    });

    //Re-asignación de Listeners para eliminar 
    suscripcionesContainer.querySelectorAll('.btn-cancelar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            cancelarSuscripcion(id);
            renderizarSuscripciones(); 
        });
    });
};

const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    
    const filtered = allAnimes.filter(anime => {
        const matchesName = anime.nombre.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenre === "all" || anime.genero === selectedGenre;
        return matchesName && matchesGenre;
    });
    
    renderizarYEscuchar(filtered);
};

init();