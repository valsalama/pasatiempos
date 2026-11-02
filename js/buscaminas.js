/* buscaminas.js · Etapa 3: Buscaminas
   - Tres niveles: fácil 9×9 (10 minas), medio 16×16 (40) y difícil 16×30 (99).
   - La primera casilla que destapás nunca tiene mina (ni sus vecinas).
   - Mouse: clic izquierdo destapa, clic derecho marca con bandera.
   - Celular: toque destapa, mantener apretado marca (o usá el "Modo bandera").
   - Tocar un número que ya tiene todas sus banderas destapa las vecinas ("acorde").
   - Guardado automático de la partida y mejores marcas por nivel. */
(function (global) {
  'use strict';

  const BASE = 'buscaminas';
  let ID = BASE;            // 'buscaminas', 'buscaminas-diario' o 'buscaminas-practica'
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  const { el, notificar, celebrar } = global.Pasatiempos;

  const NIVELES = {
    facil: { nombre: 'Fácil', filas: 9, cols: 9, minas: 10, max: 52 },
    medio: { nombre: 'Medio', filas: 16, cols: 16, minas: 40, max: 40 },
    dificil: { nombre: 'Difícil', filas: 16, cols: 30, minas: 99, max: 34 },
    // Solo para el desafío del día: más minas que el nivel difícil. No aparece en los botones.
    diario: { nombre: 'Desafío del día', filas: 16, cols: 30, minas: 112, max: 34 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];

  const ICONO_BANDERA =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v18" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" fill="none"/><path d="M7 4h11l-3 4.2 3 4.3H7z" fill="currentColor"/></svg>';
  const ICONO_MINA =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5.2" fill="currentColor"/>' +
    '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';

  function barajar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function calcularVecinos(filas, cols) {
    const v = [];
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < cols; c++) {
        const lista = [];
        for (let df = -1; df <= 1; df++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (!df && !dc) continue;
            const nf = f + df, nc = c + dc;
            if (nf >= 0 && nf < filas && nc >= 0 && nc < cols) lista.push(nf * cols + nc);
          }
        }
        v.push(lista);
      }
    }
    return v;
  }

  function validoGuardado(s) {
    if (!s || !NIVELES[s.nivel]) return false;
    const cfg = NIVELES[s.nivel];
    const n = cfg.filas * cfg.cols;
    return Array.isArray(s.celdas) && s.celdas.length === n && s.celdas.every((x) => x === 0 || x === 1 || x === 2) &&
      Array.isArray(s.minas) && s.minas.length === cfg.minas &&
      s.minas.every((i) => Number.isInteger(i) && i >= 0 && i < n) && new Set(s.minas).size === cfg.minas &&
      Number.isFinite(s.ms);
  }

  function crear(contenedor) {
    let nivelId = 'facil';
    let cfg = NIVELES.facil;
    let estado = null;
    let vec = [];
    let celdasEl = [];
    let modoBandera = false;
    let cursor = 0;
    let destruido = false;
    let toque = null;

    const valMinas = el('span', { clase: 'dato__valor', texto: '0' });
    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    /* --- Estructura --- */
    const botonesNivel = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Nivel' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: NIVELES[id].nombre, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesNivel[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(nivelId));

    const btnBandera = el('button', { clase: 'btn btn--chico', texto: 'Modo bandera', attrs: { type: 'button', 'aria-pressed': 'false' } });
    btnBandera.addEventListener('click', () => { modoBandera = !modoBandera; pintar(); });

    const textoEstado = el('p', { clase: 'bm__estado', texto: '' });
    const tablero = el('div', { clase: 'bm__tablero', attrs: { role: 'grid', 'aria-label': 'Tablero de buscaminas', tabindex: '0' } });
    const marco = el('div', { clase: 'bm__marco' }, tablero);
    const aviso = el('p', { clase: 'bm__aviso', texto: '↔ El tablero es más ancho que la pantalla: deslizalo para ver el resto.', attrs: { hidden: '' } });

    const esDiario = MODO !== 'libre';
    const raiz = el('div', { clase: 'jg jg--ancho bm' },
      esDiario ? global.Diario.cartel(MODO) : null,
      esDiario ? null : el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Minas' }), valMinas),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        btnBandera),
      textoEstado,
      marco,
      aviso,
      el('p', { clase: 'jg__ayuda', texto: 'Tocá para destapar. Mantené apretado (o activá el modo bandera) para marcar una mina. En la compu, clic derecho. Tocá un número que ya tiene todas sus banderas para destapar las casillas de alrededor.' })
    );
    contenedor.append(raiz);

    /* --- Estado --- */
    function nuevoEstado(id) {
      nivelId = id;
      cfg = NIVELES[id];
      const n = cfg.filas * cfg.cols;
      vec = calcularVecinos(cfg.filas, cfg.cols);
      estado = { n, celdas: new Array(n).fill(0), minas: null, numeros: null, banderas: 0, reveladas: 0, fase: 'listo', explotada: -1 };
      cursor = 0;
    }

    function construirTablero() {
      tablero.replaceChildren();
      tablero.style.setProperty('--cols', String(cfg.cols));
      tablero.style.setProperty('--max', cfg.max + 'px');
      celdasEl = [];
      for (let i = 0; i < estado.n; i++) {
        const c = el('div', { clase: 'bm__celda oculta', attrs: { role: 'gridcell', 'data-i': String(i) } });
        celdasEl.push(c);
        tablero.append(c);
      }
      requestAnimationFrame(() => { aviso.hidden = marco.scrollWidth <= marco.clientWidth + 1; });
    }

    function calcularNumeros() {
      const e = estado;
      e.numeros = e.minas.map((m, i) => vec[i].reduce((suma, v) => suma + e.minas[v], 0));
    }

    function colocarMinas(seguro) {
      const e = estado;
      let prohibidas = new Set([seguro].concat(vec[seguro]));
      let libres = [];
      for (let i = 0; i < e.n; i++) if (!prohibidas.has(i)) libres.push(i);
      if (libres.length < cfg.minas) {
        prohibidas = new Set([seguro]);
        libres = [];
        for (let i = 0; i < e.n; i++) if (!prohibidas.has(i)) libres.push(i);
      }
      barajar(libres);
      e.minas = new Array(e.n).fill(0);
      for (let k = 0; k < cfg.minas; k++) e.minas[libres[k]] = 1;
      calcularNumeros();
    }

    /* --- Pintar --- */
    function pintar() {
      const e = estado;
      const perdido = e.fase === 'perdido';

      for (let i = 0; i < e.n; i++) {
        const c = celdasEl[i];
        const cod = e.celdas[i];
        const esMina = !!(e.minas && e.minas[i]);
        let clase = 'bm__celda';
        let html = '';
        let texto = '';

        if (cod === 1) {
          clase += ' abierta';
          const k = e.numeros ? e.numeros[i] : 0;
          if (k > 0) { clase += ' n' + k; texto = String(k); }
        } else if (cod === 2) {
          clase += perdido && !esMina ? ' bandera mal' : ' bandera';
          html = ICONO_BANDERA;
        } else if (perdido && esMina) {
          clase += ' abierta mina' + (i === e.explotada ? ' explotada' : '');
          html = ICONO_MINA;
        } else {
          clase += ' oculta';
        }
        if (i === cursor) clase += ' cursor';

        const huella = clase + '|' + texto;
        if (c._h !== huella) {
          c._h = huella;
          c.className = clase;
          if (html) c.innerHTML = html;
          else c.textContent = texto;
        }
      }

      valMinas.textContent = String(cfg.minas - e.banderas);
      ORDEN.forEach((id) => botonesNivel[id].setAttribute('aria-pressed', String(id === nivelId)));
      btnBandera.setAttribute('aria-pressed', String(modoBandera));

      if (e.fase === 'listo') textoEstado.textContent = 'Tocá cualquier casilla para empezar.';
      else if (e.fase === 'ganado') textoEstado.textContent = 'Despejaste todo';
      else if (e.fase === 'perdido') textoEstado.textContent = 'Pisaste una mina. Tocá "Nuevo juego" para intentar de nuevo.';
      else textoEstado.textContent = modoBandera ? 'Modo bandera: cada toque marca o desmarca una mina.' : '';
    }

    /* --- Guardado --- */
    function serializar() {
      if (!estado || estado.fase !== 'jugando') return null;
      const minas = [];
      estado.minas.forEach((m, i) => { if (m) minas.push(i); });
      return { nivel: nivelId, minas, celdas: estado.celdas, ms: Math.round(crono.transcurrido), fecha: MODO === 'libre' ? undefined : global.Diario.hoy() };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    function cambio() {
      pintar();
      guardarYa();
    }

    /* --- Partidas --- */
    function nueva(id) {
      nuevoEstado(id);
      construirTablero();
      crono.reiniciar(0);
      Guardado.borrar(ID);
      if (MODO === 'libre') Almacen.escribir('buscaminas:nivel', id);
      else colocarMinasDelDia();
      pintar();
    }

    /* Desafío del día: las minas salen de la semilla y todas arrancan con la misma zona abierta,
       así el primer toque no cambia el tablero. */
    function colocarMinasDelDia() {
      const e = estado;
      global.Diario.conSemilla(global.Diario.semilla(BASE), () => {
        const f = 3 + Math.floor(Math.random() * (cfg.filas - 6));
        const c = 3 + Math.floor(Math.random() * (cfg.cols - 6));
        colocarMinas(f * cfg.cols + c);
        inundar(f * cfg.cols + c);
      });
      e.fase = 'listo';
    }

    function pedirNueva(id) {
      const enCurso = estado && estado.fase === 'jugando' && estado.reveladas > 0;
      if (enCurso && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function cargar(s) {
      nuevoEstado(s.nivel);
      const e = estado;
      e.minas = new Array(e.n).fill(0);
      s.minas.forEach((i) => { e.minas[i] = 1; });
      calcularNumeros();
      e.celdas = s.celdas.slice();
      e.banderas = e.celdas.filter((x) => x === 2).length;
      e.reveladas = e.celdas.filter((x) => x === 1).length;
      e.fase = 'jugando';
      construirTablero();
      crono.reiniciar(s.ms);
      crono.iniciar();
      pintar();
    }

    /* --- Jugadas --- */
    function inundar(inicio) {
      const e = estado;
      const pila = [inicio];
      while (pila.length) {
        const k = pila.pop();
        if (e.celdas[k] !== 0 || e.minas[k]) continue;
        e.celdas[k] = 1;
        e.reveladas++;
        if (e.numeros[k] === 0) {
          vec[k].forEach((v) => { if (e.celdas[v] === 0) pila.push(v); });
        }
      }
    }

    function revelar(i) {
      const e = estado;
      if (e.celdas[i] !== 0) return;
      if (e.fase === 'listo') {
        if (MODO === 'libre') colocarMinas(i);
        e.fase = 'jugando';
        crono.reiniciar(0);
        crono.iniciar();
      }
      if (e.minas[i]) { perder(i); return; }
      inundar(i);
      if (e.reveladas === e.n - cfg.minas) ganar();
      else cambio();
    }

    function acorde(i) {
      const e = estado;
      if (e.fase !== 'jugando' || e.celdas[i] !== 1 || e.numeros[i] === 0) return;
      const banderas = vec[i].filter((v) => e.celdas[v] === 2).length;
      if (banderas !== e.numeros[i]) return;
      for (const v of vec[i]) {
        if (e.celdas[v] !== 0) continue;
        if (e.minas[v]) { perder(v); return; }
        inundar(v);
      }
      if (e.reveladas === e.n - cfg.minas) ganar();
      else cambio();
    }

    function alternarBandera(i) {
      const e = estado;
      if (e.fase === 'ganado' || e.fase === 'perdido' || e.celdas[i] === 1) return;
      if (e.celdas[i] === 0) { e.celdas[i] = 2; e.banderas++; }
      else { e.celdas[i] = 0; e.banderas--; }
      cambio();
    }

    function accion(i) {
      const e = estado;
      if (e.fase === 'ganado' || e.fase === 'perdido') return;
      if (e.celdas[i] === 1) acorde(i);
      else if (modoBandera) alternarBandera(i);
      else revelar(i);
    }

    function perder(i) {
      const e = estado;
      e.fase = 'perdido';
      e.explotada = i;
      crono.pausar();
      Guardado.borrar(ID);
      pintar();
      if (MODO === 'diario') {
        global.Diario.registrarFallo(BASE);
        celebrar({
          titulo: 'Pisaste una mina',
          mensaje: 'El desafío de hoy se terminó sin resolverse. Mañana hay un tablero nuevo.',
          detalle: 'Podés practicar con este mismo tablero, sin que cuente para el ranking.',
          confeti: false,
          botones: [{ texto: 'Practicar', primario: true, alClick: () => { global.location.hash = '#/buscaminas/practica'; } }, { texto: 'Cerrar' }]
        });
        return;
      }
      notificar('Pisaste una mina. Probá de nuevo.');
    }

    function ganar() {
      const e = estado;
      e.fase = 'ganado';
      for (let i = 0; i < e.n; i++) {
        if (e.minas[i] && e.celdas[i] === 0) { e.celdas[i] = 2; e.banderas++; }
      }
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      pintar();

      if (MODO === 'diario') {
        const rd = global.Diario.registrar(BASE, ms);
        celebrar({
          titulo: 'Desafío del día resuelto',
          mensaje: 'Buscaminas del día en ' + Cronometro.formatear(ms) + '.',
          detalle: rd.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + rd.racha + (rd.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.',
          botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
        });
        return;
      }
      if (MODO === 'practica') {
        celebrar({ titulo: 'Despejaste todo', mensaje: 'Práctica en ' + Cronometro.formatear(ms) + '. No suma al ranking.', botones: [{ texto: 'Cerrar', primario: true }] });
        return;
      }
      const r = Records.agregar(ID, nivelId, ms, { modo: 'menor' });
      let detalle;
      if (r.esRecord) detalle = 'Nueva mejor marca en nivel ' + cfg.nombre.toLowerCase();
      else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
      else detalle = 'Tu mejor marca en este nivel es ' + Cronometro.formatear(Records.mejor(ID, nivelId)) + '.';

      celebrar({
        titulo: 'Despejaste todo',
        mensaje: 'Buscaminas ' + cfg.nombre.toLowerCase() + ' en ' + Cronometro.formatear(ms) + '.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(nivelId) },
          { texto: 'Cerrar' }
        ]
      });
    }

    /* --- Entrada: mouse, toque y teclado --- */
    function cancelarToque() {
      if (toque && toque.timer) clearTimeout(toque.timer);
      toque = null;
    }

    tablero.addEventListener('pointerdown', (ev) => {
      const c = ev.target.closest('.bm__celda');
      if (!c) return;
      const i = Number(c.dataset.i);
      cancelarToque();
      if (ev.pointerType === 'mouse') {
        toque = { i, mouse: true, boton: ev.button };
        return;
      }
      const t = { i, mouse: false, x: ev.clientX, y: ev.clientY, largo: false, timer: null };
      t.timer = setTimeout(() => {
        t.largo = true;
        if (global.navigator && global.navigator.vibrate) global.navigator.vibrate(15);
        alternarBandera(i);
      }, 420);
      toque = t;
    });

    tablero.addEventListener('pointermove', (ev) => {
      if (toque && !toque.mouse && (Math.abs(ev.clientX - toque.x) > 10 || Math.abs(ev.clientY - toque.y) > 10)) cancelarToque();
    });

    tablero.addEventListener('pointerup', (ev) => {
      if (!toque) return;
      const t = toque;
      cancelarToque();
      if (t.mouse) {
        const c = ev.target.closest('.bm__celda');
        if (!c || Number(c.dataset.i) !== t.i) return;
        cursor = t.i;
        if (t.boton === 0) accion(t.i);
        else if (t.boton === 2) alternarBandera(t.i);
        else if (t.boton === 1) acorde(t.i);
        return;
      }
      if (t.largo) return;
      cursor = t.i;
      accion(t.i);
    });

    tablero.addEventListener('pointercancel', cancelarToque);
    tablero.addEventListener('contextmenu', (ev) => ev.preventDefault());

    tablero.addEventListener('keydown', (ev) => {
      const k = ev.key;
      let f = Math.floor(cursor / cfg.cols), c = cursor % cfg.cols;
      if (k === 'ArrowUp') f = Math.max(0, f - 1);
      else if (k === 'ArrowDown') f = Math.min(cfg.filas - 1, f + 1);
      else if (k === 'ArrowLeft') c = Math.max(0, c - 1);
      else if (k === 'ArrowRight') c = Math.min(cfg.cols - 1, c + 1);
      else if (k === ' ' || k === 'Enter') { accion(cursor); ev.preventDefault(); return; }
      else if (k === 'f' || k === 'F' || k === 'b' || k === 'B') { alternarBandera(cursor); ev.preventDefault(); return; }
      else return;
      cursor = f * cfg.cols + c;
      pintar();
      ev.preventDefault();
    });

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    const esDeHoy = MODO === 'libre' || (guardado && guardado.fecha === global.Diario.hoy());
    if (validoGuardado(guardado) && esDeHoy) {
      cargar(guardado);
    } else if (MODO !== 'libre') {
      nueva('diario');
    } else {
      const ultimo = Almacen.leer('buscaminas:nivel', 'facil');
      nueva(NIVELES[ultimo] && ultimo !== 'diario' ? ultimo : 'facil');
    }

    return {
      destruir() {
        destruido = true;
        cancelarToque();
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
      const cerrado = global.Diario.cerradoHoy(BASE);
      if (cerrado && !practica) {
        instancia = global.Diario.panelCompletado(contenedor, cerrado.completado
          ? { base: BASE, texto: 'Tu tiempo: ' + Cronometro.formatear(cerrado.valor) }
          : { base: BASE, titulo: 'El desafío de hoy no salió', texto: 'Pisaste una mina. Mañana hay un tablero nuevo.' });
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
