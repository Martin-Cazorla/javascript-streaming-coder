import { catalogoPlanes, IVA } from "./data.js";

const seccionHero = document.getElementById('hero-section');
const seccionPerfil = document.getElementById('seccion-perfil');
const seccionCatalogo = document.getElementById('seccion-catalogo');
const contenedorPlanes = document.getElementById('contenedor-planes');
const infoEmail = document.getElementById('info-email');
const infoPlan = document.getElementById('info-plan');
const userDisplay = document.getElementById('user-display');
const resumenDiv = document.getElementById('resumen-compra');

export function mostrarApp() {
    seccionHero?.style.setProperty("display", "none");
    seccionPerfil?.style.setProperty("display", "block");
    seccionCatalogo?.style.setProperty("display", "block");
}

export function actualizarPerfil(usuario) {
    if (infoEmail) infoEmail.textContent = usuario.email || "Invitado";
    if (infoPlan) infoPlan.textContent =
        usuario.planContratado?.nombre || "Sin suscripción";

    if (userDisplay) {
        userDisplay.textContent = usuario.email
            ? `Hola, ${usuario.email}`
            : "";
    }
}

export function mostrarPlanes(usuario, onSelectPlan) {
    if (!contenedorPlanes) return;

    contenedorPlanes.innerHTML = "";

    catalogoPlanes.forEach(plan => {
        const card = document.createElement("div");
        card.className = "feature-card";

        card.innerHTML = `
            <h3>${plan.nombre}</h3>
            <p>${plan.detalles}</p>
            <p><strong>$${plan.precio}</strong></p>
        `;

        const btn = document.createElement("button");
        btn.className = "btn-primary-small";
        btn.textContent =
            usuario.planContratado?.id === plan.id
                ? "Seleccionado"
                : "Contratar";

        btn.addEventListener("click", () => onSelectPlan(plan.id));

        card.appendChild(btn);
        contenedorPlanes.appendChild(card);
    });
}

export function renderFactura(usuario, onConfirmarPago) {
    if (!resumenDiv || !usuario.planContratado) return;

    const subtotal = usuario.planContratado.precio;
    const total = subtotal * (1 + IVA);

    resumenDiv.innerHTML = `
        <div class="card">
            <h3>Resumen de Facturación</h3>
            <p>${usuario.planContratado.nombre}</p>
            <p>Subtotal: $${subtotal}</p>
            <p>IVA: $${(subtotal * IVA).toFixed(2)}</p>
            <h4>Total: $${total.toFixed(2)}</h4>
            <button id="btn-confirmar" class="btn-save">
                Confirmar Pago
            </button>
            <p id="mensaje"></p>
        </div>
    `;

    document
        .getElementById("btn-confirmar")
        ?.addEventListener("click", onConfirmarPago);
}

export function mostrarMensaje(texto) {
    const msg = document.getElementById("mensaje");
    if (msg) msg.textContent = texto;
}

export function mostrarSuscripcionActiva() {
    if (resumenDiv) {
        resumenDiv.innerHTML =
            `<p style="color:#00cf65">✓ Suscripción activa</p>`;
    }
}
