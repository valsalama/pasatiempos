/* tutorial.js · Mini partidas guiadas ("Cómo se juega")
   Cada juego registra un tutorial con Tutorial.registrar(id, fabrica).
   `fabrica()` devuelve una descripción nueva cada vez que se abre o se reinicia:

     {
       grupos: [ { id, cols, clase?, rotulo?, plana?, celdas: [ { id?, t?, c?, hijos?, inerte? } ] } ],
       pasos:  [ { texto, pista?, bien?, clic: [id | [id, id]], tras?(e, i, idTocado) } ],
       fin:    'texto final'
     }

   - `clic` es la lista ordenada de toques que completan el paso. Un elemento puede ser un
     arreglo de ids si sirve cualquiera de ellos. Las celdas que hay que tocar se resaltan.
   - `tras` se ejecuta después de cada toque correcto y recibe `e`, con estas funciones:
       e.t(id, texto)      cambia el texto de la celda
       e.c(id, clases)     reemplaza las clases
       e.mas(id, clases)   agrega clases       e.menos(id, clases)  saca clases
       e.hijos(id, lista)  cambia las piezas internas
       e.ver(grupo, bool)  muestra u oculta un grupo (con `oculto: true` en el grupo arranca oculto)
       e.cel(id)           devuelve la celda
   - El resto del dibujo (ancho, colores, resaltado) lo resuelve css/tutorial.css. */
(function (global) {
  'use strict';

  const fabricas = new Map();

  function el(etiqueta, { clase, texto, attrs } = {}, ...hijos) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto != null) nodo.textContent = texto;
    if (attrs) Object.keys(attrs).forEach((k) => nodo.setAttribute(k, attrs[k]));
    hijos.forEach((h) => { if (h) nodo.append(h); });
    return nodo;
  }

  function registrar(id, fabrica) { fabricas.set(id, fabrica); }
  function hay(id) { return fabricas.has(id); }
  function lista() { return Array.from(fabricas.keys()); }

  /* ---------- Escena: grupos de celdas que se redibujan después de cada toque ---------- */
  function crearEscena(def) {
    const celdas = new Map();
    const ocultos = new Set();
    def.grupos.forEach((g) => { if (g.oculto) ocultos.add(g.id); });
    def.grupos.forEach((g) => g.celdas.forEach((c, i) => {
      if (c.id == null) c.id = g.id + '#' + i;
      celdas.set(c.id, c);
    }));
    const apiCelda = (id) => {
      const c = celdas.get(id);
      if (!c) throw new Error('Tutorial: no existe la celda ' + id);
      return c;
    };
    const e = {
      cel: apiCelda,
      t(id, t) { apiCelda(id).t = t; },
      c(id, c) { apiCelda(id).c = c; },
      mas(id, c) {
        const x = apiCelda(id);
        const set = new Set((x.c || '').split(/\s+/).filter(Boolean));
        c.split(/\s+/).filter(Boolean).forEach((k) => set.add(k));
        x.c = Array.from(set).join(' ');
      },
      menos(id, c) {
        const x = apiCelda(id);
        const quitar = new Set(c.split(/\s+/).filter(Boolean));
        x.c = (x.c || '').split(/\s+/).filter((k) => k && !quitar.has(k)).join(' ');
      },
      hijos(id, h) { apiCelda(id).hijos = h; },
      ver(g, visible) { if (visible) ocultos.delete(g); else ocultos.add(g); }
    };
    return { e, celdas, ocultos };
  }

  function dibujarCelda(c, objetivos, alTocar) {
    const clases = 'tc' + (c.c ? ' ' + c.c : '') + (objetivos.has(c.id) ? ' tut-objetivo' : '');
    const interna = (c.hijos || []).map((h) => el('span', { clase: h.c || '', texto: h.t || '' }));
    if (c.inerte) {
      const s = el('span', { clase: clases + ' tc--inerte', texto: c.t || '' }, ...interna);
      if (c.aria) s.setAttribute('aria-label', c.aria);
      return s;
    }
    const b = el('button', { clase: clases, texto: c.t || '', attrs: { type: 'button', 'data-id': c.id } }, ...interna);
    if (c.aria) b.setAttribute('aria-label', c.aria);
    b.addEventListener('click', () => alTocar(c.id));
    return b;
  }

  /* ---------- Diálogo ---------- */
  function abrir(idJuego, nombreJuego, devolverFoco) {
    const fabrica = fabricas.get(idJuego);
    if (!fabrica) return null;

    let escena, def, paso, toque, fallos, bien, aviso, verPista;

    const dlg = el('dialog', { clase: 'tut', attrs: { 'aria-labelledby': 'tut-titulo' } });
    const titulo = el('h2', { texto: 'Cómo se juega: ' + nombreJuego, attrs: { id: 'tut-titulo' } });
    const cerrar = el('button', { clase: 'btn-icono', attrs: { type: 'button', 'aria-label': 'Cerrar' } });
    cerrar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    const cab = el('div', { clase: 'dlg__cab' }, titulo, cerrar);

    const lblPaso = el('p', { clase: 'tut-paso' });
    const txtPaso = el('p', { clase: 'tut-texto' });
    const txtBien = el('p', { clase: 'tut-bien' });
    const txtAviso = el('p', { clase: 'tut-aviso' });
    const guia = el('div', { clase: 'tut-guia', attrs: { 'aria-live': 'polite' } }, lblPaso, txtPaso, txtBien, txtAviso);
    const lienzo = el('div', { clase: 'tut-escena' });
    const barra = el('div', { clase: 'tut-barra' });
    const btnPista = el('button', { clase: 'btn btn--chico', texto: 'Pista', attrs: { type: 'button' } });
    const btnReiniciar = el('button', { clase: 'btn btn--chico', texto: 'Reiniciar', attrs: { type: 'button' } });
    const btnListo = el('button', { clase: 'btn btn--chico btn--primario', texto: 'Listo, a jugar', attrs: { type: 'button' } });
    barra.append(btnPista, btnReiniciar, btnListo);
    const cuerpo = el('div', { clase: 'dlg__cuerpo tut-cuerpo' }, guia, lienzo);
    dlg.append(el('div', { clase: 'dlg__caja' }, cab, cuerpo, el('div', { clase: 'dlg__pie tut-pie' }, barra)));

    function objetivosActuales() {
      if (!def || paso >= def.pasos.length) return new Set();
      const t = def.pasos[paso].clic[toque];
      return new Set(Array.isArray(t) ? t : [t]);
    }

    function dibujar(idFoco) {
      const objetivos = objetivosActuales();
      lienzo.replaceChildren();
      def.grupos.forEach((g) => {
        if (escena.ocultos.has(g.id)) return;
        const caja = el('div', { clase: 'tut-grupo' + (g.clase ? ' ' + g.clase : '') + (g.plana ? ' tut-grupo--plana' : '') });
        if (g.rotulo) caja.append(el('p', { clase: 'tut-rotulo', texto: g.rotulo }));
        const rej = el('div', { clase: 'tut-rej', attrs: g.etiqueta ? { role: 'group', 'aria-label': g.etiqueta } : {} });
        rej.style.setProperty('--n', String(g.cols));
        g.celdas.forEach((c) => rej.append(dibujarCelda(c, objetivos, alTocar)));
        caja.append(rej);
        lienzo.append(caja);
      });
      if (idFoco) {
        const b = lienzo.querySelector('[data-id="' + (global.CSS && CSS.escape ? CSS.escape(idFoco) : idFoco) + '"]');
        if (b) {
          b.focus({ preventScroll: true });
          if (typeof b.scrollIntoView === 'function') b.scrollIntoView({ block: 'nearest' });
        }
      }
    }

    function textos() {
      const total = def.pasos.length;
      const terminado = paso >= total;
      lblPaso.textContent = terminado ? 'Terminaste' : 'Paso ' + (paso + 1) + ' de ' + total;
      txtPaso.textContent = terminado ? def.fin : def.pasos[paso].texto;
      txtBien.textContent = bien || '';
      txtBien.hidden = !bien;
      const pista = !terminado && verPista ? (def.pasos[paso].pista || 'Tocá lo que tiene el contorno grueso.') : '';
      txtAviso.textContent = aviso || pista;
      txtAviso.hidden = !(aviso || pista);
      btnPista.hidden = terminado;
      btnListo.textContent = terminado ? 'Listo, a jugar' : 'Salir';
      btnListo.classList.toggle('btn--primario', terminado);
    }

    function empezar() {
      def = fabrica();
      escena = crearEscena(def);
      paso = 0; toque = 0; fallos = 0; bien = ''; aviso = ''; verPista = false;
      textos();
      dibujar();
    }

    function alTocar(id) {
      if (paso >= def.pasos.length) return;
      const actual = def.pasos[paso];
      const objetivos = objetivosActuales();
      if (!objetivos.has(id)) {
        fallos += 1;
        aviso = fallos >= 2 ? '' : 'Probá con la pieza que tiene el contorno grueso.';
        if (fallos >= 2) verPista = true;
        textos();
        return;
      }
      fallos = 0; aviso = ''; verPista = false;
      if (typeof actual.tras === 'function') actual.tras(escena.e, toque, id);
      toque += 1;
      if (toque >= actual.clic.length) {
        bien = actual.bien || '';
        paso += 1; toque = 0;
      }
      textos();
      const siguiente = objetivosActuales();
      dibujar(siguiente.size ? Array.from(siguiente)[0] : null);
    }

    function cerrarTodo() {
      if (typeof dlg.close === 'function' && dlg.open) dlg.close();
      else alCerrar();
    }
    function alCerrar() {
      dlg.remove();
      if (devolverFoco && typeof devolverFoco.focus === 'function') devolverFoco.focus();
    }

    cerrar.addEventListener('click', cerrarTodo);
    btnListo.addEventListener('click', cerrarTodo);
    btnReiniciar.addEventListener('click', () => { empezar(); });
    btnPista.addEventListener('click', () => { verPista = true; aviso = ''; textos(); });
    dlg.addEventListener('close', alCerrar);
    dlg.addEventListener('click', (ev) => { if (ev.target === dlg) cerrarTodo(); });

    document.body.append(dlg);
    empezar();
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    return { dlg, estado: () => ({ paso, total: def.pasos.length }) };
  }

  global.Tutorial = { registrar, hay, lista, abrir };
})(window);
