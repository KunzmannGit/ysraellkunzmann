/* ═══════════════════════════════════════════════════════════
   CONFIGURACAO DO SITE
   Tudo que e "dado seu" mora aqui. Trocou aqui, trocou no site
   inteiro: header, rodape, SEO, dados estruturados e todos os
   links de WhatsApp.
   ═══════════════════════════════════════════════════════════ */

export const site = {
  name: "Ysraell Kunzmann",
  shortName: "YK",
  domain: "ysraellkunzmann.com",
  url: "https://ysraellkunzmann.com",

  role: "Corretor de Imóveis",
  secondRole: "Engenheiro de Software",

  creci: "CRECI-ES 15225-F",

  phone: "(27) 99689-0805",
  /** Só dígitos, com o DDI 55 na frente. É o que monta os links wa.me. */
  whatsapp: "5527996890805",

  /** E-mail do domínio — criar antes de publicar (ver README, seção 3). */
  email: "contato@ysraellkunzmann.com",
  /** O que já existe hoje. Fica como alternativa até o do domínio estar ativo. */
  emailAlt: "ouro.imoveis@hotmail.com",

  city: "Vila Velha",
  state: "ES",
  /** Onde você atua no dia a dia. */
  region: "Grande Vitória",
  /** Frase de alcance — aparece no rodapé e na página de contato. */
  reach:
    "Baseado em Vila Velha, atendendo toda a Grande Vitória. Para negócios que justifiquem, vou a qualquer lugar do Brasil.",

  tagline: "Imóveis que você atravessa antes de visitar.",
  description:
    "Corretor de imóveis em Vila Velha e Grande Vitória. Tours imersivos, fotografia de arquitetura e locação sem fricção — em parceria com a imobiliária Platina e Diamante.",

  partner: {
    name: "Platina e Diamante",
    kind: "Imobiliária parceira",
    blurb:
      "A estrutura, a segurança jurídica e a carteira de uma imobiliária consolidada. A curadoria e a tecnologia, minhas.",
  },

  social: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/in/",
    github: "https://github.com/KunzmannGit",
  },
} as const;

export function waLink(message?: string) {
  const text = encodeURIComponent(
    message ?? `Olá Ysraell, vim pelo site ${site.domain} e quero falar sobre um imóvel.`,
  );
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

export const nav = [
  { href: "/imoveis", label: "Imóveis", note: "O que está disponível" },
  { href: "/anuncie", label: "Anuncie", note: "Tenho um imóvel para alugar" },
  { href: "/sobre", label: "Sobre", note: "Quem conduz a visita" },
  { href: "/contato", label: "Contato", note: "Falar agora" },
] as const;
