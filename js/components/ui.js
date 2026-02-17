import { catalogoPlanes, IVA } from "../services/planService.js";
import { qs } from "../utils/dom.js";

export function actualizarPerfil(usuario, onEditar) {
    const contenedor = qs("#perfil-container");
    if (!contenedor) return;

    contenedor.classList.remove("hidden");
    contenedor.innerHTML = ""; 

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <h3 style="color: #9d4edd">Mi Perfil</h3>
        <p><strong>Usuario:</strong> ${usuario.nombre || "Invitado"}</p>
        <p><strong>Email:</strong> ${usuario.email || "No registrado"}</p>
        <p><strong>Suscripción:</strong> ${usuario.planContratado?.nombre || "Sin plan"}</p>
        <p><strong>Estado:</strong> ${usuario.suscrito ? "Activo ✅" : "Pendiente de pago ⏳"}</p>
    `;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar Perfil";
    btnEditar.className = "btn-secundario";
    btnEditar.style.marginTop = "10px";
    
    btnEditar.addEventListener("click", (e) => {
        e.preventDefault();
        onEditar();
    });

    card.appendChild(btnEditar);
    contenedor.appendChild(card);
}

export function renderFactura(usuario, onConfirmarPago) {
    const contenedorPerfil = qs("#perfil-container");
    if (!usuario.planContratado || usuario.suscrito || !contenedorPerfil) return;

    // 1. Limpieza absoluta de facturas previas
    const previas = document.querySelectorAll(".factura-animada");
    previas.forEach(p => p.remove());

    const total = usuario.planContratado.precio * (1 + IVA);
    const facturaDiv = document.createElement("div");
    facturaDiv.className = "card factura-animada";
    facturaDiv.style.marginTop = "20px";
    
    facturaDiv.innerHTML = `
        <h3 style="color: #9d4edd">Resumen de Facturación</h3>
        <p>Plan seleccionado: ${usuario.planContratado.nombre}</p>
        <p>Total (IVA incluido): <strong>$${total.toFixed(2)}</strong></p>
    `;

    // 2. Creación manual del botón para asegurar el evento
    const btnPagar = document.createElement("button");
    btnPagar.textContent = "Confirmar y Pagar";
    btnPagar.id = "btn-pagar-final"; 
    btnPagar.style.marginTop = "1rem";
    btnPagar.style.cursor = "pointer"; 
    btnPagar.style.pointerEvents = "auto"; 
    
    // 3. Vinculación limpia
    btnPagar.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        console.log("Clic detectado en Confirmar y Pagar"); 
        onConfirmarPago();
    });

    facturaDiv.appendChild(btnPagar);
    contenedorPerfil.appendChild(facturaDiv);
}

export function mostrarFormularioPerfil(usuario, onGuardar) {
    const contenedor = qs("#form-container");
    if (!contenedor) return;

    contenedor.classList.remove("hidden");
    contenedor.innerHTML = `
        <div class="card">
            <h3>Actualizar Mis Datos</h3>
            <form id="form-usuario">
                <div class="form-group" style="margin-bottom:10px">
                    <label>Email:</label><br>
                    <input type="email" id="input-email" value="${usuario.email || ''}" required>
                </div>
                <div class="form-group" style="margin-bottom:10px">
                    <label>Nombre:</label><br>
                    <input type="text" id="input-nombre" value="${usuario.nombre || ''}" required>
                </div>
                <button type="submit">Guardar Cambios</button>
                <button type="button" id="btn-cancelar">Cancelar</button>
            </form>
        </div>
    `;

    // Evento de Guardar
    qs("#form-usuario").addEventListener("submit", (e) => {
        e.preventDefault();
        onGuardar({
            email: qs("#input-email").value,
            nombre: qs("#input-nombre").value
        });
    });

    // Evento de Cancelar
    qs("#btn-cancelar").addEventListener("click", () => {
        contenedor.classList.add("hidden");
    });
}

export function mostrarPlanes(usuario, onSelectPlan) {
    const contenedor = qs("#planes-container");
    if (!contenedor) return;
    contenedor.classList.remove("hidden");
    contenedor.innerHTML = "";
    catalogoPlanes.forEach(plan => {
        const card = document.createElement("div");
        card.className = "plan-card";
        card.innerHTML = `<h3>${plan.nombre}</h3><p>${plan.detalles}</p><p><strong>$${plan.precio}</strong></p>`;
        const btn = document.createElement("button");
        const esSeleccionado = usuario.planContratado?.id === plan.id;
        btn.textContent = esSeleccionado ? "Seleccionado" : "Contratar";
        if (esSeleccionado) {
            btn.style.filter = "grayscale(1)";
            btn.disabled = true;
        } else {
            btn.addEventListener("click", () => onSelectPlan(plan.id));
        }
        card.appendChild(btn);
        contenedor.appendChild(card);
    });
}

export function mostrarMensaje(texto) {
    const msg = document.createElement("div");
    msg.textContent = texto;
    msg.style.cssText = "position:fixed; bottom:20px; right:20px; background:#9d4edd; color:white; padding:15px; border-radius:8px; z-index:1000; box-shadow: 0 4px 15px rgba(0,0,0,0.3);";
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}