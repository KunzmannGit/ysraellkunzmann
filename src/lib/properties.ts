import { cache } from "react";
import { seedProperties } from "@/data/properties";
import { getPublicSupabase } from "@/lib/supabase/public";
import type { Kind, Media, Property, Purpose, Status, Tour } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════
   CAMADA DE DADOS — LADO PUBLICO

   Regra 1: se o Supabase responder, o Supabase manda. Se ele
   nao estiver conectado (ou falhar), o site nao quebra — serve
   o catalogo semente. Um site de corretor no ar vale mais que
   um site correto fora do ar.

   Regra 2: aqui se usa o cliente SEM sessao. Tudo que este
   arquivo le e publico, e `generateStaticParams` roda no build,
   onde `cookies()` nao existe. Trocar isto por getServerSupabase()
   derruba o build de producao — ja aconteceu uma vez.
   ═══════════════════════════════════════════════════════════ */

interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  headline: string | null;
  story: string | null;
  purpose: string;
  kind: string;
  status: string;
  price: number | null;
  condo_fee: number | null;
  iptu: number | null;
  area: number | null;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parking: number | null;
  district: string | null;
  city: string | null;
  state: string | null;
  street: string | null;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  features: string[] | null;
  cover: Media | null;
  gallery: Media[] | null;
  tour: Tour | null;
  featured: boolean | null;
  published_at: string | null;
  via_partner: boolean | null;
}

/**
 * Capa de emergência: um imóvel publicado sem foto.
 *
 * Antes isto era a foto de uma casa qualquer, o que fazia o card
 * mentir sobre o imóvel. Agora é uma textura neutra, que se lê como
 * "ainda não há foto" e não como "este é o imóvel".
 */
const FALLBACK_COVER: Media = {
  url:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
        <rect width="1200" height="800" fill="#121017"/>
        <text x="600" y="405" text-anchor="middle" fill="#4a4453"
              font-family="monospace" font-size="26" letter-spacing="8">FOTOS EM BREVE</text>
      </svg>`.replace(/\s+/g, " "),
    ),
  alt: "Imóvel ainda sem fotografia",
};

function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    headline: row.headline ?? "",
    story: row.story ?? "",
    purpose: row.purpose as Purpose,
    kind: row.kind as Kind,
    status: row.status as Status,
    price: row.price,
    condoFee: row.condo_fee,
    iptu: row.iptu,
    area: row.area,
    bedrooms: row.bedrooms,
    suites: row.suites,
    bathrooms: row.bathrooms,
    parking: row.parking,
    address: {
      district: row.district ?? "",
      city: row.city ?? "",
      state: row.state ?? "",
      street: row.street ?? undefined,
      zip: row.zip ?? undefined,
    },
    coords: row.lat != null && row.lng != null ? { lat: row.lat, lng: row.lng } : null,
    features: row.features ?? [],
    cover: row.cover ?? FALLBACK_COVER,
    gallery: row.gallery ?? [],
    tour: row.tour,
    featured: row.featured ?? false,
    publishedAt: row.published_at ?? new Date().toISOString().slice(0, 10),
    viaPartner: row.via_partner ?? false,
  };
}

const PUBLIC_STATUSES: Status[] = ["publicado", "reservado"];

/** Todos os imóveis visíveis ao público, do mais recente ao mais antigo. */
export const getProperties = cache(async (): Promise<Property[]> => {
  const supabase = getPublicSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .in("status", PUBLIC_STATUSES)
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as PropertyRow[]).map(rowToProperty);
    }
    if (error) {
      console.error("[properties] Supabase falhou, usando catálogo semente:", error.message);
    }
  }

  return seedProperties
    .filter((p) => PUBLIC_STATUSES.includes(p.status))
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
});

export const getPropertyBySlug = cache(async (slug: string): Promise<Property | null> => {
  const supabase = getPublicSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .in("status", PUBLIC_STATUSES)
      .maybeSingle();

    if (!error && data) return rowToProperty(data as PropertyRow);
  }

  return seedProperties.find((p) => p.slug === slug && PUBLIC_STATUSES.includes(p.status)) ?? null;
});

export async function getFeatured(): Promise<Property[]> {
  const all = await getProperties();
  const marked = all.filter((p) => p.featured);
  return marked.length > 0 ? marked : all.slice(0, 3);
}

export async function getRelated(current: Property, limit = 3): Promise<Property[]> {
  const all = await getProperties();
  const others = all.filter((p) => p.id !== current.id);

  // Pontua semelhança: mesma finalidade > mesmo bairro > mesmo tipo.
  const scored = others.map((p) => {
    let score = 0;
    if (p.purpose === current.purpose) score += 3;
    if (p.address.district === current.address.district) score += 2;
    if (p.kind === current.kind) score += 2;
    if (p.tour) score += 1;
    return { p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.p);
}
