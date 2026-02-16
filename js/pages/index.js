import { cargarUsuario, guardarUsuario, crearUsuario, limpiarUsuario } from "../services/userService.js";
import { catalogoPlanes } from "../services/planService.js";
import { actualizarPerfil, mostrarPlanes, renderFactura, mostrarMensaje } from "../components/ui.js";
import { mostrarLoader, ocultarLoader, qs, on } from "../utils/dom.js";

let usuarioActivo = cargarUsuario() || crearUsuario();

// Actualizar botones de Nav según estado
if (usuarioActivo.email) {
    qs("#btn-login").classList.add("hidden");
    qs("#btn-logout").classList.remove("hidden");
}

/* ===== EVENTOS ===== */
on(qs("#btn-comenzar"), "click", () => {
  qs(".hero").classList.add("hidden"); 
  mostrarPlanes(usuarioActivo, seleccionarPlan);
});

on(qs("#btn-login"), "click", () => {
  window.location.href = "login.html";
});

on(qs("#btn-logout"), "click", () => {
  limpiarUsuario();
  window.location.href = "index.html";
});

/* ===== LÓGICA DE NEGOCIO ===== */

function seleccionarPlan(id) {
  const plan = catalogoPlanes.find(p => p.id === id);
  usuarioActivo.planContratado = plan;
  usuarioActivo.suscrito = false;

  guardarUsuario(usuarioActivo);
  
  // --- INTEGRACIÓN DE UI (Cambio de color del botón) ---
  const container = qs('#planes-container');
  
  // 1. Buscamos si había un botón seleccionado antes y lo "reseteamos"
  const prevSelected = container.querySelector('.btn-selected');
  if (prevSelected) {
      prevSelected.classList.remove('btn-selected');
      prevSelected.innerText = 'Contratar';
  }

  // 2. Buscamos el botón específico que se acaba de clickear. 
  const btnActual = container.querySelector(`button[data-id="${id}"]`) || event.target;
  
  if (btnActual && btnActual.tagName === 'BUTTON') {
      btnActual.classList.add('btn-selected');
      btnActual.innerText = 'Seleccionado';
  }
  // -----------------------------------------------------

  // Refrescar resto de la UI
  actualizarPerfil(usuarioActivo);
  
  mostrarPlanes(usuarioActivo, seleccionarPlan); 
  renderFactura(usuarioActivo, confirmarPago);
}

function confirmarPago() {
  usuarioActivo.suscrito = true;
  guardarUsuario(usuarioActivo);
  
  actualizarPerfil(usuarioActivo);
  mostrarMensaje("¡Bienvenido a la familia KaijuStream! 🐉");
  
  qs("#planes-container").classList.add("hidden");
}

/* ===== INIT ===== */
mostrarLoader();
setTimeout(() => {
  ocultarLoader();
  if (usuarioActivo.email) {
    qs(".hero").classList.add("hidden");
    actualizarPerfil(usuarioActivo);
    mostrarPlanes(usuarioActivo, seleccionarPlan);
  }
}, 800);