/* tutoriales-d.js · Mini partidas guiadas de los juegos de la etapa 12
   Cuatro en línea, Reversi, Simon dice, Pirámide matemática, Escalera de palabras,
   Sort Liquid, Sokoban, Parking Jam, Loop Line y Tangram. Se apoya en tutorial.js y css/tutorial.css. */
(function (global) {
  'use strict';
  const T = global.Tutorial;
  if (!T) return;

  const g = (id, cols, celdas, extra) => Object.assign({ id, cols, celdas }, extra || {});
  const cel = (id, t, c, extra) => Object.assign({ id, t: t == null ? '' : String(t), c: c || '' }, extra || {});
  const inerte = { inerte: true };

  /* ---------------- Cuatro en línea ---------------- */
  T.registrar('cuatro-en-linea', () => {
    const tabla = (pref, filas, cols, mapa) => {
      const celdas = [];
      for (let r = 0; r < filas; r++) for (let c = 0; c < cols; c++) {
        const v = (mapa[r] || '')[c] || '.';
        celdas.push(cel(pref + r + c, '', v === 'A' ? 'acento' : v === 'M' ? 'oscura' : '', inerte));
      }
      return celdas;
    };
    const flechas = (pref, cols) => Array.from({ length: cols }, (_, c) => cel(pref + c, '↓', 'fija', { aria: 'Columna ' + (c + 1) }));
    return {
      grupos: [
        g('f1', 5, flechas('f', 5), { clase: 'tut-grupo--chico', rotulo: 'Elegí la columna', etiqueta: 'Columnas' }),
        g('t1', 5, tabla('a', 3, 5, ['.....', '.....', '.AAAM']), { clase: 'tut-grupo--chico', etiqueta: 'Tablero' }),
        g('f2', 3, flechas('h', 3), { clase: 'tut-grupo--chico', rotulo: 'Elegí la columna', oculto: true }),
        g('t2', 3, tabla('b', 4, 3, ['...', '.A.', '.A.', 'MAM']), { clase: 'tut-grupo--chico', oculto: true })
      ],
      pasos: [
        { texto: 'Las fichas de color son tuyas, las oscuras de la máquina. Al elegir una columna, tu ficha cae hasta el fondo. Tenés tres en fila abajo: tocá la primera columna para completar cuatro.', pista: 'Tocá la flecha de la columna de la izquierda.', clic: ['f0'],
          tras: (e) => { ['a20', 'a21', 'a22', 'a23'].forEach((id) => e.c(id, 'ok')); e.ver('f1', false); e.ver('t1', false); e.ver('f2', true); e.ver('t2', true); },
          bien: 'Cuatro en línea horizontal: ganaste.' },
        { texto: 'Las líneas también valen en vertical y en diagonal. Acá tenés tres fichas una arriba de otra. Tocá esa columna para sumar la cuarta.', pista: 'La columna del medio.', clic: ['h1'],
          tras: (e) => { ['b01', 'b11', 'b21', 'b31'].forEach((id) => e.c(id, 'ok')); },
          bien: 'Vertical también cuenta.' }
      ],
      fin: 'Eso es todo: gana quien junta cuatro fichas en línea primero, sea horizontal, vertical o diagonal. Si no podés ganar, tapá las líneas de tres de la máquina. Con Deshacer volvés a tu jugada anterior.'
    };
  });

  /* ---------------- Reversi ---------------- */
  T.registrar('reversi', () => {
    const fila = [cel('r0', '', 'acento grande', inerte), cel('r1', '', 'oscura', inerte), cel('r2', '', 'oscura', inerte), cel('r3', '', 'fija')];
    const diag = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const id = 'd' + r + c;
      if (r === 0 && c === 0) diag.push(cel(id, '', 'acento', inerte));
      else if (r === 1 && c === 1) diag.push(cel(id, '', 'oscura', inerte));
      else if (r === 2 && c === 2) diag.push(cel(id, '', 'fija'));
      else diag.push(cel(id, '', 'fija', inerte));
    }
    return {
      grupos: [
        g('uno', 4, fila, { clase: 'tut-grupo--medio', etiqueta: 'Fila de casillas' }),
        g('dos', 3, diag, { clase: 'tut-grupo--medio', oculto: true, etiqueta: 'Diagonal' })
      ],
      pasos: [
        { texto: 'Vos jugás con las fichas de color. Una jugada es válida si encierra fichas oscuras entre la ficha nueva y otra tuya. Acá, poniendo una a la derecha, las dos oscuras quedan en el medio. Tocá la casilla vacía.', pista: 'La casilla vacía de la derecha.', clic: ['r3'],
          tras: (e) => { ['r1', 'r2', 'r3'].forEach((id) => e.c(id, 'acento')); e.ver('uno', false); e.ver('dos', true); },
          bien: 'Las fichas encerradas se dieron vuelta y ahora son tuyas.' },
        { texto: 'También encierran en vertical y en diagonal. Poné en la esquina de abajo: la oscura del medio queda entre tu ficha nueva y la de arriba.', pista: 'La casilla vacía de la esquina de abajo a la derecha.', clic: ['d22'],
          tras: (e) => { ['d11', 'd22'].forEach((id) => e.c(id, 'acento')); },
          bien: 'Tres fichas tuyas en diagonal.' }
      ],
      fin: 'En el juego, las casillas donde podés jugar aparecen marcadas. Si no tenés ninguna, se pasa el turno solo. La partida termina cuando ninguno puede jugar, y gana quien tiene más fichas. Las esquinas son muy valiosas porque nadie las puede dar vuelta.'
    };
  });

  /* ---------------- Simon dice ---------------- */
  T.registrar('simon', () => ({
    grupos: [g('pads', 2, [cel('p1', '1', 'k1 grande'), cel('p2', '2', 'k2 grande'), cel('p3', '3', 'k3 grande'), cel('p4', '4', 'k4 grande')], { clase: 'tut-grupo--grande', etiqueta: 'Colores' })],
    pasos: [
      { texto: 'La máquina ilumina un color y vos lo repetís. Se iluminó el 1, el de arriba a la izquierda. Tocalo.', pista: 'El número 1.', clic: ['p1'], bien: 'Ronda 1 completa.' },
      { texto: 'Ahora la secuencia tiene dos colores: el 1 y después el 4. Repetila en el mismo orden.', pista: 'Primero el 1, después el 4 (abajo a la derecha).', clic: ['p1', 'p4'], bien: 'Ronda 2 completa.' },
      { texto: 'Tres colores: 1, 4 y 2. Cada ronda suma uno más.', pista: 'El 1, el 4 y el 2, en ese orden.', clic: ['p1', 'p4', 'p2'], bien: 'Ronda 3 completa.' }
    ],
    fin: 'Si te equivocás, la partida termina y tu puntaje es la cantidad de rondas completas. En el juego los colores se iluminan solos y también podés usar las teclas 1, 2, 3 y 4. Elegí la velocidad: cuanto más rápido, más difícil.'
  }));

  /* ---------------- Pirámide matemática ---------------- */
  T.registrar('piramide', () => {
    const pad = Array.from({ length: 10 }, (_, d) => cel('n' + d, d, 'tecla'));
    const num = (id, t, c) => cel(id, t, c || 'fija', t === '' ? {} : inerte);
    return {
      grupos: [
        g('a0', 1, [cel('t', '', '')], { clase: 'tut-grupo--medio', plana: false }),
        g('a1', 2, [num('m0', 5), cel('m1', '', '')], { clase: 'tut-grupo--medio' }),
        g('a2', 3, [num('b0', 2), num('b1', 3), num('b2', 4)], { clase: 'tut-grupo--medio' }),
        g('b0', 1, [num('u', 16)], { clase: 'tut-grupo--medio', oculto: true }),
        g('b1', 2, [num('v0', 7), num('v1', 9)], { clase: 'tut-grupo--medio', oculto: true }),
        g('b2', 3, [num('w0', 3), cel('w1', '', ''), num('w2', 5)], { clase: 'tut-grupo--medio', oculto: true }),
        g('pad', 5, pad, { clase: 'tut-grupo--chico', etiqueta: 'Números' })
      ],
      pasos: [
        { texto: 'Cada casilla es la suma de las dos que tiene debajo. En la fila del medio falta una: 3 + 4. Tocá la casilla vacía y después el 7.', pista: 'Primero la casilla vacía del medio, después el número 7.', clic: ['m1', 'n7'],
          tras: (e, i) => { if (i === 0) e.mas('m1', 'sel'); else { e.menos('m1', 'sel'); e.t('m1', '7'); e.c('m1', 'ok'); e.cel('m1').inerte = true; } }, bien: '3 + 4 = 7.' },
        { texto: 'Arriba va la suma de las dos del medio: 5 + 7 = 12. Tocá la casilla de arriba y escribí el 12: un 1 y después un 2.', pista: 'La casilla de arriba, después el 1 y después el 2.', clic: ['t', 'n1', 'n2'],
          tras: (e, i) => {
            if (i === 0) e.mas('t', 'sel');
            else if (i === 1) e.t('t', '1');
            else { e.ver('a0', false); e.ver('a1', false); e.ver('a2', false); e.ver('b0', true); e.ver('b1', true); e.ver('b2', true); }
          }, bien: 'Pirámide completa: 5 + 7 = 12.' },
        { texto: 'A veces falta una de abajo, y entonces hay que restar. Arriba hay 16; en el medio 7 y 9. El 7 es 3 más la que falta, así que la que falta es 7 − 3. Tocá la casilla vacía y escribí ese número.', pista: 'La casilla vacía de abajo y después el 4.', clic: ['w1', 'n4'],
          tras: (e, i) => { if (i === 0) e.mas('w1', 'sel'); else { e.menos('w1', 'sel'); e.t('w1', '4'); e.c('w1', 'ok'); e.cel('w1').inerte = true; } }, bien: '3 + 4 = 7 y 4 + 5 = 9.' }
      ],
      fin: 'Con sumas hacia arriba y restas hacia abajo siempre se llega al resultado, sin adivinar. En el juego elegís una casilla y escribís con el teclado o con los botones. Las casillas que no coinciden se marcan.'
    };
  });

  /* ---------------- Escalera de palabras ---------------- */
  T.registrar('escalera', () => {
    const fila = (id, palabra, c, activa, oculto) => g(id, 5, palabra.split('').map((ch, i) => cel(id + '_' + i, ch, c + ' grande', activa ? {} : inerte)), { clase: 'tut-grupo--medio', oculto: !!oculto, etiqueta: 'Palabra ' + palabra });
    const ops = ['O', 'U', 'R', 'A', 'E', 'I'].map((l) => cel('o' + l, l, 'tecla'));
    return {
      grupos: [
        fila('f1', 'ACTAS', '', true),
        fila('f2', 'ACTOS', '', true, true),
        fila('f3', 'AUTOS', '', true, true),
        fila('f4', 'AUTOR', 'ok', false, true),
        fila('meta', 'AUTOR', 'acento', false),
        g('op', 6, ops, { clase: 'tut-grupo--chico', rotulo: 'Letras para elegir' })
      ],
      pasos: [
        { texto: 'Tenés que llegar de ACTAS a AUTOR cambiando una sola letra por paso, y cada paso tiene que ser una palabra de verdad. Primero tocá la última letra de ACTAS y después la O: queda ACTOS.', pista: 'La S del final de ACTAS y después la letra O.', clic: ['f1_4', 'oO'],
          tras: (e, i) => { if (i === 0) e.mas('f1_4', 'sel'); else { e.menos('f1_4', 'sel'); e.ver('f2', true); } }, bien: 'ACTAS pasó a ACTOS.' },
        { texto: 'Ahora de ACTOS a AUTOS: cambiá la segunda letra, la C, por una U.', pista: 'La C de ACTOS y después la letra U.', clic: ['f2_1', 'oU'],
          tras: (e, i) => { if (i === 0) e.mas('f2_1', 'sel'); else { e.menos('f2_1', 'sel'); e.ver('f3', true); } }, bien: 'ACTOS pasó a AUTOS.' },
        { texto: 'Un paso más: de AUTOS a AUTOR cambiando la última letra por una R.', pista: 'La S del final de AUTOS y después la letra R.', clic: ['f3_4', 'oR'],
          tras: (e, i) => { if (i === 0) e.mas('f3_4', 'sel'); else { e.menos('f3_4', 'sel'); e.ver('f4', true); } }, bien: 'Llegaste a AUTOR en tres pasos.' }
      ],
      fin: 'Llegaste en tres pasos. En el juego escribís cada palabra; gana el que llega con menos pasos. Con Pista te dice la próxima palabra y con Deshacer sacás el último paso.'
    };
  });

  /* ---------------- Sort Liquid ---------------- */
  T.registrar('sort-liquid', () => {
    const tubo = (id, cols) => cel(id, '', 'tubo-t', { hijos: cols.map((k) => ({ c: 's' + k })), aria: 'Tubo ' + id });
    return {
      grupos: [g('tubos', 3, [tubo('A', [1, 2]), tubo('B', [2]), tubo('C', [1])], { clase: 'tut-grupo--grande', etiqueta: 'Tubos' })],
      pasos: [
        { texto: 'Hay que dejar cada tubo con un solo color. Se vuelca el color de arriba de un tubo en otro. El tubo A tiene arriba el color 2, igual que el tubo B. Tocá el A y después el B.', pista: 'Primero el tubo A, después el B.', clic: ['A', 'B'],
          tras: (e, i) => { if (i === 0) e.mas('A', 'sel'); else { e.menos('A', 'sel'); e.hijos('A', [{ c: 's1' }]); e.hijos('B', [{ c: 's2' }, { c: 's2' }]); } }, bien: 'Se pasó el color 2 al tubo B.' },
        { texto: 'Ahora el A tiene solo el color 1 arriba, igual que el C. Volcá el A en el C.', pista: 'Primero el tubo A, después el C.', clic: ['A', 'C'],
          tras: (e, i) => { if (i === 0) e.mas('A', 'sel'); else { e.menos('A', 'sel'); e.hijos('A', []); e.hijos('C', [{ c: 's1' }, { c: 's1' }]); } }, bien: 'Cada tubo tiene un solo color.' }
      ],
      fin: 'Solo se puede volcar sobre un tubo vacío o sobre el mismo color, y si hay lugar (cada tubo entra cuatro). Si te trabás, Deshacer te devuelve un paso y Pista te muestra una jugada posible.'
    };
  });

  /* ---------------- Sokoban ---------------- */
  T.registrar('sokoban', () => {
    const estado = { jug: 1, caja: 2 };
    const dib = (e) => {
      for (let c = 0; c < 6; c++) {
        const id = 't' + c;
        if (c === 0 || c === 5) continue;
        const meta = c === 4;
        let txt = ''; let cl = meta ? 'sk-meta chica' : 'fija';
        if (c === estado.jug) { txt = 'Vos'; cl = 'acento chica'; }
        else if (c === estado.caja) { txt = 'Caja'; cl = (meta ? 'ok' : 'k3') + ' chica'; }
        else if (meta) txt = 'Meta';
        e.t(id, txt); e.c(id, cl);
      }
    };
    const fila = [];
    for (let c = 0; c < 6; c++) fila.push(cel('t' + c, c === 1 ? 'Vos' : c === 2 ? 'Caja' : c === 4 ? 'Meta' : '', c === 0 || c === 5 ? 'oscura' : c === 1 ? 'acento chica' : c === 2 ? 'k3 chica' : c === 4 ? 'sk-meta chica' : 'fija', inerte));
    const ctl = [cel('u', '↑', 'fija'), cel('l', '←', 'fija'), cel('d', '↓', 'fija'), cel('r', '→', 'fija')];
    const mover = (e, i) => {
      if (estado.caja === estado.jug + 1) estado.caja += 1;
      estado.jug += 1;
      dib(e);
    };
    return {
      grupos: [
        g('tab', 6, fila, { clase: 'tut-grupo--chico', etiqueta: 'Tablero' }),
        g('ctl', 4, ctl, { clase: 'tut-grupo--chico', rotulo: 'Mover', etiqueta: 'Flechas' })
      ],
      pasos: [
        { texto: 'Vos sos el cuadrado de color. La caja se empuja caminando contra ella. Tu objetivo es dejarla sobre la marca. Tocá la flecha derecha para empujar la caja.', pista: 'La flecha →.', clic: ['r'], tras: mover, bien: 'La caja avanzó un lugar.' },
        { texto: 'Falta un lugar para llegar a la marca. Empujá otra vez a la derecha.', pista: 'La flecha →.', clic: ['r'], tras: mover, bien: 'La caja quedó sobre la marca.' }
      ],
      fin: 'Solo se empuja, nunca se tira de las cajas, y no se pueden empujar dos cajas juntas ni contra una pared. Pensá antes de empujar: una caja pegada a una esquina ya no se mueve. En el juego usá las flechas del teclado, los botones o deslizá el dedo. Deshacer te devuelve el último paso.'
    };
  });

  /* ---------------- Parking Jam ---------------- */
  T.registrar('parking-jam', () => {
    const est = { b: 1, rojo: 0 }; // fila de arriba del auto vertical, columna izquierda del auto rojo
    const dib = (e) => {
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const esB = c === 2 && (r === est.b || r === est.b + 1);
        const esR = r === 1 && (c === est.rojo || c === est.rojo + 1);
        e.t('p' + r + c, esR ? 'Auto' : '');
        e.c('p' + r + c, (esR ? 'acento chica' : esB ? 'k2' : 'fija'));
      }
    };
    const celdas = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const esB = c === 2 && (r === 1 || r === 2); const esR = r === 1 && c < 2;
      celdas.push(cel('p' + r + c, esR ? 'Auto' : '', esR ? 'acento chica' : esB ? 'k2' : 'fija', esR || esB ? {} : inerte));
    }
    const ctl = [cel('u', '↑', 'fija'), cel('l', '←', 'fija'), cel('d', '↓', 'fija'), cel('r', '→', 'fija')];
    return {
      grupos: [
        g('tab', 4, celdas, { clase: 'tut-grupo--medio junto', rotulo: 'La salida está a la derecha de la segunda fila', etiqueta: 'Estacionamiento' }),
        g('ctl', 4, ctl, { clase: 'tut-grupo--chico', rotulo: 'Mover el auto elegido', etiqueta: 'Flechas' })
      ],
      pasos: [
        { texto: 'Hay que sacar el auto de color por la derecha de su fila. Pero hay otro auto atravesado. Cada auto solo se mueve para adelante y para atrás. Tocá el auto vertical (el que bloquea) y después la flecha hacia abajo.', pista: 'Tocá el auto que está en la columna del medio y después ↓.', clic: [['p12', 'p22'], 'd'],
          tras: (e, i) => { if (i === 1) { est.b = 2; dib(e); } }, bien: 'El camino quedó libre.' },
        { texto: 'Ahora tocá tu auto de color y movelo dos veces a la derecha para sacarlo.', pista: 'Tocá el auto de color y después → dos veces.', clic: [['p10', 'p11'], 'r', 'r'],
          tras: (e, i) => { if (i >= 1) { est.rojo += 1; dib(e); } }, bien: 'El auto de color salió.' }
      ],
      fin: 'Eso es todo: despejá el camino moviendo los demás autos. En el juego los arrastrás con el dedo o con el mouse, o los elegís con Tab y los movés con las flechas. Mover varias veces seguidas el mismo auto cuenta como un solo movimiento. Sale el mínimo de movimientos que te falta con Pista.'
    };
  });

  /* ---------------- Loop Line ---------------- */
  T.registrar('loop-line', () => {
    const punto = (id) => cel(id, '+', 'vacia suave', inerte);
    const lado = (id, h) => cel(id, '', 'fija', { aria: h ? 'Lado horizontal' : 'Lado vertical' });
    const celdas = [
      punto('d00'), lado('h00', true), punto('d01'), lado('h01', true), punto('d02'),
      lado('v00', false), cel('c0', '3', 'grande', inerte), lado('v01', false), cel('c1', '3', 'grande', inerte), lado('v02', false),
      punto('d10'), lado('h10', true), punto('d11'), lado('h11', true), punto('d12')
    ];
    const trazar = (ids, clue) => (e, i) => {
      e.c(ids[i], 'acento');
      if (i === ids.length - 1) e.c(clue, 'grande ok');
    };
    return {
      grupos: [g('tab', 5, celdas, { clase: 'tut-grupo--medio', etiqueta: 'Puntos, lados y números' })],
      pasos: [
        { texto: 'Se dibuja una línea uniendo puntos vecinos. Cada número dice cuántos lados de su casilla llevan línea. El primer 3 pide tres lados: trazá el de arriba, el de la izquierda y el de abajo.', pista: 'Los cuadrados grises que rodean al primer 3, menos el del medio.', clic: ['h00', 'v00', 'h10'], tras: trazar(['h00', 'v00', 'h10'], 'c0'), bien: 'El primer 3 está completo.' },
        { texto: 'Lo mismo del otro lado: arriba, derecha y abajo del segundo 3.', pista: 'Los lados de arriba, derecha y abajo del segundo 3.', clic: ['h01', 'v02', 'h11'], tras: trazar(['h01', 'v02', 'h11'], 'c1'), bien: 'La línea se cerró.' }
      ],
      fin: 'Quedó una sola línea cerrada, sin cruces ni ramas, y los dos números se cumplen. En el juego tocás cada lado para trazarlo, con otro toque lo marcás con una cruz (descartado) y con un tercero lo borrás. Los números se ponen verdes cuando se cumplen y rojos si te pasaste.'
    };
  });

  /* ---------------- Tangram ---------------- */
  T.registrar('tangram', () => {
    const sil = Array.from({ length: 6 }, (_, i) => cel('s' + i, '', 'oscura', { aria: 'Parte de la silueta' }));
    const piezas = [cel('pa', 'A', 'k1 grande'), cel('pb', 'B', 'k2 grande'), cel('pc', 'C', 'k3 grande')];
    const poner = (pieza, lugar, clase) => (e, i) => {
      if (i === 0) { e.mas(pieza, 'sel'); return; }
      e.menos(pieza, 'sel');
      e.c(pieza, 'vacia'); e.t(pieza, ''); e.cel(pieza).inerte = true;
      lugar.forEach((id) => { e.c(id, clase); e.cel(id).inerte = true; });
    };
    return {
      grupos: [
        g('sil', 3, sil, { clase: 'tut-grupo--medio junto', rotulo: 'Silueta', etiqueta: 'Silueta' }),
        g('pz', 3, piezas, { clase: 'tut-grupo--medio', rotulo: 'Piezas' }),
        g('gi', 2, [cel('gp', '◣', 'k4 grande'), cel('gira', 'Girar', 'fija chica')], { clase: 'tut-grupo--medio', rotulo: 'Girar una pieza', oculto: true })
      ],
      pasos: [
        { texto: 'Armás la silueta oscura con piezas que no se pueden superponer. Elegí la pieza A y tocá la parte izquierda de la silueta para ubicarla.', pista: 'Tocá la pieza A y después la columna de la izquierda de la silueta.', clic: ['pa', ['s0', 's3']], tras: poner('pa', ['s0', 's3'], 'k1'), bien: 'La A encajó.' },
        { texto: 'Ahora la B arriba a la derecha.', pista: 'La pieza B y después las dos casillas de arriba a la derecha.', clic: ['pb', ['s1', 's2']], tras: poner('pb', ['s1', 's2'], 'k2'), bien: 'La B encajó.' },
        { texto: 'Y la C abajo a la derecha.', pista: 'La pieza C y después las dos casillas de abajo a la derecha.', clic: ['pc', ['s4', 's5']], tras: (e, i) => { poner('pc', ['s4', 's5'], 'k3')(e, i); if (i === 1) { e.ver('sil', false); e.ver('pz', false); e.ver('gi', true); } }, bien: 'Silueta completa.' },
        { texto: 'Si una pieza no entra, probá girarla. Acá el triángulo mira para el lado equivocado: tocalo y después tocá Girar.', pista: 'Tocá el triángulo y después Girar.', clic: ['gp', 'gira'], tras: (e, i) => { if (i === 0) e.mas('gp', 'sel'); else { e.menos('gp', 'sel'); e.t('gp', '◢'); e.c('gp', 'ok grande'); } }, bien: 'Ahora mira para donde hacía falta.' }
      ],
      fin: 'En el juego tocás una pieza para elegirla, la arrastrás hasta la silueta y, si volvés a tocarla estando elegida, gira 45 grados. También hay botones Girar y Voltear (el paralelogramo se puede dar vuelta). Las piezas se pegan solas a las esquinas cercanas. Con Pista se muestra dónde va una pieza.'
    };
  });
})(window);
