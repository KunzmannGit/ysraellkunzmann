-- ══════════════════════════════════════════════════════════════
--  YSRAELL KUNZMANN — esquema inicial
--
--  Como aplicar:
--    Supabase > SQL Editor > New query > cole tudo > Run
--
--  Modelo de seguranca:
--    · Visitante anonimo LE apenas imoveis publicados/reservados.
--    · Visitante anonimo ESCREVE apenas em leads (nunca le).
--    · Voce, autenticado, faz tudo.
--  Isso significa que a chave anon pode viver no navegador sem risco.
-- ══════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─────────────────────────── IMOVEIS ───────────────────────────

create table if not exists public.properties (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,

  title         text not null,
  headline      text,
  story         text,

  purpose       text not null default 'aluguel'
                check (purpose in ('aluguel', 'venda')),
  kind          text not null default 'apartamento'
                check (kind in ('apartamento','casa','cobertura','studio','sala-comercial','galpao','terreno')),
  status        text not null default 'rascunho'
                check (status in ('rascunho','publicado','reservado','alugado','vendido')),

  price         numeric(12,2),
  condo_fee     numeric(12,2),
  iptu          numeric(12,2),

  area          numeric(10,2),
  bedrooms      integer,
  suites        integer,
  bathrooms     integer,
  parking       integer,

  district      text,
  city          text,
  state         text,
  street        text,
  zip           text,
  lat           double precision,
  lng           double precision,

  features      text[] not null default '{}',

  -- { url, alt, caption?, width?, height? }
  cover         jsonb,
  -- [ { url, alt, caption? }, ... ]
  gallery       jsonb not null default '[]'::jsonb,
  -- { kind, poster, sources?, durationSeconds?, chapters: [...] }
  tour          jsonb,

  featured      boolean not null default false,
  via_partner   boolean not null default false,
  published_at  date not null default current_date,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Consultas do site: sempre filtram status e ordenam por destaque/data.
create index if not exists properties_status_idx    on public.properties (status);
create index if not exists properties_listing_idx   on public.properties (featured desc, published_at desc);
create index if not exists properties_purpose_idx   on public.properties (purpose);

-- ──────────────────────────── LEADS ────────────────────────────

create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  kind           text not null default 'contato'
                 check (kind in ('interesse','anuncio','contato')),

  name           text not null,
  contact        text not null,
  message        text,

  property_slug  text,
  property_title text,

  owner_address  text,
  owner_kind     text,
  owner_price    text,

  source         text default 'site',
  -- Fluxo de trabalho: voce marca conforme atende.
  handled        boolean not null default false,
  notes          text,

  created_at     timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_handled_idx on public.leads (handled, created_at desc);

-- ────────────────────── updated_at automatico ──────────────────

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_touch_updated_at on public.properties;
create trigger properties_touch_updated_at
  before update on public.properties
  for each row execute function public.touch_updated_at();

-- ─────────────────────────── RLS ───────────────────────────────

alter table public.properties enable row level security;
alter table public.leads      enable row level security;

-- Imoveis: leitura publica so do que esta no ar.
drop policy if exists "imoveis publicos sao legiveis" on public.properties;
create policy "imoveis publicos sao legiveis"
  on public.properties for select
  to anon, authenticated
  using (status in ('publicado', 'reservado'));

-- Voce, logado, enxerga e mexe em tudo (inclusive rascunhos).
drop policy if exists "autenticado le tudo" on public.properties;
create policy "autenticado le tudo"
  on public.properties for select
  to authenticated
  using (true);

drop policy if exists "autenticado escreve" on public.properties;
create policy "autenticado escreve"
  on public.properties for insert
  to authenticated
  with check (true);

drop policy if exists "autenticado atualiza" on public.properties;
create policy "autenticado atualiza"
  on public.properties for update
  to authenticated
  using (true) with check (true);

drop policy if exists "autenticado remove" on public.properties;
create policy "autenticado remove"
  on public.properties for delete
  to authenticated
  using (true);

-- Leads: qualquer visitante pode DEIXAR um. Ninguem anonimo pode LER.
drop policy if exists "qualquer um deixa lead" on public.leads;
create policy "qualquer um deixa lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "so autenticado le leads" on public.leads;
create policy "so autenticado le leads"
  on public.leads for select
  to authenticated
  using (true);

drop policy if exists "so autenticado atualiza leads" on public.leads;
create policy "so autenticado atualiza leads"
  on public.leads for update
  to authenticated
  using (true) with check (true);

-- ───────────────────────── STORAGE ─────────────────────────────
-- Bucket publico para fotos, videos e panoramas dos imoveis.

insert into storage.buckets (id, name, public)
values ('midia', 'midia', true)
on conflict (id) do nothing;

drop policy if exists "midia e publica para leitura" on storage.objects;
create policy "midia e publica para leitura"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'midia');

drop policy if exists "autenticado envia midia" on storage.objects;
create policy "autenticado envia midia"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'midia');

drop policy if exists "autenticado atualiza midia" on storage.objects;
create policy "autenticado atualiza midia"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'midia');

drop policy if exists "autenticado apaga midia" on storage.objects;
create policy "autenticado apaga midia"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'midia');
