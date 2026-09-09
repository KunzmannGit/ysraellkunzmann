import "server-only";
import { getServerSupabase } from "@/lib/supabase/server";

/* ═══════════════════════════════════════════════════════════
   CONSULTAS DO PAINEL
   Diferente de lib/properties.ts: aqui NAO ha fallback para o
   catalogo semente e NAO ha filtro de status. O painel precisa
   ver rascunho, alugado e o que mais existir — e precisa dizer
   a verdade quando o banco nao responde, em vez de mostrar
   imoveis de mentira que voce nunca cadastrou.
   ═══════════════════════════════════════════════════════════ */

export interface AdminPropertyRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  purpose: string;
  kind: string;
  price: number | null;
  district: string | null;
  city: string | null;
  featured: boolean;
  published_at: string;
  updated_at: string;
  cover: { url: string; alt: string } | null;
  gallery: unknown[] | null;
  tour: unknown | null;
}

export interface AdminLeadRow {
  id: string;
  kind: string;
  name: string;
  contact: string;
  message: string | null;
  property_slug: string | null;
  property_title: string | null;
  owner_address: string | null;
  owner_kind: string | null;
  owner_price: string | null;
  handled: boolean;
  created_at: string;
}

export async function listAdminProperties(): Promise<
  { ok: true; rows: AdminPropertyRow[] } | { ok: false; reason: string }
> {
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, reason: "sem-supabase" };

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, slug, title, status, purpose, kind, price, district, city, featured, published_at, updated_at, cover, gallery, tour",
    )
    .order("updated_at", { ascending: false });

  if (error) return { ok: false, reason: error.message };
  return { ok: true, rows: (data ?? []) as AdminPropertyRow[] };
}

export async function getAdminProperty(id: string) {
  const supabase = await getServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[admin] falha ao carregar imóvel:", error.message);
    return null;
  }
  return data;
}

export async function listAdminLeads(): Promise<
  { ok: true; rows: AdminLeadRow[] } | { ok: false; reason: string }
> {
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, reason: "sem-supabase" };

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) return { ok: false, reason: error.message };
  return { ok: true, rows: (data ?? []) as AdminLeadRow[] };
}
