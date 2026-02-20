/*UI COMPONENTS*/
import { catalogoPlanes, calcularPrecioFinal } from "../services/planService.js";
import { qs } from "../utils/dom.js";

// --- RENDERIZADO DEL PERFIL ---
export function actualizarPerfil(usuario, onEditar) {
    const contenedor = qs("#perfil-container");
    if (!contenedor) return;

    contenedor.classList.remove("hidden");
    contenedor.innerHTML = ""; 

    const card = document.createElement("div");
    card.className = "card profile-card";
    
    card.innerHTML = `
        <h3 style="color: #9d4edd">Mi Perfil Kaiju</h3>
        <div class="profile-info">
            <p><strong>Usuario:</strong> ${usuario.nombre || "Invitado"}</p>
            <p><strong>Email:</strong> ${usuario.email || "No registrado"}</p>
            <p><strong>Plan:</strong> <span class="badge-plan">${usuario.planContratado?.nombre || "Sin plan"}</span></p>
            <p><strong>Estado:</strong> ${usuario.suscrito ? "Activo ✅" : "Pendiente de pago ⏳"}</p>
        </div>
    `;

    const acciones = document.createElement("div");
    acciones.className = "actions-container";
    acciones.style.marginTop = "1rem";

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar Datos";
    btnEditar.className = "btn-secondary";
    btnEditar.addEventListener("click", (e) => { 
        e.preventDefault(); 
        onEditar(); 
    });

    acciones.appendChild(btnEditar);
    card.appendChild(acciones);
    contenedor.appendChild(card);
}

// --- RENDERIZADO DE LA FACTURA ---
export function renderFactura(usuario, onConfirmarPago) {
    const contenedorPerfil = qs("#perfil-container");
    if (!usuario.planContratado || usuario.suscrito || !contenedorPerfil) return;

    const previas = document.querySelectorAll(".factura-animada");
    previas.forEach(p => p.remove());

    const totalConIVA = calcularPrecioFinal(usuario.planContratado.precio);

    const facturaDiv = document.createElement("div");
    facturaDiv.className = "card factura-animada shadow-vlow";
    facturaDiv.style.marginTop = "20px";
    
    facturaDiv.innerHTML = `
        <h3 style="color: #9d4edd">Resumen de Pago</h3>
        <p>Plan seleccionado: <strong>${usuario.planContratado.nombre}</strong></p>
        <p>Subtotal: $${usuario.planContratado.precio}</p>
        <p>Total (IVA incluido): <span class="text-highlight">$${totalConIVA.toFixed(2)}</span></p>
    `;

    const btnPagar = document.createElement("button");
    btnPagar.textContent = "Confirmar Suscripción";
    btnPagar.className = "btn-primary";
    btnPagar.style.marginTop = "1rem";
    
    btnPagar.addEventListener("click", (e) => {
        e.preventDefault();
        onConfirmarPago();
    });

    facturaDiv.appendChild(btnPagar);
    contenedorPerfil.appendChild(facturaDiv);
}

// --- RENDERIZADO DEL CATÁLOGO ---
export const renderGrid = (animes, container) => {
    container.innerHTML = ""; 

    if (animes.length === 0) {
        container.innerHTML = `<p class="no-results">No se encontraron animes. Intenta con otro nombre.</p>`;
        return;
    }

    animes.forEach(anime => {
        const article = document.createElement('article');
        article.classList.add('anime-card');

        article.innerHTML = `
            <div class="card-image">
                <img src="${anime.imagen}" alt="Portada de ${anime.nombre}" loading="lazy">
            </div>
            <div class="card-content">
                <span class="badge">${anime.genero.toUpperCase()}</span>
                <h3>${anime.nombre}</h3>
                <p>${anime.descripcion}</p>
                <button class="btn-primary btn-suscribir" data-id="${anime.id}">
                    + Suscribirse
                </button>
            </div>
        `;
        container.appendChild(article);
    });
};

// --- RENDERIZADO DE PLANES ---
export function mostrarPlanes(usuario, onSelectPlan) {
    const contenedor = qs("#planes-container");
    if (!contenedor) return;
    
    contenedor.classList.remove("hidden");
    contenedor.innerHTML = "";
    
    catalogoPlanes.forEach(plan => {
        const card = document.createElement("div");
        card.className = `plan-card ${usuario.planContratado?.id === plan.id ? 'active' : ''}`;
        
        card.innerHTML = `
            <h3>${plan.nombre}</h3>
            <p class="plan-price">$${plan.precio}</p>
            <p class="plan-details">${plan.detalles}</p>
        `;
        
        const btn = document.createElement("button");
        const esSeleccionado = usuario.planContratado?.id === plan.id;
        
        btn.textContent = esSeleccionado ? "Plan Actual" : "Seleccionar Plan";
        btn.className = esSeleccionado ? "btn-disabled" : "btn-primary";
        btn.disabled = esSeleccionado;
        
        if (!esSeleccionado) {
            btn.addEventListener("click", () => onSelectPlan(plan.id));
        }
        
        card.appendChild(btn);
        contenedor.appendChild(card);
    });
}   

// --- RENDERIZADO DE FORMULARIO DE PERFIL ---
export function mostrarFormularioPerfil(usuario, onGuardar) {
    const contenedor = qs("#form-container");
    if (!contenedor) return;

    contenedor.classList.remove("hidden");
    contenedor.innerHTML = `
        <div class="card form-card">
            <h3 style="color: #9d4edd">Actualizar Mis Datos</h3>
            <form id="form-usuario-dinamico">
                <div class="form-group">
                    <label for="input-nombre">Nombre:</label>
                    <input type="text" id="input-nombre" value="${usuario.nombre || ''}" required>
                </div>
                <div class="form-group">
                    <label for="input-email">Email:</label>
                    <input type="email" id="input-email" value="${usuario.email || ''}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Guardar Cambios</button>
                    <button type="button" id="btn-cancelar-form" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    // Listener del formulario
    const form = qs("#form-usuario-dinamico");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        onGuardar({
            nombre: qs("#input-nombre").value.trim(),
            email: qs("#input-email").value.trim()
        });
    });

    // Listener para cerrar el formulario
    qs("#btn-cancelar-form").addEventListener("click", () => {
        contenedor.classList.add("hidden");
    });
}