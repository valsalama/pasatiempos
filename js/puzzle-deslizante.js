/* puzzle-deslizante.js · Puzzle deslizante (el "juego del 15")
   - Ordená las fichas del 1 en adelante deslizándolas hacia el hueco.
   - Tres tamaños: 3×3, 4×4 y 5×5. Los tableros se arman mezclando desde el tablero resuelto, así que siempre tienen solución.
   - Tocá una ficha o arrastrala hacia el hueco (si está en la fila o columna del hueco, se mueven todas las del medio), o usá las flechas.
   - Cronómetro (arranca con el primer movimiento), movimientos, guardado automático y mejores marcas por tamaño. */
(function (global) {
  'use strict';

  const ID = 'puzzle-deslizante';
  const { el, notificar, celebrar } = global.Pasatiempos;

  const TAMANOS = {
    3: { nombre: 'Chico', n: 3 },
    4: { nombre: 'Mediano', n: 4 },
    5: { nombre: 'Grande', n: 5 }
  };
  const ORDEN = ['3', '4', '5'];

  /* ---------------------------------------------------------
     Motor. El tablero es una lista de n*n números; el 0 es el hueco.
     Resuelto: 1, 2, 3 … n*n-1, 0
     --------------------------------------------------------- */
  function resuelto(n) {
    const t = [];
    for (let i = 1; i < n * n; i++) t.push(i);
    t.push(0);
    return t;
  }

  function estaResuelto(t) {
    for (let i = 0; i < t.length - 1; i++) if (t[i] !== i + 1) return false;
    return t[t.length - 1] === 0;
  }

  /* Cuenta de inversiones, para saber si un tablero tiene solución */
  function tieneSolucion(t, n) {
    const fichas = t.filter((v) => v !== 0);
    let inv = 0;
    for (let i = 0; i < fichas.length; i++) for (let j = i + 1; j < fichas.length; j++) if (fichas[i] > fichas[j]) inv++;
    if (n % 2 === 1) return inv % 2 === 0;
    const filaDesdeAbajo = n - Math.floor(t.indexOf(0) / n);
    return (inv + filaDesdeAbajo) % 2 === 1;
  }

  function esPermutacion(t, n) {
    if (!Array.isArray(t) || t.length !== n * n) return false;
    const visto = new Set(t);
    if (visto.size !== n * n) return false;
    return t.every((v) => Number.isInteger(v) && v >= 0 && v < n * n);
  }

  function mezclado(n) {
    const t = resuelto(n);
    let hueco = t.length - 1;
    let anterior = -1;
    const pasos = n * n * 40;
    for (let i = 0; i < pasos; i++) {
      const f = Math.floor(hueco / n);
      const c = hueco % n;
      const vecinos = [];
      if (f > 0) vecinos.push(hueco - n);
      if (f < n - 1) vecinos.push(hueco + n);
      if (c > 0) vecinos.push(hueco - 1);
      if (c < n - 1) vecinos.push(hueco + 1);
      const posibles = vecinos.filter((v) => v !== anterior);
      const v = posibles[Math.floor(Math.random() * posibles.length)];
      t[hueco] = t[v];
      t[v] = 0;
      anterior = hueco;
      hueco = v;
    }
    return estaResuelto(t) ? mezclado(n) : t;
  }

  /* ---------------------------------------------------------
     Interfaz
     --------------------------------------------------------- */
  function crear(contenedor) {
    let tam = '3';
    let n = 3;
    let t = [];
    let mov = 0;
    let fase = 'listo'; // 'listo' | 'jugando' | 'ganado'
    let fichasEl = {};  // valor → elemento
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valMov = el('span', { clase: 'dato__valor', texto: '0' });
    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    const botonesTam = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Tamaño' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: TAMANOS[id].nombre + '\n' + id + '×' + id, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesTam[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(tam));

    const tablero = el('div', {
      clase: 'pz__tablero',
      attrs: { role: 'application', 'aria-label': 'Puzzle deslizante. Tocá una ficha o usá las flechas del teclado.', tabindex: '0' }
    });

    const raiz = el('div', { clase: 'jg pz' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Movimientos' }), valMov),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj))),
      el('div', { clase: 'pz__marco' }, tablero),
      el('p', { clase: 'jg__ayuda', texto: 'Ordená las fichas del 1 en adelante, con el hueco al final. Tocá una ficha para deslizarla o usá las flechas. El tiempo arranca con el primer movimiento.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function ubicar(v) {
      const k = t.indexOf(v);
      const e = fichasEl[v];
      e.style.setProperty('--f', String(Math.floor(k / n)));
      e.style.setProperty('--c', String(k % n));
      e.classList.toggle('ok', k === v - 1);
    }

    function construir() {
      tablero.replaceChildren();
      tablero.style.setProperty('--n', String(n));
      fichasEl = {};
      for (let v = 1; v < n * n; v++) {
        const b = el('button', { clase: 'pz__ficha', attrs: { type: 'button', 'aria-label': 'Ficha ' + v, tabindex: '-1' } },
          el('span', { clase: 'pz__num', texto: String(v) }));
        b.addEventListener('click', () => {
          if (arrastro) { arrastro = false; return; }   // el gesto de arrastre ya hizo (o no) su movimiento
          tocar(t.indexOf(v));
        });
        b.addEventListener('pointerdown', (ev) => empezarArrastre(ev, v));
        b.addEventListener('pointermove', moverArrastre);
        b.addEventListener('pointerup', soltarArrastre);
        b.addEventListener('pointercancel', cancelarArrastre);
        fichasEl[v] = b;
        tablero.append(b);
        ubicar(v);
      }
      ORDEN.forEach((id) => botonesTam[id].setAttribute('aria-pressed', String(id === tam)));
      valMov.textContent = String(mov);
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return { tam, t: t.join(','), mov, ms: Math.round(crono.transcurrido) };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    /* --- Partidas --- */
    function nueva(id) {
      tam = id;
      n = TAMANOS[id].n;
      t = mezclado(n);
      mov = 0;
      fase = 'listo';
      Guardado.borrar(ID);
      Almacen.escribir('puzzle-deslizante:tamano', id);
      crono.reiniciar(0);
      construir();
      tablero.focus({ preventScroll: true });
    }

    function pedirNueva(id) {
      if (fase === 'jugando' && mov > 0 && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function cargar(s) {
      tam = s.tam;
      n = TAMANOS[tam].n;
      t = s.t.split(',').map(Number);
      mov = Number(s.mov) || 0;
      fase = 'jugando';
      construir();
      crono.reiniciar(s.ms);
      crono.iniciar();
    }

    /* --- Movimiento --- */
    /* Toca la ficha que está en la posición k: si comparte fila o columna con el hueco, se corre todo el tramo */
    function tocar(k) {
      if (fase === 'ganado' || k < 0) return false;
      const h = t.indexOf(0);
      const fk = Math.floor(k / n), ck = k % n;
      const fh = Math.floor(h / n), ch = h % n;
      if (k === h || (fk !== fh && ck !== ch)) return false;

      const paso = fk === fh ? (k < h ? 1 : -1) : (k < h ? n : -n);
      const movidas = [];
      // Desde el hueco hacia la ficha tocada, cada ficha pasa a ocupar el lugar anterior
      let pos = h;
      while (pos !== k) {
        const origen = pos - paso;
        t[pos] = t[origen];
        movidas.push(t[pos]);
        pos = origen;
      }
      t[k] = 0;
      mov++;
      valMov.textContent = String(mov);
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
      movidas.forEach(ubicar);
      if (estaResuelto(t)) ganar();
      else guardarYa();
      return true;
    }

    /* --- Arrastre: se deslizan con el dedo o el mouse hacia el hueco --- */
    let arr = null;       // {v, k, dx, dy, tramo:[valores], x0, y0, d, celda}
    let arrastro = false;

    function empezarArrastre(ev, v) {
      arrastro = false;
      if (fase === 'ganado' || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      const k = t.indexOf(v), h = t.indexOf(0);
      const fk = Math.floor(k / n), ck = k % n, fh = Math.floor(h / n), ch = h % n;
      if (fk !== fh && ck !== ch) return;
      const dx = fk === fh ? (ck < ch ? 1 : -1) : 0;
      const dy = fk === fh ? 0 : (fk < fh ? 1 : -1);
      const paso = dx + dy * n;
      const tramo = [];
      for (let q = k; q !== h; q += paso) tramo.push(t[q]);
      const r = tablero.getBoundingClientRect();
      arr = { v, k, dx, dy, tramo, x0: ev.clientX, y0: ev.clientY, d: 0, celda: (r.width || 300) / n, mueve: false, id: ev.pointerId };
      if (ev.target.setPointerCapture) { try { ev.target.setPointerCapture(ev.pointerId); } catch (e) { /* sin captura */ } }
    }

    function moverArrastre(ev) {
      if (!arr || ev.pointerId !== arr.id) return;
      const proy = (ev.clientX - arr.x0) * arr.dx + (ev.clientY - arr.y0) * arr.dy;
      const perp = Math.abs((ev.clientX - arr.x0) * arr.dy) + Math.abs((ev.clientY - arr.y0) * arr.dx);
      if (!arr.mueve && Math.max(Math.abs(proy), perp) < 6) return;
      arr.mueve = true;
      arr.d = Math.max(0, Math.min(arr.celda, proy));
      arr.tramo.forEach((val) => {
        const e = fichasEl[val];
        const kk = t.indexOf(val);
        e.classList.add('arrastrando');
        e.style.transform = 'translate(calc(' + (kk % n) + ' * 100% + ' + (arr.dx * arr.d).toFixed(1) + 'px), calc(' + Math.floor(kk / n) + ' * 100% + ' + (arr.dy * arr.d).toFixed(1) + 'px))';
      });
    }

    function terminarVisual() {
      if (!arr) return;
      arr.tramo.forEach((val) => {
        const e = fichasEl[val];
        e.classList.remove('arrastrando');
        e.style.transform = '';
      });
    }

    function soltarArrastre(ev) {
      if (!arr || ev.pointerId !== arr.id) return;
      const a = arr;
      arrastro = a.mueve;
      terminarVisual();
      arr = null;
      if (a.mueve && a.d > a.celda * 0.3) tocar(a.k);
      // Si fue un toque corto, el evento click que sigue lo resuelve
    }

    function cancelarArrastre() {
      if (!arr) return;
      terminarVisual();
      arr = null;
      arrastro = false;
    }

    /* Las flechas mueven la ficha que está del otro lado del hueco: con "arriba" sube la que está debajo */
    function moverFlecha(dir) {
      const h = t.indexOf(0);
      const f = Math.floor(h / n), c = h % n;
      let k = -1;
      if (dir === 'arr' && f < n - 1) k = h + n;
      if (dir === 'aba' && f > 0) k = h - n;
      if (dir === 'izq' && c < n - 1) k = h + 1;
      if (dir === 'der' && c > 0) k = h - 1;
      if (k >= 0) tocar(k);
    }

    function ganar() {
      fase = 'ganado';
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      const r = Records.agregar(ID, tam, ms, { modo: 'menor' });
      let detalle;
      if (r.esRecord) detalle = 'Nueva mejor marca en el tamaño ' + tam + '×' + tam;
      else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
      else detalle = 'Tu mejor marca en este tamaño es ' + Cronometro.formatear(Records.mejor(ID, tam)) + '.';
      despues(() => celebrar({
        titulo: 'Puzzle ordenado',
        mensaje: tam + '×' + tam + ' en ' + Cronometro.formatear(ms) + ' y ' + mov + ' movimientos.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(tam) },
          { texto: 'Cerrar' }
        ]
      }), 350);
    }

    /* --- Entrada --- */
    const TECLAS = {
      ArrowUp: 'arr', ArrowDown: 'aba', ArrowLeft: 'izq', ArrowRight: 'der',
      w: 'arr', W: 'arr', s: 'aba', S: 'aba', a: 'izq', A: 'izq', d: 'der', D: 'der'
    };
    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const dir = TECLAS[ev.key];
      if (!dir) return;
      const o = ev.target;
      if (o && (o.tagName === 'INPUT' || o.tagName === 'SELECT' || o.tagName === 'TEXTAREA')) return;
      ev.preventDefault();
      moverFlecha(dir);
    }
    document.addEventListener('keydown', alTecla);

    /* --- Inicio --- */
    const guardado = Guardado.cargar(ID);
    const sn = guardado && TAMANOS[guardado.tam] ? TAMANOS[guardado.tam].n : 0;
    const lista = guardado && typeof guardado.t === 'string' ? guardado.t.split(',').map(Number) : null;
    if (sn && lista && esPermutacion(lista, sn) && tieneSolucion(lista, sn) && !estaResuelto(lista)) {
      cargar(guardado);
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ultimo = Almacen.leer('puzzle-deslizante:tamano', '3');
      nueva(TAMANOS[ultimo] ? String(ultimo) : '3');
    }

    return {
      pruebas: { tocar, moverFlecha, estado: () => t.slice() },
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
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() {
      if (instancia) { instancia.destruir(); instancia = null; }
    }
  });
  global.PuzzleDeslizante = { mezclado, tieneSolucion, estaResuelto, resuelto };
})(window);
