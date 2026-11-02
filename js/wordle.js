/* wordle.js · Etapa 9: Wordle en español
   - Hay que adivinar una palabra de 5 letras en 6 intentos.
   - Después de cada intento, cada letra se pinta: verde (está en su lugar), amarilla (está en otro lugar) o gris (no está).
   - No hace falta poner tildes. La Ñ tiene su propia tecla.
   - Partida libre, desafío del día (la misma palabra para todos) y práctica.
   - Las listas de palabras están en palabras-wordle.js. */
(function (global) {
  'use strict';

  const BASE = 'wordle';
  let ID = BASE;            // 'wordle', 'wordle-diario' o 'wordle-practica'
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  const { el, notificar, celebrar } = global.Pasatiempos;

  const LARGO = 5;
  const INTENTOS = 6;
  const FILAS_TECLADO = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'];
  const TEXTO_ESTADO = { c: 'en su lugar', p: 'en otro lugar', a: 'no está' };

  /* Evalúa un intento: 'c' correcta, 'p' presente en otro lugar, 'a' ausente (con el manejo de letras repetidas) */
  function evaluar(intento, secreta) {
    const res = new Array(LARGO).fill('a');
    const libres = {};
    for (let i = 0; i < LARGO; i++) {
      if (intento[i] === secreta[i]) res[i] = 'c';
      else libres[secreta[i]] = (libres[secreta[i]] || 0) + 1;
    }
    for (let i = 0; i < LARGO; i++) {
      if (res[i] === 'c') continue;
      if (libres[intento[i]] > 0) { res[i] = 'p'; libres[intento[i]]--; }
    }
    return res;
  }

  function palabraDelDia() {
    const lista = global.PalabrasWordle.soluciones;
    const azar = global.Diario.crearAzar(global.Diario.semilla(BASE));
    return lista[Math.floor(azar() * lista.length)];
  }

  function palabraAlAzar(evitar) {
    const lista = global.PalabrasWordle.soluciones;
    let p;
    do { p = lista[Math.floor(Math.random() * lista.length)]; } while (p === evitar && lista.length > 1);
    return p;
  }

  function crear(contenedor) {
    const validas = global.PalabrasWordle.validas;
    let secreta = '';
    let intentos = [];       // lista de palabras ya jugadas
    let actual = '';         // lo que se está escribiendo
    let fase = 'jugando';    // 'jugando' | 'ganado' | 'perdido'
    let destruido = false;
    let ocupado = false;     // mientras se anima una fila
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const esDiario = MODO !== 'libre';
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: MODO === 'practica' ? 'Reiniciar' : 'Nueva palabra', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', pedirNueva);

    /* --- Tablero --- */
    const filasEl = [];
    const celdasEl = [];
    const grilla = el('div', { clase: 'wd__grilla', attrs: { role: 'grid', 'aria-label': 'Intentos' } });
    for (let f = 0; f < INTENTOS; f++) {
      const fila = el('div', { clase: 'wd__fila', attrs: { role: 'row' } });
      const celdas = [];
      for (let k = 0; k < LARGO; k++) {
        const c = el('div', { clase: 'wd__celda', attrs: { role: 'gridcell' } });
        fila.append(c);
        celdas.push(c);
      }
      grilla.append(fila);
      filasEl.push(fila);
      celdasEl.push(celdas);
    }

    /* --- Teclado en pantalla --- */
    const teclasEl = {};
    const teclado = el('div', { clase: 'wd__teclado' });
    FILAS_TECLADO.forEach((fila, i) => {
      const f = el('div', { clase: 'wd__tfila' });
      if (i === 2) f.append(tecla('ENTER', 'Enter', 'wd__tecla--ancha'));
      for (const ch of fila) f.append(tecla(ch, ch));
      if (i === 2) f.append(tecla('BORRAR', '⌫', 'wd__tecla--ancha', 'Borrar'));
      teclado.append(f);
    });
    function tecla(valor, texto, extra, etiqueta) {
      const b = el('button', { clase: 'wd__tecla' + (extra ? ' ' + extra : ''), texto, attrs: { type: 'button', 'data-tecla': valor } });
      if (etiqueta) b.setAttribute('aria-label', etiqueta);
      b.addEventListener('click', () => entrar(valor));
      teclasEl[valor] = b;
      return b;
    }

    const aviso = el('p', { clase: 'wd__aviso', attrs: { 'aria-live': 'polite' } });
    const datoIntento = el('span', { clase: 'dato__valor', texto: '0 / ' + INTENTOS });

    const raiz = el('div', { clase: 'jg wd' },
      esDiario ? global.Diario.cartel(MODO) : null,
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Intento' }), datoIntento)),
        (MODO === 'diario') ? null : btnNuevo),
      grilla,
      aviso,
      teclado,
      el('p', { clase: 'jg__ayuda', texto: 'Adiviná la palabra de 5 letras en 6 intentos. Verde: la letra está en su lugar. Amarillo: está, pero en otro lugar. Gris: no está. No hace falta poner tildes. Podés escribir con el teclado o tocar las teclas.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function pintarFila(f, palabra, estados) {
      for (let k = 0; k < LARGO; k++) {
        const c = celdasEl[f][k];
        c.textContent = palabra[k] || '';
        c.classList.toggle('llena', !!palabra[k]);
        c.classList.remove('c', 'p', 'a');
        if (estados) {
          c.classList.add(estados[k]);
          c.setAttribute('aria-label', palabra[k] + ', ' + TEXTO_ESTADO[estados[k]]);
        } else {
          c.removeAttribute('aria-label');
        }
      }
    }

    function pintarTeclado() {
      const mejor = {};
      const peso = { a: 1, p: 2, c: 3 };
      intentos.forEach((w) => {
        const est = evaluar(w, secreta);
        for (let k = 0; k < LARGO; k++) {
          if (!mejor[w[k]] || peso[est[k]] > peso[mejor[w[k]]]) mejor[w[k]] = est[k];
        }
      });
      Object.keys(teclasEl).forEach((t) => {
        const b = teclasEl[t];
        b.classList.remove('c', 'p', 'a');
        if (mejor[t]) b.classList.add(mejor[t]);
      });
    }

    function pintarTodo() {
      for (let f = 0; f < INTENTOS; f++) {
        if (f < intentos.length) pintarFila(f, intentos[f], evaluar(intentos[f], secreta));
        else if (f === intentos.length && fase === 'jugando') pintarFila(f, actual, null);
        else pintarFila(f, '', null);
      }
      pintarTeclado();
      datoIntento.textContent = Math.min(intentos.length + (fase === 'jugando' ? 1 : 0), INTENTOS) + ' / ' + INTENTOS;
    }

    function mensaje(texto) {
      aviso.textContent = texto;
    }

    function sacudir(f) {
      const fila = filasEl[f];
      fila.classList.remove('sacude');
      void fila.offsetWidth;
      fila.classList.add('sacude');
      despues(() => fila.classList.remove('sacude'), 450);
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando' || !intentos.length) return null;
      return { secreta, intentos: intentos.join(','), fecha: MODO === 'libre' ? undefined : global.Diario.hoy() };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }

    /* --- Partidas --- */
    function nueva() {
      secreta = MODO === 'libre' ? palabraAlAzar(secreta) : (MODO === 'diario' ? palabraDelDia() : palabraDelDia());
      intentos = [];
      actual = '';
      fase = 'jugando';
      ocupado = false;
      Guardado.borrar(ID);
      mensaje('');
      pintarTodo();
    }

    function pedirNueva() {
      if (fase === 'jugando' && intentos.length > 0 && !global.confirm('Si empezás de nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva();
    }

    function validoGuardado(s) {
      if (!s || typeof s.secreta !== 'string' || typeof s.intentos !== 'string') return false;
      if (!validas.has(s.secreta) || s.secreta.length !== LARGO) return false;
      const lista = s.intentos === '' ? [] : s.intentos.split(',');
      if (lista.length >= INTENTOS) return false;
      if (!lista.every((w) => w.length === LARGO && validas.has(w) && w !== s.secreta)) return false;
      if (MODO !== 'libre' && s.secreta !== palabraDelDia()) return false;
      return true;
    }

    /* --- Jugada --- */
    function entrar(valor) {
      if (fase !== 'jugando' || ocupado) return;
      if (valor === 'ENTER') { enviar(); return; }
      if (valor === 'BORRAR') {
        if (actual.length) { actual = actual.slice(0, -1); mensaje(''); pintarTodo(); }
        return;
      }
      if (actual.length < LARGO) {
        actual += valor;
        mensaje('');
        pintarTodo();
      }
    }

    function enviar() {
      const f = intentos.length;
      if (actual.length < LARGO) { sacudir(f); mensaje('Faltan letras.'); return; }
      if (!validas.has(actual)) { sacudir(f); mensaje('Esa palabra no está en mi lista.'); return; }
      intentos.push(actual);
      actual = '';
      mensaje('');
      // Revelado: se pintan las letras de a una
      ocupado = true;
      const est = evaluar(intentos[f], secreta);
      for (let k = 0; k < LARGO; k++) celdasEl[f][k].classList.remove('c', 'p', 'a');
      for (let k = 0; k < LARGO; k++) {
        despues(() => {
          celdasEl[f][k].classList.add(est[k]);
          celdasEl[f][k].setAttribute('aria-label', intentos[f][k] + ', ' + TEXTO_ESTADO[est[k]]);
        }, k * 130);
      }
      despues(() => {
        ocupado = false;
        const gano = intentos[f] === secreta;
        if (gano) { fase = 'ganado'; pintarTodo(); terminar(true); }
        else if (intentos.length >= INTENTOS) { fase = 'perdido'; pintarTodo(); terminar(false); }
        else { pintarTodo(); guardarYa(); }
      }, LARGO * 130 + 120);
    }

    function terminar(gano) {
      Guardado.borrar(ID);
      const n = intentos.length;
      if (gano) {
        for (let k = 0; k < LARGO; k++) celdasEl[n - 1][k].classList.add('salta');
        const frases = ['Increíble', 'Muy bien', 'Excelente', 'Muy bien', 'Bien', 'Justo a tiempo'];
        if (MODO === 'diario') {
          const rd = global.Diario.registrar(BASE, n);
          celebrar({
            titulo: 'Desafío del día resuelto',
            mensaje: frases[n - 1] + ': la palabra era ' + secreta + ', en ' + n + (n === 1 ? ' intento.' : ' intentos.'),
            detalle: rd.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + rd.racha + (rd.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.',
            botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
          });
          return;
        }
        if (MODO === 'practica') {
          celebrar({ titulo: 'Palabra adivinada', mensaje: 'Práctica: ' + n + (n === 1 ? ' intento.' : ' intentos.') + ' No suma al ranking.', botones: [{ texto: 'Cerrar', primario: true }] });
          return;
        }
        const r = Records.agregar(ID, 'general', n, { modo: 'menor' });
        let detalle;
        if (r.esRecord) detalle = 'Nueva mejor marca: ' + n + (n === 1 ? ' intento.' : ' intentos.');
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca es ' + Records.mejor(ID, 'general') + (Records.mejor(ID, 'general') === 1 ? ' intento.' : ' intentos.');
        celebrar({
          titulo: 'Palabra adivinada',
          mensaje: frases[n - 1] + ': ' + secreta + ' en ' + n + (n === 1 ? ' intento.' : ' intentos.'),
          detalle,
          botones: [{ texto: 'Nueva palabra', primario: true, alClick: () => nueva() }, { texto: 'Cerrar' }]
        });
        return;
      }
      // Perdió
      if (MODO === 'diario') global.Diario.registrarFallo(BASE, { secreta });
      celebrar({
        titulo: 'Se acabaron los intentos',
        mensaje: 'La palabra era ' + secreta + '.',
        detalle: MODO === 'diario' ? 'El desafío de hoy ya quedó cerrado. Mañana hay una palabra nueva.' : undefined,
        confeti: false,
        botones: MODO === 'diario'
          ? [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
          : [{ texto: MODO === 'practica' ? 'Reiniciar' : 'Nueva palabra', primario: true, alClick: () => nueva() }, { texto: 'Cerrar' }]
      });
    }

    /* --- Entrada --- */
    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const o = ev.target;
      if (o && (o.tagName === 'INPUT' || o.tagName === 'SELECT' || o.tagName === 'TEXTAREA')) return;
      if (ev.key === 'Enter') {
        // Si hay un botón enfocado, que Enter lo active a él
        if (o && o.tagName === 'BUTTON') return;
        ev.preventDefault();
        entrar('ENTER');
        return;
      }
      if (ev.key === 'Backspace') { ev.preventDefault(); entrar('BORRAR'); return; }
      if (ev.key.length === 1) {
        const ch = ev.key.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const esEnie = ev.key === 'ñ' || ev.key === 'Ñ';
        const letra = esEnie ? 'Ñ' : ch;
        if (/^[A-ZÑ]$/.test(letra)) { ev.preventDefault(); entrar(letra); }
      }
    }
    document.addEventListener('keydown', alTecla);

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    if (validoGuardado(guardado)) {
      secreta = guardado.secreta;
      intentos = guardado.intentos === '' ? [] : guardado.intentos.split(',');
      pintarTodo();
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      nueva();
    }

    return {
      pruebas: { entrar, secreta: () => secreta, estado: () => ({ fase, intentos: intentos.slice(), actual }) },
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
    id: BASE,
    iniciar(contenedor) { MODO = 'libre'; ID = BASE; instancia = crear(contenedor); },
    iniciarDiario(contenedor, practica) {
      const res = global.Diario.cerradoHoy(BASE);
      if (res && !practica) {
        const texto = res.completado
          ? 'Tu resultado: ' + res.valor + (res.valor === 1 ? ' intento' : ' intentos')
          : 'Hoy no la pudiste adivinar. La palabra era ' + res.secreta + '.';
        instancia = global.Diario.panelCompletado(contenedor, {
          base: BASE, texto, titulo: res.completado ? undefined : 'El desafío de hoy ya está cerrado'
        });
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
