# Ranking con amigas: guía paso a paso (Supabase)

Tiempo: unos 20 minutos. Todo gratis. Vos hacés las cuentas y yo no necesito ninguna contraseña tuya:
al final solo me pasás (o pegás en `config-nube.js`) dos datos públicos.

## Qué vas a tener

- Ingreso con **Google** y/o con **link/código por mail**, más un **apodo** que es lo único que se ve.
- **Ranking del día** por juego y **ranking de rachas** (días seguidos).
- Tu mail nunca aparece para nadie. Podés borrar tu cuenta desde la página.
- Si no completás `config-nube.js`, la página funciona igual que hasta ahora.

---

## Paso 1 · Crear el proyecto

1. Entrá a supabase.com → **Start your project** → ingresá (con Google está bien).
2. **New project**. Nombre: `pasatiempos`. Región: **South America (São Paulo)**.
3. Te pide una *Database password*: usá el generador, guardala en tu gestor de contraseñas. No se usa en la página.
4. Esperá un par de minutos a que termine de crearse.

## Paso 2 · Crear las tablas y las reglas de seguridad

1. Menú izquierdo → **SQL Editor** → **New query**.
2. Abrí `supabase/schema.sql`, copiá TODO, pegalo y tocá **Run**.
3. Tiene que decir *Success. No rows returned*. Se puede correr de nuevo sin problema.

## Paso 3 · Decirle a Supabase cuál es tu página

1. Menú izquierdo → **Authentication** → **URL Configuration**.
2. **Site URL**: `https://pasatiempos.vercel.app`
3. En **Redirect URLs** agregá: `https://pasatiempos.vercel.app/` y `https://pasatiempos.vercel.app/**`
   (si más adelante usás otro dominio, agregalo acá también).
4. Guardá.

## Paso 4 · Elegir cómo se ingresa (mirá bien esto)

### Opción A · Google (la más fácil para tus amigas, recomendada)

1. En Google Cloud Console (console.cloud.google.com) creá un proyecto → **APIs & Services** → **OAuth consent screen** → tipo *External*, poné el nombre de la app y tu mail. Publicala (*Publish app*) para que pueda entrar cualquiera.
2. **Credentials** → **Create credentials** → **OAuth client ID** → *Web application*.
3. En **Authorized redirect URIs** pegá la URL que te muestra Supabase en **Authentication → Sign In / Providers → Google** (termina en `/auth/v1/callback`).
4. Copiá el **Client ID** y el **Client secret** de Google y pegalos en esa misma pantalla de Supabase. Activá **Google** y guardá.

### Opción B · Link mágico / código por mail

Ojo con una limitación de Supabase: el envío de mails que trae de fábrica **solo manda a los mails del equipo del proyecto (el tuyo) y con un tope de pocos mails por hora**. Para que lleguen a tus amigas necesitás configurar un servicio de envío propio (**Authentication → Emails → SMTP Settings**), como Resend o Brevo. Servicios como esos suelen pedir un dominio propio verificado para que los mails no caigan en spam. Si no tenés dominio, usá Google (opción A).

Si usás la opción B, en **Authentication → Emails → Templates → Magic Link** agregá el código al texto para que se pueda ingresar aunque el link se abra en otro navegador:

```
<h2>Tu código para entrar a Pasatiempos</h2>
<p>Código: <strong>{{ .Token }}</strong></p>
<p>O tocá este link: <a href="{{ .ConfirmationURL }}">Entrar</a></p>
```

### Después de elegir

En `js/config-nube.js` poné `false` en el método que NO configuraste (así no aparece un botón que no funciona).

## Paso 5 · Copiar los dos datos públicos

1. **Project Settings** (la ruedita) → **API Keys** (o **API**).
2. Copiá la **Project URL** (algo como `https://abcdefghijklmnop.supabase.co`).
3. Copiá la clave **publishable** (empieza con `sb_publishable_...`). Si tu panel solo muestra la **anon** (empieza con `eyJ`), usá esa.
4. Abrí `js/config-nube.js` y pegalas en `url` y `anonKey`.

**Nunca uses** la clave `secret` ni `service_role`: da acceso total a la base. La página rechaza esas claves si las pegás por error, pero además no las compartas con nadie, ni conmigo.

## Paso 6 · Publicar

1. Reemplazá los archivos en tu carpeta (los que te mandé).
2. En la carpeta del proyecto: `vercel --prod`.
3. Abrí la página: arriba tiene que aparecer un botón con un muñequito. Ingresá, elegí apodo y resolvé un desafío del día.
4. Mirá el **Ranking de hoy**: tenés que aparecer ahí.

## Cómo se cuida la seguridad

- **Nadie escribe directo en las tablas.** Solo se puede mediante funciones del servidor que validan todo (apodo válido, juego válido, resultado plausible).
- **La fecha la pone el servidor** (hora de Argentina): no sirve cambiarle la hora al celu.
- **Un solo resultado por persona, juego y día.**
- **Cada persona solo lee lo suyo.** El ranking sale por una función que devuelve apodo y valor, nunca el mail.
- **Política de seguridad del navegador** (`vercel.json`): la página solo carga código propio y solo se conecta a Supabase.
- **Sin claves secretas en la página**: lo que está en `config-nube.js` es público por diseño.
- **Todo texto de otras personas se muestra como texto**, nunca como código.

### Lo que NO se puede evitar

Esto es un juego que corre en el navegador de cada persona: el tiempo lo calcula el navegador. Alguien muy decidido con conocimientos técnicos podría mandar un tiempo falso. Lo que sí hacemos es rechazar valores imposibles (por ejemplo, un sudoku difícil en 3 segundos) y limitar a un resultado por día. Entre amigas funciona muy bien. Si algún día hace falta, se puede borrar a alguien desde **Table Editor → resultados** en el panel de Supabase.

## Mantenimiento útil

- **Borrar un resultado trucho**: Table Editor → `resultados` → borrar la fila.
- **Ver quiénes están registradas**: Authentication → Users (ahí sí se ve el mail; solo lo ves vos).
- **Proyecto gratuito dormido**: Supabase pausa los proyectos gratis tras 7 días sin uso. Se reactiva con un clic en el panel.
- **Límites de mails** (opción B): si alguien dice "no me llega el código", revisá spam y el tope por hora.

## Si algo falla

- *No aparece el botón de cuenta*: `url` o `anonKey` vacías o con formato raro (mirá la consola del navegador, F12).
- *"Este método de ingreso todavía no está activado"*: te falta activar Google (o el mail) en Supabase.
- *Vuelve a la página pero no inicia sesión*: revisá el Paso 3 (Site URL y Redirect URLs).
- *"Primero elegí un apodo"*: ingresaste pero falta guardar el apodo (botón del muñequito).
