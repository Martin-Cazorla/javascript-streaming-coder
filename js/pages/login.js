/**LÓGICA DE LA PÁGINA DE LOGIN */
import { crearUsuario, guardarUsuario } from "../services/userService.js";
import { qs, on } from "../utils/dom.js";

// Selección de Nodos 
const loginForm = qs("#loginForm");
const btnBack = qs("#btn-back-home");

// Lógica de Login
if (loginForm) {
    on(loginForm, "submit", (e) => {
        e.preventDefault();

        // Accedemos a los inputs por ID 
        const emailInput = qs("#email");
        const passwordInput = qs("#password");

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Validación con SweetAlert2 
        if (!emailValue || !passwordValue) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor, completa tu email y contraseña para ingresar.',
                icon: 'warning',
                confirmButtonColor: '#9d4edd'
            });
            return;
        }

        // Creación del perfil 
        const nombreUsuario = emailValue.split('@')[0]; 
        const usuario = crearUsuario(emailValue, nombreUsuario);
        
        // Persistencia 
        guardarUsuario(usuario);

        // Feedback y Redirección asíncrona
        Swal.fire({
            title: '¡Bienvenido KAIJU!',
            text: `Hola ${nombreUsuario}, preparando tu catálogo...`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            willClose: () => {
                window.location.href = "catalog.html";
            }
        });
    });
}

// Manejo del botón "Volver" 
if (btnBack) {
    on(btnBack, "click", () => {
        window.location.href = "index.html";
    });
}