/* nube.js · conexión con Supabase: cuenta (Google o link mágico por mail), apodo, resultados y ranking.
   Si no hay configuración, Nube.activa es false y todo lo demás es inofensivo (no hace nada).

   Seguridad:
   - Solo se usa la clave pública. Se rechaza una clave "secret"/"service_role" si alguien la pega por error.
   - Todo lo que se escribe pasa por funciones del servidor que validan (ver supabase/schema.sql).
   - Si no hay conexión, el resultado queda pendiente en el navegador y se manda después.

   Expone: Nube */
(function (global) {
  'use strict';

  const cfg = global.CONFIG_NUBE || {};
  const metodos = Object.assign({ google: true, email: true }, cfg.metodos || {});
  const URL_OK = /^https:\/\/[a-z0-9-]{8,40}\.supabase\.co\/?$/i;

  function claveSegura(k) {
    if (typeof k !== 'string' || !k) return false;
    if (/^sb_secret_/.test(k)) return false;
    if (/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(k)) return true;
    const partes = k.split('.');
    if (partes.length !== 3) return false;
    try {
      const rol = JSON.parse(atob(partes[1].replace(/-/g, '+').replace(/_/g, '/'))).role;
      return rol === 'anon';
    } catch (e) { return false; }
  }

  let problema = '';
  if ((cfg.url || cfg.anonKey) && !URL_OK.test(cfg.url || '')) problema = 'La url de Supabase no tiene el formato esperado.';
  else if (cfg.anonKey && !claveSegura(cfg.anonKey)) problema = 'La clave no es una clave pública (publishable/anon). No se usa.';
  if (problema && global.console) console.error('[Nube] ' + problema);

  const activa = !problema && URL_OK.test(cfg.url || '') && claveSegura(cfg.anonKey) && !!(global.supabase && global.supabase.createClient);

  let cliente = null;
  let sesion = null;
  let apodo = null;
  let listo = !activa;
  const oyentes = new Set();

  function estado() {
    return { activa, listo, adentro: !!sesion, apodo, sinApodo: !!sesion && !apodo && listo, metodos };
  }
  function emitir() { const e = estado(); oyentes.forEach((fn) => { try { fn(e); } catch (x) { /* un oyente roto no frena a los demás */ } }); }
  function alCambiar(fn) { oyentes.add(fn); return () => oyentes.delete(fn); }

  function mensajeDe(error) {
    if (!error) return 'Algo salió mal. Probá de nuevo.';
    const m = String(error.message || error);
    if (/failed to fetch|networkerror|load failed|network request/i.test(m)) return 'No hay conexión. Probá de nuevo en un rato.';
    if (/rate limit|too many|security purposes|over_email_send_rate_limit/i.test(m)) return 'Hiciste muchos intentos seguidos. Esperá unos minutos y probá otra vez.';
    if (/token has expired|invalid.*token|otp/i.test(m)) return 'El código no es válido o ya venció. Pedí uno nuevo.';
    if (/invalid.*email|unable to validate email/i.test(m)) return 'Ese mail no parece válido.';
    if (/provider is not enabled|unsupported provider/i.test(m)) return 'Este método de ingreso todavía no está activado.';
    if (/signups? not allowed|not allowed/i.test(m)) return 'No se pudo crear la cuenta con ese mail.';
    // Los mensajes de nuestras funciones (apodo repetido, resultado no válido, etc.) ya vienen en castellano
    if (/[áéíóúñ¿]|Ese apodo|Podés|Primero|Tenés|Resultado no válido|El apodo/.test(m)) return m;
    return 'No se pudo completar. Probá de nuevo.';
  }

  /* --- Resultados pendientes (guardados en el navegador hasta que se puedan mandar) --- */
  const CLAVE_PEND = 'nube:pendientes';
  const pendientes = () => global.Almacen.leer(CLAVE_PEND, {}) || {};
  function guardarPendiente(juego, fecha, valor) {
    const p = pendientes();
    p[juego] = { fecha, valor: Math.round(valor) };
    global.Almacen.escribir(CLAVE_PEND, p);
  }
  function hayPendientes() {
    const hoy = global.Diario.hoy();
    return Object.keys(pendientes()).filter((j) => pendientes()[j].fecha === hoy);
  }

  let sincronizando = null;
  function sincronizar() {
    if (!activa || !sesion || !apodo) return Promise.resolve(0);
    if (sincronizando) return sincronizando;
    sincronizando = (async () => {
      let enviados = 0;
      const p = pendientes();
      const hoy = global.Diario.hoy();
      for (const juego of Object.keys(p)) {
        if (p[juego].fecha !== hoy) { delete p[juego]; continue; } // el servidor solo acepta el desafío de hoy
        try {
          const { error } = await cliente.rpc('enviar_resultado', { p_juego: juego, p_valor: p[juego].valor });
          if (!error) { delete p[juego]; enviados++; continue; }
          if (/no válido/i.test(error.message || '')) { delete p[juego]; continue; } // rechazado: no insistir
          break; // error de red o de sesión: queda pendiente
        } catch (e) { break; }
      }
      global.Almacen.escribir(CLAVE_PEND, p);
      return enviados;
    })().finally(() => { sincronizando = null; });
    return sincronizando;
  }

  async function cargarPerfil() {
    apodo = null;
    if (!sesion) return;
    try {
      const { data } = await cliente.from('perfiles').select('apodo').eq('id', sesion.user.id).maybeSingle();
      apodo = data && data.apodo ? data.apodo : null;
    } catch (e) { /* sin conexión: queda sin apodo cargado hasta el próximo intento */ }
  }

  async function iniciar() {
    if (!activa) { emitir(); return; }
    cliente = global.supabase.createClient(cfg.url.replace(/\/$/, ''), cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' }
    });
    cliente.auth.onAuthStateChange((evento, s) => {
      // Importante: no llamar a Supabase directamente dentro de este callback (puede trabarse)
      setTimeout(async () => {
        const antes = sesion && sesion.user ? sesion.user.id : null;
        sesion = s;
        if (!s) apodo = null;
        else if ((s.user && s.user.id) !== antes || evento === 'SIGNED_IN') await cargarPerfil();
        listo = true;
        emitir();
        sincronizar().then((n) => { if (n) emitir(); });
      }, 0);
    });
    try {
      const { data } = await cliente.auth.getSession();
      sesion = data && data.session ? data.session : null;
      await cargarPerfil();
    } catch (e) { sesion = null; }
    listo = true;
    emitir();
    sincronizar();
  }

  /* --- Cuenta --- */
  const redirigirA = () => global.location.origin + global.location.pathname;

  async function enviarLink(email) {
    if (!activa) return { ok: false, mensaje: 'La nube no está configurada.' };
    const limpio = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpio) || limpio.length > 254) return { ok: false, mensaje: 'Ese mail no parece válido.' };
    try {
      const { error } = await cliente.auth.signInWithOtp({ email: limpio, options: { emailRedirectTo: redirigirA(), shouldCreateUser: true } });
      return error ? { ok: false, mensaje: mensajeDe(error) } : { ok: true, email: limpio };
    } catch (e) { return { ok: false, mensaje: mensajeDe(e) }; }
  }

  async function verificarCodigo(email, codigo) {
    if (!activa) return { ok: false, mensaje: 'La nube no está configurada.' };
    const token = String(codigo || '').replace(/\s+/g, '');
    if (!/^\d{6,8}$/.test(token)) return { ok: false, mensaje: 'El código tiene 6 números.' };
    try {
      const { error } = await cliente.auth.verifyOtp({ email, token, type: 'email' });
      return error ? { ok: false, mensaje: mensajeDe(error) } : { ok: true };
    } catch (e) { return { ok: false, mensaje: mensajeDe(e) }; }
  }

  async function entrarConGoogle() {
    if (!activa) return { ok: false, mensaje: 'La nube no está configurada.' };
    try {
      const { error } = await cliente.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirigirA() } });
      return error ? { ok: false, mensaje: mensajeDe(error) } : { ok: true };
    } catch (e) { return { ok: false, mensaje: mensajeDe(e) }; }
  }

  async function guardarApodo(texto) {
    if (!activa || !sesion) return { ok: false, mensaje: 'Primero tenés que ingresar.' };
    try {
      const { data, error } = await cliente.rpc('guardar_apodo', { p_apodo: texto });
      if (error) return { ok: false, mensaje: mensajeDe(error) };
      apodo = data;
      emitir();
      sincronizar().then((n) => { if (n) emitir(); });
      return { ok: true, apodo: data };
    } catch (e) { return { ok: false, mensaje: mensajeDe(e) }; }
  }

  async function salir() {
    if (!activa) return;
    try { await cliente.auth.signOut(); } catch (e) { /* si falla la red igual se cierra acá */ }
    sesion = null; apodo = null;
    emitir();
  }

  async function borrarCuenta() {
    if (!activa || !sesion) return { ok: false, mensaje: 'No hay sesión.' };
    try {
      const { error } = await cliente.rpc('borrar_mi_cuenta');
      if (error) return { ok: false, mensaje: mensajeDe(error) };
      global.Almacen.borrar(CLAVE_PEND);
      try { await cliente.auth.signOut({ scope: 'local' }); } catch (e) { /* la cuenta ya no existe */ }
      sesion = null; apodo = null;
      emitir();
      return { ok: true };
    } catch (e) { return { ok: false, mensaje: mensajeDe(e) }; }
  }

  /* --- Rankings --- */
  async function ranking(juego) {
    if (!activa) return { ok: false, mensaje: 'La nube no está configurada.' };
    try {
      const { data, error } = await cliente.rpc('ranking_dia', { p_juego: juego });
      return error ? { ok: false, mensaje: mensajeDe(error) } : { ok: true, filas: data || [] };
    } catch (e) { return { ok: false, mensaje: mensajeDe(e) }; }
  }

  async function rachas() {
    if (!activa) return { ok: false, mensaje: 'La nube no está configurada.' };
    try {
      const { data, error } = await cliente.rpc('ranking_rachas');
      return error ? { ok: false, mensaje: mensajeDe(error) } : { ok: true, filas: data || [] };
    } catch (e) { return { ok: false, mensaje: mensajeDe(e) }; }
  }

  /* Cada vez que se resuelve el desafío de hoy por primera vez, se manda (o queda pendiente) */
  if (global.Diario && typeof global.Diario.alTerminar === 'function') {
    global.Diario.alTerminar(({ juego, fecha, valor }) => {
      if (!activa) return;
      guardarPendiente(juego, fecha, valor);
      sincronizar().then((n) => {
        if (n && global.Pasatiempos) global.Pasatiempos.notificar('Tu resultado ya está en el ranking.');
        else if (!n && global.Pasatiempos && !(sesion && apodo)) global.Pasatiempos.notificar('Ingresá con tu cuenta para aparecer en el ranking.');
        emitir();
      });
    });
  }

  global.Nube = {
    activa,
    estado,
    alCambiar,
    iniciar,
    enviarLink,
    verificarCodigo,
    entrarConGoogle,
    guardarApodo,
    salir,
    borrarCuenta,
    ranking,
    rachas,
    sincronizar,
    hayPendientes
  };
})(window);
