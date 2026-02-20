/** * SERVICIO DE ANIMES - CARGA DE DATOS REMOTOS*/
export const fetchAnimes = async () => {
    try {
        const response = await fetch('./data/animes.json'); 
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Error al obtener animes:", error);
        throw error; 
    }
};