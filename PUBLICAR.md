# Cómo publicar Pasatiempos gratis

Tu página es 100 % estática: no necesita servidor ni base de datos para funcionar.
Solo hay que subir la carpeta tal cual está. Lo único que se usa desde internet es
la tipografía de Google Fonts, y si no carga, la página usa la del sistema.

## Qué subir

Toda la carpeta `pasatiempos/`:

```
index.html
vercel.json          (solo lo usa Vercel; en otros servicios no molesta)
css/  styles.css  juegos.css
js/   (todos los .js, incluida la carpeta js/vendor/)
```

Si usás el ranking: la carpeta `supabase/` y `GUIA-SUPABASE.md` son para vos. Si se suben junto con todo no pasa nada: no tienen ninguna clave.

`PUBLICAR.md` no hace falta subirlo.

## Opción 1 · Vercel (la que querías)

**Sin GitHub (la más rápida):**
1. Creá una cuenta en vercel.com.
2. Instalá la herramienta una sola vez: `npm i -g vercel`.
3. Parate en la carpeta `pasatiempos/` y corré `vercel`.
4. Respondé las preguntas (framework: "Other", carpeta de salida: `.`). Te da un link tipo
   `pasatiempos-xxxx.vercel.app`.
5. Para actualizar después de cambiar algo: `vercel --prod`.

**Con GitHub (si algún día lo querés):** creás un repo con la carpeta, entrás a Vercel,
"Add New → Project", elegís el repo y "Deploy". Cada vez que subas cambios se actualiza solo.

## Opción 2 · Netlify Drop (sin instalar nada)

1. Entrá a app.netlify.com/drop.
2. Arrastrá la carpeta `pasatiempos/` a la página.
3. Listo: te da un link al instante. Podés cambiarle el nombre en "Site settings".

## Opción 3 · GitHub Pages

1. Subí la carpeta a un repo.
2. En el repo: Settings → Pages → "Deploy from a branch" → rama `main`, carpeta `/ (root)`.
3. A los minutos queda en `tu-usuario.github.io/nombre-del-repo`.

## Después de publicar, probá esto

- Abrí el link desde tu celu y recargá una vez: tiene que verse igual que en la compu.
- Jugá una partida, cerrá la pestaña y volvé: tiene que aparecer "Partida en curso".
- Cambiá a modo oscuro y recargá: se tiene que acordar.
- Tus marcas y partidas se guardan en el navegador de cada persona. Si abrís el link en
  otro celu o en otro navegador, ahí empieza de cero. Para competir con tus amigas
  seguí `GUIA-SUPABASE.md` (ranking del día y rachas en la nube).

## Cómo sumar palabras

- Sopa de letras: `js/palabras-sopa.js`, agregá palabras dentro de un tema (separadas por espacios).
- Autodefinido: `js/palabras.js`, una línea nueva como `['PALABRA', 'definición fácil', '*definición difícil']`.
  La palabra va en mayúsculas y sin tildes; la definición que empieza con `*` cuenta como difícil.
- Ahorcado: `js/palabras-ahorcado.js`, en la lista `MAS` de la categoría que quieras.

## Si algo falla

- Pantalla en blanco: abrí la consola del navegador (F12) y mirá el error en rojo.
  Casi siempre es un archivo que falta subir o un `.js` fuera de la carpeta `js/`.
- No se ven los cambios: recargá sin caché (Ctrl + Shift + R, o en el celu cerrá y abrí la pestaña).
