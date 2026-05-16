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

// Bloquear retroceso del navegador (botón atrás, doble clic, gestos)
(function() {
  // Llenar historial para que no haya a dónde regresar
  for (var i = 0; i < 3; i++) {
    history.pushState(null, '', location.href);
  }
  window.addEventListener('popstate', function() {
    history.pushState(null, '', location.href);
  });

  // Bloquear botón de retroceso del ratón (botón 3)
  window.addEventListener('mouseup', function(e) {
    if (e.button === 3) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Bloquear Alt+Izquierda y Backspace para atrás
  window.addEventListener('keydown', function(e) {
    if ((e.altKey && e.key === 'ArrowLeft') || (e.key === 'Backspace' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) {
      e.preventDefault();
    }
  });
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
