/* app.js · Menú principal, navegación y base para los juegos
   Expone: Pasatiempos

   Cómo se suma un juego (cada juego va en su propio archivo, cargado en index.html
   DESPUÉS de app.js):

     Pasatiempos.registrar({
       id: 'sudoku',                       // tiene que coincidir con el id del catálogo de abajo
       iniciar(contenedor) { ... },        // dibuja el juego dentro de `contenedor`
       iniciarDiario(contenedor) { ... },  // opcional: el desafío del día (ruta #/sudoku/diario)
       destruir() { ... }                  // opcional: limpia timers y listeners al salir
     });

   Ayudas para los juegos:
     Pasatiempos.el(...)         crea elementos del DOM
     Pasatiempos.notificar(txt)  aviso emergente corto
     Pasatiempos.celebrar({ titulo, mensaje, detalle, botones, confeti })
     Pasatiempos.volverAlMenu() */
(function (global) {
  'use strict';

  /* ---------- Íconos de las tarjetas ---------- */
  const SVG = (cuerpo) =>
    '<svg class="icono-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'aria-hidden="true">' + cuerpo + '</svg>';

  const ICONOS = {
    'sudoku': SVG(
      '<rect x="6" y="6" width="36" height="36"/>' +
      '<path d="M18 6v36M30 6v36M6 18h36M6 30h36"/>' +
      '<circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/>' +
      '<circle cx="24" cy="24" r="1.7" fill="currentColor" stroke="none"/>' +
      '<circle cx="36" cy="36" r="1.7" fill="currentColor" stroke="none"/>'),
    'crucigrama': SVG(
      '<rect x="6" y="6" width="36" height="36"/>' +
      '<path d="M24 6v36M6 24h36"/><path d="M11 15h8M16 11l4 4-4 4"/>'),
    'sopa-de-letras': SVG(
      '<rect x="6" y="6" width="36" height="36"/>' +
      '<rect x="9" y="19" width="30" height="10" transform="rotate(-38 24 24)"/>' +
      '<circle cx="13" cy="13" r="1.7" fill="currentColor" stroke="none"/>' +
      '<circle cx="35" cy="35" r="1.7" fill="currentColor" stroke="none"/>'),
    'buscaminas': SVG(
      '<circle cx="24" cy="24" r="9" fill="currentColor" stroke="none"/>' +
      '<path d="M24 7v8M24 33v8M7 24h8M33 24h8M12 12l5.5 5.5M30.5 30.5L36 36M36 12l-5.5 5.5M17.5 30.5L12 36"/>'),
    '2048': SVG(
      '<rect x="6" y="6" width="36" height="36"/>' +
      '<text x="24" y="29.5" text-anchor="middle" font-size="12.5" fill="currentColor" ' +
      'stroke="none" font-weight="700" font-family="Source Serif 4, Georgia, serif">2048</text>'),
    'nonogramas': SVG(
      '<rect x="6" y="6" width="36" height="36"/>' +
      '<path d="M18 6v36M30 6v36M6 18h36M6 30h36"/>' +
      '<rect class="pt" x="9" y="9" width="6" height="6" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="21" y="21" width="6" height="6" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="33" y="9" width="6" height="6" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="9" y="33" width="6" height="6" fill="currentColor" stroke="none"/>'),
    'laberinto': SVG('<path d="M6 42V6h36v36H18V18h12v12"/>'),
    'ahorcado': SVG(
      '<path d="M9 42h30M17 42V7h17v8"/><circle cx="34" cy="20" r="5"/>' +
      '<path d="M34 25v10M34 29l-5 4M34 29l5 4"/>'),
    'memoria': SVG(
      '<rect x="5" y="9" width="17" height="30"/><rect x="26" y="9" width="17" height="30"/>' +
      '<path d="M13.5 20l5 5-5 5-5-5z" fill="currentColor"/><path d="M34.5 20l5 5-5 5-5-5z"/>'),
    'puzzle-deslizante': SVG(
      '<rect x="6" y="6" width="36" height="36"/>' +
      '<rect class="pt" x="9" y="9" width="10" height="10" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="21" y="9" width="10" height="10" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="33" y="9" width="6" height="10" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="9" y="21" width="10" height="10" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="33" y="21" width="6" height="10" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="9" y="33" width="10" height="6" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="21" y="33" width="10" height="6" fill="currentColor" stroke="none"/>'),
    'torres-de-hanoi': SVG(
      '<path d="M6 42h36M24 8v34"/>' +
      '<rect class="pt" x="12" y="34" width="24" height="5" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="16" y="26" width="16" height="5" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="20" y="18" width="8" height="5" fill="currentColor" stroke="none"/>'),
    'mastermind': SVG(
      '<circle cx="14" cy="14" r="6"/><circle cx="34" cy="14" r="6" fill="currentColor" stroke="none"/>' +
      '<circle cx="14" cy="34" r="6" fill="currentColor" stroke="none"/><circle cx="34" cy="34" r="6"/>'),
    'lights-out': SVG(
      '<rect x="6" y="6" width="36" height="36"/>' +
      '<path d="M18 6v36M30 6v36M6 18h36M6 30h36"/>' +
      '<rect class="pt" x="20" y="20" width="8" height="8" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="20" y="8" width="8" height="8" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="8" y="20" width="8" height="8" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="32" y="20" width="8" height="8" fill="currentColor" stroke="none"/>' +
      '<rect class="pt" x="20" y="32" width="8" height="8" fill="currentColor" stroke="none"/>'),
    'tateti': SVG(
      '<path d="M18 6v36M30 6v36M6 18h36M6 30h36"/>' +
      '<path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/><circle cx="24" cy="24" r="4.5"/>' +
      '<path d="M32.5 32.5l7 7M39.5 32.5l-7 7"/>'),
    'wordle': SVG(
      '<rect x="5" y="9" width="10" height="10"/><rect x="19" y="9" width="10" height="10" fill="currentColor"/><rect x="33" y="9" width="10" height="10"/>' +
      '<rect x="5" y="23" width="10" height="10" fill="currentColor"/><rect x="19" y="23" width="10" height="10"/><rect x="33" y="23" width="10" height="10" fill="currentColor"/>' +
      '<rect x="5" y="37" width="10" height="6"/><rect x="19" y="37" width="10" height="6"/>'),
    'anagramas': SVG(
      '<rect x="5" y="7" width="12" height="12"/><rect x="31" y="7" width="12" height="12"/>' +
      '<path d="M17 13h14"/><path d="M27 9l4 4-4 4"/>' +
      '<rect x="5" y="29" width="12" height="12"/><rect x="31" y="29" width="12" height="12"/>' +
      '<path d="M31 35H17"/><path d="M21 31l-4 4 4 4"/>'),
    'spelling-bee': SVG(
      '<path d="M24 5l8 4.6v9.2L24 23.4l-8-4.6V9.6z"/>' +
      '<path d="M13 24l8 4.6v9.2L13 42.4l-8-4.6v-9.2z"/>' +
      '<path d="M35 24l8 4.6v9.2L35 42.4l-8-4.6v-9.2z"/>'),
    'conexiones': SVG(
      '<rect x="5" y="7" width="38" height="8" fill="currentColor"/>' +
      '<rect x="5" y="20" width="38" height="8"/>' +
      '<rect x="5" y="33" width="9" height="8"/><rect x="16" y="33" width="9" height="8"/><rect x="27" y="33" width="9" height="8"/>' ),
    'solitario': SVG(
      '<rect x="6" y="9" width="17" height="25" rx="2"/><rect x="25" y="14" width="17" height="25" rx="2"/>' +
      '<path d="M33.5 21.5c-3 3-4 4.3-4 5.8a2 2 0 0 0 3.6 1.1c0 1-.3 1.7-1 2.4h3c-.7-.7-1-1.4-1-2.4a2 2 0 0 0 3.6-1.1c0-1.5-1-2.8-4-5.8z" fill="currentColor" stroke="none"/>'),
    'flow': SVG(
      '<rect x="6" y="6" width="36" height="36"/>' +
      '<path d="M15 15v10h10v10h8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="15" cy="15" r="4.5" fill="currentColor" stroke="none"/><circle cx="33" cy="35" r="4.5" fill="currentColor" stroke="none"/>')
  };

  /* ---------- Catálogo ----------
     metrica: 'tiempo' (gana el menor), 'puntaje' (gana el mayor) o 'cantidad' (gana la menor)
     hue: matiz de color de la tarjeta (0 a 360)
     categoria: para los filtros del menú ('logica', 'palabras' o 'mesa')
     unidad: solo si metrica es 'cantidad' (gana la menor): [singular, plural]
     etapa: en qué etapa del plan se construye */
  const JUEGOS = [
    { id: 'sudoku', categoria: 'logica', nombre: 'Sudoku', hue: 330, etapa: 2, metrica: 'tiempo',
      desc: 'Completá la grilla de 9×9 sin repetir números. Cuatro dificultades.',
      variantes: { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil', experto: 'Experto' } },
    { id: 'crucigrama', categoria: 'palabras', nombre: 'Crucigrama autodefinido', hue: 270, etapa: 6, metrica: 'tiempo',
      desc: 'Las pistas van dentro del tablero, con flechas.',
      variantes: { chico: 'Chico 9×9', mediano: 'Mediano 11×11', grande: 'Grande 13×13' } },
    { id: 'sopa-de-letras', categoria: 'palabras', nombre: 'Sopa de letras', hue: 170, etapa: 4, metrica: 'tiempo',
      desc: 'Encontrá todas las palabras escondidas. Elegí el tema y el tamaño.',
      variantes: { chica: 'Chica 10×10', mediana: 'Mediana 14×14', grande: 'Grande 18×18',
        'chica-dificil': 'Chica 10×10 · difícil', 'mediana-dificil': 'Mediana 14×14 · difícil', 'grande-dificil': 'Grande 18×18 · difícil' } },
    { id: 'buscaminas', categoria: 'logica', nombre: 'Buscaminas', hue: 5, etapa: 3, metrica: 'tiempo',
      desc: 'Despejá el tablero sin pisar ninguna mina.',
      variantes: { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' } },
    { id: '2048', categoria: 'logica', nombre: '2048', hue: 35, etapa: 3, metrica: 'puntaje',
      desc: 'Deslizá las fichas y fusioná números hasta llegar a 2048.',
      variantes: { general: 'Puntaje' } },
    { id: 'nonogramas', categoria: 'logica', nombre: 'Nonogramas', hue: 295, etapa: 5, metrica: 'tiempo',
      desc: 'Pintá las casillas siguiendo los números y descubrí el dibujo.',
      variantes: { 5: 'Chico 5×5', 10: 'Mediano 10×10', 15: 'Grande 15×15' } },
    { id: 'laberinto', categoria: 'logica', nombre: 'Laberinto', hue: 150, etapa: 5, metrica: 'tiempo',
      desc: 'Encontrá la salida de laberintos generados al azar.',
      variantes: { chico: 'Chico 12×12', mediano: 'Mediano 20×20', grande: 'Grande 30×30' } },
    { id: 'ahorcado', categoria: 'palabras', nombre: 'Ahorcado', hue: 210, etapa: 4, metrica: 'puntaje',
      desc: 'Adiviná la palabra antes de que se complete el muñeco.',
      variantes: { general: 'Puntaje' } },
    { id: 'memoria', categoria: 'mesa', nombre: 'Memoria', hue: 190, etapa: 8, metrica: 'tiempo',
      desc: 'Encontrá todas las parejas dando vuelta las cartas de a dos.',
      variantes: { facil: 'Fácil · 6 parejas', medio: 'Medio · 8 parejas', dificil: 'Difícil · 10 parejas', experto: 'Experto · 15 parejas' } },
    { id: 'puzzle-deslizante', categoria: 'logica', nombre: 'Puzzle deslizante', hue: 45, etapa: 8, metrica: 'tiempo',
      desc: 'Deslizá las fichas hasta ordenarlas del 1 en adelante.',
      variantes: { 3: 'Chico 3×3', 4: 'Mediano 4×4', 5: 'Grande 5×5' } },
    { id: 'torres-de-hanoi', categoria: 'logica', nombre: 'Torres de Hanoi', hue: 20, etapa: 8, metrica: 'tiempo',
      desc: 'Pasá todos los discos a otra torre sin poner uno grande sobre uno chico.',
      variantes: { 3: '3 discos', 4: '4 discos', 5: '5 discos', 6: '6 discos', 7: '7 discos', 8: '8 discos' } },
    { id: 'mastermind', categoria: 'logica', nombre: 'Mastermind', hue: 250, etapa: 8, metrica: 'cantidad', unidad: ['intento', 'intentos'],
      desc: 'Descubrí el código secreto de colores con la menor cantidad de intentos.',
      variantes: { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' } },
    { id: 'lights-out', categoria: 'logica', nombre: 'Lights Out', hue: 55, etapa: 8, metrica: 'tiempo',
      desc: 'Apagá todas las luces. Cada toque cambia también a las vecinas.',
      variantes: { 4: 'Chico 4×4', 5: 'Mediano 5×5', 7: 'Grande 7×7' } },
    { id: 'tateti', categoria: 'mesa', nombre: 'Ta-te-ti', hue: 310, etapa: 8, metrica: 'puntaje',
      desc: 'Jugá contra la compu. Sumá partidas seguidas sin perder.',
      variantes: { facil: 'Fácil', medio: 'Medio', imbatible: 'Imbatible' } },
    { id: 'wordle', categoria: 'palabras', nombre: 'Wordle', hue: 125, etapa: 9, metrica: 'cantidad', unidad: ['intento', 'intentos'],
      desc: 'Adiviná la palabra de 5 letras en 6 intentos. Hay desafío del día.',
      variantes: { general: 'General' } },
    { id: 'anagramas', categoria: 'palabras', nombre: 'Anagramas', hue: 330, etapa: 9, metrica: 'puntaje',
      desc: 'Ordená las letras mezcladas para formar la palabra. Rondas de 10.',
      variantes: { facil: 'Fácil · 4 y 5 letras', medio: 'Medio · 6 y 7 letras', dificil: 'Difícil · 8 y 9 letras' } },
    { id: 'spelling-bee', categoria: 'palabras', nombre: 'Spelling Bee', hue: 48, etapa: 9, metrica: 'puntaje',
      desc: 'Armá todas las palabras que puedas con siete letras. Una es obligatoria.',
      variantes: { general: 'General' } },
    { id: 'conexiones', categoria: 'palabras', nombre: 'Conexiones', hue: 290, etapa: 9, metrica: 'cantidad', unidad: ['intento', 'intentos'],
      desc: 'Agrupá 16 palabras en 4 grupos con algo en común. Hay desafío del día.',
      variantes: { general: 'General' } },
    { id: 'solitario', categoria: 'mesa', nombre: 'Solitario Klondike', hue: 140, etapa: 10, metrica: 'tiempo',
      desc: 'El solitario clásico de cartas. Subí todo el mazo a las pilas.',
      variantes: { 1: 'Robar de a 1', 3: 'Robar de a 3' } },
    { id: 'flow', categoria: 'logica', nombre: 'Flow', hue: 235, etapa: 10, metrica: 'tiempo',
      desc: 'Unilos puntos de colores con tuberías y llená todo el tablero.',
      variantes: { 5: 'Chico 5×5', 6: 'Mediano 6×6', 7: 'Grande 7×7', 8: 'Muy grande 8×8', 9: 'Enorme 9×9' } }
  ];
  JUEGOS.forEach((j) => { j.icono = ICONOS[j.id]; });

  /* ---------- Utilidades ---------- */
  const $ = (selector, raiz = document) => raiz.querySelector(selector);

  // `html` solo se usa con contenido propio (íconos), nunca con datos de la persona
  function el(etiqueta, { clase, texto, html, attrs } = {}, ...hijos) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    if (html !== undefined) nodo.innerHTML = html;
    if (attrs) Object.keys(attrs).forEach((k) => nodo.setAttribute(k, attrs[k]));
    hijos.forEach((h) => { if (h) nodo.append(h); });
    return nodo;
  }

  const FLECHA_VOLVER =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';

  function formatearValor(juego, valor) {
    if (juego.metrica === 'tiempo') return Cronometro.formatear(valor);
    if (juego.metrica === 'cantidad' && juego.unidad) return valor + ' ' + (Number(valor) === 1 ? juego.unidad[0] : juego.unidad[1]);
    return Number(valor).toLocaleString('es-AR');
  }

  function fechaCorta(ts) {
    return new Date(ts).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
  }

  function etiquetaVariante(juego, clave) {
    if (juego.variantes && juego.variantes[clave]) return juego.variantes[clave];
    return clave.charAt(0).toUpperCase() + clave.slice(1);
  }

  function abrirDialogo(dlg) {
    if (typeof dlg.showModal === 'function') {
      if (!dlg.open) dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
  }

  function cerrarDialogo(dlg) {
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  }

  /* ---------- Aviso emergente ---------- */
  let temporizadorToast = null;
  function notificar(texto, ms = 2600) {
    const toast = $('#toast');
    toast.textContent = texto;
    toast.classList.add('visible');
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => toast.classList.remove('visible'), ms);
  }

  /* ---------- Celebración (ganaste, fin de partida, etc.) ---------- */
  function crearConfeti(capa) {
    // Cada estilo tiene su propio confeti: forma (un carácter) y colores
    const MODELOS = {
      diario: { forma: '\u25A0', colores: ['#1f3b5c', '#b0801f', '#5a5954', '#8199b7'] },
      rosa: { forma: '\u2665', colores: ['#ff6fa5', '#ffb8d2', '#d6336c', '#c3a5ff', '#ffd23f'] },
      bosque: { forma: '\u2766', colores: ['#2f6b3f', '#c9921a', '#8fcf9a', '#7a4a14'] },
      terminal: { forma: '\u25AA', colores: ['#5fd068', '#f0b429', '#b8f5bd', '#0a6b1e'] },
      oceano: { forma: '\u25CF', colores: ['#0b6bcb', '#5db3ff', '#7fd8e0', '#f2b01e'] }
    };
    const modelo = MODELOS[global.Estilo ? global.Estilo.actual() : 'diario'] || MODELOS.diario;
    const colores = modelo.colores;
    for (let k = 0; k < 22; k++) {
      const s = el('span', { clase: 'confeti', texto: modelo.forma });
      s.style.setProperty('--x', Math.round(Math.random() * 96) + '%');
      s.style.setProperty('--d', (Math.random() * 0.9).toFixed(2) + 's');
      s.style.setProperty('--t', (2.2 + Math.random() * 1.8).toFixed(2) + 's');
      s.style.setProperty('--c', colores[k % colores.length]);
      s.style.setProperty('--s', (0.8 + Math.random() * 0.9).toFixed(2));
      capa.append(s);
    }
  }

  function celebrar({ titulo, mensaje = '', detalle = '', botones = null, confeti = true }) {
    const dlg = $('#dlg-celebracion');
    $('#celebracion-titulo').textContent = titulo;
    $('#celebracion-mensaje').textContent = mensaje;
    const det = $('#celebracion-detalle');
    det.textContent = detalle;
    det.hidden = !detalle;

    const cont = $('#celebracion-botones');
    cont.replaceChildren();
    const lista = botones && botones.length ? botones : [{ texto: 'Cerrar', primario: true }];
    lista.forEach((b) => {
      const btn = el('button', { clase: 'btn' + (b.primario ? ' btn--primario' : ''), texto: b.texto, attrs: { type: 'button' } });
      btn.addEventListener('click', () => {
        cerrarDialogo(dlg);
        if (b.alClick) b.alClick();
      });
      cont.append(btn);
    });

    const capa = $('#celebracion-confeti');
    capa.replaceChildren();
    if (confeti) crearConfeti(capa);

    abrirDialogo(dlg);
    const foco = cont.querySelector('.btn--primario') || cont.firstElementChild;
    if (foco) foco.focus();
  }

  /* ---------- Registro de juegos ---------- */
  const registrados = new Map();
  let activo = null; // lo que está corriendo en la vista de juego (objeto con destruir opcional)

  function registrar(def) {
    if (!def || !JUEGOS.some((j) => j.id === def.id)) {
      console.warn('Pasatiempos.registrar: id de juego desconocido', def && def.id);
      return;
    }
    registrados.set(def.id, def);
  }

  function limpiarActivo() {
    if (activo && typeof activo.destruir === 'function') {
      try { activo.destruir(); } catch (e) { console.error(e); }
    }
    activo = null;
  }

  // Borra los datos de prueba que dejó la pantalla provisoria de la etapa 1
  function limpiarPruebas() {
    registrados.forEach((def, id) => {
      Records.borrarVariante(id, 'prueba');
      Guardado.borrar('demo-' + id);
    });
  }

  /* ---------- Menú ---------- */
  function crearTarjeta(juego) {
    const listo = registrados.has(juego.id);
    const enCurso = listo && Guardado.existe(juego.id);

    let pie;
    if (!listo) pie = el('span', { clase: 'chip', texto: 'Próximamente, etapa ' + juego.etapa });
    else if (enCurso) pie = el('span', { clase: 'chip chip--marcador', texto: 'Partida en curso' });
    else pie = el('span', { clase: 'tarjeta__jugar', texto: 'Jugar' });

    const tarjeta = el('a', { clase: 'tarjeta', attrs: { href: '#/' + juego.id } },
      el('span', { clase: 'tarjeta__icono', html: juego.icono }),
      el('h2', { clase: 'tarjeta__nombre', texto: juego.nombre }),
      el('p', { clase: 'tarjeta__desc', texto: juego.desc }),
      el('div', { clase: 'tarjeta__pie' }, pie)
    );
    tarjeta.style.setProperty('--h', juego.hue);
    return tarjeta;
  }

  /* Libre / Desafío del día, arriba de cada juego que lo tiene */
  function crearSelectorModo(juego, diario) {
    const libre = el('a', { clase: 'modos__op', texto: 'Partida libre', attrs: { href: '#/' + juego.id } });
    const dia = el('a', { clase: 'modos__op', texto: 'Desafío del día', attrs: { href: '#/' + juego.id + '/diario' } });
    (diario ? dia : libre).setAttribute('aria-current', 'page');
    (diario ? dia : libre).classList.add('activo');
    return el('nav', { clase: 'modos', attrs: { 'aria-label': 'Modo de juego' } }, libre, dia);
  }

  function textoResultadoDiario(juego, res) {
    return formatearValor(juego, res.valor);
  }

  function crearPanelDiario() {
    const jugables = JUEGOS.filter((j) => registrados.has(j.id) && typeof registrados.get(j.id).iniciarDiario === 'function');
    if (!jugables.length || !global.Diario) return null;
    const hechos = global.Diario.cuantosHoy(jugables.map((j) => j.id));
    const racha = global.Diario.racha();

    const cab = el('div', { clase: 'dia__cab' },
      el('div', {},
        el('h2', { clase: 'dia__titulo', texto: 'Desafío del día', attrs: { id: 'dia-titulo' } }),
        el('p', { clase: 'dia__fecha', texto: global.Diario.fechaLarga(global.Diario.hoy()) })),
      el('div', { clase: 'dia__datos' },
        el('span', { clase: 'chip chip--marcador', texto: hechos + '/' + jugables.length + ' hoy' }),
        el('span', { clase: 'chip', texto: racha.n ? 'Racha: ' + racha.n + (racha.n === 1 ? ' día' : ' días') : 'Sin racha todavía' })));

    const lista = el('ul', { clase: 'dia__lista' });
    jugables.forEach((j) => {
      const res = global.Diario.resultadoDeHoy(j.id);
      const perdido = !res && global.Diario.cerradoHoy(j.id);
      const enCurso = !res && !perdido && Guardado.existe(j.id + '-diario');
      const estado = res ? '✓ ' + textoResultadoDiario(j, res) : perdido ? 'No salió hoy' : enCurso ? 'En curso' : 'Sin jugar';
      const a = el('a', { clase: 'dia__item' + (res ? ' hecho' : ''), attrs: { href: '#/' + j.id + '/diario' } },
        el('span', { clase: 'dia__icono', html: j.icono }),
        el('span', { clase: 'dia__nombre', texto: j.nombre }),
        el('span', { clase: 'dia__estado', texto: estado }));
      a.style.setProperty('--h', j.hue);
      lista.append(el('li', {}, a));
    });
    const seccion = el('section', { clase: 'dia', attrs: { 'aria-labelledby': 'dia-titulo' } }, cab, lista);
    if (global.Nube && global.Nube.activa && global.NubeUI) {
      const e = global.Nube.estado();
      const fila = el('div', { clase: 'dia__nube' });
      const rank = el('button', { clase: 'btn btn--chico', texto: 'Ranking de hoy', attrs: { type: 'button' } });
      rank.addEventListener('click', () => global.NubeUI.abrirRanking());
      const cuenta = el('button', { clase: 'btn btn--chico', attrs: { type: 'button' },
        texto: !e.listo ? 'Cuenta' : e.adentro ? (e.apodo ? 'Hola, ' + e.apodo : 'Elegir apodo') : 'Ingresar' });
      cuenta.addEventListener('click', () => global.NubeUI.abrirCuenta());
      fila.append(rank, cuenta);
      seccion.append(fila);
    }
    return seccion;
  }

  function refrescarPanelDiario() {
    const previo = $('#diario-menu');
    if (!previo) return;
    const nuevo = crearPanelDiario();
    if (!nuevo) return;
    nuevo.id = 'diario-menu';
    previo.replaceWith(nuevo);
  }

  /* ---------- Filtros del menú ---------- */
  const FILTROS = [
    { id: 'todos', nombre: 'Todos' },
    { id: 'logica', nombre: 'Lógica' },
    { id: 'palabras', nombre: 'Palabras' },
    { id: 'mesa', nombre: 'Mesa y cartas' }
  ];

  function filtroGuardado() {
    const f = Almacen.leer('menu:filtro', 'todos');
    return FILTROS.some((x) => x.id === f) ? f : 'todos';
  }

  function crearFiltros(alCambiar) {
    const grupo = el('div', { clase: 'seg filtros', attrs: { role: 'group', 'aria-label': 'Filtrar juegos por tipo' } });
    const botones = {};
    FILTROS.forEach((f) => {
      const n = f.id === 'todos' ? JUEGOS.length : JUEGOS.filter((j) => j.categoria === f.id).length;
      const b = el('button', { texto: f.nombre + ' (' + n + ')', attrs: { type: 'button', 'aria-pressed': 'false', 'data-filtro': f.id } });
      b.addEventListener('click', () => {
        Almacen.escribir('menu:filtro', f.id);
        marcar(f.id);
        alCambiar(f.id);
      });
      botones[f.id] = b;
      grupo.append(b);
    });
    function marcar(id) {
      FILTROS.forEach((f) => botones[f.id].setAttribute('aria-pressed', String(f.id === id)));
    }
    marcar(filtroGuardado());
    return el('div', { clase: 'filtros-caja' }, grupo);
  }

  function pintarGrilla(filtro) {
    const grilla = $('#grilla');
    grilla.replaceChildren();
    JUEGOS.filter((j) => filtro === 'todos' || j.categoria === filtro).forEach((j) => grilla.append(crearTarjeta(j)));
  }

  function mostrarMenu() {
    $('#vista-juego').hidden = true;
    $('#vista-menu').hidden = false;
    const grilla = $('#grilla');
    grilla.replaceChildren();
    const previo = $('#diario-menu');
    if (previo) previo.remove();
    const filtrosPrevio = $('.filtros-caja');
    if (filtrosPrevio) filtrosPrevio.remove();
    const panel = crearPanelDiario();
    if (panel) {
      panel.id = 'diario-menu';
      grilla.before(panel);
    }
    grilla.before(crearFiltros(pintarGrilla));
    pintarGrilla(filtroGuardado());
    document.title = 'Pasatiempos: juegos de lógica infinitos';
  }

  /* ---------- Vista de juego ---------- */
  function mostrarJuego(juego, diario) {
    $('#vista-menu').hidden = true;
    const vista = $('#vista-juego');
    vista.hidden = false;
    vista.replaceChildren();

    const volver = el('a', { clase: 'volver', attrs: { href: '#/' }, html: FLECHA_VOLVER + '<span>Menú</span>' });
    const titulo = el('h1', { clase: 'juego__titulo', texto: juego.nombre, attrs: { tabindex: '-1' } });
    const area = el('div', { clase: 'juego__area', attrs: { id: 'area-juego' } });
    const def = registrados.get(juego.id);
    const hayDiario = !!(def && typeof def.iniciarDiario === 'function');
    if (diario && !hayDiario) { global.location.replace('#/' + juego.id); return; }

    vista.append(el('div', { clase: 'juego__cab' }, volver, titulo));
    if (hayDiario) vista.append(crearSelectorModo(juego, diario));
    vista.append(area);
    document.title = (diario ? 'Desafío del día · ' : '') + juego.nombre + ' · Pasatiempos';

    if (def) {
      activo = def;
      if (diario) def.iniciarDiario(area, diario === 'practica');
      else def.iniciar(area);
    } else {
      activo = montarPlaceholder(juego, area);
    }
  }

  /* Pantalla provisoria de los juegos que todavía no existen.
     Sirve para probar cronómetro, guardado automático y marcas.
     Usa claves propias ("demo-…" y la variante "prueba") para no mezclarse con los juegos reales. */
  function montarPlaceholder(juego, area) {
    const modo = juego.metrica === 'puntaje' ? 'mayor' : 'menor';
    const claveDemo = 'demo-' + juego.id;
    const guardado = Guardado.cargar(claveDemo);
    const inicial = guardado && Number.isFinite(guardado.ms) ? guardado.ms : 0;

    const icono = el('div', { clase: 'proximamente__icono', html: juego.icono });
    icono.style.setProperty('--h', juego.hue);
    const aviso = el('div', { clase: 'panel proximamente' },
      icono,
      el('h2', { texto: 'Este juego llega en la etapa ' + juego.etapa }),
      el('p', { texto: 'Mientras tanto, podés probar acá abajo el cronómetro, el guardado automático y las mejores marcas.' })
    );

    const reloj = el('div', { clase: 'demo__reloj', texto: Cronometro.formatear(inicial) });
    const btnPlay = el('button', { clase: 'btn btn--primario', texto: 'Iniciar', attrs: { type: 'button' } });
    const btnReset = el('button', { clase: 'btn', texto: 'Reiniciar', attrs: { type: 'button' } });
    const btnMarca = el('button', { clase: 'btn', texto: 'Guardar marca de prueba', attrs: { type: 'button' } });
    const btnBorrar = el('button', { clase: 'btn btn--texto', texto: 'Borrar datos de prueba', attrs: { type: 'button' } });
    const top = el('ol', { clase: 'demo__top' });

    function etiquetarPlay(ms) {
      btnPlay.textContent = crono.corriendo ? 'Pausar' : (ms > 0 ? 'Seguir' : 'Iniciar');
    }
    const crono = new Cronometro({
      inicial,
      onTick: (ms) => { reloj.textContent = Cronometro.formatear(ms); etiquetarPlay(ms); }
    });
    etiquetarPlay(inicial);

    function pintarTop() {
      top.replaceChildren();
      const lista = Records.top(juego.id, 'prueba');
      if (!lista.length) {
        top.append(el('li', { texto: 'Todavía no hay marcas de prueba.' }));
        return;
      }
      lista.forEach((r) => top.append(el('li', { texto: formatearValor(juego, r.valor) + ' (' + fechaCorta(r.fecha) + ')' })));
    }
    pintarTop();

    btnPlay.addEventListener('click', () => crono.alternar());
    btnReset.addEventListener('click', () => {
      crono.reiniciar();
      Guardado.borrar(claveDemo);
    });
    btnMarca.addEventListener('click', () => {
      // En juegos de puntaje se usa 1 punto por segundo, solo para probar
      const valor = juego.metrica === 'tiempo' ? Math.round(crono.transcurrido) : Math.round(crono.transcurrido / 1000);
      if (valor <= 0) { notificar('Dejá correr el cronómetro un ratito antes de guardar.'); return; }
      const r = Records.agregar(juego.id, 'prueba', valor, { modo });
      notificar(r.esRecord ? 'Nueva mejor marca' : r.enTop ? 'Entraste al top en el puesto ' + r.posicion : 'No alcanzó para el top 5');
      pintarTop();
    });
    btnBorrar.addEventListener('click', () => {
      crono.reiniciar();
      Guardado.borrar(claveDemo);
      Records.borrarVariante(juego.id, 'prueba');
      pintarTop();
      notificar('Datos de prueba borrados.');
    });

    const demo = el('div', { clase: 'panel demo' },
      el('h3', { texto: 'Probá los módulos comunes' }),
      el('p', { clase: 'demo__ayuda', texto: 'El cronómetro se guarda solo. Dejalo correr, recargá la página y vas a verlo retomar donde quedó.' }),
      reloj,
      el('div', { clase: 'demo__botones' }, btnPlay, btnReset, btnMarca),
      top,
      el('div', { clase: 'demo__botones', attrs: { style: 'margin-top:14px' } }, btnBorrar)
    );

    area.append(aviso, demo);

    const auto = Guardado.autoguardar(
      claveDemo,
      () => (crono.transcurrido > 0 ? { ms: Math.round(crono.transcurrido) } : null),
      { cada: 2000 }
    );

    return {
      destruir() {
        auto.detener(true);
        crono.destruir();
      }
    };
  }

  /* ---------- Mejores marcas (diálogo) ---------- */
  function pintarRecords() {
    const cont = $('#records-lista');
    cont.replaceChildren();
    const todo = Records.todo();
    let hay = false;

    JUEGOS.forEach((juego) => {
      const porVariante = todo[juego.id];
      if (!porVariante) return;
      const claves = Object.keys(porVariante).filter((k) => Array.isArray(porVariante[k]) && porVariante[k].length);
      if (!claves.length) return;
      hay = true;

      const bloque = el('section', { clase: 'rec' }, el('h3', { clase: 'rec__juego', texto: juego.nombre }));
      claves.forEach((k) => {
        const lista = el('ol', { clase: 'rec__top' });
        porVariante[k].slice(0, 3).forEach((r) => {
          lista.append(el('li', { texto: formatearValor(juego, r.valor) + ' (' + fechaCorta(r.fecha) + ')' }));
        });
        bloque.append(el('div', { clase: 'rec__fila' },
          el('span', { clase: 'rec__variante', texto: etiquetaVariante(juego, k) }), lista));
      });
      cont.append(bloque);
    });

    // Desafío del día: mejor resultado y cantidad de días resueltos
    const bloqueDia = el('section', { clase: 'rec' }, el('h3', { clase: 'rec__juego', texto: 'Desafío del día' }));
    let hayDia = false;
    JUEGOS.forEach((juego) => {
      const hist = Almacen.leer('diario:hist:' + juego.id, null);
      const valores = hist ? Object.keys(hist).map((f) => hist[f]).filter(Number.isFinite) : [];
      if (!valores.length) return;
      hayDia = true;
      const mejor = juego.metrica === 'tiempo' ? Math.min(...valores) : Math.max(...valores);
      bloqueDia.append(el('div', { clase: 'rec__fila' },
        el('span', { clase: 'rec__variante', texto: juego.nombre }),
        el('ol', { clase: 'rec__top' }, el('li', { texto: 'Mejor: ' + formatearValor(juego, mejor) + ' · ' + valores.length + (valores.length === 1 ? ' día' : ' días') }))));
    });
    if (hayDia) { hay = true; cont.append(bloqueDia); }

    if (!hay) cont.append(el('p', { clase: 'vacio', texto: 'Todavía no hay marcas. Jugá una partida y va a aparecer acá.' }));
    $('#btn-borrar-records').hidden = !hay;
  }

  /* ---------- Selector de diseño ---------- */
  function iniciarSelectorEstilo() {
    const dlg = $('#dlg-estilo');
    const lista = $('#estilo-lista');
    if (!dlg || !lista || !global.Estilo) return;

    function pintar() {
      const actual = Estilo.actual();
      lista.replaceChildren();
      Estilo.lista().forEach((e) => {
        const btn = el('button', { clase: 'estilo-op', attrs: { type: 'button', 'data-estilo': e.id, 'aria-pressed': String(e.id === actual) } },
          el('span', { clase: 'estilo-op__muestra', attrs: { 'aria-hidden': 'true' } }, el('span'), el('span'), el('span')),
          el('span', { clase: 'estilo-op__nombre', texto: e.nombre }),
          el('span', { clase: 'estilo-op__desc', texto: e.desc }));
        btn.addEventListener('click', () => {
          Estilo.establecer(e.id);
          pintar();
        });
        lista.append(el('li', {}, btn));
      });
    }

    $('#btn-estilo').addEventListener('click', () => { pintar(); abrirDialogo(dlg); });
    $('#btn-cerrar-estilo').addEventListener('click', () => cerrarDialogo(dlg));
    dlg.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) cerrarDialogo(dlg);
    });
  }

  function abrirRecords() {
    pintarRecords();
    abrirDialogo($('#dlg-records'));
  }

  /* ---------- Navegación por hash (#/sudoku) ---------- */
  function enrutar(moverFoco) {
    limpiarActivo();
    const coincidencia = global.location.hash.match(/^#\/([a-z0-9-]+)(?:\/(diario|practica))?/);
    const juego = coincidencia ? JUEGOS.find((j) => j.id === coincidencia[1]) : null;

    if (juego) mostrarJuego(juego, coincidencia[2] || false);
    else mostrarMenu();

    global.scrollTo(0, 0);
    if (moverFoco) {
      const objetivo = $(juego ? '#vista-juego h1' : '#titulo-menu');
      if (objetivo) objetivo.focus({ preventScroll: true });
    }
  }

  function iniciar() {
    Tema.vincular($('#btn-tema'));
    limpiarPruebas();

    // "Saltar al contenido" (sin código en línea, por la política de seguridad de la página)
    $('#saltar').addEventListener('click', (e) => {
      e.preventDefault();
      const principal = $('#contenido');
      principal.setAttribute('tabindex', '-1');
      principal.focus();
    });

    iniciarSelectorEstilo();

    $('#btn-records').addEventListener('click', abrirRecords);
    $('#btn-cerrar-records').addEventListener('click', () => cerrarDialogo($('#dlg-records')));
    $('#btn-borrar-records').addEventListener('click', () => {
      if (global.confirm('¿Borrar todas las marcas guardadas? No se puede deshacer.')) {
        Records.borrarTodo();
        pintarRecords();
        notificar('Marcas borradas.');
      }
    });
    $('#dlg-records').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) cerrarDialogo(e.currentTarget); // clic en el fondo oscuro
    });

    global.addEventListener('hashchange', () => enrutar(true));
    enrutar(false);

    // Nube (cuenta y ranking): si no está configurada, no hace nada
    if (global.Nube && global.NubeUI) {
      global.Nube.alCambiar(() => { if (!$('#vista-menu').hidden) refrescarPanelDiario(); });
      global.NubeUI.iniciar();
    }
  }

  global.Pasatiempos = {
    registrar,
    notificar,
    celebrar,
    el,
    abrirDialogo,
    cerrarDialogo,
    formatearValor,
    tieneDiario(id) { const r = registrados.get(id); return !!(r && typeof r.iniciarDiario === 'function'); },
    volverAlMenu() { global.location.hash = '#/'; },
    catalogo: JUEGOS
  };

  // Los scripts de cada juego (con defer) se ejecutan antes de este evento, así que ya están registrados
  document.addEventListener('DOMContentLoaded', iniciar);
})(window);
