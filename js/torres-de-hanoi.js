/* torres-de-hanoi.js · Torres de Hanoi
   - Hay que pasar todos los discos de la primera torre a otra, de a uno por vez y sin apoyar un disco grande sobre uno más chico.
   - De 3 a 8 discos. Con n discos, lo mínimo posible es 2^n − 1 movimientos.
   - Tocá una torre para levantar su disco de arriba y después la torre de destino (o usá las teclas 1, 2 y 3).
   - Cronómetro (arranca con el primer movimiento), movimientos, guardado automático y mejores marcas por cantidad de discos. */
(function (global) {
  'use strict';

  const ID = 'torres-de-hanoi';
  const { el, notificar, celebrar } = global.Pasatiempos;

  const ORDEN = ['3', '4', '5', '6', '7', '8'];
  const minimo = (n) => Math.pow(2, n) - 1;

  /* Una torre es una lista de tamaños de disco, de abajo hacia arriba. Los discos van de 1 (el más chico) a n. */
  function inicial(n) {
    const base = [];
    for (let d = n; d >= 1; d--) base.push(d);
    return [base, [], []];
  }

  function valido(torres, n) {
    if (!Array.isArray(torres) || torres.length !== 3) return false;
    const vistos = new Set();
    for (const torre of torres) {
      if (!Array.isArray(torre)) return false;
      for (let i = 0; i < torre.length; i++) {
        const d = torre[i];
        if (!Number.isInteger(d) || d < 1 || d > n || vistos.has(d)) return false;
        if (i > 0 && torre[i - 1] < d) return false;
        vistos.add(d);
      }
    }
    return vistos.size === n;
  }

  function puedeMover(torres, de, a) {
    if (de === a || !torres[de].length) return false;
    const disco = torres[de][torres[de].length - 1];
    const destino = torres[a];
    return !destino.length || destino[destino.length - 1] > disco;
  }

  function crear(contenedor) {
    let n = 4;
    let torres = inicial(4);
    let mov = 0;
    let elegida = -1;
    let fase = 'listo'; // 'listo' | 'jugando' | 'ganado'
    let destruido = false;
    const temporizadores = new Set();

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const valMov = el('span', { clase: 'dato__valor', texto: '0' });
    const valMin = el('span', { clase: 'dato__valor', texto: '15' });
    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });

    const botonesN = {};
    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': 'Cantidad de discos' } });
    ORDEN.forEach((id) => {
      const b = el('button', { texto: id + ' discos', attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(Number(id)));
      botonesN[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(n));

    let suprimirClick = false;
    const escena = el('div', { clase: 'han__escena' });
    const torresEl = [0, 1, 2].map((k) => {
      const b = el('button', { clase: 'han__torre', attrs: { type: 'button', 'data-torre': String(k) } });
      b.addEventListener('click', () => { if (suprimirClick) { suprimirClick = false; return; } tocar(k); });
      activarArrastre(b, k);
      escena.append(b);
      return b;
    });

    const raiz = el('div', { clase: 'jg han' },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' },
        el('div', { clase: 'datos' },
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Movimientos' }), valMov),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Mínimo' }), valMin),
          el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj))),
      el('div', { clase: 'han__marco' }, escena)
    );
    contenedor.append(raiz);

    /* --- Dibujo --- */
    function etiquetaTorre(k) {
      const t = torres[k];
      const base = 'Torre ' + (k + 1) + ', ' + (t.length === 0 ? 'vacía' : t.length + (t.length === 1 ? ' disco' : ' discos') + ', el de arriba es el ' + t[t.length - 1]);
      return base + (elegida === k ? ', levantada' : '');
    }

    function pintar() {
      torres.forEach((torre, k) => {
        const b = torresEl[k];
        b.replaceChildren(el('span', { clase: 'han__varilla', attrs: { 'aria-hidden': 'true' } }));
        const pila = el('span', { clase: 'han__pila', attrs: { 'aria-hidden': 'true' } });
        torre.forEach((d, i) => {
          const disco = el('span', { clase: 'han__disco' + (elegida === k && i === torre.length - 1 ? ' levantado' : '') });
          disco.style.setProperty('--w', String(Math.round(26 + (74 * d) / n)));
          disco.style.setProperty('--dc', 'var(--pal-' + (((d - 1) % 9) + 1) + ')');
          pila.append(disco);
        });
        b.append(pila);
        b.classList.toggle('elegida', elegida === k);
        b.setAttribute('aria-label', etiquetaTorre(k));
      });
      ORDEN.forEach((id) => botonesN[id].setAttribute('aria-pressed', String(Number(id) === n)));
      valMov.textContent = String(mov);
      valMin.textContent = String(minimo(n));
      escena.style.setProperty('--alto', String(n));
    }

    /* --- Guardado --- */
    function serializar() {
      if (fase !== 'jugando') return null;
      return { n, torres: torres.map((t) => t.join(',')).join('|'), mov, ms: Math.round(crono.transcurrido) };
    }
    function guardarYa() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    /* --- Partidas --- */
    function nueva(cant) {
      n = cant;
      torres = inicial(n);
      mov = 0;
      elegida = -1;
      fase = 'listo';
      Guardado.borrar(ID);
      Almacen.escribir('torres-de-hanoi:discos', n);
      crono.reiniciar(0);
      pintar();
    }

    function pedirNueva(cant) {
      if (fase === 'jugando' && mov > 0 && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nueva(cant);
    }

    function cargar(s, lista) {
      n = s.n;
      torres = lista;
      mov = Number(s.mov) || 0;
      elegida = -1;
      fase = 'jugando';
      pintar();
      crono.reiniciar(s.ms);
      crono.iniciar();
    }

    /* --- Jugada --- */
    function tocar(k) {
      if (fase === 'ganado') return;
      if (elegida === -1) {
        if (!torres[k].length) { notificar('Esa torre está vacía.'); return; }
        elegida = k;
        pintar();
        return;
      }
      if (elegida === k) { elegida = -1; pintar(); return; }
      const de = elegida;
      if (!puedeMover(torres, de, k)) {
        // Un disco grande no se apoya sobre uno chico: se baja el disco y se avisa
        const b = torresEl[k];
        b.classList.remove('choque');
        void b.offsetWidth;
        b.classList.add('choque');
        despues(() => b.classList.remove('choque'), 300);
        notificar('No se puede apoyar un disco grande sobre uno más chico.');
        elegida = -1;
        pintar();
        return;
      }
      torres[k].push(torres[de].pop());
      elegida = -1;
      mov++;
      if (fase === 'listo') { fase = 'jugando'; crono.iniciar(); }
      pintar();
      if (torres[0].length === 0 && (torres[1].length === n || torres[2].length === n)) ganar();
      else guardarYa();
    }

    function ganar() {
      fase = 'ganado';
      const ms = Math.round(crono.detener());
      Guardado.borrar(ID);
      const r = Records.agregar(ID, String(n), ms, { modo: 'menor' });
      let detalle;
      if (r.esRecord) detalle = 'Nueva mejor marca con ' + n + ' discos';
      else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
      else detalle = 'Tu mejor marca con ' + n + ' discos es ' + Cronometro.formatear(Records.mejor(ID, String(n))) + '.';
      const perfecto = mov === minimo(n);
      despues(() => celebrar({
        titulo: 'Torre completa',
        mensaje: n + ' discos en ' + Cronometro.formatear(ms) + ' y ' + mov + ' movimientos' + (perfecto ? ', el mínimo posible.' : ' (lo mínimo es ' + minimo(n) + ').'),
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nueva(n) },
          { texto: 'Cerrar' }
        ]
      }), 350);
    }

    /* --- Arrastre: se agarra el disco de arriba y se lo desliza hasta otra torre --- */
    function torreBajo(x) {
      let mejor = -1; let dist = Infinity;
      torresEl.forEach((t, k) => {
        const r = t.getBoundingClientRect();
        const d = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
        if (d < dist) { dist = d; mejor = k; }
      });
      return mejor;
    }
    function activarArrastre(boton, k) {
      let est = null;
      boton.addEventListener('pointerdown', (ev) => {
        if (fase === 'ganado' || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
        const disco = ev.target.closest ? ev.target.closest('.han__disco') : null;
        if (!disco || !torres[k].length) return;
        const arriba = boton.querySelector('.han__pila').lastElementChild;
        if (disco !== arriba) return;
        est = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, mov: false, disco };
      });
      boton.addEventListener('pointermove', (ev) => {
        if (!est || ev.pointerId !== est.id) return;
        const dx = ev.clientX - est.x0; const dy = ev.clientY - est.y0;
        if (!est.mov) {
          if (Math.hypot(dx, dy) < 7) return;
          est.mov = true;
          try { boton.setPointerCapture(est.id); } catch (e) { /* sin captura */ }
          est.disco.classList.add('arrastrado');
          boton.classList.add('arrastrando');
        }
        est.disco.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        const o = torreBajo(ev.clientX);
        torresEl.forEach((t, q) => t.classList.toggle('objetivo', q === o && q !== k));
      });
      const soltar = (ev, cancelado) => {
        if (!est || ev.pointerId !== est.id) return;
        const e = est; est = null;
        if (!e.mov) return;
        try { boton.releasePointerCapture(e.id); } catch (err) { /* ya soltado */ }
        suprimirClick = true;
        despues(() => { suprimirClick = false; }, 60);
        torresEl.forEach((t) => t.classList.remove('objetivo', 'arrastrando'));
        e.disco.classList.remove('arrastrado');
        e.disco.style.transform = '';
        const destino = cancelado ? k : torreBajo(ev.clientX);
        if (destino === k || destino < 0) { elegida = -1; pintar(); return; }
        elegida = k;
        tocar(destino);
      };
      boton.addEventListener('pointerup', (ev) => soltar(ev, false));
      boton.addEventListener('pointercancel', (ev) => soltar(ev, true));
    }

    /* --- Entrada --- */
    function alTecla(ev) {
      if (document.querySelector('dialog[open]')) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (ev.key !== '1' && ev.key !== '2' && ev.key !== '3') return;
      const o = ev.target;
      if (o && (o.tagName === 'INPUT' || o.tagName === 'SELECT' || o.tagName === 'TEXTAREA')) return;
      ev.preventDefault();
      tocar(Number(ev.key) - 1);
    }
    document.addEventListener('keydown', alTecla);

    /* --- Inicio --- */
    const guardado = Guardado.cargar(ID);
    let listaGuardada = null;
    if (guardado && ORDEN.includes(String(guardado.n)) && typeof guardado.torres === 'string') {
      listaGuardada = guardado.torres.split('|').map((t) => (t === '' ? [] : t.split(',').map(Number)));
    }
    if (listaGuardada && valido(listaGuardada, guardado.n) && listaGuardada[1].length !== guardado.n && listaGuardada[2].length !== guardado.n) {
      cargar(guardado, listaGuardada);
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ultimo = String(Almacen.leer('torres-de-hanoi:discos', 4));
      nueva(ORDEN.includes(ultimo) ? Number(ultimo) : 4);
    }

    return {
      pruebas: { tocar, estado: () => torres.map((t) => t.slice()) },
      destruir() {
        destruido = true;
        document.removeEventListener('keydown', alTecla);
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
