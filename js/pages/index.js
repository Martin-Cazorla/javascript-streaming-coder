/** LÓGICA DE LA PÁGINA DE INDEX */
import { cargarUsuario, guardarUsuario, crearUsuario, limpiarUsuario, asignarPlan, confirmarPagoPlan } from "../services/userService.js";
import { catalogoPlanes } from "../services/planService.js";
import { actualizarPerfil, mostrarPlanes, renderFactura, mostrarFormularioPerfil } from "../components/ui.js";
import { mostrarLoader, ocultarLoader, qs, on } from "../utils/dom.js";

// Inicialización robusta
let usuarioActivo = cargarUsuario();
if (!usuarioActivo) {
    usuarioActivo = crearUsuario();
    guardarUsuario(usuarioActivo); 
}

/* ===== FLUJO DE NEGOCIO ===== */

function ejecutarSeleccion(id) {
    const resultado = asignarPlan(id, catalogoPlanes);
    if (resultado) {
        usuarioActivo = resultado;
        
        if (!usuarioActivo.nombre || usuarioActivo.nombre === "Invitado") {
            mostrarFormularioPerfil(usuarioActivo, ejecutarGuardado);
        }
        
        actualizarInterfaz();
    }
}

function ejecutarGuardado(nuevosDatos) {
    usuarioActivo.email = nuevosDatos.email;
    usuarioActivo.nombre = nuevosDatos.nombre;
    guardarUsuario(usuarioActivo);
    
    const formCont = qs("#form-container");
    if (formCont) formCont.classList.add("hidden");
    
    Swal.fire({
        title: '¡Datos Guardados!',
        text: 'Ahora puedes proceder al pago de tu suscripción.',
        icon: 'success',
        confirmButtonColor: '#9d4edd',
        background: '#1a1a1a',
        color: '#fff'
    });
    
    actualizarInterfaz();
}

async function ejecutarPago() {
    if (!usuarioActivo.planContratado) {
        return Swal.fire('Atención', 'Por favor, selecciona un plan primero.', 'warning');
    }

    if (!usuarioActivo.nombre || usuarioActivo.nombre === "Invitado") {
        return Swal.fire({
            title: 'Perfil Incompleto',
            text: 'Debes completar tus datos de perfil antes de realizar el pago.',
            icon: 'info',
            confirmButtonText: 'Completar Perfil'
        }).then(() => {
            mostrarFormularioPerfil(usuarioActivo, ejecutarGuardado);
        });
    }

    const { value: pagoConfirmado } = await Swal.fire({
        title: 'Pago Seguro con Tarjeta',
        background: '#1a1a1a',
        color: '#fff',
        html: `
            <div class="card-form-sim">
                <input id="card-num" class="swal2-input" placeholder="0000 0000 0000 0000" maxlength="16">
                <div style="display:flex; gap:10px;">
                    <input id="card-exp" class="swal2-input" placeholder="MM/YY" maxlength="5">
                    <input id="card-cvv" class="swal2-input" placeholder="CVV" maxlength="3">
                </div>
            </div>
        `,
        confirmButtonText: 'Confirmar Suscripción',
        showCancelButton: true,
        preConfirm: () => {
            const num = document.getElementById('card-num').value;
            if (num.length < 16) return Swal.showValidationMessage('Número de tarjeta incompleto');
            return true;
        }
    });

    if (pagoConfirmado) {
        usuarioActivo = confirmarPagoPlan();
        
        Swal.fire({
            title: '¡Pago Exitoso! 🐉',
            text: 'Bienvenido a la comunidad KaijuStream. Redirigiendo...',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "pages/catalog.html"; 
        });
    }
}

/* ===== CONTROL DE INTERFAZ ===== */

function actualizarInterfaz() {
    usuarioActivo = cargarUsuario() || usuarioActivo;

    const hero = qs(".hero");
    const planesCont = qs("#planes-container");
    const perfilCont = qs("#perfil-container");

    hero?.classList.add("hidden");

    if (usuarioActivo.email) {
        qs("#btn-login")?.classList.add("hidden");
        qs("#btn-logout")?.classList.remove("hidden");
    }

    if (perfilCont) {
        perfilCont.classList.remove("hidden");
        actualizarPerfil(usuarioActivo, () => {
            qs("#form-container")?.classList.remove("hidden");
            mostrarFormularioPerfil(usuarioActivo, ejecutarGuardado);
        });
    }

    if (usuarioActivo.suscrito && usuarioActivo.planContratado) {
        planesCont?.classList.add("hidden");
        qs(".factura-animada")?.remove();
        window.location.href = "pages/catalog.html";
    } else {
        planesCont?.classList.remove("hidden");
        mostrarPlanes(usuarioActivo, ejecutarSeleccion);
        renderFactura(usuarioActivo, ejecutarPago);
    }
}

/* ===== EVENTOS ===== */
on(qs("#btn-comenzar"), "click", actualizarInterfaz);

on(qs("#btn-login"), "click", () => window.location.href = "pages/login.html");

on(qs("#btn-logout"), "click", () => {
    limpiarUsuario();
    window.location.href = "index.html"; 
});

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