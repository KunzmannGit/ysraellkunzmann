#!/usr/bin/env node
/**
 * Importa a carteira exportada do Viva Real para o banco.
 *
 *   node scripts/importar-vivareal.mjs <relatorio.xlsx>
 *
 * Todos entram como RASCUNHO, de propósito: imóvel sem foto não pode
 * ir ao ar. Você sobe as fotos de cada um no /admin e publica quando
 * estiver pronto.
 *
 * É idempotente — roda de novo e atualiza pelo slug em vez de duplicar.
 */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/* ── Curadoria: título curto e frase de abertura de cada imóvel ──
   O Viva Real força título de SEO ("Oportunidade Imperdível!"), que
   não é a voz do site. O código do anúncio é a chave. */
const CURADORIA = {
  GALPAOSERRA: {
    slug: "galpao-industrial-jardim-limoeiro",
    title: "Galpão Industrial Jardim Limoeiro",
    headline:
      "Mil e duzentos metros com nove de pé-direito e transformador próprio de 112 KVA. Desocupa em 31/09.",
    kind: "galpao",
    featured: true,
    extras: ["Pé-direito 9 m", "Cobertura em arco", "Transformador trifásico 112 KVA (220/127V)", "Pátio pavimentado para carga e descarga", "Vestiários masculino e feminino", "Copa", "Área total 1.520 m²"],
  },
  GALPAO5AVND: {
    slug: "galpao-cobilandia-700",
    title: "Galpão Cobilândia 700",
    headline: "Oito metros de pé-direito e piso industrial novo, numa esquina que carreta acessa.",
    kind: "galpao",
    extras: ["Pé-direito 8 m", "Piso industrial novo de alta resistência", "Escritório com divisórias de vidro", "Vestiários para funcionários", "Elétrica e hidráulica renovadas", "Portões amplos para carga e descarga", "Pátio externo e estacionamento", "Sem taxa de condomínio"],
  },
  Galpaotaquara2a: {
    slug: "dois-galpoes-taquara-ii",
    title: "Dois Galpões Taquara II",
    headline: "Mil e oitocentos metros cobertos e setecentos de pátio. Dá para alugar só um dos dois.",
    kind: "galpao",
    extras: ["Dois galpões de 900 m² cada", "Pátio externo de ~700 m²", "Pé-direito elevado", "Locação individual ou conjunta", "Valores negociáveis no pacote completo"],
  },
  "GALPÃO BARRAMARES": {
    slug: "galpao-barramares-360",
    title: "Galpão Barramares",
    headline: "Na rua principal do bairro, com entrada que carreta faz sem manobra.",
    kind: "galpao",
    extras: ["Piso industrial de alta resistência", "Pé-direito elevado", "Escritório integrado", "Acesso para carretas e veículos de grande porte", "Visibilidade comercial na rua principal", "Aceita proposta"],
  },
  "Galpãocariacica250": {
    slug: "galpao-itaquari-250",
    title: "Galpão Itaquari 250",
    headline: "O menor da carteira e o que mais gira: 250 m² com acesso rápido às vias principais.",
    kind: "galpao",
    extras: ["Pé-direito adequado para armazenagem", "Acesso fácil às vias principais", "Espaço interno bem distribuído", "Infraestrutura urbana consolidada no entorno"],
  },
  CARLOSPRAIADACOSTA: {
    slug: "casarao-comercial-praia-da-costa",
    title: "Casarão Comercial Praia da Costa",
    headline: "Trezentos metros em um dos endereços mais vistos de Vila Velha, com cinco salas prontas para receber cliente.",
    kind: "casa",
    extras: ["5 salas amplas e iluminadas", "5 banheiros", "Área de cozinha equipada", "Espaço externo amplo", "2 suítes para escritório privativo ou reunião", "Terreno 360 m²"],
  },
  TERRENOATAIDE: {
    slug: "lote-murado-ataide",
    title: "Lote Murado Ataíde",
    headline: "Trezentos e sessenta metros planos e murados — para depósito, pátio de veículos ou canteiro de obra.",
    kind: "terreno",
    extras: ["Murado em todo o perímetro", "Plano e nivelado", "Portão de garagem para acesso", "Rua asfaltada e tranquila", "Água e luz próximos", "Entregue limpo"],
  },
  APTITAPUA: {
    slug: "apartamento-itapua-130",
    title: "Apartamento Itapuã",
    headline: "Cento e trinta metros com três quartos, pronto para morar sem reforma.",
    kind: "apartamento",
    extras: ["Armários planejados na cozinha e nos banheiros", "Sala ampla e integrada", "Iluminação natural em todos os ambientes", "Condomínio fechado com piscina e salão de festas", "Portaria 24h", "Aceita animais"],
  },
  "882576": {
    slug: "casa-porto-de-galinhas",
    title: "Casa Porto de Galinhas",
    headline: "Mobiliada e em condomínio com piscina, a cinco minutos do centrinho.",
    kind: "casa",
    extras: ["Totalmente mobiliada", "Duas suítes com ar-condicionado", "Condomínio com piscina, academia e espaço gourmet", "Poço artesiano", "Internet inclusa", "Aceita animais"],
  },
  APTINGUASSU: {
    slug: "cobertura-novo-eldorado",
    title: "Cobertura Novo Eldorado",
    headline: "Duplex de 210 m² em Contagem, 100% planejado, à venda direto com o proprietário.",
    kind: "cobertura",
    extras: ["100% planejado", "Ambientes integrados", "Painéis em madeira e iluminação indireta em LED", "4 vagas", "Elevador", "Venda direta com o proprietário"],
  },
  "51110150": {
    slug: "flat-pina-recife",
    title: "Flat Pina",
    headline: "Trinta e quatro metros a três quadras do RioMar, escriturado e aceitando financiamento.",
    kind: "apartamento",
    extras: ["Escriturado e registrado", "Aceita financiamento bancário", "Cozinha montada com armários", "Portaria 24h e dois elevadores", "Poço artesiano — sem cobrança de água", "Vaga rotativa"],
  },
  "5559484": {
    slug: "terreno-porto-summer",
    title: "Terreno Porto Summer",
    headline: "Quatrocentos e cinquenta metros na parte mais valorizada do loteamento-clube.",
    kind: "terreno",
    extras: ["10 m de frente por 45 m de fundo", "Loteamento com piscinas adulto e infantil", "Academia, churrasqueira e salão de festas", "Parte mais valorizada do loteamento"],
  },
};

const UF = { "Espírito Santo": "ES", "Minas Gerais": "MG", Pernambuco: "PE", "São Paulo": "SP", "Rio de Janeiro": "RJ" };

/** "acabou!Este" -> "acabou! Este"; tira emoji e normaliza parágrafos. */
function limparDescricao(txt) {
  if (!txt) return "";
  return String(txt)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .replace(/([a-zà-ú0-9!?.,])([A-ZÀ-Ú])/g, "$1 $2")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú])/)
    .reduce((paras, frase) => {
      const ultimo = paras[paras.length - 1];
      if (ultimo && (ultimo + " " + frase).length < 340) paras[paras.length - 1] = ultimo + " " + frase;
      else paras.push(frase);
      return paras;
    }, [])
    .join("\n\n")
    .trim();
}

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

function converter(linha) {
  const cod = String(linha["Código do Imóvel"] ?? "").trim();
  const c = CURADORIA[cod];
  if (!c) {
    console.warn(`  ! sem curadoria para "${cod}" — pulando`);
    return null;
  }

  const aluguel = num(linha["Valor do aluguel"]);
  const venda = num(linha["Valor de Venda"]);
  const iptuAno = num(linha["IPTU/ano"]);

  const beneficios = String(linha["Benefícios do imóvel"] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  return {
    slug: c.slug,
    title: c.title,
    headline: c.headline,
    story: limparDescricao(linha["Descrição"]),
    purpose: aluguel ? "aluguel" : "venda",
    kind: c.kind,
    status: "rascunho",
    price: aluguel ?? venda,
    condo_fee: num(linha["Condomínio/mês"]),
    // O relatorio traz IPTU ANUAL; o site mostra mensal. Valores de
    // um digito sao lixo de cadastro, nao imposto — viram nulo.
    iptu: iptuAno && iptuAno > 12 ? Math.round(iptuAno / 12) : null,
    area: num(linha["Área útil"]),
    bedrooms: num(linha["Quartos"]),
    suites: num(linha["Suítes"]),
    bathrooms: num(linha["Banheiros"]),
    parking: num(linha["Vagas"]),
    district: linha["Bairro"] || null,
    city: linha["Cidade"] || null,
    state: UF[linha["Estado"]] ?? linha["Estado"] ?? null,
    street: linha["Endereço"] || null,
    zip: linha["CEP"] ? String(linha["CEP"]) : null,
    features: [...new Set([...c.extras, ...beneficios])],
    cover: null,
    gallery: [],
    tour: null,
    featured: Boolean(c.featured),
    via_partner: false,
    published_at: new Date().toISOString().slice(0, 10),
  };
}

/* ── Execução ── */

const arquivo = process.argv[2];
if (!arquivo) {
  console.error("uso: node scripts/importar-vivareal.mjs <relatorio.xlsx>");
  process.exit(1);
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) {
  console.error("faltam SUPABASE_URL e SUPABASE_SERVICE_KEY no ambiente");
  process.exit(1);
}

const XLSX = require("xlsx");
const wb = XLSX.read(readFileSync(arquivo), { type: "buffer" });
const linhas = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

console.log(`\n${linhas.length} linhas no relatório\n`);

const registros = linhas.map(converter).filter(Boolean);

const res = await fetch(`${url}/rest/v1/properties?on_conflict=slug`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify(registros),
});

if (!res.ok) {
  console.error("falhou:", res.status, (await res.text()).slice(0, 500));
  process.exit(1);
}

const salvos = await res.json();
console.log(`${salvos.length} imóveis gravados como RASCUNHO:\n`);
for (const p of salvos.sort((a, b) => Number(b.featured) - Number(a.featured))) {
  const destaque = p.featured ? " *DESTAQUE*" : "";
  console.log(`  ${p.kind.padEnd(12)} ${String(p.area ?? "-").padStart(5)} m²  R$ ${String(p.price ?? "-").padStart(9)}  ${p.title}${destaque}`);
}
console.log(`\nAbra ${"/admin"} para subir as fotos e publicar.\n`);
