function obtenerNombre() {
  return sessionStorage.getItem('nombre') || 'Ciudadano';
}

function obtenerSeccion() {
  return sessionStorage.getItem('seccion') || '';
}

function guardarDatos(nombre, seccion) {
  if (nombre) sessionStorage.setItem('nombre', nombre);
  if (seccion) sessionStorage.setItem('seccion', seccion);
}

function irAPantalla(archivo) {
  window.location.replace(archivo);
}

// Bloquear retroceso del navegador
(function() {
  // Llenar historial con muchas entradas
  for (var i = 0; i < 50; i++) {
    history.pushState({ bloqueado: true }, '', location.href);
  }

  // Cada vez que intenten retroceder, volver a empujar
  window.addEventListener('popstate', function(e) {
    history.pushState({ bloqueado: true }, '', location.href);
  });

  // Bloquear botones laterales del ratón (3 = atrás, 4 = adelante)
  window.addEventListener('mouseup', function(e) {
    if (e.button === 3 || e.button === 4) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Bloquear Alt+Izquierda, Backspace, y cualquier gesto de retroceso
  window.addEventListener('keydown', function(e) {
    if ((e.altKey && e.key === 'ArrowLeft') || (e.key === 'Backspace' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') || (e.key === 'BrowserBack')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
})();

function renderBarraProgreso(pasoActual, contenedor) {
  fetch('./data/contenido.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var pasos = data.barra_progreso.pasos;
      var html = '<nav class="barra-progreso" aria-label="Progreso de la simulación">';
      pasos.forEach(function(paso) {
        var clase = '';
        if (paso.numero < pasoActual) clase = 'barra-progreso__paso--completado';
        else if (paso.numero === pasoActual) clase = 'barra-progreso__paso--activo';
        html += '<div class="barra-progreso__paso ' + clase + '">';
        html += '<div class="barra-progreso__circulo" aria-hidden="true">' + paso.numero + '</div>';
        html += '<span class="barra-progreso__etiqueta">' + paso.etiqueta + '</span>';
        if (paso.numero < pasos.length) {
          html += '<div class="barra-progreso__linea" aria-hidden="true"></div>';
        }
        html += '</div>';
      });
      html += '</nav>';
      contenedor.innerHTML = html;
    });
}

function cargarContenido() {
  return fetch('./data/contenido.json').then(function(r) { return r.json(); });
}
