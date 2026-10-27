# Ruth's Flowers
Sitio estático (HTML/CSS/JS, sin build) para GitHub Pages gratuito.

## Publicar
1. Crea un repositorio en GitHub y sube todo el contenido de esta carpeta.
2. Settings > Pages > Source: **GitHub Actions**. Cada push a `main` publica el sitio.
3. Dominio propio (opcional): Settings > Pages > Custom domain, y apunta el DNS según las indicaciones de GitHub.

## Editar datos
Todo está en `config.js`: número de WhatsApp, horarios, mapa, productos y precios. Las fotos están en `assets/img/`.
Faltan por completar: horarios, mapa y correo (opcionales).

## Registrar pedidos (opcional, Supabase gratis)
1. Crea un proyecto en supabase.com y ejecuta `supabase.sql`.
2. Copia la URL y la clave **anon** en `config.js`. Nunca subas la clave `service_role`.
3. Sin esto, los pedidos siguen funcionando solo por WhatsApp.

## Panel privado y notificaciones push (`admin.html`)
1. **Dueña como único usuario:** en Supabase > Authentication: crea su usuario (correo y contraseña) y **desactiva "Allow new users to sign up"**. Las políticas RLS de `supabase.sql` solo dejan leer y editar pedidos a usuarios autenticados.
2. **Claves VAPID:** ejecuta `npx web-push generate-vapid-keys`. Pon la clave **pública** en `config.js` (`vapidPublicKey`). La privada nunca va al repositorio.
3. **Función de servidor:** instala la CLI de Supabase y ejecuta:
   `supabase functions deploy notificar --no-verify-jwt`
   `supabase secrets set VAPID_PUBLIC=... VAPID_PRIVATE=... VAPID_SUBJECT=mailto:tucorreo@ejemplo.com WEBHOOK_SECRET=una-clave-larga`
4. **Aviso automático:** Supabase > Database > Webhooks > crear para la tabla `pedidos`, evento INSERT, tipo Edge Function `notificar`, con el encabezado `x-webhook-secret` igual al secreto anterior.
5. **En el teléfono de Ruth:** abrir `https://TU-USUARIO.github.io/TU-REPO/admin.html`, entrar y pulsar "Activar notificaciones".

### Límites reales
- Requiere HTTPS (GitHub Pages ya lo da). En iPhone solo funciona con iOS 16.4 o superior y con la página agregada a la pantalla de inicio.
- Chrome en Android es lo más fiable. El ahorro de batería o restringir la app puede retrasar o bloquear avisos.
- Si el cliente abre WhatsApp pero no envía el mensaje, el pedido igual queda registrado como "nuevo" (se guarda al pulsar el botón). Ruth debe confirmar siempre con el cliente.

## Lo que aún NO incluye
- Editar productos, fotos, precios y datos de contacto desde el panel: por ahora se editan en `config.js` y `assets/img/`.
- No probé nada en un navegador real ni contra un proyecto de Supabase real.
