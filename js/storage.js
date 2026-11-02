/* storage.js · Persistencia local
   Expone: Almacen (clave/valor genérico) y Guardado (partida en curso por juego).

   Todo se guarda en localStorage con el prefijo "pasatiempos:". Si el navegador
   no lo permite (modo privado estricto, etc.), usa memoria y la app sigue andando
   (los datos se pierden al cerrar la pestaña).

   Uso desde un juego:
     Guardado.guardar('sudoku', estado);       // guarda la partida
     const estado = Guardado.cargar('sudoku'); // null si no hay
     Guardado.borrar('sudoku');                // al ganar o empezar de nuevo
     const auto = Guardado.autoguardar('sudoku', () => miEstado(), { cada: 5000 });
     auto.detener(true);                       // al salir del juego (true = guardar una última vez)

   Si la función de autoguardar devuelve null/undefined, ese ciclo no guarda nada
   (útil cuando la partida ya terminó). */
(function (global) {
  'use strict';

  const PREFIJO = 'pasatiempos:';
  const respaldo = new Map();
  let usaLocalStorage = true;

  try {
    const prueba = PREFIJO + '__prueba__';
    global.localStorage.setItem(prueba, '1');
    global.localStorage.removeItem(prueba);
  } catch (e) {
    usaLocalStorage = false;
  }

  const Almacen = {
    get persistente() { return usaLocalStorage; },

    leer(clave, porDefecto = null) {
      try {
        const crudo = usaLocalStorage
          ? global.localStorage.getItem(PREFIJO + clave)
          : respaldo.get(PREFIJO + clave);
        if (crudo === null || crudo === undefined) return porDefecto;
        return JSON.parse(crudo);
      } catch (e) {
        return porDefecto;
      }
    },

    escribir(clave, valor) {
      try {
        const crudo = JSON.stringify(valor);
        if (usaLocalStorage) global.localStorage.setItem(PREFIJO + clave, crudo);
        else respaldo.set(PREFIJO + clave, crudo);
        return true;
      } catch (e) {
        return false;
      }
    },

    borrar(clave) {
      try {
        if (usaLocalStorage) global.localStorage.removeItem(PREFIJO + clave);
        else respaldo.delete(PREFIJO + clave);
      } catch (e) { /* nada que hacer */ }
    }
  };

  const VERSION = 1;
  const clavePartida = (juego) => 'partida:' + juego;

  const Guardado = {
    guardar(juego, estado) {
      return Almacen.escribir(clavePartida(juego), { v: VERSION, fecha: Date.now(), estado });
    },

    cargar(juego) {
      const dato = Almacen.leer(clavePartida(juego), null);
      return dato && dato.v === VERSION && dato.estado != null ? dato.estado : null;
    },

    existe(juego) {
      return Guardado.cargar(juego) !== null;
    },

    fecha(juego) {
      const dato = Almacen.leer(clavePartida(juego), null);
      return dato && dato.fecha ? dato.fecha : null;
    },

    borrar(juego) {
      Almacen.borrar(clavePartida(juego));
    },

    autoguardar(juego, obtenerEstado, { cada = 5000 } = {}) {
      function guardarYa() {
        let estado;
        try { estado = obtenerEstado(); } catch (e) { return false; }
        if (estado === null || estado === undefined) return false;
        return Guardado.guardar(juego, estado);
      }
      function alCambiarVisibilidad() {
        if (document.visibilityState === 'hidden') guardarYa();
      }

      const id = setInterval(guardarYa, cada);
      document.addEventListener('visibilitychange', alCambiarVisibilidad);
      global.addEventListener('pagehide', guardarYa);

      return {
        guardarYa,
        detener(guardarAntes = false) {
          if (guardarAntes) guardarYa();
          clearInterval(id);
          document.removeEventListener('visibilitychange', alCambiarVisibilidad);
          global.removeEventListener('pagehide', guardarYa);
        }
      };
    }
  };

  global.Almacen = Almacen;
  global.Guardado = Guardado;
})(window);
