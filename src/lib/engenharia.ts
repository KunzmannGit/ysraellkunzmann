import { waLink } from "@/lib/site";

/* ═══════════════════════════════════════════════════════════
   PAGINA DE ENGENHARIA (/software)
   Cada botao de WhatsApp abre com uma mensagem diferente. Assim,
   pela primeira frase da conversa, da para saber de qual ponto da
   pagina a pessoa veio, mesmo sem pixel configurado.
   ═══════════════════════════════════════════════════════════ */

const MENSAGENS = {
  header: "Olá Ysraell, vim pela sua página de engenharia de software.",
  hero: "Olá Ysraell, vim pela sua página de engenharia de software e quero um orçamento.",
  dores: "Olá Ysraell, vi sua página e quero conversar sobre um problema no meu sistema.",
  processo: "Olá Ysraell, quero começar pela conversa de diagnóstico do meu projeto.",
  final: "Olá Ysraell, tenho um projeto para tirar do papel e quero conversar.",
  flutuante: "Olá Ysraell, vim pela sua página de engenharia de software e quero falar sobre um projeto.",
} as const;

export type OrigemWhatsApp = keyof typeof MENSAGENS;

export function waEng(origem: OrigemWhatsApp) {
  return waLink(MENSAGENS[origem]);
}
