drop table if exists public.orders cascade;
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  items jsonb not null default '[]'::jsonb,
  total_price numeric not null,
  payment_method text not null,
  payment_status text not null default 'pending', -- 'pending', 'paid', 'failed'
  preference_id text, -- ID from Mercado Pago
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.orders enable row level security;

-- Políticas de acceso
-- Público (anon) puede insertar órdenes
drop policy if exists "Anyone can insert orders" on public.orders;
create policy "Anyone can insert orders"
on public.orders for insert
with check (true);

-- Sólo autenticados/admins pueden ver y modificar las órdenes
drop policy if exists "Authenticated users can view orders" on public.orders;
create policy "Authenticated users can view orders"
on public.orders for select
to authenticated
using (true);

drop policy if exists "Authenticated users can update orders" on public.orders;
create policy "Authenticated users can update orders"
on public.orders for update
to authenticated
using (true);
