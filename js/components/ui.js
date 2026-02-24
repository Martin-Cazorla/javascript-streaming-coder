/* UI COMPONENTS */
import { calcularPrecioFinal, formatearMoneda } from "../services/planService.js";
import { qs, create, on } from "../utils/dom.js";

/** PERFIL: Gestión de usuario */
export function actualizarPerfil(usuario, onEditar, onCancelarPlan) {
    const contenedor = qs("#perfil-container");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const card = create("div", "card profile-card");
    const title = create("h3", "", "Mi Perfil de Usuario");
    
    const infoList = create("ul", "profile-info");
    infoList.append(
        create("li", "", `Nombre: ${usuario.nombre}`),
        create("li", "", `Email: ${usuario.email}`),
        create("li", "", `Plan: ${usuario.planContratado ? usuario.planContratado.nombre : 'Ninguno'} ${usuario.suscrito ? '✅ (Activo)' : ''}`)
    );

    const acciones = create("div", "profile-actions");
    
    if (usuario.suscrito) {
        const btnCatalogo = create("button", "btn-primary", "Explorar Catálogo");
        btnCatalogo.style.backgroundColor = "#2a9d8f"; 
        on(btnCatalogo, "click", () => location.assign("pages/catalog.html"));
        acciones.append(btnCatalogo);
    }

    const btnEditar = create("button", "btn-secondary", "Editar Datos");
    on(btnEditar, "click", onEditar);
    acciones.append(btnEditar);

    if (usuario.planContratado) {
        const btnCancelar = create("button", "btn-danger", "Cancelar Plan");
        on(btnCancelar, "click", onCancelarPlan);
        acciones.append(btnCancelar);
    }

    card.append(title, infoList, acciones);
    contenedor.appendChild(card);
}

/** GRID ANIMES*/
export function renderGrid(animes, container) {
    if (!container) return;
    container.innerHTML = ""; 

    animes.forEach(anime => {
        const card = create("article", "anime-card");
        card.setAttribute("data-id", anime.id);

        const img = create("img", "anime-img");
        img.src = anime.imagen;
        img.alt = anime.nombre;

        const info = create("div", "anime-info");
        const title = create("h4", "", anime.nombre);
        const genero = create("span", "badge", anime.genero);
        const desc = create("p", "small", anime.descripcion);

        const btnSuscribir = create("button", "btn-suscribir", "+ Mi Lista");
        btnSuscribir.setAttribute("data-id", anime.id);

        info.append(title, genero, desc, btnSuscribir);
        card.append(img, info);
        container.appendChild(card);
    });
}

/** PLANES: Renderizado de planes de suscripción */
export function mostrarPlanes(catalogo, usuario, onSeleccionar) {
    const cont = qs("#planes-container");
    if (!cont) return;
    cont.innerHTML = "<h2>Elige tu Plan Kaiju</h2>";

    const grid = create("div", "planes-grid");

    catalogo.forEach(plan => {
        const planCard = create("article", "card plan-card");
        const h4 = create("h4", "", plan.nombre);
        const precioTotal = calcularPrecioFinal(plan.precio);
        const precioTxt = create("p", "price", formatearMoneda(precioTotal));
        const desc = create("p", "", plan.descripcion);
        
        let textoBtn = "Seleccionar";
        if (usuario.planContratado?.id === plan.id) {
            textoBtn = usuario.suscrito ? "Plan Actual" : "Pendiente de Pago";
        }

        const btn = create("button", "btn-primary", textoBtn);
        btn.type = "button";
        
        if (usuario.planContratado?.id === plan.id && usuario.suscrito) {
            btn.disabled = true;
        }

        on(btn, "click", () => onSeleccionar(plan.id));

        planCard.append(h4, precioTxt, desc, btn);
        grid.append(planCard);
    });

    cont.appendChild(grid);
}

/**FACTURA: Renderiza el resumen de pago asíncrono.*/
export function renderFactura(usuario, onPagar) {
    const cont = qs("#form-container"); 
    if (!usuario.planContratado || usuario.suscrito) return;

    const facturaDiv = create("div", "factura-box");
    facturaDiv.innerHTML = "<h3>Resumen de Suscripción</h3>";

    const detalle = create("p", "", `Has seleccionado el plan: ${usuario.planContratado.nombre}`);
    const total = calcularPrecioFinal(usuario.planContratado.precio);
    const monto = create("strong", "total-monto", `Total a pagar (IVA incl.): ${formatearMoneda(total)}`);
    
    const btnPagar = create("button", "btn-success", "Proceder al Pago");
    btnPagar.type = "button";
    btnPagar.style.display = "block";
    btnPagar.style.marginTop = "15px";
    btnPagar.addEventListener("click", onPagar);

    facturaDiv.append(detalle, monto, btnPagar);
    cont.appendChild(facturaDiv);
}

/**FORMULARIO: Con etiquetas de accesibilidad y validación*/
export function mostrarFormularioPerfil(usuario, onGuardar) {
    const cont = qs("#form-container");
    if (!cont) return;
    cont.innerHTML = "<h3>Completa tu información</h3>";

    const form = create("form", "perfil-form");
    
    const crearCampo = (id, labelText, value, type = "text") => {
        const group = create("div", "form-group");
        const label = create("label", "", labelText);
        label.setAttribute("for", id);
        const input = create("input");
        input.id = id;
        input.type = type;
        input.value = value || "";
        input.required = true;
        input.placeholder = labelText; 
        group.append(label, input);
        return { group, input };
    };

    const { group: gNom, input: iNom } = crearCampo("f-nombre", "Nombre:", usuario.nombre);
    const { group: gEma, input: iEma } = crearCampo("f-email", "Email:", usuario.email, "email");

    const btnSubmit = create("button", "btn-success", "Guardar Cambios");
    btnSubmit.type = "submit";

    form.append(gNom, gEma, btnSubmit);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        onGuardar({
            nombre: iNom.value,
            email: iEma.value
        });
    });

    cont.appendChild(form);
}