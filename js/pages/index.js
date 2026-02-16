import {
  cargarUsuario,
  guardarUsuario,
  crearUsuario,
  limpiarUsuario
} from "../services/userService.js";

import { catalogoPlanes } from "../services/planService.js";

import {
  actualizarPerfil,
  mostrarPlanes,
  renderFactura,
  mostrarMensaje
} from "../components/ui.js";

import { mostrarLoader, ocultarLoader, qs, on } from "../utils/dom.js";

/* ===== USUARIO ===== */

let usuarioActivo = cargarUsuario() || crearUsuario();

/* ===== BOTÓN COMENZAR ===== */

on(qs("#btn-comenzar"), "click", () => {
  mostrarPlanes(usuarioActivo, seleccionarPlan);
  actualizarPerfil(usuarioActivo);
});

/* ===== LOGIN NAV ===== */

on(qs("#btn-login"), "click", () => {
  window.location.href = "login.html";
});

/* ===== LOGOUT ===== */

on(qs("#btn-logout"), "click", () => {
  limpiarUsuario();
  location.reload();
});

/* ===== PLAN ===== */

function seleccionarPlan(id) {
  const plan = catalogoPlanes.find(p => p.id === id);

  usuarioActivo.planContratado = plan;
  usuarioActivo.suscrito = false;

  guardarUsuario(usuarioActivo);

  actualizarPerfil(usuarioActivo);
  mostrarPlanes(usuarioActivo, seleccionarPlan);

  renderFactura(usuarioActivo, confirmarPago);
}

/* ===== PAGO ===== */

function confirmarPago() {
  usuarioActivo.suscrito = true;
  guardarUsuario(usuarioActivo);

  mostrarMensaje("Suscripción confirmada 🎉");
}

/* ===== INIT ===== */

mostrarLoader();

setTimeout(() => {
  ocultarLoader();

  if (usuarioActivo.email) {
    actualizarPerfil(usuarioActivo);
    mostrarPlanes(usuarioActivo, seleccionarPlan);
  }
}, 600);
