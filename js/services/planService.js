/*SERVICIO DE PLANES - GESTIÓN DE PRECIOS Y LÓGICA DE NEGOCIO*/

// Constante de impuesto 
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
 * Calcula el precio total con IVA incluido.
 * @param {number} precioBase 
 * @returns {number}
 */
export const calcularPrecioFinal = (precioBase) => {
    const total = precioBase * (1 + IVA);
    return Math.round(total);
};

/**
 * Busca un plan por su ID de forma segura.
 * @param {number|string} id 
 * @returns {object|null}
 */
export const obtenerPlanPorId = (id) => {
    const planEncontrado = catalogoPlanes.find(plan => plan.id === Number(id));
    return planEncontrado || null;
};

/**
 * Formatea el precio a moneda local
 * @param {number} monto 
 * @returns {string}
 */
export const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(monto);
};