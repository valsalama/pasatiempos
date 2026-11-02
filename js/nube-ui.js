/* nube-ui.js · pantallas de la cuenta (ingresar, apodo) y del ranking del día.
   Todo el texto se arma con textContent (los apodos son de otras personas: nunca se interpretan como HTML).
   Si Nube no está activa, este archivo no muestra nada.

   Expone: NubeUI */
(function (global) {
  'use strict';

  const el = (etiqueta, clase, texto) => {
    const n = document.createElement(etiqueta);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  };

  const ICONO_CERRAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function crearDialogo(id, titulo) {
    const dlg = document.createElement('dialog');
    dlg.id = id;
    dlg.setAttribute('aria-labelledby', id + '-titulo');
    const caja = el('div', 'dlg__caja');
    const cab = el('div', 'dlg__cab');
    const h2 = el('h2', '', titulo);
    h2.id = id + '-titulo';
    const cerrar = el('button', 'btn-icono');
    cerrar.type = 'button';
    cerrar.setAttribute('aria-label', 'Cerrar');
    cerrar.innerHTML = ICONO_CERRAR; // ícono propio, texto fijo
    cab.append(h2, cerrar);
    const cuerpo = el('div', 'dlg__cuerpo nube');
    caja.append(cab, cuerpo);
    dlg.append(caja);
    document.body.append(dlg);
    cerrar.addEventListener('click', () => global.Pasatiempos.cerrarDialogo(dlg));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) global.Pasatiempos.cerrarDialogo(dlg); });
    return { dlg, cuerpo, titulo: h2 };
  }

  function campo(etiqueta, atributos) {
    const caja = el('label', 'nube__campo');
    caja.append(el('span', 'nube__etiqueta', etiqueta));
    const input = document.createElement('input');
    Object.keys(atributos).forEach((k) => input.setAttribute(k, atributos[k]));
    caja.append(input);
    return { caja, input };
  }

  function boton(texto, clase, tipo) {
    const b = el('button', 'btn ' + (clase || ''), texto);
    b.type = tipo || 'button';
    return b;
  }

  let cuenta = null;   // { dlg, cuerpo }
  let rk = null;       // { dlg, cuerpo }
  let btnCuenta = null;
  let fase = { paso: 'inicio', email: '', borrando: false };
  let mensaje = { texto: '', error: false };

  const decir = (texto, error) => { mensaje = { texto, error: !!error }; };
  function lineaMensaje() {
    const p = el('p', 'nube__msg' + (mensaje.error ? ' error' : ''), mensaje.texto);
    p.setAttribute('role', mensaje.error ? 'alert' : 'status');
    return p;
  }

  /* ---------- Cuenta ---------- */
  function pintarCuenta() {
    if (!cuenta) return;
    const e = global.Nube.estado();
    const c = cuenta.cuerpo;
    c.replaceChildren();

    if (!e.listo) { c.append(el('p', '', 'Cargando…')); return; }

    if (!e.adentro) {
      c.append(el('p', '', 'Ingresá para aparecer en el ranking del día y sumar racha con tus amigas. Tu mail nunca se muestra: solo vas a tener un apodo.'));

      if (e.metodos.google) {
        const g = boton('Entrar con Google', 'btn--primario');
        g.addEventListener('click', async () => {
          g.disabled = true;
          const r = await global.Nube.entrarConGoogle();
          if (!r.ok) { decir(r.mensaje, true); g.disabled = false; pintarCuenta(); }
        });
        c.append(g);
      }
      if (e.metodos.email) {
        if (e.metodos.google) c.append(el('p', 'nube__o', '— o con tu mail —'));
        if (fase.paso === 'codigo') {
          c.append(el('p', '', 'Te mandamos un mail a ' + fase.email + '. Tocá el link que trae, o escribí acá el código de 6 números.'));
          const f = el('form', 'nube__form');
          const k = campo('Código', { type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '8', pattern: '[0-9 ]*', required: '' });
          const ok = boton('Entrar', 'btn--primario', 'submit');
          const otro = boton('Usar otro mail', 'btn--texto');
          f.append(k.caja, ok, otro);
          f.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            ok.disabled = true;
            const r = await global.Nube.verificarCodigo(fase.email, k.input.value);
            if (!r.ok) { decir(r.mensaje, true); ok.disabled = false; pintarCuenta(); }
            else decir('', false);
          });
          otro.addEventListener('click', () => { fase = { paso: 'inicio', email: '', borrando: false }; decir('', false); pintarCuenta(); });
          c.append(f);
        } else {
          const f = el('form', 'nube__form');
          const m = campo('Tu mail', { type: 'email', autocomplete: 'email', inputmode: 'email', maxlength: '254', required: '' });
          const ok = boton('Mandame el link', e.metodos.google ? '' : 'btn--primario', 'submit');
          f.append(m.caja, ok);
          f.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            ok.disabled = true;
            const r = await global.Nube.enviarLink(m.input.value);
            if (r.ok) { fase = { paso: 'codigo', email: r.email, borrando: false }; decir('', false); }
            else decir(r.mensaje, true);
            pintarCuenta();
          });
          c.append(f);
        }
      }
      if (!e.metodos.google && !e.metodos.email) c.append(el('p', 'nube__msg error', 'No hay ningún método de ingreso activado.'));
      if (mensaje.texto) c.append(lineaMensaje());
      return;
    }

    if (e.sinApodo) {
      c.append(el('p', '', 'Última cosa: elegí el apodo que van a ver las demás en el ranking.'));
      c.append(formApodo('Guardar apodo', true));
      if (mensaje.texto) c.append(lineaMensaje());
      c.append(botonSalir());
      return;
    }

    const quien = el('p', 'nube__quien');
    quien.append('Ingresaste como ', el('strong', '', e.apodo));
    c.append(quien);
    c.append(el('p', 'nube__nota', 'Podés cambiar el apodo una vez por día.'));
    c.append(formApodo('Cambiar apodo', false));
    if (mensaje.texto) c.append(lineaMensaje());
    const fila = el('div', 'nube__acciones');
    fila.append(botonSalir());
    if (!fase.borrando) {
      const b = boton('Borrar mi cuenta', 'btn--texto');
      b.addEventListener('click', () => { fase.borrando = true; pintarCuenta(); });
      fila.append(b);
      c.append(fila);
    } else {
      c.append(fila);
      const aviso = el('div', 'nube__peligro');
      aviso.append(el('p', '', 'Se borran tu apodo y todos tus resultados del ranking. No se puede deshacer. Tus partidas en este navegador no se tocan.'));
      const si = boton('Sí, borrar todo', 'btn--primario');
      const no = boton('Cancelar', '');
      si.addEventListener('click', async () => {
        si.disabled = true;
        const r = await global.Nube.borrarCuenta();
        fase = { paso: 'inicio', email: '', borrando: false };
        decir(r.ok ? 'Listo, tu cuenta se borró.' : r.mensaje, !r.ok);
        pintarCuenta();
      });
      no.addEventListener('click', () => { fase.borrando = false; pintarCuenta(); });
      aviso.append(si, no);
      c.append(aviso);
    }
  }

  function formApodo(textoBoton, primario) {
    const f = el('form', 'nube__form');
    const a = campo('Apodo (3 a 20 letras o números)', {
      type: 'text', maxlength: '20', minlength: '3', autocomplete: 'nickname', autocapitalize: 'none', spellcheck: 'false', required: ''
    });
    const ok = boton(textoBoton, primario ? 'btn--primario' : '', 'submit');
    f.append(a.caja, ok);
    f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      ok.disabled = true;
      const r = await global.Nube.guardarApodo(a.input.value);
      decir(r.ok ? 'Listo, ahora sos ' + r.apodo + '.' : r.mensaje, !r.ok);
      pintarCuenta();
    });
    return f;
  }

  function botonSalir() {
    const b = boton('Cerrar sesión', '');
    b.addEventListener('click', async () => {
      await global.Nube.salir();
      fase = { paso: 'inicio', email: '', borrando: false };
      decir('', false);
      pintarCuenta();
    });
    return b;
  }

  function abrirCuenta() {
    if (!global.Nube.activa) return;
    if (!cuenta) cuenta = crearDialogo('dlg-cuenta', 'Mi cuenta');
    decir('', false);
    pintarCuenta();
    global.Pasatiempos.abrirDialogo(cuenta.dlg);
  }

  /* ---------- Ranking ---------- */
  const RACHAS = '__rachas';
  let rkJuego = null;
  let rkPedido = 0;

  function juegosConDiario() {
    return global.Pasatiempos.catalogo.filter((j) => j.listo !== false && global.Pasatiempos.tieneDiario(j.id));
  }

  async function pintarRanking() {
    if (!rk) return;
    const c = rk.cuerpo;
    const mio = ++rkPedido;
    c.replaceChildren();

    const sel = document.createElement('select');
    sel.className = 'nube__select';
    sel.setAttribute('aria-label', 'Qué ranking ver');
    juegosConDiario().forEach((j) => {
      const o = document.createElement('option');
      o.value = j.id; o.textContent = j.nombre;
      sel.append(o);
    });
    const o = document.createElement('option');
    o.value = RACHAS; o.textContent = 'Rachas (días seguidos)';
    sel.append(o);
    sel.value = rkJuego;
    sel.addEventListener('change', () => { rkJuego = sel.value; pintarRanking(); });
    c.append(sel);

    const juego = global.Pasatiempos.catalogo.find((j) => j.id === rkJuego);
    c.append(el('p', 'nube__nota', rkJuego === RACHAS
      ? 'Días seguidos con al menos un desafío resuelto.'
      : 'Desafío de hoy · ' + (juego && juego.metrica === 'tiempo' ? 'gana el menor tiempo.' : (juego && juego.metrica === 'cantidad' ? 'gana la menor cantidad.' : 'gana el mayor puntaje.'))));

    const lugar = el('div', 'nube__lista');
    lugar.append(el('p', '', 'Cargando…'));
    c.append(lugar);

    const r = rkJuego === RACHAS ? await global.Nube.rachas() : await global.Nube.ranking(rkJuego);
    if (mio !== rkPedido) return; // se pidió otro ranking mientras tanto
    lugar.replaceChildren();
    if (!r.ok) { lugar.append(el('p', 'nube__msg error', r.mensaje)); return; }
    if (!r.filas.length) {
      lugar.append(el('p', '', rkJuego === RACHAS ? 'Todavía nadie tiene racha.' : 'Todavía nadie resolvió este desafío hoy.'));
    } else {
      const ol = el('ol', 'rk');
      r.filas.forEach((f) => {
        const li = el('li', 'rk__fila' + (f.yo ? ' yo' : ''));
        li.value = Number(f.pos);
        const dato = rkJuego === RACHAS
          ? f.dias + (f.dias === 1 ? ' día' : ' días')
          : global.Pasatiempos.formatearValor(juego, f.valor);
        li.append(el('span', 'rk__pos', String(f.pos)), el('span', 'rk__apodo', f.apodo + (f.yo ? ' (vos)' : '')), el('span', 'rk__valor', dato));
        ol.append(li);
      });
      lugar.append(ol);
    }
    const e = global.Nube.estado();
    if (e.listo && !e.adentro) {
      const b = boton('Ingresar para aparecer acá', 'btn--primario');
      b.addEventListener('click', abrirCuenta);
      c.append(b);
    } else if (e.sinApodo) {
      const b = boton('Elegir apodo', 'btn--primario');
      b.addEventListener('click', abrirCuenta);
      c.append(b);
    }
  }

  function abrirRanking(juegoId) {
    if (!global.Nube.activa) return;
    if (!rk) rk = crearDialogo('dlg-ranking', 'Ranking de hoy');
    const ids = juegosConDiario().map((j) => j.id);
    rkJuego = juegoId === RACHAS || ids.indexOf(juegoId) >= 0 ? juegoId : (rkJuego || ids[0]);
    pintarRanking();
    global.Pasatiempos.abrirDialogo(rk.dlg);
  }

  /* ---------- Botón de la barra ---------- */
  function actualizarBoton() {
    if (!btnCuenta) return;
    const e = global.Nube.estado();
    btnCuenta.hidden = !global.Nube.activa;
    btnCuenta.classList.toggle('con-sesion', e.adentro);
    const txt = e.adentro ? 'Mi cuenta (' + (e.apodo || 'sin apodo') + ')' : 'Ingresar';
    btnCuenta.setAttribute('aria-label', txt);
    btnCuenta.title = txt;
  }

  function iniciar() {
    btnCuenta = document.getElementById('btn-cuenta');
    if (!global.Nube || !global.Nube.activa) { if (btnCuenta) btnCuenta.hidden = true; return; }
    if (btnCuenta) btnCuenta.addEventListener('click', abrirCuenta);
    global.Nube.alCambiar(() => {
      actualizarBoton();
      if (cuenta && cuenta.dlg.open) pintarCuenta();
      if (rk && rk.dlg.open && rkJuego) { /* se refresca solo al cambiar de pestaña; evitamos parpadeo */ }
    });
    actualizarBoton();
    global.Nube.iniciar();
  }

  global.NubeUI = { iniciar, abrirCuenta, abrirRanking, RACHAS };
})(window);
