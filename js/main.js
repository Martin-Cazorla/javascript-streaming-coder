/* CONFIGURACIÓN Y DATOS */
const IVA = 0.21;
const DESCUENTO_NUEVO = 0.15;

const catalogoPeliculas = [
    { id: 1, titulo: "Demon Slayer: Infinity Castle", precio: 1500 },
    { id: 2, titulo: "Demon Slayer: Mugen Train", precio: 1200 },
    { id: 3, titulo: "Your Name", precio: 1100 },
    { id: 4, titulo: "El viaje de Chihiro", precio: 1000 }
];

let listaSeleccionada = [];

/* PROCESAMIENTO: Selección de productos */
function seleccionarPeliculas() {
    alert("¡Bienvenido a KaijuStream! Vamos a armar tu lista de alquiler."); 
    
    let continuar = true;

    while (continuar) {
        let menu = "Escribe el ID de la película:\n\n";
        catalogoPeliculas.forEach(p => menu += `${p.id}. ${p.titulo} ($${p.precio})\n`);

        let entrada = prompt(menu);
        if (entrada === null) break; 

        let idSeleccionado = parseInt(entrada);
        const peliEncontrada = catalogoPeliculas.find(p => p.id === idSeleccionado);

        if (peliEncontrada) {
            listaSeleccionada.push(peliEncontrada);
            alert(`✅ "${peliEncontrada.titulo}" agregada.`);
        } else {
            alert("⚠️ ID no válido.");
        }

        continuar = confirm("¿Quieres agregar otra película?");
    }
}

/**
 * PROCESAMIENTO: Cálculos matemáticos
 * @returns {Object} 
 */
function calcularCostos() {
    const subtotal = listaSeleccionada.reduce((acc, peli) => acc + peli.precio, 0);
    
    const esNuevo = confirm("¿Es tu primera vez? (15% de descuento)");
    const montoDescuento = esNuevo ? subtotal * DESCUENTO_NUEVO : 0;
    
    const subtotalConDescuento = subtotal - montoDescuento;
    const totalFinal = subtotalConDescuento * (1 + IVA);

    return {
        subtotal,
        descuento: montoDescuento,
        total: totalFinal.toFixed(2)
    };
}

/* SALIDA: Reporte en consola y alerta */
function mostrarResumen(resumen) {
    console.clear();
    console.log("%c--- RESUMEN DE COMPRA ---", "color: #FF4655; font-weight: bold;");
    
    listaSeleccionada.forEach((p, i) => console.log(`${i+1}. ${p.titulo}`));
    
    console.table(resumen); 
    
    alert(`Proceso finalizado.\nTotal a pagar (con IVA): $${resumen.total}`);
}

// CONTROLADOR DE EVENTOS
const btnComenzar = document.getElementById('btn-comenzar');
btnComenzar?.addEventListener('click', () => {
    listaSeleccionada = []; 
    seleccionarPeliculas();

    if (listaSeleccionada.length > 0) {
        const resultados = calcularCostos();
        mostrarResumen(resultados);
    }
});