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

-- ===== Productos, datos del negocio y fotos (editables desde el panel) =====
create table productos(id text primary key, nombre text not null, precio numeric not null default 0, descripcion text default '', img text default '', disponible boolean not null default true, orden int not null default 0);
create table ajustes(clave text primary key, valor text);
alter table productos enable row level security; alter table ajustes enable row level security;
create policy "ver productos" on productos for select to anon, authenticated using (true);
create policy "dueña edita productos" on productos for all to authenticated using (true) with check (true);
create policy "ver ajustes" on ajustes for select to anon, authenticated using (true);
create policy "dueña edita ajustes" on ajustes for all to authenticated using (true) with check (true);
insert into productos(id,nombre,precio,descripcion,img,disponible,orden) values
('rosa-1','1 Rosa',2,'Una rosa de listón hecha a mano, ideal para un detalle sencillo.','rosa-1.jpg',true,1),
('girasol','1 Girasol',3,'Un girasol artesanal que no se marchita.','girasol.jpg',true,2),
('rosas-3','3 Rosas',6,'Mini ramo de 3 rosas, con mariposa decorativa.','rosas-rosa.jpg',true,3),
('rosas-6','6 Rosas',10,'Ramo de 6 rosas con envoltura de papel.','rosas-amarillo.jpg',true,4),
('rosas-10','10 Rosas',17,'Ramo de 10 rosas hechas a mano.','rosas-amarillo.jpg',true,5),
('rosas-15','15 Rosas',25,'Ramo de 15 rosas, un regalo que se nota.','rosas-rosa.jpg',true,6),
('rosas-20','20 Rosas',33,'Ramo grande de 20 rosas.','ramo-dinero.jpg',true,7);
insert into storage.buckets(id,name,public) values('fotos','fotos',true) on conflict do nothing;
create policy "ver fotos" on storage.objects for select using (bucket_id='fotos');
create policy "dueña sube fotos" on storage.objects for insert to authenticated with check (bucket_id='fotos');
create policy "dueña cambia fotos" on storage.objects for update to authenticated using (bucket_id='fotos');
create policy "dueña borra fotos" on storage.objects for delete to authenticated using (bucket_id='fotos');
