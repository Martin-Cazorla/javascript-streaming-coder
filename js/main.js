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
const btnEditarPerfil = document.getElementById('btn-editar-perfil');
const formEdicionContenedor = document.getElementById('form-edicion');

/* === 3. RENDERIZADO === */

function mostrarPlanes() {
    contenedorPlanes.innerHTML = "";
    catalogoPlanes.forEach(plan => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        
        // Contenido estático
        card.innerHTML = `
            <h3>${plan.nombre}</h3>
            <p>${plan.detalles}</p>
            <p><strong>Mensual: $${plan.precio}</strong></p>
        `;

        // Creación de botón con Event Listener 
        const boton = document.createElement('button');
        boton.className = 'btn-primary-small';
        boton.innerText = usuarioActivo.planContratado?.id === plan.id ? 'Seleccionado' : 'Contratar';
        
        boton.addEventListener('click', () => {
            seleccionarPlan(plan.id);
        });

        card.appendChild(boton);
        contenedorPlanes.appendChild(card);
    });
}

function actualizarInterfaz() {
    infoEmail.innerText = usuarioActivo.email || "Invitado";
    infoPlan.innerText = usuarioActivo.planContratado ? usuarioActivo.planContratado.nombre : "Sin suscripción activa";
    if (userDisplay) userDisplay.innerText = usuarioActivo.email ? `Hola, ${usuarioActivo.email}` : "";
}

/* === 4. LÓGICA DE NEGOCIO Y PERSISTENCIA === */

// Cargar datos al iniciar
function cargarDatosStorage() {
    const datosGuardados = localStorage.getItem('usuarioKaiju');
    if (datosGuardados) {
        usuarioActivo = JSON.parse(datosGuardados);
        if (usuarioActivo.email) {
            seccionHero.style.display = "none";
            seccionPerfil.style.display = "block";
            seccionCatalogo.style.display = "block";
            actualizarInterfaz();
            mostrarPlanes();
            if (usuarioActivo.planContratado && !usuarioActivo.suscrito) {
                renderizarFactura();
            } else if (usuarioActivo.suscrito) {
                document.getElementById('resumen-compra').innerHTML = `<p style="color: #00cf65; text-align: center;">✓ Suscripción activa</p>`;
            }
        }
    }
}

// Iniciar sistema 
document.getElementById('btn-comenzar')?.addEventListener('click', () => {
    if (!usuarioActivo.email) usuarioActivo.email = "martincazorla@logistica.com";
    seccionHero.style.display = "none";
    seccionPerfil.style.display = "block";
    seccionCatalogo.style.display = "block";
    actualizarInterfaz();
    mostrarPlanes();
    localStorage.setItem('usuarioKaiju', JSON.stringify(usuarioActivo));
});

// Selección de Plan 
function seleccionarPlan(id) {
    const planElegido = catalogoPlanes.find(p => p.id === id);
    if (planElegido) {
        usuarioActivo.planContratado = planElegido;
        usuarioActivo.suscrito = false;
        actualizarInterfaz();
        mostrarPlanes();
        renderizarFactura();
        localStorage.setItem('usuarioKaiju', JSON.stringify(usuarioActivo));
    }
}

// Resumen de Facturación
function renderizarFactura() {
    const resumenDiv = document.getElementById('resumen-compra');
    if (!usuarioActivo.planContratado) return;

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

    document.getElementById('btn-confirmar-pago').addEventListener('click', finalizarCompra);
}

function finalizarCompra() {
    usuarioActivo.suscrito = true;
    localStorage.setItem('usuarioKaiju', JSON.stringify(usuarioActivo));
    
    alert(`¡Gracias por tu compra! Tu ${usuarioActivo.planContratado.nombre} está activo.`);
    document.getElementById('resumen-compra').innerHTML = `<p style="color: #00cf65; text-align: center;">✓ Suscripción activa</p>`;
}

/* === 5. GESTIÓN DE PERFIL === */

// Mostrar formulario de edición
btnEditarPerfil?.addEventListener('click', () => {
    formEdicionContenedor.style.display = "block";
    document.getElementById('new-email').value = usuarioActivo.email;
});

// Update: Cambiar Email
updateForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevoEmail = document.getElementById('new-email').value;
    usuarioActivo.email = nuevoEmail;
    
    actualizarInterfaz();
    formEdicionContenedor.style.display = "none";
    localStorage.setItem('usuarioKaiju', JSON.stringify(usuarioActivo));
    console.log("Datos actualizados en Storage.");
});

// Delete: Cancelar Suscripción
document.getElementById('btn-cancelar-sub')?.addEventListener('click', () => {
    if (confirm("¿Seguro que deseas cancelar tu suscripción?")) {
        usuarioActivo.planContratado = null;
        usuarioActivo.suscrito = false;
        
        document.getElementById('resumen-compra').innerHTML = "";
        actualizarInterfaz();
        mostrarPlanes();
        localStorage.setItem('usuarioKaiju', JSON.stringify(usuarioActivo));
    }
});

// Ejecución inicial
cargarDatosStorage();