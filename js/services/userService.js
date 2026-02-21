/*SERVICIO DE USUARIO - GESTIÓN DE DATOS Y PERSISTENCIA*/

const STORAGE_KEY = "usuarioLogueado";

// Estructura inicial del objeto usuario 
export function crearUsuario(email = "", nombre = "Invitado") {
    return {
        nombre,
        email,
        planContratado: null,
        suscrito: false, 
        suscripciones: []
    };
}

// Persistencia en LocalStorage 
export function guardarUsuario(usuario) {
    if (!usuario) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

// Carga de datos con manejo de errores 
export function cargarUsuario() {
    const datos = localStorage.getItem(STORAGE_KEY);
    try {
        return datos ? JSON.parse(datos) : null;
    } catch (error) {
        console.error("Error al parsear usuario de LocalStorage:", error);
        return null;
    }
}

// Limpieza de sesión para el Logout
export function limpiarUsuario() {
    localStorage.removeItem(STORAGE_KEY);
}

/* GESTIÓN DE ANIMES */
export function gestionarSuscripcion(anime) {
    const usuario = cargarUsuario();
    if (!usuario) return false;

    // Asegura que el array exista antes de operar
    usuario.suscripciones = usuario.suscripciones || [];

    const yaExiste = usuario.suscripciones.some(fav => fav.id === anime.id);

    if (yaExiste) {
        Swal.fire({
            title: '¡Ya lo tienes!',
            text: `${anime.nombre} ya está en tu lista de KaijuStream.`,
            icon: 'info',
            confirmButtonColor: '#9d4edd'
        });
        return false;
    } 
    
    // Agrega el nuevo objeto al array 
    usuario.suscripciones.push(anime);
    guardarUsuario(usuario);

    Swal.fire({
        title: '¡Añadido!',
        text: `${anime.nombre} se sumó a tus suscripciones.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
    return true;
}

/* CRUD: ACTUALIZAR PERFIL */
export function actualizarPerfil(nuevosDatos) {
    const usuario = cargarUsuario();
    if (!usuario) return null;

    // Fusiona los datos antiguos con los nuevos
    const usuarioActualizado = { ...usuario, ...nuevosDatos };
    guardarUsuario(usuarioActualizado);

    Swal.fire({
        title: 'Perfil Actualizado',
        text: 'Tus cambios se han guardado correctamente.',
        icon: 'success',
        confirmButtonColor: '#9d4edd'
    });
    
    return usuarioActualizado; 
}

/* CRUD: ELIMINAR SUSCRIPCIÓN */
export function cancelarSuscripcion(animeId) {
    const usuario = cargarUsuario();
    if (!usuario || !usuario.suscripciones) return;

    usuario.suscripciones = usuario.suscripciones.filter(anime => anime.id !== animeId);
    guardarUsuario(usuario);

    Swal.fire({
        title: 'Eliminado',
        text: 'El anime se ha quitado de tu lista.',
        icon: 'success',
        confirmButtonColor: '#9d4edd',
        timer: 1500,
        showConfirmButton: false
    });
}

/* ASIGNACIÓN DE PLANES */
export function asignarPlan(idPlan, catalogo) {
    const usuario = cargarUsuario();
    if (!usuario) return null;

    const plan = catalogo.find(p => p.id === Number(idPlan));
    
    if (!plan) return null;

    usuario.planContratado = plan;
    usuario.suscrito = false; 
    
    guardarUsuario(usuario);
    return usuario; 
}

/* CONFIRMACIÓN DE PAGO */
export function confirmarPagoPlan() {
    const usuario = cargarUsuario();
    
    // No permitir pago si no hay un plan seleccionado
    if (!usuario || !usuario.planContratado) {
        console.error("No hay un plan seleccionado para confirmar.");
        return null;
    }

    usuario.suscrito = true; 
    guardarUsuario(usuario); 
    
    return usuario; 
}