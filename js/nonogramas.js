/* nonogramas.js · Etapa 5: Nonogramas
   - Los números de cada fila y columna dicen cuántas casillas seguidas van pintadas.
   - Todos los tableros se pueden resolver con pura lógica (sin adivinar): el generador lo comprueba.
   - Podés pintar, marcar con ✕ las casillas vacías, y arrastrar para hacer varias de una.
   - Revisar, pista, limpiar, cronómetro, guardado automático y mejores marcas por tamaño. */
(function (global) {
  'use strict';

  const BASE = 'nonogramas';
  let ID = BASE;            // 'nonogramas', 'nonogramas-diario' o 'nonogramas-practica'
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  const { el, notificar, celebrar } = global.Pasatiempos;

  const TAMANOS = {
    5: { nombre: 'Chico 5×5', n: 5, densidad: 0.6 },
    10: { nombre: 'Mediano 10×10', n: 10, densidad: 0.6 },
    15: { nombre: 'Grande 15×15', n: 15, densidad: 0.62 },
    // Solo para el desafío del día: 20×20, más difícil que el grande. No aparece en los botones.
    20: { nombre: 'Desafío del día 20×20', n: 20, densidad: 0.55 }
  };
  const ORDEN = ['5', '10', '15'];
  const azar = (k) => Math.floor(Math.random() * k);

  /* ---------------------------------------------------------
     Motor
     Casillas: 0 = sin saber, 1 = pintada, 2 = vacía
     --------------------------------------------------------- */
  function pistasDeLinea(linea) {
    const out = [];
    let corrida = 0;
    for (const v of linea) {
      if (v === 1) corrida++;
      else if (corrida) { out.push(corrida); corrida = 0; }
    }
    if (corrida) out.push(corrida);
    return out.length ? out : [0];
  }

  // Dada una línea parcialmente conocida y sus pistas, deduce qué casillas son seguras.
  // Devuelve la línea mejorada, o null si hay contradicción.
  function resolverLinea(pistas, linea) {
    const L = linea.length;
    const bloques = pistas[0] === 0 ? [] : pistas;
    const k = bloques.length;

    const cabe = (i, largo) => {
      if (i + largo > L) return false;
      for (let x = i; x < i + largo; x++) if (linea[x] === 2) return false;
      return i + largo === L || linea[i + largo] !== 1;
    };

    // f[i][j]: desde la casilla i se pueden ubicar los bloques j.. del final
    const f = Array.from({ length: L + 2 }, () => new Uint8Array(k + 2));
    f[L][k] = 1;
    f[L + 1][k] = 1;
    for (let i = L - 1; i >= 0; i--) {
      for (let j = 0; j <= k; j++) {
        let ok = 0;
        if (linea[i] !== 1 && f[i + 1][j]) ok = 1;
        if (!ok && j < k && cabe(i, bloques[j])) {
          const sig = i + bloques[j] + 1;
          if (f[Math.min(sig, L + 1)][j + 1]) ok = 1;
        }
        f[i][j] = ok;
      }
    }
    // p[i][j]: las casillas 0..i-1 ya tienen ubicados j bloques y la casilla i queda libre para empezar
    const p = Array.from({ length: L + 2 }, () => new Uint8Array(k + 2));
    p[0][0] = 1;
    const puedeLlenar = new Int32Array(L + 1);
    const puedeVaciar = new Uint8Array(L);
    for (let i = 0; i < L; i++) {
      for (let j = 0; j <= k; j++) {
        if (!p[i][j]) continue;
        if (linea[i] !== 1) {
          p[i + 1][j] = 1;
          if (f[i + 1][j]) puedeVaciar[i] = 1;
        }
        if (j < k && cabe(i, bloques[j])) {
          const sig = Math.min(i + bloques[j] + 1, L + 1);
          if (f[sig][j + 1]) {
            puedeLlenar[i]++;
            puedeLlenar[i + bloques[j]]--;
            if (i + bloques[j] < L) puedeVaciar[i + bloques[j]] = 1; // la casilla que cierra el bloque queda vacía
            p[sig][j + 1] = 1;
          }
        }
      }
    }
    const salida = linea.slice();
    let acum = 0;
    for (let i = 0; i < L; i++) {
      acum += puedeLlenar[i];
      const llenar = acum > 0, vaciar = !!puedeVaciar[i];
      if (!llenar && !vaciar) return null;
      if (llenar && !vaciar) salida[i] = 1;
      else if (!llenar && vaciar) salida[i] = 2;
    }
    return salida;
  }

  // Intenta resolver todo el tablero con lógica. Devuelve true si queda resuelto sin adivinar.
  function resolverPorLogica(n, pFilas, pCols) {
    const g = new Array(n * n).fill(0);
    let cambio = true;
    while (cambio) {
      cambio = false;
      for (let f = 0; f < n; f++) {
        const linea = g.slice(f * n, f * n + n);
        const r = resolverLinea(pFilas[f], linea);
        if (!r) return false;
        for (let c = 0; c < n; c++) if (r[c] !== linea[c]) { g[f * n + c] = r[c]; cambio = true; }
      }
      for (let c = 0; c < n; c++) {
        const linea = [];
        for (let f = 0; f < n; f++) linea.push(g[f * n + c]);
        const r = resolverLinea(pCols[c], linea);
        if (!r) return false;
        for (let f = 0; f < n; f++) if (r[f] !== linea[f]) { g[f * n + c] = r[f]; cambio = true; }
      }
    }
    return g.every((v) => v !== 0);
  }

  function pistasDelTablero(n, sol) {
    const filas = [], cols = [];
    for (let f = 0; f < n; f++) filas.push(pistasDeLinea(sol.slice(f * n, f * n + n)));
    for (let c = 0; c < n; c++) {
      const col = [];
      for (let f = 0; f < n; f++) col.push(sol[f * n + c]);
      cols.push(pistasDeLinea(col));
    }
    return { filas, cols };
  }

  // Dibujo al azar con "manchas": se parte de ruido y se suaviza para que parezca una figura
  function dibujoAlAzar(n, densidad) {
    let g = Array.from({ length: n * n }, () => (Math.random() < densidad ? 1 : 0));
    for (let pasada = 0; pasada < 2; pasada++) {
      const nuevo = g.slice();
      for (let f = 0; f < n; f++) {
        for (let c = 0; c < n; c++) {
          let suma = 0, cant = 0;
          for (let df = -1; df <= 1; df++) {
            for (let dc = -1; dc <= 1; dc++) {
              const f2 = f + df, c2 = c + dc;
              if (f2 < 0 || f2 >= n || c2 < 0 || c2 >= n) continue;
              suma += g[f2 * n + c2];
              cant++;
            }
          }
          const media = suma / cant;
          if (media > 0.55) nuevo[f * n + c] = 1;
          else if (media < 0.4) nuevo[f * n + c] = 0;
          else if (Math.random() < 0.25) nuevo[f * n + c] = 1 - g[f * n + c];
        }
      }
      g = nuevo;
    }
    return g;
  }

  function generarNonograma(n) {
    const dens = (TAMANOS[n] || TAMANOS[10]).densidad;
    let ultimo = null;
    for (let intento = 0; intento < 400; intento++) {
      const sol = dibujoAlAzar(n, dens);
      const total = sol.reduce((a, b) => a + b, 0);
      if (total < n * n * 0.3 || total > n * n * 0.8) continue;
      const { filas, cols } = pistasDelTablero(n, sol);
      if (filas.some((p) => p[0] === 0) || cols.some((p) => p[0] === 0)) continue;
      ultimo = { n, sol, filas, cols, logica: false };
      if (resolverPorLogica(n, filas, cols)) { ultimo.logica = true; break; }
    }
    return ultimo;
  }

  global.NonogramaMotor = { generarNonograma, resolverLinea, resolverPorLogica, pistasDeLinea, pistasDelTablero, TAMANOS };

  /* ---------------------------------------------------------
     Guardado
     --------------------------------------------------------- */
  function validoGuardado(s) {
    if (!s || !TAMANOS[s.tam] || typeof s.sol !== 'string' || typeof s.celdas !== 'string') return false;
    const n = TAMANOS[s.tam].n;
    if (s.sol.length !== n * n || !/^[01]+$/.test(s.sol)) return false;
    if (s.celdas.length !== n * n || !/^[012]+$/.test(s.celdas)) return false;
    return Number.isFinite(s.ms) && s.ms >= 0;
  }

  /* ---------------------------------------------------------
     Interfaz
     --------------------------------------------------------- */
  function crear(contenedor) {
    let tam = '5';
    let n = 5;
    let sol = [];
    let celdas = [];
    let pFilas = [];
    let pCols = [];
    let pistasUsadas = 0;
    let fase = 'listo'; // 'listo' | 'jugando' | 'ganado'
    let modo = 1;       // 1 = pintar, 2 = marcar ✕
    let cursor = 0;
    let arrastre = null;
    let celdasEl = [];
    let pistasFilaEl = [];
    let pistasColEl = [];
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const valFalta = el('span', { clase: 'dato__valor', texto: '0' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    /* --- Estructura --- */
    const botonesTam = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Tamaño' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: TAMANOS[id].nombre.replace(' ', '\n'), attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesTam[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(tam));

    const btnPintar = el('button', { clase: 'btn btn--chico', texto: 'Pintar', attrs: { type: 'button', 'aria-pressed': 'true' } });
    const btnMarcar = el('button', { clase: 'btn btn--chico', texto: 'Marcar ✕', attrs: { type: 'button', 'aria-pressed': 'false' } });
    btnPintar.addEventListener('click', () => ponerModo(1));
    btnMarcar.addEventListener('click', () => ponerModo(2));
    const btnRevisar = el('button', { clase: 'btn btn--chico', texto: 'Revisar', attrs: { type: 'button' } });
    btnRevisar.addEventListener('click', revisar);
    const btnPista = el('button', { clase: 'btn btn--chico', texto: 'Pista', attrs: { type: 'button' } });
    btnPista.addEventListener('click', pista);
    const btnLimpiar = el('button', { clase: 'btn btn--chico', texto: 'Limpiar', attrs: { type: 'button' } });
    btnLimpiar.addEventListener('click', limpiar);

    const tablero = el('div', { clase: 'nono__tablero', attrs: { role: 'grid', 'aria-label': 'Nonograma', tabindex: '0' } });
    const marco = el('div', { clase: 'nono__marco' }, tablero);

    const esDiario = MODO !== 'libre';
    if (MODO === 'practica') btnNuevo.textContent = 'Reiniciar';
    const raiz = el('div', { clase: 'jg nono' },
      esDiario ? global.Diario.cartel(MODO) : null,
      esDiario ? (MODO === 'practica' ? el('div', { clase: 'jg__fila' }, btnNuevo) : null) : el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Por pintar' }), valFalta),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        el('div', { clase: 'seg' }, btnPintar, btnMarcar)),
      marco,
      el('div', { clase: 'jg__acciones' }, btnRevisar, MODO === 'diario' ? null : btnPista, btnLimpiar),
      el('p', { clase: 'jg__ayuda', texto: 'Tocá o arrastrá para pintar. Con "Marcar ✕" anotás las casillas que seguro quedan vacías (en la compu: clic derecho). Los números que se ponen tenues ya están completos. Teclado: flechas, Espacio para pintar y X para marcar.' })
    );
    contenedor.append(raiz);

    function ponerModo(m) {
      modo = m;
      btnPintar.setAttribute('aria-pressed', String(m === 1));
      btnMarcar.setAttribute('aria-pressed', String(m === 2));
    }

    /* --- Dibujo --- */
    function construir() {
      tablero.replaceChildren();
      tablero.style.setProperty('--n', String(n));
      const kr = Math.max(...pFilas.map((p) => p.length));
      const kc = Math.max(...pCols.map((p) => p.length));
      tablero.style.setProperty('--kr', String(kr));
      tablero.style.setProperty('--kc', String(kc));
      celdasEl = [];
      pistasFilaEl = [];
      pistasColEl = [];

      tablero.append(el('div', { clase: 'nono__esquina', attrs: { 'aria-hidden': 'true' } }));
      for (let c = 0; c < n; c++) {
        const d = el('div', { clase: 'nono__pc' + ((c + 1) % 5 === 0 && c < n - 1 ? ' g5' : '') });
        pCols[c].forEach((v) => d.append(el('span', { texto: String(v) })));
        pistasColEl.push(d);
        tablero.append(d);
      }
      for (let f = 0; f < n; f++) {
        const pf = el('div', { clase: 'nono__pf' + ((f + 1) % 5 === 0 && f < n - 1 ? ' g5' : '') });
        pFilas[f].forEach((v) => pf.append(el('span', { texto: String(v) })));
        pistasFilaEl.push(pf);
        tablero.append(pf);
        for (let c = 0; c < n; c++) {
          let clase = 'nono__celda';
          if ((c + 1) % 5 === 0 && c < n - 1) clase += ' gc';
          if ((f + 1) % 5 === 0 && f < n - 1) clase += ' gf';
          const x = el('div', { clase, attrs: { role: 'gridcell', 'data-i': String(f * n + c) } });
          celdasEl.push(x);
          tablero.append(x);
        }
      }
      ORDEN.forEach((id) => botonesTam[id].setAttribute('aria-pressed', String(id === tam)));
      pintarTodo();
    }

    function lineaFila(f) { return celdas.slice(f * n, f * n + n); }
    function lineaCol(c) { const out = []; for (let f = 0; f < n; f++) out.push(celdas[f * n + c]); return out; }
    const igual = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

    function pintarCelda(i) {
      const c = celdasEl[i];
      c.classList.toggle('lleno', celdas[i] === 1);
      c.classList.toggle('x', celdas[i] === 2);
      c.classList.remove('error');
      c.setAttribute('aria-label', celdas[i] === 1 ? 'pintada' : celdas[i] === 2 ? 'marcada vacía' : 'sin marcar');
    }

    function pintarPistasDeLinea(f, c) {
      if (f !== null) pistasFilaEl[f].classList.toggle('listo', igual(pistasDeLinea(lineaFila(f)), pFilas[f]) && lineaFila(f).some((v) => v === 1));
      if (c !== null) pistasColEl[c].classList.toggle('listo', igual(pistasDeLinea(lineaCol(c)), pCols[c]) && lineaCol(c).some((v) => v === 1));
    }

    function actualizarFalta() {
      const objetivo = sol.reduce((a, b) => a + b, 0);
      const pintadas = celdas.filter((v) => v === 1).length;
      valFalta.textContent = String(Math.max(0, objetivo - pintadas));
    }

    function pintarTodo() {
      for (let i = 0; i < n * n; i++) pintarCelda(i);
      for (let k = 0; k < n; k++) pintarPistasDeLinea(k, k);
      actualizarFalta();
      pintarCursor();
    }

    function pintarCursor() {
      celdasEl.forEach((c) => c.classList.remove('cursor'));
      if (document.activeElement === tablero && celdasEl[cursor]) celdasEl[cursor].classList.add('cursor');
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return { tam, sol: sol.join(''), celdas: celdas.join(''), pistas: pistasUsadas, ms: Math.round(crono.transcurrido), fecha: MODO === 'libre' ? undefined : global.Diario.hoy() };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    /* --- Partidas --- */
    function prepararPistas() {
      const p = pistasDelTablero(n, sol);
      pFilas = p.filas;
      pCols = p.cols;
    }

    function nueva(id) {
      tam = id;
      n = TAMANOS[id].n;
      const g = MODO === 'libre' ? generarNonograma(n) : global.Diario.conSemilla(global.Diario.semilla(BASE), () => generarNonograma(n));
      sol = g.sol;
      pFilas = g.filas;
      pCols = g.cols;
      celdas = new Array(n * n).fill(0);
      pistasUsadas = 0;
      fase = 'listo';
      cursor = 0;
      Guardado.borrar(ID);
      if (MODO === 'libre') Almacen.escribir('nonogramas:tamano', id);
      crono.reiniciar(0);
      construir();
    }

    function pedirNueva(id) {
      const enCurso = fase === 'jugando' && celdas.some((v) => v !== 0);
      if (enCurso && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function cargar(s) {
      tam = s.tam;
      n = TAMANOS[tam].n;
      sol = Array.from(s.sol, Number);
      celdas = Array.from(s.celdas, Number);
      prepararPistas();
      pistasUsadas = Number(s.pistas) || 0;
      fase = 'jugando';
      cursor = 0;
      construir();
      crono.reiniciar(s.ms);
      crono.iniciar();
    }

    function limpiar() {
      if (fase === 'ganado' || celdas.every((v) => v === 0)) return;
      if (!global.confirm('¿Borrar todo lo que pintaste y marcaste?')) return;
      celdas = new Array(n * n).fill(0);
      pintarTodo();
      guardarYa();
    }

    /* --- Jugadas --- */
    function arrancarSiHaceFalta() {
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
    }

    function poner(i, valor) {
      if (celdas[i] === valor) return false;
      celdas[i] = valor;
      pintarCelda(i);
      pintarPistasDeLinea(Math.floor(i / n), i % n);
      return true;
    }

    function cambio() {
      actualizarFalta();
      if (fase === 'jugando' && comprobarVictoria()) ganar();
      else guardarYa();
    }

    function comprobarVictoria() {
      for (let k = 0; k < n; k++) {
        if (!igual(pistasDeLinea(lineaFila(k)), pFilas[k])) return false;
        if (!igual(pistasDeLinea(lineaCol(k)), pCols[k])) return false;
      }
      return true;
    }

    function revisar() {
      if (fase === 'ganado') return;
      let malas = 0;
      celdasEl.forEach((c, i) => {
        c.classList.remove('error');
        if (celdas[i] === 1 && sol[i] === 0) { c.classList.add('error'); malas++; }
        else if (celdas[i] === 2 && sol[i] === 1) { c.classList.add('error'); malas++; }
      });
      if (!malas) notificar('Hasta ahora no hay errores.');
      else {
        notificar(malas === 1 ? 'Hay 1 casilla mal.' : 'Hay ' + malas + ' casillas mal.');
        despues(() => celdasEl.forEach((c) => c.classList.remove('error')), 2500);
      }
    }

    function pista() {
      if (fase === 'ganado') return;
      const dudosas = [];
      for (let i = 0; i < n * n; i++) {
        const esperado = sol[i] === 1 ? 1 : 2;
        if (celdas[i] !== esperado) dudosas.push(i);
      }
      if (!dudosas.length) return;
      arrancarSiHaceFalta();
      const i = dudosas[azar(dudosas.length)];
      poner(i, sol[i] === 1 ? 1 : 2);
      pistasUsadas++;
      celdasEl[i].classList.add('pista');
      despues(() => celdasEl[i].classList.remove('pista'), 1500);
      notificar('Te completé una casilla. Con pistas no entra en las mejores marcas.');
      cambio();
    }

    function ganar() {
      fase = 'ganado';
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      // las casillas sin marcar pasan a vacías para que se vea el dibujo
      for (let i = 0; i < n * n; i++) if (celdas[i] === 0) { celdas[i] = 2; pintarCelda(i); }
      tablero.classList.add('resuelto');
      let detalle;
      if (MODO === 'diario') {
        const rd = global.Diario.registrar(BASE, ms);
        celebrar({
          titulo: 'Desafío del día resuelto',
          mensaje: 'Nonograma del día en ' + Cronometro.formatear(ms) + '.',
          detalle: rd.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + rd.racha + (rd.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.',
          botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
        });
        return;
      }
      if (MODO === 'practica') {
        celebrar({ titulo: 'Dibujo completo', mensaje: 'Práctica en ' + Cronometro.formatear(ms) + '. No suma al ranking.', botones: [{ texto: 'Cerrar', primario: true }] });
        return;
      }
      if (pistasUsadas > 0) {
        detalle = 'Usaste ' + pistasUsadas + (pistasUsadas === 1 ? ' pista' : ' pistas') + ': esta vez no entra en las mejores marcas.';
      } else {
        const r = Records.agregar(ID, tam, ms, { modo: 'menor' });
        if (r.esRecord) detalle = 'Nueva mejor marca en ' + TAMANOS[tam].nombre.toLowerCase();
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca en este tamaño es ' + Cronometro.formatear(Records.mejor(ID, tam)) + '.';
      }
      celebrar({
        titulo: 'Dibujo completo',
        mensaje: 'Nonograma ' + TAMANOS[tam].nombre.toLowerCase() + ' en ' + Cronometro.formatear(ms) + '.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(tam) },
          { texto: 'Cerrar' }
        ]
      });
    }

    /* --- Entrada: tocar, arrastrar y teclado --- */
    function celdaDe(ev) {
      let nodo = null;
      if (typeof document.elementFromPoint === 'function' && (ev.clientX || ev.clientY)) {
        nodo = document.elementFromPoint(ev.clientX, ev.clientY);
      }
      if (!nodo || !nodo.closest || !nodo.closest('.nono__celda')) nodo = ev.target;
      const c = nodo && nodo.closest ? nodo.closest('.nono__celda') : null;
      return c ? Number(c.dataset.i) : -1;
    }

    function aplicar(i) {
      const a = arrastre;
      if (!a || i < 0) return;
      const actual = celdas[i];
      let cambioHecho = false;
      if (a.quitar) { if (actual === a.valor) cambioHecho = poner(i, 0); }
      else if (actual === 0) cambioHecho = poner(i, a.valor);
      if (cambioHecho) a.tocoAlgo = true;
    }

    tablero.addEventListener('pointerdown', (ev) => {
      if (fase === 'ganado') return;
      if (ev.pointerType === 'mouse' && ev.button !== 0 && ev.button !== 2) return;
      const i = celdaDe(ev);
      if (i < 0) return;
      const valor = (ev.pointerType === 'mouse' && ev.button === 2) ? 2 : modo;
      arrancarSiHaceFalta();
      cursor = i;
      arrastre = { valor, quitar: celdas[i] === valor, tocoAlgo: false };
      try { tablero.setPointerCapture(ev.pointerId); } catch (e) { /* no pasa nada */ }
      aplicar(i);
    });
    tablero.addEventListener('pointermove', (ev) => {
      if (!arrastre) return;
      const i = celdaDe(ev);
      if (i >= 0) { cursor = i; aplicar(i); }
    });
    const soltar = () => {
      if (!arrastre) return;
      const hubo = arrastre.tocoAlgo;
      arrastre = null;
      if (hubo) cambio();
    };
    tablero.addEventListener('pointerup', soltar);
    tablero.addEventListener('pointercancel', soltar);
    tablero.addEventListener('contextmenu', (ev) => ev.preventDefault());
    tablero.addEventListener('focus', pintarCursor);
    tablero.addEventListener('blur', pintarCursor);

    tablero.addEventListener('keydown', (ev) => {
      const k = ev.key;
      let f = Math.floor(cursor / n), c = cursor % n;
      if (k === 'ArrowUp') f = Math.max(0, f - 1);
      else if (k === 'ArrowDown') f = Math.min(n - 1, f + 1);
      else if (k === 'ArrowLeft') c = Math.max(0, c - 1);
      else if (k === 'ArrowRight') c = Math.min(n - 1, c + 1);
      else if (k === ' ' || k === 'Enter' || k === 'x' || k === 'X') {
        ev.preventDefault();
        if (fase === 'ganado') return;
        const valor = (k === 'x' || k === 'X') ? 2 : 1;
        arrancarSiHaceFalta();
        if (poner(cursor, celdas[cursor] === valor ? 0 : valor)) cambio();
        return;
      } else return;
      ev.preventDefault();
      cursor = f * n + c;
      pintarCursor();
    });

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    const esDeHoy = MODO === 'libre' || (guardado && guardado.fecha === global.Diario.hoy());
    if (validoGuardado(guardado) && esDeHoy) {
      cargar(guardado);
    } else if (MODO !== 'libre') {
      nueva('20');
    } else {
      const ultimo = Almacen.leer('nonogramas:tamano', '5');
      nueva(TAMANOS[ultimo] && String(ultimo) !== '20' ? String(ultimo) : '5');
    }

    return {
      destruir() {
        destruido = true;
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
