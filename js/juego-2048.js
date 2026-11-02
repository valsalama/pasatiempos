/* juego-2048.js · Etapa 3: 2048
   - Grilla de 4×4. Flechas, WASD o deslizar el dedo.
   - Dos fichas iguales que se juntan se fusionan y suman puntos (una sola fusión por ficha y movimiento).
   - Puntaje y mejor puntaje (se guarda al terminar la partida o al empezar una nueva).
   - Al llegar a 2048 podés seguir jugando.
   - La partida se guarda sola después de cada movimiento. */
(function (global) {
  'use strict';

  const BASE = '2048';
  let ID = BASE;            // '2048', '2048-diario' o '2048-practica'
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  const N = 4;
  const { el, celebrar } = global.Pasatiempos;

  function validoGuardado(s) {
    const potencia = (v) => v === 0 || (Number.isInteger(v) && v >= 2 && (v & (v - 1)) === 0);
    return !!s && Array.isArray(s.tablero) && s.tablero.length === N &&
      s.tablero.every((fila) => Array.isArray(fila) && fila.length === N && fila.every(potencia)) &&
      Number.isFinite(s.puntaje) && s.puntaje >= 0;
  }

  // Coordenadas de una línea, ordenadas desde el borde hacia el que se deslizan las fichas
  function linea(dir, k) {
    const out = [];
    for (let j = 0; j < N; j++) {
      if (dir === 'izq') out.push([k, j]);
      else if (dir === 'der') out.push([k, N - 1 - j]);
      else if (dir === 'arr') out.push([j, k]);
      else out.push([N - 1 - j, k]);
    }
    return out;
  }

  function crear(contenedor) {
    let tiles = [];
    let sigId = 1;
    let puntaje = 0;
    let ganoMostrado = false;
    let terminado = false;
    const esDiario = MODO !== 'libre';
    // En el desafío del día las fichas nuevas salen de la semilla: todas reciben la misma secuencia
    let azar = esDiario ? global.Diario.crearAzar(global.Diario.semilla(BASE)) : Math.random;
    const PROB_DOS = esDiario ? 0.75 : 0.9; // el desafío tiene más 4, que complican el tablero

    /* --- Estructura --- */
    const valPuntaje = el('span', { clase: 'dato__valor', texto: '0' });
    const valMejor = el('span', { clase: 'dato__valor', texto: '0' });

    const fondo = el('div', { clase: 'd48__fondo', attrs: { 'aria-hidden': 'true' } });
    for (let k = 0; k < N * N; k++) fondo.append(el('span'));
    const capa = el('div', { clase: 'd48__capa' });
    const tablero = el('div', {
      clase: 'd48__tablero',
      attrs: { role: 'group', 'aria-label': 'Tablero de 2048. Usá las flechas del teclado o deslizá el dedo.', tabindex: '0' }
    }, fondo, capa);

    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', pedirNueva);

    const raiz = el('div', { clase: 'jg d48' },
      esDiario ? global.Diario.cartel(MODO) : null,
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Puntaje' }), valPuntaje),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Mejor' }), valMejor)),
        MODO === 'diario' ? null : btnNuevo),
      tablero,
      el('p', { clase: 'jg__ayuda', texto: 'Deslizá el dedo sobre el tablero o usá las flechas. Cuando dos fichas iguales se juntan, se suman.' })
    );
    contenedor.append(raiz);

    /* --- Fichas --- */
    function pintarFicha(t) {
      t.el.textContent = String(t.valor);
      t.el.dataset.v = t.valor > 2048 ? 'max' : String(t.valor);
      t.el.dataset.l = String(String(t.valor).length);
    }

    function ubicar(t) {
      t.el.style.setProperty('--f', String(t.f));
      t.el.style.setProperty('--c', String(t.c));
    }

    function crearFicha(valor, f, c, nueva) {
      const t = { id: sigId++, valor, f, c, fusionada: false, el: el('div', { clase: 'd48__ficha' + (nueva ? ' nueva' : '') }) };
      pintarFicha(t);
      ubicar(t);
      capa.append(t.el);
      tiles.push(t);
      if (nueva) setTimeout(() => t.el.classList.remove('nueva'), 450);
      return t;
    }

    function reanimar(nodo) {
      nodo.classList.remove('nueva', 'pop');
      void nodo.offsetWidth;
      nodo.classList.add('pop');
      setTimeout(() => nodo.classList.remove('pop'), 280);
    }

    function aparecer() {
      const ocupadas = new Set(tiles.map((t) => t.f * N + t.c));
      const libres = [];
      for (let k = 0; k < N * N; k++) if (!ocupadas.has(k)) libres.push(k);
      if (!libres.length) return;
      const k = libres[Math.floor(azar() * libres.length)];
      crearFicha(azar() < PROB_DOS ? 2 : 4, Math.floor(k / N), k % N, true);
    }

    function matriz() {
      const m = Array.from({ length: N }, () => new Array(N).fill(0));
      tiles.forEach((t) => { m[t.f][t.c] = t.valor; });
      return m;
    }

    function hayMovimientos() {
      if (tiles.length < N * N) return true;
      const m = matriz();
      for (let f = 0; f < N; f++) {
        for (let c = 0; c < N; c++) {
          if (c + 1 < N && m[f][c] === m[f][c + 1]) return true;
          if (f + 1 < N && m[f][c] === m[f + 1][c]) return true;
        }
      }
      return false;
    }

    /* --- Datos y guardado --- */
    function actualizarDatos() {
      valPuntaje.textContent = puntaje.toLocaleString('es-AR');
      valMejor.textContent = Math.max(Records.mejor(ID, 'general') || 0, puntaje).toLocaleString('es-AR');
    }

    function guardarYa() {
      if (terminado) Guardado.borrar(ID);
      else Guardado.guardar(ID, { tablero: matriz(), puntaje, ganoMostrado, fecha: esDiario ? global.Diario.hoy() : undefined, azarN: esDiario ? azar.n : undefined });
    }

    function registrarPuntaje() {
      if (esDiario) return null; // el desafío y la práctica no tocan las marcas de partida libre
      return puntaje > 0 ? Records.agregar(ID, 'general', puntaje, { modo: 'mayor' }) : null;
    }

    /* --- Movimiento --- */
    function mover(dir) {
      if (terminado) return false;

      const grid = Array.from({ length: N }, () => new Array(N).fill(null));
      tiles.forEach((t) => { grid[t.f][t.c] = t; });

      let hubo = false;
      let ganado = 0;
      let llego2048 = false;
      const consumidas = [];
      const fusionadas = [];

      for (let k = 0; k < N; k++) {
        const coords = linea(dir, k);
        const fichas = coords.map(([f, c]) => grid[f][c]).filter(Boolean);
        let pos = 0;
        let previo = null;
        for (const t of fichas) {
          if (previo && !previo.fusionada && previo.valor === t.valor) {
            previo.valor *= 2;
            previo.fusionada = true;
            fusionadas.push(previo);
            ganado += previo.valor;
            if (previo.valor === 2048) llego2048 = true;
            t.f = previo.f;
            t.c = previo.c;
            consumidas.push(t);
            hubo = true;
          } else {
            const destino = coords[pos++];
            if (t.f !== destino[0] || t.c !== destino[1]) hubo = true;
            t.f = destino[0];
            t.c = destino[1];
            previo = t;
          }
        }
      }

      if (!hubo) return false;

      consumidas.forEach((t) => {
        tiles.splice(tiles.indexOf(t), 1);
        ubicar(t);
        t.el.style.zIndex = '0';
        setTimeout(() => t.el.remove(), 160);
      });
      tiles.forEach((t) => { ubicar(t); t.fusionada = false; });
      fusionadas.forEach((t) => { pintarFicha(t); reanimar(t.el); });

      puntaje += ganado;
      aparecer();
      actualizarDatos();

      const primeraVez2048 = llego2048 && !ganoMostrado;
      if (llego2048) ganoMostrado = true;
      if (!hayMovimientos()) terminado = true;
      guardarYa();

      if (terminado) finDeJuego();
      else if (primeraVez2048) celebrarVictoria();
      return true;
    }

    /* --- Fin de partida --- */
    function celebrarVictoria() {
      celebrar({
        titulo: 'Llegaste al 2048',
        mensaje: 'Puntaje: ' + puntaje.toLocaleString('es-AR') + '.',
        detalle: 'Podés seguir jugando para sumar más puntos.',
        botones: MODO === 'diario'
          ? [{ texto: 'Seguir jugando', primario: true }]
          : [{ texto: 'Seguir jugando', primario: true }, { texto: 'Nuevo juego', alClick: pedirNueva }]
      });
    }

    function finDeJuego() {
      if (MODO === 'diario') {
        const rd = global.Diario.registrar(BASE, puntaje);
        celebrar({
          titulo: 'Desafío del día terminado',
          mensaje: 'Terminaste con ' + puntaje.toLocaleString('es-AR') + ' puntos.',
          detalle: rd.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + rd.racha + (rd.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.',
          botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
        });
        return;
      }
      if (MODO === 'practica') {
        celebrar({
          titulo: 'Sin más movimientos',
          mensaje: 'Práctica: ' + puntaje.toLocaleString('es-AR') + ' puntos. No suma al ranking.',
          confeti: false,
          botones: [{ texto: 'Reintentar', primario: true, alClick: reiniciar }, { texto: 'Cerrar' }]
        });
        return;
      }
      const r = registrarPuntaje();
      actualizarDatos();
      let detalle = '';
      if (r) {
        if (r.esRecord) detalle = 'Nuevo mejor puntaje';
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores puntajes.';
        else detalle = 'Tu mejor puntaje es ' + Records.mejor(ID, 'general').toLocaleString('es-AR') + '.';
      }
      celebrar({
        titulo: 'Sin más movimientos',
        mensaje: 'Terminaste con ' + puntaje.toLocaleString('es-AR') + ' puntos.',
        detalle,
        confeti: !!(r && r.esRecord),
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: reiniciar },
          { texto: 'Cerrar' }
        ]
      });
    }

    function reiniciar() {
      capa.replaceChildren(); // también saca las fichas que todavía se estaban deslizando
      tiles = [];
      puntaje = 0;
      ganoMostrado = false;
      terminado = false;
      Guardado.borrar(ID);
      if (esDiario) azar = global.Diario.crearAzar(global.Diario.semilla(BASE)); // la práctica repite la misma secuencia
      aparecer();
      aparecer();
      if (esDiario) { aparecer(); aparecer(); } // el desafío arranca con 4 fichas
      actualizarDatos();
    }

    function pedirNueva() {
      const enCurso = puntaje > 0 && !terminado;
      if (enCurso && !global.confirm('¿Empezar de nuevo? Tu puntaje actual se guarda en las mejores marcas.')) return;
      if (enCurso) registrarPuntaje();
      reiniciar();
    }

    /* --- Entrada: teclado y deslizar --- */
    const TECLAS = {
      ArrowLeft: 'izq', ArrowRight: 'der', ArrowUp: 'arr', ArrowDown: 'aba',
      a: 'izq', A: 'izq', d: 'der', D: 'der', w: 'arr', W: 'arr', s: 'aba', S: 'aba'
    };

    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const dir = TECLAS[ev.key];
      if (!dir) return;
      const t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      ev.preventDefault();
      mover(dir);
    }
    document.addEventListener('keydown', alTecla);

    let inicio = null;
    tablero.addEventListener('pointerdown', (ev) => {
      inicio = { x: ev.clientX, y: ev.clientY };
      try { tablero.setPointerCapture(ev.pointerId); } catch (e) { /* no pasa nada */ }
    });
    tablero.addEventListener('pointerup', (ev) => {
      if (!inicio) return;
      const dx = ev.clientX - inicio.x;
      const dy = ev.clientY - inicio.y;
      inicio = null;
      const ax = Math.abs(dx), ay = Math.abs(dy);
      if (Math.max(ax, ay) < 24) return;
      mover(ax > ay ? (dx > 0 ? 'der' : 'izq') : (dy > 0 ? 'aba' : 'arr'));
    });
    tablero.addEventListener('pointercancel', () => { inicio = null; });

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    const esDeHoy = !esDiario || (guardado && guardado.fecha === global.Diario.hoy() && Number.isInteger(guardado.azarN));
    if (validoGuardado(guardado) && esDeHoy) {
      if (esDiario) azar = global.Diario.crearAzar(global.Diario.semilla(BASE), guardado.azarN);
      puntaje = guardado.puntaje;
      ganoMostrado = !!guardado.ganoMostrado;
      for (let f = 0; f < N; f++) {
        for (let c = 0; c < N; c++) {
          if (guardado.tablero[f][c]) crearFicha(guardado.tablero[f][c], f, c, false);
        }
      }
    } else {
      aparecer();
      aparecer();
      if (esDiario) { aparecer(); aparecer(); }
    }
    actualizarDatos();

    return {
      destruir() {
        document.removeEventListener('keydown', alTecla);
      }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { MODO = 'libre'; ID = BASE; instancia = crear(contenedor); },
    iniciarDiario(contenedor, practica) {
      const res = global.Diario.resultadoDeHoy(BASE);
      if (res && !practica) {
        instancia = global.Diario.panelCompletado(contenedor, { base: BASE, texto: 'Tu puntaje: ' + Number(res.valor).toLocaleString('es-AR') });
        return;
      }
      MODO = practica ? 'practica' : 'diario';
      ID = BASE + (practica ? '-practica' : '-diario');
      instancia = crear(contenedor);
    },
    destruir() {
      if (instancia) { instancia.destruir(); instancia = null; }
    }
  });
})(window);
