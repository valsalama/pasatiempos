/* theme.js · Modo claro / oscuro y estilo visual
   Expone: Tema, Estilo

   - Al entrar usa la elección guardada; si no hay, sigue el tema del sistema.
   - Si la persona elige un tema con el botón, queda guardado y deja de seguir al sistema.
   - Pone data-tema="claro|oscuro" en <html>; todos los colores salen de las variables del CSS.
   - Dispara el evento "tema:cambio" en document (detail.tema) por si un juego dibuja en canvas.
   - Estilo: diseño visual a elegir (diario, rosa, bosque, terminal, oceano). Se guarda y se pone
     en data-estilo de <html>; los colores y formas de cada uno están en css/estilos.css.
     Dispara "estilo:cambio" (detail.estilo).

   Este archivo se carga sin defer para evitar el destello de tema equivocado. */
(function (global) {
  'use strict';

  const CLAVE = 'tema';
  const COLOR_BARRA = { claro: '#f2f0eb', oscuro: '#151618' };
  const CLAVE_ESTILO = 'estilo';
  const ESTILOS = [
    { id: 'diario', nombre: 'Diario', desc: 'Papel de diario, tinta azul y líneas finas.' },
    { id: 'rosa', nombre: 'Rosa', desc: 'Vichy rosa, contornos gruesos y sombras de sticker.' },
    { id: 'bosque', nombre: 'Bosque', desc: 'Verdes y marrones, esquinas suaves.' },
    { id: 'terminal', nombre: 'Terminal', desc: 'Letra monoespaciada y verde sobre negro.' },
    { id: 'oceano', nombre: 'Océano', desc: 'Azules claros, sombras difusas y bordes redondeados.' }
  ];
  const IDS = ESTILOS.map(function (e) { return e.id; });
  const consulta = global.matchMedia ? global.matchMedia('(prefers-color-scheme: dark)') : null;

  function guardado() {
    const valor = Almacen.leer(CLAVE, null);
    return valor === 'claro' || valor === 'oscuro' ? valor : null;
  }

  function delSistema() {
    return consulta && consulta.matches ? 'oscuro' : 'claro';
  }

  function aplicar(tema) {
    document.documentElement.dataset.tema = tema;
    colorBarra(tema);
    document.dispatchEvent(new CustomEvent('tema:cambio', { detail: { tema } }));
  }

  /* El color de la barra del navegador sale del fondo del estilo elegido */
  function colorBarra(tema) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    let color = '';
    try { color = global.getComputedStyle(document.documentElement).getPropertyValue('--hoja').trim(); } catch (e) { /* sin estilos todavía */ }
    meta.setAttribute('content', color || COLOR_BARRA[tema]);
  }

  function estiloGuardado() {
    const valor = Almacen.leer(CLAVE_ESTILO, null);
    return IDS.indexOf(valor) >= 0 ? valor : 'diario';
  }

  function aplicarEstilo(id) {
    document.documentElement.dataset.estilo = id;
    colorBarra(Tema.actual());
    document.dispatchEvent(new CustomEvent('estilo:cambio', { detail: { estilo: id } }));
  }

  const Tema = {
    actual() {
      return document.documentElement.dataset.tema === 'oscuro' ? 'oscuro' : 'claro';
    },

    establecer(tema) {
      if (tema !== 'claro' && tema !== 'oscuro') return;
      Almacen.escribir(CLAVE, tema);
      aplicar(tema);
    },

    alternar() {
      Tema.establecer(Tema.actual() === 'oscuro' ? 'claro' : 'oscuro');
    },

    /* Conecta el botón: click para alternar y etiqueta accesible según el modo */
    vincular(boton) {
      function etiquetar() {
        const texto = Tema.actual() === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        boton.setAttribute('aria-label', texto);
        boton.title = texto;
      }
      boton.addEventListener('click', Tema.alternar);
      document.addEventListener('tema:cambio', etiquetar);
      etiquetar();
    }
  };

  // Si no hay elección guardada, acompañar los cambios del sistema
  function alCambiarSistema() {
    if (!guardado()) aplicar(delSistema());
  }
  if (consulta) {
    if (consulta.addEventListener) consulta.addEventListener('change', alCambiarSistema);
    else if (consulta.addListener) consulta.addListener(alCambiarSistema);
  }

  const Estilo = {
    lista() { return ESTILOS.slice(); },
    actual() { return document.documentElement.dataset.estilo || 'diario'; },
    establecer(id) {
      if (IDS.indexOf(id) < 0) return;
      Almacen.escribir(CLAVE_ESTILO, id);
      aplicarEstilo(id);
    }
  };

  // El estilo se pone antes que el tema para que el color de la barra sea el correcto
  document.documentElement.dataset.estilo = estiloGuardado();
  aplicar(guardado() || delSistema());

  global.Tema = Tema;
  global.Estilo = Estilo;
})(window);
