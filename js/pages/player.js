/** LÓGICA PARA LA PÁGINA DE REPRODUCCIÓN*/
import { qs } from "../utils/dom.js";

const cargarDetallesAnime = () => {
    const animeEnMemoria = localStorage.getItem('selectedAnime');
    
    if (!animeEnMemoria) {
        location.replace('catalog.html');
        return;
    }

    const anime = JSON.parse(animeEnMemoria);

    // Referencias
    const titleElement = qs('#video-title'); 
    const playerEngine = qs('#player-engine'); 

    if (!titleElement || !playerEngine) return;

    titleElement.textContent = anime.nombre;

    // LÓGICA DE DETECCIÓN
    if (anime.videoUrl.includes('youtube.com') || anime.videoUrl.includes('youtu.be')) {
        playerEngine.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="${anime.videoUrl}" 
                title="Reproductor de ${anime.nombre}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen>
            </iframe>`;
    } else {
        playerEngine.innerHTML = `
            <video id="main-video" controls poster="${anime.banner || ''}">
                <source src="${anime.videoUrl}" type="video/mp4">
                Tu navegador no soporta videos.
            </video>`;
    }
};

const initPlayer = () => {
    cargarDetallesAnime();
    
    const btnBack = qs("#btn-back");
    if (btnBack) {
        btnBack.addEventListener("click", () => {
            location.assign("catalog.html");
        });
    }
};

initPlayer();