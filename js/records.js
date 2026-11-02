/* records.js · Mejores marcas por juego y variante (dificultad, tamaño, etc.)
   Expone: Records

   Uso desde un juego:
     const r = Records.agregar('sudoku', 'facil', 185000, { modo: 'menor' });
         // r → { esRecord, enTop, posicion }  (posicion 1..5, o null si no entró al top)
     Records.mejor('sudoku', 'facil');   // 185000 | null
     Records.top('sudoku', 'facil');     // [{ valor, fecha }, ...] del mejor al peor

   modo 'menor': gana el valor más bajo (tiempos en milisegundos)
   modo 'mayor': gana el valor más alto (puntajes)

   Se guardan las 5 mejores marcas de cada variante. */
(function (global) {
  'use strict';

  const CLAVE = 'records';
  const MAX_POR_VARIANTE = 5;

  function leerTodo() {
    const datos = Almacen.leer(CLAVE, {});
    return datos && typeof datos === 'object' && !Array.isArray(datos) ? datos : {};
  }

  function guardarTodo(todo) {
    Almacen.escribir(CLAVE, todo);
  }

  const Records = {
    MAX: MAX_POR_VARIANTE,

    agregar(juego, variante, valor, { modo = 'menor' } = {}) {
      if (!Number.isFinite(valor)) return { esRecord: false, enTop: false, posicion: null };

      const todo = leerTodo();
      const porJuego = todo[juego] || (todo[juego] = {});
      const lista = Array.isArray(porJuego[variante]) ? porJuego[variante] : (porJuego[variante] = []);

      const entrada = { valor, fecha: Date.now() };
      lista.push(entrada);
      lista.sort((a, b) => (modo === 'mayor' ? b.valor - a.valor : a.valor - b.valor));

      // En un empate la marca nueva queda detrás de la anterior, así que no cuenta como récord
      const indice = lista.indexOf(entrada);
      lista.length = Math.min(lista.length, MAX_POR_VARIANTE);
      guardarTodo(todo);

      return {
        esRecord: indice === 0,
        enTop: indice < MAX_POR_VARIANTE,
        posicion: indice < MAX_POR_VARIANTE ? indice + 1 : null
      };
    },

    top(juego, variante) {
      const lista = (leerTodo()[juego] || {})[variante];
      return Array.isArray(lista) ? lista.slice() : [];
    },

    mejor(juego, variante) {
      const lista = Records.top(juego, variante);
      return lista.length ? lista[0].valor : null;
    },

    variantes(juego) {
      return Object.keys(leerTodo()[juego] || {});
    },

    todo() {
      return leerTodo();
    },

    borrarVariante(juego, variante) {
      const todo = leerTodo();
      if (todo[juego]) {
        delete todo[juego][variante];
        if (!Object.keys(todo[juego]).length) delete todo[juego];
        guardarTodo(todo);
      }
    },

    borrarJuego(juego) {
      const todo = leerTodo();
      delete todo[juego];
      guardarTodo(todo);
    },

    borrarTodo() {
      Almacen.borrar(CLAVE);
    }
  };

  global.Records = Records;
})(window);
