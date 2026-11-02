/* timer.js · Cronómetro
   Expone: Cronometro (clase)

   Uso desde un juego:
     const crono = new Cronometro({ onTick: (ms) => { pantalla.textContent = Cronometro.formatear(ms); } });
     crono.iniciar();           // arranca (o sigue)
     crono.pausar();
     crono.alternar();          // pausa/sigue, devuelve true si quedó corriendo
     crono.reiniciar();         // vuelve a 0 (o a los ms que le pases)
     const ms = crono.detener();// pausa y devuelve el tiempo final en milisegundos
     crono.transcurrido;        // ms actuales
     crono.destruir();          // al salir del juego

   Opciones:
     inicial          ms desde donde arrancar (para retomar una partida guardada)
     intervalo        cada cuántos ms avisar a onTick (por defecto 250)
     pausarAlOcultar  se pausa solo si cambiás de pestaña y sigue al volver (por defecto sí) */
(function (global) {
  'use strict';

  const ahora = () => (global.performance && global.performance.now ? global.performance.now() : Date.now());

  class Cronometro {
    constructor({ onTick = null, intervalo = 250, inicial = 0, pausarAlOcultar = true } = {}) {
      this._onTick = onTick;
      this._intervalo = intervalo;
      this._acumulado = Math.max(0, Number(inicial) || 0);
      this._inicio = 0;
      this._corriendo = false;
      this._id = null;
      this._pausadoPorOculto = false;
      this._pausarAlOcultar = pausarAlOcultar;

      this._alCambiarVisibilidad = () => {
        if (document.hidden) {
          if (this._corriendo) {
            this._pausadoPorOculto = true;
            this._detener();
          }
        } else if (this._pausadoPorOculto) {
          this._pausadoPorOculto = false;
          this._arrancar();
        }
      };
      if (pausarAlOcultar) document.addEventListener('visibilitychange', this._alCambiarVisibilidad);
    }

    _arrancar() {
      if (this._corriendo) return;
      this._corriendo = true;
      this._inicio = ahora();
      this._id = setInterval(() => this._emitir(), this._intervalo);
      this._emitir();
    }

    _detener() {
      if (!this._corriendo) return;
      this._acumulado += ahora() - this._inicio;
      this._corriendo = false;
      clearInterval(this._id);
      this._id = null;
      this._emitir();
    }

    _emitir() {
      if (this._onTick) this._onTick(this.transcurrido, this);
    }

    get transcurrido() {
      return this._acumulado + (this._corriendo ? ahora() - this._inicio : 0);
    }

    get corriendo() {
      return this._corriendo;
    }

    iniciar() {
      this._pausadoPorOculto = false;
      this._arrancar();
    }

    pausar() {
      this._pausadoPorOculto = false;
      this._detener();
    }

    alternar() {
      if (this._corriendo) this.pausar();
      else this.iniciar();
      return this._corriendo;
    }

    reiniciar(ms = 0) {
      this._pausadoPorOculto = false;
      this._detener();
      this._acumulado = Math.max(0, Number(ms) || 0);
      this._emitir();
    }

    detener() {
      this.pausar();
      return this._acumulado;
    }

    destruir() {
      this.pausar();
      document.removeEventListener('visibilitychange', this._alCambiarVisibilidad);
      this._onTick = null;
    }

    /* 65000 → "01:05"   |   3725000 → "1:02:05" */
    static formatear(ms) {
      const total = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      const dos = (n) => String(n).padStart(2, '0');
      return h > 0 ? h + ':' + dos(m) + ':' + dos(s) : dos(m) + ':' + dos(s);
    }
  }

  global.Cronometro = Cronometro;
})(window);
