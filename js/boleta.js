var boletaEstado = {
  seleccion: null,
  doblada: false,
  depositada: false
};

function initBoleta(partidos) {
  var contenedor = document.getElementById('boleta-partidos');
  if (!contenedor) return;

  partidos.forEach(function(partido, i) {
    var div = document.createElement('div');
    div.className = 'boleta__partido';
    div.setAttribute('tabindex', '0');
    div.setAttribute('role', 'radio');
    div.setAttribute('aria-checked', 'false');
    div.setAttribute('aria-label', partido.nombre + ' — ' + partido.candidato);
    div.setAttribute('data-index', i);

    div.innerHTML =
      '<strong class="boleta__nombre-partido">' + partido.nombre + '</strong>' +
      '<div class="boleta__logo" style="background:' + partido.color + '">' + partido.logo_letra + '</div>' +
      '<span class="boleta__candidato">' + partido.candidato + '</span>' +
      '<div class="boleta__marca-area"><div class="boleta__marca" aria-hidden="true"></div></div>';

    div.addEventListener('click', function() {
      seleccionarPartido(i, partidos);
    });
    div.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        seleccionarPartido(i, partidos);
      }
    });

    contenedor.appendChild(div);
  });
}

function seleccionarPartido(index, partidos) {
  if (boletaEstado.depositada) return;

  var items = document.querySelectorAll('.boleta__partido');
  var mensaje = document.getElementById('boleta-mensaje');

  if (boletaEstado.seleccion === index) {
    boletaEstado.seleccion = null;
    items[index].classList.remove('boleta__partido--seleccionado');
    items[index].setAttribute('aria-checked', 'false');
    if (mensaje) mensaje.style.display = 'none';
    actualizarBotonDoblar();
    return;
  }

  if (boletaEstado.seleccion !== null && boletaEstado.seleccion !== index) {
    if (mensaje) {
      mensaje.style.display = 'block';
      mensaje.textContent = document.body.classList.contains('lectura-facil')
        ? (window._contenidoP4 && window._contenidoP4.mensaje_doble_marca_facil) || 'Solo puedes elegir uno.'
        : (window._contenidoP4 && window._contenidoP4.mensaje_doble_marca) || 'Solo puedes marcar una opción.';
    }
    return;
  }

  boletaEstado.seleccion = index;
  items.forEach(function(item, i) {
    if (i === index) {
      item.classList.add('boleta__partido--seleccionado');
      item.setAttribute('aria-checked', 'true');
    } else {
      item.classList.remove('boleta__partido--seleccionado');
      item.setAttribute('aria-checked', 'false');
    }
  });

  if (mensaje) mensaje.style.display = 'none';
  actualizarBotonDoblar();
}

function actualizarBotonDoblar() {
  var seccionDoblar = document.getElementById('seccion-doblar');
  if (seccionDoblar) {
    seccionDoblar.style.display = boletaEstado.seleccion !== null ? 'block' : 'none';
  }
}

function initDoblado(pasos) {
  var contenedor = document.getElementById('doblado-animacion');
  var btnDoblar = document.getElementById('btn-doblar');
  var boleta = document.getElementById('boleta-visual');
  if (!btnDoblar || !boleta) return;

  var pasoActual = 0;
  var textoEl = document.getElementById('doblado-texto');

  btnDoblar.addEventListener('click', function() {
    pasoActual++;
    if (pasoActual === 1) {
      boleta.classList.add('boleta-doblado--medio');
      if (textoEl && pasos[1]) {
        textoEl.textContent = document.body.classList.contains('lectura-facil')
          ? pasos[1].texto_facil : pasos[1].texto;
      }
      btnDoblar.textContent = 'Doblar otra vez →';
    } else if (pasoActual === 2) {
      boleta.classList.remove('boleta-doblado--medio');
      boleta.classList.add('boleta-doblado--completo');
      if (textoEl && pasos[2]) {
        textoEl.textContent = document.body.classList.contains('lectura-facil')
          ? pasos[2].texto_facil : pasos[2].texto;
      }
      btnDoblar.textContent = 'Doblar una vez más →';
    } else if (pasoActual >= 3) {
      boleta.classList.add('boleta-doblado--final');
      if (textoEl && pasos[3]) {
        textoEl.textContent = document.body.classList.contains('lectura-facil')
          ? pasos[3].texto_facil : pasos[3].texto;
      }
      btnDoblar.style.display = 'none';
      boletaEstado.doblada = true;
      document.getElementById('seccion-urna').style.display = 'block';
    }
  });
}

function initUrna() {
  var btnDepositar = document.getElementById('btn-depositar');
  if (!btnDepositar) return;

  btnDepositar.addEventListener('click', function() {
    boletaEstado.depositada = true;
    var boletaCae = document.getElementById('boleta-cae');
    var urnaBody = document.getElementById('urna-body');
    var mensajeExito = document.getElementById('urna-exito');
    var confetti = document.getElementById('confetti');
    var btnSiguiente = document.getElementById('btn-siguiente-p5');

    if (boletaCae) {
      boletaCae.classList.add('boleta-cae--animando');
    }

    setTimeout(function() {
      if (boletaCae) boletaCae.style.display = 'none';
      if (urnaBody) urnaBody.classList.add('urna--recibida');
      if (mensajeExito) mensajeExito.style.display = 'block';
      if (confetti) {
        confetti.style.display = 'block';
        crearConfetti(confetti);
      }
      if (btnSiguiente) btnSiguiente.style.display = 'inline-flex';
    }, 800);

    btnDepositar.disabled = true;
    btnDepositar.style.opacity = '0.5';
  });
}

function crearConfetti(contenedor) {
  var colores = ['#8B0000', '#f0a500', '#1a3a5c', '#2e7d32', '#e65100'];
  for (var i = 0; i < 50; i++) {
    var pieza = document.createElement('div');
    pieza.className = 'confetti__pieza';
    pieza.style.left = Math.random() * 100 + '%';
    pieza.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
    pieza.style.animationDelay = Math.random() * 0.6 + 's';
    pieza.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
    contenedor.appendChild(pieza);
  }
}
