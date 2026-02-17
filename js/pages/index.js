import { cargarUsuario, guardarUsuario, crearUsuario, limpiarUsuario } from "../services/userService.js";
import { catalogoPlanes } from "../services/planService.js";
import { actualizarPerfil, mostrarPlanes, renderFactura, mostrarMensaje, mostrarFormularioPerfil } from "../components/ui.js";
import { mostrarLoader, ocultarLoader, qs, on } from "../utils/dom.js";

let usuarioActivo = cargarUsuario() || crearUsuario();

/* ===== FUNCIONES DE ACCIÓN ===== */

function ejecutarGuardado(nuevosDatos) {
    usuarioActivo.email = nuevosDatos.email;
    usuarioActivo.nombre = nuevosDatos.nombre;
    guardarUsuario(usuarioActivo);
    qs("#form-container").classList.add("hidden");
    mostrarMensaje("Perfil actualizado ✅");
    actualizarInterfaz();
}

function ejecutarPago() {
    usuarioActivo.suscrito = true;
    guardarUsuario(usuarioActivo);
    mostrarMensaje("¡Suscripción Activa! 🐉");
    actualizarInterfaz();
}

function ejecutarSeleccion(id) {
    const plan = catalogoPlanes.find(p => p.id === id);
    usuarioActivo.planContratado = plan;
    usuarioActivo.suscrito = false;
    guardarUsuario(usuarioActivo);
    actualizarInterfaz();
}

/* ===== CONTROL DE INTERFAZ ===== */

function actualizarInterfaz() {
    // 1. Navbar
    if (usuarioActivo.email && usuarioActivo.email !== "") {
        qs("#btn-login")?.classList.add("hidden");
        qs("#btn-logout")?.classList.remove("hidden");
    }

    // 2. Render de componentes
    actualizarPerfil(usuarioActivo, () => mostrarFormularioPerfil(usuarioActivo, ejecutarGuardado));
    
    if (!usuarioActivo.suscrito) {
        mostrarPlanes(usuarioActivo, ejecutarSeleccion);
        renderFactura(usuarioActivo, ejecutarPago);
    } else {
        qs("#planes-container").classList.add("hidden");
        qs("#form-container").classList.add("hidden");
        const factura = qs(".factura-animada");
        if (factura) factura.remove();
    }
}

/* ===== EVENTOS DE BOTONES ESTÁTICOS ===== */

// EVENTO LOGIN 
on(qs("#btn-login"), "click", () => {
    window.location.href = "login.html";
});

on(qs("#btn-comenzar"), "click", () => {
    qs(".hero").classList.add("hidden");
    actualizarInterfaz();
});

on(qs("#btn-logout"), "click", () => {
    limpiarUsuario();
    window.location.href = "index.html";
});

/* ===== INIT ===== */
mostrarLoader();
setTimeout(() => {
    ocultarLoader();
    if (usuarioActivo.planContratado || (usuarioActivo.email && usuarioActivo.email !== "")) {
        qs(".hero")?.classList.add("hidden");
        actualizarInterfaz();
    }
}, 800);

// Listener de emergencia 
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "btn-pagar-final") {
        ejecutarPago();
    }
});