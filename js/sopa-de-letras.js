/* sopa-de-letras.js · Etapa 4: Sopa de letras
   - Elegís tema, tamaño (chica, mediana, grande) y si querés modo difícil (diagonales y palabras al revés).
   - Se juega arrastrando el dedo o el mouse sobre las letras, o tocando la primera y la última letra.
   - Con el teclado: flechas para moverte, Espacio/Enter para marcar el principio y el final.
   - Pista, pausa, cronómetro, guardado automático y mejores marcas por tamaño. */
(function (global) {
  'use strict';

  const BASE = 'sopa-de-letras';
  let ID = BASE;            // 'sopa-de-letras', 'sopa-de-letras-diario' o 'sopa-de-letras-practica'
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  const { el, notificar, celebrar } = global.Pasatiempos;

  const TAMANOS = {
    chica: { nombre: 'Chica', n: 10, palabras: 8 },
    mediana: { nombre: 'Mediana', n: 14, palabras: 12 },
    grande: { nombre: 'Grande', n: 18, palabras: 16 },
    // Solo para el desafío del día: 20×20, 20 palabras, mezcla de temas, diagonales y al revés. No aparece en los botones.
    diario: { nombre: 'Desafío del día', n: 20, palabras: 20 }
  };
  const ORDEN_TAM = ['chica', 'mediana', 'grande'];

  const DIRS_FACIL = [[0, 1], [1, 0]];
  const DIRS_DIFICIL = [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]];
  const OCHO = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]; // en orden de ángulo

  // Letras de relleno: las más comunes en español pesan más
  const RELLENO = 'AAAAAAAEEEEEEEIIIIIOOOOOOUUUSSSSNNNRRRLLLDDTTCCMMPPBBGGVFHJQYZXK';

  const TEMAS = global.PalabrasSopa.temas;
  const TEMA_MEZCLA = 'mezcla';

  const azar = (n) => Math.floor(Math.random() * n);
  function mezclar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = azar(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const reverso = (s) => s.split('').reverse().join('');

  function poolDeTema(temaId) {
    if (temaId === TEMA_MEZCLA) {
      const todas = new Set();
      TEMAS.forEach((t) => t.palabras.forEach((p) => todas.add(p)));
      return Array.from(todas);
    }
    const t = TEMAS.find((x) => x.id === temaId);
    return t ? t.palabras.slice() : [];
  }

  function nombreTema(temaId) {
    if (temaId === TEMA_MEZCLA) return 'Mezcla';
    const t = TEMAS.find((x) => x.id === temaId);
    return t ? t.nombre : temaId;
  }

  /* ---------------------------------------------------------
     Generador de sopas
     --------------------------------------------------------- */
  // Cuántas veces aparece una palabra en la grilla (en cualquier dirección, sin contar dos veces un mismo trazado)
  function contarApariciones(grid, n, palabra) {
    const vistos = new Set();
    const L = palabra.length;
    for (let f = 0; f < n; f++) {
      for (let c = 0; c < n; c++) {
        if (grid[f * n + c] !== palabra[0]) continue;
        for (const [df, dc] of OCHO) {
          const f2 = f + df * (L - 1), c2 = c + dc * (L - 1);
          if (f2 < 0 || f2 >= n || c2 < 0 || c2 >= n) continue;
          let ok = true;
          for (let i = 1; i < L; i++) {
            if (grid[(f + df * i) * n + (c + dc * i)] !== palabra[i]) { ok = false; break; }
          }
          if (!ok) continue;
          const a = f * n + c, b = f2 * n + c2;
          vistos.add(a < b ? a + '-' + b : b + '-' + a);
        }
      }
    }
    return vistos.size;
  }

  function colocar(grid, n, palabra, dirs) {
    const L = palabra.length;
    for (let intento = 0; intento < 300; intento++) {
      const [df, dc] = dirs[azar(dirs.length)];
      const f = azar(n), c = azar(n);
      const f2 = f + df * (L - 1), c2 = c + dc * (L - 1);
      if (f2 < 0 || f2 >= n || c2 < 0 || c2 >= n) continue;
      let ok = true;
      let nuevas = 0;
      for (let i = 0; i < L; i++) {
        const v = grid[(f + df * i) * n + (c + dc * i)];
        if (v === '') nuevas++;
        else if (v !== palabra[i]) { ok = false; break; }
      }
      if (!ok || nuevas === 0) continue;
      for (let i = 0; i < L; i++) grid[(f + df * i) * n + (c + dc * i)] = palabra[i];
      return { w: palabra, f, c, df, dc };
    }
    return null;
  }

  function generarSopa(temaId, tamId, dificil) {
    // Casi siempre sale bien a la primera; si alguna palabra quedó repetida por casualidad, probamos de nuevo
    let ultima = null;
    for (let vez = 0; vez < 8; vez++) {
      const r = armarSopa(temaId, tamId, dificil);
      ultima = r.sopa;
      if (r.limpia) break;
    }
    return ultima;
  }

  function armarSopa(temaId, tamId, dificil) {
    const cfg = TAMANOS[tamId];
    const n = cfg.n;
    const dirs = dificil ? DIRS_DIFICIL : DIRS_FACIL;
    const pool = poolDeTema(temaId).filter((p) => p.length <= n);

    let mejor = null;
    for (let vuelta = 0; vuelta < 25; vuelta++) {
      // Elegimos palabras al azar, sin que una esté metida dentro de otra (ni al revés)
      const elegidas = [];
      for (const p of mezclar(pool)) {
        if (elegidas.length >= cfg.palabras) break;
        const choca = elegidas.some((q) => q.includes(p) || p.includes(q) || q.includes(reverso(p)) || reverso(p).includes(q));
        if (!choca) elegidas.push(p);
      }
      elegidas.sort((a, b) => b.length - a.length);

      const grid = new Array(n * n).fill('');
      const colocadas = [];
      for (const p of elegidas) {
        const r = colocar(grid, n, p, dirs);
        if (r) colocadas.push(r);
      }
      // En modo difícil exigimos que haya diagonales (al menos un cuarto de las palabras): si no, se vuelve a armar
      const diag = colocadas.filter((r) => r.df !== 0 && r.dc !== 0).length;
      const variada = !dificil || diag >= Math.ceil(colocadas.length / 4);
      const puntaje = colocadas.length * 2 + (variada ? 1 : 0);
      if (!mejor || puntaje > mejor.puntaje) mejor = { grid, colocadas, puntaje };
      if (variada && colocadas.length === elegidas.length && colocadas.length >= cfg.palabras) break;
    }

    // Relleno: probamos varias veces hasta que ninguna palabra aparezca dos veces por casualidad
    const { grid, colocadas } = mejor;
    const fijas = grid.map((v) => v !== '');
    let final = null;
    let limpia = false;
    for (let intento = 0; intento < 60 && !limpia; intento++) {
      const g = grid.slice();
      for (let i = 0; i < g.length; i++) {
        if (!fijas[i]) g[i] = RELLENO[azar(RELLENO.length)];
      }
      final = g;
      limpia = colocadas.every((p) => contarApariciones(g, n, p.w) === 1);
    }

    return {
      limpia,
      sopa: {
        n,
        grid: final,
        palabras: mezclar(colocadas).map((p) => ({ w: p.w, f: p.f, c: p.c, df: p.df, dc: p.dc, hallada: false, k: 0, pista: false }))
      }
    };
  }

  // Para probar desde afuera (y para que quede claro qué hace el motor)
  global.SopaMotor = { generarSopa, contarApariciones, TAMANOS };

  /* ---------------------------------------------------------
     Guardado
     --------------------------------------------------------- */
  function validoGuardado(s) {
    if (!s || !TAMANOS[s.tam] || typeof s.grid !== 'string' || !Array.isArray(s.palabras)) return false;
    const n = TAMANOS[s.tam].n;
    if (s.grid.length !== n * n || !/^[A-Z]+$/.test(s.grid)) return false;
    if (typeof s.tema !== 'string' || !(s.tema === TEMA_MEZCLA || TEMAS.some((t) => t.id === s.tema))) return false;
    if (!Number.isFinite(s.ms) || s.ms < 0 || !s.palabras.length) return false;
    return s.palabras.every((p) => {
      if (!p || typeof p.w !== 'string' || p.w.length < 2) return false;
      if (![p.f, p.c, p.df, p.dc, p.k].every(Number.isInteger)) return false;
      if (Math.abs(p.df) > 1 || Math.abs(p.dc) > 1 || (p.df === 0 && p.dc === 0)) return false;
      for (let i = 0; i < p.w.length; i++) {
        const f = p.f + p.df * i, c = p.c + p.dc * i;
        if (f < 0 || f >= n || c < 0 || c >= n || s.grid[f * n + c] !== p.w[i]) return false;
      }
      return true;
    });
  }

  /* ---------------------------------------------------------
     Interfaz
     --------------------------------------------------------- */
  function crear(contenedor) {
    let config = { tema: 'animales', tam: 'chica', dificil: false };
    let estado = null; // { n, grid, palabras, pistas, fase }
    let celdasEl = [];
    let ancla = null;  // primera letra marcada con un toque
    let gesto = null;  // arrastre en curso
    let cursor = 0;
    let pausado = false;
    let destruido = false;
    const temporizadores = new Set();

    const valPalabras = el('span', { clase: 'dato__valor', texto: '0/0' });
    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    /* --- Controles --- */
    const selTema = el('select', { clase: 'desplegable', attrs: { 'aria-label': 'Tema' } });
    TEMAS.forEach((t) => selTema.append(el('option', { texto: t.nombre, attrs: { value: t.id } })));
    selTema.append(el('option', { texto: 'Mezcla de todo', attrs: { value: TEMA_MEZCLA } }));
    selTema.addEventListener('change', () => pedirNueva({ tema: selTema.value }));

    const botonesTam = {};
    const segTam = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Tamaño' } });
    ORDEN_TAM.forEach((id) => {
      const t = TAMANOS[id];
      const b = el('button', { texto: t.nombre + ' ' + t.n + '×' + t.n, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva({ tam: id }));
      botonesTam[id] = b;
      segTam.append(b);
    });

    const btnDificil = el('button', { clase: 'btn btn--chico', texto: 'Modo difícil', attrs: { type: 'button', 'aria-pressed': 'false', title: 'Diagonales y palabras al revés' } });
    btnDificil.addEventListener('click', () => pedirNueva({ dificil: !config.dificil }));

    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva({}));
    const btnPista = el('button', { clase: 'btn btn--chico', texto: 'Pista', attrs: { type: 'button' } });
    btnPista.addEventListener('click', pista);
    const btnPausa = el('button', { clase: 'btn btn--chico', texto: 'Pausa', attrs: { type: 'button' } });
    btnPausa.addEventListener('click', alternarPausa);

    const tablero = el('div', {
      clase: 'sl__tablero',
      attrs: { role: 'grid', 'aria-label': 'Sopa de letras', tabindex: '0' }
    });
    const velo = el('div', { clase: 'jg__velo', attrs: { hidden: '' } },
      el('div', { texto: 'En pausa' }),
      (() => {
        const b = el('button', { clase: 'btn btn--primario', texto: 'Seguir', attrs: { type: 'button' } });
        b.addEventListener('click', alternarPausa);
        return b;
      })());
    const marco = el('div', { clase: 'sl__marco' }, tablero, velo);
    const lista = el('ul', { clase: 'sl__lista', attrs: { 'aria-label': 'Palabras para encontrar' } });

    const esDiario = MODO !== 'libre';
    if (MODO === 'practica') btnNuevo.textContent = 'Reiniciar';
    const raiz = el('div', { clase: 'jg jg--ancho sl' },
      esDiario ? global.Diario.cartel(MODO) : null,
      esDiario ? null : el('div', { clase: 'jg__fila sl__config' }, selTema, segTam, btnDificil),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Palabras' }), valPalabras),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        el('div', { clase: 'jg__acciones sl__acciones' }, MODO === 'diario' ? null : btnPista, btnPausa, MODO === 'diario' ? null : btnNuevo)),
      el('div', { clase: 'sl__zona' }, marco, lista),
      el('p', { clase: 'jg__ayuda', texto: 'Arrastrá el dedo sobre las letras de una palabra, o tocá la primera y la última. Las palabras pueden ir en horizontal y vertical; en modo difícil también en diagonal y al revés. Con el teclado: flechas y Espacio.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function construirTablero() {
      const e = estado;
      tablero.replaceChildren();
      tablero.style.setProperty('--n', String(e.n));
      celdasEl = [];
      for (let i = 0; i < e.n * e.n; i++) {
        const c = el('div', { clase: 'sl__celda', texto: e.grid[i], attrs: { role: 'gridcell', 'data-i': String(i) } });
        celdasEl.push(c);
        tablero.append(c);
      }
      e.palabras.forEach((p) => { if (p.hallada) pintarHallada(p); });
      pintarPistas();
      construirLista();
      pintarControles();
      pintarSeleccion([]);
    }

    function celdasDe(p) {
      const out = [];
      for (let i = 0; i < p.w.length; i++) out.push((p.f + p.df * i) * estado.n + (p.c + p.dc * i));
      return out;
    }

    function pintarHallada(p) {
      celdasDe(p).forEach((i) => {
        celdasEl[i].classList.add('hallada');
        celdasEl[i].style.setProperty('--hk', String(p.k));
        celdasEl[i].classList.remove('pista');
      });
    }

    function pintarPistas() {
      celdasEl.forEach((c) => c.classList.remove('pista'));
      estado.palabras.forEach((p) => {
        if (p.pista && !p.hallada) celdasEl[p.f * estado.n + p.c].classList.add('pista');
      });
    }

    function construirLista() {
      lista.replaceChildren();
      estado.palabras.slice().sort((a, b) => a.w.localeCompare(b.w)).forEach((p) => {
        const li = el('li', { clase: 'sl__palabra' + (p.hallada ? ' hallada' : ''), texto: p.w, attrs: { 'data-w': p.w } });
        if (p.hallada) li.style.setProperty('--hk', String(p.k));
        lista.append(li);
      });
    }

    function pintarControles() {
      selTema.value = config.tema;
      ORDEN_TAM.forEach((id) => botonesTam[id].setAttribute('aria-pressed', String(id === config.tam)));
      btnDificil.setAttribute('aria-pressed', String(config.dificil));
      actualizarContador();
    }

    function actualizarContador() {
      const hechas = estado.palabras.filter((p) => p.hallada).length;
      valPalabras.textContent = hechas + '/' + estado.palabras.length;
    }

    let seleccionadas = [];
    function pintarSeleccion(indices) {
      seleccionadas.forEach((i) => { if (celdasEl[i]) celdasEl[i].classList.remove('sel', 'ancla'); });
      seleccionadas = indices;
      indices.forEach((i) => celdasEl[i].classList.add('sel'));
      if (ancla !== null && celdasEl[ancla]) celdasEl[ancla].classList.add('ancla');
    }

    /* --- Selección en línea recta --- */
    function trazar(a, b) {
      const n = estado.n;
      const f0 = Math.floor(a / n), c0 = a % n;
      const df = Math.floor(b / n) - f0, dc = (b % n) - c0;
      if (df === 0 && dc === 0) return [a];
      const paso = Math.round(Math.atan2(df, dc) / (Math.PI / 4));
      const [sf, sc] = OCHO[((paso % 8) + 8) % 8];
      const diagonal = sf !== 0 && sc !== 0;
      const largo = Math.max(0, Math.round((df * sf + dc * sc) / (diagonal ? 2 : 1)));
      const out = [];
      for (let i = 0; i <= largo; i++) {
        const f = f0 + sf * i, c = c0 + sc * i;
        if (f < 0 || f >= n || c < 0 || c >= n) break;
        out.push(f * n + c);
      }
      return out;
    }

    function resolver(a, b) {
      const camino = trazar(a, b);
      ancla = null;
      if (camino.length < 2) { pintarSeleccion([]); return; }
      const texto = camino.map((i) => estado.grid[i]).join('');
      const inverso = reverso(texto);
      const p = estado.palabras.find((q) => !q.hallada && (q.w === texto || q.w === inverso));
      if (!p) {
        const malas = camino.slice();
        malas.forEach((i) => celdasEl[i].classList.add('mal'));
        pintarSeleccion([]);
        despues(() => malas.forEach((i) => celdasEl[i].classList.remove('mal')), 380);
        return;
      }
      // Guardamos por dónde la encontró (por si la palabra aparece más de una vez)
      const [f0, c0] = [Math.floor(camino[0] / estado.n), camino[0] % estado.n];
      const [f1, c1] = [Math.floor(camino[1] / estado.n), camino[1] % estado.n];
      const orden = estado.palabras.filter((q) => q.hallada).length;
      p.f = f0; p.c = c0; p.df = f1 - f0; p.dc = c1 - c0;
      if (p.w !== texto) { // la marcó de atrás para adelante: normalizamos el sentido
        const ult = camino[camino.length - 1];
        p.f = Math.floor(ult / estado.n); p.c = ult % estado.n; p.df = -p.df; p.dc = -p.dc;
      }
      p.hallada = true;
      p.k = orden % 8;
      pintarSeleccion([]);
      pintarHallada(p);
      pintarPistas();
      construirLista();
      actualizarContador();
      guardarYa();
      if (estado.palabras.every((q) => q.hallada)) ganar();
    }

    /* --- Pista --- */
    function pista() {
      if (!estado || estado.fase !== 'jugando' || pausado) return;
      const pendientes = estado.palabras.filter((p) => !p.hallada && !p.pista);
      if (!pendientes.length) {
        notificar('Ya tenés marcada la primera letra de todas las que faltan.');
        return;
      }
      const p = pendientes[azar(pendientes.length)];
      p.pista = true;
      estado.pistas++;
      pintarPistas();
      notificar('La letra marcada es el principio de una palabra. Mirá la lista: ' + p.w.length + ' letras.');
      guardarYa();
    }

    /* --- Guardado --- */
    function serializar() {
      if (!estado || estado.fase !== 'jugando') return null;
      return {
        tema: config.tema, tam: config.tam, dificil: config.dificil,
        grid: estado.grid.join(''),
        palabras: estado.palabras.map((p) => ({ w: p.w, f: p.f, c: p.c, df: p.df, dc: p.dc, h: p.hallada ? 1 : 0, k: p.k, p: p.pista ? 1 : 0 })),
        pistas: estado.pistas,
        ms: Math.round(crono.transcurrido),
        fecha: MODO === 'libre' ? undefined : global.Diario.hoy()
      };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    /* --- Partidas --- */
    function arrancar(sopa, ms, pistasUsadas) {
      estado = { n: sopa.n, grid: sopa.grid, palabras: sopa.palabras, pistas: pistasUsadas || 0, fase: 'jugando' };
      ancla = null;
      gesto = null;
      cursor = 0;
      pausado = false;
      velo.hidden = true;
      btnPausa.textContent = 'Pausa';
      construirTablero();
      crono.reiniciar(ms || 0);
      crono.iniciar();
    }

    function nueva(cambios) {
      Guardado.borrar(ID);
      if (MODO !== 'libre') {
        config = { tema: TEMA_MEZCLA, tam: 'diario', dificil: true };
        arrancar(global.Diario.conSemilla(global.Diario.semilla(BASE), () => generarSopa(config.tema, config.tam, config.dificil)), 0, 0);
        return;
      }
      config = Object.assign({}, config, cambios);
      Almacen.escribir('sopa-de-letras:config', config);
      arrancar(generarSopa(config.tema, config.tam, config.dificil), 0, 0);
    }

    function pedirNueva(cambios) {
      const enCurso = estado && estado.fase === 'jugando' && estado.palabras.some((p) => p.hallada);
      if (enCurso && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) {
        pintarControles(); // vuelve el selector a lo que estaba
        return;
      }
      nueva(cambios);
    }

    function cargar(s) {
      config = { tema: s.tema, tam: s.tam, dificil: !!s.dificil };
      const palabras = s.palabras.map((p) => ({
        w: p.w, f: p.f, c: p.c, df: p.df, dc: p.dc, hallada: !!p.h, k: ((p.k % 8) + 8) % 8, pista: !!p.p
      }));
      arrancar({ n: TAMANOS[s.tam].n, grid: s.grid.split(''), palabras }, s.ms, Number(s.pistas) || 0);
    }

    function ganar() {
      estado.fase = 'ganado';
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      if (MODO === 'diario') {
        const rd = global.Diario.registrar(BASE, ms);
        celebrar({
          titulo: 'Desafío del día resuelto',
          mensaje: 'Sopa del día en ' + Cronometro.formatear(ms) + '.',
          detalle: rd.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + rd.racha + (rd.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.',
          botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
        });
        return;
      }
      if (MODO === 'practica') {
        celebrar({ titulo: 'Encontraste todas', mensaje: 'Práctica en ' + Cronometro.formatear(ms) + '. No suma al ranking.', botones: [{ texto: 'Cerrar', primario: true }] });
        return;
      }
      const variante = config.tam + (config.dificil ? '-dificil' : '');
      const etiqueta = TAMANOS[config.tam].nombre.toLowerCase() + (config.dificil ? ' en modo difícil' : '');

      let detalle;
      if (estado.pistas > 0) {
        detalle = 'Usaste ' + estado.pistas + (estado.pistas === 1 ? ' pista' : ' pistas') + ': esta vez no entra en las mejores marcas.';
      } else {
        const r = Records.agregar(ID, variante, ms, { modo: 'menor' });
        if (r.esRecord) detalle = 'Nueva mejor marca en sopa ' + etiqueta;
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca en este tamaño es ' + Cronometro.formatear(Records.mejor(ID, variante)) + '.';
      }
      celebrar({
        titulo: 'Encontraste todas',
        mensaje: 'Sopa ' + etiqueta + ' (' + nombreTema(config.tema).toLowerCase() + ') en ' + Cronometro.formatear(ms) + '.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva({}) },
          { texto: 'Cerrar' }
        ]
      });
    }

    function alternarPausa() {
      if (!estado || estado.fase !== 'jugando') return;
      pausado = !pausado;
      if (pausado) {
        crono.pausar();
        velo.hidden = false;
        btnPausa.textContent = 'Seguir';
        guardarYa();
      } else {
        crono.iniciar();
        velo.hidden = true;
        btnPausa.textContent = 'Pausa';
      }
    }

    /* --- Entrada: arrastrar, tocar y teclado --- */
    function celdaDe(ev) {
      const r = tablero.getBoundingClientRect();
      if (r.width > 0 && Number.isFinite(ev.clientX)) {
        const n = estado.n;
        const c = Math.min(n - 1, Math.max(0, Math.floor(((ev.clientX - r.left) / r.width) * n)));
        const f = Math.min(n - 1, Math.max(0, Math.floor(((ev.clientY - r.top) / r.height) * n)));
        return f * n + c;
      }
      const t = ev.target && ev.target.closest ? ev.target.closest('.sl__celda') : null;
      return t ? Number(t.dataset.i) : -1;
    }

    tablero.addEventListener('pointerdown', (ev) => {
      if (!estado || estado.fase !== 'jugando' || pausado) return;
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      const i = celdaDe(ev);
      if (i < 0) return;
      gesto = { desde: ancla === null ? i : ancla, toque: i, tenia: ancla !== null, movio: false, hasta: i };
      if (!gesto.tenia) ancla = i;
      cursor = i;
      pintarSeleccion(trazar(gesto.desde, i));
      try { tablero.setPointerCapture(ev.pointerId); } catch (e) { /* no pasa nada */ }
    });

    tablero.addEventListener('pointermove', (ev) => {
      if (!gesto) return;
      const i = celdaDe(ev);
      if (i < 0) return;
      if (!gesto.movio) {
        if (i === gesto.toque) return;
        gesto.movio = true;
        if (gesto.tenia) { // arrancó un arrastre nuevo desde otra letra
          gesto.desde = gesto.toque;
          gesto.tenia = false;
          ancla = gesto.toque;
        }
      }
      gesto.hasta = i;
      cursor = i;
      pintarSeleccion(trazar(gesto.desde, i));
    });

    tablero.addEventListener('pointerup', () => {
      if (!gesto) return;
      const g = gesto;
      gesto = null;
      if (g.movio) {
        resolver(g.desde, g.hasta);
      } else if (g.tenia) {
        if (g.toque === ancla) { ancla = null; pintarSeleccion([]); }
        else resolver(ancla, g.toque);
      } else {
        pintarSeleccion([ancla]); // primer toque: queda esperando el segundo
      }
    });

    tablero.addEventListener('pointercancel', () => {
      gesto = null;
      ancla = null;
      pintarSeleccion([]);
    });

    tablero.addEventListener('keydown', (ev) => {
      if (!estado || estado.fase !== 'jugando' || pausado) return;
      const n = estado.n;
      let f = Math.floor(cursor / n), c = cursor % n;
      const k = ev.key;
      if (k === 'ArrowUp') f = Math.max(0, f - 1);
      else if (k === 'ArrowDown') f = Math.min(n - 1, f + 1);
      else if (k === 'ArrowLeft') c = Math.max(0, c - 1);
      else if (k === 'ArrowRight') c = Math.min(n - 1, c + 1);
      else if (k === ' ' || k === 'Enter') {
        ev.preventDefault();
        if (ancla === null) { ancla = cursor; pintarSeleccion([cursor]); }
        else if (ancla === cursor) { ancla = null; pintarSeleccion([]); }
        else resolver(ancla, cursor);
        return;
      } else if (k === 'Escape') {
        ancla = null;
        pintarSeleccion([]);
        return;
      } else return;
      ev.preventDefault();
      cursor = f * n + c;
      pintarSeleccion(ancla === null ? [cursor] : trazar(ancla, cursor));
    });

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    const esDeHoy = MODO === 'libre' || (guardado && guardado.fecha === global.Diario.hoy());
    if (validoGuardado(guardado) && esDeHoy) {
      cargar(guardado);
    } else if (MODO !== 'libre') {
      nueva({});
    } else {
      const ultima = Almacen.leer('sopa-de-letras:config', null);
      const base = { tema: 'animales', tam: 'chica', dificil: false };
      if (ultima && TAMANOS[ultima.tam] && ultima.tam !== 'diario') base.tam = ultima.tam;
      if (ultima && (ultima.tema === TEMA_MEZCLA || TEMAS.some((t) => t.id === ultima.tema))) base.tema = ultima.tema;
      if (ultima) base.dificil = !!ultima.dificil;
      config = base;
      nueva({});
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
