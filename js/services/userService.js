/** SERVICIO DE USUARIO */

const STORAGE_KEY = "usuarioKaiju";

/* ===== MODELO ===== */

/**
 * @param {string} email 
 * @param {string} nombre 
 * @returns {Object}
 */
export function crearUsuario(email = "", nombre = "Invitado") {
  return {
    nombre,        
    email,
    planContratado: null,
    suscrito: false
  };
}

/* ===== STORAGE ===== */

/**
 * @param {Object} usuario 
 */
export function guardarUsuario(usuario) {
  if (!usuario) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

/**
 * @returns {Object|null}
 */
export function cargarUsuario() {
  const datos = localStorage.getItem(STORAGE_KEY);
  try {
    return datos ? JSON.parse(datos) : null;
  } catch (error) {
    console.error("Error al parsear los datos del usuario:", error);
    return null;
  }
}

export function limpiarUsuario() {
  localStorage.removeItem(STORAGE_KEY);
}