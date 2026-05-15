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
  construirMiniBoleta();
}

function construirMiniBoleta() {
  var p4 = window._contenidoP4;
  if (!p4) return;
  var partidos = p4.partidos_ficticios;
  var sel = boletaEstado.seleccion;

  // Distribuir partidos: pares (0,2,4) lado A, impares (1,3,5) lado B
  var ladoA = [], ladoB = [], idxA = [], idxB = [];
  partidos.forEach(function(p, i) {
    if (i % 2 === 0) { ladoA.push(p); idxA.push(i); }
    else { ladoB.push(p); idxB.push(i); }
  });

  var lados = [
    { id: 'mini-ballot-a', partidos: ladoA, indices: idxA, head: 'Presidencia' },
    { id: 'mini-ballot-b', partidos: ladoB, indices: idxB, head: 'Municipal' }
  ];

  lados.forEach(function(lado) {
    var el = document.getElementById(lado.id);
    if (!el) return;
    var html = '<div class="mini-ballot">';
    html += '<div class="mini-ballot__head"><div class="mini-ballot__inst">Inst. Electoral Sim.</div><div class="mini-ballot__title">' + lado.head + '</div></div>';
    html += '<div class="mini-ballot__rows">';
    lado.partidos.forEach(function(p, i) {
      var realIndex = lado.indices[i];
      var selectedCls = (sel === realIndex) ? ' mini-row--selected' : '';
      html += '<div class="mini-row' + selectedCls + '">' +
        '<div class="mini-row__logo" style="background:' + p.color + '">' + p.logo_letra + '</div>' +
        '<div class="mini-row__info"><div class="mini-row__name">' + p.siglas + '</div><div class="mini-row__cand">' + p.candidato.split(' ').slice(0, 2).join(' ') + '</div></div>' +
        '<div class="mini-row__box"></div>' +
      '</div>';
    });
    html += '</div>';
    html += '<div class="mini-ballot__foot">Mi Primera Casilla 2026</div>';
    html += '</div>';
    el.innerHTML = html;
  });
}

function initDoblado(pasos) {
  var btn = document.getElementById('btn-doblar');
  var btnText = document.getElementById('btn-doblar-text');
  var actionText = document.getElementById('fold-action-text');
  var actionHint = document.getElementById('fold-action-hint');
  var foldDone = document.getElementById('fold-done');
  var stage = document.getElementById('fold-stage');
  var paper1 = document.getElementById('fold-paper-1');
  var paper2 = document.getElementById('fold-paper-2');
  var paper3 = document.getElementById('fold-paper-3');
  var guide1 = document.getElementById('fold-guide-1');
  var guide2 = document.getElementById('fold-guide-2');
  var stepEls = document.querySelectorAll('.fold-step');
  var lineEls = document.querySelectorAll('.fold-step-line');
  if (!btn || !paper1) return;

  var pasoActual = 0;
  var facil = function() { return document.body.classList.contains('lectura-facil'); };
  var getTexto = function(i) {
    var p = pasos && pasos[i];
    if (!p) return '';
    return facil() ? (p.texto_facil || p.texto) : p.texto;
  };

  function setSteps(activeIdx, doneCount) {
    stepEls.forEach(function(el, i) {
      el.classList.remove('fold-step--active', 'fold-step--done');
      if (i < doneCount) el.classList.add('fold-step--done');
      else if (i === activeIdx) el.classList.add('fold-step--active');
    });
    lineEls.forEach(function(el, i) {
      el.classList.toggle('fold-step-line--filled', i < doneCount);
    });
  }

  // Mostrar guía inicial con delay
  setTimeout(function() {
    if (pasoActual === 0 && guide1) guide1.classList.add('fold-guide--visible');
  }, 500);
  setSteps(0, 0);

  btn.addEventListener('click', function() {
    if (btn.disabled) return;
    btn.disabled = true;

    if (pasoActual === 0) {
      // PRIMER DOBLEZ (vertical)
      if (guide1) guide1.classList.remove('fold-guide--visible');
      paper1.classList.add('fold-paper--folding');
      if (actionText) actionText.textContent = '✨ Doblando...';
      if (actionHint) actionHint.textContent = '';

      setTimeout(function() {
        paper1.classList.remove('fold-paper--active');
        paper2.classList.add('fold-paper--active');
        if (stage) stage.classList.add('fold-stage--small');
        setSteps(1, 1);
        pasoActual = 1;

        setTimeout(function() {
          if (actionText) actionText.textContent = '¡Excelente! Ahora dóblala otra vez';
          if (actionHint) actionHint.textContent = facil()
            ? 'Dóblala otra vez para tapar tu voto'
            : 'Dóblala una vez más para cubrir tu voto por completo';
          if (btnText) btnText.textContent = 'Doblar de nuevo';
          if (guide2) guide2.classList.add('fold-guide--visible');
          btn.disabled = false;
        }, 350);
      }, 950);

    } else if (pasoActual === 1) {
      // SEGUNDO DOBLEZ (horizontal)
      if (guide2) guide2.classList.remove('fold-guide--visible');
      paper2.classList.add('fold-paper--folding');
      if (actionText) actionText.textContent = '✨ Doblando...';
      if (actionHint) actionHint.textContent = '';

      setTimeout(function() {
        paper2.classList.remove('fold-paper--active');
        paper3.classList.add('fold-paper--active');
        if (stage) {
          stage.classList.remove('fold-stage--small');
          stage.classList.add('fold-stage--tiny');
        }
        setSteps(2, 2);
        pasoActual = 2;

        setTimeout(function() {
          setSteps(-1, 3);
          if (actionText) actionText.style.display = 'none';
          if (actionHint) actionHint.style.display = 'none';
          btn.style.display = 'none';
          if (foldDone) foldDone.classList.add('fold-done--visible');
          boletaEstado.doblada = true;
          var su = document.getElementById('seccion-urna');
          if (su) su.style.display = 'block';
        }, 700);
      }, 950);
    }
  });
}

function initUrna() {
  var btnDepositar = document.getElementById('btn-depositar');
  if (!btnDepositar) return;

  btnDepositar.addEventListener('click', function() {
    boletaEstado.depositada = true;
    var boletaCae = document.getElementById('boleta-cae');
    var sombra = document.getElementById('boleta-sombra');
    var urnaBody = document.getElementById('urna-body');
    var mensajeExito = document.getElementById('urna-exito');
    var confetti = document.getElementById('confetti');
    var btnSiguiente = document.getElementById('btn-siguiente-p5');

    btnDepositar.disabled = true;
    btnDepositar.style.opacity = '0.5';

    // La sombra se desvanece conforme el papel se aleja
    if (sombra) {
      sombra.style.transition = 'opacity 1.3s ease-out, transform 1.3s ease-out';
      sombra.style.opacity = '0';
      sombra.style.transform = 'translateX(-50%) scale(0.5)';
    }

    // Caída del papel con física natural
    if (boletaCae) {
      boletaCae.classList.add('boleta-cae--animando');
    }

    // Asentamiento de la urna cuando el papel toca el fondo (~1.8s)
    setTimeout(function() {
      if (urnaBody) {
        urnaBody.classList.remove('urna--asienta');
        void urnaBody.offsetWidth;
        urnaBody.classList.add('urna--asienta');
      }
    }, 1800);

    // Confirmación tras el asentamiento
    setTimeout(function() {
      if (boletaCae) boletaCae.style.display = 'none';
      if (mensajeExito) mensajeExito.style.display = 'block';
      if (confetti) {
        confetti.style.display = 'block';
        crearConfetti(confetti);
      }
      if (btnSiguiente) btnSiguiente.style.display = 'inline-flex';
    }, 2250);
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
