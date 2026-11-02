/* conexiones.js · Etapa 9: Conexiones
   - Hay 16 palabras que forman 4 grupos de 4 con algo en común. Elegí 4 y probalas.
   - Los grupos tienen cuatro colores según la dificultad: amarillo (el más fácil), verde, azul y violeta (el más rebuscado, suele ser un juego de palabras).
   - Hay pistas falsas: palabras que parecen de un grupo pero son de otro. Cada tablero tiene una única solución.
   - Si te equivocás 4 veces, perdés. Si estás a una palabra de un grupo, te avisamos.
   - Las categorías incluyen temas para adultos (no es un juego apto para toda la familia).
   - Se mide en intentos: el mejor resultado posible son 4 intentos (cuatro grupos sin errores).
   - Partida libre, desafío del día (el mismo tablero para todos) y práctica.
   - Las categorías están en palabras-conexiones.js. */
(function (global) {
  'use strict';

  const BASE = 'conexiones';
  let ID = BASE;            // 'conexiones', 'conexiones-diario' o 'conexiones-practica'
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  const { el, notificar, celebrar } = global.Pasatiempos;

  const MAX_ERRORES = 4;
  const NOMBRES_NIVEL = { 1: 'Amarillo', 2: 'Verde', 3: 'Azul', 4: 'Violeta' };

  const { categorias, reglas, sin } = global.PalabrasConexiones;
  const clave = (w) => sin(w).replace(/[^a-zñ0-9]/g, '');

  function mezclar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function perteneceA(cat, palabra) {
    const k = clave(palabra);
    if (cat.palabras.some((p) => clave(p) === k)) return true;
    if (!cat.regla) return false;
    const f = typeof cat.regla === 'function' ? cat.regla : reglas[cat.regla];
    return !!(f && f(palabra));
  }

  /* Cuenta de cuántas formas se pueden partir las 16 palabras en 4 grupos de 4, cada uno dentro de una categoría distinta.
     Si da 1, el tablero tiene una única solución (aunque algunas palabras "parezcan" de otro grupo). Corta al llegar a 2. */
  function contarSoluciones(palabras, cats) {
    const miembros = cats.map((c) => palabras.map((w, i) => (perteneceA(c, w) ? i : -1)).filter((i) => i >= 0));
    let cuenta = 0;
    function subconjuntos(lista, k, desde, acc, fn) {
      if (acc.length === k) { fn(acc.slice()); return; }
      for (let i = desde; i < lista.length && cuenta < 2; i++) {
        acc.push(lista[i]);
        subconjuntos(lista, k, i + 1, acc, fn);
        acc.pop();
      }
    }
    function rec(ci, usadas) {
      if (cuenta >= 2) return;
      if (ci === cats.length) { cuenta++; return; }
      const libres = miembros[ci].filter((i) => !usadas.has(i));
      if (libres.length < 4) return;
      subconjuntos(libres, 4, 0, [], (grupo) => {
        const u2 = new Set(usadas);
        grupo.forEach((i) => u2.add(i));
        rec(ci + 1, u2);
      });
    }
    rec(0, new Set());
    return cuenta;
  }

  /* Arma un tablero: una categoría para cada color, 4 palabras de cada una.
     Se buscan "pistas falsas" (palabras que parecen encajar en otro grupo), siempre que el tablero siga teniendo una única solución.
     Usa Math.random (en el desafío del día está fijado por la semilla). */
  function armarTablero() {
    const porNivel = { 1: [], 2: [], 3: [], 4: [] };
    categorias.forEach((c) => porNivel[c.nivel].push(c));
    const elegir = (niveles) => {
      const lista = porNivel[niveles[Math.floor(Math.random() * niveles.length)]];
      return lista[Math.floor(Math.random() * lista.length)];
    };
    let respaldo = null;
    for (let intento = 0; intento < 500; intento++) {
      const cats = [elegir([1, 1, 2]), elegir([2, 2, 3]), elegir([3]), elegir([4])];
      if (new Set(cats.map((c) => c.nombre)).size < 4) continue;
      // Palabras que también encajan en otro de los grupos del tablero (candidatas a pista falsa)
      const grupos = cats.map((c, i) => {
        const compartidas = c.palabras.filter((w) => cats.some((o, j) => j !== i && perteneceA(o, w)));
        const otras = c.palabras.filter((w) => !compartidas.includes(w));
        mezclar(compartidas);
        mezclar(otras);
        const cuantasPistas = Math.min(compartidas.length, Math.random() < 0.5 ? 1 : 2);
        const w = compartidas.slice(0, cuantasPistas).concat(otras).slice(0, 4);
        if (w.length < 4) w.push(...compartidas.slice(cuantasPistas).slice(0, 4 - w.length));
        return { n: i + 1, c: c.nombre, w: mezclar(w.slice(0, 4)), pistas: cuantasPistas > 0 && compartidas.length > 0 ? cuantasPistas : 0 };
      });
      if (grupos.some((g) => g.w.length < 4)) continue;
      const todas = [].concat(...grupos.map((g) => g.w));
      const vistas = new Set(todas.map(clave));
      if (vistas.size < 16) continue;
      if (contarSoluciones(todas, cats) !== 1) continue;
      const hayPistas = grupos.some((g) => g.w.some((w) => cats.some((o, j) => j !== g.n - 1 && perteneceA(o, w))));
      const tab = grupos.map((g) => ({ n: g.n, c: g.c, w: g.w }));
      if (hayPistas) return tab;
      if (!respaldo) respaldo = tab;
    }
    return respaldo;
  }

  function tableroDelDia() {
    return global.Diario.conSemilla(global.Diario.semilla(BASE), armarTablero);
  }

  function crear(contenedor) {
    let grupos = [];          // [{n, c, w:[4]}]
    let sueltas = [];         // palabras que siguen en el tablero (en orden)
    let resueltos = [];       // niveles resueltos, en el orden en que se resolvieron
    let seleccion = [];
    let errores = 0;
    let probados = [];        // combinaciones ya probadas (claves)
    let fase = 'jugando';     // 'jugando' | 'ganado' | 'perdido'
    let destruido = false;
    let bloqueado = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const esDiario = MODO !== 'libre';
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: MODO === 'practica' ? 'Reiniciar' : 'Nuevo tablero', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', pedirNueva);
    const btnMezclar = el('button', { clase: 'btn', texto: 'Mezclar', attrs: { type: 'button' } });
    const btnSoltar = el('button', { clase: 'btn', texto: 'Deseleccionar', attrs: { type: 'button' } });
    const btnEnviar = el('button', { clase: 'btn btn--primario', texto: 'Enviar', attrs: { type: 'button' } });
    btnMezclar.addEventListener('click', () => { if (bloqueado || fase !== 'jugando') return; mezclar(sueltas); pintar(); });
    btnSoltar.addEventListener('click', () => { seleccion = []; pintar(); });
    btnEnviar.addEventListener('click', enviar);

    const valErr = el('span', { clase: 'dato__valor', attrs: { 'aria-label': 'Errores' } });
    const filasRes = el('div', { clase: 'cx__resueltos' });
    const tablero = el('div', { clase: 'cx__tablero' });
    const aviso = el('p', { clase: 'cx__aviso', attrs: { 'aria-live': 'polite' } });

    const raiz = el('div', { clase: 'jg cx' },
      esDiario ? global.Diario.cartel(MODO) : null,
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Errores' }), valErr)),
        MODO === 'diario' ? null : btnNuevo),
      filasRes,
      tablero,
      aviso,
      el('div', { clase: 'jg__acciones' }, btnMezclar, btnSoltar, btnEnviar),
      el('p', { clase: 'jg__ayuda', texto: 'Encontrá cuatro grupos de cuatro palabras que tengan algo en común. Elegí cuatro palabras y tocá Enviar. Tenés 4 errores como máximo. Los colores indican la dificultad: amarillo es el más fácil y violeta el más rebuscado.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function grupoDe(n) { return grupos.find((g) => g.n === n); }

    function filaGrupo(g, extra) {
      return el('div', { clase: 'cx__grupo cx__n' + g.n + (extra ? ' ' + extra : '') },
        el('strong', { clase: 'cx__grupo-nombre', texto: g.c }),
        el('span', { clase: 'cx__grupo-palabras', texto: g.w.join(', ') }));
    }

    function pintar() {
      filasRes.replaceChildren();
      resueltos.forEach((n) => filasRes.append(filaGrupo(grupoDe(n))));
      if (fase === 'perdido') {
        grupos.filter((g) => !resueltos.includes(g.n)).sort((a, b) => a.n - b.n).forEach((g) => filasRes.append(filaGrupo(g, 'revelado')));
      }
      tablero.replaceChildren();
      if (fase === 'jugando') {
        sueltas.forEach((w) => {
          const sel = seleccion.includes(w);
          const b = el('button', { clase: 'cx__palabra' + (sel ? ' sel' : ''), texto: w, attrs: { type: 'button', 'aria-pressed': String(sel) } });
          b.addEventListener('click', () => alternar(w));
          tablero.append(b);
        });
      }
      const quedan = MAX_ERRORES - errores;
      valErr.textContent = '';
      for (let i = 0; i < MAX_ERRORES; i++) valErr.append(el('span', { clase: 'cx__punto' + (i < quedan ? ' vivo' : ''), attrs: { 'aria-hidden': 'true' } }));
      valErr.setAttribute('aria-label', 'Errores restantes: ' + quedan);
      btnEnviar.disabled = fase !== 'jugando' || seleccion.length !== 4;
      btnSoltar.disabled = fase !== 'jugando' || !seleccion.length;
      btnMezclar.disabled = fase !== 'jugando';
    }

    function mensaje(t, clase) {
      aviso.textContent = t;
      aviso.className = 'cx__aviso' + (clase ? ' ' + clase : '');
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando' || (!errores && !resueltos.length && !probados.length)) return null;
      return {
        grupos: grupos.map((g) => ({ n: g.n, c: g.c, w: g.w })),
        sueltas, resueltos, errores, probados,
        fecha: MODO === 'libre' ? undefined : global.Diario.hoy()
      };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }

    function validoGuardado(s) {
      if (!s || !Array.isArray(s.grupos) || s.grupos.length !== 4) return false;
      const todas = [];
      for (const g of s.grupos) {
        if (!g || ![1, 2, 3, 4].includes(g.n) || typeof g.c !== 'string' || !Array.isArray(g.w) || g.w.length !== 4 || !g.w.every((x) => typeof x === 'string')) return false;
        todas.push(...g.w);
      }
      if (new Set(s.grupos.map((g) => g.n)).size !== 4) return false;
      if (!Array.isArray(s.resueltos) || !s.resueltos.every((n) => [1, 2, 3, 4].includes(n))) return false;
      if (!Number.isInteger(s.errores) || s.errores < 0 || s.errores >= MAX_ERRORES) return false;
      if (!Array.isArray(s.sueltas) || !Array.isArray(s.probados)) return false;
      const esperadas = todas.filter((w) => !s.resueltos.some((n) => s.grupos.find((g) => g.n === n).w.includes(w)));
      if (s.sueltas.length !== esperadas.length || !s.sueltas.every((w) => esperadas.includes(w))) return false;
      if (s.resueltos.length >= 4) return false;
      return true;
    }

    /* --- Partidas --- */
    function usarTablero(g) {
      grupos = g;
      sueltas = mezclar([].concat(...g.map((x) => x.w)));
      resueltos = [];
      seleccion = [];
      errores = 0;
      probados = [];
      fase = 'jugando';
      bloqueado = false;
    }

    function nueva() {
      const g = MODO === 'libre' ? armarTablero() : tableroDelDia();
      usarTablero(g);
      Guardado.borrar(ID);
      mensaje('');
      pintar();
    }

    function pedirNueva() {
      if (fase === 'jugando' && (errores || resueltos.length) && !global.confirm('Si empezás de nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva();
    }

    /* --- Jugada --- */
    function alternar(w) {
      if (bloqueado || fase !== 'jugando') return;
      const i = seleccion.indexOf(w);
      if (i >= 0) seleccion.splice(i, 1);
      else if (seleccion.length < 4) seleccion.push(w);
      mensaje('');
      pintar();
    }

    function enviar() {
      if (bloqueado || fase !== 'jugando' || seleccion.length !== 4) return;
      const k = seleccion.map(clave).sort().join('|');
      if (probados.includes(k)) { mensaje('Ya probaste esa combinación.', 'mal'); return; }
      const cuenta = {};
      seleccion.forEach((w) => {
        const g = grupos.find((x) => x.w.includes(w));
        cuenta[g.n] = (cuenta[g.n] || 0) + 1;
      });
      const nivel = Number(Object.keys(cuenta).find((n) => cuenta[n] === 4));
      if (nivel) {
        const g = grupoDe(nivel);
        resueltos.push(nivel);
        sueltas = sueltas.filter((w) => !g.w.includes(w));
        seleccion = [];
        mensaje('');
        pintar();
        if (resueltos.length === 4) { fase = 'ganado'; pintar(); despues(() => terminar(true), 500); }
        else guardarYa();
        return;
      }
      probados.push(k);
      errores++;
      const casi = Object.keys(cuenta).some((n) => cuenta[n] === 3);
      mensaje(casi ? 'Casi: te falta una palabra en un grupo.' : 'Esas no van juntas.', 'mal');
      tablero.classList.remove('sacude');
      void tablero.offsetWidth;
      tablero.classList.add('sacude');
      despues(() => tablero.classList.remove('sacude'), 450);
      seleccion = [];
      if (errores >= MAX_ERRORES) {
        fase = 'perdido';
        pintar();
        despues(() => terminar(false), 600);
      } else {
        pintar();
        guardarYa();
      }
    }

    function terminar(gano) {
      Guardado.borrar(ID);
      if (gano) {
        const intentos = 4 + errores;
        const txt = errores === 0 ? 'Sin errores' : errores + (errores === 1 ? ' error' : ' errores');
        if (MODO === 'diario') {
          const rd = global.Diario.registrar(BASE, intentos);
          celebrar({
            titulo: 'Desafío del día resuelto',
            mensaje: 'Encontraste los cuatro grupos. ' + txt + ' (' + intentos + ' intentos).',
            detalle: rd.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + rd.racha + (rd.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.',
            botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
          });
          return;
        }
        if (MODO === 'practica') {
          celebrar({ titulo: 'Grupos encontrados', mensaje: txt + '. Práctica: no suma al ranking.', botones: [{ texto: 'Cerrar', primario: true }] });
          return;
        }
        const r = Records.agregar(ID, 'general', intentos, { modo: 'menor' });
        let detalle;
        if (r.esRecord) detalle = 'Nueva mejor marca: ' + intentos + ' intentos.';
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca es ' + Records.mejor(ID, 'general') + ' intentos.';
        celebrar({
          titulo: 'Grupos encontrados',
          mensaje: 'Encontraste los cuatro grupos. ' + txt + ' (' + intentos + ' intentos).',
          detalle,
          botones: [{ texto: 'Nuevo tablero', primario: true, alClick: () => nueva() }, { texto: 'Cerrar' }]
        });
        return;
      }
      if (MODO === 'diario') global.Diario.registrarFallo(BASE, {});
      celebrar({
        titulo: 'Se acabaron los intentos',
        mensaje: 'Te quedaste sin errores disponibles. Abajo ves los grupos que faltaban.',
        detalle: MODO === 'diario' ? 'El desafío de hoy ya quedó cerrado. Mañana hay un tablero nuevo.' : undefined,
        confeti: false,
        botones: MODO === 'diario'
          ? [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
          : [{ texto: MODO === 'practica' ? 'Reiniciar' : 'Nuevo tablero', primario: true, alClick: () => nueva() }, { texto: 'Cerrar' }]
      });
    }

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    const delDia = MODO === 'libre' || (guardado && guardado.fecha === global.Diario.hoy());
    if (validoGuardado(guardado) && delDia) {
      grupos = guardado.grupos;
      sueltas = guardado.sueltas.slice();
      resueltos = guardado.resueltos.slice();
      errores = guardado.errores;
      probados = guardado.probados.slice();
      seleccion = [];
      fase = 'jugando';
      pintar();
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      nueva();
    }

    return {
      pruebas: {
        estado: () => ({ grupos, sueltas: sueltas.slice(), resueltos: resueltos.slice(), errores, fase }),
        alternar, enviar
      },
      destruir() {
        destruido = true;
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
          ? 'Tu resultado: ' + res.valor + ' intentos (' + (res.valor - 4) + (res.valor - 4 === 1 ? ' error' : ' errores') + ')'
          : 'Hoy no pudiste encontrar todos los grupos.';
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
