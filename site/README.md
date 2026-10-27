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

## Lo que aún NO incluye
- Panel de administración y notificaciones push (requieren Supabase Auth y una función de servidor). Son la siguiente etapa.
- Hasta entonces, los pedidos llegan al WhatsApp de Ruth solo cuando el cliente pulsa enviar.
- Pendiente probar en un navegador real: yo no pude ejecutar el sitio.
