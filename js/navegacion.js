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

// Bloquear botón de retroceso del navegador
history.pushState(null, '', location.href);
window.addEventListener('popstate', function() {
  history.pushState(null, '', location.href);
});

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
