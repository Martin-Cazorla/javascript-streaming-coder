/**SERVICIO DE PLANES - GESTIÓN DE PRECIOS Y LOGICA DE NEGOCIO*/
export const IVA = 0.21;

export const catalogoPlanes = [
  {
    id: 1,
    slug: "genesis",
    nombre: "Plan Génesis (Básico)",
    detalles: "1 Pantalla, Calidad SD",
    precio: 900
  },
  {
    id: 2,
    slug: "evolucion",
    nombre: "Plan Evolución (Estándar)",
    detalles: "2 Pantallas, Calidad HD",
    precio: 1500
  },
  {
    id: 3,
    slug: "apocalipsis",
    nombre: "Plan Apocalipsis (Premium)",
    detalles: "4 Pantallas, Calidad 4K + HDR",
    precio: 2200
  }
];

/**
 * precio total con IVA
 * @param {number} precioBase 
 * @returns {number}
 */
export const calcularPrecioFinal = (precioBase) => {
    return precioBase * (1 + IVA);
};

/**
 * Busca un plan por su ID
 * @param {number} id 
 * @returns {object|null}
 */
export const obtenerPlanPorId = (id) => {
    return catalogoPlanes.find(plan => plan.id === parseInt(id)) || null;
};