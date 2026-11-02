/* spelling-bee.js · Etapa 9: Spelling Bee (la abeja)
   - Hay siete letras: una en el centro y seis alrededor. Formá todas las palabras que puedas.
   - Reglas: mínimo 4 letras, tiene que llevar la letra del centro, se pueden repetir letras, sin tildes.
   - Puntos: 1 por las palabras de 4 letras, y una por cada letra en las más largas. Cada pangrama
     (usa las siete letras) da 7 puntos extra.
   - Las palabras están en palabras-bee.js, que se baja recién cuando entrás a este juego (es un archivo grande).
   - Las letras se pueden tocar, o armar la palabra deslizando el dedo (o con el mouse apretado) de una a otra.
   - Cuando querés cortar, tocás "Terminar": se guarda tu puntaje y se muestran las palabras que faltaban. */
(function (global) {
  'use strict';

  const ID = 'spelling-bee';
  const { el, notificar, celebrar } = global.Pasatiempos;

  const MIN_RESP = 25;
  const MAX_RESP = 110;
  const RANGOS = [
    [0, 'Principiante'], [2, 'Novato'], [5, 'Bien'], [8, 'Bueno'], [15, 'Muy bueno'],
    [25, 'Excelente'], [40, 'Genial'], [50, 'Increíble'], [70, 'Abeja reina']
  ];

  const bit = (ch) => 1 << (ch.charCodeAt(0) - 97);
  const maskDe = (w) => { let m = 0; for (let i = 0; i < w.length; i++) m |= bit(w[i]); return m; };
  const letrasDeMask = (m) => { const r = []; for (let i = 0; i < 26; i++) if (m & (1 << i)) r.push(String.fromCharCode(97 + i)); return r; };
  const puntosDe = (w, m) => (w.length === 4 ? 1 : w.length) + (maskDe(w) === m ? 7 : 0);

  let cargando = null;
  function cargarDatos() {
    if (global.PalabrasBee) return Promise.resolve();
    if (cargando) return cargando;
    cargando = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'js/palabras-bee.js';
      s.onload = () => resolve();
      s.onerror = () => { cargando = null; reject(new Error('No se pudo bajar la lista de palabras.')); };
      document.head.append(s);
    });
    return cargando;
  }

  let masks = null;
  function mascaras() {
    if (!masks) masks = global.PalabrasBee.palabras.map(maskDe);
    return masks;
  }

  function respuestas(m, centro) {
    const pal = global.PalabrasBee.palabras;
    const ms = mascaras();
    const cb = bit(centro);
    const res = [];
    for (let i = 0; i < pal.length; i++) {
      if ((ms[i] & ~m) === 0 && (ms[i] & cb)) res.push(pal[i]);
    }
    return res;
  }

  /* Busca un juego con entre MIN_RESP y MAX_RESP respuestas */
  function armarJuego() {
    const pang = global.PalabrasBee.pangramas;
    for (let intento = 0; intento < 400; intento++) {
      const m = maskDe(pang[Math.floor(Math.random() * pang.length)]);
      const letras = letrasDeMask(m);
      if (letras.length !== 7) continue;
      const orden = letras.slice().sort(() => Math.random() - 0.5);
      for (const centro of orden) {
        const r = respuestas(m, centro);
        if (r.length >= MIN_RESP && r.length <= MAX_RESP) return { mask: m, centro, lista: r };
      }
    }
    // Respaldo: el menos malo de un último intento
    const m = maskDe(pang[0]);
    const letras = letrasDeMask(m);
    return { mask: m, centro: letras[0], lista: respuestas(m, letras[0]) };
  }

  function rangoPara(puntos, maximo) {
    const pc = maximo ? (puntos * 100) / maximo : 0;
    let actual = 0;
    RANGOS.forEach((r, i) => { if (pc >= r[0]) actual = i; });
    return actual;
  }

  function crear(contenedor) {
    let mask = 0;
    let centro = '';
    let lista = [];
    let maximo = 0;
    let encontradas = [];
    let puntos = 0;
    let entrada = '';
    let externas = [];
    let fase = 'jugando';   // 'jugando' | 'fin'
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valPuntos = el('span', { clase: 'dato__valor', texto: '0' });
    const valRango = el('span', { clase: 'dato__valor', texto: 'Principiante' });
    const valCant = el('span', { clase: 'dato__valor', texto: '0' });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    const btnTerminar = el('button', { clase: 'btn', texto: 'Terminar', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', pedirNueva);
    btnTerminar.addEventListener('click', pedirTerminar);

    const barra = el('div', { clase: 'bee__barra', attrs: { role: 'progressbar', 'aria-label': 'Progreso', 'aria-valuemin': '0', 'aria-valuemax': '100' } });
    const marcas = el('div', { clase: 'bee__marcas' });
    const relleno = el('div', { clase: 'bee__relleno' });
    barra.append(relleno, marcas);
    RANGOS.forEach((r, i) => {
      const m = el('span', { clase: 'bee__marca' });
      m.style.setProperty('--x', String(r[0]));
      marcas.append(m);
    });

    const campo = el('div', { clase: 'bee__campo', attrs: { 'aria-live': 'polite' } });
    const aviso = el('p', { clase: 'bee__aviso', attrs: { 'aria-live': 'polite' } });
    const panal = el('div', { clase: 'bee__panal' });
    const listaEl = el('ul', { clase: 'bee__lista' });
    const btnBorrar = el('button', { clase: 'btn', texto: 'Borrar', attrs: { type: 'button' } });
    const btnMezclar = el('button', { clase: 'btn', texto: 'Mezclar', attrs: { type: 'button' } });
    const btnEnviar = el('button', { clase: 'btn btn--primario', texto: 'Probar', attrs: { type: 'button' } });
    btnBorrar.addEventListener('click', () => { entrada = entrada.slice(0, -1); pintarCampo(); });
    btnMezclar.addEventListener('click', () => { externas.sort(() => Math.random() - 0.5); pintarPanal(); });
    btnEnviar.addEventListener('click', enviar);

    const raiz = el('div', { clase: 'jg bee' },
      el('div', { clase: 'jg__fila' }, btnNuevo, btnTerminar),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Puntos' }), valPuntos),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Rango' }), valRango),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Palabras' }), valCant))),
      barra,
      campo,
      aviso,
      panal,
      el('div', { clase: 'jg__acciones' }, btnBorrar, btnMezclar, btnEnviar),
      el('h3', { clase: 'bee__titulo', texto: 'Palabras encontradas' }),
      listaEl,
      el('p', { clase: 'jg__ayuda', texto: 'Formá palabras de 4 letras o más con las letras de la colmena. Tiene que estar la letra del centro (la destacada) y podés repetir letras. Tocá las letras, deslizá el dedo (o mantené apretado el mouse) pasando por ellas, o usá el teclado; Enter prueba la palabra. Las palabras con las siete letras son pangramas y valen 7 puntos extra. Cuando quieras cortar, tocá Terminar para guardar tu puntaje.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    const POS = [[50, 50]]; // el centro
    for (let k = 0; k < 6; k++) {
      const ang = (Math.PI / 3) * k;
      POS.push([50 + 34 * Math.sin(ang), 50 - 34 * Math.cos(ang)]);
    }

    function pintarPanal() {
      panal.replaceChildren();
      const todas = [centro].concat(externas);
      todas.forEach((ch, i) => {
        const b = el('button', {
          clase: 'bee__letra' + (i === 0 ? ' centro' : ''),
          texto: ch.toUpperCase(),
          attrs: { type: 'button', 'aria-label': (i === 0 ? 'Letra central ' : 'Letra ') + ch.toUpperCase() }
        });
        b.style.setProperty('--x', POS[i][0].toFixed(2));
        b.style.setProperty('--y', POS[i][1].toFixed(2));
        b.disabled = fase === 'fin';
        b.dataset.l = ch;
        // Con mouse o dedo se maneja por gestos (ver abajo); este click solo cubre el teclado
        b.addEventListener('click', (ev) => { if (ev.detail === 0) escribir(ch); });
        panal.append(b);
      });
    }

    function pintarCampo() {
      campo.replaceChildren();
      if (!entrada) {
        campo.append(el('span', { clase: 'bee__vacio', texto: 'Escribí una palabra' }));
        return;
      }
      for (const ch of entrada) {
        campo.append(el('span', { clase: 'bee__ch' + (ch === centro ? ' centro' : (letrasDeMask(mask).includes(ch) ? '' : ' mala')), texto: ch.toUpperCase() }));
      }
    }

    function pintarLista() {
      listaEl.replaceChildren();
      const ordenadas = encontradas.slice().sort((a, b) => a.localeCompare(b, 'es'));
      ordenadas.forEach((w) => {
        listaEl.append(el('li', { clase: maskDe(w) === mask ? 'pangrama' : '', texto: w.toUpperCase() }));
      });
      if (fase === 'fin') {
        const faltan = lista.filter((w) => !encontradas.includes(w)).sort((a, b) => a.localeCompare(b, 'es'));
        faltan.forEach((w) => listaEl.append(el('li', { clase: 'falto' + (maskDe(w) === mask ? ' pangrama' : ''), texto: w.toUpperCase() })));
      }
    }

    function pintarDatos() {
      const r = rangoPara(puntos, maximo);
      valPuntos.textContent = String(puntos);
      valRango.textContent = RANGOS[r][1];
      valCant.textContent = encontradas.length + ' / ' + lista.length;
      const pc = maximo ? Math.min(100, (puntos * 100) / maximo) : 0;
      relleno.style.setProperty('--p', pc.toFixed(1));
      barra.setAttribute('aria-valuenow', String(Math.round(pc)));
      btnTerminar.disabled = fase === 'fin';
      btnEnviar.disabled = fase === 'fin';
      btnBorrar.disabled = fase === 'fin';
      btnMezclar.disabled = fase === 'fin';
    }

    function pintarTodo() {
      pintarPanal();
      pintarCampo();
      pintarLista();
      pintarDatos();
    }

    /* --- Deslizar el dedo (o mantener apretado el mouse) por las letras para armar la palabra --- */
    let desliza = null;
    function letraEn(x, y) {
      const e = document.elementFromPoint(x, y);
      return e && e.closest ? e.closest('.bee__letra') : null;
    }
    function marcar(hex) {
      escribir(hex.dataset.l);
      hex.classList.add('activa');
    }
    panal.addEventListener('pointerdown', (ev) => {
      if (fase === 'fin' || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      const hex = ev.target.closest && ev.target.closest('.bee__letra');
      if (!hex) return;
      ev.preventDefault();
      desliza = { id: ev.pointerId, ultima: hex };
      try { panal.setPointerCapture(ev.pointerId); } catch (e) { /* sin captura */ }
      marcar(hex);
    });
    panal.addEventListener('pointermove', (ev) => {
      if (!desliza || ev.pointerId !== desliza.id) return;
      const hex = letraEn(ev.clientX, ev.clientY);
      if (hex && hex !== desliza.ultima) { desliza.ultima = hex; marcar(hex); }
    });
    function soltarGesto(ev) {
      if (!desliza || ev.pointerId !== desliza.id) return;
      desliza = null;
      panal.querySelectorAll('.activa').forEach((n) => n.classList.remove('activa'));
    }
    panal.addEventListener('pointerup', soltarGesto);
    panal.addEventListener('pointercancel', soltarGesto);

    function mensaje(texto, clase) {
      aviso.textContent = texto;
      aviso.className = 'bee__aviso' + (clase ? ' ' + clase : '');
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando' || !encontradas.length) return null;
      return { centro, externas: externas.join(''), encontradas: encontradas.join(',') };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }

    /* --- Partidas --- */
    function aplicarJuego(j) {
      mask = j.mask;
      centro = j.centro;
      lista = j.lista;
      externas = letrasDeMask(mask).filter((c) => c !== centro).sort(() => Math.random() - 0.5);
      maximo = lista.reduce((t, w) => t + puntosDe(w, mask), 0);
    }

    function nueva() {
      aplicarJuego(armarJuego());
      encontradas = [];
      puntos = 0;
      entrada = '';
      fase = 'jugando';
      Guardado.borrar(ID);
      mensaje('');
      pintarTodo();
    }

    function pedirNueva() {
      if (fase === 'jugando' && encontradas.length > 0 && !global.confirm('Si empezás un juego nuevo, perdés lo que llevás. Si querés guardar tu puntaje, tocá Terminar. ¿Seguimos?')) return;
      nueva();
    }

    function cargar(s) {
      const m = maskDe(s.centro + s.externas);
      aplicarJuego({ mask: m, centro: s.centro, lista: respuestas(m, s.centro) });
      externas = Array.from(s.externas);
      encontradas = s.encontradas ? s.encontradas.split(',').filter((w) => lista.includes(w)) : [];
      puntos = encontradas.reduce((t, w) => t + puntosDe(w, mask), 0);
      entrada = '';
      fase = 'jugando';
      pintarTodo();
    }

    function validoGuardado(s) {
      return !!s && typeof s.centro === 'string' && /^[a-z]$/.test(s.centro) &&
        typeof s.externas === 'string' && /^[a-z]{6}$/.test(s.externas) &&
        new Set(s.centro + s.externas).size === 7 && typeof s.encontradas === 'string';
    }

    /* --- Jugada --- */
    function escribir(ch) {
      if (fase === 'fin') return;
      if (entrada.length >= 20) return;
      entrada += ch;
      mensaje('');
      pintarCampo();
    }

    function enviar() {
      if (fase === 'fin') return;
      const w = entrada;
      if (!w) return;
      const set = letrasDeMask(mask);
      let error = '';
      if (w.length < 4) error = 'Muy corta: mínimo 4 letras.';
      else if (!Array.from(w).every((c) => set.includes(c))) error = 'Hay letras que no están en la colmena.';
      else if (!w.includes(centro)) error = 'Falta la letra del centro.';
      else if (encontradas.includes(w)) error = 'Ya la encontraste.';
      else if (!lista.includes(w)) error = 'Esa palabra no está en mi lista.';
      if (error) {
        mensaje(error, 'mal');
        campo.classList.remove('sacude');
        void campo.offsetWidth;
        campo.classList.add('sacude');
        despues(() => { campo.classList.remove('sacude'); entrada = ''; pintarCampo(); }, 450);
        return;
      }
      const ganados = puntosDe(w, mask);
      encontradas.push(w);
      puntos += ganados;
      entrada = '';
      const pang = maskDe(w) === mask;
      mensaje(pang ? 'Pangrama: +' + ganados + ' puntos.' : '+' + ganados + (ganados === 1 ? ' punto' : ' puntos'), 'ok');
      pintarTodo();
      guardarYa();
      if (rangoPara(puntos, maximo) === RANGOS.length - 1 || encontradas.length === lista.length) {
        despues(() => terminar(true), 500);
      }
    }

    function pedirTerminar() {
      if (fase === 'fin') return;
      if (!encontradas.length) { notificar('Todavía no encontraste ninguna palabra.'); return; }
      if (!global.confirm('¿Terminar acá? Se guarda tu puntaje y se muestran las palabras que faltaban.')) return;
      terminar(false);
    }

    function terminar(completo) {
      if (fase === 'fin') return;
      fase = 'fin';
      Guardado.borrar(ID);
      pintarTodo();
      const r = Records.agregar(ID, 'general', puntos, { modo: 'mayor' });
      let detalle;
      if (r.esRecord) detalle = 'Nueva mejor marca.';
      else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
      else detalle = 'Tu mejor marca es ' + Number(Records.mejor(ID, 'general')).toLocaleString('es-AR') + ' puntos.';
      const rango = RANGOS[rangoPara(puntos, maximo)][1];
      celebrar({
        titulo: completo ? 'Llegaste a la cima' : 'Juego terminado',
        mensaje: 'Rango: ' + rango + '. ' + puntos + ' puntos con ' + encontradas.length + ' de ' + lista.length + ' palabras.',
        detalle,
        confeti: rangoPara(puntos, maximo) >= 5,
        botones: [{ texto: 'Nuevo juego', primario: true, alClick: () => nueva() }, { texto: 'Ver las palabras' }]
      });
    }

    /* --- Entrada --- */
    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey || fase === 'fin') return;
      const o = ev.target;
      if (o && (o.tagName === 'INPUT' || o.tagName === 'SELECT' || o.tagName === 'TEXTAREA')) return;
      if (ev.key === 'Backspace') { ev.preventDefault(); entrada = entrada.slice(0, -1); pintarCampo(); return; }
      if (ev.key === 'Enter') {
        if (o && o.tagName === 'BUTTON') return;
        ev.preventDefault();
        enviar();
        return;
      }
      if (ev.key.length === 1) {
        const l = ev.key.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        if (/^[a-z]$/.test(l)) { ev.preventDefault(); escribir(l); }
      }
    }
    document.addEventListener('keydown', alTecla);

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    if (validoGuardado(guardado)) {
      cargar(guardado);
      notificar('Seguís con el juego que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      nueva();
    }

    return {
      pruebas: {
        estado: () => ({ centro, externas: externas.slice(), lista: lista.slice(), puntos, maximo, encontradas: encontradas.slice(), fase }),
        escribir, enviar
      },
      destruir() {
        destruido = true;
        document.removeEventListener('keydown', alTecla);
        temporizadores.forEach((id) => clearTimeout(id));
        temporizadores.clear();
      }
    };
  }

  let instancia = null;
  let pedido = 0;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) {
      const mio = ++pedido;
      const msg = el('p', { clase: 'jg__ayuda', texto: 'Cargando las palabras…' });
      contenedor.append(msg);
      cargarDatos().then(() => {
        if (mio !== pedido) return;       // se salió del juego mientras cargaba
        msg.remove();
        instancia = crear(contenedor);
      }).catch((e) => {
        if (mio !== pedido) return;
        msg.textContent = 'No pude cargar las palabras. Revisá tu conexión y volvé a entrar.';
      });
    },
    destruir() {
      pedido++;
      if (instancia) { instancia.destruir(); instancia = null; }
    }
  });
})(window);
