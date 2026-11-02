/* lights-out.js · Lights Out
   - Una grilla de luces. Al tocar una, cambia ella y sus vecinas de arriba, abajo, izquierda y derecha. Hay que apagarlas todas.
   - Tres tamaños: 4×4, 5×5 y 7×7. Los tableros se arman "apretando" luces desde todo apagado, así que siempre tienen solución.
   - Pista: te marca una luz que sirve para llegar a la solución (con pistas no entra en las mejores marcas).
   - Cronómetro (arranca con el primer toque), movimientos, guardado automático y mejores marcas por tamaño. */
(function (global) {
  'use strict';

  const ID = 'lights-out';
  const { el, notificar, celebrar } = global.Pasatiempos;

  const TAMANOS = {
    4: { nombre: 'Chico', n: 4 },
    5: { nombre: 'Mediano', n: 5 },
    7: { nombre: 'Grande', n: 7 }
  };
  const ORDEN = ['4', '5', '7'];

  /* ---------------------------------------------------------
     Motor. Las luces son una lista de 0/1 (1 = encendida).
     --------------------------------------------------------- */
  function apretar(luces, n, k) {
    const f = Math.floor(k / n), c = k % n;
    luces[k] ^= 1;
    if (f > 0) luces[k - n] ^= 1;
    if (f < n - 1) luces[k + n] ^= 1;
    if (c > 0) luces[k - 1] ^= 1;
    if (c < n - 1) luces[k + 1] ^= 1;
  }

  /* Arma un tablero: elige al azar qué luces apretar (la solución) y las aprieta sobre todo apagado */
  function generar(n) {
    for (;;) {
      const sol = new Array(n * n).fill(0);
      const luces = new Array(n * n).fill(0);
      let cuantas = 0;
      for (let k = 0; k < n * n; k++) {
        if (Math.random() < 0.5) { sol[k] = 1; apretar(luces, n, k); cuantas++; }
      }
      if (cuantas >= n && luces.some((v) => v === 1)) return { luces, sol };
    }
  }

  function consistente(luces, sol, n) {
    const copia = luces.slice();
    sol.forEach((v, k) => { if (v) apretar(copia, n, k); });
    return copia.every((v) => v === 0);
  }

  function crear(contenedor) {
    let tam = '5';
    let n = 5;
    let luces = [];
    let sol = [];       // luces que, apretadas, apagan todo desde el estado actual
    let mov = 0;
    let pistas = 0;
    let fase = 'listo'; // 'listo' | 'jugando' | 'ganado'
    let celdasEl = [];
    let pistaK = -1;
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valMov = el('span', { clase: 'dato__valor', texto: '0' });
    const valEnc = el('span', { clase: 'dato__valor', texto: '0' });
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
    const btnPista = el('button', { clase: 'btn btn--chico', texto: 'Pista', attrs: { type: 'button' } });
    btnPista.addEventListener('click', () => pista());

    const tablero = el('div', { clase: 'lo__tablero', attrs: { role: 'group', 'aria-label': 'Luces' } });

    const raiz = el('div', { clase: 'jg lo' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Encendidas' }), valEnc),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Toques' }), valMov),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        btnPista),
      el('div', { clase: 'lo__marco' }, tablero),
      el('p', { clase: 'jg__ayuda', texto: 'Apagá todas las luces. Cada toque cambia la luz elegida y las de al lado. Con las flechas te movés y con Enter o espacio tocás. El tiempo arranca con el primer toque.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function etiqueta(k) {
      return 'Fila ' + (Math.floor(k / n) + 1) + ', columna ' + ((k % n) + 1) + ', ' + (luces[k] ? 'encendida' : 'apagada');
    }

    function pintarCelda(k) {
      const c = celdasEl[k];
      c.classList.toggle('on', luces[k] === 1);
      c.classList.toggle('pista', k === pistaK);
      c.setAttribute('aria-pressed', String(luces[k] === 1));
      c.setAttribute('aria-label', etiqueta(k));
    }

    function actualizarCuenta() {
      valEnc.textContent = String(luces.reduce((a, v) => a + v, 0));
      valMov.textContent = String(mov);
    }

    function construir() {
      tablero.replaceChildren();
      tablero.style.setProperty('--n', String(n));
      celdasEl = [];
      for (let k = 0; k < n * n; k++) {
        const c = el('button', { clase: 'lo__celda', attrs: { type: 'button', 'data-k': String(k) } });
        c.addEventListener('click', () => tocar(k));
        celdasEl.push(c);
        tablero.append(c);
        pintarCelda(k);
      }
      ORDEN.forEach((id) => botonesTam[id].setAttribute('aria-pressed', String(id === tam)));
      actualizarCuenta();
    }

    function vecinos(k) {
      const f = Math.floor(k / n), c = k % n;
      const r = [k];
      if (f > 0) r.push(k - n);
      if (f < n - 1) r.push(k + n);
      if (c > 0) r.push(k - 1);
      if (c < n - 1) r.push(k + 1);
      return r;
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return { tam, luces: luces.join(''), sol: sol.join(''), mov, pistas, ms: Math.round(crono.transcurrido) };
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
      const g = generar(n);
      luces = g.luces;
      sol = g.sol;
      mov = 0;
      pistas = 0;
      pistaK = -1;
      fase = 'listo';
      Guardado.borrar(ID);
      Almacen.escribir('lights-out:tamano', id);
      crono.reiniciar(0);
      construir();
    }

    function pedirNueva(id) {
      if (fase === 'jugando' && mov > 0 && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function cargar(s) {
      tam = s.tam;
      n = TAMANOS[tam].n;
      luces = Array.from(s.luces, Number);
      sol = Array.from(s.sol, Number);
      mov = Number(s.mov) || 0;
      pistas = Number(s.pistas) || 0;
      pistaK = -1;
      fase = 'jugando';
      construir();
      crono.reiniciar(s.ms);
      crono.iniciar();
    }

    /* --- Jugada --- */
    function tocar(k) {
      if (fase === 'ganado') return;
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
      apretar(luces, n, k);
      sol[k] ^= 1;
      mov++;
      const vieja = pistaK;
      pistaK = -1;
      vecinos(k).forEach(pintarCelda);
      if (vieja >= 0) pintarCelda(vieja);
      actualizarCuenta();
      if (luces.every((v) => v === 0)) ganar();
      else guardarYa();
    }

    function pista() {
      if (fase === 'ganado') return;
      const candidatas = [];
      sol.forEach((v, k) => { if (v) candidatas.push(k); });
      if (!candidatas.length) return;
      if (pistaK >= 0) { const viejo = pistaK; pistaK = -1; pintarCelda(viejo); }
      pistaK = candidatas[Math.floor(Math.random() * candidatas.length)];
      pistas++;
      pintarCelda(pistaK);
      notificar('Tocá la luz marcada. Con pistas no entra en las mejores marcas.');
      if (fase === 'jugando') guardarYa();
    }

    function ganar() {
      fase = 'ganado';
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      let detalle;
      if (pistas > 0) {
        detalle = 'Usaste ' + pistas + (pistas === 1 ? ' pista' : ' pistas') + ': esta vez no entra en las mejores marcas.';
      } else {
        const r = Records.agregar(ID, tam, ms, { modo: 'menor' });
        if (r.esRecord) detalle = 'Nueva mejor marca en el tamaño ' + tam + '×' + tam;
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca en este tamaño es ' + Cronometro.formatear(Records.mejor(ID, tam)) + '.';
      }
      despues(() => celebrar({
        titulo: 'Todo apagado',
        mensaje: tam + '×' + tam + ' en ' + Cronometro.formatear(ms) + ' y ' + mov + ' toques.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(tam) },
          { texto: 'Cerrar' }
        ]
      }), 350);
    }

    /* --- Entrada: flechas para moverse entre luces --- */
    tablero.addEventListener('keydown', (ev) => {
      const o = ev.target;
      if (!o || !o.dataset || o.dataset.k === undefined) return;
      const k = Number(o.dataset.k);
      const f = Math.floor(k / n), c = k % n;
      let d = -1;
      if (ev.key === 'ArrowUp' && f > 0) d = k - n;
      else if (ev.key === 'ArrowDown' && f < n - 1) d = k + n;
      else if (ev.key === 'ArrowLeft' && c > 0) d = k - 1;
      else if (ev.key === 'ArrowRight' && c < n - 1) d = k + 1;
      else return;
      ev.preventDefault();
      celdasEl[d].focus();
    });

    /* --- Inicio --- */
    const guardado = Guardado.cargar(ID);
    const nn = guardado && TAMANOS[guardado.tam] ? TAMANOS[guardado.tam].n : 0;
    const ok = nn && typeof guardado.luces === 'string' && typeof guardado.sol === 'string'
      && guardado.luces.length === nn * nn && guardado.sol.length === nn * nn
      && /^[01]+$/.test(guardado.luces) && /^[01]+$/.test(guardado.sol)
      && guardado.luces.indexOf('1') >= 0
      && consistente(Array.from(guardado.luces, Number), Array.from(guardado.sol, Number), nn);
    if (ok) {
      cargar(guardado);
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ultimo = String(Almacen.leer('lights-out:tamano', '5'));
      nueva(TAMANOS[ultimo] ? ultimo : '5');
    }

    return {
      pruebas: { tocar, pista, luces: () => luces.slice(), sol: () => sol.slice() },
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
  global.LightsOut = { apretar, generar, consistente };
})(window);
