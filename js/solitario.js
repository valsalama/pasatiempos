/* solitario.js · Etapa 10: Solitario Klondike
   - El solitario clásico con baraja francesa. Hay que subir las 52 cartas a las cuatro pilas de arriba, cada palo en orden, del A al K.
   - En las siete columnas se arma en orden descendente alternando colores (rojo y negro). Un rey puede ocupar una columna vacía.
   - Tocá una carta para elegirla (con ella se mueven las que tiene encima) y después tocá el lugar de destino.
     Si tocás de nuevo la carta elegida, sube sola a su pila si puede.
   - También podés arrastrar las cartas con el dedo o el mouse. Si soltás una carta que puede subir en cualquier lugar de las pilas de arriba,
     va sola a la pila de su palo.
   - Dos modos: robar de a 1 carta (más fácil) o de a 3 (clásico). Se puede deshacer.
   - Cronómetro (arranca con el primer movimiento), movimientos, guardado automático y mejores marcas por modo.
   - Los mazos se mezclan al azar: algunos no tienen solución, como en el solitario de verdad. */
(function (global) {
  'use strict';

  const ID = 'solitario';
  const { el, notificar, celebrar } = global.Pasatiempos;

  const MODOS = { 1: 'Robar de a 1', 3: 'Robar de a 3' };
  const ORDEN = ['1', '3'];
  const RANGOS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const NOMBRES_PALO = ['picas', 'corazones', 'diamantes', 'tréboles'];
  const PALOS_SVG = [
    'M12 2C6 8 3 11 3 14.5a4.5 4.5 0 0 0 8 2.5c0 2-.5 3.5-2 5h6c-1.5-1.5-2-3-2-5a4.5 4.5 0 0 0 8-2.5C21 11 18 8 12 2z',
    'M12 21C5 15 2 11.5 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 3.5-3 7-10 13z',
    'M12 2l8 10-8 10-8-10z',
    'M12 2.5a4.3 4.3 0 0 0-3 7.4 4.3 4.3 0 1 0 1.9 7.1c0 2-.5 3.4-2 5h6.2c-1.5-1.6-2-3-2-5a4.3 4.3 0 1 0 1.9-7.1A4.3 4.3 0 0 0 12 2.5z'
  ];
  const palo = (id) => Math.floor(id / 13);
  const rango = (id) => id % 13;
  const rojo = (id) => palo(id) === 1 || palo(id) === 2;
  const nombreCarta = (id) => RANGOS[rango(id)] + ' de ' + NOMBRES_PALO[palo(id)];

  const NS = 'http://www.w3.org/2000/svg';
  function iconoPalo(p) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'kl__palo');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', PALOS_SVG[p]);
    path.setAttribute('fill', 'currentColor');
    svg.append(path);
    return svg;
  }

  function mazoMezclado() {
    const m = [];
    for (let i = 0; i < 52; i++) m.push(i);
    for (let i = m.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [m[i], m[j]] = [m[j], m[i]];
    }
    return m;
  }

  function crear(contenedor) {
    let modo = '1';
    let t = [];          // 7 columnas: [{c, u}]
    let s = [];          // mazo para robar (se roba del final)
    let w = [];          // descarte (la de arriba es la última)
    let wv = 0;          // cuántas del descarte se ven en abanico
    let f = [0, 0, 0, 0]; // cartas subidas por palo
    let mov = 0;
    let sel = null;      // {de:'t',col,idx} | {de:'w'} | {de:'f',palo}
    let historial = [];
    let fase = 'listo';  // 'listo' | 'jugando' | 'ganado'
    let destruido = false;
    let ocupado = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valMov = el('span', { clase: 'dato__valor', texto: '0' });
    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    const botonesM = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Modo' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: MODOS[id], attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesM[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(modo));
    const btnDeshacer = el('button', { clase: 'btn', texto: 'Deshacer', attrs: { type: 'button' } });
    const btnSubir = el('button', { clase: 'btn', texto: 'Subir todas', attrs: { type: 'button' } });
    btnDeshacer.addEventListener('click', deshacer);
    btnSubir.addEventListener('click', subirTodas);

    const mesa = el('div', { clase: 'kl__mesa' });
    const raiz = el('div', { clase: 'jg kl' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Movimientos' }), valMov),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        el('div', { clase: 'jg__acciones' }, btnDeshacer, btnSubir)),
      mesa,
      el('p', { clase: 'jg__ayuda', texto: 'Subí todas las cartas a las pilas de arriba, cada palo del A al K. En las columnas se arma en orden descendente alternando rojo y negro; solo un rey puede ocupar una columna vacía. Tocá una carta para elegirla y después tocá dónde va. Si tocás de nuevo la carta elegida, sube sola a su pila si puede. Tocá el mazo para robar.' })
    );
    contenedor.append(raiz);

    /* --- Reglas --- */
    function cartasDe(origen) {
      if (!origen) return [];
      if (origen.de === 't') return t[origen.col].slice(origen.idx).map((x) => x.c);
      if (origen.de === 'w') return w.length ? [w[w.length - 1]] : [];
      if (origen.de === 'f') return f[origen.palo] > 0 ? [origen.palo * 13 + f[origen.palo] - 1] : [];
      return [];
    }

    function puedeAColumna(carta, col) {
      const c = t[col];
      if (!c.length) return rango(carta) === 12;
      const top = c[c.length - 1];
      return top.u && rojo(top.c) !== rojo(carta) && rango(top.c) === rango(carta) + 1;
    }

    function puedeAPila(cartas) {
      return cartas.length === 1 && rango(cartas[0]) === f[palo(cartas[0])];
    }

    /* --- Historial --- */
    function foto() {
      return JSON.stringify({ t, s, w, wv, f });
    }
    function guardarFoto() {
      historial.push(foto());
      if (historial.length > 300) historial.shift();
    }
    function restaurar(txt) {
      const o = JSON.parse(txt);
      t = o.t; s = o.s; w = o.w; wv = o.wv; f = o.f;
    }

    /* --- Dibujo --- */
    function cartaEl(id, extra) {
      const b = el('button', { clase: 'kl__carta ' + (rojo(id) ? 'rojo' : 'negro') + (extra ? ' ' + extra : ''), attrs: { type: 'button', 'aria-label': nombreCarta(id) } });
      b.append(
        el('span', { clase: 'kl__rango', texto: RANGOS[rango(id)] }),
        iconoPalo(palo(id)),
        (() => { const g = iconoPalo(palo(id)); g.setAttribute('class', 'kl__palo kl__palo--grande'); return g; })());
      return b;
    }
    function dorsoEl(extra) {
      return el('button', { clase: 'kl__carta kl__dorso' + (extra ? ' ' + extra : ''), attrs: { type: 'button', 'aria-label': 'Carta boca abajo', tabindex: '-1' } });
    }

    function pintar() {
      mesa.replaceChildren();
      const arriba = el('div', { clase: 'kl__arriba' });

      // Mazo
      const mazo = el('div', { clase: 'kl__celda' });
      const bMazo = s.length
        ? dorsoEl('kl__mazo')
        : el('button', { clase: 'kl__carta kl__hueco kl__reciclar', attrs: { type: 'button', 'aria-label': w.length ? 'Dar vuelta el descarte para robar de nuevo' : 'Mazo vacío' } });
      if (s.length) { bMazo.setAttribute('aria-label', 'Robar del mazo, quedan ' + s.length); bMazo.removeAttribute('tabindex'); }
      else bMazo.append(el('span', { clase: 'kl__vuelta', texto: w.length ? '↺' : '' }));
      bMazo.addEventListener('click', robar);
      mazo.append(bMazo);
      arriba.append(mazo);

      // Descarte
      const desc = el('div', { clase: 'kl__descarte' });
      const vis = w.length ? Math.max(1, Math.min(wv, w.length, 3)) : 0;
      for (let i = vis; i >= 1; i--) {
        const id = w[w.length - i];
        const esTop = i === 1;
        const c = cartaEl(id, esTop && sel && sel.de === 'w' ? 'elegida' : '');
        if (!esTop) { c.disabled = true; c.setAttribute('tabindex', '-1'); }
        else { c.addEventListener('click', () => tocar({ de: 'w' })); c.dataset.de = 'w'; }
        desc.append(c);
      }
      if (!vis) desc.append(el('span', { clase: 'kl__carta kl__hueco', attrs: { 'aria-hidden': 'true' } }));
      arriba.append(desc);

      // Pilas
      const pilas = el('div', { clase: 'kl__pilas' });
      for (let p = 0; p < 4; p++) {
        const cel = el('div', { clase: 'kl__celda' });
        let b;
        if (f[p] > 0) {
          b = cartaEl(p * 13 + f[p] - 1, sel && sel.de === 'f' && sel.palo === p ? 'elegida' : '');
        } else {
          b = el('button', { clase: 'kl__carta kl__hueco kl__pila-vacia ' + (p === 1 || p === 2 ? 'rojo' : 'negro'), attrs: { type: 'button', 'aria-label': 'Pila de ' + NOMBRES_PALO[p] + ', vacía' } });
          b.append(iconoPalo(p));
        }
        b.addEventListener('click', () => tocar({ de: 'f', palo: p }));
        if (f[p] > 0) { b.dataset.de = 'f'; b.dataset.palo = String(p); }
        cel.append(b);
        pilas.append(cel);
      }
      arriba.append(pilas);
      mesa.append(arriba);

      // Columnas
      const cols = el('div', { clase: 'kl__cols' });
      t.forEach((col, ci) => {
        const c = el('div', { clase: 'kl__col' });
        const hueco = el('button', { clase: 'kl__carta kl__hueco', attrs: { type: 'button', 'aria-label': 'Columna ' + (ci + 1) + (col.length ? '' : ', vacía') } });
        hueco.addEventListener('click', () => tocar({ de: 'c', col: ci }));
        c.append(hueco);
        col.forEach((x, k) => {
          const prev = k === 0 ? 'ninguna' : (col[k - 1].u ? 'arriba' : 'abajo');
          let b;
          if (x.u) {
            const enSel = sel && sel.de === 't' && sel.col === ci && k >= sel.idx;
            b = cartaEl(x.c, enSel ? 'elegida' : '');
            b.addEventListener('click', () => tocar({ de: 't', col: ci, idx: k }));
            b.dataset.de = 't'; b.dataset.col = String(ci); b.dataset.idx = String(k);
          } else {
            b = dorsoEl();
          }
          b.dataset.prev = prev;
          c.append(b);
        });
        cols.append(c);
      });
      mesa.append(cols);

      valMov.textContent = String(mov);
      ORDEN.forEach((id) => botonesM[id].setAttribute('aria-pressed', String(id === modo)));
      btnDeshacer.disabled = !historial.length || fase === 'ganado';
      btnSubir.disabled = fase === 'ganado';
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return { modo, t: t.map((c) => c.map((x) => x.c * 2 + (x.u ? 1 : 0))), s, w, wv, f, mov, ms: Math.round(crono.transcurrido) };
    }
    function guardarYa() {
      const x = serializar();
      if (x) Guardado.guardar(ID, x);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    function validoGuardado(g) {
      if (!g || !ORDEN.includes(String(g.modo)) || !Array.isArray(g.t) || g.t.length !== 7) return false;
      if (!Array.isArray(g.s) || !Array.isArray(g.w) || !Array.isArray(g.f) || g.f.length !== 4) return false;
      const vistas = new Set();
      const agregar = (id) => {
        if (!Number.isInteger(id) || id < 0 || id > 51 || vistas.has(id)) return false;
        vistas.add(id);
        return true;
      };
      for (const col of g.t) {
        if (!Array.isArray(col)) return false;
        for (const v of col) { if (!Number.isInteger(v) || !agregar(v >> 1)) return false; }
      }
      for (const id of g.s) if (!agregar(id)) return false;
      for (const id of g.w) if (!agregar(id)) return false;
      for (let p = 0; p < 4; p++) {
        if (!Number.isInteger(g.f[p]) || g.f[p] < 0 || g.f[p] > 13) return false;
        for (let r = 0; r < g.f[p]; r++) if (!agregar(p * 13 + r)) return false;
      }
      return vistas.size === 52;
    }

    /* --- Partidas --- */
    function nueva(m) {
      modo = m;
      const mazo = mazoMezclado();
      t = [];
      for (let i = 0; i < 7; i++) {
        const col = [];
        for (let k = 0; k <= i; k++) col.push({ c: mazo.pop(), u: k === i });
        t.push(col);
      }
      s = mazo;
      w = [];
      wv = 0;
      f = [0, 0, 0, 0];
      mov = 0;
      sel = null;
      historial = [];
      fase = 'listo';
      ocupado = false;
      Guardado.borrar(ID);
      Almacen.escribir('solitario:modo', m);
      crono.reiniciar(0);
      pintar();
    }

    function pedirNueva(m) {
      if (fase === 'jugando' && mov > 0 && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(m);
    }

    function cargar(g) {
      modo = String(g.modo);
      t = g.t.map((col) => col.map((v) => ({ c: v >> 1, u: !!(v & 1) })));
      s = g.s.slice();
      w = g.w.slice();
      wv = Number(g.wv) || 0;
      f = g.f.slice();
      mov = Number(g.mov) || 0;
      sel = null;
      historial = [];
      fase = 'jugando';
      pintar();
      crono.reiniciar(g.ms);
      crono.iniciar();
    }

    /* --- Jugadas --- */
    function empezar() {
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
    }

    function voltear(col) {
      const c = t[col];
      if (c.length && !c[c.length - 1].u) c[c.length - 1].u = true;
    }

    function quitarOrigen(origen) {
      if (origen.de === 't') {
        const cs = t[origen.col].splice(origen.idx);
        voltear(origen.col);
        return cs.map((x) => x.c);
      }
      if (origen.de === 'w') {
        const c = w.pop();
        wv = Math.max(0, wv - 1);
        return [c];
      }
      const c = origen.palo * 13 + f[origen.palo] - 1;
      f[origen.palo]--;
      return [c];
    }

    function moverA(origen, destino) {
      guardarFoto();
      empezar();
      const cartas = quitarOrigen(origen);
      if (destino.de === 'c') cartas.forEach((c) => t[destino.col].push({ c, u: true }));
      else f[palo(cartas[0])]++;
      mov++;
      sel = null;
      pintar();
      comprobar();
      if (fase === 'jugando') guardarYa();
    }

    function robar() {
      if (ocupado || fase === 'ganado') return;
      sel = null;
      if (s.length) {
        guardarFoto();
        empezar();
        const n = Math.min(Number(modo), s.length);
        for (let i = 0; i < n; i++) w.push(s.pop());
        wv = n;
        mov++;
      } else if (w.length) {
        guardarFoto();
        empezar();
        s = w.reverse();
        w = [];
        wv = 0;
        mov++;
      } else {
        return;
      }
      pintar();
      guardarYa();
    }

    function tocar(objetivo) {
      if (ocupado || fase === 'ganado') return;
      // Sin nada elegido: elegir
      if (!sel) {
        if (objetivo.de === 'c') return;
        if (cartasDe(objetivo).length === 0) return;
        sel = objetivo;
        pintar();
        return;
      }
      const mismo = objetivo.de === sel.de &&
        (objetivo.de === 'w' || (objetivo.de === 'f' && objetivo.palo === sel.palo) || (objetivo.de === 't' && objetivo.col === sel.col && objetivo.idx === sel.idx));
      const cartas = cartasDe(sel);
      if (mismo) {
        // Tocar de nuevo la carta elegida: subirla si se puede
        if (sel.de !== 'f' && puedeAPila(cartas)) moverA(sel, { de: 'f' });
        else { sel = null; pintar(); }
        return;
      }
      // Destino: pila
      if (objetivo.de === 'f') {
        if (sel.de !== 'f' && puedeAPila(cartas) && palo(cartas[0]) === objetivo.palo) { moverA(sel, { de: 'f' }); return; }
        if (f[objetivo.palo] > 0 && sel.de !== 'f') { sel = objetivo; pintar(); return; }
        sel = null; pintar();
        return;
      }
      // Destino: columna (por hueco o por carta)
      const col = objetivo.col;
      if (objetivo.de === 'c' || objetivo.de === 't') {
        if (!(sel.de === 't' && sel.col === col) && puedeAColumna(cartas[0], col)) { moverA(sel, { de: 'c', col }); return; }
      }
      // Si no se puede, cambiar de carta elegida o soltar
      if (objetivo.de === 't' || objetivo.de === 'w') { sel = objetivo; pintar(); return; }
      sel = null;
      pintar();
    }

    /* --- Arrastre con el dedo o el mouse --- */
    let gesto = null;        // {origen, x0, y0, ox, oy, ancho, activo, fantasma, elementos, id}
    let suprimir = false;

    mesa.addEventListener('click', (ev) => {
      if (suprimir) { suprimir = false; ev.stopPropagation(); ev.preventDefault(); }
    }, true);

    function origenDe(carta) {
      const de = carta.dataset.de;
      if (de === 't') return { de, col: Number(carta.dataset.col), idx: Number(carta.dataset.idx) };
      if (de === 'f') return { de, palo: Number(carta.dataset.palo) };
      return { de: 'w' };
    }

    mesa.addEventListener('pointerdown', (ev) => {
      if (ocupado || fase === 'ganado' || gesto) return;
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      const carta = ev.target.closest && ev.target.closest('.kl__carta[data-de]');
      if (!carta) return;
      const r = carta.getBoundingClientRect();
      gesto = { origen: origenDe(carta), x0: ev.clientX, y0: ev.clientY, ox: ev.clientX - r.left, oy: ev.clientY - r.top, ancho: r.width, activo: false, fantasma: null, elementos: [], id: ev.pointerId, carta };
      suprimir = false;
    });

    function elementosDe(origen) {
      const cols = mesa.querySelectorAll('.kl__col');
      if (origen.de === 't') {
        const hijos = Array.from(cols[origen.col].children).slice(1 + origen.idx);
        return hijos;
      }
      return [gesto.carta];
    }

    function empezarGesto() {
      gesto.activo = true;
      sel = null;
      const cartas = cartasDe(gesto.origen);
      if (!cartas.length) { gesto = null; return; }
      gesto.elementos = elementosDe(gesto.origen);
      gesto.elementos.forEach((e) => e.classList.add('kl__origen'));
      const fan = el('div', { clase: 'kl__fantasma', attrs: { 'aria-hidden': 'true' } });
      fan.style.width = gesto.ancho + 'px';
      cartas.forEach((id, i) => {
        const c = cartaEl(id);
        c.tabIndex = -1;
        c.style.position = 'absolute';
        c.style.left = '0';
        c.style.top = (i * gesto.ancho * 0.4) + 'px';
        c.style.width = gesto.ancho + 'px';
        fan.append(c);
      });
      mesa.append(fan);
      gesto.fantasma = fan;
      try { mesa.setPointerCapture(gesto.id); } catch (e) { /* sin captura */ }
    }

    mesa.addEventListener('pointermove', (ev) => {
      if (!gesto || ev.pointerId !== gesto.id) return;
      if (!gesto.activo) {
        if (Math.hypot(ev.clientX - gesto.x0, ev.clientY - gesto.y0) < 7) return;
        empezarGesto();
        if (!gesto) return;
      }
      ev.preventDefault();
      gesto.fantasma.style.transform = 'translate(' + (ev.clientX - gesto.ox) + 'px, ' + (ev.clientY - gesto.oy) + 'px)';
    });

    function destinoEn(x, y) {
      const pilas = mesa.querySelector('.kl__pilas');
      const cols = Array.from(mesa.querySelectorAll('.kl__col'));
      const rp = pilas.getBoundingClientRect();
      const margen = 14;
      if (x >= rp.left - margen && x <= rp.right + margen && y >= rp.top - margen && y <= rp.bottom + margen) return { de: 'f' };
      const contenedor = mesa.querySelector('.kl__cols').getBoundingClientRect();
      if (y < contenedor.top - 30) return null;
      let mejor = -1, dist = Infinity;
      cols.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const cx = (r.left + r.right) / 2;
        const d = Math.abs(x - cx);
        if (d < dist) { dist = d; mejor = i; }
      });
      const r0 = cols[mejor].getBoundingClientRect();
      if (dist > r0.width * 0.8) return null;
      return { de: 'c', col: mejor };
    }

    function terminarGesto(ev, cancelar) {
      if (!gesto || (ev && ev.pointerId !== gesto.id)) return;
      const g = gesto;
      gesto = null;
      if (!g.activo) return;                 // fue un toque: lo resuelve el click
      suprimir = true;
      setTimeout(() => { suprimir = false; }, 350);
      try { mesa.releasePointerCapture(g.id); } catch (e) { /* ya soltado */ }
      if (g.fantasma) g.fantasma.remove();
      g.elementos.forEach((e) => e.classList.remove('kl__origen'));
      if (cancelar) { pintar(); return; }
      const dest = destinoEn(ev.clientX, ev.clientY);
      const cartas = cartasDe(g.origen);
      if (dest && cartas.length) {
        if (dest.de === 'f' && g.origen.de !== 'f' && puedeAPila(cartas)) { moverA(g.origen, { de: 'f' }); return; }
        if (dest.de === 'c' && !(g.origen.de === 't' && g.origen.col === dest.col) && puedeAColumna(cartas[0], dest.col)) { moverA(g.origen, { de: 'c', col: dest.col }); return; }
        if (dest.de === 'f' || dest.de === 'c') notificar('Ese movimiento no se puede.');
      }
      pintar();
    }
    mesa.addEventListener('pointerup', (ev) => terminarGesto(ev, false));
    mesa.addEventListener('pointercancel', (ev) => terminarGesto(ev, true));

    function deshacer() {
      if (ocupado || !historial.length || fase === 'ganado') return;
      restaurar(historial.pop());
      sel = null;
      mov++;
      pintar();
      guardarYa();
    }

    function proximaSubida() {
      if (w.length && puedeAPila([w[w.length - 1]])) return { de: 'w' };
      for (let i = 0; i < 7; i++) {
        const c = t[i];
        if (c.length && c[c.length - 1].u && puedeAPila([c[c.length - 1].c])) return { de: 't', col: i, idx: c.length - 1 };
      }
      return null;
    }

    function subirTodas() {
      if (ocupado || fase === 'ganado') return;
      const o = proximaSubida();
      if (!o) { notificar('No hay cartas para subir por ahora.'); return; }
      ocupado = true;
      const paso = () => {
        const x = proximaSubida();
        if (!x || fase === 'ganado') { ocupado = false; return; }
        ocupado = false;
        moverA(x, { de: 'f' });
        ocupado = true;
        if (fase !== 'ganado') despues(paso, 90);
        else ocupado = false;
      };
      paso();
    }

    function comprobar() {
      if (f.every((n) => n === 13)) ganar();
    }

    function ganar() {
      fase = 'ganado';
      ocupado = false;
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      pintar();
      const r = Records.agregar(ID, modo, ms, { modo: 'menor' });
      let detalle;
      if (r.esRecord) detalle = 'Nueva mejor marca (' + MODOS[modo].toLowerCase() + ')';
      else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
      else detalle = 'Tu mejor marca con ' + MODOS[modo].toLowerCase() + ' es ' + Cronometro.formatear(Records.mejor(ID, modo)) + '.';
      despues(() => celebrar({
        titulo: 'Solitario resuelto',
        mensaje: 'Lo ganaste en ' + Cronometro.formatear(ms) + ' y ' + mov + ' movimientos.',
        detalle,
        botones: [{ texto: 'Nuevo juego', primario: true, alClick: () => nueva(modo) }, { texto: 'Cerrar' }]
      }), 350);
    }

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    if (validoGuardado(guardado)) {
      cargar(guardado);
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ult = String(Almacen.leer('solitario:modo', '1'));
      nueva(ORDEN.includes(ult) ? ult : '1');
    }

    return {
      pruebas: { estado: () => ({ t, s, w, f, mov, fase, modo }), tocar, robar },
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
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() {
      if (instancia) { instancia.destruir(); instancia = null; }
    }
  });
})(window);
