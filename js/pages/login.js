/**
 * Lógica de la página de login
 */
import { crearUsuario, guardarUsuario } from "../services/userService.js";
import { qs, on } from "../utils/dom.js";

// Usamos el evento cuando el DOM esté listo para evitar que qs devuelva null
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = qs("#loginForm");

    if (loginForm) {
        on(loginForm, "submit", e => {
            e.preventDefault();

            const emailInput = qs('#loginForm input[type="email"]');
            const passwordInput = qs('#loginForm input[type="password"]');

            // Validación básica
            if (!emailInput.value.trim() || !passwordInput.value.trim()) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Atención', 'Por favor completa todos los campos', 'warning');
                } else {
                    alert('Por favor completa todos los campos');
                }
                return;
            }

            // Crear el objeto usuario 
            const nombreUsuario = emailInput.value.split('@')[0]; 
            const usuario = crearUsuario(emailInput.value.trim(), nombreUsuario);
            
            // Guardar usuario (clave 'usuarioLogueado')
            guardarUsuario(usuario);

            window.location.href = "index.html";
        });
    } else {
        console.error("No se encontró el formulario #loginForm. Revisa el ID en tu HTML.");
    }
});