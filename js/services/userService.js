const STORAGE_KEY = "usuarioKaiju";

/* ===== MODELO ===== */

export function crearUsuario(email = "") {
  return {
    email,
    planContratado: null,
    suscrito: false
  };
}

/* ===== STORAGE ===== */

export function guardarUsuario(usuario) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

export function cargarUsuario() {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : null;
}

export function limpiarUsuario() {
  localStorage.removeItem(STORAGE_KEY);
}
