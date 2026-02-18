/**
 * Lógica de la página de catálogo 
 */
import { fetchAnimes } from '../services/animeService.js';
import { renderGrid } from '../components/ui.js';
import { cargarUsuario, limpiarUsuario, gestionarSuscripcion, actualizarPerfil, cancelarSuscripcion } from '../services/userService.js';

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
 * Función principal de inicialización
 */
const init = async () => {
    const datosUsuario = cargarUsuario();
    if (!datosUsuario) {
        window.location.href = 'login.html';
        return;
    }

    userDisplay.textContent = `Hola, ${datosUsuario.nombre || 'Fan del Anime'} 👋`;

    // Eventos básicos
    btnLogout.addEventListener('click', () => {
        limpiarUsuario();
        window.location.href = 'login.html';
    });

    // Lógica de Edición de Perfil
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', async () => {
            const usuarioActual = cargarUsuario();
            const { value: formValues } = await Swal.fire({
                title: 'Editar mi Perfil',
                html:
                    `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${usuarioActual.nombre}">` +
                    `<input id="swal-input2" class="swal2-input" placeholder="Email" value="${usuarioActual.email}">`,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Guardar Cambios',
                confirmButtonColor: '#9d4edd',
                preConfirm: () => {
                    const nombre = document.getElementById('swal-input1').value;
                    const email = document.getElementById('swal-input2').value;
                    if (!nombre || !email) {
                        Swal.showValidationMessage('Por favor completa todos los campos');
                        return false;
                    }
                    return { nombre, email };
                }
            });

            if (formValues) {
                actualizarPerfil(formValues);
                userDisplay.textContent = `Hola, ${formValues.nombre} 👋`;
            }
        });
    }

    // Carga inicial de datos
    try {
        allAnimes = await fetchAnimes();
        renderizarYEscuchar(allAnimes);
        renderizarSuscripciones(); 
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No pudimos cargar el catálogo.' });
    }

    searchInput.addEventListener('input', applyFilters);
    genreFilter.addEventListener('change', applyFilters);
};

/**
 * Renderiza catálogo y gestiona suscripciones
 */
const renderizarYEscuchar = (lista) => {
    renderGrid(lista, gridContainer);
    const botonesSuscripcion = gridContainer.querySelectorAll('.btn-suscribir');
    
    botonesSuscripcion.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.getAttribute('data-id');
            const anime = allAnimes.find(a => a.id == id);
            
            if (gestionarSuscripcion(anime)) {
                renderizarSuscripciones();
            }
        });
    });
};

/**
 * Renderiza la sección lateral de suscripciones 
 */
const renderizarSuscripciones = () => {
    const usuario = cargarUsuario();
    if (!suscripcionesContainer) return;

    suscripcionesContainer.innerHTML = "";

    if (!usuario.suscripciones || usuario.suscripciones.length === 0) {
        suscripcionesContainer.innerHTML = "<p class='text-muted small'>Aún no tienes suscripciones activas.</p>";
        return;
    }

    usuario.suscripciones.forEach(anime => {
        const item = document.createElement('div');
        item.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-secondary mb-1 p-2";
        item.innerHTML = `
            <span class="small">${anime.nombre}</span>
            <button class="btn btn-sm btn-outline-danger py-0 btn-cancelar" data-id="${anime.id}">&times;</button>
        `;
        suscripcionesContainer.appendChild(item);
    });

    // Eventos para eliminar suscripción
    const botonesCancelar = suscripcionesContainer.querySelectorAll('.btn-cancelar');
    botonesCancelar.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
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