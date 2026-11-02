/* config-nube.js · datos públicos de tu proyecto de Supabase.
   Se completa UNA vez, siguiendo GUIA-SUPABASE.md. Mientras url y anonKey estén vacías,
   la página funciona igual que siempre (todo guardado en el navegador) y no muestra nada de la nube.

   ¡OJO! Acá va SOLO la clave "publishable" (o "anon"). Es pública por diseño: la seguridad
   la dan las reglas de la base (schema.sql). NUNCA pegues la clave "secret" ni "service_role". */
window.CONFIG_NUBE = {
  url: 'https://nkjaxrypiqetkuxlmavx.supabase.co',      // ej: 'https://abcdefghijklmnop.supabase.co'
  anonKey: 'sb_publishable_FcdL-h0CvjKcO07NIWr5mg_9K7SC_Gr',  // ej: 'sb_publishable_xxxxxxxxxxxxxxxx'
  metodos: {
    google: true,  // botón "Entrar con Google" (poné false si no lo configuraste en Supabase)
    email: false    // link mágico / código por mail (poné false si no configuraste el envío de mails)
  }
};
