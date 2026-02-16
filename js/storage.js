const STORAGE_KEY = "usuarioKaiju";

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
