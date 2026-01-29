/* CONFIGURACIÓN Y DATOS */
// Constantes para valores fijos del sistema
const IVA = 0.21;

// Objeto con la oferta de suscripciones disponible
const planesSuscripcion = [
    { 
        id: "basico", 
        nombre: "Plan Génesis (Básico)", 
        precios: { semana: 300, mes: 900, año: 9000 },
        beneficios: "1 Pantalla, Calidad SD" 
    },
    { 
        id: "estandar", 
        nombre: "Plan Evolución (Estándar)", 
        precios: { semana: 500, mes: 1500, año: 15000 },
        beneficios: "2 Pantallas, Calidad HD" 
    },
    { 
        id: "premium", 
        nombre: "Plan Apocalipsis (Premium)", 
        precios: { semana: 800, mes: 2200, año: 22000 },
        beneficios: "4 Pantallas, Calidad 4K + HDR" 
    }
];

/* PROCESAMIENTO: Cálculos matemáticos */
const calcularTotal = (precioBase) => (precioBase * (1 + IVA)).toFixed(2);

/* PROCESAMIENTO: Manejo del DOM */
function renderizarPlanes() {
    const contenedor = document.getElementById('contenedor-planes');

    if (!contenedor) return;

    // Limpia el contenedor por seguridad
    contenedor.innerHTML = ""; 

    // Contenido visual (Planes)
    planesSuscripcion.forEach(plan => {
        const card = document.createElement('article');
        card.className = 'feature-card';
        
        // Contenido dinámico con los 3 botones de pago
        card.innerHTML = `
            <h3>${plan.nombre}</h3>
            <p>${plan.beneficios}</p>
            <div class="opciones-precio" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 10px;">
                <button class="btn-secondary-outline" onclick="seleccionarPlan('${plan.id}', 'semana')">Semanal: $${plan.precios.semana}</button>
                <button class="btn-secondary-outline" onclick="seleccionarPlan('${plan.id}', 'mes')">Mensual: $${plan.precios.mes}</button>
                <button class="btn-secondary-outline" onclick="seleccionarPlan('${plan.id}', 'año')">Anual: $${plan.precios.año}</button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

/* PROCESAMIENTO: Gestión de Selección y Storage */
window.seleccionarPlan = (idPlan, periodo) => {
    const plan = planesSuscripcion.find(p => p.id === idPlan);
    
    // Información de la compra
    const suscripcionElegida = {
        nombre: plan.nombre,
        periodo: periodo,
        precioBase: plan.precios[periodo]
    };

    localStorage.setItem('suscripcion_activa', JSON.stringify(suscripcionElegida));
    
    // Mostrar resumen
    renderizarResumen();
};

/* SALIDA: Renderizado del Resumen */
function renderizarResumen() {
    const contenedorResumen = document.getElementById('resumen-suscripcion');
    
    // Recuperar datos del Storage
    const datos = JSON.parse(localStorage.getItem('suscripcion_activa'));

    if (!datos || !contenedorResumen) return;

    // Mostrar el ticket de suscripción
    contenedorResumen.innerHTML = `
        <div class="feature-card" style="border: 2px solid #9d4edd; margin-top: 2rem; background: rgba(15, 12, 41, 0.95);">
            <h3 style="color: #9d4edd;">¡Suscripción Confirmada!</h3>
            <p><strong>Plan:</strong> ${datos.nombre}</p>
            <p><strong>Modalidad:</strong> ${datos.periodo.toUpperCase()}</p>
            <p><strong>Total con IVA:</strong> $${calcularTotal(datos.precioBase)}</p>
            <button id="btn-cancelar" class="btn-primary" style="margin-top: 1rem; width: 100%;">Cerrar Suscripción</button>
        </div>
    `;

    // botón de cancelar para borrar el Storage
    document.getElementById('btn-cancelar').addEventListener('click', () => {
        localStorage.removeItem('suscripcion_activa');
        contenedorResumen.innerHTML = "";
    });
}

/* CONTROLADOR DE INICIO */
document.addEventListener('DOMContentLoaded', () => {
    renderizarPlanes();
    renderizarResumen();
});