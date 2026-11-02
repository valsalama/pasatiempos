/* mastermind.js · Mastermind
   - La compu elige un código secreto de colores; vos tenés una cantidad limitada de intentos para descubrirlo.
   - Después de cada intento aparecen fichas chicas: llena = color correcto en su lugar; vacía = color correcto en otro lugar.
   - Cada color lleva un número (1 a 8), así se distinguen aunque no veas bien los colores. También funcionan las teclas 1 a 8.
   - Tres niveles. Se guardan las partidas en curso y las mejores marcas (menos intentos es mejor). */
(function (global) {
  'use strict';

  const ID = 'mastermind';
  const { el, notificar, celebrar } = global.Pasatiempos;

  const NIVELES = {
    facil: { nombre: 'Fácil', pos: 4, colores: 6, max: 10, repite: false, nota: '4 lugares, 6 colores, sin colores repetidos en el código' },
    medio: { nombre: 'Medio', pos: 4, colores: 6, max: 10, repite: true, nota: '4 lugares, 6 colores, el código puede repetir colores' },
    dificil: { nombre: 'Difícil', pos: 5, colores: 8, max: 12, repite: true, nota: '5 lugares, 8 colores, el código puede repetir colores' }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];
  const NOMBRES_COLOR = ['rojo', 'azul', 'verde', 'amarillo', 'violeta', 'naranja', 'celeste', 'rosa'];

  /* ---------------------------------------------------------
     Motor
     --------------------------------------------------------- */
  function generarCodigo(nv) {
    const codigo = [];
    const disponibles = [];
    for (let c = 0; c < nv.colores; c++) disponibles.push(c);
    for (let i = 0; i < nv.pos; i++) {
      if (nv.repite) {
        codigo.push(Math.floor(Math.random() * nv.colores));
      } else {
        const k = Math.floor(Math.random() * disponibles.length);
        codigo.push(disponibles.splice(k, 1)[0]);
      }
    }
    return codigo;
  }

  /* exactos: color y lugar correctos. parciales: color correcto en otro lugar */
  function evaluar(codigo, intento) {
    let exactos = 0;
    const cc = {};
    const ci = {};
    for (let i = 0; i < codigo.length; i++) {
      if (codigo[i] === intento[i]) exactos++;
      else {
        cc[codigo[i]] = (cc[codigo[i]] || 0) + 1;
        ci[intento[i]] = (ci[intento[i]] || 0) + 1;
      }
    }
    let parciales = 0;
    Object.keys(ci).forEach((c) => { parciales += Math.min(ci[c], cc[c] || 0); });
    return { exactos, parciales };
  }

  function crear(contenedor) {
    let nivel = 'medio';
    let codigo = [];
    let intentos = [];      // [{ g: [..], ex, pa }]
    let actual = [];        // intento en preparación, -1 = lugar vacío
    let fase = 'jugando';   // 'jugando' | 'ganado' | 'perdido'
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valIntento = el('span', { clase: 'dato__valor', texto: '0' });
    const valMax = el('span', { clase: 'dato__valor', texto: '10' });

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

    const filas = el('ol', { clase: 'mm__filas', attrs: { 'aria-label': 'Intentos' } });
    const paleta = el('div', { clase: 'mm__paleta', attrs: { role: 'group', 'aria-label': 'Colores' } });
    const btnBorrar = el('button', { clase: 'btn', texto: 'Borrar', attrs: { type: 'button' } });
    btnBorrar.addEventListener('click', () => quitarUltimo());
    const btnProbar = el('button', { clase: 'btn btn--primario', texto: 'Probar', attrs: { type: 'button' } });
    btnProbar.addEventListener('click', () => probar());
    const btnRendirse = el('button', { clase: 'btn btn--texto', texto: 'Rendirme y ver el código', attrs: { type: 'button' } });
    btnRendirse.addEventListener('click', () => rendirse());
    const acciones = el('div', { clase: 'jg__acciones' }, btnBorrar, btnProbar);
    const nota = el('p', { clase: 'jg__ayuda' });

    const raiz = el('div', { clase: 'jg mm' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Intento' }), valIntento),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Máximo' }), valMax)),
        btnRendirse),
      el('div', { clase: 'mm__marco' }, filas),
      paleta,
      acciones,
      nota
    );
    contenedor.append(raiz);

    function ficha(c, clase) {
      const f = el('span', { clase: 'mm__ficha' + (clase ? ' ' + clase : ''), attrs: { 'data-c': String(c) } });
      if (c >= 0) f.append(el('span', { clase: 'mm__num', texto: String(c + 1), attrs: { 'aria-hidden': 'true' } }));
      return f;
    }

    /* --- Dibujo --- */
    function pintarPaleta() {
      const nv = NIVELES[nivel];
      paleta.replaceChildren();
      for (let c = 0; c < nv.colores; c++) {
        const b = el('button', { clase: 'mm__color', attrs: { type: 'button', 'data-c': String(c), 'aria-label': 'Color ' + (c + 1) + ', ' + NOMBRES_COLOR[c] } },
          ficha(c));
        b.addEventListener('click', () => poner(c));
        paleta.append(b);
      }
    }

    function pintarFeedback(ex, pa, total) {
      const f = el('span', { clase: 'mm__pistas', attrs: { 'aria-hidden': 'true' } });
      f.style.setProperty('--cols', String(Math.ceil(total / 2)));
      for (let i = 0; i < total; i++) f.append(el('span', { clase: 'mm__punto' + (i < ex ? ' exacto' : i < ex + pa ? ' parcial' : '') }));
      return f;
    }

    function pintar() {
      const nv = NIVELES[nivel];
      filas.replaceChildren();

      // Fila del código: oculto hasta que termina la partida
      const revelar = fase !== 'jugando';
      const filaCod = el('li', { clase: 'mm__fila mm__codigo' + (revelar ? ' visible' : '') },
        el('span', { clase: 'mm__n', texto: 'Código', attrs: { 'aria-hidden': 'true' } }));
      const slotsCod = el('span', { clase: 'mm__slots' });
      codigo.forEach((c) => slotsCod.append(revelar ? ficha(c) : el('span', { clase: 'mm__ficha oculta' }, el('span', { clase: 'mm__num', texto: '?' }))));
      filaCod.append(slotsCod);
      if (revelar) filaCod.setAttribute('aria-label', 'Código: ' + codigo.map((c) => NOMBRES_COLOR[c]).join(', '));
      else filaCod.setAttribute('aria-label', 'Código secreto');
      filas.append(filaCod);

      for (let r = 0; r < nv.max; r++) {
        const li = el('li', { clase: 'mm__fila' });
        li.append(el('span', { clase: 'mm__n', texto: String(r + 1), attrs: { 'aria-hidden': 'true' } }));
        const slots = el('span', { clase: 'mm__slots' });
        if (r < intentos.length) {
          const it = intentos[r];
          it.g.forEach((c) => slots.append(ficha(c)));
          li.append(slots, pintarFeedback(it.ex, it.pa, nv.pos));
          li.setAttribute('aria-label', 'Intento ' + (r + 1) + ': ' + it.g.map((c) => NOMBRES_COLOR[c]).join(', ') + '. ' + it.ex + ' en su lugar, ' + it.pa + ' en otro lugar.');
        } else if (r === intentos.length && fase === 'jugando') {
          li.classList.add('actual');
          actual.forEach((c, i) => {
            const b = el('button', { clase: 'mm__slot', attrs: { type: 'button', 'aria-label': c >= 0 ? 'Lugar ' + (i + 1) + ': ' + NOMBRES_COLOR[c] + '. Tocá para vaciarlo.' : 'Lugar ' + (i + 1) + ' vacío' } },
              ficha(c, c < 0 ? 'vacia' : ''));
            b.addEventListener('click', () => { if (c >= 0) { actual[i] = -1; pintar(); } });
            slots.append(b);
          });
          li.append(slots, pintarFeedback(0, 0, nv.pos));
          li.setAttribute('aria-label', 'Intento ' + (r + 1) + ', en preparación');
        } else {
          for (let i = 0; i < nv.pos; i++) slots.append(el('span', { clase: 'mm__ficha vacia' }));
          li.classList.add('futura');
          li.append(slots, pintarFeedback(0, 0, nv.pos));
        }
        filas.append(li);
      }

      ORDEN.forEach((id) => botonesNivel[id].setAttribute('aria-pressed', String(id === nivel)));
      valIntento.textContent = String(Math.min(intentos.length + (fase === 'jugando' ? 1 : 0), nv.max));
      valMax.textContent = String(nv.max);
      btnProbar.disabled = fase !== 'jugando' || actual.some((c) => c < 0);
      btnBorrar.disabled = fase !== 'jugando' || actual.every((c) => c < 0);
      btnRendirse.hidden = fase !== 'jugando';
      paleta.hidden = fase !== 'jugando';
      acciones.hidden = fase !== 'jugando';
      nota.textContent = nv.nota + '. Punto lleno: color y lugar correctos. Aro: el color está pero en otro lugar.';
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando' || (!intentos.length && actual.every((c) => c < 0))) return null;
      return {
        nivel, codigo: codigo.join(''), actual: actual.join(','),
        intentos: intentos.map((it) => it.g.join('')).join(',')
      };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    function datosValidos(s) {
      const nv = NIVELES[s && s.nivel];
      if (!nv || typeof s.codigo !== 'string' || s.codigo.length !== nv.pos) return null;
      const num = (ch) => Number(ch);
      const cod = Array.from(s.codigo, num);
      if (!cod.every((c) => Number.isInteger(c) && c >= 0 && c < nv.colores)) return null;
      if (!nv.repite && new Set(cod).size !== cod.length) return null;
      const ints = s.intentos ? String(s.intentos).split(',') : [];
      if (ints.length >= nv.max) return null;
      const lista = [];
      for (const t of ints) {
        if (t.length !== nv.pos) return null;
        const g = Array.from(t, num);
        if (!g.every((c) => Number.isInteger(c) && c >= 0 && c < nv.colores)) return null;
        const ev = evaluar(cod, g);
        if (ev.exactos === nv.pos) return null;
        lista.push({ g, ex: ev.exactos, pa: ev.parciales });
      }
      const act = typeof s.actual === 'string' ? s.actual.split(',').map(Number) : [];
      if (act.length !== nv.pos || !act.every((c) => Number.isInteger(c) && c >= -1 && c < nv.colores)) return null;
      return { cod, lista, act };
    }

    /* --- Partidas --- */
    function nueva(id) {
      nivel = id;
      const nv = NIVELES[id];
      codigo = generarCodigo(nv);
      intentos = [];
      actual = new Array(nv.pos).fill(-1);
      fase = 'jugando';
      Guardado.borrar(ID);
      Almacen.escribir('mastermind:nivel', id);
      pintarPaleta();
      pintar();
    }

    function pedirNueva(id) {
      if (fase === 'jugando' && intentos.length > 0 && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(id);
    }

    /* --- Jugada --- */
    function poner(c) {
      if (fase !== 'jugando') return;
      const i = actual.indexOf(-1);
      if (i < 0) { notificar('Ya completaste todos los lugares. Tocá "Probar" o vaciá alguno.'); return; }
      actual[i] = c;
      pintar();
      guardarYa();
    }

    function quitarUltimo() {
      if (fase !== 'jugando') return;
      for (let i = actual.length - 1; i >= 0; i--) {
        if (actual[i] >= 0) { actual[i] = -1; break; }
      }
      pintar();
    }

    function probar() {
      if (fase !== 'jugando' || actual.some((c) => c < 0)) return;
      const nv = NIVELES[nivel];
      const g = actual.slice();
      const ev = evaluar(codigo, g);
      intentos.push({ g, ex: ev.exactos, pa: ev.parciales });
      actual = new Array(nv.pos).fill(-1);
      if (ev.exactos === nv.pos) { ganar(); return; }
      if (intentos.length >= nv.max) { perder(false); return; }
      pintar();
      guardarYa();
    }

    function ganar() {
      fase = 'ganado';
      Guardado.borrar(ID);
      pintar();
      const n = intentos.length;
      const r = Records.agregar(ID, nivel, n, { modo: 'menor' });
      let detalle;
      if (r.esRecord) detalle = 'Nueva mejor marca en el nivel ' + NIVELES[nivel].nombre.toLowerCase();
      else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
      else detalle = 'Tu mejor marca en este nivel es ' + Records.mejor(ID, nivel) + (Records.mejor(ID, nivel) === 1 ? ' intento.' : ' intentos.');
      despues(() => celebrar({
        titulo: 'Descubriste el código',
        mensaje: 'Nivel ' + NIVELES[nivel].nombre.toLowerCase() + ' en ' + n + (n === 1 ? ' intento.' : ' intentos.'),
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(nivel) },
          { texto: 'Cerrar' }
        ]
      }), 400);
    }

    function perder(rendido) {
      fase = 'perdido';
      Guardado.borrar(ID);
      pintar();
      despues(() => celebrar({
        titulo: rendido ? 'Este era el código' : 'Se acabaron los intentos',
        mensaje: 'El código era: ' + codigo.map((c) => (c + 1) + ' (' + NOMBRES_COLOR[c] + ')').join(', ') + '.',
        confeti: false,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(nivel) },
          { texto: 'Cerrar' }
        ]
      }), 300);
    }

    function rendirse() {
      if (fase !== 'jugando') return;
      if (intentos.length > 0 && !global.confirm('¿Querés ver el código? La partida se termina.')) return;
      perder(true);
    }

    /* --- Entrada --- */
    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const o = ev.target;
      if (o && (o.tagName === 'INPUT' || o.tagName === 'SELECT' || o.tagName === 'TEXTAREA')) return;
      if (fase !== 'jugando') return;
      const nv = NIVELES[nivel];
      if (/^[1-8]$/.test(ev.key) && Number(ev.key) <= nv.colores) { ev.preventDefault(); poner(Number(ev.key) - 1); }
      else if (ev.key === 'Backspace') { ev.preventDefault(); quitarUltimo(); }
      else if (ev.key === 'Enter' && o && o.tagName !== 'BUTTON') { ev.preventDefault(); probar(); }
    }
    document.addEventListener('keydown', alTecla);

    /* --- Inicio --- */
    const guardado = Guardado.cargar(ID);
    const datos = guardado ? datosValidos(guardado) : null;
    if (datos) {
      nivel = guardado.nivel;
      codigo = datos.cod;
      intentos = datos.lista;
      actual = datos.act;
      fase = 'jugando';
      pintarPaleta();
      pintar();
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ultimo = Almacen.leer('mastermind:nivel', 'medio');
      nueva(NIVELES[ultimo] ? ultimo : 'medio');
    }

    return {
      pruebas: { poner, probar, codigo: () => codigo.slice(), estado: () => ({ fase, intentos: intentos.length }) },
      destruir() {
        destruido = true;
        document.removeEventListener('keydown', alTecla);
        temporizadores.forEach((id) => clearTimeout(id));
        temporizadores.clear();
        auto.detener(true);
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
  global.MastermindMotor = { evaluar, generarCodigo };
})(window);
