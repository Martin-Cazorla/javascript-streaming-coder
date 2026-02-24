/** LÓGICA DE LA PÁGINA DE LOGIN */
import { crearUsuario, guardarUsuario } from "../services/userService.js";
import { qs, on } from "../utils/dom.js";

// Selección de Nodos
const loginForm = qs("#login-form"); 
const btnBack = qs("#btn-back-home");

/**
 * Valida el formato de un correo electrónico
 * @param {string} email 
 * @returns {boolean}
 */
const esEmailValido = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Lógica de Login
if (loginForm) {
    on(loginForm, "submit", (e) => {
        e.preventDefault();

        const emailInput = qs("#email");
        const passwordInput = qs("#password");

        if (!emailInput || !passwordInput) return;

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Validación de campos vacíos
        if (!emailValue || !passwordValue) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor, completa tus credenciales.',
                icon: 'warning',
                confirmButtonColor: '#9d4edd',
                background: '#1a1a1a',
                color: '#fff'
            });
            return;
        }

        // Validación de formato de email 
        if (!esEmailValido(emailValue)) {
            Swal.fire({
                title: 'Email inválido',
                text: 'Por favor, ingresa un formato de correo válido.',
                icon: 'error',
                confirmButtonColor: '#9d4edd',
                background: '#1a1a1a',
                color: '#fff'
            });
            return;
        }

        // Creación del perfil y persistencia
        const nombreUsuario = emailValue.split('@')[0]; 
        const usuario = crearUsuario(emailValue, nombreUsuario);
        
        guardarUsuario(usuario);

        // Feedback y Redirección 
        Swal.fire({
            title: '¡Bienvenido KAIJU!',
            text: `Hola ${nombreUsuario}, preparando tu catálogo...`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#fff',
            willClose: () => {
                location.assign("catalog.html");
            }
        });
    });
}

// Manejo del botón "Volver" 
if (btnBack) {
    on(btnBack, "click", () => {
        location.assign("../index.html");
    });
}