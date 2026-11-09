/* tangram.js · Tangram
   Armá la silueta usando las siete piezas del tangram, sin que se superpongan.
   Arrastrá una pieza para moverla. Con un toque sobre la pieza elegida la girás 45 grados;
   también podés usar los botones Girar y Voltear. Las siluetas se generan al azar y siempre se pueden armar. */
(function (global) {
  'use strict';

  const ID = 'tangram';
  const NS = 'http://www.w3.org/2000/svg';
  const R2 = Math.SQRT2;
  const AN = 12; const AL = 16; // tamaño del tablero en unidades (el cuadrado completo del tangram mide 4)
  const NIVELES = {
    facil: { nombre: 'Fácil', guias: true, cobertura: 0.93, exceso: 0.07 },
    medio: { nombre: 'Medio', guias: false, cobertura: 0.94, exceso: 0.06 },
    dificil: { nombre: 'Difícil', guias: false, cobertura: 0.96, exceso: 0.04 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];

  /* Piezas: vértices en unidades donde el cuadrado completo mide 4 de lado */
  const FORMAS = {
    TG: { nombre: 'triángulo grande', v: [[0, 0], [4, 0], [2, 2]] },
    TM: { nombre: 'triángulo mediano', v: [[0, 0], [2, 0], [0, 2]] },
    TP: { nombre: 'triángulo chico', v: [[0, 0], [R2, 0], [0, R2]] },
    CU: { nombre: 'cuadrado', v: [[0, 0], [R2, 0], [R2, R2], [0, R2]] },
    PA: { nombre: 'paralelogramo', v: [[0, 0], [2, 0], [3, 1], [1, 1]] }
  };
  const TIPOS = ['TG', 'TG', 'TM', 'TP', 'TP', 'CU', 'PA'];
  const BANDEJA = [[2.3, 10.5], [6.0, 10.5], [9.6, 10.7], [1.7, 13.9], [4.3, 13.9], [6.9, 13.9], [10.0, 13.9]];
  const EPS = 1e-6;

  /* Cada forma se guarda centrada en su centroide */
  Object.keys(FORMAS).forEach((k) => {
    const v = FORMAS[k].v;
    const cx = v.reduce((s, p) => s + p[0], 0) / v.length; const cy = v.reduce((s, p) => s + p[1], 0) / v.length;
    FORMAS[k].l = v.map((p) => [p[0] - cx, p[1] - cy]);
  });

  /* ---------- Geometría ---------- */
  /* Vértices en el tablero de una pieza: tipo, centro, giro en pasos de 45 grados y volteo */
  function poligono(tipo, cx, cy, rot, flip) {
    const a = (rot * Math.PI) / 4; const co = Math.cos(a); const si = Math.sin(a);
    return FORMAS[tipo].l.map(([x, y]) => {
      const fx = flip ? -x : x;
      return [cx + fx * co - y * si, cy + fx * si + y * co];
    });
  }
  function solapan(P, Q) {
    for (const poli of [P, Q]) {
      for (let i = 0; i < poli.length; i++) {
        const a = poli[i]; const b = poli[(i + 1) % poli.length];
        const nx = -(b[1] - a[1]); const ny = b[0] - a[0];
        const len = Math.hypot(nx, ny);
        let min1 = Infinity; let max1 = -Infinity; let min2 = Infinity; let max2 = -Infinity;
        P.forEach(([x, y]) => { const d = (x * nx + y * ny) / len; if (d < min1) min1 = d; if (d > max1) max1 = d; });
        Q.forEach(([x, y]) => { const d = (x * nx + y * ny) / len; if (d < min2) min2 = d; if (d > max2) max2 = d; });
        if (max1 <= min2 + 1e-5 || max2 <= min1 + 1e-5) return false;
      }
    }
    return true;
  }
  function dentro(poli, x, y) {
    let signo = 0;
    for (let i = 0; i < poli.length; i++) {
      const a = poli[i]; const b = poli[(i + 1) % poli.length];
      const c = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
      if (Math.abs(c) < 1e-9) continue;
      const s = c > 0 ? 1 : -1;
      if (signo && s !== signo) return false;
      signo = s;
    }
    return true;
  }
  function cajaDe(polis) {
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    polis.forEach((p) => p.forEach(([x, y]) => { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }));
    return { x0, y0, x1, y1 };
  }

  /* Genera una silueta pegando las piezas lado con lado. Devuelve una lista de {tipo, cx, cy, r, f}. */
  function generar(rnd = Math.random) {
    for (let intento = 0; intento < 400; intento++) {
      const orden = Array.from({ length: 7 }, (_, i) => i);
      for (let i = 6; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [orden[i], orden[j]] = [orden[j], orden[i]]; }
      const piezas = new Array(7); const polis = [];
      const primera = orden[0];
      piezas[primera] = { tipo: TIPOS[primera], cx: 0, cy: 0, r: Math.floor(rnd() * 8), f: rnd() < 0.5 };
      polis.push(poligono(TIPOS[primera], 0, 0, piezas[primera].r, piezas[primera].f));
      let ok = true;
      for (let k = 1; k < 7 && ok; k++) {
        const idx = orden[k]; const tipo = TIPOS[idx];
        let puesta = false;
        for (let t = 0; t < 200 && !puesta; t++) {
          const dueña = polis[Math.floor(rnd() * polis.length)];
          const e = Math.floor(rnd() * dueña.length);
          const p = dueña[e]; const q = dueña[(e + 1) % dueña.length];
          const largo = Math.hypot(q[0] - p[0], q[1] - p[1]);
          const f = rnd() < 0.5;
          const lf = FORMAS[tipo].l.map(([x, y]) => [f ? -x : x, y]);
          const cand = [];
          for (let i = 0; i < lf.length; i++) {
            const a = lf[i]; const b = lf[(i + 1) % lf.length];
            if (Math.abs(Math.hypot(b[0] - a[0], b[1] - a[1]) - largo) < 1e-6) cand.push(i);
          }
          if (!cand.length) continue;
          const i = cand[Math.floor(rnd() * cand.length)];
          const a = lf[i]; const b = lf[(i + 1) % lf.length];
          // El borde de la pieza nueva (a -> b) tiene que quedar sobre (q -> p), del otro lado
          let ang = Math.atan2(p[1] - q[1], p[0] - q[0]) - Math.atan2(b[1] - a[1], b[0] - a[0]);
          const pasos = Math.round(ang / (Math.PI / 4));
          if (Math.abs(ang - pasos * (Math.PI / 4)) > 1e-6 && Math.abs(Math.abs(ang - pasos * (Math.PI / 4)) - 2 * Math.PI) > 1e-6) continue;
          const r = ((pasos % 8) + 8) % 8;
          const co = Math.cos((r * Math.PI) / 4); const si = Math.sin((r * Math.PI) / 4);
          const ra = [a[0] * co - a[1] * si, a[0] * si + a[1] * co];
          const cx = q[0] - ra[0]; const cy = q[1] - ra[1];
          const nueva = poligono(tipo, cx, cy, r, f);
          if (polis.some((o) => solapan(nueva, o))) continue;
          piezas[idx] = { tipo, cx, cy, r, f };
          polis.push(nueva);
          puesta = true;
        }
        if (!puesta) ok = false;
      }
      if (!ok) continue;
      const caja = cajaDe(polis);
      if (caja.x1 - caja.x0 > 10.2 || caja.y1 - caja.y0 > 7.6) continue;
      // Centrar la silueta en la parte de arriba del tablero
      const dx = AN / 2 - (caja.x0 + caja.x1) / 2; const dy = 4.3 - (caja.y0 + caja.y1) / 2;
      return piezas.map((p) => ({ tipo: p.tipo, cx: redondear(p.cx + dx), cy: redondear(p.cy + dy), r: p.r, f: p.f }));
    }
    return null;
  }
  function redondear(x) { return Math.round(x * 1e6) / 1e6; }

  function evaluar(sol, pz) {
    const S = sol.map((p) => poligono(p.tipo, p.cx, p.cy, p.r, p.f));
    const J = pz.map((p) => poligono(p.tipo, p.cx, p.cy, p.r, p.f));
    const c = cajaDe(S.concat(J));
    let enSil = 0; let ambos = 0; let sobra = 0;
    const paso = 0.08;
    for (let y = c.y0; y <= c.y1; y += paso) for (let x = c.x0; x <= c.x1; x += paso) {
      const a = S.some((p) => dentro(p, x, y));
      const b = J.some((p) => dentro(p, x, y));
      if (a) enSil++;
      if (a && b) ambos++;
      if (!a && b) sobra++;
    }
    return { cobertura: enSil ? ambos / enSil : 0, exceso: enSil ? sobra / enSil : 1 };
  }

  /* ---------- Interfaz ---------- */
  function crear(contenedor) {
    const { el, notificar } = global.Pasatiempos;
    let sol = []; let pz = []; let sel = 0; let ghost = null;
    let nodosPieza = []; let nodoSil = null; let nodoGhost = null;
    let guias = false;

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'tg__svg');
    svg.setAttribute('viewBox', '0 0 ' + AN + ' ' + AL);
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', 'Silueta y piezas del tangram');
    const aviso = el('p', { clase: 'tg__aviso', attrs: { role: 'status', 'aria-live': 'polite' } });

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'tg',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'tiempo',
      etiquetaNivel: 'Dificultad',
      acciones: [
        { id: 'girar', texto: 'Girar', alClick: () => girar() },
        { id: 'voltear', texto: 'Voltear', alClick: () => voltear() },
        { id: 'pista', texto: 'Pista', alClick: () => pista() }
      ],
      cuerpo: [el('div', { clase: 'tg__marco' }, svg), aviso],
      hayAvance: () => base.mov() > 0,
      nueva(nivel) {
        let s = null;
        for (let k = 0; k < 10 && !s; k++) s = generar();
        poner(nivel, s, TIPOS.map((t, i) => ({ tipo: t, cx: BANDEJA[i][0], cy: BANDEJA[i][1], r: 0, f: false })));
      },
      cargar(nivel, ex) { poner(nivel, ex.sol, ex.pz); },
      serializar() { return { sol: sol.map((p) => ({ ...p })), pz: pz.map((p) => ({ ...p })) }; },
      validar(ex) {
        const bien = (a) => Array.isArray(a) && a.length === 7 && a.every((p, i) => p && p.tipo === TIPOS[i] && Number.isFinite(p.cx) && Number.isFinite(p.cy) && p.cx > -2 && p.cx < AN + 2 && p.cy > -2 && p.cy < AL + 2 && Number.isInteger(p.r) && p.r >= 0 && p.r < 8 && typeof p.f === 'boolean');
        if (!bien(ex.sol) || !bien(ex.pz)) return false;
        const S = ex.sol.map((p) => poligono(p.tipo, p.cx, p.cy, p.r, p.f));
        for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++) if (solapan(S[i], S[j])) return false;
        return true;
      }
    });

    function poner(nivel, s, p) {
      sol = s.map((x) => ({ ...x })); pz = p.map((x) => ({ ...x })); sel = 0; ghost = null;
      guias = NIVELES[nivel].guias;
      svg.replaceChildren();
      // Silueta
      const gSil = document.createElementNS(NS, 'g');
      gSil.setAttribute('class', 'tg__sil');
      sol.forEach((x) => {
        const pol = document.createElementNS(NS, 'polygon');
        pol.setAttribute('points', puntos(poligono(x.tipo, x.cx, x.cy, x.r, x.f)));
        pol.setAttribute('class', 'tg__sil-pieza' + (guias ? ' tg__sil-pieza--guia' : ''));
        gSil.append(pol);
      });
      svg.append(gSil);
      nodoSil = gSil;
      // Línea que separa la silueta de la bandeja
      const sep = document.createElementNS(NS, 'line');
      sep.setAttribute('x1', 0.4); sep.setAttribute('x2', AN - 0.4); sep.setAttribute('y1', 8.9); sep.setAttribute('y2', 8.9);
      sep.setAttribute('class', 'tg__sep');
      svg.append(sep);
      // Fantasma de la pista
      nodoGhost = document.createElementNS(NS, 'polygon');
      nodoGhost.setAttribute('class', 'tg__ghost'); nodoGhost.setAttribute('points', '');
      svg.append(nodoGhost);
      // Piezas
      nodosPieza = pz.map((x, i) => {
        const pol = document.createElementNS(NS, 'polygon');
        pol.setAttribute('class', 'tg__pieza tg__pieza--' + (i + 1));
        pol.setAttribute('role', 'button'); pol.setAttribute('tabindex', '0');
        activar(pol, i);
        svg.append(pol);
        return pol;
      });
      aviso.textContent = '';
      pintar();
    }

    const puntos = (poli) => poli.map(([x, y]) => redondear(x) + ',' + redondear(y)).join(' ');

    function pintar() {
      pz.forEach((x, i) => {
        const n = nodosPieza[i];
        n.setAttribute('points', puntos(poligono(x.tipo, x.cx, x.cy, x.r, x.f)));
        n.classList.toggle('tg__pieza--sel', i === sel);
        n.setAttribute('aria-label', FORMAS[x.tipo].nombre + ' ' + (i + 1) + (i === sel ? ', elegida' : '') + ', giro ' + (x.r * 45) + ' grados' + (x.f ? ', volteada' : ''));
      });
      // La pieza elegida va arriba de todas; se mueve en el DOM solo si hace falta, para no cortar el arrastre
      if (sel >= 0 && nodosPieza[sel] && nodosPieza[sel].parentNode === svg && svg.lastChild !== nodosPieza[sel]) svg.append(nodosPieza[sel]);
      const fin = base.fase() === 'ganado';
      ['girar', 'voltear', 'pista'].forEach((id) => { if (base.accion(id)) base.accion(id).disabled = fin; });
    }

    function revisar() {
      if (base.fase() === 'ganado') return;
      const cfg = NIVELES[base.nivel()];
      const e = evaluar(sol, pz);
      if (e.cobertura >= cfg.cobertura && e.exceso <= cfg.exceso && !solapadas()) {
        base.ganar({ titulo: 'Silueta armada', mensaje: 'Encajaron las siete piezas.' });
      }
    }
    function solapadas() {
      const J = pz.map((p) => poligono(p.tipo, p.cx, p.cy, p.r, p.f));
      let area = 0;
      for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++) if (solapan(J[i], J[j])) area++;
      return area > 1;
    }

    function ajustar(i) {
      // Imanta la pieza a los vértices de la silueta o de otras piezas si hay alguno muy cerca
      const p = pz[i];
      const mia = poligono(p.tipo, p.cx, p.cy, p.r, p.f);
      const anclas = [];
      sol.forEach((x) => poligono(x.tipo, x.cx, x.cy, x.r, x.f).forEach((v) => anclas.push(v)));
      pz.forEach((x, k) => { if (k !== i) poligono(x.tipo, x.cx, x.cy, x.r, x.f).forEach((v) => anclas.push(v)); });
      let mejor = null; let dMejor = 0.5;
      mia.forEach((v) => anclas.forEach((a) => {
        const d = Math.hypot(a[0] - v[0], a[1] - v[1]);
        if (d < dMejor) { dMejor = d; mejor = [a[0] - v[0], a[1] - v[1]]; }
      }));
      if (mejor) { p.cx += mejor[0]; p.cy += mejor[1]; }
    }

    function dentroDelTablero(i) {
      const p = pz[i];
      p.cx = Math.max(0.5, Math.min(AN - 0.5, p.cx));
      p.cy = Math.max(0.5, Math.min(AL - 0.5, p.cy));
    }

    function activar(nodo, i) {
      let arr = null;
      const aUnidades = (ev) => {
        const r = svg.getBoundingClientRect();
        return r.width ? [((ev.clientX - r.left) / r.width) * AN, ((ev.clientY - r.top) / r.height) * AL] : [0, 0];
      };
      nodo.addEventListener('pointerdown', (ev) => {
        if (base.fase() === 'ganado') return;
        ev.preventDefault();
        const yaEra = sel === i;
        sel = i;
        pintar();
        const [x, y] = aUnidades(ev);
        arr = { x, y, cx: pz[i].cx, cy: pz[i].cy, mov: false, yaEra };
        try { nodo.setPointerCapture(ev.pointerId); } catch (e) { /* jsdom */ }
      });
      nodo.addEventListener('pointermove', (ev) => {
        if (!arr) return;
        const [x, y] = aUnidades(ev);
        if (!arr.mov && Math.hypot(x - arr.x, y - arr.y) < 0.15) return;
        arr.mov = true;
        pz[i].cx = arr.cx + (x - arr.x); pz[i].cy = arr.cy + (y - arr.y);
        dentroDelTablero(i);
        pintar();
      });
      nodo.addEventListener('pointerup', () => {
        if (!arr) return;
        const a = arr; arr = null;
        base.empezar();
        if (!a.mov) { if (a.yaEra) girar(); return; }
        ajustar(i); dentroDelTablero(i);
        base.sumarMov();
        pintar();
        revisar();
      });
      nodo.addEventListener('pointercancel', () => { arr = null; });
      nodo.addEventListener('keydown', (ev) => {
        const paso = ev.shiftKey ? 1 : 0.25;
        const m = { ArrowLeft: [-paso, 0], ArrowRight: [paso, 0], ArrowUp: [0, -paso], ArrowDown: [0, paso] }[ev.key];
        if (m) {
          ev.preventDefault(); sel = i; base.empezar();
          pz[i].cx += m[0]; pz[i].cy += m[1]; dentroDelTablero(i); pintar(); revisar();
          nodosPieza[i].focus();
        } else if (ev.key === 'r' || ev.key === 'R') { ev.preventDefault(); sel = i; girar(); nodosPieza[i].focus(); }
        else if (ev.key === 'f' || ev.key === 'F') { ev.preventDefault(); sel = i; voltear(); nodosPieza[i].focus(); }
        else if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); sel = i; pintar(); }
      });
    }

    function girar() {
      if (base.fase() === 'ganado') return;
      base.empezar();
      pz[sel].r = (pz[sel].r + 1) % 8;
      ajustar(sel); dentroDelTablero(sel);
      base.sumarMov();
      pintar(); revisar();
    }
    function voltear() {
      if (base.fase() === 'ganado') return;
      base.empezar();
      pz[sel].f = !pz[sel].f;
      base.sumarMov();
      pintar(); revisar();
    }

    function pista() {
      if (base.fase() === 'ganado') return;
      // Pieza que todavía no coincide con ninguna de la silueta de su mismo tipo
      const libres = sol.map((x, k) => k);
      const mal = [];
      pz.forEach((p, i) => {
        const mia = poligono(p.tipo, p.cx, p.cy, p.r, p.f);
        const k = libres.find((j) => sol[j].tipo === p.tipo && mia.every((v) => poligono(sol[j].tipo, sol[j].cx, sol[j].cy, sol[j].r, sol[j].f).some((w) => Math.hypot(w[0] - v[0], w[1] - v[1]) < 0.3)));
        if (k !== undefined) libres.splice(libres.indexOf(k), 1); else mal.push(i);
      });
      if (!mal.length) { aviso.textContent = 'Las piezas ya coinciden; revisá que no haya huecos.'; return; }
      const i = mal.includes(sel) ? sel : mal[0];
      const destino = libres.filter((j) => sol[j].tipo === pz[i].tipo).sort((a, b) => Math.hypot(sol[a].cx - pz[i].cx, sol[a].cy - pz[i].cy) - Math.hypot(sol[b].cx - pz[i].cx, sol[b].cy - pz[i].cy))[0];
      if (destino === undefined) return;
      base.empezar();
      base.sumarPista();
      sel = i;
      const s = sol[destino];
      nodoGhost.setAttribute('points', puntos(poligono(s.tipo, s.cx, s.cy, s.r, s.f)));
      nodoGhost.classList.add('tg__ghost--ver');
      pintar();
      aviso.textContent = 'La pieza elegida (' + FORMAS[pz[i].tipo].nombre + ') va en el contorno punteado.';
      base.despues(() => { nodoGhost.classList.remove('tg__ghost--ver'); }, 4000);
      notificar('Con pista, esta partida no suma a tus mejores marcas.');
    }

    base.arrancar();
    return {
      pruebas: {
        colocarTodas() { sol.forEach((s, i) => { pz[i] = { ...s }; }); pintar(); revisar(); },
        colocar(i, cx, cy, r, f) { pz[i] = { tipo: pz[i].tipo, cx, cy, r, f }; pintar(); },
        revisar, girar, voltear, pista, elegir(i) { sel = i; pintar(); },
        sol: () => sol.map((p) => ({ ...p })), pz: () => pz.map((p) => ({ ...p }))
      },
      destruir() { base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.Tangram = { pruebas: () => (instancia ? instancia.pruebas : null), generar, poligono, solapan, evaluar, FORMAS, TIPOS };
})(window);
