function generarTarjetaCivica(nombre, correctas, total, contenedor) {
  contenedor.innerHTML =
    '<div class="tarjeta-civica">' +
      '<div class="tarjeta-civica__badge">✓</div>' +
      '<div class="tarjeta-civica__etiqueta">Mi Primera Casilla 2026</div>' +
      '<h2 class="tarjeta-civica__nombre">' + nombre + '</h2>' +
      '<div class="tarjeta-civica__rol">Votante Informado</div>' +
      '<div class="tarjeta-civica__stats">' +
        '<div class="tarjeta-civica__stat">' +
          '<span class="tarjeta-civica__stat-num">' + correctas + '/' + total + '</span>' +
          '<span class="tarjeta-civica__stat-label">Preguntas correctas</span>' +
        '</div>' +
      '</div>' +
      '<div class="tarjeta-civica__footer">Simulación completada — Hackathón Ciberdemocracia 2026</div>' +
    '</div>';
}

function compartirWhatsApp(texto) {
  window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank');
}

function compartirX(texto) {
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(texto), '_blank');
}
