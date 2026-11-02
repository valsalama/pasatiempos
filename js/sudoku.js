/* sudoku.js · Etapa 2: Sudoku
   - Generador por backtracking con solución única garantizada.
   - 4 niveles: fácil (se resuelve solo con "únicos desnudos"), medio (también "únicos ocultos"),
     difícil y experto (menos pistas y no se resuelven solo con únicos).
   - Notas a lápiz, pista, revisar, borrar errores, pausa, guardado automático y mejores marcas.
   - Las marcas solo cuentan si no usaste pistas. */
(function (global) {
  'use strict';

  const BASE = 'sudoku';
  let ID = BASE;            // 'sudoku', 'sudoku-diario' o 'sudoku-practica' (guardados separados)
  let MODO = 'libre';       // 'libre' | 'diario' | 'practica'
  const { el, notificar, celebrar } = global.Pasatiempos;

  const NIVELES = [
    { id: 'facil', nombre: 'Fácil', pistas: 38, logica: 'desnudos' },
    { id: 'medio', nombre: 'Medio', pistas: 32, logica: 'singles' },
    { id: 'dificil', nombre: 'Difícil', pistas: 28, logica: 'duro' },
    { id: 'experto', nombre: 'Experto', pistas: 23, logica: 'duro' }
  ];
  const NIVEL = {};
  NIVELES.forEach((n) => { NIVEL[n.id] = n; });
  // Solo para el desafío del día: no aparece en los botones de dificultad
  NIVEL.diario = { id: 'diario', nombre: 'Desafío del día', pistas: 22, logica: 'duro' };

  /* ======================================================
     MOTOR (generación y resolución)
     ====================================================== */
  const FILA = [], COL = [], CAJA = [];
  for (let i = 0; i < 81; i++) {
    FILA[i] = Math.floor(i / 9);
    COL[i] = i % 9;
    CAJA[i] = Math.floor(FILA[i] / 3) * 3 + Math.floor(COL[i] / 3);
  }

  const POP = new Uint8Array(1024);
  for (let m = 1; m < 1024; m++) POP[m] = POP[m >> 1] + (m & 1);
  const TODOS = 0x3FE; // dígitos 1 a 9 como bits 1 a 9

  const UNIDADES = []; // 9 filas, 9 columnas y 9 cajas
  for (let k = 0; k < 9; k++) {
    const f = [], c = [], b = [];
    for (let i = 0; i < 81; i++) {
      if (FILA[i] === k) f.push(i);
      if (COL[i] === k) c.push(i);
      if (CAJA[i] === k) b.push(i);
    }
    UNIDADES.push(f, c, b);
  }

  const PARES = []; // celdas que comparten fila, columna o caja con cada celda
  for (let i = 0; i < 81; i++) {
    const lista = [];
    for (let j = 0; j < 81; j++) {
      if (j !== i && (FILA[j] === FILA[i] || COL[j] === COL[i] || CAJA[j] === CAJA[i])) lista.push(j);
    }
    PARES.push(lista);
  }

  function barajar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function crearMascaras(g) {
    const m = { f: new Array(9).fill(0), c: new Array(9).fill(0), b: new Array(9).fill(0) };
    for (let i = 0; i < 81; i++) {
      const v = g[i];
      if (v) {
        const bit = 1 << v;
        m.f[FILA[i]] |= bit; m.c[COL[i]] |= bit; m.b[CAJA[i]] |= bit;
      }
    }
    return m;
  }

  const candidatos = (m, i) => ~(m.f[FILA[i]] | m.c[COL[i]] | m.b[CAJA[i]]) & TODOS;

  /* Cuenta soluciones (se corta al llegar a `limite`). Elige siempre la celda con menos candidatos. */
  function contarSoluciones(grid, limite) {
    const g = grid.slice();
    const m = crearMascaras(g);
    let cuenta = 0;

    function buscar() {
      let mejor = -1, mejorMask = 0, mejorN = 10;
      for (let i = 0; i < 81; i++) {
        if (g[i]) continue;
        const mask = candidatos(m, i);
        const n = POP[mask];
        if (n === 0) return;
        if (n < mejorN) {
          mejorN = n; mejor = i; mejorMask = mask;
          if (n === 1) break;
        }
      }
      if (mejor === -1) { cuenta++; return; }

      for (let d = 1; d <= 9 && cuenta < limite; d++) {
        const bit = 1 << d;
        if (!(mejorMask & bit)) continue;
        g[mejor] = d;
        m.f[FILA[mejor]] |= bit; m.c[COL[mejor]] |= bit; m.b[CAJA[mejor]] |= bit;
        buscar();
        g[mejor] = 0;
        m.f[FILA[mejor]] &= ~bit; m.c[COL[mejor]] &= ~bit; m.b[CAJA[mejor]] &= ~bit;
      }
    }

    buscar();
    return cuenta;
  }

  /* Tablero completo al azar, por backtracking con dígitos barajados */
  function generarSolucion() {
    const g = new Array(81).fill(0);
    const m = crearMascaras(g);

    function rec() {
      let mejor = -1, mejorMask = 0, mejorN = 10;
      for (let i = 0; i < 81; i++) {
        if (g[i]) continue;
        const mask = candidatos(m, i);
        const n = POP[mask];
        if (n === 0) return false;
        if (n < mejorN) {
          mejorN = n; mejor = i; mejorMask = mask;
          if (n === 1) break;
        }
      }
      if (mejor === -1) return true;

      const digitos = [];
      for (let d = 1; d <= 9; d++) if (mejorMask & (1 << d)) digitos.push(d);
      barajar(digitos);
      for (const d of digitos) {
        const bit = 1 << d;
        g[mejor] = d;
        m.f[FILA[mejor]] |= bit; m.c[COL[mejor]] |= bit; m.b[CAJA[mejor]] |= bit;
        if (rec()) return true;
        g[mejor] = 0;
        m.f[FILA[mejor]] &= ~bit; m.c[COL[mejor]] &= ~bit; m.b[CAJA[mejor]] &= ~bit;
      }
      return false;
    }

    rec();
    return g;
  }

  /* ¿Se resuelve solo con únicos desnudos (y ocultos, si `usarOcultos`)? */
  function resuelveConSingles(grid, usarOcultos) {
    const g = grid.slice();
    const m = crearMascaras(g);
    let vacias = 0;
    for (let i = 0; i < 81; i++) if (!g[i]) vacias++;

    function poner(i, d) {
      const bit = 1 << d;
      g[i] = d;
      m.f[FILA[i]] |= bit; m.c[COL[i]] |= bit; m.b[CAJA[i]] |= bit;
      vacias--;
    }

    let avance = true;
    while (vacias > 0 && avance) {
      avance = false;
      for (let i = 0; i < 81; i++) {
        if (g[i]) continue;
        const mask = candidatos(m, i);
        if (mask === 0) return false;
        if (POP[mask] === 1) { poner(i, 31 - Math.clz32(mask)); avance = true; }
      }
      if (!avance && usarOcultos) {
        for (const unidad of UNIDADES) {
          for (let d = 1; d <= 9; d++) {
            const bit = 1 << d;
            let cuenta = 0, donde = -1;
            for (const i of unidad) {
              if (!g[i] && (candidatos(m, i) & bit)) {
                cuenta++; donde = i;
                if (cuenta > 1) break;
              }
            }
            if (cuenta === 1) { poner(donde, d); avance = true; }
          }
        }
      }
    }
    return vacias === 0;
  }

  /* Saca pistas una por una, solo si el tablero sigue teniendo solución única
     (y la dificultad pedida). Devuelve { solucion, puzzle, pistas }. */
  function generarPuzzle(nivelId) {
    const cfg = NIVEL[nivelId];
    const inicio = Date.now();
    let mejor = null;
    let ultimo = null;

    for (let intento = 0; intento < 12; intento++) {
      const solucion = generarSolucion();
      const puzzle = solucion.slice();
      let pistas = 81;

      for (const pos of barajar(Array.from({ length: 81 }, (_, i) => i))) {
        if (pistas <= cfg.pistas) break;
        const v = puzzle[pos];
        puzzle[pos] = 0;
        let valido = contarSoluciones(puzzle, 2) === 1;
        if (valido && cfg.logica === 'desnudos') valido = resuelveConSingles(puzzle, false);
        else if (valido && cfg.logica === 'singles') valido = resuelveConSingles(puzzle, true);
        if (valido) pistas--;
        else puzzle[pos] = v;
      }

      ultimo = { solucion, puzzle, pistas };
      if (cfg.logica === 'duro' && resuelveConSingles(puzzle, true)) {
        // Salió demasiado fácil para este nivel: probar con otro tablero
        if (!mejor) mejor = ultimo;
        // En el desafío del día no se corta por tiempo: así sale el mismo tablero en cualquier dispositivo
        if (!(global.Diario && global.Diario.generando) && Date.now() - inicio > 1500) break;
        continue;
      }
      return ultimo;
    }
    return mejor || ultimo;
  }

  // Para pruebas desde la consola del navegador
  global.SudokuMotor = { generarPuzzle, generarSolucion, contarSoluciones, resuelveConSingles };

  /* ======================================================
     INTERFAZ
     ====================================================== */
  function valido(s) {
    const arr = (a, max) => Array.isArray(a) && a.length === 81 && a.every((n) => Number.isInteger(n) && n >= 0 && n <= max);
    return !!s && !!NIVEL[s.dificultad] && arr(s.solucion, 9) && arr(s.inicial, 9) && arr(s.valores, 9) &&
      arr(s.notas, 1023) && Number.isFinite(s.ms) && Number.isInteger(s.pistas);
  }

  function calcularChoques(valores) {
    const set = new Set();
    for (let i = 0; i < 81; i++) {
      const v = valores[i];
      if (!v) continue;
      for (const j of PARES[i]) {
        if (valores[j] === v) { set.add(i); break; }
      }
    }
    return set;
  }

  function crear(contenedor) {
    let estado = null;
    let seleccion = -1;
    let modoNotas = false;
    let pausado = false;
    let generando = false;
    let destruido = false;
    const marcasError = new Set();

    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const valPistas = el('span', { clase: 'dato__valor', texto: '0' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    /* --- Estructura --- */
    const botonesNivel = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Dificultad' } });
    NIVELES.forEach((n) => {
      const b = el('button', { texto: n.nombre, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(n.id));
      botonesNivel[n.id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(estado ? estado.dificultad : 'facil'));

    const btnPausa = el('button', { clase: 'btn btn--chico', texto: 'Pausa', attrs: { type: 'button' } });
    btnPausa.addEventListener('click', alternarPausa);

    const celdas = [];
    const tablero = el('div', { clase: 'sdk__tablero', attrs: { role: 'grid', 'aria-label': 'Tablero de sudoku' } });
    for (let i = 0; i < 81; i++) {
      const c = el('div', { clase: 'sdk__celda', attrs: { role: 'gridcell', 'data-i': String(i) } });
      celdas.push(c);
      tablero.append(c);
    }
    tablero.addEventListener('click', (ev) => {
      const c = ev.target.closest('.sdk__celda');
      if (!c || pausado || generando || !estado) return;
      seleccion = Number(c.dataset.i);
      pintar();
    });

    const veloTexto = el('div', { texto: '' });
    const veloBoton = el('button', { clase: 'btn btn--primario', texto: 'Seguir', attrs: { type: 'button' } });
    veloBoton.addEventListener('click', alternarPausa);
    const velo = el('div', { clase: 'jg__velo', attrs: { hidden: '' } }, veloTexto, veloBoton);
    const marco = el('div', { clase: 'sdk__marco' }, tablero, velo);

    const teclas = [];
    const badges = [];
    const pad = el('div', { clase: 'sdk__pad' });
    for (let d = 1; d <= 9; d++) {
      const badge = el('small', { texto: '9' });
      const t = el('button', { clase: 'sdk__tecla', attrs: { type: 'button', 'aria-label': 'Poner el ' + d } },
        el('span', { texto: String(d) }), badge);
      t.addEventListener('click', () => colocarNumero(d));
      teclas[d] = t;
      badges[d] = badge;
      pad.append(t);
    }

    const btnNotas = el('button', { clase: 'btn btn--chico', texto: 'Lápiz', attrs: { type: 'button', 'aria-pressed': 'false' } });
    const btnBorrar = el('button', { clase: 'btn btn--chico', texto: 'Borrar', attrs: { type: 'button' } });
    const btnPista = el('button', { clase: 'btn btn--chico', texto: 'Pista', attrs: { type: 'button' } });
    const btnRevisar = el('button', { clase: 'btn btn--chico', texto: 'Revisar', attrs: { type: 'button' } });
    const btnErrores = el('button', { clase: 'btn btn--chico', texto: 'Borrar errores', attrs: { type: 'button' } });
    btnNotas.addEventListener('click', alternarNotas);
    btnBorrar.addEventListener('click', borrar);
    btnPista.addEventListener('click', pista);
    btnRevisar.addEventListener('click', revisar);
    btnErrores.addEventListener('click', borrarErrores);

    const esDiario = MODO !== 'libre';
    const raiz = el('div', { clase: 'jg sdk' },
      esDiario ? global.Diario.cartel(MODO) : null,
      esDiario ? null : el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Pistas' }), valPistas)),
        btnPausa),
      marco,
      pad,
      el('div', { clase: 'jg__acciones' }, btnNotas, btnBorrar, esDiario ? null : btnPista, btnRevisar, btnErrores),
      el('p', { clase: 'jg__ayuda', texto: 'Tocá una casilla y elegí un número. Con el teclado: números, flechas, Borrar, N para el lápiz y P para pausar.' })
    );
    contenedor.append(raiz);

    /* --- Pintar --- */
    function pintar() {
      if (!estado) return;
      const e = estado;
      const selValor = seleccion >= 0 ? e.valores[seleccion] : 0;
      const choques = calcularChoques(e.valores);
      const cuenta = new Array(10).fill(0);

      for (let i = 0; i < 81; i++) {
        const v = e.valores[i];
        if (v) cuenta[v]++;

        let clase = 'sdk__celda';
        if (e.inicial[i]) clase += ' dada';
        if (i === seleccion) {
          clase += ' sel';
        } else {
          if (seleccion >= 0 && (FILA[i] === FILA[seleccion] || COL[i] === COL[seleccion] || CAJA[i] === CAJA[seleccion])) clase += ' par';
          if (selValor && v === selValor) clase += ' igual';
        }
        if (choques.has(i)) clase += ' choque';
        if (marcasError.has(i)) clase += ' mal';

        const c = celdas[i];
        if (c.className !== clase) c.className = clase;

        const huella = v + ':' + e.notas[i];
        if (c._h !== huella) {
          c._h = huella;
          c.replaceChildren();
          if (v) {
            c.textContent = String(v);
          } else if (e.notas[i]) {
            const notas = el('div', { clase: 'sdk__notas' });
            for (let d = 1; d <= 9; d++) notas.append(el('span', { texto: e.notas[i] & (1 << d) ? String(d) : '' }));
            c.append(notas);
          }
          c.setAttribute('aria-label', 'Fila ' + (FILA[i] + 1) + ', columna ' + (COL[i] + 1) + ', ' + (v ? 'número ' + v : 'vacía'));
        }
      }

      for (let d = 1; d <= 9; d++) {
        const quedan = Math.max(0, 9 - cuenta[d]);
        badges[d].textContent = String(quedan);
        teclas[d].classList.toggle('completo', quedan === 0);
      }
      valPistas.textContent = String(e.pistas);
      NIVELES.forEach((n) => botonesNivel[n.id].setAttribute('aria-pressed', String(n.id === e.dificultad)));
      btnNotas.setAttribute('aria-pressed', String(modoNotas));
      btnPausa.textContent = pausado ? 'Seguir' : 'Pausa';
    }

    /* --- Guardado --- */
    function serializar() {
      if (!estado || estado.terminado) return null;
      return {
        dificultad: estado.dificultad,
        solucion: estado.solucion,
        inicial: estado.inicial,
        valores: estado.valores,
        notas: estado.notas,
        pistas: estado.pistas,
        ms: Math.round(crono.transcurrido),
        fecha: MODO === 'libre' ? undefined : global.Diario.hoy()
      };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    /* --- Velo (cargando y pausa) --- */
    function mostrarVelo(texto, conBoton) {
      veloTexto.textContent = texto;
      veloBoton.hidden = !conBoton;
      velo.hidden = false;
    }
    function ocultarVelo() { velo.hidden = true; }

    /* --- Partidas --- */
    function hayProgreso() {
      return !!estado && !estado.terminado && estado.valores.some((v, i) => v !== estado.inicial[i]);
    }

    function pedirNueva(nivelId) {
      if (generando) return;
      if (hayProgreso() && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(nivelId);
    }

    function nueva(nivelId) {
      generando = true;
      pausado = false;
      crono.reiniciar(0);
      mostrarVelo('Armando tu tablero…', false);
      setTimeout(() => {
        if (destruido) return;
        const p = MODO === 'libre'
          ? generarPuzzle(nivelId)
          : global.Diario.conSemilla(global.Diario.semilla(BASE), () => generarPuzzle('diario'));
        estado = {
          dificultad: nivelId,
          solucion: p.solucion,
          inicial: p.puzzle.slice(),
          valores: p.puzzle.slice(),
          notas: new Array(81).fill(0),
          pistas: 0,
          terminado: false
        };
        seleccion = -1;
        modoNotas = false;
        marcasError.clear();
        generando = false;
        if (MODO === 'libre') Almacen.escribir('sudoku:nivel', nivelId);
        ocultarVelo();
        crono.reiniciar(0);
        crono.iniciar();
        guardarYa();
        pintar();
      }, 40);
    }

    function cargar(s) {
      estado = {
        dificultad: s.dificultad,
        solucion: s.solucion.slice(),
        inicial: s.inicial.slice(),
        valores: s.valores.slice(),
        notas: s.notas.slice(),
        pistas: s.pistas,
        terminado: false
      };
      crono.reiniciar(s.ms);
      crono.iniciar();
      pintar();
    }

    function alternarPausa() {
      if (!estado || estado.terminado || generando) return;
      pausado = !pausado;
      if (pausado) {
        crono.pausar();
        mostrarVelo('En pausa', true);
      } else {
        ocultarVelo();
        crono.iniciar();
      }
      pintar();
    }

    function alternarNotas() {
      modoNotas = !modoNotas;
      pintar();
    }

    /* --- Jugadas --- */
    function activa() {
      return !!estado && !estado.terminado && !pausado && !generando;
    }

    function cambio() {
      pintar();
      guardarYa();
      comprobarFin();
    }

    function colocarNumero(d) {
      if (!activa()) return;
      if (seleccion < 0) { notificar('Primero tocá una casilla.'); return; }
      const i = seleccion;
      const e = estado;
      if (e.inicial[i]) { notificar('Esa casilla viene con el tablero y no se puede cambiar.'); return; }

      if (modoNotas) {
        if (e.valores[i]) return;
        e.notas[i] ^= (1 << d);
      } else {
        if (e.valores[i] === d) {
          e.valores[i] = 0; // tocar el mismo número lo borra
        } else {
          e.valores[i] = d;
          e.notas[i] = 0;
          PARES[i].forEach((j) => { e.notas[j] &= ~(1 << d); });
        }
        marcasError.delete(i);
      }
      cambio();
    }

    function borrar() {
      if (!activa() || seleccion < 0) return;
      const i = seleccion;
      if (estado.inicial[i]) return;
      estado.valores[i] = 0;
      estado.notas[i] = 0;
      marcasError.delete(i);
      cambio();
    }

    function pista() {
      if (!activa()) return;
      const e = estado;
      let i = seleccion;
      if (i < 0 || e.valores[i] === e.solucion[i]) {
        const candidatas = [];
        for (let k = 0; k < 81; k++) if (e.valores[k] !== e.solucion[k]) candidatas.push(k);
        if (!candidatas.length) return;
        i = candidatas[Math.floor(Math.random() * candidatas.length)];
        seleccion = i;
      }
      const d = e.solucion[i];
      e.valores[i] = d;
      e.notas[i] = 0;
      PARES[i].forEach((j) => { e.notas[j] &= ~(1 << d); });
      e.pistas++;
      marcasError.delete(i);
      cambio();
    }

    function revisar() {
      if (!activa()) return;
      const e = estado;
      marcasError.clear();
      let malas = 0, vacias = 0;
      for (let i = 0; i < 81; i++) {
        if (e.inicial[i]) continue;
        if (!e.valores[i]) vacias++;
        else if (e.valores[i] !== e.solucion[i]) { marcasError.add(i); malas++; }
      }
      pintar();
      if (malas) notificar(malas === 1 ? 'Hay 1 casilla con error.' : 'Hay ' + malas + ' casillas con errores.');
      else if (vacias) notificar('Todo bien hasta ahora, seguí así.');
    }

    function borrarErrores() {
      if (!activa()) return;
      const e = estado;
      let n = 0;
      for (let i = 0; i < 81; i++) {
        if (!e.inicial[i] && e.valores[i] && e.valores[i] !== e.solucion[i]) { e.valores[i] = 0; n++; }
      }
      marcasError.clear();
      cambio();
      notificar(n ? (n === 1 ? 'Borré 1 casilla con error.' : 'Borré ' + n + ' casillas con errores.') : 'No hay errores para borrar.');
    }

    function comprobarFin() {
      const e = estado;
      for (let i = 0; i < 81; i++) if (!e.valores[i]) return;
      let bien = true;
      for (let i = 0; i < 81; i++) {
        if (e.valores[i] !== e.solucion[i]) { bien = false; marcasError.add(i); }
      }
      if (bien) {
        ganar();
      } else {
        pintar();
        notificar('Están todas las casillas, pero hay errores. Las marqué para que las corrijas.');
      }
    }

    function ganar() {
      const e = estado;
      e.terminado = true;
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      pintar();

      const nivel = NIVEL[e.dificultad];
      let detalle;
      if (MODO === 'diario') {
        const r = global.Diario.registrar(BASE, ms);
        detalle = r.primera ? 'Quedó registrado en tu desafío de hoy. Racha: ' + r.racha + (r.racha === 1 ? ' día.' : ' días.') : 'Hoy ya habías registrado un resultado.';
        celebrar({
          titulo: 'Desafío del día resuelto',
          mensaje: 'Sudoku del día en ' + Cronometro.formatear(ms) + '.',
          detalle,
          botones: [{ texto: 'Ver el menú', primario: true, alClick: () => { global.location.hash = '#/'; } }, { texto: 'Cerrar' }]
        });
        return;
      }
      if (MODO === 'practica') {
        celebrar({
          titulo: 'Lo resolviste',
          mensaje: 'Práctica en ' + Cronometro.formatear(ms) + '. No suma al ranking.',
          botones: [{ texto: 'Cerrar', primario: true }]
        });
        return;
      }
      if (e.pistas > 0) {
        detalle = 'Usaste ' + e.pistas + (e.pistas === 1 ? ' pista' : ' pistas') + ', así que esta partida no entra en las mejores marcas.';
      } else {
        const r = Records.agregar(ID, e.dificultad, ms, { modo: 'menor' });
        if (r.esRecord) detalle = 'Nueva mejor marca en nivel ' + nivel.nombre.toLowerCase();
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca en este nivel es ' + Cronometro.formatear(Records.mejor(ID, e.dificultad)) + '.';
      }

      celebrar({
        titulo: 'Lo resolviste',
        mensaje: 'Sudoku ' + nivel.nombre.toLowerCase() + ' en ' + Cronometro.formatear(ms) + '.',
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(e.dificultad) },
          { texto: 'Cerrar' }
        ]
      });
    }

    /* --- Teclado --- */
    function mover(tecla) {
      if (seleccion < 0) { seleccion = 40; pintar(); return; }
      let f = FILA[seleccion], c = COL[seleccion];
      if (tecla === 'ArrowUp') f = Math.max(0, f - 1);
      else if (tecla === 'ArrowDown') f = Math.min(8, f + 1);
      else if (tecla === 'ArrowLeft') c = Math.max(0, c - 1);
      else if (tecla === 'ArrowRight') c = Math.min(8, c + 1);
      seleccion = f * 9 + c;
      pintar();
    }

    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      if (!estado || estado.terminado || generando) return;

      const k = ev.key;
      if (k === 'p' || k === 'P') { alternarPausa(); return; }
      if (pausado) return;

      if (k >= '1' && k <= '9') { colocarNumero(Number(k)); ev.preventDefault(); }
      else if (k === 'Backspace' || k === 'Delete' || k === '0') { borrar(); ev.preventDefault(); }
      else if (k.indexOf('Arrow') === 0) { mover(k); ev.preventDefault(); }
      else if (k === 'n' || k === 'N') { alternarNotas(); }
    }
    document.addEventListener('keydown', alTecla);

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    const esDeHoy = MODO === 'libre' || (guardado && guardado.fecha === global.Diario.hoy());
    if (valido(guardado) && esDeHoy) cargar(guardado);
    else if (MODO !== 'libre') nueva('diario');
    else nueva(NIVEL[Almacen.leer('sudoku:nivel', 'facil')] && Almacen.leer('sudoku:nivel', 'facil') !== 'diario' ? Almacen.leer('sudoku:nivel', 'facil') : 'facil');

    return {
      destruir() {
        destruido = true;
        document.removeEventListener('keydown', alTecla);
        auto.detener(true);
        crono.destruir();
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
        instancia = global.Diario.panelCompletado(contenedor, { base: BASE, texto: 'Tu tiempo: ' + Cronometro.formatear(res.valor) });
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
