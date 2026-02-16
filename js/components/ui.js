import { catalogoPlanes, IVA } from "../services/planService.js";
import { qs } from "../utils/dom.js";

/* ===== PERFIL ===== */

export function actualizarPerfil(usuario) {
  qs("#perfil-container").innerHTML = `
    <h3>Perfil</h3>
    <p>Email: ${usuario.email || "Invitado"}</p>
    <p>Plan: ${usuario.planContratado?.nombre || "Sin suscripción"}</p>
  `;
}

/* ===== PLANES ===== */

export function mostrarPlanes(usuario, onSelectPlan) {
  const contenedor = qs("#planes-container");
  if (!contenedor) return;

  contenedor.classList.remove("hidden");
  contenedor.innerHTML = "";

  catalogoPlanes.forEach(plan => {
    const card = document.createElement("div");
    card.className = "feature-card";

    card.innerHTML = `
      <h3>${plan.nombre}</h3>
      <p>${plan.detalles}</p>
      <p><strong>$${plan.precio}</strong></p>
    `;

    const btn = document.createElement("button");
    btn.textContent =
      usuario.planContratado?.id === plan.id
        ? "Seleccionado"
        : "Contratar";

    btn.addEventListener("click", () => onSelectPlan(plan.id));

    card.appendChild(btn);
    contenedor.appendChild(card);
  });
}

/* ===== FACTURA ===== */

export function renderFactura(usuario, onConfirmarPago) {
  const perfil = qs("#perfil-container");

  if (!usuario.planContratado) return;

  const subtotal = usuario.planContratado.precio;
  const total = subtotal * (1 + IVA);

  perfil.innerHTML += `
    <div class="card">
      <h3>Facturación</h3>
      <p>${usuario.planContratado.nombre}</p>
      <p>Total: $${total.toFixed(2)}</p>
      <button id="btn-confirmar">Confirmar pago</button>
    </div>
  `;

  qs("#btn-confirmar")?.addEventListener("click", onConfirmarPago);
}

/* ===== MENSAJES ===== */

export function mostrarMensaje(texto) {
  alert(texto);
}
