/* laberinto.js · Etapa 5: Laberinto
   - Laberintos generados al azar (siempre tienen una sola salida posible), en tres tamaños.
   - Salís de la A (arriba a la izquierda) y llegás a la B (abajo a la derecha).
   - Flechas o WASD, botones en pantalla, o arrastrar el dedo / el mouse por los pasillos.
   - Cronómetro (arranca con el primer paso), pasos, pista, guardado automático y mejores marcas por tamaño. */
(function (global) {
  'use strict';

  const BASE = 'laberinto';
  let ID = BASE;            // 'laberinto', 'laberinto-diario' o 'laberinto-practica'
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  const { el, notificar, celebrar } = global.Pasatiempos;

  const TAMANOS = {
    chico: { nombre: 'Chico', n: 12 },
    mediano: { nombre: 'Mediano', n: 20 },
    grande: { nombre: 'Grande', n: 30 },
    // Solo para el desafío del día: más grande que el grande. No aparece en los botones.
    diario: { nombre: 'Desafío del día', n: 36 }
  };
  const ORDEN = ['chico', 'mediano', 'grande'];

  // Paredes de cada celda en un número: 1 norte, 2 este, 4 sur, 8 oeste
  const N = 1, E = 2, S = 4, O = 8;
  const DIRS = {
    arr: { bit: N, op: S, df: -1, dc: 0 },
    der: { bit: E, op: O, df: 0, dc: 1 },
    aba: { bit: S, op: N, df: 1, dc: 0 },
    izq: { bit: O, op: E, df: 0, dc: -1 }
  };
  const azar = (k) => Math.floor(Math.random() * k);

  /* ---------------------------------------------------------
     Motor
     --------------------------------------------------------- */
  function generarLaberinto(n) {
    const paredes = new Array(n * n).fill(15);
    const visto = new Uint8Array(n * n);
    const pila = [0];
    visto[0] = 1;
    const nombres = Object.keys(DIRS);
    while (pila.length) {
      const k = pila[pila.length - 1];
      const f = Math.floor(k / n), c = k % n;
      const opciones = [];
      for (const nom of nombres) {
        const d = DIRS[nom];
        const f2 = f + d.df, c2 = c + d.dc;
        if (f2 < 0 || f2 >= n || c2 < 0 || c2 >= n || visto[f2 * n + c2]) continue;
        opciones.push(d);
      }
      if (!opciones.length) { pila.pop(); continue; }
      const d = opciones[azar(opciones.length)];
      const k2 = (f + d.df) * n + (c + d.dc);
      paredes[k] &= ~d.bit;
      paredes[k2] &= ~d.op;
      visto[k2] = 1;
      pila.push(k2);
    }
    return paredes;
  }

  /* Laberinto del día: de 5 candidatos (salidos de la semilla) se queda con el de recorrido más largo */
  function generarDelDia(n) {
    return global.Diario.conSemilla(global.Diario.semilla(BASE), () => {
      let mejor = null, mejorLargo = -1;
      for (let k = 0; k < 5; k++) {
        const p = generarLaberinto(n);
        const c = camino(p, n, 0, n * n - 1);
        if (c && c.length > mejorLargo) { mejor = p; mejorLargo = c.length; }
      }
      return mejor;
    });
  }

  // Camino más corto entre dos celdas (lista de índices, incluyendo ambas) o null
  function camino(paredes, n, desde, hasta) {
    const previo = new Int32Array(n * n).fill(-2);
    previo[desde] = -1;
    const cola = [desde];
    for (let i = 0; i < cola.length; i++) {
      const k = cola[i];
      if (k === hasta) break;
      const f = Math.floor(k / n), c = k % n;
      for (const nom in DIRS) {
        const d = DIRS[nom];
        if (paredes[k] & d.bit) continue;
        const f2 = f + d.df, c2 = c + d.dc;
        if (f2 < 0 || f2 >= n || c2 < 0 || c2 >= n) continue;
        const k2 = f2 * n + c2;
        if (previo[k2] !== -2) continue;
        previo[k2] = k;
        cola.push(k2);
      }
    }
    if (previo[hasta] === -2) return null;
    const out = [];
    for (let k = hasta; k !== -1; k = previo[k]) out.push(k);
    return out.reverse();
  }

  global.LaberintoMotor = { generarLaberinto, camino, TAMANOS };

  /* ---------------------------------------------------------
     Guardado
     --------------------------------------------------------- */
  function validoGuardado(s) {
    if (!s || !TAMANOS[s.tam] || typeof s.paredes !== 'string' || typeof s.visitadas !== 'string') return false;
    const n = TAMANOS[s.tam].n;
    if (s.paredes.length !== n * n || !/^[0-9a-f]+$/.test(s.paredes)) return false;
    if (s.visitadas.length !== n * n || !/^[01]+$/.test(s.visitadas)) return false;
    if (!Number.isInteger(s.pos) || s.pos < 0 || s.pos >= n * n) return false;
    if (!Number.isFinite(s.ms) || s.ms < 0 || !Number.isInteger(s.pasos) || s.pasos < 0) return false;
    const p = Array.from(s.paredes, (ch) => parseInt(ch, 16));
    // las paredes tienen que ser coherentes entre vecinas y cerrar el borde
    for (let f = 0; f < n; f++) {
      for (let c = 0; c < n; c++) {
        const k = f * n + c;
        if (f === 0 && !(p[k] & N)) return false;
        if (f === n - 1 && !(p[k] & S)) return false;
        if (c === 0 && !(p[k] & O)) return false;
        if (c === n - 1 && !(p[k] & E)) return false;
        if (c + 1 < n && !!(p[k] & E) !== !!(p[k + 1] & O)) return false;
        if (f + 1 < n && !!(p[k] & S) !== !!(p[k + n] & N)) return false;
      }
    }
    return camino(p, n, 0, n * n - 1) !== null && camino(p, n, 0, s.pos) !== null;
  }

  /* ---------------------------------------------------------
     Interfaz
     --------------------------------------------------------- */
  function crear(contenedor) {
    let tam = 'chico';
    let n = TAMANOS.chico.n;
    let paredes = [];
    let visitadas = [];
    let pos = 0;
    let pasos = 0;
    let pistas = 0;
    let fase = 'listo'; // 'listo' | 'jugando' | 'ganado'
    let celdasEl = [];
    let sigue = false;
    let pistaEl = [];
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valPasos = el('span', { clase: 'dato__valor', texto: '0' });
    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    /* --- Estructura --- */
    const botonesTam = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Tamaño' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: TAMANOS[id].nombre, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesTam[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(tam));
    const btnPista = el('button', { clase: 'btn btn--chico', texto: 'Pista', attrs: { type: 'button' } });
    btnPista.addEventListener('click', pista);

    const tablero = el('div', {
      clase: 'lab__tablero',
      attrs: { role: 'application', 'aria-label': 'Laberinto. Usá las flechas del teclado o arrastrá el dedo.', tabindex: '0' }
    });
    const marco = el('div', { clase: 'lab__marco' }, tablero);

    function botonFlecha(dir, texto, etiqueta) {
      const b = el('button', { clase: 'lab__flecha lab__flecha--' + dir, texto, attrs: { type: 'button', 'aria-label': etiqueta } });
      b.addEventListener('click', () => mover(dir));
      return b;
    }
    const cruz = el('div', { clase: 'lab__cruz' },
      botonFlecha('arr', '▲', 'Arriba'), botonFlecha('izq', '◀', 'Izquierda'),
      botonFlecha('der', '▶', 'Derecha'), botonFlecha('aba', '▼', 'Abajo'));

    const esDiario = MODO !== 'libre';
    if (MODO === 'practica') btnNuevo.textContent = 'Reiniciar';
    const raiz = el('div', { clase: 'jg lab' },
      esDiario ? global.Diario.cartel(MODO) : null,
      esDiario ? (MODO === 'practica' ? el('div', { clase: 'jg__fila' }, btnNuevo) : null) : el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Pasos' }), valPasos),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        MODO === 'diario' ? null : btnPista),
      marco,
      cruz,
      el('p', { clase: 'jg__ayuda', texto: 'Llevá el cuadrado de la A a la B. Usá las flechas o WASD, los botones, o arrastrá el dedo por los pasillos. El tiempo arranca con el primer paso.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function construir() {
      tablero.replaceChildren();
      tablero.style.setProperty('--n', String(n));
      celdasEl = [];
      for (let k = 0; k < n * n; k++) {
        const p = paredes[k];
        let clase = 'lab__celda';
        if (p & N) clase += ' pn';
        if (p & E) clase += ' pe';
        if (p & S) clase += ' ps';
        if (p & O) clase += ' po';
        if (k === 0) clase += ' inicio';
        if (k === n * n - 1) clase += ' meta';
        const c = el('div', { clase, attrs: { 'data-i': String(k) } });
        celdasEl.push(c);
        tablero.append(c);
      }
      visitadas.forEach((v, k) => { if (v) celdasEl[k].classList.add('paso'); });
      celdasEl[pos].classList.add('yo');
      botonesTam && ORDEN.forEach((id) => botonesTam[id].setAttribute('aria-pressed', String(id === tam)));
      valPasos.textContent = String(pasos);
    }

    function limpiarPista() {
      pistaEl.forEach((k) => celdasEl[k] && celdasEl[k].classList.remove('pista'));
      pistaEl = [];
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return {
        tam, paredes: paredes.map((p) => p.toString(16)).join(''),
        visitadas: visitadas.join(''), pos, pasos, pistas, ms: Math.round(crono.transcurrido),
        fecha: MODO === 'libre' ? undefined : global.Diario.hoy()
      };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    /* --- Partidas --- */
    function nueva(id) {
      tam = id;
      n = TAMANOS[id].n;
      paredes = MODO === 'libre' ? generarLaberinto(n) : generarDelDia(n);
      visitadas = new Array(n * n).fill(0);
      visitadas[0] = 1;
      pos = 0;
      pasos = 0;
      pistas = 0;
      fase = 'listo';
      Guardado.borrar(ID);
      if (MODO === 'libre') Almacen.escribir('laberinto:tamano', id);
      crono.reiniciar(0);
      construir();
      tablero.focus({ preventScroll: true });
    }

    function pedirNueva(id) {
      if (fase === 'jugando' && pasos > 0 && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function cargar(s) {
      tam = s.tam;
      n = TAMANOS[tam].n;
      paredes = Array.from(s.paredes, (ch) => parseInt(ch, 16));
      visitadas = Array.from(s.visitadas, (ch) => Number(ch));
      pos = s.pos;
      pasos = s.pasos;
      pistas = Number(s.pistas) || 0;
      fase = 'jugando';
      construir();
      crono.reiniciar(s.ms);
      crono.iniciar();
    }

    /* --- Movimiento --- */
    function mover(dir) {
      if (fase === 'ganado') return false;
      const d = DIRS[dir];
      if (paredes[pos] & d.bit) {
        const c = celdasEl[pos];
        c.classList.remove('choque');
        void c.offsetWidth;
        c.classList.add('choque');
        despues(() => c.classList.remove('choque'), 250);
        return false;
      }
      const k = pos + d.df * n + d.dc;
      celdasEl[pos].classList.remove('yo');
      pos = k;
      celdasEl[pos].classList.add('yo');
      if (!visitadas[pos]) { visitadas[pos] = 1; celdasEl[pos].classList.add('paso'); }
      pasos++;
      valPasos.textContent = String(pasos);
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
      if (pistaEl.length) limpiarPista();
      if (pos === n * n - 1) ganar();
      else guardarYa();
      return true;
    }

    function pista() {
      if (fase === 'ganado') return;
      limpiarPista();
      const c = camino(paredes, n, pos, n * n - 1);
      if (!c) return;
      pistas++;
      pistaEl = c.slice(1, 7); // los próximos pasos del camino correcto
      pistaEl.forEach((k) => celdasEl[k].classList.add('pista'));
      notificar('Te marqué los próximos pasos. Con pistas no entra en las mejores marcas.');
      despues(limpiarPista, 3000);
      if (fase === 'jugando') guardarYa();
    }

    function ganar() {
      fase = 'ganado';
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      limpiarPista();
      let detalle;
      if (MODO === 'diario') {
        const rd = global.Diario.registrar(BASE, ms, { pasos });
        celebrar({
          titulo: 'Desafío del día resuelto',
          mensaje: 'Laberinto del día en ' + Cronometro.formatear(ms) + ' y ' + pasos + ' pasos.',
          detalle: rd.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + rd.racha + (rd.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.',
          botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
        });
        return;
      }
      if (MODO === 'practica') {
        celebrar({ titulo: 'Salida encontrada', mensaje: 'Práctica en ' + Cronometro.formatear(ms) + '. No suma al ranking.', botones: [{ texto: 'Cerrar', primario: true }] });
        return;
      }
      if (pistas > 0) {
        detalle = 'Usaste ' + pistas + (pistas === 1 ? ' pista' : ' pistas') + ': esta vez no entra en las mejores marcas.';
      } else {
        const r = Records.agregar(ID, tam, ms, { modo: 'menor' });
        if (r.esRecord) detalle = 'Nueva mejor marca en el laberinto ' + TAMANOS[tam].nombre.toLowerCase();
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca en este tamaño es ' + Cronometro.formatear(Records.mejor(ID, tam)) + '.';
      }
      celebrar({
        titulo: 'Salida encontrada',
        mensaje: 'Laberinto ' + TAMANOS[tam].nombre.toLowerCase() + ' en ' + Cronometro.formatear(ms) + ' y ' + pasos + ' pasos.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(tam) },
          { texto: 'Cerrar' }
        ]
      });
    }

    /* --- Entrada --- */
    const TECLAS = {
      ArrowUp: 'arr', ArrowDown: 'aba', ArrowLeft: 'izq', ArrowRight: 'der',
      w: 'arr', W: 'arr', s: 'aba', S: 'aba', a: 'izq', A: 'izq', d: 'der', D: 'der'
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

    function celdaDe(ev) {
      const r = tablero.getBoundingClientRect();
      if (r.width > 0 && Number.isFinite(ev.clientX)) {
        const c = Math.min(n - 1, Math.max(0, Math.floor(((ev.clientX - r.left) / r.width) * n)));
        const f = Math.min(n - 1, Math.max(0, Math.floor(((ev.clientY - r.top) / r.height) * n)));
        return f * n + c;
      }
      const t = ev.target && ev.target.closest ? ev.target.closest('.lab__celda') : null;
      return t ? Number(t.dataset.i) : -1;
    }

    // Camina hacia la celda tocada, un paso por vez, mientras no haya paredes
    function caminarHacia(meta) {
      for (let i = 0; i < 80 && pos !== meta && fase !== 'ganado'; i++) {
        const df = Math.floor(meta / n) - Math.floor(pos / n);
        const dc = (meta % n) - (pos % n);
        const vertical = df === 0 ? null : (df > 0 ? 'aba' : 'arr');
        const horizontal = dc === 0 ? null : (dc > 0 ? 'der' : 'izq');
        const orden = Math.abs(df) >= Math.abs(dc) ? [vertical, horizontal] : [horizontal, vertical];
        let avanzo = false;
        for (const dir of orden) {
          if (dir && !(paredes[pos] & DIRS[dir].bit)) { mover(dir); avanzo = true; break; }
        }
        if (!avanzo) break;
      }
    }

    tablero.addEventListener('pointerdown', (ev) => {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      sigue = true;
      try { tablero.setPointerCapture(ev.pointerId); } catch (e) { /* no pasa nada */ }
      const k = celdaDe(ev);
      if (k >= 0) caminarHacia(k);
    });
    tablero.addEventListener('pointermove', (ev) => {
      if (!sigue) return;
      const k = celdaDe(ev);
      if (k >= 0) caminarHacia(k);
    });
    const soltar = () => { sigue = false; };
    tablero.addEventListener('pointerup', soltar);
    tablero.addEventListener('pointercancel', soltar);

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    const esDeHoy = MODO === 'libre' || (guardado && guardado.fecha === global.Diario.hoy());
    if (validoGuardado(guardado) && esDeHoy) {
      cargar(guardado);
    } else if (MODO !== 'libre') {
      nueva('diario');
    } else {
      const ultimo = Almacen.leer('laberinto:tamano', 'chico');
      nueva(TAMANOS[ultimo] && ultimo !== 'diario' ? ultimo : 'chico');
    }

    return {
      destruir() {
        destruido = true;
        document.removeEventListener('keydown', alTecla);
        temporizadores.forEach((id) => clearTimeout(id));
        temporizadores.clear();
        auto.detener(true);
        crono.destruir();
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
        instancia = global.Diario.panelCompletado(contenedor, { base: BASE, texto: 'Tu tiempo: ' + Cronometro.formatear(res.valor) });
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
