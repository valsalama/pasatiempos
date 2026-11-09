/* escalera.js · Escalera de palabras
   Pasá de una palabra a otra cambiando una sola letra por vez. Cada paso tiene que ser una palabra
   válida de cinco letras. Gana quien llega con menos pasos. */
(function (global) {
  'use strict';

  const ID = 'escalera';
  const NIVELES = {
    facil: { nombre: 'Fácil', min: 3, max: 4 },
    medio: { nombre: 'Medio', min: 5, max: 6 },
    dificil: { nombre: 'Difícil', min: 7, max: 9 }
  };
  const ORDEN = ['facil', 'medio', 'dificil'];

  /* ---------- Grafo de palabras (se arma una sola vez) ---------- */
  let datos = null;
  function grafo() {
    if (datos) return datos;
    const P = global.PalabrasWordle;
    const soluciones = P.soluciones.map((w) => w.toUpperCase());
    const todas = new Set(soluciones);
    P.validas.forEach((w) => todas.add(String(w).toUpperCase()));
    const cubos = new Map();
    todas.forEach((w) => {
      for (let i = 0; i < 5; i++) {
        const k = w.slice(0, i) + '_' + w.slice(i + 1);
        if (!cubos.has(k)) cubos.set(k, []);
        cubos.get(k).push(w);
      }
    });
    datos = { soluciones, todas, cubos };
    return datos;
  }
  function vecinas(w) {
    const { cubos } = grafo();
    const s = new Set();
    for (let i = 0; i < 5; i++) (cubos.get(w.slice(0, i) + '_' + w.slice(i + 1)) || []).forEach((x) => { if (x !== w) s.add(x); });
    return Array.from(s);
  }
  /* Distancias desde `origen` (mapa palabra -> pasos) */
  function distancias(origen) {
    const d = new Map([[origen, 0]]);
    const cola = [origen];
    for (let h = 0; h < cola.length; h++) {
      const x = cola[h];
      vecinas(x).forEach((y) => { if (!d.has(y)) { d.set(y, d.get(x) + 1); cola.push(y); } });
    }
    return d;
  }
  /* Camino más corto de a hasta b (lista de palabras, sin incluir a). null si no hay. */
  function camino(a, b) {
    if (a === b) return [];
    const previo = new Map([[a, null]]);
    const cola = [a];
    for (let h = 0; h < cola.length; h++) {
      const x = cola[h];
      for (const y of vecinas(x)) {
        if (previo.has(y)) continue;
        previo.set(y, x);
        if (y === b) {
          const res = [];
          for (let p = b; p !== a; p = previo.get(p)) res.unshift(p);
          return res;
        }
        cola.push(y);
      }
    }
    return null;
  }
  function sacarTildes(t) {
    return String(t).toUpperCase().replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I').replace(/Ó/g, 'O').replace(/[ÚÜ]/g, 'U');
  }
  function unaLetra(a, b) {
    if (a.length !== 5 || b.length !== 5) return false;
    let dif = 0;
    for (let i = 0; i < 5; i++) if (a[i] !== b[i]) dif++;
    return dif === 1;
  }
  function generar(nivel, rnd = Math.random) {
    const cfg = NIVELES[nivel];
    const { soluciones } = grafo();
    for (let intento = 0; intento < 400; intento++) {
      const inicio = soluciones[Math.floor(rnd() * soluciones.length)];
      const d = distancias(inicio);
      const metas = soluciones.filter((w) => { const k = d.get(w); return k >= cfg.min && k <= cfg.max; });
      if (metas.length) return { inicio, meta: metas[Math.floor(rnd() * metas.length)], minimo: 0 };
    }
    return { inicio: 'CASAS', meta: 'MESAS', minimo: 1 };
  }

  /* ---------- Interfaz ---------- */
  function crear(contenedor) {
    const { el, notificar } = global.Pasatiempos;
    let inicio = ''; let meta = ''; let pasos = [];

    const escalera = el('ol', { clase: 'es__lista', attrs: { 'aria-label': 'Tu escalera' } });
    const campo = el('input', { clase: 'es__campo', attrs: { type: 'text', maxlength: '5', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', enterkeyhint: 'go', 'aria-label': 'Próxima palabra' } });
    const btnProbar = el('button', { clase: 'btn btn--primario', texto: 'Probar', attrs: { type: 'button' } });
    const aviso = el('p', { clase: 'es__aviso', attrs: { role: 'status', 'aria-live': 'polite' } });

    const base = global.BaseJuego.montar({
      id: ID,
      contenedor,
      clase: 'es',
      niveles: NIVELES,
      orden: ORDEN,
      metrica: 'cantidad',
      conTiempo: false,
      etiquetaNivel: 'Dificultad',
      datos: [{ id: 'pasos', etq: 'Pasos' }],
      formato: (v) => v + (v === 1 ? ' paso' : ' pasos'),
      acciones: [
        { id: 'pista', texto: 'Pista', alClick: () => pista() },
        { id: 'deshacer', texto: 'Deshacer', alClick: () => deshacer() }
      ],
      cuerpo: [
        el('div', { clase: 'es__marco' }, escalera),
        el('div', { clase: 'es__entrada' }, campo, btnProbar),
        aviso
      ],
      hayAvance: () => pasos.length > 0,
      nueva(nivel) {
        const g = generar(nivel);
        poner(g.inicio, g.meta, []);
      },
      cargar(nivel, ex) { poner(ex.inicio, ex.meta, ex.pasos); },
      serializar() { return { inicio, meta, pasos: pasos.slice() }; },
      validar(ex) {
        const { todas } = grafo();
        if (typeof ex.inicio !== 'string' || typeof ex.meta !== 'string' || !Array.isArray(ex.pasos)) return false;
        if (!todas.has(ex.inicio) || !todas.has(ex.meta) || ex.inicio === ex.meta) return false;
        let ant = ex.inicio;
        for (const p of ex.pasos) {
          if (typeof p !== 'string' || !todas.has(p) || !unaLetra(ant, p)) return false;
          ant = p;
        }
        return ant !== ex.meta;
      }
    });

    function poner(i, m, p) {
      inicio = i; meta = m; pasos = p.slice();
      campo.value = '';
      aviso.textContent = '';
      pintar();
    }

    function ultima() { return pasos.length ? pasos[pasos.length - 1] : inicio; }

    function fila(palabra, anterior, clase) {
      const li = el('li', { clase: 'es__fila' + (clase ? ' ' + clase : '') });
      palabra.split('').forEach((ch, k) => {
        li.append(el('span', { clase: 'es__letra' + (anterior && anterior[k] !== ch ? ' es__letra--cambia' : ''), texto: ch }));
      });
      return li;
    }

    function pintar() {
      escalera.replaceChildren();
      escalera.append(fila(inicio, null, 'es__fila--borde'));
      let ant = inicio;
      pasos.forEach((p) => { escalera.append(fila(p, ant, p === meta ? 'es__fila--meta' : '')); ant = p; });
      if (ant !== meta) {
        const espera = el('li', { clase: 'es__fila es__fila--vacia', attrs: { 'aria-hidden': 'true' } });
        for (let k = 0; k < 5; k++) espera.append(el('span', { clase: 'es__letra', texto: '' }));
        escalera.append(espera);
        escalera.append(fila(meta, null, 'es__fila--borde es__fila--objetivo'));
      }
      base.dato('pasos', pasos.length);
      const fin = base.fase() === 'ganado';
      campo.disabled = fin; btnProbar.disabled = fin;
      if (base.accion('deshacer')) base.accion('deshacer').disabled = fin || !pasos.length;
      if (base.accion('pista')) base.accion('pista').disabled = fin;
    }

    function probar() {
      if (base.fase() === 'ganado') return;
      const p = sacarTildes(campo.value.trim());
      const { todas } = grafo();
      if (p.length !== 5) { aviso.textContent = 'Tiene que tener cinco letras.'; return; }
      if (!todas.has(p)) { aviso.textContent = p + ' no está en la lista de palabras.'; return; }
      const ant = ultima();
      if (p === ant || !unaLetra(ant, p)) { aviso.textContent = 'Tiene que cambiar exactamente una letra de ' + ant + '.'; return; }
      if (p === inicio || pasos.includes(p)) { aviso.textContent = 'Esa palabra ya está en tu escalera.'; return; }
      base.empezar();
      pasos.push(p);
      base.sumarMov();
      campo.value = '';
      aviso.textContent = '';
      pintar();
      if (p === meta) {
        const n = pasos.length;
        base.ganar({ titulo: 'Llegaste', mensaje: 'De ' + inicio + ' a ' + meta + ' en ' + n + (n === 1 ? ' paso.' : ' pasos.'), valor: n });
      } else {
        campo.focus();
      }
    }

    function deshacer() {
      if (!pasos.length || base.fase() === 'ganado') return;
      pasos.pop();
      aviso.textContent = '';
      pintar();
    }

    function pista() {
      if (base.fase() === 'ganado') return;
      const c = camino(ultima(), meta);
      if (!c || !c.length) { aviso.textContent = 'No encuentro un camino desde acá. Probá con Deshacer.'; return; }
      base.empezar();
      base.sumarPista();
      aviso.textContent = 'Una palabra que te acerca: ' + c[0] + (c.length > 1 ? ' (faltan ' + c.length + ' pasos desde ' + ultima() + ').' : '.');
      notificar('Con pista, esta partida no suma a tus mejores marcas.');
    }

    btnProbar.addEventListener('click', probar);
    campo.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); probar(); } });
    campo.addEventListener('input', () => { campo.value = campo.value.toUpperCase().replace(/[^A-ZÑÁÉÍÓÚÜ]/g, ''); });

    base.arrancar();
    return {
      pruebas: { probar: (t) => { campo.value = t; probar(); }, pista, deshacer, estado: () => ({ inicio, meta, pasos: pasos.slice() }) },
      destruir() { base.destruir(); }
    };
  }

  let instancia = null;
  global.Pasatiempos.registrar({
    id: ID,
    iniciar(contenedor) { instancia = crear(contenedor); },
    destruir() { if (instancia) { instancia.destruir(); instancia = null; } }
  });
  global.Escalera = { pruebas: () => (instancia ? instancia.pruebas : null), generar, camino, distancias, unaLetra, vecinas, sacarTildes };
})(window);
