/* tutoriales-a.js · Mini partidas guiadas de los juegos de lógica
   Sudoku, Crucigrama, Sopa de letras, Buscaminas, 2048, Nonogramas, Laberinto,
   Memoria, Puzzle deslizante, Torres de Hanoi, Mastermind y Lights Out.
   Se apoya en tutorial.js (motor) y css/tutorial.css (dibujo). */
(function (global) {
  'use strict';
  const T = global.Tutorial;
  if (!T) return;

  const g = (id, cols, celdas, extra) => Object.assign({ id, cols, celdas }, extra || {});
  const cel = (id, t, c, extra) => Object.assign({ id, t: t == null ? '' : String(t), c: c || '' }, extra || {});
  const mando = () => g('mando', 4, [
    cel('izq', '←', 'boton', { aria: 'Izquierda' }), cel('arr', '↑', 'boton', { aria: 'Arriba' }),
    cel('aba', '↓', 'boton', { aria: 'Abajo' }), cel('der', '→', 'boton', { aria: 'Derecha' })
  ], { plana: true, etiqueta: 'Direcciones', rotulo: 'Direcciones' });

  /* ---------------- Sudoku ---------------- */
  T.registrar('sudoku', () => {
    const sol = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
    const vacios = new Set(['0,2', '1,0', '2,1', '3,3']);
    const celdas = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const v = vacios.has(r + ',' + c);
        celdas.push(cel('c' + r + c, v ? '' : sol[r][c], (v ? '' : 'fija') + (c === 1 ? ' bloque-der' : '') + (r === 1 ? ' bloque-aba' : '')));
      }
    }
    let actual = null;
    const marcar = (e, r, c) => {
      for (let i = 0; i < 4; i++) { for (let j = 0; j < 4; j++) e.menos('c' + i + j, 'sel igual'); }
      if (r == null) return;
      for (let i = 0; i < 4; i++) {
        e.mas('c' + r + i, 'igual'); e.mas('c' + i + c, 'igual');
      }
      e.mas('c' + r + c, 'sel'); e.menos('c' + r + c, 'igual');
    };
    const elegir = (r, c) => (e) => { actual = [r, c]; marcar(e, r, c); };
    const poner = (n) => (e) => {
      e.t('c' + actual[0] + actual[1], n);
      marcar(e, null);
      e.mas('c' + actual[0] + actual[1], 'ok');
    };
    return {
      grupos: [
        g('tab', 4, celdas, { clase: 'tut-grupo--junto tut-grupo--grande', etiqueta: 'Tablero de 4 por 4' }),
        g('pad', 4, [1, 2, 3, 4].map((n) => cel('n' + n, n, '')), { clase: 'tut-grupo--medio', rotulo: 'Números', etiqueta: 'Números' })
      ],
      pasos: [
        { texto: 'Hay que llenar la grilla para que cada fila, cada columna y cada cuadro de 2×2 tenga del 1 al 4 sin repetir. Tocá la casilla vacía de la primera fila.', pista: 'Es la única casilla vacía de la fila de arriba.', clic: ['c02'], tras: elegir(0, 2) },
        { texto: 'Se marcaron su fila y su columna. En la fila ya están el 1, el 2 y el 4. Falta el 3: tocalo en los números de abajo.', pista: 'Tocá el 3.', clic: ['n3'], tras: poner(3), bien: 'Bien: la fila quedó 1, 2, 3, 4.' },
        { texto: 'Ahora la casilla vacía de la segunda fila.', clic: ['c10'], tras: elegir(1, 0) },
        { texto: 'En su fila están el 4, el 1 y el 2. ¿Cuál falta?', pista: 'Falta el 3.', clic: ['n3'], tras: poner(3) },
        { texto: 'Casilla vacía de la tercera fila.', clic: ['c21'], tras: elegir(2, 1) },
        { texto: 'Su fila tiene 2, 4 y 3. Su columna y su cuadro también descartan los otros números.', pista: 'Falta el 1.', clic: ['n1'], tras: poner(1) },
        { texto: 'La última casilla vacía, abajo a la derecha.', clic: ['c33'], tras: elegir(3, 3) },
        { texto: 'Fila: 4, 3, 2. ¿Qué número queda?', pista: 'El 1.', clic: ['n1'], tras: poner(1) }
      ],
      fin: 'Tablero completo. En el juego el tablero es de 9×9 (con cuadros de 3×3), hay cuatro niveles, el botón Lápiz para anotar posibilidades, Pista, Revisar y Borrar errores.'
    };
  });

  /* ---------------- Crucigrama ---------------- */
  T.registrar('crucigrama', () => {
    const celdas = [];
    const pos = (r, c) => 'a' + r + c;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        let t = '', k = 'vacia', inerte = true;
        if (r === 0 && c === 3) { t = '2 ↓'; k = 'pista'; }
        if (r === 1 && c === 0) { t = '1 →'; k = 'pista'; }
        if ((r === 1 && c >= 1) || (r === 2 && c === 3)) { k = ''; inerte = false; }
        celdas.push(cel(pos(r, c), t, k, { inerte }));
      }
    }
    const teclas = ['A', 'E', 'G', 'I', 'O', 'R', 'S', 'T'].map((l) => cel('k' + l, l, 'tecla'));
    const cursor = { lista: [], i: 0 };
    const escribir = (e, i, id) => {
      const l = id.slice(1);
      const dest = cursor.lista[cursor.i];
      e.t(dest, l); e.menos(dest, 'sel'); e.mas(dest, 'ok');
      cursor.i += 1;
      if (cursor.lista[cursor.i]) e.mas(cursor.lista[cursor.i], 'sel');
    };
    return {
      grupos: [
        g('defs', 1, [
          cel('d1', '1 →  Animal que maúlla (4 letras)', 'chica', { inerte: true }),
          cel('d2', '2 ↓  Infusión caliente (2 letras)', 'chica', { inerte: true })
        ], { plana: true, rotulo: 'Definiciones', clase: 'tut-grupo--junto' }),
        g('tab', 5, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Crucigrama' }),
        g('teclado', 8, teclas, { clase: 'tut-grupo--chico', rotulo: 'Teclado', etiqueta: 'Teclado' })
      ],
      pasos: [
        { texto: 'Las casillas grises tienen la definición y una flecha: → la palabra va hacia la derecha, ↓ hacia abajo. Tocá la primera casilla de la palabra 1, la que está pegada a su definición.', pista: 'Es la casilla vacía que está a la derecha del 1 →.', clic: ['a11'],
          tras: (e) => { cursor.lista = ['a11', 'a12', 'a13', 'a14']; cursor.i = 0; cursor.lista.forEach((i) => e.mas(i, 'igual')); e.mas('a11', 'sel'); } },
        { texto: 'La definición dice "Animal que maúlla", 4 letras. Escribí GATO con el teclado: G, A, T, O.', pista: 'Tocá G, después A, después T y por último O.', clic: ['kG', 'kA', 'kT', 'kO'], tras: escribir,
          bien: 'GATO quedó completo. La T también sirve para otra palabra.' },
        { texto: 'La palabra 2 baja desde la T y las dos comparten esa casilla. Tocá la casilla que está justo abajo de la T.', pista: 'Es la casilla vacía de la última fila.', clic: ['a23'],
          tras: (e) => { cursor.lista = ['a23']; cursor.i = 0; e.mas('a13', 'igual'); e.mas('a23', 'sel'); } },
        { texto: 'Infusión caliente, dos letras: TÉ. La T ya está, falta la E (en los crucigramas no hace falta la tilde).', pista: 'Tocá la E.', clic: ['kE'], tras: escribir }
      ],
      fin: 'Crucigrama resuelto. Si tocás una casilla que ya está elegida, cambia entre horizontal y vertical. En el juego también podés tocar una definición de la lista, usar Pista, Revisar o revelar una palabra.'
    };
  });

  /* ---------------- Sopa de letras ---------------- */
  T.registrar('sopa-de-letras', () => {
    const filas = ['SOLBP', 'KDVEA', 'ZMARN', 'TUQCW', 'FHJGX'];
    const celdas = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) celdas.push(cel('s' + r + c, filas[r][c], ''));
    const lista = ['SOL', 'MAR', 'PAN'].map((p) => cel('p' + p, p, 'chica', { inerte: true }));
    const palabra = (nombre, a, b) => ({ nombre, a, b });
    const rango = (a, b) => {
      const dr = Math.sign(b[0] - a[0]); const dc = Math.sign(b[1] - a[1]);
      const out = []; let r = a[0]; let c = a[1];
      for (;;) { out.push('s' + r + c); if (r === b[0] && c === b[1]) break; r += dr; c += dc; }
      return out;
    };
    const par = (p, textoUno, textoDos, bien) => [
      { texto: textoUno, clic: ['s' + p.a[0] + p.a[1]], tras: (e) => e.mas('s' + p.a[0] + p.a[1], 'sel') },
      { texto: textoDos, clic: ['s' + p.b[0] + p.b[1]], bien,
        tras: (e) => { rango(p.a, p.b).forEach((id) => { e.menos(id, 'sel'); e.mas(id, 'ok'); }); e.mas('p' + p.nombre, 'ok'); } }
    ];
    const sol = palabra('SOL', [0, 0], [0, 2]);
    const mar = palabra('MAR', [2, 1], [2, 3]);
    const pan = palabra('PAN', [0, 4], [2, 4]);
    return {
      grupos: [
        g('lista', 3, lista, { plana: true, rotulo: 'Palabras para encontrar', clase: 'tut-grupo--junto' }),
        g('tab', 5, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Sopa de letras' })
      ],
      pasos: [].concat(
        par(sol, 'Hay que encontrar las palabras de la lista dentro de las letras. Buscá SOL: tocá la primera letra, la S de arriba a la izquierda.', 'Ahora tocá la última letra de la palabra, la L.', 'Encontraste SOL.'),
        par(mar, 'Ahora MAR, que está en la tercera fila. Tocá la M.', 'Tocá la R, donde termina.', 'MAR encontrada.'),
        par(pan, 'PAN va hacia abajo en la última columna. Tocá la P de arriba.', 'Tocá la N, tres letras más abajo.', 'Encontraste las tres.')
      ),
      fin: 'Sopa resuelta. En el juego también podés arrastrar el dedo o el mouse sobre las letras. En el modo difícil las palabras pueden ir en diagonal y al revés.'
    };
  });

  /* ---------------- Buscaminas ---------------- */
  T.registrar('buscaminas', () => {
    const num = [[1, 'M', 1, 0], [1, 2, 2, 1], [0, 1, 'M', 1], [0, 1, 1, 1]];
    const tapadas = new Set(['0,1', '1,1', '2,2']);
    const celdas = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const k = r + ',' + c;
        if (tapadas.has(k)) celdas.push(cel('m' + r + c, '', 'tapada'));
        else celdas.push(cel('m' + r + c, num[r][c] || '', 'abierta n' + num[r][c], { inerte: true }));
      }
    }
    const bandera = (id) => (e) => e.c(id, 'tapada bandera');
    return {
      grupos: [g('tab', 4, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Tablero de buscaminas' })],
      pasos: [
        { texto: 'Cada número dice cuántas minas hay en las casillas de alrededor. Mirá el 1 de la esquina de abajo a la derecha: de sus vecinas, solo una está tapada. Esa tiene que ser la mina. Tocala para marcarla con bandera.', pista: 'Es la casilla tapada que toca al 1 de la esquina.', clic: ['m22'], tras: bandera('m22'),
          bien: 'En el juego se marca con clic derecho, manteniendo apretado, o con el botón Modo bandera.' },
        { texto: 'El 1 que está a la izquierda de la mina ya tiene su mina. Entonces la otra casilla tapada que lo rodea es segura. Tocala para destaparla.', pista: 'Es la casilla tapada del medio del tablero.', clic: ['m11'], tras: (e) => { e.c('m11', 'abierta n2'); e.t('m11', 2); e.cel('m11').inerte = true; },
          bien: 'Era un 2: dos minas alrededor.' },
        { texto: 'Ahora el 1 de la esquina de arriba a la izquierda: la casilla del medio ya está abierta, así que la única tapada que lo toca es mina. Marcala con bandera.', pista: 'Es la casilla tapada de la primera fila.', clic: ['m01'], tras: bandera('m01') }
      ],
      fin: 'Quedaron las dos minas marcadas y todo lo demás abierto: así se gana. La primera casilla que destapás nunca tiene mina. Tocar un número que ya tiene todas sus banderas destapa las vecinas de una vez.'
    };
  });

  /* ---------------- 2048 ---------------- */
  T.registrar('2048', () => {
    const E = (r, c) => 'f' + r + c;
    const estados = [
      [[2, 2, 0, 0], [0, 0, 0, 0], [0, 4, 0, 0], [0, 0, 0, 0]],
      [[4, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 0], [0, 0, 0, 2]],
      [[8, 0, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 2, 0, 0]],
      [[0, 0, 8, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 2]]
    ];
    const pintar = (e, s) => {
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const v = s[r][c];
        e.t(E(r, c), v || ''); e.c(E(r, c), v ? 'v' + v : '');
      }
    };
    const celdas = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const v = estados[0][r][c];
      celdas.push(cel(E(r, c), v || '', v ? 'v' + v : '', { inerte: true }));
    }
    return {
      grupos: [g('tab', 4, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Tablero 2048' }), mando()],
      pasos: [
        { texto: 'Con cada movimiento se deslizan todas las fichas. Si dos fichas iguales chocan, se fusionan y suman. Hay dos 2 juntos en la primera fila: movelos hacia la izquierda.', pista: 'Tocá la flecha ←.', clic: ['izq'], tras: (e) => pintar(e, estados[1]),
          bien: 'Los dos 2 se hicieron un 4, y el otro 4 también se deslizó hasta la pared. Después de cada movimiento aparece una ficha nueva.' },
        { texto: 'Ahora hay dos 4 en la misma columna. Movelos hacia arriba para fusionarlos.', pista: 'Tocá la flecha ↑.', clic: ['arr'], tras: (e) => pintar(e, estados[2]),
          bien: 'Dos 4 hicieron un 8.' },
        { texto: 'Movelos a la derecha. El 8 y el 2 son distintos, así que solo se deslizan.', pista: 'Tocá la flecha →.', clic: ['der'], tras: (e) => pintar(e, estados[3]) }
      ],
      fin: 'La idea es seguir fusionando hasta llegar al 2048. En el juego podés usar las flechas del teclado, WASD o deslizar el dedo sobre el tablero.'
    };
  });

  /* ---------------- Nonogramas ---------------- */
  T.registrar('nonogramas', () => {
    const celdas = [cel('x', '', 'vacia', { inerte: true })];
    ['1', '3', '1'].forEach((t, i) => celdas.push(cel('cc' + i, t, 'pista', { inerte: true })));
    const filas = ['3', '1', '1'];
    for (let r = 0; r < 3; r++) {
      celdas.push(cel('rc' + r, filas[r], 'pista', { inerte: true }));
      for (let c = 0; c < 3; c++) celdas.push(cel('n' + r + c, '', ''));
    }
    let modo = 'p';
    const tocar = (e, i, id) => {
      if (modo === 'p') e.mas(id, 'oscura');
      else { e.t(id, '✕'); e.mas(id, 'suave'); }
    };
    return {
      grupos: [
        g('tab', 4, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Nonograma de 3 por 3' }),
        g('modo', 2, [cel('mp', 'Pintar', 'boton sel'), cel('mx', 'Marcar ✕', 'boton')], { plana: true, rotulo: 'Qué hace tu toque' })
      ],
      pasos: [
        { texto: 'Los números de cada fila y columna dicen cuántas casillas seguidas van pintadas. La fila de arriba dice 3, y la fila tiene justo 3 casillas: pintalas todas, de izquierda a derecha.', pista: 'Tocá las tres casillas de la primera fila, una por una.', clic: ['n00', 'n01', 'n02'], tras: tocar },
        { texto: 'La columna del medio también dice 3. La de arriba ya está pintada: pintá las otras dos de esa columna.', pista: 'Tocá la casilla del centro y la de abajo, en la columna del medio.', clic: ['n11', 'n21'], tras: tocar,
          bien: 'Se dibujó una T. Cada fila y columna cumple su número.' },
        { texto: 'Cuando sabés que una casilla queda vacía, conviene marcarla para no confundirte. Tocá el botón Marcar ✕.', clic: ['mx'], tras: (e) => { modo = 'x'; e.menos('mp', 'sel'); e.mas('mx', 'sel'); } },
        { texto: 'Con ese modo, marcá la casilla de la izquierda de la segunda fila: sabemos que esa fila solo lleva una pintada, y ya la tiene.', pista: 'Es la casilla de la izquierda, segunda fila.', clic: ['n10'], tras: tocar }
      ],
      fin: 'Eso es todo. En los tableros grandes se pueden arrastrar varias casillas de una vez. El juego tiene Revisar, Pista y Limpiar, y los tableros siempre se resuelven con pura lógica.'
    };
  });

  /* ---------------- Laberinto ---------------- */
  T.registrar('laberinto', () => {
    const pasillos = ['0,0-1,0', '1,0-1,1', '1,1-1,2', '1,2-0,2', '0,2-0,3', '1,2-2,2', '2,2-2,3', '2,3-3,3', '0,0-0,1', '1,1-2,1', '2,1-3,1', '2,1-2,0', '3,1-3,2'];
    const abierto = new Set();
    pasillos.forEach((p) => { const [a, b] = p.split('-'); abierto.add(a + '|' + b); abierto.add(b + '|' + a); });
    const celdas = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const paso = (r2, c2) => r2 >= 0 && r2 < 4 && c2 >= 0 && c2 < 4 && abierto.has(r + ',' + c + '|' + r2 + ',' + c2);
      let k = '';
      if (!paso(r - 1, c)) k += ' pn';
      if (!paso(r + 1, c)) k += ' ps';
      if (!paso(r, c + 1)) k += ' pe';
      if (!paso(r, c - 1)) k += ' po';
      const t = r === 0 && c === 0 ? 'A' : (r === 3 && c === 3 ? 'B' : '');
      celdas.push(cel('l' + r + c, t, k.trim() + (t === 'A' ? ' acento' : ''), { inerte: true }));
    }
    const mover = (de, a) => (e) => { e.menos(de, 'acento'); e.mas(de, 'camino'); e.mas(a, 'acento'); };
    return {
      grupos: [g('tab', 4, celdas, { clase: 'tut-grupo--lab tut-grupo--grande', etiqueta: 'Laberinto' }), mando()],
      pasos: [
        { texto: 'Las líneas gruesas son paredes. Salís de la A (el cuadro oscuro) y tenés que llegar a la B. Bajá un paso.', pista: 'Tocá la flecha ↓.', clic: ['aba'], tras: mover('l00', 'l10') },
        { texto: 'Hacia la derecha hay un pasillo abierto. Seguilo.', pista: 'Tocá la flecha →.', clic: ['der'], tras: mover('l10', 'l11') },
        { texto: 'Un paso más a la derecha.', clic: ['der'], tras: mover('l11', 'l12') },
        { texto: 'A la derecha hay pared, pero para abajo se sigue. Bajá.', pista: 'Tocá la flecha ↓.', clic: ['aba'], tras: mover('l12', 'l22') },
        { texto: 'Ahora a la derecha.', clic: ['der'], tras: mover('l22', 'l23') },
        { texto: 'Último paso: bajá hasta la B.', pista: 'Tocá la flecha ↓.', clic: ['aba'], tras: mover('l23', 'l33') }
      ],
      fin: 'Llegaste a la salida. En el juego los laberintos son más grandes y podés moverte con las flechas o WASD, con los botones, o arrastrando el dedo por los pasillos. Si te perdés, el botón Pista te muestra el camino.'
    };
  });

  /* ---------------- Memoria ---------------- */
  T.registrar('memoria', () => {
    const cartas = [['m1', 'k1', 'Rojo'], ['m2', 'k2', 'Azul'], ['m3', 'k3', 'Verde'], ['m4', 'k2', 'Azul'], ['m5', 'k3', 'Verde'], ['m6', 'k1', 'Rojo']];
    const info = {}; cartas.forEach((c) => { info[c[0]] = c; });
    const celdas = cartas.map((c) => cel(c[0], '?', 'acento grande'));
    const mostrar = (e, id) => { e.c(id, info[id][1]); e.t(id, info[id][2]); };
    const tapar = (e, id) => { e.c(id, 'acento grande'); e.t(id, '?'); };
    const hecha = (e, id) => { e.mas(id, 'hecha'); e.cel(id).inerte = true; };
    return {
      grupos: [g('tab', 3, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Cartas' })],
      pasos: [
        { texto: 'Las cartas están boca abajo. Das vuelta dos por vez y buscás parejas iguales. Tocá la primera carta y después la segunda de la fila de arriba.', pista: 'Tocá la carta de arriba a la izquierda y la del medio.', clic: ['m1', 'm2'], tras: (e, i, id) => mostrar(e, id),
          bien: 'Rojo y azul no son iguales: se vuelven a tapar. Pero ahora sabés dónde está el rojo y dónde está el azul.' },
        { texto: 'Buscá el otro rojo. Acordate de dónde estaba el primero. Tocá la carta de abajo a la derecha y después la de arriba a la izquierda.', pista: 'Primero la última carta de abajo, después la primera de arriba.', clic: ['m6', 'm1'],
          tras: (e, i, id) => { if (i === 0) { tapar(e, 'm1'); tapar(e, 'm2'); } mostrar(e, id); if (i === 1) { hecha(e, 'm1'); hecha(e, 'm6'); } },
          bien: 'Pareja de rojos. Se quedan boca arriba.' },
        { texto: 'El azul también lo sabías: estaba en el medio de arriba y en el medio de abajo. Tocalos.', pista: 'Las dos cartas del medio.', clic: ['m2', 'm4'], tras: (e, i, id) => { mostrar(e, id); if (i === 1) { hecha(e, 'm2'); hecha(e, 'm4'); } } },
        { texto: 'Quedan solo dos cartas. Tocalas.', clic: ['m3', 'm5'], tras: (e, i, id) => { mostrar(e, id); if (i === 1) { hecha(e, 'm3'); hecha(e, 'm5'); } } }
      ],
      fin: 'Encontraste todas las parejas. Se cuenta cuántos movimientos usaste: cuanto menos, mejor. En el juego hay cuatro niveles, de 6 a 15 parejas.'
    };
  });

  /* ---------------- Puzzle deslizante ---------------- */
  T.registrar('puzzle-deslizante', () => {
    const ini = [1, 2, 3, 0, 4, 6, 7, 5, 8];
    const celdas = ini.map((n, i) => cel('p' + i, n || '', n ? 'grande' : 'vacia grande'));
    let hueco = 3;
    const mover = (e, i, id) => {
      const n = Number(id.slice(1));
      e.t('p' + hueco, e.cel(id).t); e.c('p' + hueco, 'grande');
      e.t(id, ''); e.c(id, 'vacia grande');
      hueco = n;
    };
    return {
      grupos: [g('tab', 3, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Puzzle de 8 fichas' })],
      pasos: [
        { texto: 'Hay que ordenar las fichas del 1 en adelante, con el hueco al final. Una ficha se mueve si está al lado del hueco. Tocá el 4: se desliza hacia el hueco.', pista: 'El 4 está pegado al hueco, a su derecha.', clic: ['p4'], tras: mover },
        { texto: 'Ahora el hueco quedó en el centro. Tocá el 5, que está justo debajo.', pista: 'El 5 está en la fila de abajo, en el medio.', clic: ['p7'], tras: mover },
        { texto: 'Último movimiento: el 8 se desliza hacia la izquierda.', pista: 'Tocá el 8, el que está abajo a la derecha.', clic: ['p8'], tras: mover }
      ],
      fin: 'Quedó ordenado. En el juego hay tableros de 3×3, 4×4 y 5×5. Si tocás una ficha que está en la misma fila o columna del hueco, se mueven todas las del medio juntas.'
    };
  });

  /* ---------------- Torres de Hanoi ---------------- */
  T.registrar('torres-de-hanoi', () => {
    const torres = [[2, 1], [], []];
    let alzado = -1;
    const pintar = (e) => {
      torres.forEach((t, i) => {
        const hijos = t.slice().reverse().map((d, k) => ({ c: 'd' + d + (alzado === i && k === 0 ? ' alzado' : '') }));
        e.hijos('t' + i, hijos);
        e.c('t' + i, 'torre' + (alzado === i ? ' sel' : ''));
      });
    };
    const mov = (de, a) => [de, a];
    const paso = (par) => (e, i) => {
      const [de, a] = par;
      if (i === 0) alzado = de;
      else { torres[a].push(torres[de].pop()); alzado = -1; }
      pintar(e);
    };
    const celdas = [0, 1, 2].map((i) => cel('t' + i, '', 'torre', {
      hijos: torres[i].slice().reverse().map((d) => ({ c: 'd' + d })), aria: 'Torre ' + (i + 1)
    }));
    return {
      grupos: [g('tab', 3, celdas, { clase: 'tut-grupo--plana tut-grupo--medio', etiqueta: 'Tres torres' })],
      pasos: [
        { texto: 'Hay que pasar todos los discos de la torre de la izquierda a otra, de a uno, y nunca un disco grande sobre uno más chico. Tocá la primera torre para levantar su disco de arriba, y después la torre del medio.', pista: 'Primero la torre de la izquierda, después la del medio.', clic: ['t0', 't1'], tras: paso(mov(0, 1)),
          bien: 'El disco chico está en el medio.' },
        { texto: 'Ahora el disco grande: levantalo de la primera torre y llevalo a la tercera, que está vacía.', pista: 'Torre de la izquierda y después la de la derecha.', clic: ['t0', 't2'], tras: paso(mov(0, 2)) },
        { texto: 'Falta traer el disco chico encima del grande. Tocá la torre del medio y después la de la derecha.', pista: 'Torre del medio y después la de la derecha.', clic: ['t1', 't2'], tras: paso(mov(1, 2)) }
      ],
      fin: 'Lo lograste en 3 movimientos, que es el mínimo para 2 discos. En el juego hay de 3 a 8 discos y el mínimo posible es 2 elevado al número de discos, menos 1. También podés usar las teclas 1, 2 y 3.'
    };
  });

  /* ---------------- Mastermind ---------------- */
  T.registrar('mastermind', () => {
    const nombres = ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Violeta', 'Naranja'];
    const colores = nombres.map((n, i) => cel('c' + (i + 1), i + 1, 'k' + (i + 1) + ' tecla', { aria: n + ' ' + (i + 1) }));
    const hist = [];
    for (let f = 0; f < 2; f++) {
      for (let c = 0; c < 4; c++) hist.push(cel('h' + f + c, '', '', { inerte: true }));
      hist.push(cel('h' + f + 'f', '', 'sinborde chica', { inerte: true }));
    }
    const slots = [0, 1, 2, 3].map((i) => cel('s' + i, '', '', { inerte: true }));
    let pos = 0; let fila = 0; const puestos = [];
    const poner = (e, i, id) => {
      const n = Number(id.slice(1));
      e.t('s' + pos, n); e.c('s' + pos, 'k' + n); puestos.push(n); pos += 1;
    };
    const probar = (fb) => (e) => {
      for (let c = 0; c < 4; c++) { e.t('h' + fila + c, puestos[c]); e.c('h' + fila + c, 'k' + puestos[c]); e.t('s' + c, ''); e.c('s' + c, ''); }
      e.t('h' + fila + 'f', fb);
      pos = 0; puestos.length = 0; fila += 1;
    };
    return {
      grupos: [
        g('hist', 5, hist, { plana: true, rotulo: 'Tus intentos', clase: 'tut-grupo--medio' }),
        g('slots', 4, slots, { rotulo: 'Tu código', clase: 'tut-grupo--chico', etiqueta: 'Tu código' }),
        g('col', 6, colores, { clase: 'tut-grupo--chico', rotulo: 'Colores (cada uno lleva su número)', etiqueta: 'Colores' }),
        g('acc', 1, [cel('probar', 'Probar', 'boton')], { plana: true })
      ],
      pasos: [
        { texto: 'La compu eligió un código secreto de 4 colores. Vos probás combinaciones y te da pistas. Empecemos: tocá el 2 (azul), el 1 (rojo), el 3 (verde) y el 5 (violeta), en ese orden.', pista: 'Azul 2, rojo 1, verde 3, violeta 5.', clic: ['c2', 'c1', 'c3', 'c5'], tras: poner },
        { texto: 'Tocá Probar para ver qué tal te fue.', clic: ['probar'], tras: probar('■ □ □'),
          bien: '■ significa un color correcto en su lugar. □ es un color que está en el código pero en otro lugar. Sin marca, ese color no está. Acá: el verde está bien ubicado; el azul y el rojo están en el código pero mal ubicados; el violeta no está.' },
        { texto: 'Probemos con eso: mantené el verde en el tercer lugar, cambiá el violeta por amarillo y poné el rojo primero y el azul segundo. Tocá 1, 2, 3 y 4.', pista: 'Rojo 1, azul 2, verde 3, amarillo 4.', clic: ['c1', 'c2', 'c3', 'c4'], tras: poner },
        { texto: 'Tocá Probar.', clic: ['probar'], tras: probar('■ ■ ■ ■') }
      ],
      fin: 'Descubriste el código en 2 intentos. En el juego hay tres niveles y se cuenta cuántos intentos usás. Los colores llevan número para distinguirlos aunque no los veas bien, y también funcionan las teclas del 1 al 8.'
    };
  });

  /* ---------------- Lights Out ---------------- */
  T.registrar('lights-out', () => {
    const luz = new Set(['0,2', '2,0', '1,1']);
    const celdas = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) celdas.push(cel('l' + r + c, '', luz.has(r + ',' + c) ? 'sel grande' : 'grande'));
    const vecinas = (r, c) => [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter((p) => p[0] >= 0 && p[0] < 3 && p[1] >= 0 && p[1] < 3);
    const tocar = (r, c) => (e) => {
      vecinas(r, c).forEach(([a, b]) => {
        const id = 'l' + a + b; const enc = /\bsel\b/.test(e.cel(id).c);
        if (enc) { e.menos(id, 'sel'); e.t(id, ''); } else { e.mas(id, 'sel'); e.t(id, ''); }
      });
    };
    return {
      grupos: [g('tab', 3, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Luces' })],
      pasos: [
        { texto: 'Las casillas amarillas son luces encendidas. Hay que apagarlas todas. Cada toque cambia esa luz y sus vecinas de arriba, abajo, izquierda y derecha. Tocá la luz de la esquina de arriba a la derecha.', pista: 'Es la esquina de arriba a la derecha.', clic: ['l02'], tras: tocar(0, 2),
          bien: 'Esa luz se apagó, pero las dos de al lado cambiaron: se encendieron.' },
        { texto: 'Ahora la esquina de abajo a la izquierda.', pista: 'Esquina de abajo, a la izquierda.', clic: ['l20'], tras: tocar(2, 0) },
        { texto: 'Para terminar, tocá la luz del medio: cambia sus cuatro vecinas y se apaga todo.', pista: 'La casilla del centro.', clic: ['l11'], tras: tocar(1, 1) }
      ],
      fin: 'Todo apagado. En el juego hay tableros de 4×4, 5×5 y 7×7, siempre con solución, y el botón Pista te marca una luz que sirve.'
    };
  });
})(window);
