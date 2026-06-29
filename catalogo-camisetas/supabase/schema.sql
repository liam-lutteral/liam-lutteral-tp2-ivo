-- Ejecutar en el SQL Editor de Supabase

create table if not exists public.camisetas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  equipo varchar(255) not null,
  temporada varchar(50),
  tipo varchar(100),
  marca varchar(100),
  imagen_url text,
  descripcion text,
  created_at timestamptz default now()
);

alter table public.camisetas enable row level security;

create policy "Usuarios gestionan sus propias camisetas"
on public.camisetas
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
