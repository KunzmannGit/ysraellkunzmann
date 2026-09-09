import type { Media, Property } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════
   CATALOGO SEMENTE
   Enquanto o Supabase nao estiver conectado, o site roda com
   estes imoveis. Assim que voce publicar o primeiro imovel no
   /admin, o banco assume e este arquivo vira so fallback.
   ═══════════════════════════════════════════════════════════ */

const u = (id: string, w = 2400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

const img = (id: string, alt: string, caption?: string): Media => ({
  url: u(id),
  alt,
  caption,
  width: 2400,
  height: 1600,
});

export const seedProperties: Property[] = [
  {
    id: "seed-01",
    slug: "cobertura-aurora",
    title: "Cobertura Aurora",
    headline: "O último andar tem hora marcada com o pôr do sol.",
    story: `Todo dia, por volta das dezoito e dez, a luz entra pela esquina da sala e sobe pela parede de concreto até o teto. Dura uns doze minutos. Quem mora aqui organiza o fim do expediente em torno disso.

A cobertura ocupa o topo de um prédio de nove andares numa rua sem passagem — o silêncio não é promessa de anúncio, é consequência da planta da quadra. Dois dormitórios viraram um só, com closet, porque o antigo morador era fotógrafo e precisava de parede vazia.

O terraço tem ponto de água, ponto de gás e uma pérgola de madeira que já sobreviveu a três invernos. Não vem mobiliada. Vem com a luz.`,
    purpose: "aluguel",
    kind: "cobertura",
    status: "publicado",
    price: 7800,
    condoFee: 1240,
    iptu: 310,
    area: 168,
    bedrooms: 2,
    suites: 1,
    bathrooms: 3,
    parking: 2,
    address: { district: "Praia da Costa", city: "Vila Velha", state: "ES" },
    features: [
      "Terraço privativo 54 m²",
      "Vista desobstruída para a baía",
      "Closet integrado",
      "Piso aquecido nos banhos",
      "Churrasqueira a gás",
      "2 vagas cobertas + depósito",
      "Prédio com portaria 24h",
      "Aceita pet",
    ],
    cover: img("photo-1600607687939-ce8a6c25118c", "Sala da Cobertura Aurora com luz do fim de tarde"),
    gallery: [
      img("photo-1600585154340-be6161a56a0c", "Living integrado à varanda", "A esquina onde a luz entra às 18h10."),
      img("photo-1600566753086-00f18fb6b3ea", "Suíte principal com closet", "Dois quartos viraram um. Sobrou parede vazia."),
      img("photo-1600210492486-724fe5c67fb0", "Banheiro da suíte em pedra", "Piso aquecido — detalhe que só se percebe em julho."),
      img("photo-1522708323590-d24dbb6b0267", "Estar social visto da escada", "O pé-direito duplo é original do projeto de 1998."),
      img("photo-1484154218962-a197022b5858", "Cozinha com ilha central", "O ponto de gás do terraço vem daqui."),
    ],
    tour: {
      kind: "frames",
      poster: u("photo-1600607687939-ce8a6c25118c", 1600),
      chapters: [
        { id: "entrada", label: "Entrada", at: 0, note: "Hall e lavabo" },
        { id: "living", label: "Living", at: 1, note: "Pé-direito duplo" },
        { id: "suite", label: "Suíte", at: 2, note: "Com closet" },
        { id: "banho", label: "Banho", at: 3, note: "Piso aquecido" },
        { id: "terraco", label: "Terraço", at: 4, note: "54 m² privativos" },
      ],
    },
    featured: true,
    publishedAt: "2026-08-14",
    viaPartner: true,
  },

  {
    id: "seed-02",
    slug: "casa-meridiano",
    title: "Casa Meridiano",
    headline: "Construída de costas para a rua e de frente para o próprio quintal.",
    story: `O arquiteto virou a casa. A fachada da rua é quase cega — um muro de tijolo aparente e uma porta. Todo o vidro está atrás, olhando para um pátio interno com uma figueira que já estava no terreno antes da obra.

São três dormitórios em L ao redor desse pátio, então nenhum quarto olha para o vizinho. A cozinha abre para uma varanda coberta que funciona o ano inteiro, inclusive na chuva.

É uma casa para quem trabalha em casa e não quer ver a rua. O escritório tem entrada independente pela lateral — dá para receber cliente sem passar pela sala.`,
    purpose: "aluguel",
    kind: "casa",
    status: "publicado",
    price: 6200,
    iptu: 420,
    area: 214,
    bedrooms: 3,
    suites: 1,
    bathrooms: 3,
    parking: 2,
    address: { district: "Coqueiral de Itaparica", city: "Vila Velha", state: "ES" },
    features: [
      "Pátio interno com figueira",
      "Escritório com entrada independente",
      "Varanda coberta o ano todo",
      "Tijolo aparente original",
      "Aquecimento solar",
      "Garagem para 2 + pátio de manobra",
      "Terreno 380 m²",
    ],
    cover: img("photo-1613490493576-7fde63acd811", "Fachada de tijolo aparente da Casa Meridiano"),
    gallery: [
      img("photo-1512917774080-9991f1c4c750", "Fachada vista da rua", "Quase cega — de propósito."),
      img("photo-1600596542815-ffad4c1539a9", "Pátio interno com a figueira", "A árvore é anterior à casa."),
      img("photo-1502005229762-cf1b2da7c5d6", "Estar aberto para o pátio", "Todo o vidro está aqui atrás."),
      img("photo-1600047509807-ba8f99d2cdde", "Cozinha e varanda coberta", "Funciona na chuva."),
    ],
    tour: {
      kind: "frames",
      poster: u("photo-1613490493576-7fde63acd811", 1600),
      chapters: [
        { id: "rua", label: "Rua", at: 0, note: "A fachada fechada" },
        { id: "patio", label: "Pátio", at: 1, note: "A figueira" },
        { id: "estar", label: "Estar", at: 2 },
        { id: "cozinha", label: "Cozinha", at: 3, note: "Varanda coberta" },
      ],
    },
    featured: true,
    publishedAt: "2026-08-28",
    viaPartner: false,
  },

  {
    id: "seed-03",
    slug: "studio-grao",
    title: "Studio Grão",
    headline: "Vinte e oito metros que não parecem vinte e oito metros.",
    story: `O truque é o pé-direito de 3,4 m e uma única parede curva que separa o banho sem cortar a luz. Nada mais é dividido.

Marcenaria sob medida em todo o perímetro: a cama sobe, a mesa desce, e o que sobra é chão livre. Foi projetado para uma pessoa que recebe duas.

Fica a quatro minutos a pé da orla e a dois da Rua da Lama. É o imóvel certo para quem chegou na cidade agora e quer decidir o bairro depois.`,
    purpose: "aluguel",
    kind: "studio",
    status: "publicado",
    price: 2450,
    condoFee: 640,
    iptu: 95,
    area: 28,
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    address: { district: "Praia do Canto", city: "Vitória", state: "ES" },
    features: [
      "Pé-direito 3,4 m",
      "Marcenaria planejada integral",
      "Cama retrátil",
      "4 min a pé da orla",
      "Lavanderia compartilhada no térreo",
      "Bicicletário",
      "Mobiliado",
    ],
    cover: img("photo-1567496898669-ee935f5f647a", "Interior do Studio Grão com pé-direito alto"),
    gallery: [
      img("photo-1493809842364-78817add7ffb", "Vista geral do studio", "Uma parede curva, e só."),
      img("photo-1556909212-d5b604d0c90d", "Marcenaria e mesa retrátil", "A mesa desce quando a cama sobe."),
      img("photo-1560448204-e02f11c3d0e2", "Nicho de dormir", "Projetado para um, confortável para dois."),
    ],
    featured: false,
    publishedAt: "2026-09-01",
    viaPartner: true,
  },

  {
    id: "seed-04",
    slug: "apartamento-vigilia",
    title: "Apartamento Vigília",
    headline: "Nono andar, esquina, e uma janela que não fecha para a cidade.",
    story: `A sala tem duas faces de vidro em ângulo. De dia é claridade demais para quem gosta de escuro; de noite é a cidade inteira acesa do outro lado do vidro.

Planta original de 1974, mantida: hall de entrada de verdade, copa separada da cozinha, dormitórios generosos. Reformado em 2023 na parte elétrica e hidráulica, preservando o granilite do piso.

Prédio de oito unidades, dois por andar. Vizinhança antiga, corredor silencioso.`,
    purpose: "aluguel",
    kind: "apartamento",
    status: "publicado",
    price: 4300,
    condoFee: 890,
    iptu: 180,
    area: 122,
    bedrooms: 3,
    suites: 0,
    bathrooms: 2,
    parking: 1,
    address: { district: "Jardim da Penha", city: "Vitória", state: "ES" },
    features: [
      "Sala de esquina com vidro em ângulo",
      "Granilite original preservado",
      "Elétrica e hidráulica refeitas em 2023",
      "Hall de entrada privativo",
      "2 apartamentos por andar",
      "Vaga demarcada",
    ],
    cover: img("photo-1502672260266-1c1ef2d93688", "Sala de esquina do Apartamento Vigília"),
    gallery: [
      img("photo-1554995207-c18c203602cb", "Living com as duas faces de vidro", "De noite, a cidade acesa."),
      img("photo-1600573472550-8090b5e0745e", "Dormitório principal", "Planta de 1974, generosa."),
      img("photo-1600121848594-d8644e57abab", "Copa e cozinha separadas", "Do jeito que se construía."),
    ],
    featured: false,
    publishedAt: "2026-07-22",
    viaPartner: true,
  },

  {
    id: "seed-05",
    slug: "sala-prisma",
    title: "Sala Prisma",
    headline: "Escritório para quem recebe cliente e quer que ele repare no lugar.",
    story: `Conjunto de esquina no sétimo andar, 62 m², já entregue com forro acústico, piso vinílico e infraestrutura de rede em todos os pontos.

Comporta oito posições de trabalho ou quatro posições e uma sala de reunião fechada. Copa própria e dois banheiros dentro do conjunto — não se divide corredor com ninguém.

Edifício com fibra redundante de duas operadoras, gerador e recepção das 7h às 20h.`,
    purpose: "aluguel",
    kind: "sala-comercial",
    status: "publicado",
    price: 3900,
    condoFee: 1100,
    iptu: 260,
    area: 62,
    bedrooms: null,
    bathrooms: 2,
    parking: 2,
    address: { district: "Enseada do Suá", city: "Vitória", state: "ES" },
    features: [
      "Forro acústico instalado",
      "Cabeamento de rede em todos os pontos",
      "Fibra redundante (2 operadoras)",
      "Gerador no edifício",
      "Copa e 2 banheiros privativos",
      "2 vagas",
    ],
    cover: img("photo-1580587771525-78b9dba3b914", "Interior da Sala Prisma"),
    gallery: [
      img("photo-1604014237800-1c9102c219da", "Área de trabalho aberta", "Oito posições confortáveis."),
      img("photo-1616486338812-3dadae4b4ace", "Sala de reunião fechada", "Ou quatro posições e esta sala."),
    ],
    featured: false,
    publishedAt: "2026-06-30",
    viaPartner: false,
  },

  {
    id: "seed-06",
    slug: "casa-botanica",
    title: "Casa Botânica",
    headline: "O jardim é mais velho que a casa e foi ele que ditou a planta.",
    story: `Terreno de 620 m² com quatro árvores adultas que não podiam cair. A casa foi desenhada nos vãos entre elas — daí a forma em Z e os três pátios de tamanhos diferentes.

Quatro dormitórios, sendo dois suítes, todos com ventilação cruzada. A sala de jantar tem uma parede inteira de vidro para o jardim maior, e a mesa fica exatamente sob a copa da mangueira.

Vendida com o projeto paisagístico documentado e a planta de irrigação. É uma casa que dá trabalho e devolve.`,
    purpose: "venda",
    kind: "casa",
    status: "publicado",
    price: 1850000,
    iptu: 640,
    area: 296,
    bedrooms: 4,
    suites: 2,
    bathrooms: 4,
    parking: 3,
    address: { district: "Mata da Praia", city: "Vitória", state: "ES" },
    features: [
      "Terreno 620 m²",
      "Quatro árvores adultas preservadas",
      "Três pátios internos",
      "Ventilação cruzada em todos os quartos",
      "Projeto paisagístico documentado",
      "Sistema de irrigação instalado",
      "Garagem 3 vagas",
    ],
    cover: img("photo-1583608205776-bfd35f0d9f83", "Fachada da Casa Botânica entre as árvores"),
    gallery: [
      img("photo-1449844908441-8829872d2607", "Volume da casa em Z", "Desenhada nos vãos entre as árvores."),
      img("photo-1618221195710-dd6b41faaea6", "Sala de jantar com parede de vidro", "A mesa fica sob a copa da mangueira."),
      img("photo-1600585154526-990dced4db0d", "Estar com vista para o pátio central", "Três pátios, três tamanhos."),
      img("photo-1631049307264-da0ec9d70304", "Suíte com ventilação cruzada", "Todos os quartos têm."),
    ],
    tour: {
      kind: "frames",
      poster: u("photo-1583608205776-bfd35f0d9f83", 1600),
      chapters: [
        { id: "chegada", label: "Chegada", at: 0 },
        { id: "volume", label: "O Z", at: 1, note: "A forma da casa" },
        { id: "jantar", label: "Jantar", at: 2, note: "Sob a mangueira" },
        { id: "estar", label: "Estar", at: 3 },
        { id: "suite", label: "Suíte", at: 4 },
      ],
    },
    featured: true,
    publishedAt: "2026-05-18",
    viaPartner: true,
  },
];

export function getSeedBySlug(slug: string) {
  return seedProperties.find((p) => p.slug === slug) ?? null;
}
