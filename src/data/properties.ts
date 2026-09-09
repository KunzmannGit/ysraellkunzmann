import type { Property } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════
   CATALOGO SEMENTE — VAZIO DE PROPOSITO

   Aqui moravam seis imoveis residenciais de demonstracao, com
   fotos de banco de imagens. Eles saíram quando a carteira real
   entrou no banco: doze imoveis importados do Viva Real, com
   foco em locacao comercial.

   Fica vazio e assim deve continuar. Imovel de mentira num site
   de corretor e pior que catalogo vazio — o visitante que se
   interessa por um anuncio inventado descobre o engano na
   primeira mensagem, e a confianca nao volta.

   Enquanto nenhum imovel estiver PUBLICADO, o site mostra o
   estado vazio, que foi desenhado para isso e convida a pessoa
   a dizer o que procura.
   ═══════════════════════════════════════════════════════════ */

export const seedProperties: Property[] = [];

export function getSeedBySlug(slug: string) {
  return seedProperties.find((p) => p.slug === slug) ?? null;
}
