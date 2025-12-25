// DECLARACIÓN DE VARIABLES Y CONSTANTES
const IVA = 0.21;
const DESCUENTO_USUARIO_NUEVO = 0.15;

// Array de objetos: Catálogo disponible
const catalogoPeliculas = [
    { id: 1, titulo: "Demon Slayer -Kimetsu no Yaiba- The Movie: Infinity Castle", precio: 1500, categoria: "shonen" },
    { id: 2, titulo: "Demon Slayer The Movie: Mugen Train", precio: 1200, categoria: "shonen" },
    { id: 3, titulo: "Your Name", precio: 1100, categoria: "romance fantasia" },
    { id: 4, titulo: "El viaje de Chihiro", precio: 1000, categoria: "fantasia" }
];

let listaSeleccionada = [];

// FUNCIONES DE LÓGICA

// Función: Saludo e inicio
const saludar = () => {
    alert("¡Bienvenido a KaijuStream! Tu portal definitivo de anime.");
};

// Función: Mostrar catálogo y capturar entrada
function seleccionarPeliculas() {
    let continuar = true;

    while (continuar) {
        let menu = "Selecciona el ID de la película que deseas agregar a tu lista de alquiler:\n\n";
        
        catalogoPeliculas.forEach(peli => {
            menu += `${peli.id}. ${peli.titulo} - $${peli.precio}\n`;
        });

        let entrada = prompt(menu);

        // Corrección: Si el usuario presiona "Cancelar", salimos del bucle
        if (entrada === null) {
            break;
        }

        let seleccion = parseInt(entrada);

        // Validación de selección
        const encontrado = catalogoPeliculas.find(p => p.id === seleccion);

        if (encontrado) {
            listaSeleccionada.push(encontrado);
            alert(`"${encontrado.titulo}" ha sido agregada a tu lista.`);
        } else {
            alert("⚠️ ID no válido o vacío. Por favor, intenta de nuevo.");
        }

        continuar = confirm("¿Deseas agregar otra película?");
    }
}

// Función: Procesamiento de costos
function calcularTotal() {
    let subtotal = 0;
    
    // Ciclo para sumar precios
    for (const peli of listaSeleccionada) {
        subtotal += peli.precio;
    }

    const aplicarDescuento = confirm("¿Es tu primera vez en KaijuStream? (Para aplicar cupón del 15%)");
    let totalConDescuento = subtotal;

    if (aplicarDescuento) {
        totalConDescuento = subtotal - (subtotal * DESCUENTO_USUARIO_NUEVO);
    }

    const totalFinal = totalConDescuento * (1 + IVA);

    return {
        subtotal: subtotal,
        total: totalFinal.toFixed(2)
    };
}

// Función: Mostrar resultados finales
function mostrarResumen(resumen) {
    console.clear();
    console.log("%c--- TICKET DE KAIJUSTREAM ---", "color: #FF4655; font-weight: bold; font-size: 16px;");
    
    console.log("Películas seleccionadas:");
    listaSeleccionada.forEach((p, index) => {
        console.log(`${index + 1}. ${p.titulo} ($${p.precio})`);
    });

    console.log("------------------------------");
    console.log(`Subtotal: $${resumen.subtotal}`);
    console.log(`Total Final (con IVA e impuestos): $${resumen.total}`);
    console.log("------------------------------");
    console.log("%c¡Gracias por elegir KaijuStream!", "color: #00D1FF; font-weight: bold;");
    
    alert(`¡Proceso completado!\nTotal a pagar: $${resumen.total}`);
}

// EVENTO PRINCIPAL
const btnComenzar = document.getElementById('btn-comenzar');

if (btnComenzar) {
    btnComenzar.addEventListener('click', () => {
        listaSeleccionada = []; 
        saludar();
        seleccionarPeliculas();

        if (listaSeleccionada.length > 0) {
            const resultados = calcularTotal();
            mostrarResumen(resultados);
        } else {
            alert("No seleccionaste ninguna película. ¡Vuelve pronto!");
        }
    });
} else {
    console.error("No se encontró el botón con ID 'btn-comenzar'.");
}