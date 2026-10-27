-- Ejecutar en Supabase > SQL Editor. Cualquiera puede CREAR un pedido; solo usuarios autenticados (la dueña) pueden leerlos o editarlos.
create table pedidos(id bigint generated always as identity primary key, creado timestamptz default now(), cliente text not null, telefono text not null, detalle text not null, fecha_deseada date, estado text not null default 'nuevo');
alter table pedidos enable row level security;
create policy "crear pedido" on pedidos for insert to anon with check (estado='nuevo');
create policy "dueña lee" on pedidos for select to authenticated using (true);
create policy "dueña edita" on pedidos for update to authenticated using (true);
