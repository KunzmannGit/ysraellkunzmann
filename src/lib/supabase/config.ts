/**
 * O site inteiro funciona SEM Supabase (cai no catálogo semente).
 * Assim que as duas variáveis existirem, o banco assume sozinho.
 * Isso significa que você pode publicar hoje e conectar o banco amanhã.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Bucket público do Storage onde vivem fotos e vídeos dos imóveis. */
export const MEDIA_BUCKET = "midia";
