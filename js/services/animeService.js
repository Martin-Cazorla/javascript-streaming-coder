/**
 * Lógica de anime service
 */
export const obtenerDatos = async () => {
    try {
        const response = await fetch('./data/datos.json'); 
        if (!response.ok) throw new Error("No se pudo cargar el JSON");
        return await response.json(); 
    } catch (error) {
        console.error("Error en Fetch:", error);
        throw error; 
    }
};