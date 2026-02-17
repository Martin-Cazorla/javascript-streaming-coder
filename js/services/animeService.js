/**
 * Lógica de anime service
 */
export const fetchAnimes = async () => {
    try {
        const response = await fetch('./data/animes.json');
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error("No se pudo recuperar el catálogo de animes:", error);
        
        return []; 
    }
};