/* sort-liquid.js · Sort Liquid (ordenar líquidos)
   Pasá el líquido de un tubo a otro hasta que cada tubo tenga un solo color.
   Solo se puede volcar sobre un tubo vacío o sobre el mismo color, y si hay lugar. */
(function (global) {
  'use strict';

  const ID = 'sort-liquid';
  const CAP = 4;
  const NIVELES = {
    facil: { nombre: 'Fácil', colores: 5 },
    medio: { nombre: 'Medio', colores: 7 },
    dificil: { nombre: 'Difícil', colores: 9 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];

  /* ---------- Lógica pura: un tubo es un texto de dígitos, de abajo hacia arriba ---------- */
  function tope(t) {
    if (!t.length) return { color: '', n: 0 };
    const c = t[t.length - 1];
    let n = 1;
    while (n < t.length && t[t.length - 1 - n] === c) n++;
    return { color: c, n };
  }
  function puedeVolcar(tubos, i, j) {
    if (i === j) return false;
    const a = tubos[i]; const b = tubos[j];
    if (!a.length || b.length >= CAP) return false;
    const ta = tope(a);
    if (b.length && b[b.length - 1] !== ta.color) return false;
    // Pasar un tubo todo de un color a uno vacío no sirve de nada
    if (!b.length && ta.n === a.length) return false;
    return true;
  }
  function volcar(tubos, i, j) {
    const a = tubos[i]; const b = tubos[j];
    const ta = tope(a);
    const n = Math.min(ta.n, CAP - b.length);
    const res = tubos.slice();
    res[i] = a.slice(0, a.length - n);
    res[j] = b + ta.color.repeat(n);
    return res;
  }
  function resuelto(tubos) {
    return tubos.every((t) => t.length === 0 || (t.length === CAP && tope(t).n === CAP));
  }
  const clave = (tubos) => tubos.slice().sort().join('|');

  /* Busca una lista de movimientos [i, j]; null si no encuentra dentro del límite */
  function resolver(tubos, limite = 60000) {
    const visto = new Set([clave(tubos)]);
    let nodos = 0;
    function dfs(estado, camino) {
      if (resuelto(estado)) return camino;
      if (++nodos > limite) return null;
      const opciones = [];
      for (let i = 0; i < estado.length; i++) {
        for (let j = 0; j < estado.length; j++) {
          if (!puedeVolcar(estado, i, j)) continue;
          const sig = volcar(estado, i, j);
          const k = clave(sig);
          if (visto.has(k)) continue;
          // Preferir jugadas que completan o juntan colores
          const ganancia = (sig[j].length === CAP && tope(sig[j]).n === CAP ? 100 : 0) + tope(sig[j]).n * 5 - (sig[i].length ? tope(sig[i]).n : 0);
          opciones.push({ i, j, sig, k, ganancia });
        }
      }
      opciones.sort((x, y) => y.ganancia - x.ganancia);
      for (const o of opciones) {
        if (visto.has(o.k)) continue;
        visto.add(o.k);
        const r = dfs(o.sig, camino.concat([[o.i, o.j]]));
        if (r) return r;
        if (nodos > limite) return null;
      }
      return null;
    }
    return dfs(tubos, []);
  }

  function generar(nivel, rnd = Math.random) {
    const { colores } = NIVELES[nivel];
    for (let intento = 0; intento < 60; intento++) {
      const piezas = [];
      for (let c = 0; c < colores; c++) for (let k = 0; k < CAP; k++) piezas.push(String(c));
      for (let i = piezas.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [piezas[i], piezas[j]] = [piezas[j], piezas[i]]; }
      const tubos = [];
      for (let c = 0; c < colores; c++) tubos.push(piezas.slice(c * CAP, (c + 1) * CAP).join(''));
      tubos.push(''); tubos.push('');
      if (resuelto(tubos)) continue;
      // Que no haya un tubo ya resuelto desde el inicio
      if (tubos.some((t) => t.length === CAP && tope(t).n === CAP)) continue;
      if (resolver(tubos, 30000)) return tubos;
    }
    // Plan B: partir de lo resuelto y mezclar con jugadas inversas (siempre tiene solución)
    const tubos = [];
    for (let c = 0; c < colores; c++) tubos.push(String(c).repeat(CAP));
    tubos.push(''); tubos.push('');
    for (let k = 0; k < 300; k++) {
      const i = Math.floor(rnd() * tubos.length); const j = Math.floor(rnd() * tubos.length);
      if (i !== j && tubos[i].length && tubos[j].length < CAP) {
        tubos[j] += tubos[i][tubos[i].length - 1];
        tubos[i] = tubos[i].slice(0, -1);
      }
    }
    return tubos;
  }

  /* ---------- Interfaz ---------- */
  function crear(contenedor) {
    const { el, notificar } = global.Pasatiempos;
    let tubos = [];
    let hist = [];
    let sel = -1;
    let botones = [];
    let pistaMov = null;
    let anim = null; // volcado en curso: { timers, i, j }

    const zona = el('div', { clase: 'sl__tubos', attrs: { role: 'group', 'aria-label': 'Tubos' } });
    const reducido = () => !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const aviso = el('p', { clase: 'sl__aviso', attrs: { role: 'status', 'aria-live': 'polite' } });

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'sl',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'cantidad',
      conTiempo: false,
      etiquetaNivel: 'Dificultad',
      datos: [{ id: 'mov', etq: 'Movimientos' }],
      formato: (v) => v + (v === 1 ? ' movimiento' : ' movimientos'),
      acciones: [
        { id: 'deshacer', texto: 'Deshacer', alClick: () => deshacer() },
        { id: 'pista', texto: 'Pista', alClick: () => pista() }
      ],
      cuerpo: [el('div', { clase: 'sl__marco' }, zona), aviso],
      hayAvance: () => hist.length > 0,
      nueva(nivel) { poner(generar(nivel), []); },
      cargar(nivel, ex) { poner(ex.tubos, ex.hist); },
      serializar() { return { tubos: tubos.slice(), hist: hist.map((h) => h.slice()) }; },
      validar(ex, nivel) {
        const cfg = NIVELES[nivel];
        const okTubos = (a) => Array.isArray(a) && a.length === cfg.colores + 2 && a.every((t) => typeof t === 'string' && t.length <= CAP && /^[0-8]*$/.test(t));
        if (!okTubos(ex.tubos) || !Array.isArray(ex.hist) || !ex.hist.every(okTubos)) return false;
        const cuenta = new Array(9).fill(0);
        ex.tubos.join('').split('').forEach((c) => { cuenta[Number(c)]++; });
        for (let c = 0; c < 9; c++) if (cuenta[c] !== (c < cfg.colores ? CAP : 0)) return false;
        return !resuelto(ex.tubos);
      }
    });

    function poner(t, h) {
      cortarAnim();
      tubos = t.slice(); hist = h.map((x) => x.slice()); sel = -1; pistaMov = null;
      zona.replaceChildren();
      botones = tubos.map((_, i) => {
        const b = el('button', { clase: 'sl__tubo', attrs: { type: 'button' } });
        for (let k = 0; k < CAP; k++) b.append(el('span', { clase: 'sl__seg' }));
        b.addEventListener('click', () => tocar(i));
        zona.append(b);
        return b;
      });
      aviso.textContent = '';
      base.ponerMov(hist.length);
      pintar();
    }

    function pintar() {
      tubos.forEach((t, i) => {
        const b = botones[i];
        const completo = t.length === CAP && tope(t).n === CAP;
        b.className = 'sl__tubo' + (i === sel ? ' sl__tubo--sel' : '') + (completo ? ' sl__tubo--listo' : '') +
          (pistaMov && (pistaMov[0] === i || pistaMov[1] === i) ? ' sl__tubo--pista' : '');
        const segs = b.children;
        for (let k = 0; k < CAP; k++) {
          const c = t[k];
          // k = 0 es la base; los segmentos se dibujan de abajo hacia arriba por el CSS (column-reverse)
          segs[k].className = 'sl__seg' + (c !== undefined ? ' sl__seg--c' + (Number(c) + 1) : '');
        }
        b.setAttribute('aria-label', 'Tubo ' + (i + 1) + ', ' + (t.length ? 'colores de abajo hacia arriba: ' + t.split('').map((c) => Number(c) + 1).join(', ') : 'vacío') + (completo ? ', completo' : ''));
      });
      base.dato('mov', hist.length);
      const fin = base.fase() === 'ganado';
      if (base.accion('deshacer')) base.accion('deshacer').disabled = fin || !hist.length;
      if (base.accion('pista')) base.accion('pista').disabled = fin;
    }

    /* Volcado animado: el tubo se inclina sobre el otro, cae un chorro y el nivel baja en uno y sube en el otro */
    function cortarAnim() {
      if (!anim) return;
      anim.timers.forEach(clearTimeout);
      anim.limpiar();
      anim = null;
      pintar();
    }
    function animarVolcado(de, a, antes) {
      const origen = botones[de]; const destino = botones[a];
      const color = tope(antes[de]).color;
      const n = Math.min(tope(antes[de]).n, CAP - antes[a].length);
      if (reducido() || !origen.getBoundingClientRect || !zona.getBoundingClientRect().width) { pintar(); return; }
      const zr = zona.getBoundingClientRect(); const or = origen.getBoundingClientRect(); const dr = destino.getBoundingClientRect();
      const lado = dr.left >= or.left ? 1 : -1;
      // el tubo se inclina 62 grados y se coloca de modo que el pico quede sobre la boca del destino
      const ang = lado * 62 * Math.PI / 180;
      const vx = lado * or.width / 2; const vy = -or.height / 2;
      const picoX = vx * Math.cos(ang) - vy * Math.sin(ang);
      const picoY = vx * Math.sin(ang) + vy * Math.cos(ang);
      const dx = (dr.left + dr.width / 2 - picoX) - (or.left + or.width / 2);
      const dy = (dr.top - 14 - picoY) - (or.top + or.height / 2);
      const segH = origen.children[0].getBoundingClientRect().height;
      const nivelDestino = dr.bottom - 6 - antes[a].length * segH;
      const chorro = el('span', { clase: 'sl__chorro sl__seg--c' + (Number(color) + 1), attrs: { 'aria-hidden': 'true' } });
      chorro.style.left = (dr.left + dr.width / 2 - zr.left - 3) + 'px';
      chorro.style.top = (dr.top - 6 - zr.top) + 'px';
      chorro.style.height = Math.max(8, nivelDestino - dr.top + 6) + 'px';
      zona.append(chorro);
      // el origen sigue mostrando lo de antes mientras se vacía
      const segsO = origen.children; const segsD = destino.children;
      const topeO = antes[de].length;
      origen.style.zIndex = '5';
      origen.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (lado * 62) + 'deg)';
      origen.classList.add('sl__tubo--vierte');
      const timers = [];
      const limpiar = () => {
        origen.style.transform = ''; origen.style.zIndex = '';
        origen.classList.remove('sl__tubo--vierte');
        for (let k = 0; k < segsO.length; k++) { segsO[k].style.animation = ''; }
        for (let k = 0; k < segsD.length; k++) { segsD[k].style.animation = ''; }
        if (chorro.parentNode) chorro.remove();
      };
      anim = { timers, limpiar };
      timers.push(setTimeout(() => {
        chorro.classList.add('sl__chorro--cae');
        for (let k = 0; k < n; k++) {
          const s = segsO[topeO - 1 - k];
          if (s) s.style.animation = 'sl-vaciar .34s ' + (k * 0.12) + 's ease-in forwards';
        }
        // destino: se pinta con el estado nuevo y los segmentos que llegan suben de a poco
        const t = tubos[a];
        for (let k = 0; k < CAP; k++) {
          const c = t[k];
          segsD[k].className = 'sl__seg' + (c !== undefined ? ' sl__seg--c' + (Number(c) + 1) : '');
          if (k >= antes[a].length && c !== undefined) segsD[k].style.animation = 'sl-llenar .34s ' + ((k - antes[a].length) * 0.12 + 0.08) + 's ease-out backwards';
        }
      }, 260));
      timers.push(setTimeout(() => { chorro.classList.add('sl__chorro--corta'); }, 520));
      timers.push(setTimeout(() => { origen.style.transform = ''; origen.style.zIndex = '5'; }, 560));
      timers.push(setTimeout(() => { limpiar(); anim = null; pintar(); }, 820));
    }

    function tocar(i) {
      if (base.fase() === 'ganado') return;
      pistaMov = null;
      if (sel < 0) {
        if (!tubos[i].length) { notificar('Ese tubo está vacío.'); return; }
        sel = i; pintar(); return;
      }
      if (sel === i) { sel = -1; pintar(); return; }
      if (!puedeVolcar(tubos, sel, i)) {
        aviso.textContent = 'No se puede volcar ahí: tiene que estar vacío o tener el mismo color arriba, y con lugar.';
        if (tubos[i].length) sel = i; else sel = -1;
        pintar(); return;
      }
      aviso.textContent = '';
      cortarAnim();
      base.empezar();
      hist.push(tubos.slice());
      const de = sel;
      const antes = tubos;
      tubos = volcar(tubos, sel, i);
      sel = -1;
      base.sumarMov();
      animarVolcado(de, i, antes);
      if (resuelto(tubos)) {
        const n = hist.length;
        base.ganar({ titulo: 'Todo ordenado', mensaje: 'Lo resolviste en ' + n + (n === 1 ? ' movimiento.' : ' movimientos.'), valor: n });
      }
    }

    function deshacer() {
      if (!hist.length || base.fase() === 'ganado') return;
      cortarAnim();
      tubos = hist.pop();
      sel = -1; pistaMov = null;
      base.ponerMov(hist.length);
      pintar();
    }

    function pista() {
      if (base.fase() === 'ganado') return;
      cortarAnim();
      const r = resolver(tubos, 40000);
      if (!r || !r.length) { aviso.textContent = 'No encuentro una salida desde acá. Probá con Deshacer.'; return; }
      base.empezar();
      base.sumarPista();
      pistaMov = r[0]; sel = -1;
      aviso.textContent = 'Volcá el tubo ' + (r[0][0] + 1) + ' en el tubo ' + (r[0][1] + 1) + '.';
      pintar();
      notificar('Con pista, esta partida no suma a tus mejores marcas.');
    }

    base.arrancar();
    return {
      pruebas: { tocar, deshacer, pista, tubos: () => tubos.slice(), hist: () => hist.length },
      destruir() { cortarAnim(); base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.SortLiquid = { pruebas: () => (instancia ? instancia.pruebas : null), generar, resolver, puedeVolcar, volcar, resuelto, tope, CAP };
})(window);
