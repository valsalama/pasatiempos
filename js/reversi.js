/* reversi.js · Reversi (Othello) contra la máquina
   Tablero de 8x8. Vos jugás con las fichas oscuras y empezás. Una jugada válida encierra
   fichas rivales en línea recta entre la ficha que ponés y otra tuya; esas fichas se dan vuelta.
   Gana quien termina con más fichas. */
(function (global) {
  'use strict';

  const ID = 'reversi';
  const N = 8;
  const NIVELES = {
    facil: { nombre: 'Fácil', modo: 'voraz', azar: 0.4 },
    medio: { nombre: 'Medio', modo: 'pos', azar: 0 },
    dificil: { nombre: 'Difícil', modo: 'busca', prof: 4, azar: 0 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];
  const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  const PESO = [
    [100, -20, 10, 5, 5, 10, -20, 100],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [10, -2, 1, 1, 1, 1, -2, 10],
    [5, -2, 1, 0, 0, 1, -2, 5],
    [5, -2, 1, 0, 0, 1, -2, 5],
    [10, -2, 1, 1, 1, 1, -2, 10],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [100, -20, 10, 5, 5, 10, -20, 100]
  ];

  /* ---------- Lógica pura (tablero: arreglo de 64, 0 vacío, 1 persona, 2 máquina) ---------- */
  function inicial() {
    const t = new Array(N * N).fill(0);
    t[3 * N + 3] = 2; t[4 * N + 4] = 2; t[3 * N + 4] = 1; t[4 * N + 3] = 1;
    return t;
  }
  /* Fichas que se darían vuelta si j juega en (f, c). Vacío si la jugada no es válida. */
  function volteos(t, f, c, j) {
    if (t[f * N + c] !== 0) return [];
    const otro = 3 - j; const res = [];
    for (const [df, dc] of DIRS) {
      const tmp = [];
      let y = f + df; let x = c + dc;
      while (y >= 0 && y < N && x >= 0 && x < N && t[y * N + x] === otro) { tmp.push(y * N + x); y += df; x += dc; }
      if (tmp.length && y >= 0 && y < N && x >= 0 && x < N && t[y * N + x] === j) res.push(...tmp);
    }
    return res;
  }
  function jugadasValidas(t, j) {
    const r = [];
    for (let f = 0; f < N; f++) for (let c = 0; c < N; c++) {
      const v = volteos(t, f, c, j);
      if (v.length) r.push({ f, c, v });
    }
    return r;
  }
  function aplicar(t, m, j) {
    const n = t.slice();
    n[m.f * N + m.c] = j;
    m.v.forEach((i) => { n[i] = j; });
    return n;
  }
  function contar(t) {
    let a = 0; let b = 0;
    for (const v of t) { if (v === 1) a++; else if (v === 2) b++; }
    return { a, b };
  }
  function posicional(t, j) {
    let s = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] === j) s += PESO[(i / N) | 0][i % N];
      else if (t[i]) s -= PESO[(i / N) | 0][i % N];
    }
    return s;
  }
  function negamax(t, prof, alfa, beta, j) {
    const ms = jugadasValidas(t, j);
    if (!ms.length) {
      if (!jugadasValidas(t, 3 - j).length) { const k = contar(t); return (j === 2 ? k.b - k.a : k.a - k.b) * 100; }
      return -negamax(t, prof, -beta, -alfa, 3 - j);
    }
    if (prof === 0) return posicional(t, j) + 3 * (ms.length - jugadasValidas(t, 3 - j).length);
    let mejor = -Infinity;
    for (const m of ms) {
      const v = -negamax(aplicar(t, m, j), prof - 1, -beta, -alfa, 3 - j);
      if (v > mejor) mejor = v;
      if (mejor > alfa) alfa = mejor;
      if (alfa >= beta) break;
    }
    return mejor;
  }
  /* Elige la jugada de la máquina (siempre es el jugador 2) */
  function elegir(t, nivel, azar) {
    const ms = jugadasValidas(t, 2);
    if (!ms.length) return null;
    const cfg = NIVELES[nivel];
    if (cfg.azar && azar() < cfg.azar) return ms[Math.floor(azar() * ms.length)];
    let mejor = null; let mejorV = -Infinity;
    for (const m of ms) {
      let v;
      if (cfg.modo === 'voraz') v = m.v.length + azar() * 0.5;
      else if (cfg.modo === 'pos') v = PESO[m.f][m.c] + m.v.length * 0.3 + azar() * 0.2;
      else v = -negamax(aplicar(t, m, 2), cfg.prof - 1, -Infinity, Infinity, 1);
      if (v > mejorV) { mejorV = v; mejor = m; }
    }
    return mejor;
  }

  /* ---------- Interfaz ---------- */
  function crear(contenedor) {
    const { el, notificar } = global.Pasatiempos;
    let tablero = inicial();
    let turno = 1;
    let pensando = false;
    let ultima = -1;
    let previo = null;

    const celdas = [];
    const grilla = el('div', { clase: 'rv__tablero', attrs: { role: 'grid', 'aria-label': 'Tablero de Reversi' } });
    for (let f = 0; f < N; f++) {
      for (let c = 0; c < N; c++) {
        const b = el('button', { clase: 'rv__celda', attrs: { type: 'button', role: 'gridcell' } });
        b.addEventListener('click', () => tocar(f, c));
        celdas.push(b);
        grilla.append(b);
      }
    }
    const estado = el('p', { clase: 'rv__estado', attrs: { role: 'status', 'aria-live': 'polite' } });

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'rv',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'puntaje',
      conTiempo: false,
      etiquetaNivel: 'Dificultad',
      datos: [{ id: 'yo', etq: 'Tus fichas', inicial: 2 }, { id: 'ella', etq: 'Máquina', inicial: 2 }],
      formato: (v) => v + ' fichas',
      cuerpo: [el('div', { clase: 'rv__marco' }, grilla), estado],
      hayAvance: () => base.mov() > 0,
      nueva() {
        tablero = inicial(); turno = 1; pensando = false; ultima = -1;
        dibujar();
      },
      cargar(nivel, ex) {
        tablero = ex.t.slice(); turno = ex.turno; pensando = false; ultima = -1;
        dibujar();
        if (turno === 2) pedirMaquina();
      },
      serializar() { return { t: tablero.slice(), turno }; },
      validar(ex) {
        return Array.isArray(ex.t) && ex.t.length === N * N && ex.t.every((v) => v === 0 || v === 1 || v === 2) && (ex.turno === 1 || ex.turno === 2);
      }
    });

    function dibujar() {
      const validas = turno === 1 && !pensando && base.fase() !== 'ganado' ? jugadasValidas(tablero, 1) : [];
      const set = new Set(validas.map((m) => m.f * N + m.c));
      for (let i = 0; i < tablero.length; i++) {
        const v = tablero[i];
        const b = celdas[i];
        b.className = 'rv__celda' + (set.has(i) ? ' rv__celda--puede' : '') + (i === ultima ? ' rv__celda--ultima' : '');
        b.replaceChildren();
        if (v) {
          const antes = previo ? previo[i] : v;
          const anim = antes === v ? '' : (antes ? ' rv__ficha--vuelta' : ' rv__ficha--nueva');
          b.append(el('span', { clase: 'rv__ficha rv__ficha--' + v + anim }));
        }
        const f = (i / N) | 0; const c = i % N;
        b.setAttribute('aria-label', 'Fila ' + (f + 1) + ', columna ' + (c + 1) + (v === 1 ? ', tuya' : v === 2 ? ', de la máquina' : set.has(i) ? ', jugada posible' : ', vacía'));
      }
      previo = tablero.slice();
      const k = contar(tablero);
      base.dato('yo', k.a); base.dato('ella', k.b);
      if (base.fase() !== 'ganado') estado.textContent = turno === 1 ? 'Tu turno: tocá una casilla marcada.' : 'Piensa la máquina...';
    }

    function revisarFinal() {
      const mias = jugadasValidas(tablero, 1).length;
      const suyas = jugadasValidas(tablero, 2).length;
      if (mias || suyas) return false;
      const k = contar(tablero);
      dibujar();
      if (k.a > k.b) {
        estado.textContent = 'Ganaste ' + k.a + ' a ' + k.b + '.';
        base.ganar({ titulo: 'Ganaste', mensaje: 'Terminaste con ' + k.a + ' fichas contra ' + k.b + '.', valor: k.a });
      } else if (k.a === k.b) {
        estado.textContent = 'Empate ' + k.a + ' a ' + k.b + '.';
        base.terminar({ titulo: 'Empate', mensaje: 'Las dos partes terminaron con ' + k.a + ' fichas.' });
      } else {
        estado.textContent = 'Ganó la máquina ' + k.b + ' a ' + k.a + '.';
        base.terminar({ titulo: 'Ganó la máquina', mensaje: 'Terminaste con ' + k.a + ' fichas contra ' + k.b + '.' });
      }
      return true;
    }

    function siguiente(quienJugo) {
      // Pasa el turno al otro; si no tiene jugadas, vuelve a jugar el mismo
      const otro = 3 - quienJugo;
      if (jugadasValidas(tablero, otro).length) turno = otro;
      else if (jugadasValidas(tablero, quienJugo).length) {
        turno = quienJugo;
        notificar(otro === 1 ? 'No tenés jugadas: pasás el turno.' : 'La máquina no tiene jugadas: seguís vos.');
      }
      if (revisarFinal()) return;
      dibujar();
      if (turno === 2) pedirMaquina();
    }

    function tocar(f, c) {
      if (turno !== 1 || pensando || base.fase() === 'ganado') return;
      const v = volteos(tablero, f, c, 1);
      if (!v.length) { notificar('Ahí no se puede: tiene que encerrar fichas de la máquina.'); return; }
      base.empezar();
      tablero = aplicar(tablero, { f, c, v }, 1);
      ultima = f * N + c;
      base.sumarMov();
      siguiente(1);
    }

    function pedirMaquina() {
      pensando = true;
      dibujar();
      base.despues(() => {
        const m = elegir(tablero, base.nivel(), Math.random);
        pensando = false;
        if (m) { tablero = aplicar(tablero, m, 2); ultima = m.f * N + m.c; }
        siguiente(2);
      }, 550);
    }

    base.arrancar();
    return {
      pruebas: { tocar, tablero: () => tablero.slice(), turno: () => turno },
      destruir() { base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.Reversi = { pruebas: () => (instancia ? instancia.pruebas : null), inicial, volteos, jugadasValidas, aplicar, contar, elegir, N };
})(window);
