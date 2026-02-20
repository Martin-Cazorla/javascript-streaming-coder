/**Lógica de la página de index */
import { cargarUsuario, guardarUsuario, crearUsuario, limpiarUsuario } from "../services/userService.js";
import { catalogoPlanes } from "../services/planService.js";
import { actualizarPerfil, mostrarPlanes, renderFactura, mostrarFormularioPerfil } from "../components/ui.js";
import { mostrarLoader, ocultarLoader, qs, on } from "../utils/dom.js";

// Inicializamos el usuario
let usuarioActivo = cargarUsuario() || crearUsuario();

/* ===== FUNCIONES DE ACCIÓN ===== */

function ejecutarGuardado(nuevosDatos) {
    usuarioActivo.email = nuevosDatos.email;
    usuarioActivo.nombre = nuevosDatos.nombre;
    guardarUsuario(usuarioActivo);
    
    qs("#form-container").classList.add("hidden");
    Swal.fire('¡Éxito!', 'Perfil actualizado', 'success');
    actualizarInterfaz();
}

function ejecutarPago() {
    usuarioActivo.suscrito = true;
    guardarUsuario(usuarioActivo);
    
    Swal.fire({
        title: '¡Suscripción Activa! 🐉',
        text: 'Ya puedes acceder al catálogo completo.',
        icon: 'success',
        confirmButtonText: 'Ir al Catálogo',
        confirmButtonColor: '#9d4edd'
    }).then(() => {
        window.location.href = "catalog.html";
    });
}

function ejecutarSeleccion(id) {
    const plan = catalogoPlanes.find(p => p.id === Number(id));
    usuarioActivo.planContratado = plan;
    usuarioActivo.suscrito = false;
    guardarUsuario(usuarioActivo);
    actualizarInterfaz();
}

/* ===== CONTROL DE INTERFAZ ===== */

function actualizarInterfaz() {
    const hero = qs(".hero");
    const planesCont = qs("#planes-container");
    const perfilCont = qs("#perfil-container");

    hero?.classList.add("hidden");

    // Manejo de Navbar
    if (usuarioActivo.email) {
        qs("#btn-login")?.classList.add("hidden");
        qs("#btn-logout")?.classList.remove("hidden");
    }

    // Render de componentes y asegurar visibilidad
    perfilCont?.classList.remove("hidden");
    actualizarPerfil(usuarioActivo, () => {
        const formCont = qs("#form-container");
        formCont.classList.remove("hidden");
        mostrarFormularioPerfil(usuarioActivo, ejecutarGuardado);
    });
    
    if (!usuarioActivo.suscrito) {
        planesCont?.classList.remove("hidden");
        mostrarPlanes(usuarioActivo, ejecutarSeleccion);
        renderFactura(usuarioActivo, ejecutarPago);
    } else {
        planesCont?.classList.add("hidden");
        qs(".factura-animada")?.remove();
    }
}

/* ===== EVENTOS ===== */

// Botón Comenzar
const btnComenzar = qs("#btn-comenzar");
if (btnComenzar) {
    on(btnComenzar, "click", () => {
        actualizarInterfaz();
    });
}

// Botón Login
on(qs("#btn-login"), "click", () => {
    window.location.href = "login.html";
});

// Botón Logout
on(qs("#btn-logout"), "click", () => {
    limpiarUsuario();
    window.location.href = "index.html";
});

/* ===== INIT CON LOADER ===== */
const iniciarApp = () => {
    mostrarLoader();
    setTimeout(() => {
        ocultarLoader();
        if (usuarioActivo.planContratado || usuarioActivo.email) {
            actualizarInterfaz();
        }
    }, 800);
};

iniciarApp();