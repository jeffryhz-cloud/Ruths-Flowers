// Edge Function: se ejecuta con un Database Webhook (INSERT en "pedidos") y envía push a los teléfonos suscritos.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";
webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT")!, Deno.env.get("VAPID_PUBLIC")!, Deno.env.get("VAPID_PRIVATE")!);
Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) return new Response("no autorizado", { status: 401 });
  const { record } = await req.json();
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: subs } = await sb.from("push_subs").select("*");
  const payload = JSON.stringify({ titulo: "Nuevo pedido 🌸", cuerpo: `${record.cliente} · entrega ${record.fecha_deseada ?? ""}` });
  await Promise.all((subs ?? []).map(async (s) => {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload); }
    catch (e) { if ([404, 410].includes(e.statusCode)) await sb.from("push_subs").delete().eq("endpoint", s.endpoint); }
  }));
  return new Response("ok");
});
