/* ═══════════════════════════════════════════════════════════
   MODELO DE DOMINIO
   Espelha 1:1 a tabela `properties` do Supabase (ver
   supabase/migrations). Mudou aqui, muda la.
   ═══════════════════════════════════════════════════════════ */

export const PURPOSES = ["aluguel", "venda"] as const;
export type Purpose = (typeof PURPOSES)[number];

export const KINDS = [
  "apartamento",
  "casa",
  "cobertura",
  "studio",
  "sala-comercial",
  "galpao",
  "terreno",
] as const;
export type Kind = (typeof KINDS)[number];

export const KIND_LABEL: Record<Kind, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  cobertura: "Cobertura",
  studio: "Studio",
  "sala-comercial": "Sala comercial",
  galpao: "Galpão",
  terreno: "Terreno",
};

export const STATUSES = ["rascunho", "publicado", "reservado", "alugado", "vendido"] as const;
export type Status = (typeof STATUSES)[number];

export interface Media {
  url: string;
  alt: string;
  /** Legenda opcional que aparece no lightbox — use para contar a casa. */
  caption?: string;
  width?: number;
  height?: number;
}

/** Marcador de tempo no vídeo do tour: vira capítulo navegável. */
export interface TourChapter {
  id: string;
  label: string;
  /** segundo do vídeo (ou índice do frame, quando o tour é por fotos) */
  at: number;
  note?: string;
}

export interface Tour {
  /** "video" = walkthrough scrubado pelo scroll. "frames" = sequência de fotos. */
  kind: "video" | "frames";
  poster: string;
  /** múltiplas fontes = webm primeiro (leve), mp4 depois (compatível) */
  sources?: { src: string; type: string }[];
  durationSeconds?: number;
  chapters: TourChapter[];
}

export interface Address {
  district: string;
  city: string;
  state: string;
  /** Rua e número só aparecem para lead qualificado — nunca no card público. */
  street?: string;
  zip?: string;
}

export interface Property {
  id: string;
  slug: string;

  /** Nome curto e memorável. Ex: "Cobertura Aurora" */
  title: string;
  /** Uma linha de sedução. Ex: "O último andar tem hora marcada com o pôr do sol." */
  headline: string;
  /** 2–4 parágrafos. É aqui que você vende, não na ficha técnica. */
  story: string;

  purpose: Purpose;
  kind: Kind;
  status: Status;

  price: number | null;
  condoFee?: number | null;
  iptu?: number | null;

  area: number | null;
  bedrooms: number | null;
  suites?: number | null;
  bathrooms: number | null;
  parking: number | null;

  address: Address;
  coords?: { lat: number; lng: number } | null;

  features: string[];

  cover: Media;
  gallery: Media[];
  tour?: Tour | null;

  featured: boolean;
  /** ISO date */
  publishedAt: string;
  /** Imóvel captado em parceria com a imobiliária */
  viaPartner: boolean;
}

export interface PropertyFilters {
  purpose?: Purpose | "todos";
  kind?: Kind | "todos";
  bedroomsMin?: number;
  priceMax?: number;
  q?: string;
  onlyTour?: boolean;
}
