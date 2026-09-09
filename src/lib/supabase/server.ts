import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseEnabled } from "./config";

/**
 * Cliente Supabase para Server Components, Route Handlers e Server Actions.
 * Devolve `null` quando o projeto ainda não foi conectado — quem chama
 * deve tratar isso e cair no catálogo semente.
 */
export async function getServerSupabase() {
  if (!supabaseEnabled) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Chamado de um Server Component: o middleware já cuidou do refresh.
        }
      },
    },
  });
}
