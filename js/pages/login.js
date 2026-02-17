import { crearUsuario, guardarUsuario } from "../services/userService.js";
import { qs, on } from "../utils/dom.js";

on(qs("#loginForm"), "submit", e => {
    e.preventDefault();

    const emailInput = qs('#loginForm input[type="email"]');
    
    if (emailInput && emailInput.value.trim() !== "") {
        const usuario = crearUsuario(emailInput.value.trim());
        guardarUsuario(usuario);
        window.location.href = "index.html";
    } else {
        console.warn("Email vacío");
    }
});