// === MODELO Y DATOS ===

export const IVA = 0.21;

export const catalogoPlanes = [
    { id: "Genesis", nombre: "Plan Génesis (Básico)", detalles: "1 Pantalla, Calidad SD", precio: 900 },
    { id: "Evolucion", nombre: "Plan Evolución (Estándar)", detalles: "2 Pantallas, Calidad HD", precio: 1500 },
    { id: "Apocalipsis", nombre: "Plan Apocalipsis (Premium)", detalles: "4 Pantallas, Calidad 4K + HDR", precio: 2200 }
];

export function crearUsuario(email = "") {
    return {
        email,
        planContratado: null,
        suscrito: false
    };
}
