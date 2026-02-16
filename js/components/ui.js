import { catalogoPlanes, IVA } from "../services/planService.js";
import { qs } from "../utils/dom.js";

export function actualizarPerfil(usuario) {
  const contenedor = qs("#perfil-container");
  if (!contenedor) return;

  contenedor.classList.remove("hidden"); 
  contenedor.innerHTML = `
    <div class="card">
      <h3>Mi Perfil</h3>
      <p><strong>Email:</strong> ${usuario.email || "Invitado"}</p>
      <p><strong>Suscripción:</strong> ${usuario.planContratado?.nombre || "Sin plan"}</p>
      <p><strong>Estado:</strong> ${usuario.suscrito ? "Activo ✅" : "Pendiente de pago ⏳"}</p>
    </div>
  `;
}

export function mostrarPlanes(usuario, onSelectPlan) {
  const contenedor = qs("#planes-container");
  if (!contenedor) return;

  contenedor.classList.remove("hidden");
  contenedor.innerHTML = "";

  catalogoPlanes.forEach(plan => {
    const card = document.createElement("div");
    card.className = "plan-card"; 

    card.innerHTML = `
      <h3>${plan.nombre}</h3>
      <p>${plan.detalles}</p>
      <p><strong>$${plan.precio}</strong></p>
    `;

    const btn = document.createElement("button");
    btn.textContent = usuario.planContratado?.id === plan.id ? "Seleccionado" : "Contratar";
    
    if(usuario.planContratado?.id === plan.id) btn.style.filter = "grayscale(1)";

    btn.addEventListener("click", () => onSelectPlan(plan.id));

    card.appendChild(btn);
    contenedor.appendChild(card);
  });
}

export function renderFactura(usuario, onConfirmarPago) {
  const perfil = qs("#perfil-container");
  if (!usuario.planContratado || usuario.suscrito) return;

  const subtotal = usuario.planContratado.precio;
  const total = subtotal * (1 + IVA);

  const facturaDiv = document.createElement("div");
  facturaDiv.className = "card";
  facturaDiv.style.marginTop = "2rem";
  facturaDiv.innerHTML = `
      <h3 style="color: #9d4edd">Resumen de Facturación</h3>
      <p>Plan seleccionado: ${usuario.planContratado.nombre}</p>
      <p>Total (IVA incluido): <strong>$${total.toFixed(2)}</strong></p>
      <button id="btn-confirmar" style="margin-top: 1rem">Confirmar y Pagar</button>
  `;

  perfil.appendChild(facturaDiv);
  qs("#btn-confirmar")?.addEventListener("click", onConfirmarPago);
}

export function mostrarMensaje(texto) {
  alert(texto);
}