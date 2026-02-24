/* SERVICIO DE PLANES */
export const IVA = 0.21;

/**CARGAR PLANES DESDE JSON*/
export async function obtenerCatalogoPlanes() {
    try {
        let response = await fetch("./data/planes.json");
        
        if (!response.ok) {
            response = await fetch("../data/planes.json");
        }

        if (!response.ok) throw new Error("No se encontró planes.json");
        return await response.json();
    } catch (error) {
        return [];
    }
}

/* BUSCAR PLAN */
export async function obtenerPlanPorId(id) {
    const planes = await obtenerCatalogoPlanes();
    return planes.find(plan => plan.id === Number(id)) || null;
}

/* PRECIO FINAL */
export function calcularPrecioFinal(precioBase) {
    return Math.round(precioBase * (1 + IVA));
}

/* FORMATEAR */
export function formatearMoneda(monto) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
    }).format(monto);
}