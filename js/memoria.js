/* memoria.js · Memoria
   - Cartas boca abajo: das vuelta dos por vez y buscás las parejas.
   - Cuatro niveles (de 6 a 15 parejas). Las figuras son formas con color, sin letras ni dibujos de moda.
   - Cronómetro (arranca con la primera carta), movimientos, guardado automático y mejores marcas por nivel. */
(function (global) {
  'use strict';

  const ID = 'memoria';
  const { el, notificar, celebrar } = global.Pasatiempos;

  const NIVELES = {
    facil: { nombre: 'Fácil', pares: 6, cols: 4 },
    medio: { nombre: 'Medio', pares: 8, cols: 4 },
    dificil: { nombre: 'Difícil', pares: 10, cols: 5 },
    experto: { nombre: 'Experto', pares: 15, cols: 6 }
  };
  const ORDEN = ['facil', 'medio', 'dificil', 'experto'];

  // Figuras en una grilla de 24×24. Se pintan con el color de texto de cada carta.
  const FIGURAS = [
    { n: 'círculo', d: '<circle cx="12" cy="12" r="8.5"/>' },
    { n: 'cuadrado', d: '<rect x="4" y="4" width="16" height="16"/>' },
    { n: 'triángulo', d: '<path d="M12 3l9.5 17.5h-19z"/>' },
    { n: 'rombo', d: '<path d="M12 2l9 10-9 10-9-10z"/>' },
    { n: 'estrella', d: '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z"/>' },
    { n: 'corazón', d: '<path d="M12 21C4 15 2 11 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 3-2 7-10 13z"/>' },
    { n: 'cruz', d: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>' },
    { n: 'anillo', d: '<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="4"/>' },
    { n: 'luna', d: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>' },
    { n: 'hexágono', d: '<path d="M12 2l8.7 5v10L12 22l-8.7-5V7z"/>' },
    { n: 'rayo', d: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
    { n: 'gota', d: '<path d="M12 2c4 5 7 8 7 12a7 7 0 0 1-14 0c0-4 3-7 7-12z"/>' },
    { n: 'flecha', d: '<path d="M12 2l9 10h-5v10H8V12H3z"/>' },
    { n: 'bandera', d: '<path d="M5 3h2v18H5zM8 4l12 5-12 5z"/>' },
    { n: 'casa', d: '<path d="M12 3l9 7v11H3V10z"/>' }
  ];

  function svgFigura(k) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + FIGURAS[k].d + '</svg>';
  }

  function mezclar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  }

  /* Elige `pares` figuras distintas, las duplica y las mezcla */
  function generarMazo(pares) {
    const figuras = mezclar(FIGURAS.map((_, k) => k)).slice(0, pares);
    return mezclar(figuras.concat(figuras));
  }

  function mazoValido(s) {
    const nv = NIVELES[s && s.nivel];
    if (!nv || !Array.isArray(s.mazo) || s.mazo.length !== nv.pares * 2) return false;
    if (typeof s.halladas !== 'string' || s.halladas.length !== s.mazo.length) return false;
    const cuenta = {};
    for (const f of s.mazo) {
      if (!Number.isInteger(f) || f < 0 || f >= FIGURAS.length) return false;
      cuenta[f] = (cuenta[f] || 0) + 1;
    }
    return Object.keys(cuenta).length === nv.pares && Object.keys(cuenta).every((f) => cuenta[f] === 2);
  }

  function crear(contenedor) {
    let nivel = 'facil';
    let mazo = [];
    let halladas = [];   // true si la carta ya tiene pareja
    let abiertas = [];   // índices dados vuelta y todavía sin resolver (0, 1 o 2)
    let mov = 0;
    let fase = 'listo';  // 'listo' | 'jugando' | 'ganado'
    let bloqueado = false;
    let cartas = [];
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valMov = el('span', { clase: 'dato__valor', texto: '0' });
    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    const botonesNivel = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Nivel' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: NIVELES[id].nombre + '\n' + NIVELES[id].pares + ' parejas', attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesNivel[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(nivel));

    const tablero = el('div', { clase: 'mem__tablero', attrs: { role: 'group', 'aria-label': 'Cartas' } });

    const raiz = el('div', { clase: 'jg mem' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Movimientos' }), valMov),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj))),
      tablero,
      el('p', { clase: 'jg__ayuda', texto: 'Tocá dos cartas por vez. Si son iguales, quedan a la vista. El tiempo arranca con la primera carta.' })
    );
    contenedor.append(raiz);

    function etiquetaCarta(k) {
      const fila = Math.floor(k / NIVELES[nivel].cols) + 1;
      const col = (k % NIVELES[nivel].cols) + 1;
      const visible = halladas[k] || abiertas.includes(k);
      return visible
        ? 'Carta ' + FIGURAS[mazo[k]].n + (halladas[k] ? ', con pareja' : '')
        : 'Carta boca abajo, fila ' + fila + ', columna ' + col;
    }

    function pintarCarta(k) {
      const c = cartas[k];
      const visible = halladas[k] || abiertas.includes(k);
      c.classList.toggle('abierta', visible);
      c.classList.toggle('hallada', !!halladas[k]);
      c.setAttribute('aria-label', etiquetaCarta(k));
      c.disabled = !!halladas[k];
    }

    function construir() {
      tablero.replaceChildren();
      tablero.style.setProperty('--cols', String(NIVELES[nivel].cols));
      cartas = [];
      mazo.forEach((f, k) => {
        const cara = el('span', { clase: 'mem__cara', html: svgFigura(f) });
        cara.style.setProperty('--ph', String(Math.round((f * 360) / FIGURAS.length * 1)));
        const c = el('button', { clase: 'mem__carta', attrs: { type: 'button', 'data-k': String(k) } },
          el('span', { clase: 'mem__dorso', attrs: { 'aria-hidden': 'true' } }), cara);
        c.addEventListener('click', () => dar(k));
        cartas.push(c);
        tablero.append(c);
      });
      mazo.forEach((_, k) => pintarCarta(k));
      ORDEN.forEach((id) => botonesNivel[id].setAttribute('aria-pressed', String(id === nivel)));
      valMov.textContent = String(mov);
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return { nivel, mazo, halladas: halladas.map((h) => (h ? '1' : '0')).join(''), mov, ms: Math.round(crono.transcurrido) };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    /* --- Partidas --- */
    function nueva(id) {
      nivel = id;
      mazo = generarMazo(NIVELES[id].pares);
      halladas = mazo.map(() => false);
      abiertas = [];
      mov = 0;
      fase = 'listo';
      bloqueado = false;
      Guardado.borrar(ID);
      Almacen.escribir('memoria:nivel', id);
      crono.reiniciar(0);
      construir();
    }

    function pedirNueva(id) {
      if (fase === 'jugando' && mov > 0 && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function cargar(s) {
      nivel = s.nivel;
      mazo = s.mazo.slice();
      halladas = Array.from(s.halladas, (ch) => ch === '1');
      abiertas = [];
      mov = Number(s.mov) || 0;
      fase = 'jugando';
      bloqueado = false;
      construir();
      crono.reiniciar(s.ms);
      crono.iniciar();
    }

    /* --- Jugada --- */
    function dar(k) {
      if (fase === 'ganado' || bloqueado || halladas[k] || abiertas.includes(k)) return;
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
      abiertas.push(k);
      pintarCarta(k);
      if (abiertas.length < 2) return;

      mov++;
      valMov.textContent = String(mov);
      const [a, b] = abiertas;
      if (mazo[a] === mazo[b]) {
        halladas[a] = halladas[b] = true;
        abiertas = [];
        pintarCarta(a);
        pintarCarta(b);
        if (halladas.every(Boolean)) ganar();
        else guardarYa();
      } else {
        bloqueado = true;
        despues(() => {
          abiertas = [];
          bloqueado = false;
          pintarCarta(a);
          pintarCarta(b);
          guardarYa();
        }, 950);
      }
    }

    function ganar() {
      fase = 'ganado';
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      const r = Records.agregar(ID, nivel, ms, { modo: 'menor' });
      let detalle;
      if (r.esRecord) detalle = 'Nueva mejor marca en el nivel ' + NIVELES[nivel].nombre.toLowerCase();
      else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
      else detalle = 'Tu mejor marca en este nivel es ' + Cronometro.formatear(Records.mejor(ID, nivel)) + '.';
      despues(() => celebrar({
        titulo: 'Encontraste todas las parejas',
        mensaje: NIVELES[nivel].nombre + ' en ' + Cronometro.formatear(ms) + ' y ' + mov + ' movimientos.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(nivel) },
          { texto: 'Cerrar' }
        ]
      }), 500);
    }

    /* --- Inicio --- */
    const guardado = Guardado.cargar(ID);
    if (guardado && mazoValido(guardado)) {
      cargar(guardado);
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ultimo = Almacen.leer('memoria:nivel', 'facil');
      nueva(NIVELES[ultimo] ? ultimo : 'facil');
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
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() {
      if (instancia) { instancia.destruir(); instancia = null; }
    }
  });
})(window);
