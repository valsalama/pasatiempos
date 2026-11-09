/* criptograma.js · Criptograma
   - Un refrán está escrito con un código: cada letra del abecedario fue cambiada por otra, siempre la misma.
     Hay que descubrir qué letra es cuál para leer la frase.
   - Tocá una letra del código (se marcan todas las iguales) y escribí la letra que creés que es, con el teclado
     de la compu o con el teclado en pantalla. Se completa en todos los lugares donde aparece.
   - Una letra no puede estar puesta en dos lugares del código a la vez.
   - Tres niveles según el largo de la frase. En el fácil, además, te regalamos tres letras para empezar.
   - Revisar marca las letras mal puestas. Pista regala una letra (con pista no entra en las mejores marcas).
   - Cronómetro, guardado automático y mejores marcas por nivel. Las frases salen de palabras-criptograma.js. */
(function (global) {
  'use strict';

  const ID = 'criptograma';
  const { el, notificar, celebrar } = global.Pasatiempos;
  const ALFA = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const NIVELES = {
    facil: { nombre: 'Fácil', min: 0, max: 24, regalo: 3 },
    medio: { nombre: 'Medio', min: 25, max: 31, regalo: 0 },
    dificil: { nombre: 'Difícil', min: 32, max: 999, regalo: 0 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];

  /* Saca las tildes pero deja la Ñ */
  function normalizar(t) {
    return t.toUpperCase().replace(/Ñ/g, '#').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/#/g, 'Ñ');
  }
  const letrasDe = (t) => (t.match(/[A-ZÑ]/g) || []).length;

  function frasesDelNivel(nivel) {
    const lista = global.FRASES_CRIPTOGRAMA || [];
    const { min, max } = NIVELES[nivel];
    const r = [];
    lista.forEach((f, i) => { const n = letrasDe(normalizar(f)); if (n >= min && n <= max) r.push(i); });
    return r;
  }

  /* Una permutación del abecedario en la que ninguna letra queda igual */
  function generarClave() {
    for (;;) {
      const a = ALFA.split('');
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      if (a.every((c, i) => c !== ALFA[i])) return a.join('');
    }
  }

  function crear(contenedor) {
    let nivel = 'facil';
    let idx = 0;
    let texto = '';         // frase normalizada
    let clave = '';         // clave[i] = letra del código que reemplaza a ALFA[i]
    let usuario = {};       // letra del código -> letra que puso la persona
    let dadas = new Set();  // letras del código reveladas (no se pueden cambiar)
    let malas = new Set();  // letras del código marcadas como mal por Revisar
    let sel = '';           // letra del código elegida
    let pistas = 0;
    let fase = 'listo';     // 'listo' | 'jugando' | 'ganado'
    let celdas = [];
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const cifrar = (c) => clave[ALFA.indexOf(c)];
    const descifrar = (k) => ALFA[clave.indexOf(k)];

    const valFaltan = el('span', { clase: 'dato__valor', texto: '0' });
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
    const btnRevisar = el('button', { clase: 'btn btn--chico', texto: 'Revisar', attrs: { type: 'button' } });
    btnRevisar.addEventListener('click', () => revisar());
    const btnPista = el('button', { clase: 'btn btn--chico', texto: 'Pista', attrs: { type: 'button' } });
    btnPista.addEventListener('click', () => pista());
    const btnBorrar = el('button', { clase: 'btn btn--chico', texto: 'Borrar letra', attrs: { type: 'button' } });
    btnBorrar.addEventListener('click', () => borrar());

    const frase = el('div', { clase: 'cr__frase', attrs: { role: 'group', 'aria-label': 'Frase cifrada' } });
    const teclado = el('div', { clase: 'cr__teclado', attrs: { role: 'group', 'aria-label': 'Teclado' } });
    ALFA.split('').forEach((l) => {
      const b = el('button', { clase: 'cr__tecla', texto: l, attrs: { type: 'button', 'data-l': l } });
      b.addEventListener('click', () => poner(l));
      teclado.append(b);
    });

    const raiz = el('div', { clase: 'jg cr' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Letras sin resolver' }), valFaltan),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        el('div', { clase: 'jg__acciones jg__acciones--fila' }, btnRevisar, btnPista)),
      el('div', { clase: 'cr__marco' }, frase),
      teclado,
      el('div', { clase: 'jg__acciones' }, btnBorrar)
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function construir() {
      frase.replaceChildren();
      celdas = [];
      texto.split(' ').forEach((palabra) => {
        const w = el('span', { clase: 'cr__palabra' });
        palabra.split('').forEach((ch) => {
          if (ALFA.indexOf(ch) < 0) { w.append(el('span', { clase: 'cr__punt', texto: ch })); return; }
          const k = cifrar(ch);
          const c = el('button', { clase: 'cr__celda', attrs: { type: 'button', 'data-k': k } },
            el('span', { clase: 'cr__cif', texto: k }),
            el('span', { clase: 'cr__res' }));
          c.addEventListener('click', () => elegir(k));
          celdas.push(c);
          w.append(c);
        });
        frase.append(w);
      });
      ORDEN.forEach((id) => botonesNivel[id].setAttribute('aria-pressed', String(id === nivel)));
      pintar();
    }

    function letrasDelCodigo() {
      const s = new Set();
      texto.split('').forEach((ch) => { if (ALFA.indexOf(ch) >= 0) s.add(cifrar(ch)); });
      return s;
    }

    function pintar() {
      let faltan = 0;
      const vistos = new Set();
      celdas.forEach((c) => {
        const k = c.dataset.k;
        const u = usuario[k] || '';
        c.querySelector('.cr__res').textContent = u;
        c.classList.toggle('sel', k === sel);
        c.classList.toggle('dada', dadas.has(k));
        c.classList.toggle('mal', malas.has(k));
        c.setAttribute('aria-label', 'Código ' + k + ', ' + (u ? 'puesta la ' + u : 'vacía') + (dadas.has(k) ? ', regalada' : '') + (malas.has(k) ? ', mal' : ''));
        if (!vistos.has(k)) { vistos.add(k); if (u !== descifrar(k)) faltan++; }
      });
      valFaltan.textContent = String(faltan);
      Array.from(teclado.children).forEach((b) => {
        const l = b.dataset.l;
        b.classList.toggle('usada', Object.keys(usuario).some((k) => usuario[k] === l));
      });
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return {
        nivel, idx, clave,
        usuario: ALFA.split('').map((k) => usuario[k] || ' ').join(''),
        dadas: ALFA.split('').map((k) => (dadas.has(k) ? '1' : '0')).join(''),
        pistas, ms: Math.round(crono.transcurrido)
      };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    /* --- Partidas --- */
    function nueva(id) {
      nivel = id;
      const pool = frasesDelNivel(id);
      if (!pool.length) { notificar('No hay frases cargadas.'); return; }
      const ultimo = Number(Almacen.leer('criptograma:ultima', -1));
      const opciones = pool.length > 1 ? pool.filter((i) => i !== ultimo) : pool;
      idx = opciones[Math.floor(Math.random() * opciones.length)];
      Almacen.escribir('criptograma:ultima', idx);
      texto = normalizar(global.FRASES_CRIPTOGRAMA[idx]);
      clave = generarClave();
      usuario = {}; dadas = new Set(); malas = new Set(); sel = '';
      pistas = 0;
      // Letras de regalo: las que más se repiten
      const regalo = NIVELES[id].regalo;
      if (regalo) {
        const cuenta = {};
        texto.split('').forEach((ch) => { if (ALFA.indexOf(ch) >= 0) cuenta[ch] = (cuenta[ch] || 0) + 1; });
        Object.keys(cuenta).sort((a, b) => cuenta[b] - cuenta[a]).slice(0, regalo).forEach((ch) => {
          const k = cifrar(ch); usuario[k] = ch; dadas.add(k);
        });
      }
      fase = 'listo';
      Guardado.borrar(ID);
      Almacen.escribir('criptograma:nivel', id);
      crono.reiniciar(0);
      construir();
      sel = primeraVacia();
      pintar();
    }

    function pedirNueva(id) {
      if (fase === 'jugando' && Object.keys(usuario).length > dadas.size && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    function cargar(s) {
      nivel = s.nivel; idx = s.idx; clave = s.clave;
      texto = normalizar(global.FRASES_CRIPTOGRAMA[idx]);
      usuario = {}; dadas = new Set(); malas = new Set();
      ALFA.split('').forEach((k, i) => {
        const u = s.usuario[i];
        if (u && u !== ' ') usuario[k] = u;
        if (s.dadas[i] === '1') dadas.add(k);
      });
      pistas = Number(s.pistas) || 0;
      fase = 'jugando';
      construir();
      sel = primeraVacia();
      pintar();
      crono.reiniciar(s.ms);
      crono.iniciar();
    }

    /* --- Jugada --- */
    function primeraVacia(desde) {
      const orden = [];
      celdas.forEach((c) => { if (orden.indexOf(c.dataset.k) < 0) orden.push(c.dataset.k); });
      const resto = desde ? orden.slice(orden.indexOf(desde) + 1).concat(orden.slice(0, orden.indexOf(desde) + 1)) : orden;
      return resto.find((k) => !usuario[k]) || '';
    }

    function elegir(k) {
      if (fase === 'ganado') return;
      sel = k;
      pintar();
    }

    function poner(l) {
      if (fase === 'ganado' || !sel) return;
      if (dadas.has(sel)) { notificar('Esa letra te la regalamos: no se puede cambiar.'); return; }
      for (const k of Object.keys(usuario)) {
        if (usuario[k] === l && k !== sel) {
          if (dadas.has(k)) { notificar('La ' + l + ' ya está resuelta en otro lugar.'); return; }
          delete usuario[k]; malas.delete(k);
          notificar('La ' + l + ' estaba puesta en otra letra del código: la saqué de ahí.');
        }
      }
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
      usuario[sel] = l;
      malas.delete(sel);
      const anterior = sel;
      sel = primeraVacia(anterior) || anterior;
      pintar();
      if (gano()) ganar(); else guardarYa();
    }

    function borrar() {
      if (fase === 'ganado' || !sel) return;
      if (dadas.has(sel)) { notificar('Esa letra te la regalamos: no se puede borrar.'); return; }
      delete usuario[sel]; malas.delete(sel);
      pintar();
      if (fase === 'jugando') guardarYa();
    }

    function gano() {
      const ks = letrasDelCodigo();
      for (const k of ks) if (usuario[k] !== descifrar(k)) return false;
      return true;
    }

    function revisar() {
      if (fase === 'ganado') return;
      malas = new Set();
      letrasDelCodigo().forEach((k) => { if (usuario[k] && usuario[k] !== descifrar(k)) malas.add(k); });
      pintar();
      notificar(malas.size ? 'Hay ' + malas.size + (malas.size === 1 ? ' letra mal puesta (marcada).' : ' letras mal puestas (marcadas).') : 'Todo lo que pusiste está bien.');
    }

    function pista() {
      if (fase === 'ganado') return;
      const cuenta = {};
      texto.split('').forEach((ch) => { if (ALFA.indexOf(ch) >= 0) cuenta[cifrar(ch)] = (cuenta[cifrar(ch)] || 0) + 1; });
      const pendientes = Object.keys(cuenta).filter((k) => usuario[k] !== descifrar(k));
      if (!pendientes.length) return;
      pendientes.sort((a, b) => cuenta[b] - cuenta[a]);
      const k = pendientes[0];
      const l = descifrar(k);
      for (const otro of Object.keys(usuario)) if (usuario[otro] === l && otro !== k) { delete usuario[otro]; malas.delete(otro); }
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
      usuario[k] = l; dadas.add(k); malas.delete(k);
      pistas++;
      sel = primeraVacia(k) || k;
      pintar();
      notificar('Te regalamos una letra. Con pistas no entra en las mejores marcas.');
      if (gano()) ganar(); else guardarYa();
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
      despues(() => celebrar({
        titulo: 'Lo descifraste',
        mensaje: '"' + global.FRASES_CRIPTOGRAMA[idx] + '" en ' + Cronometro.formatear(ms) + '.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(nivel) },
          { texto: 'Cerrar' }
        ]
      }), 350);
    }

    /* --- Teclado de la compu --- */
    function alTeclear(ev) {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (document.querySelector('dialog[open]')) return;
      const t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      if (ev.key === 'Backspace' || ev.key === 'Delete') { ev.preventDefault(); borrar(); return; }
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
        const orden = [];
        celdas.forEach((c) => { if (orden.indexOf(c.dataset.k) < 0) orden.push(c.dataset.k); });
        if (!orden.length) return;
        let i = orden.indexOf(sel);
        i = ev.key === 'ArrowRight' ? (i + 1) % orden.length : (i - 1 + orden.length) % orden.length;
        ev.preventDefault();
        elegir(orden[i]);
        return;
      }
      if (ev.key.length === 1) {
        const l = normalizar(ev.key);
        if (ALFA.indexOf(l) >= 0 && l.length === 1) { ev.preventDefault(); poner(l); }
      }
    }
    document.addEventListener('keydown', alTeclear);

    /* --- Inicio --- */
    const guardado = Guardado.cargar(ID);
    let ok = false;
    if (guardado && NIVELES[guardado.nivel] && Number.isInteger(guardado.idx) && global.FRASES_CRIPTOGRAMA && global.FRASES_CRIPTOGRAMA[guardado.idx]
      && typeof guardado.clave === 'string' && guardado.clave.length === ALFA.length
      && typeof guardado.usuario === 'string' && guardado.usuario.length === ALFA.length
      && typeof guardado.dadas === 'string' && guardado.dadas.length === ALFA.length && /^[01]+$/.test(guardado.dadas)) {
      ok = guardado.clave.split('').sort().join('') === ALFA.split('').sort().join('')
        && guardado.usuario.split('').every((c) => c === ' ' || ALFA.indexOf(c) >= 0);
    }
    if (ok) {
      cargar(guardado);
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ultimo = String(Almacen.leer('criptograma:nivel', 'facil'));
      nueva(NIVELES[ultimo] ? ultimo : 'facil');
    }

    return {
      pruebas: { poner, elegir, pista, revisar, clave: () => clave, texto: () => texto, usuario: () => Object.assign({}, usuario), sel: () => sel, gano },
      destruir() {
        destruido = true;
        document.removeEventListener('keydown', alTeclear);
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
  global.Criptograma = { pruebas: () => (instancia && instancia.pruebas) || null, normalizar, generarClave, frasesDelNivel };
})(window);
