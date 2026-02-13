// 1. Referencias al DOM (Nodos)
const formLogin = document.getElementById('loginForm');
const btnComenzar = document.getElementById('btn-comenzar');

// 2. Modelo de datos (Usuario)
let usuarioActivo = {
    email: "",
    plan: "Básico",
    suscrito: false
};

// 3. Función para manejar el Login (Sin window.method)
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que recargue la página
        
        // Capturamos datos de los inputs directamente
        const emailInput = document.getElementById('email').value;
        usuarioActivo.email = emailInput;
        usuarioActivo.suscrito = true;

        console.log("Usuario guardado:", usuarioActivo);
        alert(`Bienvenido, ${usuarioActivo.email}`);
        // Aquí podrías redirigir o mostrar la sección de gestión de perfil
    });
}

// 4. Gestión de suscripción (Más allá de un simple click)
function gestionarPerfil() {
    // Aquí deberías mostrar un div oculto con los datos del usuario
    // y permitirle cambiar el plan con un <select>
}