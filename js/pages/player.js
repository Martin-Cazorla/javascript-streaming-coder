/** LÓGICA PARA LA PÁGINA DE REPRODUCCIÓN */
import { qs } from "../utils/dom.js";

/**Carga los detalles del anime desde el almacenamiento local */
const cargarDetallesAnime = () => {
    const animeEnMemoria = localStorage.getItem('selectedAnime');
    
    // Si no hay anime, redirigimos al catálogo
    if (!animeEnMemoria) {
        console.warn("Acceso denegado: No hay anime seleccionado.");
        location.replace('catalog.html');
        return;
    }

    let anime;
    try {
        anime = JSON.parse(animeEnMemoria);
    } catch (error) {
        console.error("Error de integridad de datos:", error);
        localStorage.removeItem('selectedAnime');
        location.replace('catalog.html');
        return;
    }

    // Validación de objeto
    if (!anime || !anime.nombre) {
        location.replace('catalog.html');
        return;
    }

    // Referencia a nodos específicos
    const titleElement = qs('#video-title'); 
    const videoElement = qs('#main-video');
    const descriptionElement = qs('#video-description');

    // Verificación de existencia de nodos
    if (!titleElement || !videoElement) {
        console.error("Error: Nodos del reproductor no encontrados en el DOM.");
        return;
    }

    // Inyección segura de datos
    titleElement.textContent = anime.nombre;
    
    if (descriptionElement) {
        descriptionElement.textContent = anime.descripcion || "Sin descripción disponible.";
    }

    // Configuración del reproductor de video
    videoElement.src = anime.videoUrl || "";
    videoElement.poster = anime.banner || anime.imagen || ""; 
    
    // Manejo de errores de carga de video
    videoElement.addEventListener("error", () => {
        console.warn(`No se pudo cargar el recurso de video: ${anime.videoUrl}`);
    });
};

/**Función de inicialización*/
const initPlayer = () => {
    cargarDetallesAnime();
    
    // botón de volver
    const btnBack = qs("#btn-back");
    if (btnBack) {
        btnBack.addEventListener("click", () => {
            location.assign("catalog.html");
        });
    }
};

// Ejecución directa
initPlayer();