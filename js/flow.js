/* flow.js · Etapa 10: Flow (tuberías)
   - Hay puntos de colores de a pares. Unilos con una tubería del mismo color y llená TODAS las casillas.
   - Las tuberías no se pueden cruzar: si pasás por encima de otra, la cortás.
   - Arrastrá desde un punto (con el dedo o el mouse). Para sacar un tramo, volvé sobre tu camino o empezá de nuevo desde el punto.
   - Cinco tamaños, del 5×5 al 9×9. Los tableros se arman al azar y siempre tienen solución.
   - Cronómetro (arranca con la primera tubería), movimientos, guardado automático y mejores marcas por tamaño. */
(function (global) {
  'use strict';

  const ID = 'flow';
  const { el, notificar, celebrar } = global.Pasatiempos;
  const NS = 'http://www.w3.org/2000/svg';

  const ORDEN = ['5', '6', '7', '8', '9'];
  const NOMBRES = { 5: 'Chico', 6: 'Mediano', 7: 'Grande', 8: 'Muy grande', 9: 'Enorme' };
  // Los colores salen de la paleta del estilo elegido (--pal-1 a --pal-9 en estilos.css)
  const COLORES = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({ n: 'color ' + i, c: 'var(--pal-' + i + ')' }));

  /* ---------------------------------------------------------
     Generador: se parte de cada casilla sola y se van uniendo puntas vecinas
     hasta quedar `k` caminos. Los extremos de cada camino son los puntos de color.
     --------------------------------------------------------- */
  function vecinos(k, n) {
    const f = Math.floor(k / n), c = k % n, r = [];
    if (f > 0) r.push(k - n);
    if (f < n - 1) r.push(k + n);
    if (c > 0) r.push(k - 1);
    if (c < n - 1) r.push(k + 1);
    return r;
  }

  function generar(n) {
    const k = n;                        // cantidad de colores
    for (let intento = 0; intento < 400; intento++) {
      let caminos = [];
      for (let i = 0; i < n * n; i++) caminos.push([i]);
      let dueno = new Array(n * n);     // índice de camino de cada casilla
      caminos.forEach((c, i) => { dueno[c[0]] = i; });
      let atascado = false;
      while (caminos.filter((c) => c).length > k) {
        const cand = [];
        caminos.forEach((c, i) => {
          if (!c) return;
          const puntas = c.length === 1 ? [c[0]] : [c[0], c[c.length - 1]];
          puntas.forEach((p) => {
            vecinos(p, n).forEach((q) => {
              const j = dueno[q];
              if (j === i || !caminos[j]) return;
              const d = caminos[j];
              const esPunta = d[0] === q || d[d.length - 1] === q;
              if (!esPunta) return;
              if (i < j) cand.push({ i, j, p, q, peso: 1 / Math.pow(c.length + d.length, 2) });
            });
          });
        });
        if (!cand.length) { atascado = true; break; }
        let tot = 0;
        cand.forEach((x) => { tot += x.peso; });
        let r = Math.random() * tot;
        let eleg = cand[cand.length - 1];
        for (const x of cand) { r -= x.peso; if (r <= 0) { eleg = x; break; } }
        let a = caminos[eleg.i].slice();
        let b = caminos[eleg.j].slice();
        if (a[a.length - 1] !== eleg.p) a.reverse();   // a termina en p
        if (b[0] !== eleg.q) b.reverse();              // b empieza en q
        const unido = a.concat(b);
        caminos[eleg.i] = unido;
        caminos[eleg.j] = null;
        unido.forEach((cel) => { dueno[cel] = eleg.i; });
      }
      if (atascado) continue;
      caminos = caminos.filter((c) => c);
      if (caminos.some((c) => c.length < 3)) continue;
      // Que ningún par de puntas quede pegado (sería trivial)
      if (caminos.some((c) => vecinos(c[0], n).includes(c[c.length - 1]))) continue;
      // Mezclar el orden de los colores
      for (let i = caminos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [caminos[i], caminos[j]] = [caminos[j], caminos[i]];
      }
      return { n, puntos: caminos.map((c) => [c[0], c[c.length - 1]]), solucion: caminos };
    }
    return null;
  }

  function crear(contenedor) {
    let n = 6;
    let puntos = [];          // [[a, b], ...] por color
    let solucion = [];
    let caminos = [];         // por color: lista de casillas desde un punto
    let dueno = [];           // casilla -> color o -1
    let mov = 0;
    let fase = 'listo';       // 'listo' | 'jugando' | 'ganado'
    let dibujando = -1;       // color que se está arrastrando
    let cambio = false;       // se modificó algo durante el arrastre
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const valTubos = el('span', { clase: 'dato__valor', texto: '0 / 0' });
    const valLleno = el('span', { clase: 'dato__valor', texto: '0%' });
    const valMov = el('span', { clase: 'dato__valor', texto: '0' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    const botonesN = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Tamaño' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: id + '×' + id, attrs: { type: 'button', 'aria-pressed': 'false', 'aria-label': NOMBRES[id] + ', ' + id + ' por ' + id } });
      b.addEventListener('click', () => pedirNueva(Number(id)));
      botonesN[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(n));
    const btnLimpiar = el('button', { clase: 'btn', texto: 'Empezar de nuevo', attrs: { type: 'button' } });
    btnLimpiar.addEventListener('click', limpiar);

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'fl__svg');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Tablero de Flow. Arrastrá entre los puntos del mismo color.');
    const marco = el('div', { clase: 'fl__marco' });
    marco.append(svg);

    const raiz = el('div', { clase: 'jg fl' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tubos' }), valTubos),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Lleno' }), valLleno),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Movimientos' }), valMov),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj)),
        btnLimpiar),
      marco,
      el('p', { clase: 'jg__ayuda', texto: 'Unila de a dos los puntos del mismo color arrastrando el dedo o el mouse, y llená todas las casillas. Las tuberías no se cruzan: si pasás por encima de otra, la cortás. Para borrar un tramo, volvé sobre tu camino.' })
    );
    contenedor.append(raiz);

    /* --- Estado derivado --- */
    function recalcular() {
      dueno = new Array(n * n).fill(-1);
      caminos.forEach((c, i) => c.forEach((k) => { dueno[k] = i; }));
    }
    const esPunto = (k) => {
      for (let i = 0; i < puntos.length; i++) if (puntos[i][0] === k || puntos[i][1] === k) return i;
      return -1;
    };
    const completo = (i) => {
      const c = caminos[i];
      return c.length >= 2 && ((c[0] === puntos[i][0] && c[c.length - 1] === puntos[i][1]) || (c[0] === puntos[i][1] && c[c.length - 1] === puntos[i][0]));
    };

    function estado() {
      let hechos = 0;
      for (let i = 0; i < puntos.length; i++) if (completo(i)) hechos++;
      const llenas = dueno.filter((d) => d >= 0).length;
      return { hechos, llenas };
    }

    /* --- Dibujo --- */
    function pintar() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute('viewBox', '0 0 ' + n * 100 + ' ' + n * 100);
      const fondo = document.createElementNS(NS, 'g');
      fondo.setAttribute('class', 'fl__grilla');
      for (let k = 0; k < n * n; k++) {
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', String((k % n) * 100));
        r.setAttribute('y', String(Math.floor(k / n) * 100));
        r.setAttribute('width', '100');
        r.setAttribute('height', '100');
        if (dueno[k] >= 0) {
          r.setAttribute('class', 'fl__casilla llena');
          r.style.setProperty('fill', COLORES[dueno[k]].c);
          r.setAttribute('fill-opacity', '0.22');
        } else r.setAttribute('class', 'fl__casilla');
        fondo.append(r);
      }
      svg.append(fondo);
      const tubos = document.createElementNS(NS, 'g');
      caminos.forEach((c, i) => {
        if (c.length < 2) return;
        const p = document.createElementNS(NS, 'polyline');
        p.setAttribute('points', c.map((k) => ((k % n) * 100 + 50) + ',' + (Math.floor(k / n) * 100 + 50)).join(' '));
        p.setAttribute('fill', 'none');
        p.style.setProperty('stroke', COLORES[i].c);
        p.setAttribute('stroke-width', '38');
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
        p.setAttribute('class', 'fl__tubo');
        tubos.append(p);
      });
      svg.append(tubos);
      const bolas = document.createElementNS(NS, 'g');
      puntos.forEach((par, i) => {
        par.forEach((k) => {
          const c = document.createElementNS(NS, 'circle');
          c.setAttribute('cx', String((k % n) * 100 + 50));
          c.setAttribute('cy', String(Math.floor(k / n) * 100 + 50));
          c.setAttribute('r', '31');
          c.style.setProperty('fill', COLORES[i].c);
          c.setAttribute('class', 'fl__punto');
          bolas.append(c);
        });
      });
      svg.append(bolas);
      const e = estado();
      valTubos.textContent = e.hechos + ' / ' + puntos.length;
      valLleno.textContent = Math.round((e.llenas * 100) / (n * n)) + '%';
      valMov.textContent = String(mov);
      ORDEN.forEach((id) => botonesN[id].setAttribute('aria-pressed', String(Number(id) === n)));
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return { n, puntos, solucion: solucion.map((c) => c.join(',')), caminos: caminos.map((c) => c.join(',')), mov, ms: Math.round(crono.transcurrido) };
    }
    function guardarYa() {
      const x = serializar();
      if (x) Guardado.guardar(ID, x);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    const lista = (txt) => (txt === '' ? [] : txt.split(',').map(Number));
    function validoGuardado(g) {
      if (!g || !ORDEN.includes(String(g.n)) || !Array.isArray(g.puntos) || g.puntos.length !== Number(g.n)) return false;
      const N = g.n * g.n;
      const vistos = new Set();
      for (const p of g.puntos) {
        if (!Array.isArray(p) || p.length !== 2) return false;
        for (const k of p) { if (!Number.isInteger(k) || k < 0 || k >= N || vistos.has(k)) return false; vistos.add(k); }
      }
      if (!Array.isArray(g.caminos) || g.caminos.length !== g.puntos.length || !Array.isArray(g.solucion) || g.solucion.length !== g.puntos.length) return false;
      const usadas = new Set();
      for (let i = 0; i < g.caminos.length; i++) {
        if (typeof g.caminos[i] !== 'string') return false;
        const c = lista(g.caminos[i]);
        if (c.length && c[0] !== g.puntos[i][0] && c[0] !== g.puntos[i][1]) return false;
        for (let j = 0; j < c.length; j++) {
          if (!Number.isInteger(c[j]) || c[j] < 0 || c[j] >= N || usadas.has(c[j])) return false;
          usadas.add(c[j]);
          if (j > 0 && !vecinos(c[j - 1], g.n).includes(c[j])) return false;
        }
      }
      return true;
    }

    /* --- Partidas --- */
    function iniciarCaminos() {
      caminos = puntos.map(() => []);
      recalcular();
    }

    function nueva(tam) {
      n = tam;
      const p = generar(n);
      puntos = p.puntos;
      solucion = p.solucion;
      iniciarCaminos();
      mov = 0;
      fase = 'listo';
      dibujando = -1;
      Guardado.borrar(ID);
      Almacen.escribir('flow:tamano', n);
      crono.reiniciar(0);
      pintar();
    }

    function pedirNueva(tam) {
      if (fase === 'jugando' && mov > 0 && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(tam);
    }

    function limpiar() {
      if (fase === 'ganado') return;
      iniciarCaminos();
      dibujando = -1;
      pintar();
      guardarYa();
    }

    function cargar(g) {
      n = g.n;
      puntos = g.puntos.map((p) => p.slice());
      solucion = g.solucion.map(lista);
      caminos = g.caminos.map(lista);
      recalcular();
      mov = Number(g.mov) || 0;
      fase = 'jugando';
      dibujando = -1;
      pintar();
      crono.reiniciar(g.ms);
      crono.iniciar();
    }

    /* --- Dibujar tuberías --- */
    function empezarEn(k) {
      if (fase === 'ganado') return false;
      let i = esPunto(k);
      if (i >= 0) {
        // Desde un punto: se empieza de cero ahí
        caminos[i] = [k];
      } else if (dueno[k] >= 0) {
        // Sobre una tubería: se sigue desde esa casilla (se corta lo que sigue)
        i = dueno[k];
        const idx = caminos[i].indexOf(k);
        caminos[i] = caminos[i].slice(0, idx + 1);
      } else {
        return false;
      }
      dibujando = i;
      cambio = true;
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
      recalcular();
      pintar();
      return true;
    }

    function paso(k) {
      const i = dibujando;
      const c = caminos[i];
      const ult = c[c.length - 1];
      if (k === ult) return true;
      if (c.length >= 2 && k === c[c.length - 2]) { c.pop(); recalcular(); cambio = true; return true; }
      const pos = c.indexOf(k);
      if (pos >= 0) { caminos[i] = c.slice(0, pos + 1); recalcular(); cambio = true; return true; }
      const pt = esPunto(k);
      if (pt >= 0 && pt !== i) return false;     // no se pasa por encima de otro punto
      if (completo(i)) return false;             // ya está unido: no se sigue
      const otro = dueno[k];
      if (otro >= 0 && otro !== i) {
        const idx = caminos[otro].indexOf(k);
        caminos[otro] = caminos[otro].slice(0, idx);
      }
      c.push(k);
      recalcular();
      cambio = true;
      return true;
    }

    function hacia(k) {
      if (dibujando < 0) return;
      let guardia = 0;
      while (guardia++ < 20) {
        const c = caminos[dibujando];
        const actual = c[c.length - 1];
        if (actual === k) break;
        const fa = Math.floor(actual / n), ca = actual % n, fb = Math.floor(k / n), cb = k % n;
        let sig;
        if (Math.abs(fb - fa) >= Math.abs(cb - ca)) sig = actual + (fb > fa ? n : -n);
        else sig = actual + (cb > ca ? 1 : -1);
        if (!paso(sig)) break;
      }
      pintar();
    }

    function soltar() {
      if (dibujando < 0) return;
      dibujando = -1;
      if (cambio) { mov++; cambio = false; }
      pintar();
      const e = estado();
      if (e.hechos === puntos.length && e.llenas === n * n) ganar();
      else guardarYa();
    }

    function ganar() {
      fase = 'ganado';
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      const r = Records.agregar(ID, String(n), ms, { modo: 'menor' });
      let detalle;
      if (r.esRecord) detalle = 'Nueva mejor marca en ' + n + '×' + n;
      else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
      else detalle = 'Tu mejor marca en ' + n + '×' + n + ' es ' + Cronometro.formatear(Records.mejor(ID, String(n))) + '.';
      despues(() => celebrar({
        titulo: 'Todo conectado',
        mensaje: 'Tablero de ' + n + '×' + n + ' resuelto en ' + Cronometro.formatear(ms) + ' y ' + mov + ' movimientos.',
        detalle,
        botones: [{ texto: 'Nuevo juego', primario: true, alClick: () => nueva(n) }, { texto: 'Cerrar' }]
      }), 300);
    }

    /* --- Entrada con puntero --- */
    function casillaDe(ev) {
      const r = svg.getBoundingClientRect();
      if (!r.width) return -1;
      const x = Math.floor(((ev.clientX - r.left) / r.width) * n);
      const y = Math.floor(((ev.clientY - r.top) / r.height) * n);
      if (x < 0 || y < 0 || x >= n || y >= n) return -1;
      return y * n + x;
    }
    svg.addEventListener('pointerdown', (ev) => {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      const k = casillaDe(ev);
      if (k < 0) return;
      if (empezarEn(k)) {
        ev.preventDefault();
        if (svg.setPointerCapture) { try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* sin captura */ } }
      }
    });
    svg.addEventListener('pointermove', (ev) => {
      if (dibujando < 0) return;
      const k = casillaDe(ev);
      if (k >= 0) hacia(k);
    });
    svg.addEventListener('pointerup', soltar);
    svg.addEventListener('pointercancel', soltar);

    /* --- Arranque --- */
    const guardado = Guardado.cargar(ID);
    if (validoGuardado(guardado)) {
      cargar(guardado);
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ult = String(Almacen.leer('flow:tamano', 6));
      nueva(ORDEN.includes(ult) ? Number(ult) : 6);
    }

    return {
      pruebas: {
        solucion: () => solucion.map((c) => c.slice()),
        estado: () => ({ n, caminos: caminos.map((c) => c.slice()), fase, mov, puntos }),
        arrastrar(camino) { empezarEn(camino[0]); camino.slice(1).forEach((k) => hacia(k)); soltar(); }
      },
      destruir() {
        destruido = true;
        temporizadores.forEach((id) => clearTimeout(id));
        temporizadores.clear();
        auto.detener(true);
        crono.destruir();
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
})(window);
