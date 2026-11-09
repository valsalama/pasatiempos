/* simon.js · Simon dice
   La máquina ilumina una secuencia de colores y la repetís en el mismo orden.
   Cada ronda suma un color más. El puntaje es la cantidad de rondas completas. */
(function (global) {
  'use strict';

  const ID = 'simon';
  const NIVELES = {
    lento: { nombre: 'Lento', luz: 750, pausa: 300 },
    normal: { nombre: 'Normal', luz: 520, pausa: 220 },
    rapido: { nombre: 'Rápido', luz: 340, pausa: 150 }
  };
  const ORDEN = ['lento', 'normal', 'rapido'];
  const PADS = ['Verde', 'Rojo', 'Amarillo', 'Azul'];
  const TECLAS = { 1: 0, 2: 1, 3: 2, 4: 3 };

  function crear(contenedor) {
    const { el } = global.Pasatiempos;
    let secuencia = [];
    let pos = 0;
    let turnoPersona = false;
    let ocupado = false;

    const pads = PADS.map((n, i) => {
      const b = el('button', { clase: 'sm__pad sm__pad--' + (i + 1), attrs: { type: 'button', 'aria-label': n + ', tecla ' + (i + 1) } });
      b.addEventListener('click', () => tocar(i));
      return b;
    });
    const tablero = el('div', { clase: 'sm__tablero', attrs: { role: 'group', 'aria-label': 'Colores' } }, ...pads);
    const btnEmpezar = el('button', { clase: 'btn btn--primario sm__empezar', texto: 'Empezar', attrs: { type: 'button' } });
    const estado = el('p', { clase: 'sm__estado', attrs: { role: 'status', 'aria-live': 'polite' } });

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'sm',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'puntaje',
      conTiempo: false,
      etiquetaNivel: 'Velocidad',
      textoNuevo: 'Reiniciar',
      datos: [{ id: 'rondas', etq: 'Rondas' }],
      formato: (v) => v + (v === 1 ? ' ronda' : ' rondas'),
      cuerpo: [tablero, el('div', { clase: 'sm__pie' }, btnEmpezar, estado)],
      hayAvance: () => false,
      nueva() {
        secuencia = []; pos = 0; turnoPersona = false; ocupado = false;
        base.dato('rondas', 0);
        btnEmpezar.hidden = false;
        estado.textContent = '';
        marcar(null);
        habilitar(false);
      },
      cargar() {},
      serializar() { return null; },
      validar() { return false; }
    });

    function habilitar(si) { pads.forEach((p) => { p.disabled = !si; }); }
    function marcar(i) { pads.forEach((p, k) => p.classList.toggle('sm__pad--on', k === i)); }

    function agregarColor() {
      secuencia.push(Math.floor(Math.random() * 4));
    }

    function mostrar() {
      const cfg = NIVELES[base.nivel()];
      ocupado = true; turnoPersona = false; pos = 0;
      habilitar(false);
      estado.textContent = 'Mirá la secuencia...';
      let t = 500;
      secuencia.forEach((c) => {
        base.despues(() => marcar(c), t);
        base.despues(() => marcar(null), t + cfg.luz);
        t += cfg.luz + cfg.pausa;
      });
      base.despues(() => {
        ocupado = false; turnoPersona = true;
        habilitar(true);
        estado.textContent = 'Ahora vos: repetí los ' + secuencia.length + (secuencia.length === 1 ? ' color.' : ' colores.');
      }, t);
    }

    function empezar() {
      if (ocupado || turnoPersona || base.fase() === 'ganado') return;
      base.empezar();
      btnEmpezar.hidden = true;
      agregarColor();
      mostrar();
    }

    function tocar(i) {
      if (!turnoPersona || base.fase() === 'ganado') return;
      marcar(i);
      base.despues(() => marcar(null), 180);
      if (i !== secuencia[pos]) { fallar(); return; }
      pos++;
      if (pos === secuencia.length) {
        turnoPersona = false;
        habilitar(false);
        base.dato('rondas', secuencia.length);
        estado.textContent = 'Bien. Ronda ' + secuencia.length + ' completa.';
        base.despues(() => { agregarColor(); mostrar(); }, 900);
      }
    }

    function fallar() {
      turnoPersona = false;
      habilitar(false);
      const rondas = secuencia.length - 1;
      estado.textContent = 'Te equivocaste.';
      if (rondas > 0) {
        base.ganar({ titulo: 'Se cortó la secuencia', mensaje: 'Completaste ' + rondas + (rondas === 1 ? ' ronda.' : ' rondas.'), valor: rondas });
      } else {
        base.terminar({ titulo: 'Se cortó la secuencia', mensaje: 'No llegaste a completar ninguna ronda. Probá de nuevo.' });
      }
    }

    btnEmpezar.addEventListener('click', empezar);
    const teclas = (ev) => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (TECLAS[ev.key] !== undefined && turnoPersona) { ev.preventDefault(); tocar(TECLAS[ev.key]); }
    };
    document.addEventListener('keydown', teclas);

    base.arrancar();
    return {
      pruebas: { tocar, empezar, secuencia: () => secuencia.slice(), puedeJugar: () => turnoPersona },
      destruir() { document.removeEventListener('keydown', teclas); base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.Simon = { pruebas: () => (instancia ? instancia.pruebas : null) };
})(window);
