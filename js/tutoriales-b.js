/* tutoriales-b.js · Mini partidas guiadas de palabras, cartas y tuberías
   Ahorcado, Ta-te-ti, Wordle, Anagramas, Spelling Bee, Conexiones, Solitario y Flow.
   Se apoya en tutorial.js (motor) y css/tutorial.css (dibujo). */
(function (global) {
  'use strict';
  const T = global.Tutorial;
  if (!T) return;

  const g = (id, cols, celdas, extra) => Object.assign({ id, cols, celdas }, extra || {});
  const cel = (id, t, c, extra) => Object.assign({ id, t: t == null ? '' : String(t), c: c || '' }, extra || {});

  /* ---------------- Ahorcado ---------------- */
  T.registrar('ahorcado', () => {
    const palabra = [0, 1, 2].map((i) => cel('w' + i, '', 'grande', { inerte: true }));
    const vidas = [0, 1, 2, 3, 4, 5].map((i) => cel('v' + i, '', 'ok', { inerte: true }));
    const teclas = ['A', 'E', 'L', 'M', 'O', 'R', 'S', 'Z'].map((l) => cel('k' + l, l, 'tecla'));
    const word = 'SOL';
    let perdidas = 0;
    const jugar = (e, i, id) => {
      const l = id.slice(1);
      e.mas(id, 'usada'); e.cel(id).inerte = true;
      let esta = false;
      for (let k = 0; k < word.length; k++) if (word[k] === l) { e.t('w' + k, l); e.mas('w' + k, 'ok'); esta = true; }
      if (!esta) { e.c('v' + perdidas, 'mal'); perdidas += 1; e.mas(id, 'letra-no'); } else e.mas(id, 'letra-ok');
    };
    return {
      grupos: [
        g('cat', 1, [cel('cat', 'Categoría: cosas del cielo', 'chica', { inerte: true })], { plana: true }),
        g('pal', 3, palabra, { clase: 'tut-grupo--grande', rotulo: 'La palabra', etiqueta: 'La palabra' }),
        g('vid', 6, vidas, { clase: 'tut-grupo--chico', rotulo: 'Errores que te quedan (6 en total)', etiqueta: 'Vidas' }),
        g('tec', 8, teclas, { clase: 'tut-grupo--chico', rotulo: 'Letras', etiqueta: 'Letras' })
      ],
      pasos: [
        { texto: 'Hay que adivinar la palabra letra por letra. Esta tiene 3 letras. Probemos con la S.', pista: 'Tocá la S en las letras.', clic: ['kS'], tras: jugar,
          bien: 'La S está: aparece en su lugar.' },
        { texto: 'Cada letra que no está te cuesta un error, y con 6 errores se completa el muñeco. Probá la Z a ver qué pasa.', pista: 'Tocá la Z.', clic: ['kZ'], tras: jugar,
          bien: 'La Z no está: perdiste una de las seis vidas.' },
        { texto: 'Con el tema "cosas del cielo" y una S al principio... Probá la O.', pista: 'Tocá la O.', clic: ['kO'], tras: jugar },
        { texto: 'Falta una sola letra: SO_. Probá la L.', pista: 'Tocá la L.', clic: ['kL'], tras: jugar }
      ],
      fin: 'Adivinaste SOL. En el juego elegís la categoría, podés usar el teclado de la compu, y el botón Pista te regala una letra a cambio de una vida. Cada palabra suma puntos y racha.'
    };
  });

  /* ---------------- Ta-te-ti ---------------- */
  T.registrar('tateti', () => {
    const celdas = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) celdas.push(cel('t' + r + c, '', 'grande'));
    const X = (e, id) => { e.t(id, 'X'); e.c(id, 'acento grande'); e.cel(id).inerte = true; };
    const O = (e, id) => { e.t(id, 'O'); e.c(id, 'oscura grande'); e.cel(id).inerte = true; };
    return {
      grupos: [g('tab', 3, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Tablero de ta-te-ti' })],
      pasos: [
        { texto: 'Vos jugás con X y la compu con O. Gana quien arma tres en línea. El centro es la mejor casilla: tocala.', pista: 'La casilla del medio.', clic: ['t11'], tras: (e) => { X(e, 't11'); O(e, 't01'); } },
        { texto: 'La compu jugó arriba, en el medio. Tomá una esquina: arriba a la izquierda. Así armás una amenaza en diagonal.', pista: 'Esquina de arriba a la izquierda.', clic: ['t00'], tras: (e) => { X(e, 't00'); O(e, 't22'); },
          bien: 'La compu tuvo que bloquear la diagonal en la esquina de abajo a la derecha.' },
        { texto: 'Ahora el truco: la esquina de abajo a la izquierda. Con ese X amenazás dos líneas a la vez (la columna de la izquierda y la otra diagonal).', pista: 'Esquina de abajo a la izquierda.', clic: ['t20'], tras: (e) => { X(e, 't20'); O(e, 't10'); },
          bien: 'La compu solo puede bloquear una amenaza por turno. Bloqueó la columna.' },
        { texto: 'Queda libre la otra diagonal: completala en la esquina de arriba a la derecha.', pista: 'Esquina de arriba a la derecha.', clic: ['t02'], tras: (e) => { X(e, 't02'); ['t02', 't11', 't20'].forEach((i) => e.mas(i, 'ok')); } }
      ],
      fin: 'Ganaste con tres en diagonal. En el juego elegís entre Fácil, Medio e Imbatible, y se alterna quién empieza. El puntaje es la cantidad de partidas seguidas sin perder: ganar y empatar suman.'
    };
  });

  /* ---------------- Wordle ---------------- */
  T.registrar('wordle', () => {
    const tab = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) tab.push(cel('w' + r + c, '', 'grande', { inerte: true }));
    const teclas = ['A', 'E', 'I', 'L', 'M', 'O', 'P', 'R', 'S', 'T', 'V'].map((l) => cel('k' + l, l, 'tecla'));
    teclas.push(cel('kEnter', '↵', 'tecla', { aria: 'Enter' }));
    let fila = 0; let col = 0;
    const letra = (e, i, id) => { e.t('w' + fila + col, id.slice(1)); e.mas('w' + fila + col, 'sel'); col += 1; };
    const enter = (colores) => (e) => {
      colores.forEach((k, c) => { e.menos('w' + fila + c, 'sel'); e.mas('w' + fila + c, k); });
      fila += 1; col = 0;
    };
    return {
      grupos: [
        g('tab', 5, tab, { clase: 'tut-grupo--grande', etiqueta: 'Intentos' }),
        g('tec', 6, teclas, { clase: 'tut-grupo--chico', rotulo: 'Teclado', etiqueta: 'Teclado' })
      ],
      pasos: [
        { texto: 'Hay que adivinar una palabra de 5 letras en 6 intentos (acá mostramos dos filas). Para empezar escribí OLIVA: O, L, I, V, A.', pista: 'Tocá O, después L, I, V y A.', clic: ['kO', 'kL', 'kI', 'kV', 'kA'], tras: letra },
        { texto: 'Tocá Enter (la tecla ↵) para mandar la palabra.', pista: 'La última tecla, abajo a la derecha.', clic: ['kEnter'], tras: enter(['letra-casi', 'letra-ok', 'letra-no', 'letra-no', 'letra-casi']),
          bien: 'Verde: la letra está y en su lugar (la L). Amarillo: está en la palabra pero en otro lugar (la O y la A). Gris: no está (la I y la V).' },
        { texto: 'Con esas pistas: la L va en el segundo lugar y la O y la A van en otros. Probá PLATO: P, L, A, T, O.', pista: 'Tocá P, L, A, T y O.', clic: ['kP', 'kL', 'kA', 'kT', 'kO'], tras: letra },
        { texto: 'Mandala con Enter.', clic: ['kEnter'], tras: enter(['letra-ok', 'letra-ok', 'letra-ok', 'letra-ok', 'letra-ok']) }
      ],
      fin: 'Todo verde: adivinaste en 2 intentos. En el juego no hace falta poner tildes, hay una tecla para la Ñ, y hay desafío del día con la misma palabra para todos.'
    };
  });

  /* ---------------- Anagramas ---------------- */
  T.registrar('anagramas', () => {
    const slots = [0, 1, 2, 3].map((i) => cel('s' + i, '', 'grande', { inerte: true }));
    const fichas = ['A', 'P', 'O', 'S'].map((l) => cel('t' + l, l, 'grande'));
    let n = 0;
    const poner = (e, i, id) => {
      e.t('s' + n, id.slice(1)); e.mas('s' + n, 'sel');
      e.mas(id, 'usada'); e.cel(id).inerte = true;
      n += 1;
      if (n === 4) for (let k = 0; k < 4; k++) { e.menos('s' + k, 'sel'); e.mas('s' + k, 'ok'); }
    };
    return {
      grupos: [
        g('def', 1, [cel('def', 'Definición: plato líquido que se come caliente (4 letras)', 'chica', { inerte: true })], { plana: true }),
        g('slots', 4, slots, { clase: 'tut-grupo--grande', rotulo: 'Tu palabra', etiqueta: 'Tu palabra' }),
        g('fichas', 4, fichas, { clase: 'tut-grupo--grande', rotulo: 'Letras mezcladas', etiqueta: 'Letras mezcladas' })
      ],
      pasos: [
        { texto: 'Hay que ordenar las letras mezcladas para armar la palabra de la definición: plato líquido que se come caliente. Tocá S, O, P, A, en ese orden.', pista: 'Primero la S, después la O, la P y la A.', clic: ['tS', 'tO', 'tP', 'tA'], tras: poner,
          bien: 'Cuando completás todas las letras, el juego comprueba la palabra solo.' }
      ],
      fin: 'Palabra correcta: cada una vale 10 puntos por letra. Si hay otra palabra válida con las mismas letras (acá PASO), también cuenta. En el juego podés Mezclar, pedir la pista (resta 5 puntos), saltar una palabra o escribir con el teclado. Cada ronda tiene 10 palabras.'
    };
  });

  /* ---------------- Spelling Bee ---------------- */
  T.registrar('spelling-bee', () => {
    const letras = [['S', ''], ['L', ''], ['T', ''], ['A', ' sel'], ['O', ''], ['R', ''], ['E', '']].map((p) => cel('b' + p[0], p[0], 'tecla' + p[1]));
    let actual = ''; let puntos = 0; const hechas = [];
    const poner = (e, i, id) => { actual += id.slice(1); e.t('pal', actual); };
    const probar = (pt) => (e) => {
      puntos += pt; hechas.push(actual); actual = '';
      e.t('pal', ''); e.t('pts', 'Puntos: ' + puntos); e.t('enc', 'Palabras: ' + hechas.join(', '));
    };
    return {
      grupos: [
        g('pts', 1, [cel('pts', 'Puntos: 0', 'chica', { inerte: true }), cel('enc', 'Palabras: ninguna todavía', 'chica', { inerte: true })], { plana: true, clase: 'tut-grupo--junto' }),
        g('pal', 1, [cel('pal', '', 'grande', { inerte: true })], { plana: true, rotulo: 'Tu palabra' }),
        g('letras', 7, letras, { clase: 'tut-grupo--chico', rotulo: 'Letras (la amarilla del medio es obligatoria)', etiqueta: 'Letras' }),
        g('acc', 1, [cel('probar', 'Probar', 'boton')], { plana: true })
      ],
      pasos: [
        { texto: 'Armá palabras con estas siete letras. La del medio (amarilla) tiene que estar en todas, las palabras tienen 4 letras o más, y las letras se pueden repetir. Empecemos con ROSA: tocá R, O, S, A.', pista: 'Tocá R, O, S y A.', clic: ['bR', 'bO', 'bS', 'bA'], tras: poner },
        { texto: 'Tocá Probar.', clic: ['probar'], tras: probar(1), bien: 'Sumaste 1 punto: las palabras de 4 letras valen 1.' },
        { texto: 'Una más larga: SALTO. Tocá S, A, L, T, O.', pista: 'Tocá S, A, L, T y O.', clic: ['bS', 'bA', 'bL', 'bT', 'bO'], tras: poner },
        { texto: 'Tocá Probar.', clic: ['probar'], tras: probar(5), bien: 'SALTO tiene 5 letras: suma 5 puntos.' }
      ],
      fin: 'Con las palabras más largas se suma más. Las que usan las siete letras se llaman pangramas y dan 7 puntos extra. En el juego también podés armar la palabra deslizando el dedo de letra en letra, usar Mezclar, y tocar Terminar para ver las que faltaron.'
    };
  });

  /* ---------------- Conexiones ---------------- */
  T.registrar('conexiones', () => {
    const palabras = ['ROJO', 'PERA', 'AZUL', 'UVA', 'VERDE', 'LIMÓN', 'NARANJA', 'BANANA'];
    const celdas = palabras.map((p, i) => cel('w' + i, p, ''));
    const colores = ['w0', 'w2', 'w4', 'w6'];
    const frutas = ['w1', 'w3', 'w5', 'w7'];
    const marca = (e, i, id) => e.mas(id, 'sel');
    const enviar = (ids, k, nombre) => (e) => {
      ids.forEach((id) => { e.menos(id, 'sel'); e.mas(id, k); e.cel(id).inerte = true; });
      e.t('estado', nombre);
    };
    return {
      grupos: [
        g('est', 1, [cel('estado', 'Grupos encontrados: ninguno', 'chica', { inerte: true })], { plana: true }),
        g('tab', 4, celdas, { plana: true, etiqueta: 'Palabras' }),
        g('acc', 1, [cel('enviar', 'Enviar', 'boton')], { plana: true })
      ],
      pasos: [
        { texto: 'Hay palabras que forman grupos de 4 con algo en común. Acá hay dos grupos. Elegí cuatro que sean colores: ROJO, AZUL, VERDE y NARANJA.', pista: 'Tocá ROJO, AZUL, VERDE y NARANJA.', clic: colores, tras: marca,
          bien: 'Ojo: hay pistas falsas. LIMÓN también puede ser un color, pero con NARANJA quedan los cuatro justos.' },
        { texto: 'Tocá Enviar para probar el grupo.', clic: ['enviar'], tras: enviar(colores, 'k4', 'Grupo encontrado: Colores') },
        { texto: 'Las cuatro que quedan son frutas: PERA, UVA, LIMÓN y BANANA.', pista: 'Tocá PERA, UVA, LIMÓN y BANANA.', clic: frutas, tras: marca },
        { texto: 'Enviá el grupo.', clic: ['enviar'], tras: enviar(frutas, 'k3', 'Grupos encontrados: Colores y Frutas') }
      ],
      fin: 'Resuelto sin errores. En el juego hay 16 palabras y 4 grupos de colores distintos según la dificultad, y podés equivocarte hasta 3 veces: a la cuarta perdés. Si estás a una palabra de un grupo, te avisa.'
    };
  });

  /* ---------------- Solitario ---------------- */
  T.registrar('solitario', () => {
    const carta = (t, rojo) => ({ t, c: 'carta' + (rojo ? ' rojo' : '') });
    const celdas = [
      cel('c0r0', '6♠', 'carta'), cel('c1r0', '5♥', 'carta rojo'), cel('c2r0', '', 'carta dorso'),
      cel('c0r1', '', 'carta hueco', { inerte: true, c: 'vacia' }), cel('c1r1', '', 'vacia', { inerte: true }), cel('c2r1', 'A♣', 'carta')
    ];
    const base = ['♠', '♥', '♦', '♣'].map((s, i) => cel('f' + i, s, 'carta hueco', { inerte: true }));
    const hueco = (e, id) => { e.c(id, 'carta hueco'); e.t(id, ''); e.cel(id).inerte = false; };
    const poner = (e, id, d) => { e.c(id, d.c); e.t(id, d.t); e.cel(id).inerte = false; };
    const vaciar = (e, id) => { e.c(id, 'vacia'); e.t(id, ''); e.cel(id).inerte = true; };
    return {
      grupos: [
        g('base', 4, base, { clase: 'tut-grupo--grande', rotulo: 'Pilas de arriba: de la A a la K, un palo en cada una', etiqueta: 'Pilas' }),
        g('tab', 3, celdas, { clase: 'tut-grupo--grande', rotulo: 'Columnas', etiqueta: 'Columnas' })
      ],
      pasos: [
        { texto: 'Hay que subir todas las cartas a las pilas de arriba, de la A a la K. En las columnas se baja alternando colores: el 5 rojo va sobre el 6 negro. Tocá el 5 de corazones y después el 6 de picas.', pista: 'Primero el 5♥, después el 6♠.', clic: ['c1r0', 'c0r0'],
          tras: (e, i) => { if (i === 0) e.mas('c1r0', 'sel'); else { poner(e, 'c0r1', carta('5♥', true)); hueco(e, 'c1r0'); } },
          bien: 'Quedó una columna vacía.' },
        { texto: 'La A de tréboles va directo a su pila. Tocala una vez para elegirla y otra vez para que suba sola.', pista: 'Tocá la A♣ dos veces.', clic: ['c2r1', 'c2r1'],
          tras: (e, i) => { if (i === 0) e.mas('c2r1', 'sel'); else { vaciar(e, 'c2r1'); e.c('f3', 'carta'); e.t('f3', 'A♣'); } },
          bien: 'La A subió. Debajo había una carta boca abajo.' },
        { texto: 'Las cartas tapadas se dan vuelta al quedar libres. Tocá la carta boca abajo.', pista: 'La carta azul de arriba a la derecha.', clic: ['c2r0'], tras: (e) => poner(e, 'c2r0', carta('K♦', true)) },
        { texto: 'Un rey puede ocupar una columna vacía. Tocá el K y después la columna vacía del medio.', pista: 'Primero el K♦, después el hueco del medio.', clic: ['c2r0', 'c1r0'],
          tras: (e, i) => { if (i === 0) e.mas('c2r0', 'sel'); else { poner(e, 'c1r0', carta('K♦', true)); hueco(e, 'c2r0'); } } }
      ],
      fin: 'Así se mueve todo el solitario. En el juego también podés arrastrar las cartas, elegir robar de a 1 o de a 3, deshacer movimientos y usar Subir todas cuando ya está resuelto.'
    };
  });

  /* ---------------- Flow ---------------- */
  T.registrar('flow', () => {
    const rojo = ['f00', 'f01', 'f02', 'f12', 'f11'];
    const azul = ['f10', 'f20', 'f21', 'f22'];
    const celdas = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const id = 'f' + r + c;
      let t = '', k = 'grande';
      if (id === 'f00' || id === 'f11') { t = '■'; k = 'k1 grande'; }
      if (id === 'f10' || id === 'f22') { t = '■'; k = 'k2 grande'; }
      celdas.push(cel(id, t, k));
    }
    const tramo = (k) => (e, i, id) => { e.c(id, k + ' grande'); };
    return {
      grupos: [g('tab', 3, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Tablero de tuberías' })],
      pasos: [
        { texto: 'Uní cada par de puntos con una tubería y llená todo el tablero. Tocá las casillas en orden (en el juego se arrastra). Rojo: desde arriba a la izquierda, por la fila de arriba, y bajá hasta el punto rojo del centro.', pista: 'Casillas: arriba izquierda, arriba medio, arriba derecha, medio derecha y el punto rojo del centro.',
          clic: rojo, tras: tramo('k1') ,
          bien: 'Unido el rojo. Quedaron casillas libres justo para el otro color.' },
        { texto: 'Ahora el azul: del punto de la izquierda bajá a la esquina y recorré la fila de abajo hasta el otro punto azul.', pista: 'Punto azul de la izquierda, esquina de abajo a la izquierda, abajo en el medio y el punto azul de abajo a la derecha.',
          clic: azul, tras: tramo('k2') }
      ],
      fin: 'Se llenó todo el tablero. Las tuberías no se pueden cruzar: si pasás por encima de otra, la cortás. En el juego hay cinco tamaños, del 5×5 al 9×9, y para sacar un tramo alcanza con volver sobre tu camino o empezar de nuevo desde el punto.'
    };
  });
})(window);
