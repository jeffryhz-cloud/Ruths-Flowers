-- Ejecutar en Supabase > SQL Editor. Cualquiera puede CREAR un pedido; solo usuarios autenticados (la dueña) pueden leerlos o editarlos.
create table pedidos(id bigint generated always as identity primary key, creado timestamptz default now(), cliente text not null, telefono text not null, detalle text not null, fecha_deseada date, estado text not null default 'nuevo');
alter table pedidos enable row level security;
create policy "crear pedido" on pedidos for insert to anon with check (estado='nuevo');
create policy "dueña lee" on pedidos for select to authenticated using (true);
create policy "dueña edita" on pedidos for update to authenticated using (true);

-- Suscripciones push del teléfono de la dueña
create table push_subs(endpoint text primary key, p256dh text not null, auth text not null, creado timestamptz default now());
alter table push_subs enable row level security;
create policy "dueña gestiona push" on push_subs for all to authenticated using (true) with check (true);
-- Para ver pedidos nuevos en vivo:
alter publication supabase_realtime add table pedidos;
