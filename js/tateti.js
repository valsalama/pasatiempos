/* tateti.js · Ta-te-ti contra la compu
   - Tres niveles: Fácil (juega casi al azar), Medio (a veces se equivoca) e Imbatible (nunca pierde).
   - Alternan quién empieza: una partida vos, otra la compu. Vos sos la X.
   - Puntaje: partidas seguidas sin perder (ganar o empatar suma). Al perder se guarda la racha en las mejores marcas. */
(function (global) {
  'use strict';

  const ID = 'tateti';
  const { el, notificar, celebrar } = global.Pasatiempos;

  const NIVELES = {
    facil: { nombre: 'Fácil', error: 0.75 },
    medio: { nombre: 'Medio', error: 0.3 },
    imbatible: { nombre: 'Imbatible', error: 0 }
  };
  const ORDEN = ['facil', 'medio', 'imbatible'];
  const LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  /* ---------------------------------------------------------
     Motor. El tablero es una lista de 9 con '', 'X' u 'O'.
     --------------------------------------------------------- */
  function ganador(t) {
    for (const l of LINEAS) {
      if (t[l[0]] && t[l[0]] === t[l[1]] && t[l[0]] === t[l[2]]) return { quien: t[l[0]], linea: l };
    }
    return t.every(Boolean) ? { quien: 'E', linea: null } : null;
  }

  const libres = (t) => t.map((v, k) => (v ? -1 : k)).filter((k) => k >= 0);

  /* Minimax: puntaje desde el punto de vista de la O (la compu). Prefiere ganar rápido y perder tarde. */
  function minimax(t, turno, prof) {
    const g = ganador(t);
    if (g) return g.quien === 'O' ? 10 - prof : g.quien === 'X' ? prof - 10 : 0;
    let mejor = turno === 'O' ? -Infinity : Infinity;
    for (const k of libres(t)) {
      t[k] = turno;
      const v = minimax(t, turno === 'O' ? 'X' : 'O', prof + 1);
      t[k] = '';
      mejor = turno === 'O' ? Math.max(mejor, v) : Math.min(mejor, v);
    }
    return mejor;
  }

  function mejoresJugadas(t) {
    let mejorV = -Infinity;
    let lista = [];
    for (const k of libres(t)) {
      t[k] = 'O';
      const v = minimax(t, 'X', 1);
      t[k] = '';
      if (v > mejorV) { mejorV = v; lista = [k]; } else if (v === mejorV) lista.push(k);
    }
    return lista;
  }

  /* Jugada al azar que no sea una trampa evidente: la compu a veces "no ve" */
  function jugadaCompu(t, nivel) {
    const libre = libres(t);
    const err = NIVELES[nivel].error;
    if (Math.random() < err) return libre[Math.floor(Math.random() * libre.length)];
    const buenas = mejoresJugadas(t);
    return buenas[Math.floor(Math.random() * buenas.length)];
  }

  function crear(contenedor) {
    let nivel = 'medio';
    let t = new Array(9).fill('');
    let turno = 'X';
    let empiezaCompu = false;
    let fase = 'jugando'; // 'jugando' | 'fin'
    let racha = 0;
    let ganadas = 0, empatadas = 0, perdidas = 0;
    let celdasEl = [];
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valRacha = el('span', { clase: 'dato__valor', texto: '0' });
    const valMejor = el('span', { clase: 'dato__valor', texto: '0' });
    const valCuenta = el('span', { clase: 'dato__valor', texto: '0-0-0' });

    const botonesNivel = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Nivel' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: NIVELES[id].nombre, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => cambiarNivel(id));
      botonesNivel[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Otra partida', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => nueva(true));

    const tablero = el('div', { clase: 'ttt__tablero', attrs: { role: 'group', 'aria-label': 'Tablero de ta-te-ti' } });
    for (let k = 0; k < 9; k++) {
      const c = el('button', { clase: 'ttt__celda', attrs: { type: 'button', 'data-k': String(k) } });
      c.addEventListener('click', () => jugar(k));
      celdasEl.push(c);
      tablero.append(c);
    }
    const estado = el('p', { clase: 'ttt__estado', attrs: { role: 'status' } });

    const raiz = el('div', { clase: 'jg ttt' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Racha' }), valRacha),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Mejor' }), valMejor),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'G-E-P' }), valCuenta))),
      el('div', { clase: 'ttt__marco' }, tablero),
      estado,
      el('p', { clase: 'jg__ayuda', texto: 'Vos sos la X. Ganar o empatar suma a tu racha; perder la corta y se guarda en las mejores marcas. G-E-P: ganadas, empatadas y perdidas de esta sesión.' })
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function nombreCelda(k) {
      const v = t[k];
      return 'Fila ' + (Math.floor(k / 3) + 1) + ', columna ' + ((k % 3) + 1) + ', ' + (v === 'X' ? 'tu X' : v === 'O' ? 'O de la compu' : 'libre');
    }

    function pintar(linea) {
      t.forEach((v, k) => {
        const c = celdasEl[k];
        c.textContent = v;
        c.classList.toggle('x', v === 'X');
        c.classList.toggle('o', v === 'O');
        c.classList.toggle('gana', !!(linea && linea.includes(k)));
        c.disabled = !!v || fase !== 'jugando' || turno !== 'X';
        c.setAttribute('aria-label', nombreCelda(k));
      });
      ORDEN.forEach((id) => botonesNivel[id].setAttribute('aria-pressed', String(id === nivel)));
      valRacha.textContent = String(racha);
      const mejor = Records.mejor(ID, nivel);
      valMejor.textContent = String(Math.max(mejor || 0, racha));
      valCuenta.textContent = ganadas + '-' + empatadas + '-' + perdidas;
    }

    function mensaje(texto) { estado.textContent = texto; }

    /* --- Partidas --- */
    function nueva(alternar) {
      if (alternar) empiezaCompu = !empiezaCompu;
      t = new Array(9).fill('');
      fase = 'jugando';
      turno = empiezaCompu ? 'O' : 'X';
      pintar();
      if (turno === 'O') {
        mensaje('Empieza la compu.');
        despues(jugarCompu, 550);
      } else {
        mensaje('Empezás vos. Elegí un casillero.');
      }
    }

    function cambiarNivel(id) {
      if (id === nivel) return;
      guardarRacha();
      nivel = id;
      racha = 0;
      Almacen.escribir('tateti:nivel', id);
      empiezaCompu = true; // al reiniciar, empieza vos
      nueva(true);
    }

    /* La racha se guarda en las mejores marcas cuando termina (por derrota, cambio de nivel o al salir) */
    function guardarRacha() {
      if (racha > 0) Records.agregar(ID, nivel, racha, { modo: 'mayor' });
      racha = 0;
    }

    function jugar(k) {
      if (fase !== 'jugando' || turno !== 'X' || t[k]) return;
      t[k] = 'X';
      if (terminar()) return;
      turno = 'O';
      pintar();
      mensaje('Piensa la compu…');
      despues(jugarCompu, 450);
    }

    function jugarCompu() {
      if (fase !== 'jugando' || turno !== 'O') return;
      const k = jugadaCompu(t, nivel);
      t[k] = 'O';
      if (terminar()) return;
      turno = 'X';
      pintar();
      mensaje('Tu turno.');
    }

    function terminar() {
      const g = ganador(t);
      if (!g) return false;
      fase = 'fin';
      pintar(g.linea);
      let titulo, texto, detalle = '';
      if (g.quien === 'X') {
        ganadas++; racha++;
        titulo = 'Ganaste'; texto = 'Tres en línea. Racha: ' + racha + '.';
      } else if (g.quien === 'E') {
        empatadas++; racha++;
        titulo = 'Empate'; texto = 'Tablero lleno. La racha sigue: ' + racha + '.';
      } else {
        perdidas++;
        const corta = racha;
        if (corta > 0) {
          const r = Records.agregar(ID, nivel, corta, { modo: 'mayor' });
          detalle = r.esRecord ? 'Tu racha de ' + corta + ' es la mejor en el nivel ' + NIVELES[nivel].nombre.toLowerCase() + '.' : 'Tu racha de ' + corta + ' quedó guardada.';
        }
        racha = 0;
        titulo = 'Ganó la compu'; texto = 'Esta vez no se pudo.';
      }
      pintar(g.linea);
      mensaje(titulo + '. ' + texto);
      // Solo se abre un cartel cuando importa: una racha que se corta o una racha de 5, 10, 15…
      despues(() => {
        if (g.quien === 'O' && detalle) {
          celebrar({ titulo, mensaje: texto, detalle, confeti: false, botones: [{ texto: 'Otra partida', primario: true, alClick: () => nueva(true) }, { texto: 'Cerrar' }] });
        } else if (g.quien !== 'O' && racha % 5 === 0) {
          celebrar({ titulo: 'Racha de ' + racha, mensaje: 'Llevás ' + racha + ' partidas seguidas sin perder.', botones: [{ texto: 'Seguir', primario: true, alClick: () => nueva(true) }] });
        }
      }, 650);
      return true;
    }

    /* --- Inicio --- */
    const ultimo = Almacen.leer('tateti:nivel', 'medio');
    nivel = NIVELES[ultimo] ? ultimo : 'medio';
    empiezaCompu = true;
    nueva(true);

    return {
      pruebas: {
        jugar, jugarCompu,
        poner(lista) { t = lista.slice(); fase = 'jugando'; turno = 'X'; pintar(); },
        estado: () => ({ t: t.slice(), fase, turno, racha, nivel })
      },
      destruir() {
        destruido = true;
        temporizadores.forEach((id) => clearTimeout(id));
        temporizadores.clear();
        guardarRacha();
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
  global.TatetiMotor = { ganador, mejoresJugadas, jugadaCompu };
})(window);
