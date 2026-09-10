-- ══════════════════════════════════════════════════════════════
--  Agenda — compromissos do corretor
--
--  Tabela inteiramente privada: diferente de properties e leads,
--  nao existe nenhum caso de uso publico aqui. So o Ysraell,
--  autenticado, le e escreve. O visitante do site nunca toca nisto.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),

  title        text not null,
  -- Instante exato do compromisso, em UTC (timestamptz). O
  -- deslocamento para o horario de Brasilia (-03:00, fixo desde
  -- que o Brasil aboliu o horario de verao em 2019) fica por conta
  -- de quem le, nunca do banco.
  starts_at    timestamptz not null,
  location     text,
  notes        text,

  -- Referencia solta ao imovel, so para contexto visual na lista.
  -- Sem chave estrangeira: se o imovel for apagado, o compromisso
  -- nao deve sumir ou quebrar junto.
  property_slug  text,
  property_title text,

  -- Marca se o lembrete do dia ja foi mandado, para a rotina diaria
  -- nao mandar duas vezes o mesmo aviso.
  reminder_sent  boolean not null default false,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists appointments_starts_at_idx on public.appointments (starts_at);
create index if not exists appointments_reminder_idx  on public.appointments (reminder_sent, starts_at);

drop trigger if exists appointments_touch_updated_at on public.appointments;
create trigger appointments_touch_updated_at
  before update on public.appointments
  for each row execute function public.touch_updated_at();

-- ─────────────────────────── RLS ───────────────────────────────

alter table public.appointments enable row level security;

-- So autenticado toca na agenda. Nenhuma politica para `anon`:
-- sem GRANT nem policy, o visitante nao ve nem a existencia da tabela.
drop policy if exists "autenticado gerencia a agenda" on public.appointments;
create policy "autenticado gerencia a agenda"
  on public.appointments for all
  to authenticated
  using (true)
  with check (true);

-- ────────────────────── PERMISSOES EXPLICITAS ──────────────────
-- O projeto foi criado com "Automatically expose new tables"
-- desligado (ver migracao 20260909210000). Toda tabela nova
-- precisa de GRANT explicito ou fica invisivel para a API.

grant select, insert, update, delete on public.appointments to authenticated;

-- O lembrete diario roda sem sessao de usuario (e um cron, nao uma
-- pessoa logada), entao so o service_role consegue ler e marcar os
-- compromissos do dia. E exatamente o caso de uso para o qual essa
-- chave existe: automacao server-side sem contexto de sessao.
grant select, update on public.appointments to service_role;
