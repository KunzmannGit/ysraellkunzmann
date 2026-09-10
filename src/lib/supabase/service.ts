import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/* ═══════════════════════════════════════════════════════════
   CLIENTE DE SERVIÇO — SOMENTE PARA O CRON

   Este é o único lugar do projeto que usa a chave `service_role`.
   Ela ignora TODAS as políticas de RLS, então só existe uma razão
   legítima para usá-la: uma rotina automática (o lembrete diário)
   que roda sem ninguém logado, e por isso não tem sessão de usuário
   para a RLS validar.

   Nunca importe isto fora de src/app/api/cron/. O site inteiro —
   catálogo, painel, formulário de contato — funciona sem esta
   chave, e deve continuar assim.
   ═══════════════════════════════════════════════════════════ */

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function getServiceSupabase() {
  if (!SUPABASE_URL || !SERVICE_KEY) return null;

  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
