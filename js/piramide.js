/* piramide.js · Pirámide matemática
   Cada casilla es la suma de las dos que tiene debajo. Algunas vienen dadas;
   completá el resto. Siempre se resuelve con sumas y restas, sin adivinar. */
(function (global) {
  'use strict';

  const ID = 'piramide';
  const NIVELES = {
    facil: { nombre: 'Fácil', filas: 4, max: 9, dadas: 0.6 },
    medio: { nombre: 'Medio', filas: 5, max: 12, dadas: 0.45 },
    dificil: { nombre: 'Difícil', filas: 6, max: 15, dadas: 0.34 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];

  /* ---------- Lógica pura ----------
     La pirámide se guarda como arreglo plano por filas: fila r (0 arriba) tiene r+1 casillas. */
  const inicioFila = (r) => (r * (r + 1)) / 2;
  const pos = (r, i) => inicioFila(r) + i;
  const total = (filas) => (filas * (filas + 1)) / 2;

  function azarEntre(a, b, rnd) { return a + Math.floor(rnd() * (b - a + 1)); }

  function armar(filas, max, rnd) {
    const v = new Array(total(filas)).fill(0);
    for (let i = 0; i < filas; i++) v[pos(filas - 1, i)] = azarEntre(1, max, rnd);
    for (let r = filas - 2; r >= 0; r--) for (let i = 0; i <= r; i++) v[pos(r, i)] = v[pos(r + 1, i)] + v[pos(r + 1, i + 1)];
    return v;
  }

  /* Completa por propagación lo que se pueda; devuelve el arreglo (null donde no se sabe) */
  function propagar(filas, dadas) {
    const v = dadas.slice();
    let cambio = true;
    while (cambio) {
      cambio = false;
      for (let r = 0; r < filas - 1; r++) {
        for (let i = 0; i <= r; i++) {
          const p = pos(r, i); const a = pos(r + 1, i); const b = pos(r + 1, i + 1);
          if (v[p] != null && v[a] != null && v[b] == null) { v[b] = v[p] - v[a]; cambio = true; }
          else if (v[p] != null && v[b] != null && v[a] == null) { v[a] = v[p] - v[b]; cambio = true; }
          else if (v[a] != null && v[b] != null && v[p] == null) { v[p] = v[a] + v[b]; cambio = true; }
        }
      }
    }
    return v;
  }
  const resuelta = (filas, dadas) => propagar(filas, dadas).every((x) => x != null);

  /* Devuelve { sol, dada } donde dada[i] indica si la casilla viene dada */
  function generar(nivel, rnd = Math.random) {
    const cfg = NIVELES[nivel];
    const sol = armar(cfg.filas, cfg.max, rnd);
    const n = sol.length;
    const dada = new Array(n).fill(true);
    const orden = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [orden[i], orden[j]] = [orden[j], orden[i]]; }
    const meta = Math.max(cfg.filas, Math.round(n * cfg.dadas));
    let quedan = n;
    for (const i of orden) {
      if (quedan <= meta) break;
      dada[i] = false;
      const prueba = sol.map((x, k) => (dada[k] ? x : null));
      if (resuelta(cfg.filas, prueba)) quedan--; else dada[i] = true;
    }
    return { sol, dada };
  }

  /* ---------- Interfaz ---------- */
  function crear(contenedor) {
    const { el } = global.Pasatiempos;
    let filas = 4;
    let sol = [];
    let dada = [];
    let valor = []; // lo que muestra cada casilla (número o null)
    let sel = -1;
    let casillas = [];
    const piramide = el('div', { clase: 'pr__piramide', attrs: { role: 'group', 'aria-label': 'Pirámide' } });
    const teclado = el('div', { clase: 'pr__teclado', attrs: { role: 'group', 'aria-label': 'Números' } });
    '1234567890'.split('').forEach((d) => {
      const b = el('button', { clase: 'pr__tecla', texto: d, attrs: { type: 'button' } });
      b.addEventListener('click', () => escribir(d));
      b.classList.add('pr__tecla--' + (d === '0' ? 10 : d));
      teclado.append(b);
    });
    const borrar = el('button', { clase: 'pr__tecla pr__tecla--ancha', texto: 'Borrar', attrs: { type: 'button' } });
    borrar.addEventListener('click', () => escribir('borrar'));
    teclado.append(borrar);

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'pr',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'tiempo',
      etiquetaNivel: 'Tamaño',
      acciones: [{ id: 'pista', texto: 'Pista', alClick: () => pista() }],
      cuerpo: [el('div', { clase: 'pr__marco' }, piramide), teclado],
      hayAvance: () => valor.some((v, i) => !dada[i] && v != null),
      nueva(nivel) {
        const g = generar(nivel);
        poner(NIVELES[nivel].filas, g.sol, g.dada, g.sol.map((x, i) => (g.dada[i] ? x : null)));
      },
      cargar(nivel, ex) { poner(NIVELES[nivel].filas, ex.sol, ex.dada, ex.valor); },
      serializar() { return { sol: sol.slice(), dada: dada.slice(), valor: valor.slice() }; },
      validar(ex, nivel) {
        const f = NIVELES[nivel].filas; const n = total(f);
        const ok = (a, t) => Array.isArray(a) && a.length === n && a.every(t);
        if (!ok(ex.sol, (x) => Number.isInteger(x) && x > 0 && x < 100000)) return false;
        if (!ok(ex.dada, (x) => typeof x === 'boolean')) return false;
        if (!ok(ex.valor, (x) => x === null || (Number.isInteger(x) && x >= 0 && x < 100000))) return false;
        for (let r = 0; r < f - 1; r++) for (let i = 0; i <= r; i++) if (ex.sol[pos(r, i)] !== ex.sol[pos(r + 1, i)] + ex.sol[pos(r + 1, i + 1)]) return false;
        return ex.dada.every((d, i) => !d || ex.valor[i] === ex.sol[i]);
      }
    });

    function poner(f, s, d, v) {
      filas = f; sol = s.slice(); dada = d.slice(); valor = v.slice(); sel = -1;
      piramide.replaceChildren();
      casillas = [];
      for (let r = 0; r < filas; r++) {
        const fila = el('div', { clase: 'pr__fila pr__fila--' + ((r % 6) + 1) });
        for (let i = 0; i <= r; i++) {
          const k = pos(r, i);
          const b = el('button', { clase: 'pr__casilla', attrs: { type: 'button', 'data-k': String(k) } });
          b.addEventListener('click', () => elegir(k));
          casillas[k] = b;
          fila.append(b);
        }
        piramide.append(fila);
      }
      const primera = valor.findIndex((x, i) => !dada[i] && x == null);
      sel = primera;
      pintar();
    }

    function pintar() {
      let vacias = 0; let mal = 0;
      for (let k = 0; k < casillas.length; k++) {
        const b = casillas[k];
        const v = valor[k];
        const incorrecta = !dada[k] && v != null && v !== sol[k];
        if (!dada[k] && v == null) vacias++;
        if (incorrecta) mal++;
        b.className = 'pr__casilla' + (dada[k] ? ' pr__casilla--dada' : '') + (k === sel ? ' pr__casilla--sel' : '') + (incorrecta ? ' pr__casilla--mal' : '');
        b.textContent = v == null ? '' : String(v);
        b.disabled = dada[k];
        b.setAttribute('aria-label', 'Casilla ' + (k + 1) + (v == null ? ', vacía' : ', ' + v) + (dada[k] ? ', dada' : '') + (incorrecta ? ', no coincide' : ''));
      }
      if (base.fase() === 'ganado') return;
      if (!vacias && !mal) ganar();
    }

    function elegir(k) {
      if (dada[k] || base.fase() === 'ganado') return;
      sel = k;
      pintar();
    }

    function escribir(t) {
      if (base.fase() === 'ganado' || sel < 0 || dada[sel]) return;
      base.empezar();
      if (t === 'borrar') {
        const s = valor[sel] == null ? '' : String(valor[sel]);
        valor[sel] = s.length > 1 ? Number(s.slice(0, -1)) : null;
      } else {
        const s = (valor[sel] == null ? '' : String(valor[sel])) + t;
        if (s.length <= 4) valor[sel] = Number(s);
      }
      base.sumarMov();
      pintar();
    }

    function pista() {
      if (base.fase() === 'ganado') return;
      let k = sel >= 0 && !dada[sel] && valor[sel] !== sol[sel] ? sel : valor.findIndex((x, i) => !dada[i] && x !== sol[i]);
      if (k < 0) return;
      base.empezar();
      valor[k] = sol[k];
      sel = k;
      base.sumarPista();
      pintar();
    }

    function ganar() {
      base.ganar({ titulo: 'Pirámide completa', mensaje: 'Completaste la pirámide de ' + filas + ' pisos.' });
    }

    const teclas = (ev) => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const t = ev.target;
      if (t && t.tagName === 'INPUT') return;
      if (/^[0-9]$/.test(ev.key)) { ev.preventDefault(); escribir(ev.key); }
      else if (ev.key === 'Backspace' || ev.key === 'Delete') { ev.preventDefault(); escribir('borrar'); }
    };
    contenedor.addEventListener('keydown', teclas);

    base.arrancar();
    return {
      pruebas: { elegir, escribir, pista, sol: () => sol.slice(), dada: () => dada.slice(), valor: () => valor.slice(), sel: () => sel },
      destruir() { contenedor.removeEventListener('keydown', teclas); base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.Piramide = { pruebas: () => (instancia ? instancia.pruebas : null), generar, propagar, resuelta, pos, total };
})(window);
