-- ══════════════════════════════════════════════════════════════
--  Permissoes do papel service_role
--
--  Por que isto existe:
--  O projeto foi criado com "Automatically expose new tables"
--  desligado. A migracao inicial concedeu acesso a `anon` e
--  `authenticated`, que sao os papeis que o site usa — e esqueceu
--  do `service_role`, que ficou sem poder nenhum sobre as tabelas.
--
--  O site continua nao usando service_role, e isso nao muda: quem
--  escreve no banco e o /admin, autenticado, pelo navegador. Mas
--  deixar o papel quebrado por acidente cobra caro depois. Qualquer
--  ferramenta que voce ligar no futuro — backup, exportacao,
--  automacao — assume por contrato que service_role funciona, e
--  falharia com um "permission denied" sem explicacao obvia.
--
--  E nao ha ganho real de seguranca em manter o buraco: se a chave
--  service_role vazar, quem a tiver ja controla o projeto inteiro,
--  incluindo autenticacao. Negar duas tabelas nao muda esse jogo.
--  Melhor explicito e previsivel do que fechado por engano.
-- ══════════════════════════════════════════════════════════════

grant usage on schema public to service_role;

grant all privileges on public.properties to service_role;
grant all privileges on public.leads      to service_role;

-- O service_role ignora RLS por natureza (BYPASSRLS), entao nao ha
-- politica a escrever aqui — so a permissao da camada de baixo.
