/* === 1. CONFIGURACIÓN Y MODELO DE DATOS === */
const IVA = 0.21;
const catalogoPlanes = [
    { id: "Génesis", nombre: "Plan Génesis (Básico)", detalles: "1 Pantalla, Calidad SD", precio: 900 },
    { id: "Evolución", nombre: "Plan Evolución (Estándar)", detalles: "2 Pantallas, Calidad HD", precio: 1500 },
    { id: "Apocalipsis", nombre: "Plan Apocalipsis (Premium)", detalles: "4 Pantallas, Calidad 4K + HDR", precio: 2200 }
];

let usuarioActivo = {
    email: "",
    planContratado: null,
    suscrito: false
};

/* === 2. REFERENCIAS AL DOM === */
const seccionHero = document.getElementById('hero-section');
const seccionPerfil = document.getElementById('seccion-perfil');
const seccionCatalogo = document.getElementById('seccion-catalogo');
const contenedorPlanes = document.getElementById('contenedor-planes');
const infoEmail = document.getElementById('info-email');
const infoPlan = document.getElementById('info-plan');
const userDisplay = document.getElementById('user-display');
const updateForm = document.getElementById('updateForm');

/* === 3. RENDERIZADO === */

function mostrarPlanes() {
    contenedorPlanes.innerHTML = "";
    catalogoPlanes.forEach(plan => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
            <h3>${plan.nombre}</h3>
            <p>${plan.detalles}</p>
            <p><strong>Mensual: $${plan.precio}</strong></p>
            <button class="btn-primary-small" onclick="contratarPlan('${plan.id}')">
                ${usuarioActivo.planContratado?.id === plan.id ? 'Seleccionado' : 'Contratar'}
            </button>
        `;
        contenedorPlanes.appendChild(card);
    });
}

function actualizarInterfaz() {
    infoEmail.innerText = usuarioActivo.email || "Invitado";
    infoPlan.innerText = usuarioActivo.planContratado ? usuarioActivo.planContratado.nombre : "Sin suscripción activa";
    if (userDisplay) userDisplay.innerText = usuarioActivo.email ? `Hola, ${usuarioActivo.email}` : "";
}

/* === 4. LÓGICA DE NEGOCIO Y SIMULACIÓN === */

// Iniciar
document.getElementById('btn-comenzar')?.addEventListener('click', () => {
    if (!usuarioActivo.email) usuarioActivo.email = "martincazorla@logistica.com";
    seccionHero.style.display = "none";
    seccionPerfil.style.display = "block";
    seccionCatalogo.style.display = "block";
    actualizarInterfaz();
    mostrarPlanes();
    console.log("Sistema iniciado para:", usuarioActivo.email);
});

// Selección de Plan
window.contratarPlan = (id) => {
    const planElegido = catalogoPlanes.find(p => p.id === id);
    if (planElegido) {
        usuarioActivo.planContratado = planElegido;
        console.log("Plan seleccionado temporalmente:", planElegido.nombre);
        actualizarInterfaz();
        mostrarPlanes();
        renderizarFactura();
    }
};

// Resumen y Botón de Confirmación Final
function renderizarFactura() {
    const resumenDiv = document.getElementById('resumen-compra');
    const subtotal = usuarioActivo.planContratado.precio;
    const totalConIva = subtotal * (1 + IVA);
    
    resumenDiv.innerHTML = `
        <div class="card" style="border-top: 3px solid #9d4edd; margin-top: 20px;">
            <h3>Resumen de Facturación</h3>
            <p>Plan: <strong>${usuarioActivo.planContratado.nombre}</strong></p>
            <p>Subtotal: $${subtotal}</p>
            <p>IVA (21%): $${(subtotal * IVA).toFixed(2)}</p>
            <hr style="margin: 10px 0; border: 0.5px solid #444;">
            <h4>Total a Pagar: $${totalConIva.toFixed(2)}</h4>
            <button id="btn-confirmar-pago" class="btn-save" style="width: 100%; margin-top: 15px;">
                Confirmar y Pagar
            </button>
        </div>
    `;

    // Evento para el nuevo botón creado dinámicamente
    document.getElementById('btn-confirmar-pago').addEventListener('click', finalizarCompra);
}

function finalizarCompra() {
    usuarioActivo.suscrito = true;
    const total = (usuarioActivo.planContratado.precio * (1 + IVA)).toFixed(2);
    
    // Impacto en consola para el tutor
    console.log("--- PROCESANDO PAGO ---");
    console.log("Usuario:", usuarioActivo.email);
    console.log("Plan Finalizado:", usuarioActivo.planContratado.nombre);
    console.log("Total Facturado:", total);
    console.log("Estado: Suscripción Activa ✅");

    alert(`¡Gracias por tu compra! Tu ${usuarioActivo.planContratado.nombre} está activo.`);
    
    // Limpiamos el resumen tras confirmar
    document.getElementById('resumen-compra').innerHTML = `<p style="color: #00cf65; text-align: center;">✓ Suscripción activa</p>`;
}

// UPDATE: Cambiar datos
updateForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    usuarioActivo.email = document.getElementById('new-email').value;
    console.log("Email actualizado a:", usuarioActivo.email);
    actualizarInterfaz();
    document.getElementById('form-edicion').style.display = "none";
});

// DELETE: Cancelar
document.getElementById('btn-cancelar-sub')?.addEventListener('click', () => {
    if (confirm("¿Seguro que deseas cancelar?")) {
        console.log("Suscripción cancelada por el usuario.");
        usuarioActivo.planContratado = null;
        usuarioActivo.suscrito = false;
        document.getElementById('resumen-compra').innerHTML = "";
        actualizarInterfaz();
        mostrarPlanes();
    }
});