// Funciones utilitarias del DOM y navegación
document.addEventListener("DOMContentLoaded", () => {
  // año del footer
  const years = document.querySelectorAll("#year,#year2,#year3,#year4,#year5");
  years.forEach(el => { if(el) el.textContent = new Date().getFullYear(); });

  // menú hamburguesa
  const hamb = document.getElementById("hamburger");
  const nav = document.getElementById("mainNav");
  if (hamb) {
    hamb.addEventListener("click", () => {
      if (nav.style.display === "block") nav.style.display = "";
      else nav.style.display = "block";
    });
  }

  // Si estamos en index -> cargar productos destacados
  if (document.getElementById("destacados")) {
    cargarDestacados();
  }

  // Si estamos en la página productos -> cargar listado y filtros
  if (document.getElementById("productos")) {
    inicializarProductos();
  }

  // Si estamos en producto.html -> leer id y mostrar detalle
  if (document.getElementById("detalle")) {
    mostrarDetalleProducto();
  }

  // desplegar menú en pantallas anchas
  window.addEventListener("resize", ()=> {
    if (window.innerWidth > 600 && nav) nav.style.display = "flex";
  });
});

/* ---------- Index: productos destacados ---------- */
async function cargarDestacados(){
  const cont = document.getElementById("destacados");
  cont.innerHTML = "";
  const productos = await obtenerProductos();
  const top = productos.slice(0,3);
    const imagenesLocales = [
        "Images/labial.png",     
        "Images/delineador.png", 
        "Images/gloss.png"      
    ];
  if (top.length === 0) {
    cont.innerHTML = "<div class='card'>No hay productos</div>";
}

top.forEach((p, index) => {
    const imagenUrl = imagenesLocales[index] || 'https://via.placeholder.com/300x300?text=sin+imagen';
    cont.innerHTML += `
        <div class="card">
            <img src="${imagenUrl}" alt="${p.name}">
            <h3>${escapeHtml(p.name)}</h3>
            <p>${p.price ? p.price + " " + (p.price_sign || "USD") : "Precio no disponible"}</p>
            
            <div class="botones-acciones"> 
                <button class="btn agregar-carrito"
                        data-id="${p.id}"
                        data-nombre="${escapeHtml(p.name)}"
                        data-precio="${p.price || 0}"
                        data-img="${imagenesLocales[index]}">
                        Agregar al carrito
                </button>
                <a class="btn view-product" href="producto.html?id=${p.id}">Ver producto</a>
            </div>
        </div>
    `;
});
}

/* ---------- Productos: busqueda, filtros y listado ---------- */
async function inicializarProductos(){
  const cont = document.getElementById("productos");
  const buscar = document.getElementById("buscar");
  const filtroCategoria = document.getElementById("filtroCategoria");

  let productos = await obtenerProductos();

  // rellenar lista inicial
  renderizarLista(productos);

  // poblar select de categorías (product_type)
  const tipos = Array.from(new Set(productos.map(p => p.product_type).filter(Boolean)));
  filtroCategoria.innerHTML = `<option value="">Todas las categorías</option>` + tipos.map(t=>`<option value="${t}">${t}</option>`).join("");

  // evento buscar (filtrado por nombre)
  buscar.addEventListener("input", (e)=>{
    const q = e.target.value.trim().toLowerCase();
    const filtrados = productos.filter(p => p.name && p.name.toLowerCase().includes(q));
    renderizarLista(filtrados);
  });

  // evento filtro categoria
  filtroCategoria.addEventListener("change", (e)=>{
    const cat = e.target.value;
    const filtrados = cat ? productos.filter(p => p.product_type === cat) : productos;
    renderizarLista(filtrados);
  });
}

function renderizarLista(lista){
  const cont = document.getElementById("productos");
  cont.innerHTML = "";
  if (!lista || lista.length === 0) {
    cont.innerHTML = "<div class='card'>No se encontraron productos.</div>";
    return;
  }
  lista.forEach(p => {
    cont.innerHTML += `
      <div class="card">
        <img src="${p.image_link || 'https://via.placeholder.com/300x300?text=sin+imagen'}" alt="${escapeHtml(p.name)}">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${p.price ? p.price + " " + (p.price_sign || "USD") : "Precio no disponible"}</p>
        <p class="muted">${p.product_type || ""}</p>

        <button class="btn agregar-carrito"
          data-id="${p.id}"
          data-nombre="${escapeHtml(p.name)}"
          data-precio="${p.price || 0}"
          data-img="${p.image_link}">
          Agregar al carrito
        </button>

        <a class="btn" href="producto.html?id=${p.id}">Ver detalle</a>
      </div>
    `;
  });
}

/* ---------- Detalle del producto ---------- */
async function mostrarDetalleProducto(){
  const cont = document.getElementById("detalle");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  cont.innerHTML = "<p>Cargando...</p>";
  const producto = await obtenerProductoPorId(id);
  if (!producto) {
    cont.innerHTML = "<p>No se encontró el producto.</p>";
    return;
  }
  cont.innerHTML = `
    <div>
      <img src="${producto.image_link || 'https://via.placeholder.com/600x600?text=sin+imagen'}" alt="${escapeHtml(producto.name)}">
    </div>
    <div class="meta">
      <h2>${escapeHtml(producto.name)}</h2>
      <p><strong>Precio:</strong> ${producto.price ? producto.price + " " + (producto.price_sign || "USD") : "No disponible"}</p>
      <p><strong>Categoría:</strong> ${producto.product_type || "—"}</p>
      <p>${producto.description ? escapeHtml(producto.description) : "Sin descripción."}</p>

      <button class="btn agregar-carrito"
        data-id="${producto.id}"
        data-nombre="${escapeHtml(producto.name)}"
        data-precio="${producto.price || 0}"
        data-img="${producto.image_link}">
        Agregar al carrito
      </button>

      <p><a class="btn volver" href="productos.html">Volver al catálogo</a></p>
    </div>
  `;
}

/* ---------- util ---------- */
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function(m) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[m]);
  });
}

/*============   SISTEMA DE CARRITO DE COMPRAS   ============*/

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("agregar-carrito")) {

    const id = e.target.dataset.id;
    const nombre = e.target.dataset.nombre;
    const precio = parseFloat(e.target.dataset.precio);
    const img = e.target.dataset.img;

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existe = carrito.find(p => p.id === id);

    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({
        id,
        nombre,
        precio,
        img,
        cantidad: 1
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto añadido al carrito");
  }
});

