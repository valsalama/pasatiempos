/* loop-line.js · Loop Line
   Unir puntos vecinos para dibujar una sola línea cerrada, sin cruces ni ramas.
   Cada número dice cuántos lados de su casilla forman parte de la línea. */
(function (global) {
  'use strict';

  const ID = 'loop-line';
  const NIVELES = {
    facil: { nombre: 'Fácil', f: 5, c: 5, pistas: 0.8 },
    medio: { nombre: 'Medio', f: 7, c: 7, pistas: 0.62 },
    dificil: { nombre: 'Difícil', f: 9, c: 9, pistas: 0.5 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];
  const S = 40; // lado de casilla en el dibujo
  const M = 16; // margen
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- Lógica pura ----------
     Horizontales H[r][c]: r de 0 a F, c de 0 a C-1 (arriba de la casilla (r, c)).
     Verticales   V[r][c]: r de 0 a F-1, c de 0 a C (a la izquierda de la casilla (r, c)). Se guardan planos. */
  const hI = (C, r, c) => r * C + c;
  const vI = (C, r, c) => r * (C + 1) + c;

  function regionValida(F, C, dentro) {
    const en = (r, c) => r >= 0 && c >= 0 && r < F && c < C && dentro[r * C + c];
    // Sin cortes en diagonal
    for (let r = 0; r <= F; r++) for (let c = 0; c <= C; c++) {
      const a = en(r - 1, c - 1); const b = en(r - 1, c); const d = en(r, c - 1); const e = en(r, c);
      if (a === e && b === d && a !== b) return false;
    }
    // Sin agujeros: todo lo de afuera debe estar conectado con el borde
    const fuera = new Set(); const cola = [];
    const meter = (r, c) => { const k = r * (C + 2) + c; if (!fuera.has(k)) { fuera.add(k); cola.push([r, c]); } };
    meter(-1, -1);
    for (let q = 0; q < cola.length; q++) {
      const [r, c] = cola[q];
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
        const nr = r + dr; const nc = c + dc;
        if (nr < -1 || nc < -1 || nr > F || nc > C) return;
        if (en(nr, nc)) return;
        meter(nr, nc);
      });
    }
    let libres = 0;
    for (let r = 0; r < F; r++) for (let c = 0; c < C; c++) if (!en(r, c)) libres++;
    let alcanzadas = 0;
    for (let r = 0; r < F; r++) for (let c = 0; c < C; c++) if (!en(r, c) && fuera.has(r * (C + 2) + c)) alcanzadas++;
    return libres === alcanzadas;
  }

  /* Devuelve { H, V, clues } con la línea solución (1 = lado de la línea) y el número de cada casilla */
  function generar(nivel, rnd = Math.random) {
    const cfg = NIVELES[nivel]; const F = cfg.f; const C = cfg.c;
    const meta = Math.round(F * C * 0.5);
    for (let intento = 0; intento < 300; intento++) {
      const dentro = new Array(F * C).fill(false);
      const r0 = Math.floor(rnd() * F); const c0 = Math.floor(rnd() * C);
      dentro[r0 * C + c0] = true;
      let n = 1; let fallos = 0;
      while (n < meta && fallos < 400) {
        const celdas = [];
        for (let r = 0; r < F; r++) for (let c = 0; c < C; c++) if (dentro[r * C + c]) celdas.push([r, c]);
        const [r, c] = celdas[Math.floor(rnd() * celdas.length)];
        const [dr, dc] = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(rnd() * 4)];
        const nr = r + dr; const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= F || nc >= C || dentro[nr * C + nc]) { fallos++; continue; }
        dentro[nr * C + nc] = true;
        if (regionValida(F, C, dentro)) { n++; fallos = 0; } else { dentro[nr * C + nc] = false; fallos++; }
      }
      if (n < Math.round(F * C * 0.4)) continue;
      const en = (r, c) => r >= 0 && c >= 0 && r < F && c < C && dentro[r * C + c];
      const H = new Array((F + 1) * C).fill(0); const V = new Array(F * (C + 1)).fill(0);
      for (let r = 0; r <= F; r++) for (let c = 0; c < C; c++) if (en(r - 1, c) !== en(r, c)) H[hI(C, r, c)] = 1;
      for (let r = 0; r < F; r++) for (let c = 0; c <= C; c++) if (en(r, c - 1) !== en(r, c)) V[vI(C, r, c)] = 1;
      const numeros = contar(F, C, H, V);
      const visibles = numeros.map(() => rnd() < cfg.pistas);
      // Siempre se muestra al menos un número en cada fila de casillas, para no dejar zonas vacías
      for (let r = 0; r < F; r++) {
        let hay = false; for (let c = 0; c < C; c++) if (visibles[r * C + c]) hay = true;
        if (!hay) visibles[r * C + Math.floor(rnd() * C)] = true;
      }
      return { F, C, H, V, numeros, visibles };
    }
    return null;
  }

  /* Cuántos lados con línea tiene cada casilla */
  function contar(F, C, H, V) {
    const res = [];
    for (let r = 0; r < F; r++) for (let c = 0; c < C; c++) {
      res.push((H[hI(C, r, c)] === 1 ? 1 : 0) + (H[hI(C, r + 1, c)] === 1 ? 1 : 0) + (V[vI(C, r, c)] === 1 ? 1 : 0) + (V[vI(C, r, c + 1)] === 1 ? 1 : 0));
    }
    return res;
  }
  /* Grado de cada punto (r de 0 a F, c de 0 a C) */
  function grados(F, C, H, V) {
    const g = new Array((F + 1) * (C + 1)).fill(0);
    for (let r = 0; r <= F; r++) for (let c = 0; c < C; c++) if (H[hI(C, r, c)] === 1) { g[r * (C + 1) + c]++; g[r * (C + 1) + c + 1]++; }
    for (let r = 0; r < F; r++) for (let c = 0; c <= C; c++) if (V[vI(C, r, c)] === 1) { g[r * (C + 1) + c]++; g[(r + 1) * (C + 1) + c]++; }
    return g;
  }
  /* ¿Las líneas forman un único lazo cerrado? */
  function esUnLazo(F, C, H, V) {
    const g = grados(F, C, H, V);
    if (!g.some((x) => x > 0)) return false;
    if (g.some((x) => x !== 0 && x !== 2)) return false;
    const ady = new Map();
    const unir = (a, b) => { if (!ady.has(a)) ady.set(a, []); if (!ady.has(b)) ady.set(b, []); ady.get(a).push(b); ady.get(b).push(a); };
    for (let r = 0; r <= F; r++) for (let c = 0; c < C; c++) if (H[hI(C, r, c)] === 1) unir(r * (C + 1) + c, r * (C + 1) + c + 1);
    for (let r = 0; r < F; r++) for (let c = 0; c <= C; c++) if (V[vI(C, r, c)] === 1) unir(r * (C + 1) + c, (r + 1) * (C + 1) + c);
    const inicio = ady.keys().next().value;
    const visto = new Set([inicio]); const cola = [inicio];
    for (let q = 0; q < cola.length; q++) ady.get(cola[q]).forEach((x) => { if (!visto.has(x)) { visto.add(x); cola.push(x); } });
    return visto.size === ady.size;
  }
  function resuelto(F, C, H, V, numeros, visibles) {
    const k = contar(F, C, H, V);
    for (let i = 0; i < k.length; i++) if (visibles[i] && k[i] !== numeros[i]) return false;
    return esUnLazo(F, C, H, V);
  }

  /* ---------- Interfaz ---------- */
  function crear(contenedor) {
    const { el, notificar } = global.Pasatiempos;
    let F = 5; let C = 5; let sol = null; let numeros = []; let visibles = [];
    let H = []; let V = []; let hist = [];
    let nodo = {};

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'll__svg');
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', 'Tablero de Loop Line');
    const aviso = el('p', { clase: 'll__aviso', attrs: { role: 'status', 'aria-live': 'polite' } });

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'll',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'tiempo',
      etiquetaNivel: 'Dificultad',
      acciones: [
        { id: 'deshacer', texto: 'Deshacer', alClick: () => deshacer() },
        { id: 'pista', texto: 'Pista', alClick: () => pista() }
      ],
      cuerpo: [el('div', { clase: 'll__marco' }, svg), aviso],
      hayAvance: () => hist.length > 0,
      nueva(nivel) {
        let g = null;
        for (let k = 0; k < 6 && !g; k++) g = generar(nivel);
        poner(g.F, g.C, g.H, g.V, g.numeros, g.visibles, new Array(g.H.length).fill(0), new Array(g.V.length).fill(0), []);
      },
      cargar(nivel, ex) { poner(NIVELES[nivel].f, NIVELES[nivel].c, ex.solH, ex.solV, ex.numeros, ex.visibles, ex.H, ex.V, ex.hist); },
      serializar() { return { solH: sol.H, solV: sol.V, numeros, visibles, H: H.slice(), V: V.slice(), hist: hist.slice(-200) }; },
      validar(ex, nivel) {
        const cfg = NIVELES[nivel]; const f = cfg.f; const c = cfg.c;
        const nH = (f + 1) * c; const nV = f * (c + 1);
        const arr = (a, n, max) => Array.isArray(a) && a.length === n && a.every((x) => Number.isInteger(x) && x >= 0 && x <= max);
        if (!arr(ex.solH, nH, 1) || !arr(ex.solV, nV, 1) || !arr(ex.H, nH, 2) || !arr(ex.V, nV, 2)) return false;
        if (!arr(ex.numeros, f * c, 4) || !Array.isArray(ex.visibles) || ex.visibles.length !== f * c || !ex.visibles.every((x) => typeof x === 'boolean')) return false;
        if (!esUnLazo(f, c, ex.solH, ex.solV)) return false;
        const k = contar(f, c, ex.solH, ex.solV);
        if (!k.every((x, i) => x === ex.numeros[i])) return false;
        if (!Array.isArray(ex.hist) || !ex.hist.every((h) => Array.isArray(h) && h.length === 3 && (h[0] === 'h' || h[0] === 'v') && Number.isInteger(h[1]) && Number.isInteger(h[2]) && h[1] >= 0 && h[1] < (h[0] === 'h' ? nH : nV) && h[2] >= 0 && h[2] <= 2)) return false;
        return !resuelto(f, c, ex.H.map((x) => (x === 1 ? 1 : 0)), ex.V.map((x) => (x === 1 ? 1 : 0)), ex.numeros, ex.visibles);
      }
    });

    function linea(x1, y1, x2, y2, clase) {
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      l.setAttribute('class', clase);
      return l;
    }

    function poner(f, c, solH, solV, nums, vis, h, v, hi) {
      F = f; C = c; sol = { H: solH.slice(), V: solV.slice() };
      numeros = nums.slice(); visibles = vis.slice(); H = h.slice(); V = v.slice(); hist = hi.map((x) => x.slice());
      svg.replaceChildren();
      nodo = { h: [], v: [], num: [], punto: [] };
      const ancho = C * S + 2 * M; const alto = F * S + 2 * M;
      svg.setAttribute('viewBox', '0 0 ' + ancho + ' ' + alto);
      // Números
      for (let r = 0; r < F; r++) for (let q = 0; q < C; q++) {
        const t = document.createElementNS(NS, 'text');
        t.setAttribute('x', M + q * S + S / 2); t.setAttribute('y', M + r * S + S / 2);
        t.setAttribute('class', 'll__num'); t.setAttribute('text-anchor', 'middle'); t.setAttribute('dominant-baseline', 'central');
        t.textContent = visibles[r * C + q] ? String(numeros[r * C + q]) : '';
        svg.append(t); nodo.num.push(t);
      }
      // Lados: línea visible + zona para tocar
      const lado = (clase, tipo, idx, x1, y1, x2, y2, nombre) => {
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'll__lado'); g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0');
        g.setAttribute('aria-label', nombre);
        const vis2 = linea(x1, y1, x2, y2, 'll__trazo');
        const cruz = document.createElementNS(NS, 'path');
        const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2;
        cruz.setAttribute('d', 'M' + (mx - 5) + ' ' + (my - 5) + 'L' + (mx + 5) + ' ' + (my + 5) + 'M' + (mx + 5) + ' ' + (my - 5) + 'L' + (mx - 5) + ' ' + (my + 5));
        cruz.setAttribute('class', 'll__cruz');
        const zona = document.createElementNS(NS, 'rect');
        const horiz = y1 === y2;
        zona.setAttribute('x', horiz ? x1 + 6 : x1 - 10); zona.setAttribute('y', horiz ? y1 - 10 : y1 + 6);
        zona.setAttribute('width', horiz ? S - 12 : 20); zona.setAttribute('height', horiz ? 20 : S - 12);
        zona.setAttribute('class', 'll__zona');
        g.append(vis2, cruz, zona);
        g.addEventListener('click', () => ciclo(tipo, idx));
        g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ciclo(tipo, idx); } });
        svg.append(g);
        nodo[tipo][idx] = g;
      };
      for (let r = 0; r <= F; r++) for (let q = 0; q < C; q++) lado('h', 'h', hI(C, r, q), M + q * S, M + r * S, M + (q + 1) * S, M + r * S, 'Lado horizontal, fila de puntos ' + (r + 1) + ', columna ' + (q + 1));
      for (let r = 0; r < F; r++) for (let q = 0; q <= C; q++) lado('v', 'v', vI(C, r, q), M + q * S, M + r * S, M + q * S, M + (r + 1) * S, 'Lado vertical, fila ' + (r + 1) + ', columna de puntos ' + (q + 1));
      // Puntos arriba de todo
      for (let r = 0; r <= F; r++) for (let q = 0; q <= C; q++) {
        const p = document.createElementNS(NS, 'circle');
        p.setAttribute('cx', M + q * S); p.setAttribute('cy', M + r * S); p.setAttribute('r', 3.5); p.setAttribute('class', 'll__punto');
        svg.append(p); nodo.punto.push(p);
      }
      aviso.textContent = '';
      pintar();
    }

    function pintar() {
      const solo1 = (a) => a.map((x) => (x === 1 ? 1 : 0));
      const h1 = solo1(H); const v1 = solo1(V);
      const k = contar(F, C, h1, v1);
      for (let i = 0; i < H.length; i++) { nodo.h[i].setAttribute('data-e', String(H[i])); }
      for (let i = 0; i < V.length; i++) { nodo.v[i].setAttribute('data-e', String(V[i])); }
      for (let i = 0; i < k.length; i++) {
        if (!visibles[i]) continue;
        nodo.num[i].setAttribute('class', 'll__num' + (k[i] === numeros[i] && numeros[i] > 0 ? ' ll__num--ok' : k[i] > numeros[i] ? ' ll__num--mal' : ''));
      }
      const g = grados(F, C, h1, v1);
      g.forEach((x, i) => nodo.punto[i].setAttribute('class', 'll__punto' + (x > 2 ? ' ll__punto--mal' : x > 0 ? ' ll__punto--uso' : '')));
      const fin = base.fase() === 'ganado';
      if (base.accion('deshacer')) base.accion('deshacer').disabled = fin || !hist.length;
      if (base.accion('pista')) base.accion('pista').disabled = fin;
      if (!fin && resuelto(F, C, h1, v1, numeros, visibles)) {
        base.ganar({ titulo: 'Lazo cerrado', mensaje: 'Cerraste la línea y todos los números coinciden.' });
      }
    }

    function poner1(tipo, idx, val, registrar) {
      const a = tipo === 'h' ? H : V;
      if (registrar) hist.push([tipo, idx, a[idx]]);
      a[idx] = val;
    }

    function ciclo(tipo, idx) {
      if (base.fase() === 'ganado') return;
      base.empezar();
      const a = tipo === 'h' ? H : V;
      poner1(tipo, idx, (a[idx] + 1) % 3, true);
      base.sumarMov();
      pintar();
    }

    function deshacer() {
      if (!hist.length || base.fase() === 'ganado') return;
      const [tipo, idx, val] = hist.pop();
      (tipo === 'h' ? H : V)[idx] = val;
      pintar();
    }

    function pista() {
      if (base.fase() === 'ganado') return;
      const cand = [];
      for (let i = 0; i < H.length; i++) if ((H[i] === 1) !== (sol.H[i] === 1)) cand.push(['h', i, sol.H[i]]);
      for (let i = 0; i < V.length; i++) if ((V[i] === 1) !== (sol.V[i] === 1)) cand.push(['v', i, sol.V[i]]);
      if (!cand.length) { aviso.textContent = 'Todo coincide con la solución, falta cerrar el lazo.'; return; }
      const [tipo, idx, val] = cand[Math.floor(Math.random() * cand.length)];
      base.empezar();
      base.sumarPista();
      poner1(tipo, idx, val === 1 ? 1 : 0, true);
      pintar();
      notificar('Con pista, esta partida no suma a tus mejores marcas.');
    }

    base.arrancar();
    return {
      pruebas: { ciclo, pista, deshacer, sol: () => ({ H: sol.H.slice(), V: sol.V.slice() }), dims: () => ({ F, C }), estado: () => ({ H: H.slice(), V: V.slice() }) },
      destruir() { base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.LoopLine = { pruebas: () => (instancia ? instancia.pruebas : null), generar, contar, grados, esUnLazo, resuelto, hI, vI };
})(window);
