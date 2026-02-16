import { catalogoPlanes, crearUsuario } from "./data.js";
import { guardarUsuario, cargarUsuario } from "./storage.js";
import {
    mostrarApp,
    actualizarPerfil,
    mostrarPlanes,
    renderFactura,
    mostrarMensaje,
    mostrarSuscripcionActiva
} from "./ui.js";

let usuarioActivo = cargarUsuario() || crearUsuario();

/* === LOGIN === */

document.getElementById("loginForm")?.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    usuarioActivo = crearUsuario(email);

    guardarUsuario(usuarioActivo);
    window.location.href = "index.html";
});

/* === INICIO APP === */

document.getElementById("btn-comenzar")?.addEventListener("click", () => {
    mostrarApp();
    actualizarPerfil(usuarioActivo);
    mostrarPlanes(usuarioActivo, seleccionarPlan);
});

/* === SELECCIÓN PLAN === */

function seleccionarPlan(id) {
    const plan = catalogoPlanes.find(p => p.id === id);
    if (!plan) return;

    usuarioActivo.planContratado = plan;
    usuarioActivo.suscrito = false;

    guardarUsuario(usuarioActivo);

    actualizarPerfil(usuarioActivo);
    mostrarPlanes(usuarioActivo, seleccionarPlan);
    renderFactura(usuarioActivo, confirmarPago);
}

/* === CONFIRMAR PAGO === */

function confirmarPago() {
    usuarioActivo.suscrito = true;
    guardarUsuario(usuarioActivo);

    mostrarSuscripcionActiva();
    mostrarMensaje("¡Suscripción confirmada!");
}

/* === PERFIL === */

document.getElementById("updateForm")?.addEventListener("submit", e => {
    e.preventDefault();

    const nuevoEmail = document.getElementById("new-email").value;
    usuarioActivo.email = nuevoEmail;

    guardarUsuario(usuarioActivo);
    actualizarPerfil(usuarioActivo);
});

/* === CANCELAR SUSCRIPCIÓN === */

document.getElementById("btn-cancelar-sub")?.addEventListener("click", () => {
    usuarioActivo.planContratado = null;
    usuarioActivo.suscrito = false;

    guardarUsuario(usuarioActivo);
    actualizarPerfil(usuarioActivo);
    mostrarPlanes(usuarioActivo, seleccionarPlan);
});

/* === CARGA INICIAL === */

if (usuarioActivo.email) {
    mostrarApp();
    actualizarPerfil(usuarioActivo);
    mostrarPlanes(usuarioActivo, seleccionarPlan);

    if (usuarioActivo.suscrito) {
        mostrarSuscripcionActiva();
    }
}
