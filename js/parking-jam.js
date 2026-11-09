/* parking-jam.js · Parking Jam
   Sacá el auto de color por la salida de la derecha deslizando los demás autos.
   Cada auto solo se mueve para adelante y para atrás, en la dirección en que está estacionado.
   Mover varias veces seguidas el mismo auto cuenta como un solo movimiento. */
(function (global) {
  'use strict';

  const ID = 'parking-jam';
  const N = 6;
  const FILA_SALIDA = 2;
  const NIVELES = {
    facil: { nombre: 'Fácil', autos: 7, min: 3, max: 7 },
    medio: { nombre: 'Medio', autos: 10, min: 8, max: 12 },
    dificil: { nombre: 'Difícil', autos: 12, min: 12, max: 99 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];

  /* ---------- Lógica pura ----------
     autos: [{ h: bool, len, f, c }]  (f, c = fila y columna de la punta de arriba o de la izquierda)
     El auto 0 es el de color y siempre es horizontal en la fila de salida.
     pos: arreglo con la posición móvil de cada auto (columna si es horizontal, fila si es vertical). */
  const posIni = (autos) => autos.map((a) => (a.h ? a.c : a.f));

  function ocupacion(autos, pos, salvo = -1) {
    const m = new Array(N * N).fill(-1);
    autos.forEach((a, i) => {
      if (i === salvo) return;
      for (let k = 0; k < a.len; k++) {
        const f = a.h ? a.f : pos[i] + k;
        const c = a.h ? pos[i] + k : a.c;
        m[f * N + c] = i;
      }
    });
    return m;
  }
  /* Rango de posiciones posibles del auto i */
  function rango(autos, pos, i) {
    const m = ocupacion(autos, pos, i);
    const a = autos[i];
    const p = pos[i];
    const libre = (q) => (a.h ? m[a.f * N + q] : m[q * N + a.c]) === -1;
    let lo = p; let hi = p;
    while (lo > 0 && libre(lo - 1)) lo--;
    while (hi + a.len < N && libre(hi + a.len)) hi++;
    return [lo, hi];
  }
  const llego = (autos, pos) => pos[0] + autos[0].len === N;

  /* BFS con movimientos de cualquier largo (cuenta como uno). Devuelve lista de [auto, nuevaPos] o null. */
  function resolver(autos, pos, limite = 120000) {
    const clave = (p) => p.join('');
    const padre = new Map([[clave(pos), null]]);
    let nivel = [pos.slice()];
    const reconstruir = (k) => {
      const camino = [];
      while (padre.get(k)) { const e = padre.get(k); camino.unshift([e.auto, e.a]); k = e.de; }
      return camino;
    };
    if (llego(autos, pos)) return [];
    let visitados = 1;
    while (nivel.length) {
      const sig = [];
      for (const p of nivel) {
        const kp = clave(p);
        for (let i = 0; i < autos.length; i++) {
          const [lo, hi] = rango(autos, p, i);
          for (let q = lo; q <= hi; q++) {
            if (q === p[i]) continue;
            const np = p.slice(); np[i] = q;
            const k = clave(np);
            if (padre.has(k)) continue;
            padre.set(k, { de: kp, auto: i, a: q });
            if (llego(autos, np)) return reconstruir(k);
            sig.push(np);
            if (++visitados > limite) return null;
          }
        }
      }
      nivel = sig;
    }
    return null;
  }

  function colocarAlAzar(cantidad, rnd) {
    const autos = [{ h: true, len: 2, f: FILA_SALIDA, c: Math.floor(rnd() * 3) }];
    const m = new Array(N * N).fill(false);
    for (let k = 0; k < 2; k++) m[FILA_SALIDA * N + autos[0].c + k] = true;
    let intentos = 0;
    while (autos.length < cantidad && intentos++ < 200) {
      const h = rnd() < 0.5;
      const len = rnd() < 0.2 ? 3 : 2;
      const f = Math.floor(rnd() * (h ? N : N - len + 1));
      const c = Math.floor(rnd() * (h ? N - len + 1 : N));
      let ok = true;
      for (let k = 0; k < len; k++) if (m[(h ? f : f + k) * N + (h ? c + k : c)]) ok = false;
      // No dejar un auto horizontal largo en la fila de salida (taparía del todo) ni autos que no se pueden mover nunca
      if (ok && h && f === FILA_SALIDA) ok = false;
      if (!ok) continue;
      for (let k = 0; k < len; k++) m[(h ? f : f + k) * N + (h ? c + k : c)] = true;
      autos.push({ h, len, f, c });
    }
    return autos;
  }

  /* Cambia de lugar un auto al azar; devuelve la nueva lista o null si no hubo cambio posible */
  function mutar(autos, rnd) {
    const i = 1 + Math.floor(rnd() * (autos.length - 1));
    const resto = autos.filter((_, k) => k !== i);
    const m = new Array(N * N).fill(false);
    resto.forEach((a) => { for (let k = 0; k < a.len; k++) m[(a.h ? a.f : a.f + k) * N + (a.h ? a.c + k : a.c)] = true; });
    for (let t = 0; t < 30; t++) {
      const h = rnd() < 0.5; const len = rnd() < 0.25 ? 3 : 2;
      const f = Math.floor(rnd() * (h ? N : N - len + 1)); const c = Math.floor(rnd() * (h ? N - len + 1 : N));
      if (h && f === FILA_SALIDA) continue;
      let ok = true;
      for (let k = 0; k < len; k++) if (m[(h ? f : f + k) * N + (h ? c + k : c)]) ok = false;
      if (!ok) continue;
      const res = autos.map((a) => ({ ...a }));
      res[i] = { h, len, f, c };
      return res;
    }
    return null;
  }

  function generar(nivel, rnd = Math.random, ms = 1500) {
    const cfg = NIVELES[nivel];
    const t0 = Date.now();
    let mejor = null; let mejorDist = Infinity;
    const dist = (n) => (n < cfg.min ? cfg.min - n : n > cfg.max ? n - cfg.max : 0);
    while (Date.now() - t0 < ms) {
      let autos = colocarAlAzar(cfg.autos, rnd);
      if (autos.length < cfg.autos - 1) continue;
      let sol = resolver(autos, posIni(autos), 60000);
      if (!sol) continue;
      let n = sol.length;
      // Subir la dificultad moviendo autos de a uno mientras la solución se alarga
      for (let paso = 0; paso < 60 && dist(n) > 0 && n < cfg.min && Date.now() - t0 < ms; paso++) {
        const otros = mutar(autos, rnd);
        if (!otros) continue;
        const s2 = resolver(otros, posIni(otros), 60000);
        if (s2 && s2.length >= n) { autos = otros; n = s2.length; }
      }
      if (dist(n) === 0) return { autos, minimo: n };
      if (dist(n) < mejorDist) { mejorDist = dist(n); mejor = { autos, minimo: n }; }
    }
    return mejor || { autos: [{ h: true, len: 2, f: FILA_SALIDA, c: 0 }, { h: false, len: 2, f: 1, c: 3 }, { h: false, len: 3, f: 3, c: 2 }], minimo: 3 };
  }

  /* ---------- Dibujo de los autos (vista desde arriba, el frente mira a la derecha o hacia abajo) ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  function svgAuto(h, len, atras) {
    const W = len * 100; const c = 12;
    const poli = (pts, clase) => '<polygon class="' + clase + '" points="' + pts.map((q) => q.join(',')).join(' ') + '"/>';
    const rect = (x, y, w, hh, clase) => '<rect class="' + clase + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '"/>';
    const techo = 46 + (len - 2) * 70;
    const r1 = W - 70; const r0 = r1 - techo;
    let g = '';
    g += poli([[4 + c + 3, 19], [W - 4 - c + 3, 19], [W - 1, 14 + c + 5], [W - 1, 86 - c + 5], [W - 4 - c + 3, 91], [4 + c + 3, 91], [7, 86 - c + 5], [7, 14 + c + 5]], 'pk__sombra');
    // ruedas
    [[14, 8], [W - 40, 8], [14, 82], [W - 40, 82]].forEach((q) => { g += rect(q[0], q[1], 26, 10, 'pk__rueda'); });
    g += poli([[4 + c, 14], [W - 4 - c, 14], [W - 4, 14 + c], [W - 4, 86 - c], [W - 4 - c, 86], [4 + c, 86], [4, 86 - c], [4, 14 + c]], 'pk__cuerpo');
    // capot y baul un poco mas claros
    g += poli([[W - 48, 18], [W - 4 - c, 18], [W - 8, 14 + c], [W - 8, 86 - c], [W - 4 - c, 82], [W - 48, 82]], 'pk__claro');
    // vidrios y techo
    g += poli([[W - 48, 22], [W - 48, 78], [r1, 70], [r1, 30]], 'pk__vidrio');
    g += poli([[r0, 30], [r0, 70], [r0 - 20, 63], [r0 - 20, 37]], 'pk__vidrio');
    g += rect(r0, 29, techo, 42, 'pk__techo');
    g += rect(r0 + 8, 36, techo - 16, 5, 'pk__brillo');
    // luces
    g += rect(W - 13, 20, 8, 12, 'pk__luz'); g += rect(W - 13, 68, 8, 12, 'pk__luz');
    g += rect(5, 21, 6, 10, 'pk__freno'); g += rect(5, 69, 6, 10, 'pk__freno');
    const giro = h ? '' : 'translate(100,0) rotate(90)';
    const espejo = atras ? 'translate(' + W + ',0) scale(-1,1)' : '';
    const tr = [giro, espejo].filter(Boolean).join(' ');
    // en vertical el auto se dibuja horizontal y se gira
    const vb = h ? '0 0 ' + W + ' 100' : '0 0 100 ' + W;
    return '<svg class="pk__dibujo" viewBox="' + vb + '" preserveAspectRatio="none" aria-hidden="true" focusable="false"><g transform="' + tr + '">' + g + '</g></svg>';
  }

  /* ---------- Interfaz ---------- */
  function crear(contenedor) {
    const { el, notificar } = global.Pasatiempos;
    let autos = []; let pos = []; let hist = []; let ultimo = -1; let minimo = 0;
    let nodos = [];
    let sel = -1;

    const tablero = el('div', { clase: 'pk__tablero', attrs: { role: 'group', 'aria-label': 'Estacionamiento' } });
    const salida = el('span', { clase: 'pk__salida', attrs: { 'aria-hidden': 'true' }, texto: 'Salida' });
    const puerta = el('span', { clase: 'pk__puerta', attrs: { 'aria-hidden': 'true' } });
    const aviso = el('p', { clase: 'pk__aviso', attrs: { role: 'status', 'aria-live': 'polite' } });

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'pk',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'cantidad',
      conTiempo: false,
      etiquetaNivel: 'Dificultad',
      datos: [{ id: 'mov', etq: 'Movimientos' }, { id: 'min', etq: 'Mínimo posible' }],
      formato: (v) => v + (v === 1 ? ' movimiento' : ' movimientos'),
      acciones: [
        { id: 'deshacer', texto: 'Deshacer', alClick: () => deshacer() },
        { id: 'pista', texto: 'Pista', alClick: () => pista() }
      ],
      cuerpo: [el('div', { clase: 'pk__marco' }, el('div', { clase: 'pk__zona' }, el('div', { clase: 'pk__borde' }, tablero), salida)), aviso],
      hayAvance: () => hist.length > 0,
      nueva(nivel) {
                const g = generar(nivel);
        poner(g.autos, posIni(g.autos), [], -1, g.minimo, base.mov());
      },
      cargar(nivel, ex) { poner(ex.autos, ex.pos, ex.hist, ex.ultimo, ex.minimo, ex.cuenta); },
      serializar() { return { autos: autos.map((a) => ({ h: a.h, len: a.len, f: a.f, c: a.c })), pos: pos.slice(), hist: hist.map((h) => ({ p: h.p.slice(), u: h.u, m: h.m })), ultimo, minimo, cuenta: base.mov() }; },
      validar(ex) {
        if (!Array.isArray(ex.autos) || ex.autos.length < 2 || ex.autos.length > 20 || !Array.isArray(ex.pos) || ex.pos.length !== ex.autos.length) return false;
        if (!Number.isInteger(ex.minimo) || !Number.isInteger(ex.cuenta) || ex.cuenta < 0 || !Number.isInteger(ex.ultimo)) return false;
        const m = new Array(N * N).fill(false);
        for (let i = 0; i < ex.autos.length; i++) {
          const a = ex.autos[i]; const p = ex.pos[i];
          if (typeof a.h !== 'boolean' || !(a.len === 2 || a.len === 3) || !Number.isInteger(a.f) || !Number.isInteger(a.c) || !Number.isInteger(p)) return false;
          if (a.f < 0 || a.c < 0 || a.f >= N || a.c >= N) return false;
          if (i === 0 && (!a.h || a.f !== FILA_SALIDA)) return false;
          const q = a.h ? a.c : a.f; // posición inicial (solo para validar que quepa)
          if (q < 0) return false;
          if (p < 0 || p + a.len > N) return false;
          for (let k = 0; k < a.len; k++) {
            const f = a.h ? a.f : p + k; const c = a.h ? p + k : a.c;
            if (f >= N || c >= N || m[f * N + c]) return false;
            m[f * N + c] = true;
          }
        }
        if (!Array.isArray(ex.hist) || ex.hist.length > 2000 || !ex.hist.every((h) => h && Array.isArray(h.p) && h.p.length === ex.autos.length && h.p.every((x) => Number.isInteger(x) && x >= 0 && x < N) && Number.isInteger(h.u) && Number.isInteger(h.m) && h.m >= 0)) return false;
        return !llego(ex.autos, ex.pos);
      }
    });

    function poner(a, p, h, u, mn, cuenta) {
      autos = a.map((x) => ({ h: x.h, len: x.len, f: x.f, c: x.c }));
      pos = p.slice(); hist = h.map((x) => ({ p: x.p.slice(), u: x.u, m: x.m })); ultimo = u; minimo = mn; sel = -1;
      tablero.replaceChildren(puerta);
      nodos = autos.map((au, i) => {
        const b = el('button', { clase: 'pk__auto' + (i === 0 ? ' pk__auto--meta' : ' pk__auto--c' + (((i - 1) % 8) + 1)), attrs: { type: 'button', 'data-i': String(i) } });
        b.style.setProperty('--len', String(au.len));
        b.innerHTML = svgAuto(au.h, au.len, i % 3 === 2);
        activarArrastre(b, i);
        tablero.append(b);
        return b;
      });
      base.ponerMov(cuenta);
      aviso.textContent = '';
      pintar();
    }

    function ubicar(i) {
      const a = autos[i]; const b = nodos[i];
      const f = a.h ? a.f : pos[i]; const c = a.h ? pos[i] : a.c;
      b.style.setProperty('--f', String(f)); b.style.setProperty('--c', String(c));
      b.style.setProperty('--w', String(a.h ? a.len : 1)); b.style.setProperty('--h', String(a.h ? 1 : a.len));
    }

    function pintar() {
      autos.forEach((a, i) => {
        ubicar(i);
        nodos[i].classList.toggle('pk__auto--sel', i === sel);
        nodos[i].classList.remove('pk__auto--pista');
        nodos[i].style.removeProperty('transform');
        nodos[i].setAttribute('aria-label', (i === 0 ? 'Auto de color, el que tiene que salir' : 'Auto ' + i) + ', ' + (a.h ? 'horizontal' : 'vertical') + ', fila ' + ((a.h ? a.f : pos[i]) + 1) + ', columna ' + ((a.h ? pos[i] : a.c) + 1));
      });
      base.dato('mov', base.mov());
      base.dato('min', minimo);
      const fin = base.fase() === 'ganado';
      if (base.accion('deshacer')) base.accion('deshacer').disabled = fin || !hist.length;
      if (base.accion('pista')) base.accion('pista').disabled = fin;
    }

    /* Mueve el auto i a la posición q (ya validada). Devuelve true si se movió. */
    function aplicar(i, q) {
      if (q === pos[i]) return false;
      // Mover seguido el mismo auto cuenta como un solo movimiento (el mínimo de pasos se calcula igual)
      const previo = ultimo;
      hist.push({ p: pos.slice(), u: previo, m: base.mov() });
      pos[i] = q;
      if (previo !== i) base.sumarMov();
      ultimo = i;
      base.empezar();
      pintar();
      if (llego(autos, pos)) {
        const n = base.mov();
        base.ganar({ titulo: 'Salió el auto', mensaje: 'Lo lograste en ' + n + (n === 1 ? ' movimiento' : ' movimientos') + ' (el mínimo posible era ' + minimo + ').', valor: n });
      }
      return true;
    }

    function mover(i, delta) {
      if (base.fase() === 'ganado') return false;
      const [lo, hi] = rango(autos, pos, i);
      const q = Math.max(lo, Math.min(hi, pos[i] + delta));
      return aplicar(i, q);
    }

    function activarArrastre(b, i) {
      let ini = null;
      b.addEventListener('pointerdown', (ev) => {
        if (base.fase() === 'ganado') return;
        sel = i;
        nodos.forEach((n, k) => n.classList.toggle('pk__auto--sel', k === i));
        const caja = tablero.getBoundingClientRect();
        ini = { x: ev.clientX, y: ev.clientY, celda: caja.width / N, rango: rango(autos, pos, i), base: pos[i], d: 0 };
        try { b.setPointerCapture(ev.pointerId); } catch (e) { /* jsdom */ }
      });
      b.addEventListener('pointermove', (ev) => {
        if (!ini) return;
        const a = autos[i];
        const px = a.h ? ev.clientX - ini.x : ev.clientY - ini.y;
        let d = px / ini.celda;
        d = Math.max(ini.rango[0] - ini.base, Math.min(ini.rango[1] - ini.base, d));
        ini.d = d;
        b.style.transform = a.h ? 'translateX(' + (d * ini.celda) + 'px)' : 'translateY(' + (d * ini.celda) + 'px)';
      });
      const soltar = () => {
        if (!ini) return;
        const d = Math.round(ini.d); const q = ini.base + d; ini = null;
        b.style.removeProperty('transform');
        if (d !== 0) aplicar(i, q);
      };
      b.addEventListener('pointerup', soltar);
      b.addEventListener('pointercancel', () => { ini = null; b.style.removeProperty('transform'); });
      b.addEventListener('keydown', (ev) => {
        const a = autos[i];
        const k = ev.key;
        let d = 0;
        if (a.h) { if (k === 'ArrowLeft') d = -1; else if (k === 'ArrowRight') d = 1; }
        else if (k === 'ArrowUp') d = -1; else if (k === 'ArrowDown') d = 1;
        if (d) { ev.preventDefault(); mover(i, d); nodos[i].focus(); }
      });
    }

    function deshacer() {
      if (!hist.length || base.fase() === 'ganado') return;
      const h = hist.pop();
      pos = h.p.slice(); ultimo = h.u; base.ponerMov(h.m);
      pintar();
    }

    function pista() {
      if (base.fase() === 'ganado') return;
      const r = resolver(autos, pos);
      if (!r || !r.length) { aviso.textContent = 'No encuentro una salida desde acá. Probá con Deshacer.'; return; }
      const [i, q] = r[0];
      base.empezar();
      base.sumarPista();
      pintar();
      nodos[i].classList.add('pk__auto--pista');
      const a = autos[i];
      const dir = a.h ? (q > pos[i] ? 'a la derecha' : 'a la izquierda') : (q > pos[i] ? 'hacia abajo' : 'hacia arriba');
      aviso.textContent = 'Probá mover ' + (i === 0 ? 'el auto de color' : 'el auto marcado') + ' ' + dir + '.';
      notificar('Con pista, esta partida no suma a tus mejores marcas.');
    }

    base.arrancar();
    return {
      pruebas: { mover, pista, deshacer, autos: () => autos.map((a) => ({ ...a })), pos: () => pos.slice(), minimo: () => minimo, resolver: () => resolver(autos, pos) },
      destruir() { base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.ParkingJam = { pruebas: () => (instancia ? instancia.pruebas : null), generar, resolver, rango, llego, posIni, N };
})(window);
