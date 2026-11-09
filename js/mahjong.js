/* mahjong.js · Mahjong solitario
   - Hay fichas apiladas en capas. Se sacan de a pares de fichas iguales.
   - Una ficha se puede sacar si está libre: no tiene otra encima y tiene libre el costado izquierdo o el derecho.
   - Las fichas son las clásicas del mahjong (círculos, bambúes, caracteres, vientos, dragones, flor y estación).
   - Tres niveles según la cantidad de fichas. Todos los tableros se arman "sacando" de a pares desde el final,
     así que siempre tienen solución. Si te quedás sin jugadas, el juego mezcla las fichas que quedan.
   - Pista (con pista no entra en las mejores marcas), deshacer, cronómetro, guardado automático y mejores marcas por nivel. */
(function (global) {
  'use strict';

  const ID = 'mahjong';
  const { el, notificar, celebrar } = global.Pasatiempos;

  /* Cada capa: columnas, filas y posición de la esquina (en casillas de ficha) */
  const NIVELES = {
    facil: { nombre: 'Fácil', tipos: 9, capas: [[6, 4, 0, 0], [4, 2, 1, 1], [2, 2, 2, 1]] },
    medio: { nombre: 'Medio', tipos: 18, capas: [[8, 5, 0, 0], [6, 3, 1, 1], [4, 1, 2, 2]] },
    dificil: { nombre: 'Difícil', tipos: 36, capas: [[10, 6, 0, 0], [8, 4, 1, 1], [6, 2, 2, 2], [2, 1, 4, 2]] }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];

  /* Las 36 caras son las clásicas del mahjong: 9 círculos, 9 bambúes, 9 caracteres,
     4 vientos, 3 dragones, una flor y una estación. Se dibujan en un cuadro de 30 x 40. */
  const VERDE = '#1f7a4d'; const ROJO = '#b3261e'; const AZUL = '#1e4f8a'; const TINTA = '#1d1b18'; const MARFIL = '#fbf8ee';
  const circulo = (x, y, r, c) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.5) + '" fill="' + MARFIL + '"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.2) + '" fill="' + c + '"/>';
  const palo = (x, y, h, c) => '<rect x="' + (x - 1.8) + '" y="' + (y - h / 2) + '" width="3.6" height="' + h + '" fill="' + c + '"/><path d="M' + (x - 1.8) + ' ' + y + 'h3.6" stroke="' + MARFIL + '" stroke-width="0.9"/>';
  const PUNTOS = [
    [[15, 20, 8, VERDE]],
    [[15, 12, 5, VERDE], [15, 28, 5, AZUL]],
    [[8, 10, 4, AZUL], [15, 20, 4, ROJO], [22, 30, 4, VERDE]],
    [[9, 12, 4.5, AZUL], [21, 12, 4.5, VERDE], [9, 28, 4.5, VERDE], [21, 28, 4.5, AZUL]],
    [[9, 11, 4, AZUL], [21, 11, 4, VERDE], [15, 20, 4, ROJO], [9, 29, 4, VERDE], [21, 29, 4, AZUL]],
    [[9, 9, 4, VERDE], [21, 9, 4, VERDE], [9, 20, 4, ROJO], [21, 20, 4, ROJO], [9, 31, 4, VERDE], [21, 31, 4, VERDE]],
    [[7, 8, 3.6, VERDE], [15, 12, 3.6, VERDE], [23, 16, 3.6, VERDE], [9, 27, 3.8, ROJO], [21, 27, 3.8, ROJO], [9, 35, 3.8, ROJO], [21, 35, 3.8, ROJO]],
    [[10, 8, 3.4, AZUL], [20, 8, 3.4, AZUL], [10, 16, 3.4, AZUL], [20, 16, 3.4, AZUL], [10, 24, 3.4, AZUL], [20, 24, 3.4, AZUL], [10, 32, 3.4, AZUL], [20, 32, 3.4, AZUL]],
    [[8, 10, 3.4, VERDE], [15, 10, 3.4, ROJO], [22, 10, 3.4, AZUL], [8, 20, 3.4, VERDE], [15, 20, 3.4, ROJO], [22, 20, 3.4, AZUL], [8, 30, 3.4, VERDE], [15, 30, 3.4, ROJO], [22, 30, 3.4, AZUL]]
  ];
  const BAMBUES = [
    [[15, 20, 24, VERDE]],
    [[15, 11, 14, VERDE], [15, 29, 14, VERDE]],
    [[15, 11, 14, VERDE], [10, 29, 14, VERDE], [20, 29, 14, VERDE]],
    [[10, 11, 14, VERDE], [20, 11, 14, AZUL], [10, 29, 14, AZUL], [20, 29, 14, VERDE]],
    [[9, 11, 14, VERDE], [21, 11, 14, VERDE], [15, 20, 14, ROJO], [9, 29, 14, VERDE], [21, 29, 14, VERDE]],
    [[8, 11, 14, VERDE], [15, 11, 14, VERDE], [22, 11, 14, VERDE], [8, 29, 14, VERDE], [15, 29, 14, VERDE], [22, 29, 14, VERDE]],
    [[15, 8, 11, ROJO], [8, 20, 11, VERDE], [15, 20, 11, VERDE], [22, 20, 11, VERDE], [8, 33, 11, VERDE], [15, 33, 11, VERDE], [22, 33, 11, VERDE]],
    [[6, 11, 14, VERDE], [12, 11, 14, VERDE], [18, 11, 14, VERDE], [24, 11, 14, VERDE], [6, 29, 14, VERDE], [12, 29, 14, VERDE], [18, 29, 14, VERDE], [24, 29, 14, VERDE]],
    [[8, 8, 10, VERDE], [15, 8, 10, ROJO], [22, 8, 10, AZUL], [8, 20, 10, VERDE], [15, 20, 10, ROJO], [22, 20, 10, AZUL], [8, 32, 10, VERDE], [15, 32, 10, ROJO], [22, 32, 10, AZUL]]
  ];
  const caracter = (n) => '<text x="15" y="19" font-size="16" font-weight="700" text-anchor="middle" fill="' + TINTA + '" font-family="Georgia, serif">' + n + '</text>' +
    '<path d="M7 25h16M9 29.5h12M15 25v10M10.5 35l-3 3M19.5 35l3 3" stroke="' + ROJO + '" stroke-width="2.2" fill="none"/>';
  const viento = (l) => '<rect x="6" y="8" width="18" height="24" fill="none" stroke="' + TINTA + '" stroke-width="1.4"/>' +
    '<text x="15" y="26" font-size="16" font-weight="700" text-anchor="middle" fill="' + TINTA + '" font-family="Georgia, serif">' + l + '</text>';
  const CARAS = [];
  PUNTOS.forEach((l) => CARAS.push(l.map((d) => circulo(d[0], d[1], d[2], d[3])).join('')));
  BAMBUES.forEach((l) => CARAS.push(l.map((d) => palo(d[0], d[1], d[2], d[3])).join('')));
  for (let n = 1; n <= 9; n++) CARAS.push(caracter(n));
  ['E', 'S', 'O', 'N'].forEach((l) => CARAS.push(viento(l)));
  CARAS.push('<rect x="7" y="12" width="16" height="16" fill="none" stroke="' + ROJO + '" stroke-width="2.6"/><path d="M15 6v28" stroke="' + ROJO + '" stroke-width="2.6"/>');
  CARAS.push('<path d="M15 6l9 14-9 14-9-14z" fill="none" stroke="' + VERDE + '" stroke-width="2.6"/><path d="M10 20h10M15 14v12" stroke="' + VERDE + '" stroke-width="2.6"/>');
  CARAS.push('<rect x="6" y="8" width="18" height="24" fill="none" stroke="' + AZUL + '" stroke-width="2.4"/><rect x="10" y="12" width="10" height="16" fill="none" stroke="' + AZUL + '" stroke-width="1.2"/>');
  CARAS.push('<g fill="' + ROJO + '"><circle cx="15" cy="11" r="4.6"/><circle cx="21.5" cy="16" r="4.6"/><circle cx="19" cy="23" r="4.6"/><circle cx="11" cy="23" r="4.6"/><circle cx="8.5" cy="16" r="4.6"/></g><circle cx="15" cy="18" r="3.4" fill="#e0a526"/><path d="M15 26v10" stroke="' + VERDE + '" stroke-width="2"/>');
  CARAS.push('<path d="M15 35C5 27 7 13 15 6c8 7 10 21 0 29z" fill="' + VERDE + '"/><path d="M15 33V12" stroke="' + MARFIL + '" stroke-width="1.2"/>');
  const NOMBRES = [];
  for (let n = 1; n <= 9; n++) NOMBRES.push('círculos ' + n);
  for (let n = 1; n <= 9; n++) NOMBRES.push('bambú ' + n);
  for (let n = 1; n <= 9; n++) NOMBRES.push('carácter ' + n);
  NOMBRES.push('viento este', 'viento sur', 'viento oeste', 'viento norte', 'dragón rojo', 'dragón verde', 'dragón blanco', 'flor', 'estación');
  const nombreTipo = (t) => NOMBRES[t];

  const mezclar = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /* ---------------------------------------------------------
     Motor. Una ficha es { x, y, z, t, vivo }. x e y están en medias casillas: cada ficha ocupa 2×2.
     --------------------------------------------------------- */
  function posiciones(nivel) {
    const lista = [];
    NIVELES[nivel].capas.forEach(([cols, filas, ox, oy], z) => {
      for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) lista.push({ x: (ox + c) * 2, y: (oy + f) * 2, z });
    });
    return lista;
  }

  function libre(fichas, i) {
    const a = fichas[i];
    if (!a.vivo) return false;
    let izq = false, der = false;
    for (let k = 0; k < fichas.length; k++) {
      if (k === i) continue;
      const b = fichas[k];
      if (!b.vivo) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      if (Math.abs(dy) >= 2) continue;
      if (b.z === a.z + 1 && Math.abs(dx) < 2) return false;
      if (b.z === a.z) {
        if (dx === -2) izq = true;
        else if (dx === 2) der = true;
      }
    }
    return !(izq && der);
  }

  function libres(fichas) {
    const r = [];
    for (let i = 0; i < fichas.length; i++) if (libre(fichas, i)) r.push(i);
    return r;
  }

  function parejasLibres(fichas) {
    const l = libres(fichas);
    const r = [];
    for (let a = 0; a < l.length; a++) for (let b = a + 1; b < l.length; b++) {
      if (fichas[l[a]].t === fichas[l[b]].t) r.push([l[a], l[b]]);
    }
    return r;
  }

  /* Reparte una lista de tipos de pareja sobre las fichas vivas, sacándolas de a dos al azar.
     Devuelve true si pudo (el tablero queda resoluble por construcción). */
  function repartir(fichas, tiposPareja) {
    const vivos = [];
    fichas.forEach((f, i) => { if (f.vivo) vivos.push(i); });
    for (let intento = 0; intento < 200; intento++) {
      const copia = fichas.map((f) => ({ x: f.x, y: f.y, z: f.z, vivo: f.vivo, t: f.t }));
      const pares = mezclar(tiposPareja.slice());
      let ok = true;
      for (let p = 0; p < pares.length; p++) {
        const l = libres(copia);
        if (l.length < 2) { ok = false; break; }
        const a = l.splice(Math.floor(Math.random() * l.length), 1)[0];
        const b = l[Math.floor(Math.random() * l.length)];
        copia[a].t = pares[p]; copia[b].t = pares[p];
        copia[a].vivo = false; copia[b].vivo = false;
      }
      if (ok) {
        vivos.forEach((i) => { fichas[i].t = copia[i].t; });
        return true;
      }
    }
    return false;
  }

  function generar(nivel) {
    const pos = posiciones(nivel);
    const fichas = pos.map((p) => ({ x: p.x, y: p.y, z: p.z, t: 0, vivo: true }));
    const T = NIVELES[nivel].tipos;
    const elegidos = mezclar(Array.from({ length: 36 }, (_, i) => i)).slice(0, T);
    const pares = [];
    for (let i = 0; i < fichas.length / 2; i++) pares.push(elegidos[i % T]);
    if (!repartir(fichas, pares)) return generar(nivel);
    return fichas;
  }

  function tiposRestantes(fichas) {
    const cuenta = {};
    fichas.forEach((f) => { if (f.vivo) cuenta[f.t] = (cuenta[f.t] || 0) + 1; });
    const pares = [];
    Object.keys(cuenta).forEach((t) => { for (let k = 0; k < cuenta[t] / 2; k++) pares.push(Number(t)); });
    return pares;
  }

  function crear(contenedor) {
    let nivel = 'facil';
    let fichas = [];
    let botones = [];
    let sel = -1;
    let pistaPar = null;
    let historial = [];
    let mov = 0;
    let pistas = 0;
    let mezclas = 0;
    let fase = 'listo'; // 'listo' | 'jugando' | 'ganado'
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valFichas = el('span', { clase: 'dato__valor', texto: '0' });
    const valPares = el('span', { clase: 'dato__valor', texto: '0' });
    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    const botonesNivel = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Nivel' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: NIVELES[id].nombre, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesNivel[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(nivel));
    const btnPista = el('button', { clase: 'btn btn--chico', texto: 'Pista', attrs: { type: 'button' } });
    btnPista.addEventListener('click', () => pista());
    const btnDeshacer = el('button', { clase: 'btn btn--chico', texto: 'Deshacer', attrs: { type: 'button' } });
    btnDeshacer.addEventListener('click', () => deshacer());

    const tablero = el('div', { clase: 'mj__tablero', attrs: { role: 'group', 'aria-label': 'Fichas' } });
    const raiz = el('div', { clase: 'jg mj' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Fichas' }), valFichas),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Parejas libres' }), valPares),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        el('div', { clase: 'jg__acciones jg__acciones--fila' }, btnPista, btnDeshacer)),
      el('div', { clase: 'mj__marco' }, tablero)
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function svgFicha(t) {
      const s = el('span', { clase: 'mj__forma', attrs: { 'aria-hidden': 'true' } });
      s.innerHTML = '<svg viewBox="0 0 30 40">' + CARAS[t] + '</svg>';
      return s;
    }

    function construir() {
      tablero.replaceChildren();
      botones = [];
      const W = Math.max(...fichas.map((f) => f.x)) + 2;
      const H = Math.max(...fichas.map((f) => f.y)) + 2;
      tablero.style.aspectRatio = (3 * W) + ' / ' + (4 * H);
      fichas.forEach((f, i) => {
        const b = el('button', { clase: 'mj__ficha', attrs: { type: 'button', 'data-i': String(i) } });
        b.style.left = (f.x / W * 100) + '%';
        b.style.top = (f.y / H * 100) + '%';
        b.style.width = (2 / W * 100) + '%';
        b.style.height = (2 / H * 100) + '%';
        b.style.zIndex = String(f.z + 1);
        b.style.setProperty('--z', String(f.z));
        b.append(svgFicha(f.t));
        b.addEventListener('click', () => tocar(i));
        botones.push(b);
        tablero.append(b);
      });
      ORDEN.forEach((id) => botonesNivel[id].setAttribute('aria-pressed', String(id === nivel)));
      pintar();
    }

    function pintar() {
      const hayLibres = new Set(libres(fichas));
      let vivas = 0;
      fichas.forEach((f, i) => {
        const b = botones[i];
        if (!b) return;
        b.hidden = !f.vivo;
        if (!f.vivo) return;
        vivas++;
        const esLibre = hayLibres.has(i);
        b.classList.toggle('bloq', !esLibre);
        b.classList.toggle('sel', i === sel);
        b.classList.toggle('pista', !!pistaPar && (pistaPar[0] === i || pistaPar[1] === i));
        b.setAttribute('aria-label', nombreTipo(f.t) + (esLibre ? ', libre' : ', trabada') + (i === sel ? ', elegida' : ''));
        b.setAttribute('aria-pressed', String(i === sel));
      });
      valFichas.textContent = String(vivas);
      valPares.textContent = String(parejasLibres(fichas).length);
      btnDeshacer.disabled = historial.length === 0 || fase === 'ganado';
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return { nivel, tipos: fichas.map((f) => (f.vivo ? f.t : -1)), mov, pistas, mezclas, ms: Math.round(crono.transcurrido) };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    /* --- Partidas --- */
    function nueva(id) {
      nivel = id;
      fichas = generar(id);
      sel = -1; pistaPar = null; historial = [];
      mov = 0; pistas = 0; mezclas = 0;
      fase = 'listo';
      Guardado.borrar(ID);
      Almacen.escribir('mahjong:nivel', id);
      crono.reiniciar(0);
      construir();
    }

    function pedirNueva(id) {
      if (fase === 'jugando' && mov > 0 && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function cargar(s) {
      nivel = s.nivel;
      const pos = posiciones(nivel);
      fichas = pos.map((p, i) => ({ x: p.x, y: p.y, z: p.z, t: s.tipos[i] < 0 ? 0 : s.tipos[i], vivo: s.tipos[i] >= 0 }));
      sel = -1; pistaPar = null; historial = [];
      mov = Number(s.mov) || 0; pistas = Number(s.pistas) || 0; mezclas = Number(s.mezclas) || 0;
      fase = 'jugando';
      construir();
      crono.reiniciar(s.ms);
      crono.iniciar();
    }

    /* --- Jugada --- */
    function tocar(i) {
      if (fase === 'ganado' || !fichas[i].vivo) return;
      if (!libre(fichas, i)) { notificar('Esa ficha está trabada: necesita el costado izquierdo o el derecho libre, y nada encima.'); return; }
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
      pistaPar = null;
      if (sel === i) { sel = -1; pintar(); return; }
      if (sel >= 0 && fichas[sel].t === fichas[i].t) {
        fichas[sel].vivo = false; fichas[i].vivo = false;
        historial.push([sel, i]);
        sel = -1; mov++;
        despues(revisarFinal, 0);
        pintar();
        return;
      }
      sel = i;
      pintar();
    }

    function revisarFinal() {
      const vivas = fichas.filter((f) => f.vivo).length;
      if (vivas === 0) { ganar(); return; }
      if (parejasLibres(fichas).length === 0) {
        let rep = repartir(fichas, tiposRestantes(fichas));
        let atras = 0;
        // Si ni mezclando hay salida (por ejemplo, quedaron dos fichas una sobre otra), se vuelve unas jugadas atrás
        while (!rep && historial.length) {
          const [a, b] = historial.pop();
          fichas[a].vivo = true; fichas[b].vivo = true;
          atras++;
          rep = parejasLibres(fichas).length > 0 || repartir(fichas, tiposRestantes(fichas));
        }
        if (rep) {
          if (atras === 0) historial = [];
          mezclas++;
          fichas.forEach((f, i) => { if (f.vivo && botones[i]) { const viejo = botones[i].querySelector('.mj__forma'); if (viejo) viejo.replaceWith(svgFicha(f.t)); } });
          notificar(atras ? 'Te quedaste sin salida: volvimos ' + atras + (atras === 1 ? ' jugada' : ' jugadas') + ' atrás y mezclamos las fichas.' : 'No quedaban jugadas. Mezclamos las fichas que faltan.');
        }
        pintar();
      }
      guardarYa();
    }

    function deshacer() {
      if (fase === 'ganado' || !historial.length) return;
      const [a, b] = historial.pop();
      fichas[a].vivo = true; fichas[b].vivo = true;
      sel = -1; pistaPar = null;
      pintar();
      guardarYa();
    }

    function pista() {
      if (fase === 'ganado') return;
      const ps = parejasLibres(fichas);
      if (!ps.length) return;
      pistaPar = ps[Math.floor(Math.random() * ps.length)];
      sel = -1;
      pistas++;
      pintar();
      notificar('Esas dos fichas se pueden sacar. Con pistas no entra en las mejores marcas.');
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
        const r = Records.agregar(ID, nivel, ms, { modo: 'menor' });
        if (r.esRecord) detalle = 'Nueva mejor marca en el nivel ' + NIVELES[nivel].nombre.toLowerCase();
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca en este nivel es ' + Cronometro.formatear(Records.mejor(ID, nivel)) + '.';
      }
      pintar();
      despues(() => celebrar({
        titulo: 'Tablero despejado',
        mensaje: NIVELES[nivel].nombre + ' en ' + Cronometro.formatear(ms) + ' y ' + mov + ' parejas.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(nivel) },
          { texto: 'Cerrar' }
        ]
      }), 350);
    }

    /* --- Inicio --- */
    const guardado = Guardado.cargar(ID);
    let ok = false;
    if (guardado && NIVELES[guardado.nivel] && Array.isArray(guardado.tipos)) {
      const n = posiciones(guardado.nivel).length;
      const vivas = guardado.tipos.filter((t) => t >= 0);
      ok = guardado.tipos.length === n && vivas.length > 0 && vivas.length % 2 === 0
        && guardado.tipos.every((t) => Number.isInteger(t) && t >= -1 && t < 36);
      if (ok) {
        const c = {};
        vivas.forEach((t) => { c[t] = (c[t] || 0) + 1; });
        ok = Object.keys(c).every((t) => c[t] % 2 === 0);
      }
    }
    if (ok) {
      cargar(guardado);
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ultimo = String(Almacen.leer('mahjong:nivel', 'facil'));
      nueva(NIVELES[ultimo] ? ultimo : 'facil');
    }

    return {
      pruebas: { tocar, pista, deshacer, fichas: () => fichas, libres: () => libres(fichas), parejas: () => parejasLibres(fichas), nivel: () => nivel },
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
  global.Mahjong = { pruebas: () => (instancia && instancia.pruebas) || null, generar, libres, parejasLibres, repartir, posiciones };
})(window);
