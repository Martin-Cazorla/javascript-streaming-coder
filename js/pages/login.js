import { crearUsuario, guardarUsuario } from "../services/userService.js";
import { qs, on } from "../utils/dom.js";

on(qs("#loginForm"), "submit", e => {
  e.preventDefault();

  const email = qs('#loginForm input[type="email"]').value;

  const usuario = crearUsuario(email);
  guardarUsuario(usuario);

  window.location.href = "index.html";
});