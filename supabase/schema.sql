-- Supabase schema for the INOVEACM frontend and admin panel.
-- Execute this file via the Supabase SQL editor, supabase db reset, or any
-- Postgres client connected to the project. Replace placeholders (especially
-- <ADMIN_USER_ID>) before running the sample inserts.

create extension if not exists pgcrypto;

create type public.portfolio_midia_tipo as enum ('imagem', 'video');
create type public.analytics_event_tipo as enum (
  'page_view',
  'orcamento',
  'whatsapp',
  'instagram'
);

create table public.configuracoes (
  id uuid primary key default gen_random_uuid(),
  valor_m2 numeric not null default 350 check (valor_m2 > 0),
  valor_minimo numeric not null default 1500 check (valor_minimo > 0),
  valor_instalacao numeric not null default 800 check (valor_instalacao >= 0),
  valor_letreiro numeric not null default 1200 check (valor_letreiro >= 0),
  logo_url text,
  whatsapp text,
  email text,
  instagram text,
  endereco text,
  telefone text,
  created_at timestamptz not null default now()
);

create table public.servicos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text not null,
  imagem_url text,
  created_at timestamptz not null default now()
);

create table public.portfolio_categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

create table public.portfolio (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text not null,
  midia_url text,
  tipo public.portfolio_midia_tipo not null default 'imagem',
  categoria_id uuid references public.portfolio_categorias(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.analytics (
  id uuid primary key default gen_random_uuid(),
  tipo public.analytics_event_tipo not null,
  pagina text not null default '',
  ip_hash text not null,
  user_agent text not null,
  referrer text,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role = 'admin'),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.is_admin_user()
returns boolean language sql stable as $$
  select exists(
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

--
-- Row level security
--
alter table public.configuracoes enable row level security;
alter table public.servicos enable row level security;
alter table public.portfolio_categorias enable row level security;
alter table public.portfolio enable row level security;
alter table public.analytics enable row level security;
alter table public.user_roles enable row level security;

create policy public_read_configuracoes
  on public.configuracoes
  for select
  using (auth.role() in ('anon', 'authenticated'));

create policy admin_insert_configuracoes
  on public.configuracoes
  for insert
  with check (is_admin_user());

create policy admin_update_configuracoes
  on public.configuracoes
  for update
  using (is_admin_user())
  with check (is_admin_user());

create policy admin_delete_configuracoes
  on public.configuracoes
  for delete
  using (is_admin_user());

create policy public_read_servicos
  on public.servicos
  for select
  using (auth.role() in ('anon', 'authenticated'));

create policy admin_insert_servicos
  on public.servicos
  for insert
  with check (is_admin_user());

create policy admin_update_servicos
  on public.servicos
  for update
  using (is_admin_user())
  with check (is_admin_user());

create policy admin_delete_servicos
  on public.servicos
  for delete
  using (is_admin_user());

create policy public_read_portfolio_categorias
  on public.portfolio_categorias
  for select
  using (auth.role() in ('anon', 'authenticated'));

create policy admin_insert_portfolio_categorias
  on public.portfolio_categorias
  for insert
  with check (is_admin_user());

create policy admin_update_portfolio_categorias
  on public.portfolio_categorias
  for update
  using (is_admin_user())
  with check (is_admin_user());

create policy admin_delete_portfolio_categorias
  on public.portfolio_categorias
  for delete
  using (is_admin_user());

create policy public_read_portfolio
  on public.portfolio
  for select
  using (auth.role() in ('anon', 'authenticated'));

create policy admin_insert_portfolio
  on public.portfolio
  for insert
  with check (is_admin_user());

create policy admin_update_portfolio
  on public.portfolio
  for update
  using (is_admin_user())
  with check (is_admin_user());

create policy admin_delete_portfolio
  on public.portfolio
  for delete
  using (is_admin_user());

create policy track_analytics_insert
  on public.analytics
  for insert
  with check (auth.role() in ('anon', 'authenticated'));

create policy admin_read_analytics
  on public.analytics
  for select
  using (is_admin_user());

create policy user_read_roles
  on public.user_roles
  for select
  using (auth.uid() = user_id);

create policy admin_insert_roles
  on public.user_roles
  for insert
  with check (is_admin_user());

create policy admin_update_roles
  on public.user_roles
  for update
  using (is_admin_user())
  with check (is_admin_user());

create policy admin_delete_roles
  on public.user_roles
  for delete
  using (is_admin_user());

--
-- Seed helpers (replace <ADMIN_USER_ID> manually via SQL editor)
--
insert into public.configuracoes (valor_m2, valor_minimo, valor_instalacao, valor_letreiro)
values (350, 1500, 800, 1200)
on conflict (id) do nothing;

-- insert the first admin with the project service role or SQL editor before
-- the anonymous clients hit the dashboard. Replace the placeholder below:
-- insert into public.user_roles (user_id, role) values ('<ADMIN_USER_ID>', 'admin');
