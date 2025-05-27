const ctx = document.getElementById('contaminacionChart').getContext('2d');

// Definición de colores para el gráfico basados en los niveles de contaminación
const chartColors = {
    baja: 'rgba(40, 167, 69, 0.8)',      // Verde
    media: 'rgba(255, 193, 7, 0.8)',    // Amarillo
    alta: 'rgba(253, 126, 20, 0.8)',    // Naranja
    muyAlta: 'rgba(220, 53, 69, 0.8)'   // Rojo
};

const chartBorderColors = {
    baja: 'rgba(40, 167, 69, 1)',
    media: 'rgb(255, 230, 7)',
    muyAlta: 'rgba(220, 53, 69, 1)'
};

// Datos para cada zona (simulados con valores realistas y asignación de nivel y el nivel de recomendación clave)
const zonasDatos = {
    'zona-norte': {
        niveles: [30, 40, 45, 50, 48, 35],
        explicacion: "Zona Norte: Nivel medio de contaminación. Se recomienda reducir actividades al aire libre para personas sensibles.",
        recomendacionKey: 'Medio', // Indica qué fila resaltar en la tabla general
        colorClase: 'contaminacion-media' 
    },
    'zona-centro': {
        niveles: [70, 80, 85, 90, 88, 75],
        explicacion: "Zona Centro: Nivel muy alto de contaminación. Se recomienda evitar actividades al aire libre y usar mascarillas.",
        recomendacionKey: 'Muy Alto', // Indica qué fila resaltar
        colorClase: 'contaminacion-muy-alta' 
    },
    'zona-sur': {
        niveles: [35, 40, 42, 47, 45, 38],
        explicacion: "Zona Sur: Nivel medio de contaminación. Personas sensibles deben limitar exposición al aire libre.",
        recomendacionKey: 'Medio',
        colorClase: 'contaminacion-media'
    },
    'zona-valle': {
        niveles: [75, 85, 90, 92, 89, 80],
        explicacion: "Zona Valle: Nivel muy alto de contaminación. Precaución máxima y evitar salir si no es necesario.",
        recomendacionKey: 'Muy Alto',
        colorClase: 'contaminacion-muy-alta'
    },
    'zona-rucu': {
        niveles: [10, 12, 15, 14, 13, 11],
        explicacion: "Volcán Rucu Pichincha: Nivel bajo de contaminación. Ambiente limpio y seguro para actividades al aire libre.",
        recomendacionKey: 'Bajo',
        colorClase: 'contaminacion-baja'
    }
};

// Configuración inicial del gráfico con datos neutros
let currentChart;

function crearGrafico(niveles, zonaId) {
    if(currentChart) currentChart.destroy();

    const zona = zonasDatos[zonaId];
    let backgroundColor = [];
    let borderColor = [];

    // Asignar colores de barras según el nivel de contaminación de la zona
    let predominantColor = chartColors.baja; // Default
    let predominantBorderColor = chartBorderColors.baja; // Default

    // Determinar el color del gráfico según la clase de color de la zona
    if (zona.colorClase === 'contaminacion-baja') {
        predominantColor = chartColors.baja;
        predominantBorderColor = chartBorderColors.baja;
    } else if (zona.colorClase === 'contaminacion-media') {
        predominantColor = chartColors.media;
        predominantBorderColor = chartBorderColors.media;
    } else if (zona.colorClase === 'contaminacion-alta') {
        predominantColor = chartColors.alta;
        predominantBorderColor = chartBorderColors.alta;
    } else if (zona.colorClase === 'contaminacion-muy-alta') {
        predominantColor = chartColors.muyAlta;
        predominantBorderColor = chartBorderColors.muyAlta;
    }

    // Rellenar los arrays con el color predominante para todas las barras
    for(let i = 0; i < niveles.length; i++) {
        backgroundColor.push(predominantColor);
        borderColor.push(predominantBorderColor);
    }

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['00h', '04h', '08h', '12h', '16h', '20h'],
            datasets: [{
                label: 'Nivel de contaminación',
                data: niveles,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#134E4A' } // Mantenemos el color del texto teal de Bootstrap
                }
            }
        }
    });
}


// Todas las recomendaciones posibles en la tabla
const allRecommendations = [
    { nivel: 'Bajo', texto: 'Actividad al aire libre permitida sin restricciones.' },
    { nivel: 'Medio', texto: 'Personas sensibles deben evitar esfuerzos prolongados.' },
    { nivel: 'Muy Alto', texto: 'Permanezca en interiores, evite salir y use mascarilla N95.' }
];

function actualizarRecomendaciones(nivelRecomendacion) {
    const tbody = document.getElementById('tabla-recomendaciones');
    tbody.innerHTML = ''; // Limpiar tabla

    allRecommendations.forEach(rec => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${rec.nivel}</td><td>${rec.texto}</td>`;
        if (rec.nivel === nivelRecomendacion) {
            tr.classList.add('table-highlight'); // Añadir clase para resaltar
        }
        tbody.appendChild(tr);
    });
}

function actualizarZona(zonaId) {
    const zona = zonasDatos[zonaId];
    if (!zona) return;

    // Actualizar explicación
    const explicacion = document.getElementById('explicacion-nivel');
    explicacion.textContent = zona.explicacion;

    // Actualizar gráfico con el color de la zona
    crearGrafico(zona.niveles, zonaId);

    // Actualizar tabla de recomendaciones y resaltar la fila correcta
    actualizarRecomendaciones(zona.recomendacionKey);
}

// Al cargar, mostramos la zona norte por defecto
window.onload = () => {
    actualizarZona('zona-norte');
};

// Añadir evento a zonas clickeables
const zonasElements = document.querySelectorAll('.zona');
zonasElements.forEach(zonaEl => {
    zonaEl.addEventListener('click', () => {
        actualizarZona(zonaEl.id);
    });
});