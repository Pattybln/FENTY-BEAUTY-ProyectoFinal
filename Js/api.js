// URL base de la API pública (marca fenty)
const API_BASE = "https://makeup-api.herokuapp.com/api/v1/products.json?brand=fenty";

/**
 * obtenerProductos(q)
 * devuelve un arreglo de productos (puedes filtrar con q: término de búsqueda)
 */
async function obtenerProductos(q = "") {
  try {
    const url = q ? `${API_BASE}&product_type=${encodeURIComponent(q)}` : API_BASE;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener productos");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function obtenerProductoPorId(id) {
    const todosLosProductos = await obtenerProductos();

    const imagenesLocales = [
        "Images/labial.png",    
        "Images/delineador.png", 
        "Images/gloss.png"      
    ];
    const productoIndex = todosLosProductos.findIndex(p => p.id == id);
    const productoEncontrado = todosLosProductos[productoIndex];
    if (productoEncontrado && productoIndex >= 0 && productoIndex < 3) {
        productoEncontrado.image_link = imagenesLocales[productoIndex];
    }
    return productoEncontrado;
}
