// Archivo: Js/producto_detalle.js

// Función auxiliar para escapar caracteres HTML (necesaria si la usas en otros archivos)
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/[&<>"']/g, function (m) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m]);
    });
}

async function cargarDetalleProducto() {
    // 1. Obtener el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // <-- ¡Aquí se lee el ID!

    const cont = document.getElementById('product-detail');
    cont.innerHTML = "<h2>Cargando detalles del producto...</h2>"; 

    if (!productId) {
        cont.innerHTML = '<h2>Error: ID de producto no encontrado.</h2><a href="productos.html">Volver al catálogo</a>';
        return;
    }

    // 2. Obtener los datos del producto (Asume que la función obtenerProductoPorId existe en api.js)
    const producto = await obtenerProductoPorId(productId); 

    if (producto) {
        // Usaremos la imagen del API o un placeholder
        const imagenUrl = producto.image_link || 'https://via.placeholder.com/400x400?text=Sin+Imagen'; 
        
        // 3. Insertar el HTML de detalle en la página producto.html
        cont.innerHTML = `
            <div class="detalle-grid container"> 
                <div class="detalle-imagen">
                    <img src="${imagenUrl}" alt="${escapeHtml(producto.name)}">
                </div>
                <div class="detalle-info">
                    <h1>${escapeHtml(producto.name)}</h1>
                    <p class="precio">Precio: ${producto.price ? producto.price + " " + (producto.price_sign || "USD") : "Precio no disponible"}</p>
                    <p class="descripcion">${escapeHtml(producto.description)}</p>
                    
                    <button class="btn agregar-carrito-detalle"
                            data-id="${producto.id}"
                            data-nombre="${escapeHtml(producto.name)}"
                            data-precio="${producto.price || 0}"
                            data-img="${imagenUrl}">
                        Agregar al carrito
                    </button>
                    
                    <a href="productos.html" class="btn volver-catalogo">Volver al catálogo</a>
                </div>
            </div>
        `;
    } else {
        cont.innerHTML = '<h2>Producto no encontrado o error de carga.</h2><a href="productos.html">Volver al catálogo</a>';
    }
}

// Iniciar la carga al cargar la página
cargarDetalleProducto();