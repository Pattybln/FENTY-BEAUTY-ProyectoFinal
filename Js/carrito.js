document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("carrito-lista");
  const totalTxt = document.getElementById("carrito-total");
  const btnVaciar = document.getElementById("vaciar-carrito");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function mostrarCarrito() {
    lista.innerHTML = "";

    if (carrito.length === 0) {
      lista.innerHTML = `<p>Tu carrito esta vacío.</p>`;
      totalTxt.textContent = "";
      return;
    }

    carrito.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${item.img}" alt="${item.nombre}" style="width: 120px;">
        <h3>${item.nombre}</h3>
        <p>Precio: $${item.precio}</p>
        <p>Cantidad: ${item.cantidad}</p>
      `;

      lista.appendChild(card);
    });

    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    totalTxt.textContent = "Total: $" + total;
  }

  btnVaciar.addEventListener("click", () => {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  });

  mostrarCarrito();
});
