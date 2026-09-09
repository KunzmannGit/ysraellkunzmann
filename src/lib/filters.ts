import type { Property, PropertyFilters } from "@/lib/types";

/**
 * Filtragem pura, sem nenhuma dependencia de servidor.
 *
 * Mora separada de lib/properties.ts de proposito: o catalogo e um
 * componente de cliente, e importar de um modulo que toca `next/headers`
 * arrastaria o Supabase de servidor inteiro para dentro do bundle
 * do navegador — o build quebra e, se nao quebrasse, seria peso morto.
 *
 * Com dezenas de imoveis, filtrar em memoria e instantaneo e evita
 * uma ida ao banco a cada clique de pilula.
 */
export function filterProperties(list: Property[], f: PropertyFilters): Property[] {
  const q = f.q?.trim().toLowerCase();

  return list.filter((p) => {
    if (f.purpose && f.purpose !== "todos" && p.purpose !== f.purpose) return false;
    if (f.kind && f.kind !== "todos" && p.kind !== f.kind) return false;
    if (f.bedroomsMin != null && (p.bedrooms ?? 0) < f.bedroomsMin) return false;
    if (f.priceMax != null && p.price != null && p.price > f.priceMax) return false;
    if (f.onlyTour && !p.tour) return false;

    if (q) {
      const haystack = [p.title, p.headline, p.address.district, p.address.city, ...p.features]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}
