/**
 * Lógica de la página de catálogo
 */
import { fetchAnimes } from '../services/animeService.js';
import { renderGrid } from '../components/ui.js';

// --- Referencias al DOM ---
const gridContainer = document.getElementById('anime-grid');
const searchInput = document.getElementById('search-input');
const genreFilter = document.getElementById('genre-filter');
const userDisplay = document.getElementById('user-display');
const btnLogout = document.getElementById('btn-logout');

let allAnimes = []; 

/**
 * Función principal de inicialización
 */
const init = async () => {
    // Verificación de Seguridad (Sesión)
    const datosUsuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (!datosUsuario) {
        window.location.href = 'login.html';
        return;
    }

    // Saludo Personalizado
    userDisplay.textContent = `Hola, ${datosUsuario.nombre || 'Fan del Anime'} 👋`;

    // Lógica de Cerrar Sesión
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogueado');
        window.location.href = 'login.html';
    });

    // Entrada de datos y Salida inicial
    allAnimes = await fetchAnimes();
    renderGrid(allAnimes, gridContainer);

    // Interactividad 
    gridContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-ver')) {
            const animeId = e.target.getAttribute('data-id');
            const animeSeleccionado = allAnimes.find(a => a.id == animeId);

            if (animeSeleccionado) {
                Swal.fire({
                    title: `¿Quieres ver ${animeSeleccionado.nombre}?`,
                    text: animeSeleccionado.descripcion,
                    icon: 'question',
                    imageUrl: animeSeleccionado.imagen,
                    imageHeight: 200,
                    imageAlt: `Portada de ${animeSeleccionado.nombre}`,
                    showCancelButton: true,
                    confirmButtonColor: '#9d4edd',
                    cancelButtonColor: '#666',
                    confirmButtonText: '¡Sí, reproducir!',
                    cancelButtonText: 'Más tarde'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire(
                            '¡Disfruta!',
                            `Iniciando streaming de ${animeSeleccionado.nombre}...`,
                            'success'
                        );
                    }
                });
            }
        }
    });

    // Procesamiento de filtros
    searchInput.addEventListener('input', applyFilters);
    genreFilter.addEventListener('change', applyFilters);
};

/**
 * Lógica de procesamiento de filtros
 */
const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;

    const filtered = allAnimes.filter(anime => {
        const matchesName = anime.nombre.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenre === "all" || anime.genero === selectedGenre;
        
        return matchesName && matchesGenre;
    });

    renderGrid(filtered, gridContainer);
};

document.addEventListener('DOMContentLoaded', init);