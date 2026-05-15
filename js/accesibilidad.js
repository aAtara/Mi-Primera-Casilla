var accEstado = {
  voz: false,
  lecturaFacil: false,
  altoContraste: false
};

function narrar(texto) {
  window.speechSynthesis.cancel();
  var utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'es-MX';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function pausarNarracion() {
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
  } else if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

function detenerNarracion() {
  window.speechSynthesis.cancel();
}

function toggleVoz() {
  accEstado.voz = !accEstado.voz;
  var controles = document.querySelector('.voz-controles');
  if (accEstado.voz) {
    if (controles) controles.classList.add('voz-controles--visible');
    var contenido = document.querySelector('.contenido-principal');
    if (contenido) narrar(contenido.textContent);
  } else {
    detenerNarracion();
    if (controles) controles.classList.remove('voz-controles--visible');
  }
  actualizarBotonesAcc();
}

function toggleLecturaFacil() {
  accEstado.lecturaFacil = !accEstado.lecturaFacil;
  document.body.classList.toggle('lectura-facil', accEstado.lecturaFacil);

  var normales = document.querySelectorAll('[data-texto-normal]');
  normales.forEach(function(el) {
    if (accEstado.lecturaFacil) {
      el.textContent = el.getAttribute('data-texto-facil') || el.textContent;
    } else {
      el.textContent = el.getAttribute('data-texto-normal');
    }
  });
  actualizarBotonesAcc();
}

function toggleAltoContraste() {
  accEstado.altoContraste = !accEstado.altoContraste;
  document.body.classList.toggle('alto-contraste', accEstado.altoContraste);
  actualizarBotonesAcc();
}

function actualizarBotonesAcc() {
  var opciones = document.querySelectorAll('.acc-panel__opcion');
  opciones.forEach(function(btn) {
    var tipo = btn.getAttribute('data-acc');
    if (tipo === 'voz') btn.classList.toggle('acc-panel__opcion--activo', accEstado.voz);
    if (tipo === 'lectura_facil') btn.classList.toggle('acc-panel__opcion--activo', accEstado.lecturaFacil);
    if (tipo === 'alto_contraste') btn.classList.toggle('acc-panel__opcion--activo', accEstado.altoContraste);
  });
}

function initAccesibilidad() {
  var boton = document.querySelector('.acc-boton');
  var panel = document.querySelector('.acc-panel');
  if (!boton || !panel) return;

  boton.addEventListener('click', function() {
    panel.classList.toggle('acc-panel--abierto');
  });

  document.addEventListener('click', function(e) {
    if (!panel.contains(e.target) && e.target !== boton) {
      panel.classList.remove('acc-panel--abierto');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      panel.classList.remove('acc-panel--abierto');
    }
  });

  var btnVoz = panel.querySelector('[data-acc="voz"]');
  var btnLectura = panel.querySelector('[data-acc="lectura_facil"]');
  var btnContraste = panel.querySelector('[data-acc="alto_contraste"]');

  if (btnVoz) btnVoz.addEventListener('click', toggleVoz);
  if (btnLectura) btnLectura.addEventListener('click', toggleLecturaFacil);
  if (btnContraste) btnContraste.addEventListener('click', toggleAltoContraste);

  var vozPausar = document.querySelector('.voz-btn-pausar');
  var vozDetener = document.querySelector('.voz-btn-detener');
  var vozRepetir = document.querySelector('.voz-btn-repetir');

  if (vozPausar) vozPausar.addEventListener('click', pausarNarracion);
  if (vozDetener) vozDetener.addEventListener('click', function() {
    detenerNarracion();
    accEstado.voz = false;
    document.querySelector('.voz-controles').classList.remove('voz-controles--visible');
    actualizarBotonesAcc();
  });
  if (vozRepetir) vozRepetir.addEventListener('click', function() {
    var contenido = document.querySelector('.contenido-principal');
    if (contenido) narrar(contenido.textContent);
  });
}

document.addEventListener('DOMContentLoaded', initAccesibilidad);
