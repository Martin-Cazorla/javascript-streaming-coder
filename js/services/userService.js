/* SERVICIO DE USUARIO */
const STORAGE_KEY = "usuarioLogueado";

/** * CREAR USUARIO */
export function crearUsuario(email = "", nombre = "Invitado") {
    const usuario = {
        nombre,
        email,
        planContratado: null,
        suscrito: false,
        suscripciones: [] 
    };

    guardarUsuario(usuario);
    return usuario;
}

/** * GUARDAR EN STORAGE  */
export function guardarUsuario(usuario) {
    if (!usuario) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

/** * CARGAR DESDE STORAGE  */
export function cargarUsuario() {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) return null;

    try {
        return JSON.parse(datos);
    } catch (error) {
        console.error("Error al parsear el usuario:", error);
        return null;
    }
}

/** * LOGOUT / LIMPIAR */
export function limpiarUsuario() {
    localStorage.removeItem(STORAGE_KEY);
}

/** * ACTUALIZAR PERFIL */
export function actualizarPerfil(datosNuevos) {
    const usuario = cargarUsuario();
    if (!usuario) return null;

    const actualizado = {
        ...usuario,
        ...datosNuevos
    };

    guardarUsuario(actualizado);
    return actualizado;
}

/** * GESTIONAR PLAN (Asignar o Cambiar) */
export function asignarPlan(idPlan, catalogo) {
    const usuario = cargarUsuario();
    if (!usuario) return null;

    const planEncontrado = catalogo.find(p => p.id === Number(idPlan));
    if (!planEncontrado) return null;

    const actualizado = {
        ...usuario,
        planContratado: planEncontrado,
        suscrito: false 
    };

    guardarUsuario(actualizado);
    return actualizado;
}

/** * CANCELAR PLAN CONTRATADO*/
export function cancelarPlanActivo() {
    const usuario = cargarUsuario();
    if (!usuario) return null;

    const actualizado = {
        ...usuario,
        planContratado: null,
        suscrito: false
    };

    guardarUsuario(actualizado);
    return actualizado;
}

/** * CONFIRMAR PAGO*/
export function confirmarPagoPlan() {
    const usuario = cargarUsuario();
    if (!usuario || !usuario.planContratado) return null;

    const actualizado = {
        ...usuario,
        suscrito: true
    };

    guardarUsuario(actualizado);
    return actualizado;
}

/** * GESTIONAR ANIME (Favoritos/Suscripciones internas) 
 */
export function gestionarSuscripcionAnime(anime) {
    const usuario = cargarUsuario();
    if (!usuario) return { success: false, message: "Usuario no identificado" };

    const existe = usuario.suscripciones.some(item => item.id === anime.id);

    if (existe) {
        return { success: false, message: "Este anime ya está en tu lista" };
    }

    usuario.suscripciones.push(anime);
    guardarUsuario(usuario);

    return { success: true, message: "Agregado a tu catálogo personal" };
}

export function quitarAnimeDeLista(id) {
    const usuario = cargarUsuario();
    if (!usuario) return null;

    const actualizado = {
        ...usuario,
        suscripciones: usuario.suscripciones.filter(anime => anime.id !== id)
    };

    guardarUsuario(actualizado);
    return actualizado;
}