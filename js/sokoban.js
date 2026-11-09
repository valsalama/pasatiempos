/* sokoban.js · Sokoban
   Empujá las cajas hasta dejarlas todas sobre las marcas. Solo se empuja (no se tira),
   una caja por vez y nunca contra otra caja o una pared. Los niveles se generan al azar
   y siempre tienen solución. */
(function (global) {
  'use strict';

  const ID = 'sokoban';
  const NIVELES = {
    facil: { nombre: 'Fácil', w: 7, h: 7, cajas: 2, paredes: 4, pasos: 14 },
    medio: { nombre: 'Medio', w: 8, h: 8, cajas: 3, paredes: 7, pasos: 22 },
    dificil: { nombre: 'Difícil', w: 9, h: 9, cajas: 4, paredes: 10, pasos: 32 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];
  const DIR = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
  const LETRAS = ['u', 'd', 'l', 'r'];

  /* ---------- Lógica pura ----------
     nivel = { w, h, paredes: [bool], metas: [idx], cajas: [idx], jug: idx } */
  function conectado(w, h, paredes) {
    const libres = []; paredes.forEach((p, i) => { if (!p) libres.push(i); });
    if (!libres.length) return false;
    const visto = new Set([libres[0]]); const cola = [libres[0]];
    for (let q = 0; q < cola.length; q++) {
      const i = cola[q]; const x = i % w; const y = (i / w) | 0;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const nx = x + dx; const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
        const j = ny * w + nx;
        if (!paredes[j] && !visto.has(j)) { visto.add(j); cola.push(j); }
      });
    }
    return visto.size === libres.length;
  }

  function generar(nivel, rnd = Math.random) {
    const cfg = NIVELES[nivel];
    const { w, h } = cfg;
    const n = w * h;
    for (let intento = 0; intento < 200; intento++) {
      // Paredes: contorno completo más bloques sueltos adentro
      const paredes = new Array(n).fill(false);
      for (let i = 0; i < n; i++) { const x = i % w; const y = (i / w) | 0; if (x === 0 || y === 0 || x === w - 1 || y === h - 1) paredes[i] = true; }
      for (let k = 0; k < cfg.paredes; k++) {
        const x = 1 + Math.floor(rnd() * (w - 2)); const y = 1 + Math.floor(rnd() * (h - 2));
        paredes[y * w + x] = true;
      }
      if (!conectado(w, h, paredes)) continue;
      const libres = []; paredes.forEach((p, i) => { if (!p) libres.push(i); });
      if (libres.length < cfg.cajas + 8) continue;
      for (let i = libres.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [libres[i], libres[j]] = [libres[j], libres[i]]; }
      const metas = libres.slice(0, cfg.cajas).sort((a, b) => a - b);
      let cajas = metas.slice();
      let jug = libres[cfg.cajas];
      // Jugadas inversas: se tira de las cajas desde las metas hacia afuera (siempre queda una solución)
      const libre = (i) => !paredes[i] && !cajas.includes(i);
      let tiros = 0;
      for (let vuelta = 0; vuelta < cfg.pasos * 6 && tiros < cfg.pasos; vuelta++) {
        // Casillas a las que llega la persona sin empujar nada
        const alcance = new Set([jug]); const cola = [jug];
        for (let q = 0; q < cola.length; q++) {
          const i = cola[q]; const x = i % w; const y = (i / w) | 0;
          [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            const j = (y + dy) * w + (x + dx);
            if (x + dx < 0 || y + dy < 0 || x + dx >= w || y + dy >= h) return;
            if (libre(j) && !alcance.has(j)) { alcance.add(j); cola.push(j); }
          });
        }
        const opciones = [];
        cajas.forEach((b, k) => {
          const x = b % w; const y = (b / w) | 0;
          [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            if (x + 2 * dx < 0 || y + 2 * dy < 0 || x + 2 * dx >= w || y + 2 * dy >= h) return;
            const p1 = (y + dy) * w + (x + dx); const p2 = (y + 2 * dy) * w + (x + 2 * dx);
            if (alcance.has(p1) && libre(p2)) opciones.push([k, p1, p2]);
          });
        });
        if (!opciones.length) break;
        const [k, p1, p2] = opciones[Math.floor(rnd() * opciones.length)];
        cajas[k] = p1; jug = p2; tiros++;
      }
      const sobre = cajas.filter((c) => metas.includes(c)).length;
      if (sobre > Math.max(0, cfg.cajas - 2)) continue;
      // Que la persona no empiece pegada a un nivel demasiado trivial
      const lejos = cajas.reduce((s, c) => s + Math.min(...metas.map((m) => Math.abs((m % w) - (c % w)) + Math.abs(((m / w) | 0) - ((c / w) | 0)))), 0);
      if (lejos < cfg.cajas * 2) continue;
      return { w, h, paredes, metas, cajas: cajas.slice().sort((a, b) => a - b), jug };
    }
    // Plan B fijo
    const paredes = new Array(n).fill(false);
    for (let i = 0; i < n; i++) { const x = i % w; const y = (i / w) | 0; if (x === 0 || y === 0 || x === w - 1 || y === h - 1) paredes[i] = true; }
    return { w, h, paredes, metas: [2 * w + 4], cajas: [3 * w + 3], jug: 4 * w + 3 };
  }

  /* Aplica un movimiento. Devuelve null si no se puede, o { jug, cajas, empuja } */
  function mover(niv, jug, cajas, letra) {
    const d = DIR[letra]; if (!d) return null;
    const { w, h, paredes } = niv;
    const x = (jug % w) + d[0]; const y = ((jug / w) | 0) + d[1];
    if (x < 0 || y < 0 || x >= w || y >= h) return null;
    const dest = y * w + x;
    if (paredes[dest]) return null;
    const k = cajas.indexOf(dest);
    if (k < 0) return { jug: dest, cajas, empuja: false };
    const x2 = x + d[0]; const y2 = y + d[1];
    if (x2 < 0 || y2 < 0 || x2 >= w || y2 >= h) return null;
    const dest2 = y2 * w + x2;
    if (paredes[dest2] || cajas.indexOf(dest2) >= 0) return null;
    const nuevas = cajas.slice(); nuevas[k] = dest2;
    return { jug: dest, cajas: nuevas, empuja: true };
  }
  function ganado(niv, cajas) { return cajas.every((c) => niv.metas.includes(c)); }

  /* ---------- Interfaz ---------- */
  function crear(contenedor) {
    const { el, notificar } = global.Pasatiempos;
    let niv = null;
    let movs = ''; // letras; mayúscula si empujó
    let jug = 0; let cajas = [];
    let celdas = [];

    const tablero = el('div', { clase: 'sk__tablero', attrs: { role: 'img', 'aria-label': 'Tablero de Sokoban' } });
    const cruz = el('div', { clase: 'sk__cruz', attrs: { role: 'group', 'aria-label': 'Mover' } });
    [['u', 'Arriba', 'sk__b--u'], ['l', 'Izquierda', 'sk__b--l'], ['r', 'Derecha', 'sk__b--r'], ['d', 'Abajo', 'sk__b--d']].forEach(([l, n, c]) => {
      const b = el('button', { clase: 'sk__b ' + c, attrs: { type: 'button', 'aria-label': n } });
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" aria-hidden="true"><path d="M12 18V6M6 12l6-6 6 6"/></svg>';
      b.addEventListener('click', () => paso(l));
      cruz.append(b);
    });
    const aviso = el('p', { clase: 'sk__aviso', attrs: { role: 'status', 'aria-live': 'polite' } });

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'sk',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'cantidad',
      conTiempo: false,
      etiquetaNivel: 'Dificultad',
      datos: [{ id: 'pasos', etq: 'Pasos' }, { id: 'cajas', etq: 'En su lugar' }],
      formato: (v) => v + (v === 1 ? ' paso' : ' pasos'),
      acciones: [
        { id: 'deshacer', texto: 'Deshacer', alClick: () => deshacer() },
        { id: 'reiniciar', texto: 'Reiniciar nivel', alClick: () => reiniciar() }
      ],
      cuerpo: [el('div', { clase: 'sk__marco' }, tablero), cruz, aviso],
      hayAvance: () => movs.length > 0,
      nueva(nivel) { poner(generar(nivel), ''); },
      cargar(nivel, ex) { poner(ex.niv, ex.movs); },
      serializar() { return { niv: { w: niv.w, h: niv.h, paredes: niv.paredes.slice(), metas: niv.metas.slice(), cajas: niv.cajas.slice(), jug: niv.jug }, movs }; },
      validar(ex, nivel) {
        const cfg = NIVELES[nivel]; const n = ex.niv;
        if (!n || n.w !== cfg.w || n.h !== cfg.h || typeof ex.movs !== 'string' || !/^[udlrUDLR]*$/.test(ex.movs) || ex.movs.length > 5000) return false;
        const total = cfg.w * cfg.h;
        if (!Array.isArray(n.paredes) || n.paredes.length !== total || !n.paredes.every((p) => typeof p === 'boolean')) return false;
        const okIdx = (i) => Number.isInteger(i) && i >= 0 && i < total && !n.paredes[i];
        if (!Array.isArray(n.metas) || n.metas.length !== cfg.cajas || !n.metas.every(okIdx)) return false;
        if (!Array.isArray(n.cajas) || n.cajas.length !== cfg.cajas || !n.cajas.every(okIdx) || !okIdx(n.jug)) return false;
        if (new Set(n.cajas).size !== n.cajas.length || n.cajas.includes(n.jug)) return false;
        // Que las jugadas guardadas se puedan repetir de verdad
        let j = n.jug; let c = n.cajas;
        for (const ch of ex.movs) {
          const r = mover(n, j, c, ch.toLowerCase());
          if (!r || r.empuja !== (ch !== ch.toLowerCase())) return false;
          j = r.jug; c = r.cajas;
        }
        return !ganado(n, c);
      }
    });

    function repetir(m) {
      let j = niv.jug; let c = niv.cajas;
      for (const ch of m) { const r = mover(niv, j, c, ch.toLowerCase()); j = r.jug; c = r.cajas; }
      jug = j; cajas = c;
    }

    function poner(nivelDef, m) {
      niv = nivelDef; movs = m;
      repetir(movs);
      tablero.replaceChildren();
      tablero.style.setProperty('--sk-w', String(niv.w));
      celdas = [];
      for (let i = 0; i < niv.w * niv.h; i++) {
        const c = el('span', { clase: 'sk__celda' });
        celdas.push(c);
        tablero.append(c);
      }
      base.ponerMov(movs.length);
      aviso.textContent = '';
      pintar();
    }

    function pintar() {
      let enLugar = 0;
      for (let i = 0; i < celdas.length; i++) {
        const esMeta = niv.metas.includes(i);
        const caja = cajas.includes(i);
        if (caja && esMeta) enLugar++;
        celdas[i].className = 'sk__celda' + (niv.paredes[i] ? ' sk__celda--pared' : ' sk__celda--suelo') +
          (esMeta ? ' sk__celda--meta' : '') + (caja ? ' sk__celda--caja' + (esMeta ? ' sk__celda--lista' : '') : '') + (i === jug ? ' sk__celda--jug' : '');
      }
      base.dato('pasos', movs.length);
      base.dato('cajas', enLugar + '/' + niv.metas.length);
      const fin = base.fase() === 'ganado';
      if (base.accion('deshacer')) base.accion('deshacer').disabled = fin || !movs.length;
      if (base.accion('reiniciar')) base.accion('reiniciar').disabled = fin || !movs.length;
      tablero.setAttribute('aria-label', 'Tablero de Sokoban, ' + enLugar + ' de ' + niv.metas.length + ' cajas en su lugar');
    }

    function paso(l) {
      if (base.fase() === 'ganado') return;
      const r = mover(niv, jug, cajas, l);
      if (!r) return;
      base.empezar();
      jug = r.jug; cajas = r.cajas;
      movs += r.empuja ? l.toUpperCase() : l;
      base.sumarMov();
      pintar();
      if (ganado(niv, cajas)) {
        const n = movs.length;
        base.ganar({ titulo: 'Nivel resuelto', mensaje: 'Acomodaste todas las cajas en ' + n + (n === 1 ? ' paso.' : ' pasos.'), valor: n });
      }
    }

    function deshacer() {
      if (!movs.length || base.fase() === 'ganado') return;
      movs = movs.slice(0, -1);
      repetir(movs);
      base.ponerMov(movs.length);
      pintar();
    }

    function reiniciar() {
      if (!movs.length || base.fase() === 'ganado') return;
      if (!global.confirm('¿Volver al comienzo de este nivel?')) return;
      movs = '';
      repetir(movs);
      base.ponerMov(0);
      pintar();
    }

    const teclas = (ev) => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const mapa = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', w: 'u', s: 'd', a: 'l', d: 'r', W: 'u', S: 'd', A: 'l', D: 'r' };
      const t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (mapa[ev.key]) { ev.preventDefault(); paso(mapa[ev.key]); }
      else if ((ev.key === 'z' || ev.key === 'Z' || ev.key === 'Backspace') && t && t.tagName !== 'BUTTON') { ev.preventDefault(); deshacer(); }
    };
    document.addEventListener('keydown', teclas);

    // Deslizar el dedo sobre el tablero
    let toque = null;
    tablero.addEventListener('touchstart', (ev) => { const t = ev.changedTouches[0]; toque = { x: t.clientX, y: t.clientY }; }, { passive: true });
    tablero.addEventListener('touchend', (ev) => {
      if (!toque) return;
      const t = ev.changedTouches[0]; const dx = t.clientX - toque.x; const dy = t.clientY - toque.y; toque = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      paso(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u'));
    }, { passive: true });

    base.arrancar();
    return {
      pruebas: { paso, deshacer, nivel: () => niv, estado: () => ({ jug, cajas: cajas.slice(), movs }) },
      destruir() { document.removeEventListener('keydown', teclas); base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.Sokoban = { pruebas: () => (instancia ? instancia.pruebas : null), generar, mover, ganado };
})(window);
