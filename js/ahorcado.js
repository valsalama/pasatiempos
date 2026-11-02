/* ahorcado.js · Etapa 4: Ahorcado
   - Adiviná la palabra letra por letra antes de que se complete el muñeco (6 errores).
   - Elegís la categoría (las palabras están en palabras-ahorcado.js).
   - Teclado en pantalla para el celular; en la compu también podés usar el teclado.
   - Cada palabra que adivinás suma puntos y sigue la racha. Cuando perdés una palabra, la racha termina
     y el puntaje total se guarda en las mejores marcas.
   - La partida se guarda sola después de cada jugada. */
(function (global) {
  'use strict';

  const BASE = 'ahorcado';
  let ID = BASE;            // 'ahorcado', 'ahorcado-diario' o 'ahorcado-practica'
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  const TOTAL_DIA = 8;      // palabras del desafío del día
  const MAX_ERRORES = 6;
  const { el, notificar, celebrar } = global.Pasatiempos;

  const CATEGORIAS = global.PalabrasAhorcado.categorias;
  const TODAS = 'todas';
  const FILAS_TECLADO = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'];

  const azar = (n) => Math.floor(Math.random() * n);

  // Letra sin tilde (la Ñ se queda como Ñ, que en el teclado tiene su propia tecla)
  function base(ch) {
    if (ch === 'Ñ' || ch === 'ñ') return 'Ñ';
    return ch.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function poolDe(catId) {
    if (catId === TODAS) {
      const todas = [];
      CATEGORIAS.forEach((c) => c.palabras.forEach((p) => todas.push(p)));
      return todas;
    }
    const c = CATEGORIAS.find((x) => x.id === catId);
    return c ? c.palabras.slice() : [];
  }

  function nombreCategoria(catId) {
    if (catId === TODAS) return 'Todas las categorías';
    const c = CATEGORIAS.find((x) => x.id === catId);
    return c ? c.nombre : catId;
  }

  function letrasDe(palabra) {
    const s = new Set();
    for (const ch of palabra) if (ch !== ' ') s.add(base(ch));
    return s;
  }

  /* Palabras del desafío: cortas, con varias letras poco comunes y sin espacios. Salen de la semilla del día. */
  function armarListaDelDia() {
    const raras = new Set('JQXZKWÑYVFHBG'.split(''));
    const todas = [];
    CATEGORIAS.forEach((c) => c.palabras.forEach((p) => { if (!todas.includes(p)) todas.push(p); }));
    const dificiles = todas.filter((p) => {
      if (p.includes(' ')) return false;
      const ls = Array.from(p).map(base);
      return ls.length >= 5 && ls.length <= 10 && new Set(ls.filter((l) => raras.has(l))).size >= 2;
    });
    return global.Diario.conSemilla(global.Diario.semilla(BASE), () => {
      const copia = dificiles.slice();
      for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = copia[i]; copia[i] = copia[j]; copia[j] = t;
      }
      return copia.slice(0, TOTAL_DIA);
    });
  }

  function validoGuardado(s) {
    if (!s || typeof s.palabra !== 'string' || !/^[A-ZÑÁÉÍÓÚÜ ]{4,40}$/.test(s.palabra)) return false;
    if (!(s.cat === TODAS || CATEGORIAS.some((c) => c.id === s.cat))) return false;
    if (s.fase !== 'jugando' && s.fase !== 'ganada') return false;
    if (!Array.isArray(s.letras) || !s.letras.every((l) => typeof l === 'string' && /^[A-ZÑ]$/.test(l))) return false;
    if (!Number.isInteger(s.errores) || s.errores < 0 || s.errores >= MAX_ERRORES) return false;
    if (!Number.isInteger(s.puntaje) || s.puntaje < 0 || !Number.isInteger(s.racha) || s.racha < 0) return false;
    if (!Array.isArray(s.usadas) || !s.usadas.every((u) => typeof u === 'string')) return false;
    return true;
  }

  /* --- Muñeco en SVG: cada parte aparece con un error --- */
  const NS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, ...hijos) {
    const n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach((k) => n.setAttribute(k, attrs[k]));
    hijos.forEach((h) => n.append(h));
    return n;
  }

  function crearMuneco() {
    const horca = svg('g', { class: 'ah__horca' },
      svg('path', { d: 'M20 238 H150 M52 238 V24 H150 V52 M52 66 L82 24' }),
      svg('path', { d: 'M150 24 V52', class: 'ah__soga' }));

    const cara = svg('g', { class: 'ah__cara' },
      svg('circle', { cx: 142, cy: 80, r: 2.6, class: 'ah__ojo' }),
      svg('circle', { cx: 158, cy: 80, r: 2.6, class: 'ah__ojo' }),
      svg('path', { d: 'M144 92 H156', class: 'ah__boca ah__boca--neutra' }),
      svg('path', { d: 'M143 90 Q150 98 157 90', class: 'ah__boca ah__boca--feliz' }));
    const caraTriste = svg('g', { class: 'ah__cara-triste' },
      svg('path', { d: 'M138 76 L146 84 M146 76 L138 84 M154 76 L162 84 M162 76 L154 84', class: 'ah__x' }),
      svg('path', { d: 'M144 94 H156', class: 'ah__boca' }));

    const partes = [
      svg('g', { class: 'ah__p', 'data-n': 1 }, svg('circle', { cx: 150, cy: 82, r: 22, class: 'ah__piel' }),
        svg('circle', { cx: 136, cy: 88, r: 4, class: 'ah__cachete' }), svg('circle', { cx: 164, cy: 88, r: 4, class: 'ah__cachete' }),
        cara, caraTriste,
        svg('g', { class: 'ah__mono' }, svg('path', { d: 'M150 61 L135 53 V69 Z M150 61 L165 53 V69 Z' }), svg('circle', { cx: 150, cy: 61, r: 3.5 }))),
      svg('g', { class: 'ah__p', 'data-n': 2 },
        svg('path', { class: 'ah__miembro ah__torso', d: 'M150 104 V170' }),
        svg('path', { class: 'ah__vestido', d: 'M150 104 L128 172 H172 Z' })),
      svg('path', { class: 'ah__p ah__miembro', 'data-n': 3, d: 'M150 120 L120 148' }),
      svg('path', { class: 'ah__p ah__miembro', 'data-n': 4, d: 'M150 120 L180 148' }),
      svg('path', { class: 'ah__p ah__miembro', 'data-n': 5, d: 'M150 170 L128 210' }),
      svg('path', { class: 'ah__p ah__miembro', 'data-n': 6, d: 'M150 170 L172 210' })
    ];

    const raiz = svg('svg', {
      class: 'ah__svg', viewBox: '0 0 220 250', role: 'img', 'aria-label': 'Dibujo del ahorcado', 'data-e': '0'
    }, horca, ...partes);
    return { raiz, partes };
  }

  function crear(contenedor) {
    let cat = TODAS;
    let palabra = '';
    let letras = new Set();     // letras ya probadas (sin tilde)
    let errores = 0;
    let puntaje = 0;
    let racha = 0;
    let usadas = [];
    let fase = 'jugando';       // 'jugando' | 'ganada' | 'perdida'
    let destruido = false;
    const esDiario = MODO !== 'libre';
    let indice = 0;             // en el desafío: qué palabra de la lista toca
    const listaDia = esDiario ? armarListaDelDia() : [];

    /* --- Estructura --- */
    const valPuntaje = el('span', { clase: 'dato__valor', texto: '0' });
    const valMejor = el('span', { clase: 'dato__valor', texto: '0' });
    const valRacha = el('span', { clase: 'dato__valor', texto: '0' });

    const selCat = el('select', { clase: 'desplegable', attrs: { 'aria-label': 'Categoría' } });
    CATEGORIAS.forEach((c) => selCat.append(el('option', { texto: c.nombre, attrs: { value: c.id } })));
    selCat.append(el('option', { texto: 'Todas las categorías', attrs: { value: TODAS } }));
    selCat.addEventListener('change', () => pedirNueva(selCat.value));

    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(cat));
    const btnPista = el('button', { clase: 'btn btn--chico', texto: 'Pista (cuesta una vida)', attrs: { type: 'button' } });
    btnPista.addEventListener('click', pista);
    const btnSiguiente = el('button', { clase: 'btn btn--primario', texto: 'Siguiente palabra', attrs: { type: 'button', hidden: '' } });
    btnSiguiente.addEventListener('click', siguientePalabra);

    const muneco = crearMuneco();
    const vidas = el('div', { clase: 'ah__vidas', attrs: { role: 'img' } });
    const palabraEl = el('div', { clase: 'ah__palabra', attrs: { 'aria-live': 'polite' } });
    const estadoEl = el('p', { clase: 'ah__estado', attrs: { role: 'status' } });
    const teclado = el('div', { clase: 'ah__teclado', attrs: { role: 'group', 'aria-label': 'Teclado' } });
    const teclas = {};
    FILAS_TECLADO.forEach((fila) => {
      const f = el('div', { clase: 'ah__fila-teclas' });
      for (const l of fila) {
        const b = el('button', { clase: 'ah__tecla', texto: l, attrs: { type: 'button', 'data-l': l, 'aria-label': 'Letra ' + l } });
        b.addEventListener('click', () => probar(l));
        teclas[l] = b;
        f.append(b);
      }
      teclado.append(f);
    });

    const raiz = el('div', { clase: 'jg ah' },
      esDiario ? global.Diario.cartel(MODO) : null,
      esDiario ? (MODO === 'practica' ? el('div', { clase: 'jg__fila' }, btnNuevo) : null) : el('div', { clase: 'jg__fila' }, selCat, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Puntaje' }), valPuntaje),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Mejor' }), valMejor),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Racha' }), valRacha))),
      el('div', { clase: 'ah__escena' }, muneco.raiz, vidas),
      palabraEl,
      estadoEl,
      el('div', { clase: 'jg__acciones ah__acciones' }, esDiario ? null : btnPista, btnSiguiente),
      teclado,
      el('p', { clase: 'jg__ayuda', texto: 'Tocá las letras de abajo (o usá el teclado de la compu). Con 6 errores se completa el muñeco y termina la racha. Cada palabra que adivinás suma puntos.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function pintarPalabra() {
      palabraEl.replaceChildren();
      palabraEl.setAttribute('aria-label', fase === 'jugando'
        ? 'Palabra de ' + palabra.replace(/ /g, '').length + ' letras'
        : 'La palabra es ' + palabra);
      for (const ch of palabra) {
        if (ch === ' ') { palabraEl.append(el('span', { clase: 'ah__espacio' })); continue; }
        const visible = letras.has(base(ch));
        let clase = 'ah__letra';
        if (visible) clase += ' vista';
        else if (fase === 'perdida') clase += ' falto';
        palabraEl.append(el('span', { clase, texto: visible || fase === 'perdida' ? ch : '' }));
      }
    }

    function pintarMuneco() {
      muneco.raiz.dataset.e = String(errores);
      muneco.raiz.classList.toggle('perdido', fase === 'perdida');
      muneco.partes.forEach((p, i) => p.classList.toggle('on', errores > i));
    }

    function pintarVidas() {
      const quedan = MAX_ERRORES - errores;
      vidas.setAttribute('aria-label', 'Vidas: ' + quedan + ' de ' + MAX_ERRORES);
      vidas.replaceChildren();
      for (let i = 0; i < MAX_ERRORES; i++) {
        vidas.append(el('span', { clase: 'ah__vida' + (i < quedan ? '' : ' perdida'), attrs: { 'aria-hidden': 'true' } }));
      }
    }

    function pintarTeclado() {
      Object.keys(teclas).forEach((l) => {
        const b = teclas[l];
        const usada = letras.has(l);
        const esta = letrasDe(palabra).has(l);
        b.disabled = usada || fase !== 'jugando';
        b.classList.toggle('acierto', usada && esta);
        b.classList.toggle('error', usada && !esta);
      });
    }

    function actualizarDatos() {
      valPuntaje.textContent = puntaje.toLocaleString('es-AR');
      valMejor.textContent = Math.max(Records.mejor(ID, 'general') || 0, puntaje).toLocaleString('es-AR');
      valRacha.textContent = String(racha);
    }

    function pintar() {
      selCat.value = cat;
      pintarPalabra();
      pintarMuneco();
      pintarVidas();
      pintarTeclado();
      actualizarDatos();
      btnSiguiente.hidden = fase !== 'ganada';
      btnPista.disabled = fase !== 'jugando' || errores >= MAX_ERRORES - 1;
      if (fase === 'jugando') estadoEl.textContent = esDiario
        ? 'Palabra ' + (indice + 1) + ' de ' + TOTAL_DIA + ' · ' + palabra.replace(/ /g, '').length + ' letras'
        : 'Categoría: ' + nombreCategoria(cat) + ' · ' + palabra.replace(/ /g, '').length + ' letras';
      else if (fase === 'ganada') estadoEl.textContent = 'Adivinaste. Seguí con la siguiente palabra.';
      else estadoEl.textContent = 'Se completó el muñeco. La palabra era ' + palabra + '.';
    }

    /* --- Guardado --- */
    function guardarYa() {
      if (fase === 'perdida') Guardado.borrar(ID);
      else if (fase === 'jugando' && letras.size === 0 && puntaje === 0 && racha === 0) return; // todavía no jugó nada
      else Guardado.guardar(ID, { cat, palabra, letras: Array.from(letras), errores, puntaje, racha, usadas, fase, indice: esDiario ? indice : undefined, fecha: esDiario ? global.Diario.hoy() : undefined });
    }

    function registrarPuntaje() {
      if (esDiario) return null; // el desafío y la práctica no tocan las marcas de partida libre
      return puntaje > 0 ? Records.agregar(ID, 'general', puntaje, { modo: 'mayor' }) : null;
    }

    /* --- Palabras --- */
    function elegirPalabra() {
      if (esDiario) { palabra = listaDia[indice]; return; }
      const pool = poolDe(cat);
      const clave = (p) => Array.from(p).map(base).join('');
      let libres = pool.filter((p) => !usadas.includes(clave(p)));
      if (!libres.length) { usadas = []; libres = pool; }
      palabra = libres[azar(libres.length)];
      usadas.push(clave(palabra));
      if (usadas.length > 400) usadas = usadas.slice(-200);
    }

    function nuevaPalabra() {
      elegirPalabra();
      letras = new Set();
      errores = 0;
      fase = 'jugando';
    }

    function siguientePalabra() {
      if (fase !== 'ganada') return;
      if (esDiario) {
        if (indice >= TOTAL_DIA - 1) return;
        indice++;
      }
      nuevaPalabra();
      pintar();
      guardarYa();
    }

    function reiniciar(catId) {
      cat = esDiario ? TODAS : catId;
      if (!esDiario) Almacen.escribir('ahorcado:categoria', cat);
      indice = 0;
      puntaje = 0;
      racha = 0;
      usadas = [];
      nuevaPalabra();
      Guardado.borrar(ID);
      pintar();
      guardarYa();
    }

    function pedirNueva(catId) {
      const enCurso = puntaje > 0 && fase !== 'perdida';
      const hayJugada = fase === 'jugando' && (letras.size > 0 || puntaje > 0);
      if ((enCurso || hayJugada) &&
          !global.confirm(puntaje > 0
            ? '¿Empezar de nuevo? Tu puntaje actual se guarda en las mejores marcas.'
            : 'Si empezás un juego nuevo, perdés la palabra actual. ¿Seguimos?')) {
        selCat.value = cat;
        return;
      }
      if (enCurso) registrarPuntaje();
      reiniciar(catId);
    }

    /* --- Jugadas --- */
    function puntosPorPalabra() {
      const largo = palabra.replace(/ /g, '').length;
      return 50 + largo * 10 + (MAX_ERRORES - errores) * 20;
    }

    function probar(letra) {
      if (fase !== 'jugando' || letras.has(letra)) return;
      letras.add(letra);
      const esta = letrasDe(palabra);
      if (!esta.has(letra)) errores++;
      evaluar();
    }

    function pista() {
      if (fase !== 'jugando' || errores >= MAX_ERRORES - 1) return;
      const faltan = Array.from(letrasDe(palabra)).filter((l) => !letras.has(l));
      if (!faltan.length) return;
      letras.add(faltan[azar(faltan.length)]);
      errores++;
      notificar('Te mostré una letra. Perdiste una vida.');
      evaluar();
    }

    function evaluar() {
      const todas = Array.from(letrasDe(palabra)).every((l) => letras.has(l));
      if (todas && errores < MAX_ERRORES) {
        fase = 'ganada';
        const pts = puntosPorPalabra();
        puntaje += pts;
        racha++;
        pintar();
        guardarYa();
        if (esDiario && indice >= TOTAL_DIA - 1) { terminarDesafio(true); return; }
        celebrar({
          titulo: 'Adivinaste',
          mensaje: 'La palabra era ' + palabra + '. Sumaste ' + pts + ' puntos.',
          detalle: 'Racha de ' + racha + (racha === 1 ? ' palabra' : ' palabras') + ' · ' + puntaje.toLocaleString('es-AR') + ' puntos en total.',
          botones: [{ texto: 'Siguiente palabra', primario: true, alClick: siguientePalabra }]
        });
      } else if (errores >= MAX_ERRORES) {
        fase = 'perdida';
        const r = registrarPuntaje();
        pintar();
        guardarYa();
        if (esDiario) { terminarDesafio(false); return; }
        let detalle = '';
        if (r) {
          if (r.esRecord) detalle = 'Nuevo mejor puntaje';
          else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores puntajes.';
          else detalle = 'Tu mejor puntaje es ' + Records.mejor(ID, 'general').toLocaleString('es-AR') + '.';
        }
        celebrar({
          titulo: 'Se completó el muñeco',
          mensaje: 'La palabra era ' + palabra + '. Terminaste con ' + puntaje.toLocaleString('es-AR') + ' puntos.',
          detalle,
          confeti: !!(r && r.esRecord),
          botones: [
            { texto: 'Nuevo juego', primario: true, alClick: () => reiniciar(cat) },
            { texto: 'Cerrar' }
          ]
        });
      } else {
        pintar();
        guardarYa();
      }
    }

    /* Fin del desafío del día (o de su práctica): completaste las 8 palabras o se completó el muñeco */
    function terminarDesafio(completo) {
      const txtPuntos = puntaje.toLocaleString('es-AR') + ' puntos';
      if (MODO === 'diario') {
        const rd = global.Diario.registrar(BASE, puntaje, { palabras: completo ? TOTAL_DIA : indice });
        Guardado.borrar(ID);
        celebrar({
          titulo: completo ? 'Completaste las ' + TOTAL_DIA + ' palabras' : 'Fin del desafío del día',
          mensaje: (completo ? '' : 'La palabra era ' + palabra + '. ') + 'Terminaste con ' + txtPuntos + '.',
          detalle: rd.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + rd.racha + (rd.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.',
          confeti: completo,
          botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
        });
        return;
      }
      celebrar({
        titulo: completo ? 'Completaste las ' + TOTAL_DIA + ' palabras' : 'Se completó el muñeco',
        mensaje: 'Práctica: ' + txtPuntos + '. No suma al ranking.',
        confeti: completo,
        botones: [{ texto: 'Reintentar', primario: true, alClick: () => reiniciar(cat) }, { texto: 'Cerrar' }]
      });
    }

    /* --- Teclado físico --- */
    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      if (ev.key === 'Enter' && fase === 'ganada' && !(t && t.tagName === 'BUTTON')) {
        ev.preventDefault();
        siguientePalabra();
        return;
      }
      if (!ev.key || ev.key.length !== 1) return;
      const l = base(ev.key);
      if (!teclas[l]) return;
      ev.preventDefault();
      probar(l);
    }
    document.addEventListener('keydown', alTecla);

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    const esDeHoy = !esDiario || (guardado && guardado.fecha === global.Diario.hoy() &&
      Number.isInteger(guardado.indice) && guardado.indice >= 0 && guardado.indice < TOTAL_DIA && guardado.palabra === listaDia[guardado.indice]);
    if (validoGuardado(guardado) && esDeHoy) {
      if (esDiario) indice = guardado.indice;
      cat = guardado.cat;
      palabra = guardado.palabra;
      letras = new Set(guardado.letras);
      errores = guardado.errores;
      puntaje = guardado.puntaje;
      racha = guardado.racha;
      usadas = guardado.usadas.slice(-400);
      fase = guardado.fase;
      pintar();
    } else {
      const ultima = Almacen.leer('ahorcado:categoria', TODAS);
      cat = (ultima === TODAS || CATEGORIAS.some((c) => c.id === ultima)) ? ultima : TODAS;
      reiniciar(cat);
    }

    return {
      destruir() {
        destruido = true;
        document.removeEventListener('keydown', alTecla);
      }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { MODO = 'libre'; ID = BASE; instancia = crear(contenedor); },
    iniciarDiario(contenedor, practica) {
      const res = global.Diario.resultadoDeHoy(BASE);
      if (res && !practica) {
        instancia = global.Diario.panelCompletado(contenedor, { base: BASE, texto: 'Tu puntaje: ' + Number(res.valor).toLocaleString('es-AR') });
        return;
      }
      MODO = practica ? 'practica' : 'diario';
      ID = BASE + (practica ? '-practica' : '-diario');
      instancia = crear(contenedor);
    },
    destruir() {
      if (instancia) { instancia.destruir(); instancia = null; }
    }
  });
})(window);
