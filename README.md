# Pasatiempos

Una colección de juegos de lógica, palabras y cartas que no se terminan nunca: cada partida se genera al momento, así que siempre hay un tablero nuevo. Hecho con HTML, CSS y JavaScript puro, sin frameworks ni paso de compilación.

Sitio en vivo: https://pasatiempos.vercel.app

## Juegos

32 juegos en total.

- **Lógica y números:** Sudoku, 2048, Nonogramas, Lights Out, Buscaminas, Torres de Hanoi, Mastermind, Flow, Puzzle deslizante, Pirámide matemática, Sort Liquid, Sokoban, Parking Jam, Loop Line, Tangram.
- **Palabras:** Crucigrama autodefinido, Sopa de letras, Ahorcado, Wordle, Anagramas, Spelling Bee, Conexiones, Criptograma, Escalera de palabras.
- **Clásicos y cartas:** Solitario, Mahjong solitario, Tateti, Memoria, Laberinto, Cuatro en línea, Reversi, Simon dice.

Al entrar a un juego que tiene desafío del día se elige entre partida libre y desafío del día. El desafío es un único tablero para todas las personas ese día.

Cada juego tiene un botón "Cómo se juega" que abre una mini partida guiada: un tablero chico donde se hacen los movimientos paso a paso, con pistas si te trabás (`js/tutorial.js` es el motor y `js/tutoriales-a.js` a `js/tutoriales-d.js` tienen el guion de cada juego).

## Características

- Partidas generadas aleatoriamente, con varios niveles de dificultad.
- Autoguardado: podés cerrar la pestaña y retomar la partida donde la dejaste.
- Controles con mouse, teclado y táctil (tocar, arrastrar y deslizar).
- Cinco paletas de color (Diario, Rosa, Bosque, Terminal y Océano), cada una con modo claro y oscuro. El diseño es el mismo en todas; solo cambian los colores, incluidos los de los juegos.
- Diseño responsive, probado desde 280 px de ancho hasta pantallas grandes.
- Ranking opcional en la nube con inicio de sesión de Google (Supabase). El sitio funciona completo sin cuenta; los récords se guardan en el navegador.
- Sin cookies de seguimiento ni analítica. Ver `privacidad.html`.

## Tecnología

- HTML, CSS y JavaScript sin dependencias (cada juego es un módulo en `js/`).
- Router por hash y política de seguridad de contenido estricta (sin scripts inline).
- Sistema de estilos con variables CSS en `css/`.
- Supabase (Postgres + autenticación) solo para el ranking.
- Hosting estático en Vercel.

## Estructura

```
index.html          Página principal
privacidad.html     Política de privacidad
vercel.json         Cabeceras de seguridad y URLs limpias
404.html            Página de error para direcciones que no existen
robots.txt, sitemap.xml, llms.txt
og-image.png        Imagen que se ve al compartir el enlace
css/                Estilos base, estilos temáticos y estilos de los juegos
js/                 Un archivo por juego, más almacenamiento, récords, tema y nube
supabase/           Scripts SQL del ranking (schema.sql y actualizaciones)
```

## Correr en local

No hay nada que instalar. Servilo con cualquier servidor estático, por ejemplo:

```
python -m http.server 8000
```

y abrí http://localhost:8000. Para el ranking en la nube hay que configurar tu propio proyecto de Supabase: ejecutar `supabase/schema.sql` y luego `supabase/actualizar-fase-2.sql`, y completar `js/config-nube.js` con la URL y la clave pública (anon) de tu proyecto. Nunca subas la clave de servicio (service_role).

## Publicar

```
vercel --prod
```

## Autora

Valentina Salama. Proyecto personal.
