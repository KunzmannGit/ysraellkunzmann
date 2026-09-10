"use client";

import { useCallback, useSyncExternalStore } from "react";

/* ═══════════════════════════════════════════════════════════
   LEITURA DE ESTADO DO NAVEGADOR

   Tudo aqui usa useSyncExternalStore em vez de useState+useEffect.
   Dois ganhos, nao um:

   1. O servidor renderiza com um valor declarado (getServerSnapshot),
      entao nao ha divergencia de hidratacao.
   2. Fica REATIVO. Se a pessoa ativar "reduzir movimento" no sistema
      com o site aberto, ou trocar de mouse para tela sensivel ao
      toque, a interface responde na hora — coisa que um useEffect
      de montagem nunca faria.
   ═══════════════════════════════════════════════════════════ */

/**
 * Acompanha uma media query.
 * @param serverValue o que o servidor deve assumir. Escolha sempre o
 *   valor mais conservador: e melhor renderizar sem efeito e liga-lo
 *   depois do que piscar um efeito e ter que desliga-lo.
 */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** A pessoa pediu menos animação no sistema. Respeite sempre. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

/** Ponteiro preciso (mouse/trackpad). Em toque não existe cursor para customizar. */
export function useHasFinePointer() {
  return useMediaQuery("(pointer: fine)", false);
}

/**
 * Lê uma marca de sessionStorage.
 *
 * O servidor responde "ainda não viu": assim a cortina de abertura
 * já vem no HTML e ninguém vê um lampejo do site antes dela. Quem
 * já viu tem a cortina removida no primeiro quadro após a hidratação.
 *
 * Quem está sem JavaScript ficaria preso atrás dela — por isso o
 * layout raiz traz um <noscript> que a esconde. Sem essa válvula,
 * este seria um site que abre em preto e nunca mais sai dali.
 */
export function useSessionFlag(key: string) {
  const subscribe = useCallback(() => () => {}, []);

  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return sessionStorage.getItem(key) === "1";
      } catch {
        // Navegador com armazenamento bloqueado: trata como primeira visita.
        return false;
      }
    },
    () => false,
  );
}

export function markSessionFlag(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* sem storage, a cortina simplesmente roda de novo */
  }
}

/**
 * "Agora", em milissegundos — para separar compromisso futuro de
 * passado, ou sugerir uma data padrão num formulário.
 *
 * `Date.now()` é impuro e não pode ser chamado direto no corpo de
 * um componente (a regra react-hooks/purity barra isso, e com
 * razão: duas chamadas na mesma renderização podem devolver
 * valores diferentes). Este hook empresta o mesmo truque das
 * media queries acima — o valor entra por fora da renderização,
 * lido pelo React de um jeito que ele sabe que é seguro.
 *
 * No servidor a resposta é sempre `null`: sem isso, o HTML
 * carimbaria um instante que já estaria errado no momento em que
 * chegasse ao navegador. Código que usa este hook deve tratar
 * `null` como "ainda não sei" — geralmente por um único quadro.
 */
export function useNow() {
  const subscribe = useCallback(() => () => {}, []);

  return useSyncExternalStore(
    subscribe,
    () => Date.now(),
    () => null,
  );
}
