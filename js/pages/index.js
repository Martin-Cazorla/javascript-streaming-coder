/** * LÓGICA DE LA PÁGINA DE INDEX
 */
import {
    cargarUsuario,
    guardarUsuario,
    crearUsuario,
    limpiarUsuario,
    asignarPlan,
    confirmarPagoPlan,
    cancelarPlanActivo 
} from "../services/userService.js";

import { obtenerCatalogoPlanes } from "../services/planService.js";

import {
    actualizarPerfil,
    mostrarPlanes,
    renderFactura,
    mostrarFormularioPerfil
} from "../components/ui.js";

import {
    mostrarLoader,
    ocultarLoader,
    qs,
    on,
    create 
} from "../utils/dom.js";

// ===== ESTADO GLOBAL DEL SIMULADOR =====
let usuarioActivo = cargarUsuario();
let catalogoPlanes = [];

// ===== INICIALIZACIÓN =====
if (!usuarioActivo) {
    usuarioActivo = crearUsuario();
}

// ===== LÓGICA DE NEGOCIO (EVENT HANDLERS) =====

function ejecutarSeleccion(id) {
    const resultado = asignarPlan(id, catalogoPlanes);
    if (!resultado) return;
    
    usuarioActivo = resultado;

    if (!usuarioActivo.email || usuarioActivo.nombre === "Invitado") {
        qs("#form-container")?.classList.remove("hidden");
        mostrarFormularioPerfil(usuarioActivo, ejecutarGuardado);
    }

    actualizarInterfaz();
}

/**Procesa el guardado de datos del formulario de perfil.*/
function ejecutarGuardado(nuevosDatos) {
    usuarioActivo.nombre = nuevosDatos.nombre;
    usuarioActivo.email = nuevosDatos.email;
    guardarUsuario(usuarioActivo);
    
    qs("#form-container")?.classList.add("hidden");

    Swal.fire({
        title: "¡Perfil Actualizado!",
        text: "Tus datos han sido guardados con éxito.",
        icon: "success",
        confirmButtonColor: "#9d4edd",
        background: "#1a1a1a",
        color: "#fff"
    });

    actualizarInterfaz();
}

/**Ejecuta la baja del plan contratado.*/
function ejecutarCancelacion() {
    Swal.fire({
        title: "¿Deseas cancelar tu plan?",
        text: "Perderás el acceso inmediato al catálogo premium.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar suscripción",
        cancelButtonText: "Mantener plan",
        confirmButtonColor: "#d33",
        background: "#1a1a1a",
        color: "#fff"
    }).then((result) => {
        if (result.isConfirmed) {
            usuarioActivo = cancelarPlanActivo();
            Swal.fire("Cancelado", "Tu suscripción ha sido dada de baja.", "success");
            actualizarInterfaz();
        }
    });
}

/**Simula la pasarela de pago asíncrona.*/
async function ejecutarPago() {
    if (!usuarioActivo.planContratado) return;

    const { value: confirmado } = await Swal.fire({
        title: "Confirmar Pago",
        background: "#1a1a1a",
        color: "#fff",
        html: `
            <p style="margin-bottom: 15px;">Monto a abonar: <b>${usuarioActivo.planContratado.nombre}</b></p>
            <input id="card-num" class="swal2-input" placeholder="Número de tarjeta (16 dígitos)" maxlength="16">
        `,
        confirmButtonText: "Pagar Ahora",
        showCancelButton: true,
        preConfirm: () => {
            const num = qs("#card-num").value;
            if (num.length < 16) {
                Swal.showValidationMessage("La tarjeta debe tener 16 dígitos");
                return false;
            }
            return true;
        }
    });

    if (!confirmado) return;

    usuarioActivo = confirmarPagoPlan();
    
    Swal.fire({
        title: "¡Pago Exitoso!",
        text: "Bienvenido a KaijuStream.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        location.assign("pages/catalog.html");
    });
}

// ===== GESTIÓN DE LA INTERFAZ =====

function actualizarInterfaz() {
    usuarioActivo = cargarUsuario() || usuarioActivo;
    
    const hero = qs(".hero");
    const planesCont = qs("#planes-container");
    const perfilCont = qs("#perfil-container");
    const formCont = qs("#form-container");
    const navAuth = qs(".nav-auth");

    if (usuarioActivo.email || usuarioActivo.planContratado) {
        hero?.classList.add("hidden");
    }

    if (usuarioActivo.email && usuarioActivo.nombre !== "Invitado") {
        qs("#btn-login")?.classList.add("hidden");
        qs("#btn-logout")?.classList.remove("hidden");

        const btnExistente = qs("#btn-nav-catalog");
        if (usuarioActivo.suscrito) {
            if (!btnExistente && navAuth) {
                const btnNavCatalog = create("button", "btn-success", "📺 Ver Anime");
                btnNavCatalog.id = "btn-nav-catalog";
                btnNavCatalog.style.marginRight = "10px"; 
                on(btnNavCatalog, "click", () => location.assign("pages/catalog.html"));
                navAuth.prepend(btnNavCatalog);
            }
        } else {
            btnExistente?.remove();
        }
    }

    // Renderizado de Perfil
    if (usuarioActivo.email && usuarioActivo.email !== "") {
        perfilCont?.classList.remove("hidden");
        actualizarPerfil(
            usuarioActivo, 
            () => {
                formCont?.classList.remove("hidden");
                mostrarFormularioPerfil(usuarioActivo, ejecutarGuardado);
                formCont?.scrollIntoView({ behavior: 'smooth' });
            },
            ejecutarCancelacion 
        );
    }

    // Renderizado de Planes
    if (planesCont && catalogoPlanes.length > 0) {
        planesCont.classList.remove("hidden");
        mostrarPlanes(catalogoPlanes, usuarioActivo, ejecutarSeleccion);
    }

    // Renderizado de Factura
    if (usuarioActivo.planContratado && !usuarioActivo.suscrito) {
        formCont?.classList.remove("hidden");
        renderFactura(usuarioActivo, ejecutarPago);
    }
}

// ===== ASIGNACIÓN DE EVENTOS ESTÁTICOS =====
on(qs("#btn-comenzar"), "click", () => {
    actualizarInterfaz();
});

on(qs("#btn-login"), "click", () => location.assign("pages/login.html"));

on(qs("#btn-logout"), "click", () => {
    limpiarUsuario();
    location.assign("index.html");
});

// ===== INICIO ASÍNCRONO DE LA APP =====
async function iniciarApp() {
    try {
        mostrarLoader();
        catalogoPlanes = await obtenerCatalogoPlanes();
        
        if (!catalogoPlanes || catalogoPlanes.length === 0) {
            throw new Error("No se pudo cargar el catálogo de planes.");
        }

        if (usuarioActivo.planContratado || (usuarioActivo.email && usuarioActivo.email !== "")) {
            actualizarInterfaz();
        }
    } catch (error) {
        console.error("Error al iniciar App:", error);
        Swal.fire({
            title: "Error de Servidor",
            text: "No pudimos obtener la lista de planes. Reintenta en unos minutos.",
            icon: "error",
            background: "#1a1a1a",
            color: "#fff"
        });
    } finally {
        ocultarLoader();
    }
}

iniciarApp();