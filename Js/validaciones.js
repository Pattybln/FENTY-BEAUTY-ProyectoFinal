document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  const respuesta = document.getElementById("respuesta");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    // validaciones simples
    if (nombre.length < 2) {
      mostrarRespuesta("Por favor, escribe tu nombre completo.", true);
      return;
    }
    if (!validarEmail(correo)) {
      mostrarRespuesta("Correo no válido.", true);
      return;
    }
    if (mensaje.length < 10) {
      mostrarRespuesta("Mensaje muy corto (mínimo 10 caracteres).", true);
      return;
    }

    // simulación de envío
    mostrarRespuesta("Enviando...", false);
    setTimeout(() => {
      mostrarRespuesta("¡Mensaje enviado correctamente! Gracias por contactarnos.", false);
      form.reset();
    }, 900);
  });

  function mostrarRespuesta(msg, esError) {
    respuesta.textContent = msg;
    respuesta.style.color = esError ? "crimson" : "green";
  }

  function validarEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
