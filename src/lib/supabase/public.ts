import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseEnabled } from "./config";

/* ═══════════════════════════════════════════════════════════
   CLIENTE PUBLICO — SEM SESSAO

   O catalogo, a pagina do imovel e o sitemap leem dados que
   sao publicos por definicao. Nenhum deles precisa saber quem
   esta olhando, entao nenhum deles precisa de cookie.

   Isso nao e detalhe de estilo. `cookies()` do Next exige uma
   requisicao HTTP em andamento, e `generateStaticParams` roda
   no build, quando requisicao nenhuma existe. Usar o cliente
   com sessao ali derruba o build inteiro — e derrubou, no
   primeiro deploy depois que o banco entrou no ar.

   Regra da casa:
     · dado publico  -> getPublicSupabase()   (aqui)
     · dado seu      -> getServerSupabase()   (./server.ts)
   ═══════════════════════════════════════════════════════════ */

let cached: ReturnType<typeof createClient> | null = null;

export function getPublicSupabase() {
  if (!supabaseEnabled) return null;

  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        // Nada de sessao: no servidor nao ha navegador para guardar,
        // e tentar renovar token em processo de build e desperdicio.
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return cached;
}
