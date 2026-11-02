/* diario.js · Desafío del día
   Un tablero muy difícil por juego y por día, igual para todas las personas.

   Cómo funciona:
   - La fecha es la de Argentina (no la del dispositivo), así todas juegan el mismo tablero aunque
     estén en otro huso horario.
   - Con el juego y la fecha se arma una "semilla" y un generador de números al azar que, con la misma
     semilla, siempre da la misma secuencia. Los generadores de tableros usan Math.random, así que durante
     la generación se lo reemplaza por el generador con semilla (conSemilla) y después se restaura.
   - Se guarda en el navegador: si ya lo resolviste hoy, el resultado, el historial y la racha de días.

   Expone: Diario */
(function (global) {
  'use strict';

  const ZONA = 'America/Argentina/Buenos_Aires';
  const VERSION_TABLEROS = 'v1'; // si cambian los generadores, subir este valor para que los tableros cambien
  const MAX_HISTORIAL = 90;

  let formateador = null;
  try { formateador = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' }); } catch (e) { formateador = null; }

  function hoy() {
    if (formateador) {
      const partes = formateador.formatToParts(new Date());
      const g = (t) => partes.find((p) => p.type === t).value;
      return g('year') + '-' + g('month') + '-' + g('day');
    }
    // Sin soporte de zona horaria: Argentina es UTC-3 todo el año
    const d = new Date(Date.now() - 3 * 3600 * 1000);
    return d.toISOString().slice(0, 10);
  }

  function fechaLarga(fecha) {
    const [a, m, d] = fecha.split('-').map(Number);
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dia = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
    return dias[dia] + ' ' + d + ' de ' + meses[m - 1];
  }

  /* --- Semilla y generador --- */
  function hash(texto) {
    // xmur3: de un texto a un número de 32 bits
    let h = 1779033703 ^ texto.length;
    for (let i = 0; i < texto.length; i++) {
      h = Math.imul(h ^ texto.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
  }

  function semilla(juego, fecha) {
    return hash('pasatiempos|' + VERSION_TABLEROS + '|' + juego + '|' + (fecha || hoy()));
  }

  /* mulberry32: generador chico y bueno. Devuelve una función como Math.random, con .n = cuántas veces se usó */
  function crearAzar(sem, saltear) {
    let a = sem >>> 0;
    const f = function () {
      f.n++;
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.n = 0;
    for (let i = 0; i < (saltear || 0); i++) f();
    return f;
  }

  let generando = 0;
  const randomOriginal = Math.random;

  /* Ejecuta fn() (sincrónica) con Math.random determinista. Siempre restaura el original. */
  function conSemilla(sem, fn) {
    const azar = crearAzar(sem);
    generando++;
    Math.random = azar;
    try { return fn(azar); } finally {
      generando--;
      if (generando === 0) Math.random = randomOriginal;
    }
  }

  /* --- Estado guardado --- */
  const claveEstado = (juego, fecha) => 'diario:' + juego + ':' + fecha;

  function leer(juego, fecha) {
    return Almacen.leer(claveEstado(juego, fecha || hoy()), null);
  }

  function resultadoDeHoy(juego) {
    const e = leer(juego);
    return e && e.completado ? e : null;
  }

  /* El día quedó cerrado: o lo resolviste, o lo perdiste (en juegos donde perder revela el tablero) */
  function cerradoHoy(juego) {
    const e = leer(juego);
    return e && (e.completado || e.fallado) ? e : null;
  }

  function registrarFallo(juego, extra) {
    const fecha = hoy();
    const previo = leer(juego, fecha);
    if (previo && (previo.completado || previo.fallado)) return previo;
    const r = Object.assign({ completado: false, fallado: true, fecha, ts: Date.now() }, extra || {});
    Almacen.escribir(claveEstado(juego, fecha), r);
    return r;
  }

  function racha() {
    const r = Almacen.leer('diario:racha', null);
    if (!r || !r.ultima) return { n: 0, ultima: null, activa: false };
    const h = hoy();
    const ayer = restarDia(h);
    const activa = r.ultima === h || r.ultima === ayer;
    return { n: activa ? r.n : 0, ultima: r.ultima, activa, hoyHecho: r.ultima === h };
  }

  function restarDia(fecha) {
    const [a, m, d] = fecha.split('-').map(Number);
    return new Date(Date.UTC(a, m - 1, d - 1)).toISOString().slice(0, 10);
  }

  function actualizarRacha() {
    const h = hoy();
    const r = Almacen.leer('diario:racha', null) || { n: 0, ultima: null };
    if (r.ultima === h) return r.n;
    r.n = r.ultima === restarDia(h) ? r.n + 1 : 1;
    r.ultima = h;
    Almacen.escribir('diario:racha', r);
    return r.n;
  }

  const oyentes = [];
  function alTerminar(fn) { oyentes.push(fn); }

  /* Registra la resolución del desafío de hoy. Solo cuenta la primera vez de cada día.
     valor: milisegundos (juegos de tiempo) o puntos (2048, ahorcado). */
  function registrar(juego, valor, extra) {
    const fecha = hoy();
    const previo = leer(juego, fecha);
    if (previo && previo.completado) return { primera: false, resultado: previo };
    const resultado = Object.assign({ completado: true, valor, fecha, ts: Date.now() }, extra || {});
    Almacen.escribir(claveEstado(juego, fecha), resultado);
    const hist = Almacen.leer('diario:hist:' + juego, {});
    hist[fecha] = valor;
    const claves = Object.keys(hist).sort();
    while (claves.length > MAX_HISTORIAL) delete hist[claves.shift()];
    Almacen.escribir('diario:hist:' + juego, hist);
    const n = actualizarRacha();
    oyentes.forEach((fn) => { try { fn({ juego, fecha, valor, extra }); } catch (e) { /* un oyente roto no frena a los demás */ } });
    return { primera: true, resultado, racha: n };
  }

  function cuantosHoy(ids) {
    return ids.filter((id) => resultadoDeHoy(id)).length;
  }

  /* --- Piezas de interfaz compartidas por los juegos (solo texto propio, nada de HTML de afuera) --- */
  function nodo(etiqueta, clase, texto) {
    const n = document.createElement(etiqueta);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }

  /* Cartel que va arriba del juego cuando se juega el desafío (o su práctica) */
  function cartel(modo) {
    const c = nodo('div', 'dia-cartel' + (modo === 'practica' ? ' practica' : ''));
    c.setAttribute('role', 'note');
    if (modo === 'practica') {
      c.append(nodo('strong', '', 'Práctica. '), document.createTextNode('Es el mismo tablero de hoy, pero esta partida no suma al ranking ni a la racha.'));
    } else {
      c.append(nodo('strong', '', 'Desafío del ' + fechaLarga(hoy()) + '. '),
        document.createTextNode('Un solo tablero, el mismo para todas, y bien difícil. Solo cuenta la primera vez que lo resolvés hoy.'));
    }
    return c;
  }

  /* Pantalla que reemplaza al juego cuando ya resolviste el desafío de hoy */
  function panelCompletado(contenedor, { base, texto, titulo }) {
    const caja = nodo('div', 'dia-hecho panel');
    caja.append(
      nodo('h2', '', titulo || 'Ya resolviste el desafío de hoy'),
      nodo('p', 'dia-hecho__valor', texto),
      nodo('p', '', 'Mañana hay un tablero nuevo. Mientras tanto podés practicar con el de hoy, sin que cuente para el ranking.'));
    const fila = nodo('div', 'jg__acciones');
    const practicar = nodo('a', 'btn btn--primario', 'Practicar este tablero');
    practicar.href = '#/' + base + '/practica';
    const libre = nodo('a', 'btn', 'Partida libre');
    libre.href = '#/' + base;
    fila.append(practicar, libre);
    if (global.Nube && global.Nube.activa && global.NubeUI) {
      const rank = nodo('button', 'btn', 'Ver ranking de hoy');
      rank.type = 'button';
      rank.addEventListener('click', () => global.NubeUI.abrirRanking(base));
      fila.append(rank);
    }
    caja.append(fila);
    contenedor.append(caja);
    return { destruir() {} };
  }

  global.Diario = {
    ZONA,
    hoy,
    fechaLarga,
    semilla,
    hash,
    crearAzar,
    conSemilla,
    get generando() { return generando > 0; },
    leer,
    resultadoDeHoy,
    cerradoHoy,
    registrarFallo,
    registrar,
    racha,
    cuantosHoy,
    alTerminar,
    cartel,
    panelCompletado
  };
})(window);
