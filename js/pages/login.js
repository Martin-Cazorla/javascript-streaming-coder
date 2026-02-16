import { crearUsuario, guardarUsuario } from "../services/userService.js";
import { qs, on } from "../utils/dom.js";

// Esperamos a que el DOM esté listo por seguridad
on(qs("#loginForm"), "submit", e => {
    e.preventDefault();

    const emailInput = qs('#loginForm input[type="email"]');
    const passwordInput = qs('#loginForm input[type="password"]');

    // Validación básica
    if (emailInput && emailInput.value.trim() !== "") {

        const usuario = crearUsuario(emailInput.value.trim());
        
        guardarUsuario(usuario);

        window.location.href = "index.html";
    } else {
        alert("Por favor, ingresa un correo electrónico válido.");
    }
});