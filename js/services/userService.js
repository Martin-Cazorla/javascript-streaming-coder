/** SERVICIO DE USUARIO - GESTIÓN DE DATOS Y PERSISTENCIA */

const STORAGE_KEY = "usuarioLogueado"; 

export function crearUsuario(email = "", nombre = "Invitado") {
  return {
    nombre,        
    email,
    planContratado: null,
    suscripciones: [] 
  };
}

export function guardarUsuario(usuario) {
  if (!usuario) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

export function cargarUsuario() {
  const datos = localStorage.getItem(STORAGE_KEY);
  try {
    return datos ? JSON.parse(datos) : null;
  } catch (error) {
    return null;
  }
}

export function limpiarUsuario() {
  localStorage.removeItem(STORAGE_KEY);
}

export function gestionarSuscripcion(anime) {
    const usuario = cargarUsuario();
    if (!usuario) return;

    if (!usuario.suscripciones) usuario.suscripciones = [];

    const yaExiste = usuario.suscripciones.some(fav => fav.id === anime.id);

    if (yaExiste) {
        Swal.fire({
            title: '¡Ya lo tienes!',
            text: `${anime.nombre} ya está en tu lista.`,
            icon: 'info'
        });
        return false; 
    } else {
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
}

export function actualizarPerfil(nuevosDatos) {
    const usuario = cargarUsuario();
    if (!usuario) return;

    const usuarioActualizado = { ...usuario, ...nuevosDatos };
    guardarUsuario(usuarioActualizado);

    Swal.fire({
        title: 'Perfil Actualizado',
        text: 'Tus cambios se han guardado correctamente.',
        icon: 'success',
        confirmButtonColor: '#9d4edd'
    });
}

/**
 * Elimina una suscripción del perfil (DELETE)
 */
export function cancelarSuscripcion(animeId) {
    const usuario = cargarUsuario();
    if (!usuario || !usuario.suscripciones) return;

    usuario.suscripciones = usuario.suscripciones.filter(anime => anime.id !== animeId);
    guardarUsuario(usuario);

    Swal.fire({
        title: 'Suscripción Cancelada',
        text: 'Se ha eliminado de tu lista personal.',
        icon: 'success',
        confirmButtonColor: '#9d4edd',
        timer: 1500,
        showConfirmButton: false
    });
}