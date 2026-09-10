"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

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
 * "Agora", em milissegundos — resolvido uma vez, congelado depois.
 * Serve para separar compromisso futuro de passado, ou sugerir uma
 * data padrão num formulário; não é um relógio vivo.
 *
 * Isto já foi implementado errado uma vez, e o erro ensina algo
 * específico sobre `useSyncExternalStore`: colocar `Date.now()`
 * direto no `getSnapshot` parece a mesma receita das media queries
 * acima, mas não é. `getSnapshot` precisa devolver o MESMO valor
 * entre chamadas até que algo avise que mudou — é assim que o
 * React decide se precisa re-renderizar. `Date.now()` muda a cada
 * milissegundo, então toda chamada parecia "o valor mudou desde a
 * última vez", e o React entrava num loop de renderização
 * (`Maximum update depth exceeded`) — reproduzido e confirmado
 * antes deste conserto.
 *
 * A correção: o instante só é lido UMA VEZ, dentro de `subscribe`
 * — que roda depois da montagem, não durante a renderização, e por
 * isso pode ler o relógio sem violar a regra de pureza — e fica
 * guardado numa ref. `getSnapshot` volta a ser estável (a mesma
 * ref) entre chamadas, como o contrato exige.
 *
 * No servidor a resposta é sempre `null`: sem isso, o HTML
 * carimbaria um instante que já estaria errado no momento em que
 * chegasse ao navegador. Código que usa este hook deve tratar
 * `null` como "ainda não sei" — geralmente por um único quadro.
 */
export function useNow() {
  const valorRef = useRef<number | null>(null);

  const subscribe = useCallback((onStoreChange: () => void) => {
    valorRef.current = Date.now();
    onStoreChange();
    return () => {};
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => valorRef.current,
    () => null,
  );
}
