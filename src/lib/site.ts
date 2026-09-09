/* ═══════════════════════════════════════════════════════════
   CONFIGURACAO DO SITE
   Ysraell: tudo que e "dado seu" mora aqui. Trocou aqui,
   trocou no site inteiro (header, footer, SEO, WhatsApp, JSON-LD).
   ═══════════════════════════════════════════════════════════ */

export const site = {
  name: "Ysraell Kunzmann",
  shortName: "YK",
  domain: "ysraellkunzmann.com",
  url: "https://ysraellkunzmann.com",

  role: "Corretor de Imóveis",
  secondRole: "Engenheiro de Software",

  /* TODO Ysraell: preencha com os dados reais antes de publicar */
  creci: "CRECI-XX 00000-F",
  phone: "+55 00 00000-0000",
  whatsapp: "5500000000000", // so digitos, com DDI 55
  email: "contato@ysraellkunzmann.com",
  city: "Sua Cidade",
  state: "UF",

  tagline: "Imóveis que você atravessa antes de visitar.",
  description:
    "Corretor de imóveis e engenheiro de software. Tours imersivos, fotografia de arquitetura e locação sem fricção — em parceria com a imobiliária Platina e Diamante.",

  partner: {
    name: "Platina e Diamante",
    kind: "Imobiliária parceira",
    blurb:
      "A estrutura, a segurança jurídica e a carteira de uma imobiliária consolidada. A curadoria e a tecnologia, minhas.",
  },

  social: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/in/",
    github: "https://github.com/",
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
