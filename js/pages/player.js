/* Lógica para la página de reproducción */
const cargarDetallesAnime = () => {
    const animeEnMemoria = localStorage.getItem('selectedAnime');
    
    if (!animeEnMemoria) {
        console.error("No se encontró ningún anime seleccionado.");
        window.location.href = 'catalog.html';
        return;
    }

    const anime = JSON.parse(animeEnMemoria);

    const titleElement = document.getElementById('anime-title');
    const descriptionElement = document.getElementById('anime-description');
    const videoElement = document.getElementById('main-video');

    if (titleElement) titleElement.textContent = anime.nombre;
    if (descriptionElement) descriptionElement.textContent = anime.descripcion;

    if (videoElement) {
        videoElement.src = anime.videoUrl || ''; 
        videoElement.poster = anime.imagen; 
    }
};

document.addEventListener('DOMContentLoaded', cargarDetallesAnime);