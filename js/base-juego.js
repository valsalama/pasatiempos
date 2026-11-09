/* base-juego.js · Armazón común de los juegos nuevos
   Arma lo repetido de cada juego: selector de nivel, botón "Nuevo juego", datos (con cronómetro opcional),
   botones de acción, guardado automático de la partida, mejores marcas y cartel de victoria.

   Uso:
     const base = BaseJuego.montar({
       id, contenedor, niveles: { facil: { nombre: 'Fácil' } }, orden: ['facil'],
       metrica: 'tiempo' | 'cantidad' | 'puntaje',    // cómo se comparan las marcas
       datos: [{ id: 'mov', etq: 'Movimientos' }],     // datos que se muestran junto al tiempo
       conTiempo: true,
       acciones: [{ id: 'pista', texto: 'Pista', alClick() {} }],
       cuerpo: [nodo, ...],                            // lo propio del juego
       nueva(nivel, base) {}, cargar(nivel, extra, base) {}, serializar() { return extra | null }, validar(extra, nivel) { return true },
       formato(valor) { return texto }                 // solo si la métrica no es tiempo
     });
   Después de crear el juego hay que llamar a base.arrancar().
   Devuelve: nivel(), fase(), empezar(), dato(id, valor), mov(), sumarMov(n), pistas(), sumarPista(), guardar(),
   ganar({ titulo, mensaje, valor }), nuevaPartida(nivel), despues(fn, ms), accion(id), destruir(). */
(function (global) {
  'use strict';

  function montar(cfg) {
    const { el, notificar, celebrar } = global.Pasatiempos;
    const ID = cfg.id;
    const conTiempo = cfg.conTiempo !== false;
    const modo = cfg.metrica === 'puntaje' ? 'mayor' : 'menor';
    const formato = cfg.formato || ((v) => Cronometro.formatear(v));
    let nivel = cfg.orden[0];
    let fase = 'listo'; // 'listo' | 'jugando' | 'ganado'
    let mov = 0;
    let pistas = 0;
    let destruido = false;
    const temporizadores = new Set();
    const valores = {};

    function despues(fn, ms) {
      const id = setTimeout(() => { temporizadores.delete(id); if (!destruido) fn(); }, ms);
      temporizadores.add(id);
    }

    const seg = el('div', { clase: 'seg', attrs: { role: 'group', 'aria-label': cfg.etiquetaNivel || 'Nivel' } });
    const botonesNivel = {};
    cfg.orden.forEach((id) => {
      const b = el('button', { texto: cfg.niveles[id].nombre, attrs: { type: 'button', 'aria-pressed': 'false' } });
      b.addEventListener('click', () => pedirNueva(id));
      botonesNivel[id] = b;
      seg.append(b);
    });
    const btnNuevo = el('button', { clase: 'btn btn--primario', texto: cfg.textoNuevo || 'Nuevo juego', attrs: { type: 'button' } });
    btnNuevo.addEventListener('click', () => pedirNueva(nivel));

    const datos = el('div', { clase: 'datos' });
    (cfg.datos || []).forEach((d) => {
      valores[d.id] = el('span', { clase: 'dato__valor', texto: d.inicial != null ? String(d.inicial) : '0' });
      datos.append(el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: d.etq }), valores[d.id]));
    });
    const valReloj = el('span', { clase: 'dato__valor', texto: '00:00' });
    const crono = new Cronometro({ onTick: (ms) => { valReloj.textContent = Cronometro.formatear(ms); } });
    if (conTiempo) datos.append(el('div', { clase: 'dato' }, el('span', { clase: 'dato__etq', texto: 'Tiempo' }), valReloj));

    const acciones = el('div', { clase: 'jg__acciones jg__acciones--fila' });
    const botonesAccion = {};
    (cfg.acciones || []).forEach((a) => {
      const b = el('button', { clase: 'btn btn--chico', texto: a.texto, attrs: { type: 'button' } });
      b.addEventListener('click', () => a.alClick());
      botonesAccion[a.id] = b;
      acciones.append(b);
    });

    const raiz = el('div', { clase: 'jg ' + (cfg.clase || '') },
      el('div', { clase: 'jg__fila' }, seg, btnNuevo),
      el('div', { clase: 'jg__fila' }, datos, (cfg.acciones || []).length ? acciones : null),
      ...(cfg.cuerpo || []));
    cfg.contenedor.append(raiz);

    function marcarNivel() {
      cfg.orden.forEach((id) => botonesNivel[id].setAttribute('aria-pressed', String(id === nivel)));
    }

    function serializar() {
      if (fase !== 'jugando') return null;
      const extra = cfg.serializar();
      if (!extra) return null;
      return { nivel, ms: Math.round(crono.transcurrido), mov, pistas, extra };
    }
    function guardar() {
      const s = serializar();
      if (s) Guardado.guardar(ID, s);
    }
    const auto = Guardado.autoguardar(ID, serializar, { cada: 5000 });

    function nuevaPartida(id) {
      nivel = id;
      fase = 'listo'; mov = 0; pistas = 0;
      Guardado.borrar(ID);
      Almacen.escribir(ID + ':nivel', id);
      crono.reiniciar(0);
      marcarNivel();
      cfg.nueva(id, api);
    }

    function pedirNueva(id) {
      const hayAvance = cfg.hayAvance ? cfg.hayAvance() : mov > 0;
      if (fase === 'jugando' && hayAvance && !global.confirm('Si empezás un juego nuevo, perdés la partida actual. ¿Seguimos?')) return;
      nuevaPartida(id);
    }

    function empezar() {
      if (fase === 'listo') {
        fase = 'jugando';
        if (conTiempo) crono.iniciar();
      }
    }

    function ganar(op) {
      if (fase === 'ganado') return;
      fase = 'ganado';
      const ms = conTiempo ? Math.round(crono.detener()) : 0;
      Guardado.borrar(ID);
      const valor = op.valor != null ? op.valor : ms;
      let detalle;
      if (pistas > 0) {
        detalle = 'Usaste ' + pistas + (pistas === 1 ? ' pista' : ' pistas') + ': esta vez no entra en las mejores marcas.';
      } else {
        const r = Records.agregar(ID, nivel, valor, { modo });
        if (r.esRecord) detalle = 'Nueva mejor marca en el nivel ' + cfg.niveles[nivel].nombre.toLowerCase() + '.';
        else if (r.enTop) detalle = 'Quedaste en el puesto ' + r.posicion + ' de tus mejores marcas.';
        else detalle = 'Tu mejor marca en este nivel es ' + formato(Records.mejor(ID, nivel)) + '.';
      }
      despues(() => celebrar({
        titulo: op.titulo,
        mensaje: op.mensaje,
        detalle,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nuevaPartida(nivel) },
          { texto: 'Cerrar' }
        ]
      }), op.demora != null ? op.demora : 350);
    }

    /* Fin sin marca (derrota, empate o partida sin récord) */
    function terminar(op) {
      if (fase === 'ganado') return;
      fase = 'ganado';
      if (conTiempo) crono.detener();
      Guardado.borrar(ID);
      despues(() => celebrar({
        titulo: op.titulo,
        mensaje: op.mensaje || '',
        detalle: op.detalle || '',
        confeti: false,
        botones: [
          { texto: 'Nuevo juego', primario: true, alClick: () => nuevaPartida(nivel) },
          { texto: 'Cerrar' }
        ]
      }), op.demora != null ? op.demora : 350);
    }

    const api = {
      terminar,
      nivel: () => nivel,
      fase: () => fase,
      empezar,
      dato(id, v) { if (valores[id]) valores[id].textContent = String(v); },
      mov: () => mov,
      sumarMov(n) { mov += (n == null ? 1 : n); return mov; },
      ponerMov(n) { mov = n; },
      pistas: () => pistas,
      sumarPista() { pistas++; return pistas; },
      tiempoMs: () => Math.round(crono.transcurrido),
      guardar,
      ganar,
      nuevaPartida,
      despues,
      accion: (id) => botonesAccion[id],
      notificar,
      destruir() {
        destruido = true;
        temporizadores.forEach((id) => clearTimeout(id));
        temporizadores.clear();
        auto.detener(true);
        crono.destruir();
      }
    };

    /* Inicio: se retoma la partida guardada si es válida. Lo llama el juego cuando ya armó sus piezas. */
    api.arrancar = function arrancar() {
    const guardado = Guardado.cargar(ID);
    let valido = false;
    if (guardado && cfg.niveles[guardado.nivel] && guardado.extra && typeof guardado.extra === 'object') {
      try { valido = !!cfg.validar(guardado.extra, guardado.nivel); } catch (e) { valido = false; }
    }
    if (valido) {
      nivel = guardado.nivel;
      mov = Number(guardado.mov) || 0;
      pistas = Number(guardado.pistas) || 0;
      fase = 'jugando';
      marcarNivel();
      cfg.cargar(nivel, guardado.extra, api);
      if (conTiempo) { crono.reiniciar(Number(guardado.ms) || 0); crono.iniciar(); }
      notificar('Seguís con la partida que dejaste.');
    } else {
      if (guardado) Guardado.borrar(ID);
      const ultimo = String(Almacen.leer(ID + ':nivel', cfg.orden[0]));
      nuevaPartida(cfg.niveles[ultimo] ? ultimo : cfg.orden[0]);
    }
    return api;
    };
    return api;
  }

  global.BaseJuego = { montar };
})(window);
