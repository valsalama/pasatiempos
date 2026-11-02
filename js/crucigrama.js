/* crucigrama.js · Etapa 6: Crucigrama autodefinido (estilo Cripti)
   - Las casillas grises del tablero muestran el número de la definición y una flecha que indica hacia dónde va la
     palabra (→ hacia la derecha, ↓ hacia abajo). La definición completa se lee arriba del tablero y en la lista.
     Una casilla puede tener dos definiciones. Se mezclan definiciones fáciles y difíciles.
   - Cada crucigrama se arma al azar con las palabras de palabras.js.
   - Se juega tocando una casilla (si tocás de nuevo cambia de dirección) y escribiendo con el teclado de la compu
     o con el teclado en pantalla. También podés tocar una definición de la lista.
   - Con la tecla Tab pasás a la definición siguiente (Shift + Tab, a la anterior).
   - Revisar, borrar errores, pista (una letra), revelar palabra, pausa, cronómetro, guardado automático y mejores marcas. */
(function (global) {
  'use strict';

  const BASE = 'crucigrama';
  let ID = BASE;            // 'crucigrama', 'crucigrama-diario' o 'crucigrama-practica'
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  let soloDificiles = false; // el desafío del día usa únicamente definiciones difíciles
  const { el, notificar, celebrar } = global.Pasatiempos;

  const TAMANOS = {
    chico: { nombre: 'Chico', f: 9, c: 9, objetivo: 0.6 },
    mediano: { nombre: 'Mediano', f: 11, c: 11, objetivo: 0.6 },
    grande: { nombre: 'Grande', f: 13, c: 13, objetivo: 0.6 },
    // Solo para el desafío del día: 13×13 con definiciones difíciles. No aparece en los botones.
    diario: { nombre: 'Desafío del día', f: 13, c: 13, objetivo: 0.62 }
  };
  const ORDEN = ['chico', 'mediano', 'grande'];
  const FILAS_TECLADO = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'];

  const azar = (k) => Math.floor(Math.random() * k);
  function mezclar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = azar(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Mezcla definiciones fáciles y difíciles (estilo autodefinido de diario)
  function elegirDefinicion(e) {
    const dif = e.dificiles || [];
    const faciles = e.d || [];
    if (dif.length && (soloDificiles || !faciles.length || Math.random() < 0.55)) return dif[azar(dif.length)];
    return faciles[azar(faciles.length)];
  }

  /* ---------------------------------------------------------
     Generador
     Casillas: tipo 0 = vacía (después queda como bloque), 1 = letra, 2 = casilla de definición
     --------------------------------------------------------- */
  function armar(F, C, maxLen, entradas, objetivo) {
    const tipo = new Array(F * C).fill(0);
    const letra = new Array(F * C).fill('');
    let slots = [];
    const usadas = new Set();
    const porLargo = {};
    entradas.forEach((e) => { (porLargo[e.p.length] = porLargo[e.p.length] || []).push(e); });

    function valido() {
      const claves = new Map();
      for (const s of slots) claves.set(s.dir + s.r + ',' + s.c, s);
      if (claves.size !== slots.length) return false;
      for (let r = 0; r < F; r++) {
        let c = 0;
        while (c < C) {
          if (tipo[r * C + c] !== 1) { c++; continue; }
          let e = c;
          while (e < C && tipo[r * C + e] === 1) e++;
          if (e - c >= 2) {
            const s = claves.get('h' + r + ',' + c);
            if (!s || s.p.length !== e - c) return false;
          }
          c = e;
        }
      }
      for (let c = 0; c < C; c++) {
        let r = 0;
        while (r < F) {
          if (tipo[r * C + c] !== 1) { r++; continue; }
          let e = r;
          while (e < F && tipo[e * C + c] === 1) e++;
          if (e - r >= 2) {
            const s = claves.get('v' + r + ',' + c);
            if (!s || s.p.length !== e - r) return false;
          }
          r = e;
        }
      }
      return true;
    }

    function intentar(r, c, dir, conectar) {
      const dr = dir === 'h' ? 0 : 1, dc = dir === 'h' ? 1 : 0;
      const pr = r - dr, pc = c - dc;
      if (pr < 0 || pc < 0) return false;
      if (tipo[pr * C + pc] === 1 || tipo[r * C + c] === 2) return false;
      // hasta dónde puede llegar la palabra
      const patron = [];
      for (let k = 0; k < maxLen; k++) {
        const rr = r + dr * k, cc = c + dc * k;
        if (rr >= F || cc >= C) break;
        const t = tipo[rr * C + cc];
        if (t === 2) break;
        patron.push(t === 1 ? letra[rr * C + cc] : '');
      }
      if (patron.length < 3) return false;

      // candidatas por largo
      const porL = [];
      for (let L = 3; L <= patron.length; L++) {
        const rr = r + dr * L, cc = c + dc * L;
        if (rr < F && cc < C && tipo[rr * C + cc] === 1) continue; // la palabra tendría que seguir
        const fijas = patron.slice(0, L).filter(Boolean).length;
        if (conectar && fijas === 0) continue;
        if (fijas === L) continue; // no aporta letras nuevas
        const lista = (porLargo[L] || []).filter((e) => {
          if (usadas.has(e.p)) return false;
          for (let k = 0; k < L; k++) if (patron[k] && patron[k] !== e.p[k]) return false;
          return true;
        });
        if (lista.length) porL.push(lista);
      }
      if (!porL.length) return false;
      const lista = porL[azar(porL.length)];
      const e = lista[azar(lista.length)];

      // aplicamos y validamos; si no sirve, deshacemos
      const tipoAntes = tipo.slice(), letraAntes = letra.slice(), nSlots = slots.length;
      if (tipo[pr * C + pc] === 0) tipo[pr * C + pc] = 2;
      for (let k = 0; k < e.p.length; k++) {
        const i = (r + dr * k) * C + (c + dc * k);
        tipo[i] = 1;
        letra[i] = e.p[k];
      }
      const def = elegirDefinicion(e);
      slots.push({ r, c, dir, p: e.p, d: def });
      if (!valido()) {
        for (let i = 0; i < tipo.length; i++) { tipo[i] = tipoAntes[i]; letra[i] = letraAntes[i]; }
        slots.length = nSlots;
        return false;
      }
      usadas.add(e.p);
      return true;
    }

    // Primera palabra: larga, arriba a la izquierda
    for (let k = 0; k < 20 && !slots.length; k++) intentar(1, 1, azar(2) ? 'h' : 'v', false);

    // Pasadas: primero palabras que cruzan con lo que ya hay; después, las que quepan
    const posiciones = [];
    for (let r = 1; r < F; r++) for (let c = 1; c < C; c++) { posiciones.push([r, c, 'h']); posiciones.push([r, c, 'v']); }
    for (let pasada = 0; pasada < 8; pasada++) {
      let puso = 0;
      for (const [r, c, dir] of mezclar(posiciones)) {
        if (intentar(r, c, dir, pasada < 4)) puso++;
      }
      const letras = tipo.filter((t) => t === 1).length;
      if (letras / (F * C) >= objetivo + 0.1) break;
      if (!puso && pasada >= 4) break;
    }

    return { F, C, tipo, letra, slots, letras: tipo.filter((t) => t === 1).length };
  }

  function generarCrucigrama(tamId) {
    const cfg = TAMANOS[tamId];
    const F = cfg.f, C = cfg.c;
    const maxLen = Math.min(8, Math.max(F, C) - 1);
    // En el desafío del día solo entran palabras que tengan definición difícil
    const entradas = global.PalabrasCrucigrama.lista.filter((e) => e.p.length <= maxLen && (!soloDificiles || (e.dificiles || []).length));
    let mejor = null;
    const t0 = Date.now();
    for (let intento = 0; intento < 40; intento++) {
      const r = armar(F, C, maxLen, entradas, cfg.objetivo);
      if (!mejor || r.letras > mejor.letras) mejor = r;
      // En el desafío del día no se corta por tiempo: así sale el mismo crucigrama en cualquier dispositivo
      if (mejor.letras / (F * C) >= cfg.objetivo || (!(global.Diario && global.Diario.generando) && Date.now() - t0 > 600)) break;
    }
    return {
      f: F, c: C,
      sol: mejor.letra.map((l, i) => (mejor.tipo[i] === 1 ? l : '')),
      slots: mejor.slots.map((s) => ({ r: s.r, c: s.c, dir: s.dir, d: s.d }))
    };
  }

  global.CrucigramaMotor = { generarCrucigrama, TAMANOS };

  /* Datos derivados de un crucigrama (sol + slots) */
  function preparar(puz) {
    const { f: F, c: C } = puz;
    const slots = puz.slots.map((s) => {
      const dr = s.dir === 'h' ? 0 : 1, dc = s.dir === 'h' ? 1 : 0;
      const celdas = [];
      for (let k = 0; ; k++) {
        const r = s.r + dr * k, c = s.c + dc * k;
        if (r >= F || c >= C || !puz.sol[r * C + c]) break;
        celdas.push(r * C + c);
      }
      return {
        r: s.r, c: s.c, dir: s.dir, d: s.d, celdas,
        antes: (s.r - dr) * C + (s.c - dc),
        palabra: celdas.map((i) => puz.sol[i]).join('')
      };
    });
    // numeración por orden de lectura de la casilla de definición (la horizontal antes que la vertical)
    slots.slice().sort((a, b) => (a.antes - b.antes) || (a.dir === 'h' ? -1 : 1) - (b.dir === 'h' ? -1 : 1))
      .forEach((s, k) => { s.n = k + 1; });
    const celdaSlots = new Array(F * C).fill(null);
    slots.forEach((s) => s.celdas.forEach((i) => {
      celdaSlots[i] = celdaSlots[i] || { h: null, v: null };
      celdaSlots[i][s.dir] = s;
    }));
    const pistas = new Map(); // casilla de definición -> slots que salen de ella
    slots.forEach((s) => {
      if (!pistas.has(s.antes)) pistas.set(s.antes, []);
      pistas.get(s.antes).push(s);
    });
    return { slots, celdaSlots, pistas };
  }

  /* ---------------------------------------------------------
     Guardado
     --------------------------------------------------------- */
  function validoGuardado(s) {
    if (!s || !TAMANOS[s.tam] || typeof s.sol !== 'string' || typeof s.usuario !== 'string' || !Array.isArray(s.slots)) return false;
    const { f: F, c: C } = TAMANOS[s.tam];
    if (s.sol.length !== F * C || s.usuario.length !== F * C) return false;
    if (!/^[A-ZÑ.]+$/.test(s.sol) || !/^[A-ZÑ.]+$/.test(s.usuario)) return false;
    for (let i = 0; i < s.sol.length; i++) if (s.sol[i] === '.' && s.usuario[i] !== '.') return false;
    if (!Number.isFinite(s.ms) || s.ms < 0 || !s.slots.length || s.slots.length > F * C) return false;
    return s.slots.every((q) => {
      if (!q || (q.dir !== 'h' && q.dir !== 'v') || typeof q.d !== 'string' || q.d.length > 200) return false;
      if (!Number.isInteger(q.r) || !Number.isInteger(q.c) || q.r < 0 || q.c < 0 || q.r >= F || q.c >= C) return false;
      const dr = q.dir === 'h' ? 0 : 1, dc = q.dir === 'h' ? 1 : 0;
      const pr = q.r - dr, pc = q.c - dc;
      if (pr < 0 || pc < 0 || s.sol[pr * C + pc] !== '.') return false;
      let largo = 0;
      while (q.r + dr * largo < F && q.c + dc * largo < C && s.sol[(q.r + dr * largo) * C + q.c + dc * largo] !== '.') largo++;
      return largo >= 2;
    });
  }

  /* ---------------------------------------------------------
     Interfaz
     --------------------------------------------------------- */
  function crear(contenedor) {
    let tam = 'chico';
    let F = 9, C = 9;
    let puz = null;
    let info = null;
    let usuario = [];
    let sel = { i: -1, dir: 'h' };
    let pistasUsadas = 0;
    let fase = 'listo'; // 'listo' | 'jugando' | 'ganado'
    let pausado = false;
    let celdasEl = [];
    let itemsEl = [];
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
      const t = TAMANOS[id];
      const b = el('button', { texto: t.nombre + '\n' + t.f + '×' + t.c, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesTam[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(tam));

    // después de tocar un botón con el mouse o el dedo, sacamos el foco para que Tab siga cambiando de palabra
    const soltarFoco = (b) => b.addEventListener('click', (ev) => { if (ev.detail > 0) b.blur(); });
    const mk = (texto, fn) => {
      const b = el('button', { clase: 'btn btn--chico', texto, attrs: { type: 'button' } });
      b.addEventListener('click', fn);
      soltarFoco(b);
      return b;
    };
    const btnRevisar = mk('Revisar', revisar);
    const btnBorrarErr = mk('Borrar errores', borrarErrores);
    const btnPista = mk('Pista (una letra)', pistaLetra);
    const btnPalabra = mk('Revelar palabra', pistaPalabra);
    const btnPausa = mk('Pausa', alternarPausa);

    const barra = el('div', { clase: 'cru__barra', attrs: { role: 'status', 'aria-live': 'polite' } });
    const tablero = el('div', { clase: 'cru__tablero', attrs: { role: 'grid', 'aria-label': 'Crucigrama autodefinido' } });
    const velo = el('div', { clase: 'jg__velo', attrs: { hidden: '' } },
      el('div', { texto: 'En pausa' }),
      (() => { const b = el('button', { clase: 'btn btn--primario', texto: 'Seguir', attrs: { type: 'button' } }); b.addEventListener('click', alternarPausa); return b; })());
    const marco = el('div', { clase: 'cru__marco' }, tablero, velo);

    const teclado = el('div', { clase: 'ah__teclado cru__teclado', attrs: { role: 'group', 'aria-label': 'Teclado' } });
    FILAS_TECLADO.forEach((fila, k) => {
      const f = el('div', { clase: 'ah__fila-teclas' });
      for (const l of fila) {
        const b = el('button', { clase: 'ah__tecla', texto: l, attrs: { type: 'button', 'data-l': l, 'aria-label': 'Letra ' + l } });
        b.addEventListener('click', () => escribir(l));
        soltarFoco(b);
        f.append(b);
      }
      if (k === 2) {
        const b = el('button', { clase: 'ah__tecla cru__borrar', texto: '⌫', attrs: { type: 'button', 'aria-label': 'Borrar letra' } });
        b.addEventListener('click', borrarLetra);
        soltarFoco(b);
        f.append(b);
      }
      teclado.append(f);
    });

    const listaH = el('ul', { clase: 'cru__lista', attrs: { 'aria-label': 'Definiciones horizontales' } });
    const listaV = el('ul', { clase: 'cru__lista', attrs: { 'aria-label': 'Definiciones verticales' } });
    const listas = el('div', { clase: 'cru__listas' },
      el('div', {}, el('h3', { texto: 'Horizontales →' }), listaH),
      el('div', {}, el('h3', { texto: 'Verticales ↓' }), listaV));

    const esDiario = MODO !== 'libre';
    if (MODO === 'practica') btnNuevo.textContent = 'Reiniciar';
    const raiz = el('div', { clase: 'jg jg--ancho cru' },
      esDiario ? global.Diario.cartel(MODO) : null,
      esDiario ? (MODO === 'practica' ? el('div', { clase: 'jg__fila' }, btnNuevo) : null) : el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Faltan' }), valFalta),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        el('div', { clase: 'jg__acciones cru__acciones' }, btnRevisar, btnBorrarErr, btnPausa)),
      barra,
      marco,
      MODO === 'diario' ? null : el('div', { clase: 'jg__acciones' }, btnPista, btnPalabra),
      teclado,
      listas,
      el('p', { clase: 'jg__ayuda', texto: 'En las casillas grises están el número de la definición y una flecha: dice si la palabra sigue hacia la derecha (→) o hacia abajo (↓). Tocá una casilla para elegirla y otra vez para cambiar de dirección; la definición aparece arriba. Con el teclado: letras, flechas, Borrar, Espacio para cambiar de dirección, y Tab (o Shift + Tab) para pasar a la definición siguiente (o a la anterior).' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function construir() {
      tablero.replaceChildren();
      tablero.style.setProperty('--f', String(F));
      tablero.style.setProperty('--c', String(C));
      celdasEl = [];
      for (let i = 0; i < F * C; i++) {
        let nodo;
        if (puz.sol[i]) {
          nodo = el('div', { clase: 'cru__celda letra', attrs: { role: 'gridcell', 'data-i': String(i) } },
            el('span', { clase: 'cru__letra' }));
        } else if (info.pistas.has(i)) {
          nodo = el('div', { clase: 'cru__celda pista', attrs: { 'data-i': String(i) } });
          const ss = info.pistas.get(i).slice().sort((a, b) => (a.dir === 'h' ? -1 : 1) - (b.dir === 'h' ? -1 : 1));
          ss.forEach((s) => {
            nodo.append(el('div', { clase: 'cru__def ' + (ss.length > 1 ? 'doble' : 'simple'), attrs: { title: s.d } },
              el('span', { clase: 'cru__n', texto: String(s.n) }),
              el('span', { clase: 'cru__flecha', texto: s.dir === 'h' ? '→' : '↓', attrs: { 'aria-hidden': 'true' } })));
          });
        } else {
          nodo = el('div', { clase: 'cru__celda bloque', attrs: { 'aria-hidden': 'true' } });
        }
        celdasEl.push(nodo);
        tablero.append(nodo);
      }
      construirListas();
      ORDEN.forEach((id) => botonesTam[id].setAttribute('aria-pressed', String(id === tam)));
      pintar();
    }

    function construirListas() {
      listaH.replaceChildren();
      listaV.replaceChildren();
      itemsEl = [];
      info.slots.slice().sort((a, b) => a.n - b.n).forEach((s) => {
        const b = el('button', { clase: 'cru__item', attrs: { type: 'button' } },
          el('span', { clase: 'cru__itemn', texto: s.n + '.' }),
          el('span', { texto: ' ' + s.d + ' (' + s.celdas.length + ')' }));
        b.addEventListener('click', (ev) => { seleccionar(s.celdas.find((i) => !usuario[i]) ?? s.celdas[0], s.dir); if (ev.detail > 0) b.blur(); });
        const li = el('li', {}, b);
        itemsEl.push({ slot: s, b });
        (s.dir === 'h' ? listaH : listaV).append(li);
      });
    }

    function slotActivo() {
      if (sel.i < 0) return null;
      const s = info.celdaSlots[sel.i];
      return s ? (s[sel.dir] || s.h || s.v) : null;
    }

    function pintar() {
      const act = slotActivo();
      const enAct = new Set(act ? act.celdas : []);
      for (let i = 0; i < F * C; i++) {
        if (!puz.sol[i]) continue;
        const c = celdasEl[i];
        c.querySelector('.cru__letra').textContent = usuario[i] || '';
        c.classList.toggle('sel', i === sel.i);
        c.classList.toggle('activa', enAct.has(i) && i !== sel.i);
      }
      itemsEl.forEach(({ slot, b }) => {
        b.classList.toggle('activo', slot === act);
        b.classList.toggle('hecho', slot.celdas.every((i) => usuario[i]));
      });
      if (act) {
        barra.textContent = (act.dir === 'h' ? '→ ' : '↓ ') + act.n + '. ' + act.d + ' (' + act.celdas.length + ' letras)';
      } else {
        barra.textContent = 'Tocá una casilla para empezar.';
      }
      valFalta.textContent = String(puz.sol.filter((l, i) => l && usuario[i] !== l).length);
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase === 'ganado' || !puz) return null;
      return {
        tam,
        sol: puz.sol.map((l) => l || '.').join(''),
        usuario: puz.sol.map((l, i) => (l ? (usuario[i] || '.') : '.')).join(''),
        slots: puz.slots.map((s) => ({ r: s.r, c: s.c, dir: s.dir, d: s.d })),
        pistas: pistasUsadas,
        ms: Math.round(crono.transcurrido),
        fecha: MODO === 'libre' ? undefined : global.Diario.hoy()
      };
    }
    function guardarYa() {
      if (fase !== 'jugando') return;
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, () => (fase === 'jugando' ? serializar() : null), { cada: 5000 });

    /* --- Partidas --- */
    function empezar(p, ms, usuarioInicial, pistas, jugando) {
      puz = p;
      F = p.f; C = p.c;
      info = preparar(p);
      usuario = usuarioInicial || new Array(F * C).fill('');
      pistasUsadas = pistas || 0;
      fase = jugando ? 'jugando' : 'listo';
      pausado = false;
      velo.hidden = true;
      btnPausa.textContent = 'Pausa';
      tablero.classList.remove('resuelto');
      crono.reiniciar(ms || 0);
      if (jugando) crono.iniciar();
      // la primera casilla del primer horizontal
      const primero = info.slots.slice().sort((a, b) => a.n - b.n)[0];
      sel = { i: primero.celdas[0], dir: primero.dir };
      construir();
    }

    function nueva(id) {
      tam = id;
      Guardado.borrar(ID);
      if (MODO !== 'libre') {
        const puzDia = global.Diario.conSemilla(global.Diario.semilla(BASE), () => {
          soloDificiles = true;
          try { return generarCrucigrama('diario'); } finally { soloDificiles = false; }
        });
        empezar(puzDia, 0, null, 0, false);
        return;
      }
      Almacen.escribir('crucigrama:tamano', id);
      empezar(generarCrucigrama(id), 0, null, 0, false);
    }

    function pedirNueva(id) {
      const enCurso = fase === 'jugando' && usuario.some(Boolean);
      if (enCurso && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function cargar(s) {
      tam = s.tam;
      const F2 = TAMANOS[tam].f, C2 = TAMANOS[tam].c;
      const p = { f: F2, c: C2, sol: Array.from(s.sol, (ch) => (ch === '.' ? '' : ch)), slots: s.slots };
      empezar(p, s.ms, Array.from(s.usuario, (ch) => (ch === '.' ? '' : ch)), Number(s.pistas) || 0, true);
    }

    /* --- Selección y escritura --- */
    function seleccionar(i, dir) {
      if (fase === 'ganado' || pausado) return;
      sel = { i, dir };
      pintar();
    }

    function arrancar() {
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
    }

    function cambio() {
      pintar();
      if (fase === 'jugando' && puz.sol.every((l, i) => !l || usuario[i] === l)) ganar();
      else guardarYa();
    }

    function escribir(l) {
      if (fase === 'ganado' || pausado || sel.i < 0) return;
      arrancar();
      usuario[sel.i] = l;
      const act = slotActivo();
      if (act) {
        const k = act.celdas.indexOf(sel.i);
        if (k >= 0 && k < act.celdas.length - 1) sel = { i: act.celdas[k + 1], dir: act.dir };
      }
      cambio();
    }

    function borrarLetra() {
      if (fase === 'ganado' || pausado || sel.i < 0) return;
      const act = slotActivo();
      if (usuario[sel.i]) usuario[sel.i] = '';
      else if (act) {
        const k = act.celdas.indexOf(sel.i);
        if (k > 0) { sel = { i: act.celdas[k - 1], dir: act.dir }; usuario[sel.i] = ''; }
      }
      cambio();
    }

    // Tab / Shift + Tab: pasar a la definición siguiente o anterior
    function cambiarPalabra(paso) {
      if (fase === 'ganado' || pausado) return;
      const orden = info.slots.slice().sort((a, b) => a.n - b.n);
      const act = slotActivo();
      const k = act ? orden.indexOf(act) : -1;
      const sig = orden[(k + paso + orden.length) % orden.length];
      sel = { i: sig.celdas.find((i) => !usuario[i]) ?? sig.celdas[0], dir: sig.dir };
      pintar();
    }

    function alternarDir() {
      const s = info.celdaSlots[sel.i];
      if (s && s.h && s.v) { sel = { i: sel.i, dir: sel.dir === 'h' ? 'v' : 'h' }; pintar(); }
    }

    function mover(df, dc) {
      if (sel.i < 0) return;
      let f = Math.floor(sel.i / C) + df, c = (sel.i % C) + dc;
      while (f >= 0 && f < F && c >= 0 && c < C) {
        const i = f * C + c;
        if (puz.sol[i]) {
          const s = info.celdaSlots[i];
          const dir = df !== 0 ? 'v' : 'h';
          sel = { i, dir: s && s[dir] ? dir : (s && s.h ? 'h' : 'v') };
          pintar();
          return;
        }
        f += df; c += dc;
      }
    }

    tablero.addEventListener('click', (ev) => {
      if (fase === 'ganado' || pausado) return;
      const nodo = ev.target.closest('.cru__celda');
      if (!nodo || nodo.dataset.i === undefined) return;
      const i = Number(nodo.dataset.i);
      if (puz.sol[i]) {
        const s = info.celdaSlots[i];
        let dir = sel.dir;
        if (sel.i === i && s.h && s.v) dir = dir === 'h' ? 'v' : 'h';
        else if (!s[dir]) dir = dir === 'h' ? 'v' : 'h';
        seleccionar(i, dir);
      } else if (info.pistas.has(i)) {
        const ss = info.pistas.get(i);
        const s = ss.find((q) => q.dir === sel.dir && q.antes === i) || ss[0];
        seleccionar(s.celdas.find((k) => !usuario[k]) ?? s.celdas[0], s.dir);
      }
    });

    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      const k = ev.key;
      if (k === 'Tab') {
        // dentro de un botón o menú, Tab sigue funcionando como siempre (así se puede llegar a los botones con el teclado)
        if (t && /^(BUTTON|SELECT|A)$/.test(t.tagName) && ev.detail !== -1) return;
        ev.preventDefault();
        cambiarPalabra(ev.shiftKey ? -1 : 1);
        return;
      }
      if (k === 'ArrowUp') mover(-1, 0);
      else if (k === 'ArrowDown') mover(1, 0);
      else if (k === 'ArrowLeft') mover(0, -1);
      else if (k === 'ArrowRight') mover(0, 1);
      else if (k === 'Backspace' || k === 'Delete') borrarLetra();
      else if (k === ' ' && !(t && t.tagName === 'BUTTON')) alternarDir();
      else if (k.length === 1 && /[a-zñáéíóúü]/i.test(k)) {
        const l = global.PalabrasCrucigrama.limpiar(k);
        if (l.length !== 1) return;
        escribir(l);
      } else return;
      if (!(t && t.tagName === 'BUTTON' && (k === ' ' || k === 'Enter'))) ev.preventDefault();
    }
    document.addEventListener('keydown', alTecla);

    /* --- Ayudas --- */
    let marcadas = [];
    function limpiarMarcas() {
      marcadas.forEach((i) => celdasEl[i] && celdasEl[i].classList.remove('error'));
      marcadas = [];
    }
    function malas() {
      const out = [];
      puz.sol.forEach((l, i) => { if (l && usuario[i] && usuario[i] !== l) out.push(i); });
      return out;
    }

    function revisar() {
      if (fase === 'ganado' || pausado) return;
      limpiarMarcas();
      const m = malas();
      if (!m.length) {
        notificar(usuario.some(Boolean) ? 'Hasta ahora no hay errores.' : 'Todavía no escribiste nada.');
        return;
      }
      marcadas = m;
      m.forEach((i) => celdasEl[i].classList.add('error'));
      notificar(m.length === 1 ? 'Hay 1 letra mal.' : 'Hay ' + m.length + ' letras mal.');
      despues(limpiarMarcas, 2800);
    }

    function borrarErrores() {
      if (fase === 'ganado' || pausado) return;
      limpiarMarcas();
      const m = malas();
      if (!m.length) { notificar('No encontré errores para borrar.'); return; }
      m.forEach((i) => { usuario[i] = ''; });
      notificar(m.length === 1 ? 'Borré 1 letra incorrecta.' : 'Borré ' + m.length + ' letras incorrectas.');
      cambio();
    }

    function pistaLetra() {
      if (fase === 'ganado' || pausado || sel.i < 0) return;
      if (usuario[sel.i] === puz.sol[sel.i]) { notificar('Esa letra ya está bien. Elegí otra casilla.'); return; }
      arrancar();
      usuario[sel.i] = puz.sol[sel.i];
      pistasUsadas++;
      notificar('Te puse la letra. Con pistas no entra en las mejores marcas.');
      cambio();
    }

    function pistaPalabra() {
      if (fase === 'ganado' || pausado) return;
      const act = slotActivo();
      if (!act) return;
      arrancar();
      act.celdas.forEach((i) => { usuario[i] = puz.sol[i]; });
      pistasUsadas++;
      notificar('Te mostré la palabra. Con pistas no entra en las mejores marcas.');
      cambio();
    }

    function alternarPausa() {
      if (fase !== 'jugando') return;
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

    function ganar() {
      fase = 'ganado';
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      limpiarMarcas();
      tablero.classList.add('resuelto');
      let detalle;
      if (MODO === 'diario') {
        const rd = global.Diario.registrar(BASE, ms);
        celebrar({
          titulo: 'Desafío del día resuelto',
          mensaje: 'Crucigrama del día en ' + Cronometro.formatear(ms) + '.',
          detalle: rd.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + rd.racha + (rd.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.',
          botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
        });
        return;
      }
      if (MODO === 'practica') {
        celebrar({ titulo: 'Crucigrama completo', mensaje: 'Práctica en ' + Cronometro.formatear(ms) + '. No suma al ranking.', botones: [{ texto: 'Cerrar', primario: true }] });
        return;
      }
      if (pistasUsadas > 0) {
        detalle = 'Usaste ' + pistasUsadas + (pistasUsadas === 1 ? ' pista' : ' pistas') + ': esta vez no entra en las mejores marcas.';
      } else {
        const r = Records.agregar(ID, tam, ms, { modo: 'menor' });
        if (r.esRecord) detalle = 'Nueva mejor marca en el crucigrama ' + TAMANOS[tam].nombre.toLowerCase();
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca en este tamaño es ' + Cronometro.formatear(Records.mejor(ID, tam)) + '.';
      }
      celebrar({
        titulo: 'Crucigrama completo',
        mensaje: 'Crucigrama ' + TAMANOS[tam].nombre.toLowerCase() + ' en ' + Cronometro.formatear(ms) + '.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(tam) },
          { texto: 'Cerrar' }
        ]
      });
    }

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    const esDeHoy = MODO === 'libre' || (guardado && guardado.fecha === global.Diario.hoy());
    if (validoGuardado(guardado) && esDeHoy) {
      cargar(guardado);
    } else if (MODO !== 'libre') {
      nueva('diario');
    } else {
      const ultimo = Almacen.leer('crucigrama:tamano', 'chico');
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
