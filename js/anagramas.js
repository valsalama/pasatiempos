/* anagramas.js · Etapa 9: Anagramas
   - Te damos las letras mezcladas de una palabra: tenés que ordenarlas.
   - Tres niveles según el largo de la palabra. Cada ronda tiene 10 palabras.
   - Tocá las letras (o escribilas con el teclado) para armar la palabra. Si hay otra palabra válida con las mismas letras, también cuenta.
   - Cada palabra vale 10 puntos por letra. Pedir la pista (la definición) resta 5 puntos. Saltar una palabra no suma.
   - Las palabras y las definiciones salen de palabras.js (las mismas del crucigrama). */
(function (global) {
  'use strict';

  const ID = 'anagramas';
  const { el, notificar, celebrar } = global.Pasatiempos;

  const RONDA = 10;
  const NIVELES = {
    facil: { nombre: 'Fácil', min: 4, max: 5, difAl: 0 },
    medio: { nombre: 'Medio', min: 6, max: 7, difAl: 0.25 },
    dificil: { nombre: 'Difícil', min: 8, max: 9, difAl: 0.5 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];
  const COSTO_PISTA = 5;

  const limpiar = (s) => s.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/Ñ/g, 'Ñ');
  const llave = (p) => Array.from(p).sort().join('');

  /* Índice por letras ordenadas (para aceptar anagramas distintos del objetivo) */
  let indice = null;
  function indiceDe() {
    if (indice) return indice;
    indice = new Map();
    const agregar = (w) => {
      const k = llave(w);
      if (!indice.has(k)) indice.set(k, new Set());
      indice.get(k).add(w);
    };
    global.PalabrasCrucigrama.lista.forEach((e) => agregar(e.p));
    if (global.PalabrasWordle) global.PalabrasWordle.validas.forEach(agregar);
    return indice;
  }

  function mezclar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function mezclarPalabra(p) {
    const letras = Array.from(p);
    if (new Set(letras).size === 1) return letras;
    let r;
    let n = 0;
    do { r = mezclar(letras.slice()); n++; } while (r.join('') === p && n < 30);
    return r;
  }

  /* Elige 10 palabras del nivel (sin repetir, y sin que dos tengan las mismas letras) */
  function elegirRonda(nivel) {
    const cfg = NIVELES[nivel];
    const candidatas = global.PalabrasCrucigrama.lista.filter((e) => e.p.length >= cfg.min && e.p.length <= cfg.max && (e.d.length || e.dificiles.length));
    mezclar(candidatas);
    const usadas = new Set();
    const res = [];
    for (const e of candidatas) {
      const k = llave(e.p);
      if (usadas.has(k)) continue;
      usadas.add(k);
      const usarDificil = e.dificiles.length && (!e.d.length || Math.random() < cfg.difAl);
      const pool = usarDificil ? e.dificiles : e.d;
      const def = pool[Math.floor(Math.random() * pool.length)].replace(/^\*/, '');
      res.push({ p: e.p, d: def });
      if (res.length === RONDA) break;
    }
    return res;
  }

  function crear(contenedor) {
    let nivel = 'facil';
    let palabras = [];
    let idx = 0;
    let puntaje = 0;
    let acertadas = 0;
    let letras = [];           // letras mezcladas de la palabra actual
    let usadas = [];           // índices de letras (en `letras`) puestas en la respuesta, en orden
    let pista = false;
    let fase = 'listo';        // 'listo' | 'jugando' | 'fin'
    let destruido = false;
    let bloqueado = false;     // mientras se muestra un acierto
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valPuntaje = el('span', { clase: 'dato__valor', texto: '0' });
    const valProg = el('span', { clase: 'dato__valor', texto: '1 / ' + RONDA });

    const botonesN = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Nivel' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: NIVELES[id].nombre, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesN[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nueva ronda', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(nivel));

    const slots = el('div', { clase: 'an__respuesta', attrs: { 'aria-live': 'polite' } });
    const fichas = el('div', { clase: 'an__fichas' });
    const defEl = el('p', { clase: 'an__pista', attrs: { 'aria-live': 'polite' } });
    const btnMezclar = el('button', { clase: 'btn', texto: 'Mezclar', attrs: { type: 'button' } });
    const btnBorrar = el('button', { clase: 'btn', texto: 'Borrar', attrs: { type: 'button' } });
    const btnPista = el('button', { clase: 'btn', texto: 'Pista (−' + COSTO_PISTA + ')', attrs: { type: 'button' } });
    const btnSaltar = el('button', { clase: 'btn', texto: 'Saltar', attrs: { type: 'button' } });
    btnMezclar.addEventListener('click', remezclar);
    btnBorrar.addEventListener('click', () => { usadas = []; pintarPalabra(); });
    btnPista.addEventListener('click', pedirPista);
    btnSaltar.addEventListener('click', saltar);

    const raiz = el('div', { clase: 'jg an' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Palabra' }), valProg),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Puntaje' }), valPuntaje))),
      defEl,
      slots,
      fichas,
      el('div', { clase: 'jg__acciones' }, btnMezclar, btnBorrar, btnPista, btnSaltar),
      el('p', { clase: 'jg__ayuda', texto: 'Ordená las letras para formar una palabra. Tocá las letras o escribilas con el teclado (Retroceso borra la última, Enter prueba la palabra). Cada letra vale 10 puntos; la pista (la definición) resta ' + COSTO_PISTA + '.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function actual() { return palabras[idx]; }

    function pintarPalabra() {
      const p = actual();
      slots.replaceChildren();
      for (let i = 0; i < p.p.length; i++) {
        const idL = usadas[i];
        const s = el('button', {
          clase: 'an__slot' + (idL !== undefined ? ' llena' : ''),
          texto: idL !== undefined ? letras[idL] : '',
          attrs: { type: 'button', 'aria-label': idL !== undefined ? 'Letra ' + (i + 1) + ': ' + letras[idL] + '. Tocá para sacarla.' : 'Letra ' + (i + 1) + ' vacía' }
        });
        if (idL !== undefined) s.addEventListener('click', () => { usadas = usadas.slice(0, i); pintarPalabra(); });
        else s.disabled = true;
        slots.append(s);
      }
      fichas.replaceChildren();
      letras.forEach((ch, i) => {
        const usada = usadas.includes(i);
        const f = el('button', { clase: 'an__ficha' + (usada ? ' usada' : ''), texto: ch, attrs: { type: 'button', 'aria-label': 'Letra ' + ch } });
        f.disabled = usada || fase === 'fin';
        f.addEventListener('click', () => poner(i));
        fichas.append(f);
      });
      defEl.textContent = pista ? actual().d : 'Sin pista todavía.';
      defEl.classList.toggle('vacia', !pista);
      btnPista.disabled = pista || fase === 'fin';
      btnSaltar.disabled = fase === 'fin';
      valProg.textContent = Math.min(idx + 1, RONDA) + ' / ' + RONDA;
      valPuntaje.textContent = String(puntaje);
      ORDEN.forEach((id) => botonesN[id].setAttribute('aria-pressed', String(id === nivel)));
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return { nivel, palabras: palabras.map((x) => x.p + '|' + x.d), idx, puntaje, acertadas, letras: letras.join(''), pista };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }

    /* --- Partidas --- */
    function cargarPalabra() {
      const p = actual();
      letras = mezclarPalabra(p.p);
      usadas = [];
      pista = false;
      pintarPalabra();
    }

    function nueva(id) {
      nivel = id;
      palabras = elegirRonda(id);
      idx = 0;
      puntaje = 0;
      acertadas = 0;
      fase = 'listo';
      bloqueado = false;
      Guardado.borrar(ID);
      Almacen.escribir('anagramas:nivel', id);
      cargarPalabra();
    }

    function pedirNueva(id) {
      if (fase === 'jugando' && (idx > 0 || usadas.length) && !global.confirm('Si empezás una ronda nueva, perdés la actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function validoGuardado(s) {
      if (!s || !NIVELES[s.nivel] || !Array.isArray(s.palabras) || s.palabras.length !== RONDA) return false;
      if (!Number.isInteger(s.idx) || s.idx < 0 || s.idx >= RONDA) return false;
      if (!Number.isInteger(s.puntaje) || !Number.isInteger(s.acertadas)) return false;
      const lista = s.palabras.map((x) => (typeof x === 'string' ? x.split('|') : []));
      if (!lista.every((x) => x.length >= 2 && /^[A-ZÑ]{3,9}$/.test(x[0]))) return false;
      const p = lista[s.idx][0];
      return typeof s.letras === 'string' && llave(s.letras) === llave(p);
    }

    function cargar(s) {
      nivel = s.nivel;
      palabras = s.palabras.map((x) => { const i = x.indexOf('|'); return { p: x.slice(0, i), d: x.slice(i + 1) }; });
      idx = s.idx;
      puntaje = s.puntaje;
      acertadas = s.acertadas;
      letras = Array.from(s.letras);
      usadas = [];
      pista = !!s.pista;
      fase = 'jugando';
      pintarPalabra();
    }

    /* --- Jugada --- */
    function remezclar() {
      if (fase === 'fin' || bloqueado) return;
      letras = mezclarPalabra(actual().p);
      usadas = [];
      pintarPalabra();
    }

    function poner(i) {
      if (fase === 'fin' || bloqueado || usadas.includes(i) || usadas.length >= actual().p.length) return;
      usadas.push(i);
      pintarPalabra();
      if (usadas.length === actual().p.length) probar();
    }

    function pedirPista() {
      if (pista || fase === 'fin' || bloqueado) return;
      pista = true;
      pintarPalabra();
      guardarYa();
    }

    function marcarSlots(clase) {
      Array.from(slots.children).forEach((s) => s.classList.add(clase));
      despues(() => Array.from(slots.children).forEach((s) => s.classList.remove(clase)), 500);
    }

    function probar() {
      const p = actual();
      const intento = usadas.map((i) => letras[i]).join('');
      const k = llave(p.p);
      const otras = indiceDe().get(k);
      if (intento === p.p || (otras && otras.has(intento))) {
        if (fase === 'listo') fase = 'jugando';
        const gana = p.p.length * 10 - (pista ? COSTO_PISTA : 0);
        puntaje += gana;
        acertadas++;
        marcarSlots('ok');
        const extra = intento !== p.p ? 'También vale ' + intento + '. La palabra pensada era ' + p.p + '.' : '';
        notificar('Correcto: +' + gana + (extra ? '. ' + extra : ''));
        bloqueado = true;
        despues(siguiente, 650);
        ocupadoHasta();
      } else {
        marcarSlots('mal');
        despues(() => { usadas = []; pintarPalabra(); }, 520);
      }
    }
    // Bloquea las fichas mientras se muestra el acierto
    function ocupadoHasta() {
      Array.from(fichas.children).forEach((f) => { f.disabled = true; });
    }

    function saltar() {
      if (fase === 'fin' || bloqueado) return;
      if (fase === 'listo') fase = 'jugando';
      notificar('Era ' + actual().p + '.');
      siguiente();
    }

    function siguiente() {
      bloqueado = false;
      idx++;
      if (idx >= RONDA) { terminar(); return; }
      cargarPalabra();
      guardarYa();
    }

    function terminar() {
      fase = 'fin';
      idx = RONDA - 1;
      Guardado.borrar(ID);
      pintarPalabra();
      valProg.textContent = RONDA + ' / ' + RONDA;
      const r = Records.agregar(ID, nivel, puntaje, { modo: 'mayor' });
      let detalle;
      if (r.esRecord) detalle = 'Nueva mejor marca en nivel ' + NIVELES[nivel].nombre.toLowerCase();
      else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
      else detalle = 'Tu mejor marca en este nivel es ' + Number(Records.mejor(ID, nivel)).toLocaleString('es-AR') + ' puntos.';
      celebrar({
        titulo: 'Ronda terminada',
        mensaje: 'Resolviste ' + acertadas + ' de ' + RONDA + ' palabras y sumaste ' + puntaje + ' puntos.',
        detalle,
        confeti: acertadas >= 6,
        botones: [{ texto: 'Nueva ronda', primario: true, alClick: () => nueva(nivel) }, { texto: 'Cerrar' }]
      });
    }

    /* --- Entrada --- */
    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey || fase === 'fin') return;
      const o = ev.target;
      if (o && (o.tagName === 'INPUT' || o.tagName === 'SELECT' || o.tagName === 'TEXTAREA')) return;
      if (bloqueado) return;
      if (ev.key === 'Backspace') {
        ev.preventDefault();
        usadas.pop();
        pintarPalabra();
        return;
      }
      if (ev.key === 'Enter') {
        if (o && o.tagName === 'BUTTON') return;
        ev.preventDefault();
        if (usadas.length === actual().p.length) probar();
        return;
      }
      if (ev.key.length === 1) {
        const letra = ev.key === 'ñ' || ev.key === 'Ñ' ? 'Ñ' : limpiar(ev.key);
        if (!/^[A-ZÑ]$/.test(letra)) return;
        const i = letras.findIndex((ch, n) => ch === letra && !usadas.includes(n));
        if (i >= 0) { ev.preventDefault(); poner(i); }
      }
    }
    document.addEventListener('keydown', alTecla);

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    if (validoGuardado(guardado)) {
      cargar(guardado);
      notificar('Seguís con la ronda que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ult = Almacen.leer('anagramas:nivel', 'facil');
      nueva(NIVELES[ult] ? ult : 'facil');
    }

    return {
      pruebas: { estado: () => ({ palabra: actual().p, letras: letras.slice(), idx, puntaje, fase }), poner, probar },
      destruir() {
        destruido = true;
        document.removeEventListener('keydown', alTecla);
        temporizadores.forEach((id) => clearTimeout(id));
        temporizadores.clear();
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
