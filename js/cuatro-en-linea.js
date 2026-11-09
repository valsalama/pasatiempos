/* cuatro-en-linea.js · Cuatro en línea contra la máquina
   Tablero de 7 columnas por 6 filas. Vos jugás con las fichas de color y arrancás primero.
   La máquina usa minimax con poda; el nivel cambia hasta qué profundidad mira. */
(function (global) {
  'use strict';

  const ID = 'cuatro-en-linea';
  const COLS = 7;
  const FILAS = 6;
  const NIVELES = {
    facil: { nombre: 'Fácil', prof: 1, azar: 0.35 },
    medio: { nombre: 'Medio', prof: 4, azar: 0.08 },
    dificil: { nombre: 'Difícil', prof: 6, azar: 0 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];
  const ORDEN_COLS = [3, 2, 4, 1, 5, 0, 6];

  /* ---------- Lógica pura ---------- */
  const nuevoTablero = () => new Array(COLS * FILAS).fill(0);
  const idx = (c, f) => f * COLS + c;

  function filaLibre(t, c) {
    for (let f = FILAS - 1; f >= 0; f--) if (t[idx(c, f)] === 0) return f;
    return -1;
  }
  function columnasLibres(t) {
    return ORDEN_COLS.filter((c) => t[idx(c, 0)] === 0);
  }
  const DIRS = [[1, 0], [0, 1], [1, 1], [1, -1]];
  /* Devuelve las 4 casillas ganadoras si el jugador tiene cuatro en línea que pasan por (c, f), o null */
  function lineaGanadora(t, c, f) {
    const j = t[idx(c, f)];
    if (!j) return null;
    for (const [dc, df] of DIRS) {
      const celdas = [[c, f]];
      for (const s of [1, -1]) {
        let x = c + dc * s; let y = f + df * s;
        while (x >= 0 && x < COLS && y >= 0 && y < FILAS && t[idx(x, y)] === j) {
          celdas.push([x, y]); x += dc * s; y += df * s;
        }
      }
      if (celdas.length >= 4) return celdas;
    }
    return null;
  }
  function lleno(t) { return t.every((v) => v !== 0); }

  function puntuar(t, j) {
    // Ventanas de cuatro: suma por cantidad de fichas propias sin fichas rivales
    let p = 0;
    const otro = 3 - j;
    for (let f = 0; f < FILAS; f++) {
      for (let c = 0; c < COLS; c++) {
        for (const [dc, df] of DIRS) {
          const c2 = c + dc * 3; const f2 = f + df * 3;
          if (c2 < 0 || c2 >= COLS || f2 < 0 || f2 >= FILAS) continue;
          let mias = 0; let suyas = 0;
          for (let k = 0; k < 4; k++) {
            const v = t[idx(c + dc * k, f + df * k)];
            if (v === j) mias++; else if (v === otro) suyas++;
          }
          if (mias && suyas) continue;
          if (mias === 3) p += 6; else if (mias === 2) p += 2;
          if (suyas === 3) p -= 7; else if (suyas === 2) p -= 2;
        }
      }
    }
    for (let f = 0; f < FILAS; f++) if (t[idx(3, f)] === j) p += 3;
    return p;
  }

  /* Valor de la posición desde el punto de vista de quien mueve (j) en las hojas */
  function evaluarHoja(t, j) { return puntuar(t, j); }
  function buscar(t, prof, alfa, beta, j) {
    const libres = columnasLibres(t);
    if (!libres.length) return 0;
    if (prof === 0) return evaluarHoja(t, j);
    let mejor = -Infinity;
    for (const c of libres) {
      const f = filaLibre(t, c);
      t[idx(c, f)] = j;
      let v;
      if (lineaGanadora(t, c, f)) v = 1000 + prof;
      else v = -buscar(t, prof - 1, -beta, -alfa, 3 - j);
      t[idx(c, f)] = 0;
      if (v > mejor) mejor = v;
      if (mejor > alfa) alfa = mejor;
      if (alfa >= beta) break;
    }
    return mejor;
  }

  /* Elige la columna de la máquina (j) */
  function elegir(t, j, nivel, azar) {
    const cfg = NIVELES[nivel];
    const libres = columnasLibres(t);
    if (!libres.length) return -1;
    // 1) ganar ya, 2) tapar una victoria rival (siempre, salvo un descuido en fácil)
    for (const c of libres) {
      const f = filaLibre(t, c);
      t[idx(c, f)] = j;
      const gana = !!lineaGanadora(t, c, f);
      t[idx(c, f)] = 0;
      if (gana) return c;
    }
    const descuido = nivel === 'facil' && azar() < cfg.azar;
    if (!descuido) {
      for (const c of libres) {
        const f = filaLibre(t, c);
        t[idx(c, f)] = 3 - j;
        const gana = !!lineaGanadora(t, c, f);
        t[idx(c, f)] = 0;
        if (gana) return c;
      }
    }
    if (nivel === 'facil' && azar() < cfg.azar) return libres[Math.floor(azar() * libres.length)];
    let mejorC = libres[0]; let mejorV = -Infinity;
    for (const c of libres) {
      const f = filaLibre(t, c);
      t[idx(c, f)] = j;
      const v = -buscar(t, cfg.prof - 1, -Infinity, Infinity, 3 - j);
      t[idx(c, f)] = 0;
      const ruido = cfg.azar && nivel !== 'facil' ? azar() * 2 : 0;
      if (v + ruido > mejorV) { mejorV = v + ruido; mejorC = c; }
    }
    return mejorC;
  }

  /* ---------- Interfaz ---------- */
  function crear(contenedor) {
    const { el, notificar } = global.Pasatiempos;
    let historial = [];
    let tablero = nuevoTablero();
    let turno = 1; // 1 = persona, 2 = máquina
    let jugadas = 0;
    let ganadora = null;
    let pensando = false;

    const cols = [];
    const grilla = el('div', { clase: 'c4__tablero', attrs: { role: 'group', 'aria-label': 'Tablero de cuatro en línea' } });
    for (let c = 0; c < COLS; c++) {
      const b = el('button', { clase: 'c4__col', attrs: { type: 'button', 'aria-label': 'Columna ' + (c + 1) } });
      const celdas = [];
      for (let f = 0; f < FILAS; f++) {
        const s = el('span', { clase: 'c4__celda' });
        celdas.push(s);
        b.append(s);
      }
      b.addEventListener('click', () => tocar(c));
      cols.push({ b, celdas });
      grilla.append(b);
    }
    const estado = el('p', { clase: 'c4__estado', attrs: { role: 'status', 'aria-live': 'polite' } });

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'c4',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'cantidad',
      conTiempo: false,
      etiquetaNivel: 'Dificultad',
      datos: [{ id: 'jug', etq: 'Tus fichas' }],
      formato: (v) => v + (v === 1 ? ' jugada' : ' jugadas'),
      acciones: [{ id: 'deshacer', texto: 'Deshacer', alClick: () => deshacer() }],
      cuerpo: [el('div', { clase: 'c4__marco' }, grilla), estado],
      hayAvance: () => jugadas > 0,
      nueva() {
        tablero = nuevoTablero(); turno = 1; jugadas = 0; ganadora = null; pensando = false; historial = [];
        base.dato('jug', 0);
        dibujar();
      },
      cargar(nivel, ex) {
        tablero = ex.t.slice(); turno = ex.turno; jugadas = ex.jugadas; historial = Array.isArray(ex.hist) ? ex.hist.filter((c) => Number.isInteger(c) && c >= 0 && c < COLS) : []; ganadora = null; pensando = false;
        base.dato('jug', jugadas);
        dibujar();
        if (turno === 2) pedirMaquina();
      },
      serializar() { return { t: tablero.slice(), turno, jugadas, hist: historial.slice() }; },
      validar(ex) {
        return Array.isArray(ex.t) && ex.t.length === COLS * FILAS && ex.t.every((v) => v === 0 || v === 1 || v === 2) &&
          (ex.turno === 1 || ex.turno === 2) && Number.isInteger(ex.jugadas) && ex.jugadas >= 0;
      }
    });

    const azar = Math.random;

    function dibujar() {
      for (let c = 0; c < COLS; c++) {
        let libre = false;
        for (let f = 0; f < FILAS; f++) {
          const v = tablero[idx(c, f)];
          const s = cols[c].celdas[f];
          s.className = 'c4__celda' + (v ? ' c4__celda--' + v : '');
          if (!v) libre = true;
        }
        cols[c].b.disabled = !libre || turno !== 1 || !!ganadora || pensando || base.fase() === 'ganado';
        cols[c].b.setAttribute('aria-label', 'Columna ' + (c + 1) + (libre ? '' : ', llena'));
      }
      if (ganadora) ganadora.forEach(([c, f]) => cols[c].celdas[f].classList.add('c4__celda--gana'));
      if (base.accion('deshacer')) base.accion('deshacer').disabled = !historial.length || pensando || base.fase() === 'ganado';
      if (base.fase() !== 'ganado') estado.textContent = turno === 1 ? 'Tu turno: elegí una columna.' : 'Piensa la máquina...';
    }

    function poner(c, j) {
      const f = filaLibre(tablero, c);
      if (f < 0) return null;
      tablero[idx(c, f)] = j;
      return f;
    }

    function tocar(c) {
      if (turno !== 1 || pensando || ganadora || base.fase() === 'ganado') return;
      if (filaLibre(tablero, c) < 0) { notificar('Esa columna está llena.'); return; }
      base.empezar();
      const f = poner(c, 1);
      jugadas++; base.sumarMov(); base.dato('jug', jugadas);
      historial.push(c);
      const l = lineaGanadora(tablero, c, f);
      if (l) { ganadora = l; dibujar(); estado.textContent = 'Ganaste.'; base.ganar({ titulo: 'Cuatro en línea', mensaje: 'Ganaste en ' + jugadas + (jugadas === 1 ? ' jugada.' : ' jugadas.'), valor: jugadas }); return; }
      if (lleno(tablero)) { dibujar(); estado.textContent = 'Empate.'; base.terminar({ titulo: 'Empate', mensaje: 'El tablero se llenó sin cuatro en línea.' }); return; }
      turno = 2;
      dibujar();
      pedirMaquina();
    }

    function pedirMaquina() {
      pensando = true;
      dibujar();
      base.despues(() => {
        const c = elegir(tablero, 2, base.nivel(), azar);
        const f = poner(c, 2);
        historial.push(c);
        pensando = false;
        turno = 1;
        const l = lineaGanadora(tablero, c, f);
        if (l) { ganadora = l; dibujar(); estado.textContent = 'Ganó la máquina.'; base.terminar({ titulo: 'Ganó la máquina', mensaje: 'Esta vez no salió. Probá otra partida.' }); return; }
        if (lleno(tablero)) { dibujar(); estado.textContent = 'Empate.'; base.terminar({ titulo: 'Empate', mensaje: 'El tablero se llenó sin cuatro en línea.' }); return; }
        dibujar();
      }, 450);
    }

    function deshacer() {
      if (pensando || ganadora || base.fase() === 'ganado' || historial.length < 2 || turno !== 1) return;
      for (let k = 0; k < 2; k++) {
        const c = historial.pop();
        for (let f = 0; f < FILAS; f++) if (tablero[idx(c, f)]) { tablero[idx(c, f)] = 0; break; }
      }
      jugadas = Math.max(0, jugadas - 1);
      base.ponerMov(jugadas); base.dato('jug', jugadas);
      dibujar();
    }

    base.arrancar();
    return {
      pruebas: { tocar, tablero: () => tablero.slice(), turno: () => turno, deshacer },
      destruir() { base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.CuatroEnLinea = { pruebas: () => (instancia ? instancia.pruebas : null), nuevoTablero, filaLibre, lineaGanadora, elegir, lleno, COLS, FILAS };
})(window);
