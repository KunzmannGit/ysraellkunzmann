-- Acrescenta "loja" aos tipos de imovel.
-- A carteira e de locacao comercial: galpao, loja, sala e terreno.
alter table public.properties drop constraint if exists properties_kind_check;
alter table public.properties add constraint properties_kind_check
  check (kind in ('apartamento','casa','cobertura','studio','sala-comercial','loja','galpao','terreno'));
