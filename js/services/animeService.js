/* SERVICIO DE ANIMES */

/**Obtiene la lista completa de animes desde el JSON. */
export async function fetchAnimes() {
    try {
        const response = await fetch("../data/animes.json"); 
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al cargar el catálogo de animes:", error);
        return [];
    }
}

/**
 * Busca un anime específico por su slug
 * @param {string} slug 
 */
export async function obtenerAnimePorSlug(slug) {
    const animes = await fetchAnimes();
    return animes.find(anime => anime.slug === slug) || null;
}

/**
 * Filtra los animes por género.
 * @param {string} genero 
 */
export async function filtrarAnimesPorGenero(genero) {
    const animes = await fetchAnimes();
    if (!genero || genero === "todos") return animes;
    
    return animes.filter(anime => anime.genero.toLowerCase() === genero.toLowerCase());
}

/**Obtiene una lista de géneros únicos disponibles en el catálogo.*/
export async function obtenerGenerosDisponibles() {
    const animes = await fetchAnimes();
    const generos = animes.map(a => a.genero);
    return [...new Set(generos)];
}