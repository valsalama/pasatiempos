/* tutoriales-c.js · Mini partidas guiadas de los juegos nuevos
   Mahjong solitario y Criptograma. Se apoya en tutorial.js y css/tutorial.css. */
(function (global) {
  'use strict';
  const T = global.Tutorial;
  if (!T) return;

  const g = (id, cols, celdas, extra) => Object.assign({ id, cols, celdas }, extra || {});
  const cel = (id, t, c, extra) => Object.assign({ id, t: t == null ? '' : String(t), c: c || '' }, extra || {});

  /* ---------------- Mahjong solitario ---------------- */
  T.registrar('mahjong', () => {
    const fichas = [['■', 'k1'], ['▲', 'k2'], ['◆', 'k3'], ['◆', 'k3'], ['▲', 'k2'], ['■', 'k1']];
    const libres = new Set(['m0', 'm5']);
    const celdas = fichas.map((f, i) => cel('m' + i, f[0], f[1] + ' grande' + (libres.has('m' + i) ? '' : ' dim'), { aria: 'Ficha ' + (i + 1) }));
    const quitar = (e, a, b) => {
      [a, b].forEach((id) => { e.c(id, 'vacia'); e.t(id, ''); e.cel(id).inerte = true; });
    };
    const liberar = (e, ids) => ids.forEach((id) => e.menos(id, 'dim'));
    const par = (a, b, abre) => (e, i, id) => {
      if (i === 0) { e.mas(id, 'elegida'); return; }
      e.menos(a, 'elegida'); e.menos(b, 'elegida');
      quitar(e, a, b);
      liberar(e, abre);
    };
    return {
      grupos: [g('tab', 6, celdas, { clase: 'tut-grupo--grande', etiqueta: 'Fila de fichas' })],
      pasos: [
        { texto: 'Hay que sacar las fichas de a pares de fichas iguales. Pero solo se pueden sacar las fichas libres: las de los costados de la fila. Las del medio están apagadas porque están trabadas. Tocá las dos fichas de las puntas, que son iguales.', pista: 'Tocá el cuadrado de la izquierda y el cuadrado de la derecha.', clic: ['m0', 'm5'], tras: par('m0', 'm5', ['m1', 'm4']),
          bien: 'Al sacar las puntas, las fichas que seguían quedaron libres.' },
        { texto: 'Ahora las puntas son los triángulos. Tocá los dos.', pista: 'Los dos triángulos.', clic: ['m1', 'm4'], tras: par('m1', 'm4', ['m2', 'm3']) },
        { texto: 'Quedan los dos rombos, libres los dos. Tocalos.', pista: 'Los dos rombos del medio.', clic: ['m2', 'm3'], tras: par('m2', 'm3', []) }
      ],
      fin: 'Tablero despejado. En el juego las fichas están apiladas en capas: una ficha con otra encima tampoco se puede sacar. Cada ficha es una forma con un color. Si te quedás sin jugadas, el juego mezcla las que quedan, y siempre hay solución. Con Pista te marca una pareja y con Deshacer volvés atrás.'
    };
  });

  /* ---------------- Criptograma ---------------- */
  T.registrar('criptograma', () => {
    const plano = 'EL SOL SALE';
    const mapa = { E: 'Q', L: 'M', S: 'X', O: 'K', A: 'R' };
    const cif = []; const res = [];
    plano.split('').forEach((ch, i) => {
      if (ch === ' ') { cif.push(cel('c' + i, '', 'vacia cifra', { inerte: true })); res.push(cel('a' + i, '', 'vacia res', { inerte: true })); }
      else { cif.push(cel('c' + i, mapa[ch], 'cifra pista')); res.push(cel('a' + i, '', 'res', { inerte: true })); }
    });
    const teclas = ['E', 'L', 'S', 'O', 'A', 'T', 'R', 'N', 'D', 'M'].map((l) => cel('k' + l, l, 'tecla'));
    const donde = (letra) => plano.split('').map((ch, i) => (ch === letra ? i : -1)).filter((i) => i >= 0);
    const ids = (letra) => donde(letra).map((i) => 'c' + i);
    const paso = (letra, texto, pista, bien) => {
      const objetivos = ids(letra);
      return {
        texto, pista, bien,
        clic: [objetivos, 'k' + letra],
        tras: (e, i) => {
          if (i === 0) { objetivos.forEach((id) => e.mas(id, 'sel')); return; }
          donde(letra).forEach((p) => { e.t('a' + p, letra); e.mas('a' + p, 'ok'); e.menos('c' + p, 'sel'); });
        }
      };
    };
    return {
      grupos: [
        g('cif', plano.length, cif, { clase: 'tut-grupo--chico tut-grupo--junto tut-grupo--cifra', rotulo: 'Frase con el código', etiqueta: 'Frase con el código' }),
        g('res', plano.length, res, { clase: 'tut-grupo--chico tut-grupo--junto tut-grupo--cifra', rotulo: 'Lo que vas descubriendo', etiqueta: 'Respuestas' }),
        g('tec', 5, teclas, { clase: 'tut-grupo--chico', rotulo: 'Teclado', etiqueta: 'Teclado' })
      ],
      pasos: [
        paso('E', 'Cada letra de la frase fue cambiada por otra, siempre la misma. Hay que descubrir cuál es cuál. Una palabra de dos letras suele ser EL, LA, UN o DE. Probemos con EL: tocá la Q del código y después la E del teclado.', 'Tocá la primera letra del código (Q) y después la E.', 'La Q es la E en todos los lugares donde aparece.'),
        paso('L', 'Si la primera palabra es EL, la M es la L. Aparece tres veces. Tocá una M y después la L.', 'Tocá cualquier M y después la L.', 'Ahora se lee EL _ _ L _ _ L E.'),
        paso('S', 'La tercera palabra termina en LE y empieza con la X, la misma letra con la que empieza la del medio, que termina en L. Probá con la S: tocá una X y después la S.', 'Tocá cualquier X y después la S.'),
        paso('O', 'La palabra del medio se lee S_L. Puede ser SOL. Tocá la K y después la O.', 'Tocá la K y después la O.', 'EL SOL ya casi está.'),
        paso('A', 'Queda una sola letra sin descubrir: S_LE. Tocá la R y después la A.', 'Tocá la R y después la A.')
      ],
      fin: 'Descifraste "EL SOL SALE". En el juego los refranes son más largos. Una letra no puede estar puesta en dos lugares del código a la vez. Con Revisar ves las que están mal, y con Pista te regalamos una letra. También podés escribir con el teclado de la compu.'
    };
  });
})(window);
