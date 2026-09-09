#!/usr/bin/env node
/**
 * Gera um flythrough por IA a partir das fotos de um imóvel.
 *
 *   node scripts/gerar-flythrough.mjs galpao-industrial-jardim-limoeiro
 *
 * ⚠️  LEIA ANTES DE USAR O RESULTADO
 *
 * Isto NÃO filma o imóvel. Um modelo generativo recebe algumas fotos
 * como referência e INVENTA o percurso entre elas — inclusive parede,
 * fundo e altura que nenhuma foto registrou.
 *
 * Serve para: avaliar a tecnologia, material de marketing claramente
 * identificado como ilustração.
 *
 * Não serve para: anúncio de imóvel. Um locatário que visita e não
 * reconhece o lugar é um cliente perdido — e o CRECI está no anúncio.
 *
 * A chave da API é pedida na hora e NÃO é gravada em lugar nenhum.
 */

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SAIDA = resolve(ROOT, "flythrough");

const c = {
  gold: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/* ── Roteiro por imóvel ──
   O artigo que inspirou isto usa um roteiro de villa de luxo, com
   piscina e terraço. Galpão pede outro percurso: o argumento é
   volume e acesso, não charme. */
const ROTEIROS = {
  "galpao-industrial-jardim-limoeiro": {
    fotos: ["janio-0106", "janio-0119", "janio-0111", "janio-0101", "janio-0100", "whatsapp-image"],
    prompt: `Continuous single-take cinematic FPV drone shot, industrial warehouse showcase of the LARGE EMPTY INDUSTRIAL WAREHOUSE shown in the reference photos, in Serra, Espírito Santo, Brazil.

The shot STARTS INSIDE the empty warehouse floor (the one in the reference photos: bare polished concrete floor, exposed steel ARCH-SHAPED roof trusses, long linear ceiling lights, plain grey block walls, tall clear span with no internal columns).

The camera glides forward slowly and steadily down the centre of the empty span, holding low near the floor to emphasise the 9-metre ceiling height, then drifts toward the large roll-up loading door at the far end.

The camera flies out through the open loading door into the paved outdoor yard, smoothly climbs above the roofline, then rotates 180 degrees to look back and reveal the full property exactly as in the reference photos: the ARCHED corrugated metal roof, the pair of adjoining warehouse bays, the tall blue cylindrical water tower beside the entrance, the paved manoeuvring yard enclosed by a block wall.

Match the architecture, structure, materials, proportions and colours exactly to the reference photos. Overcast bright daylight, crisp natural light, photorealistic, stabilized gimbal motion, constant slow graceful speed, no cuts, no people, no vehicles, no text, no watermark, no signage.`,
  },
};

/* ── Argumentos ── */
const slug = process.argv[2];
if (!slug || !ROTEIROS[slug]) {
  console.error(`\nuso: node scripts/gerar-flythrough.mjs <slug>\n`);
  console.error(`roteiros prontos:\n${Object.keys(ROTEIROS).map((s) => "  " + s).join("\n")}\n`);
  process.exit(1);
}
const roteiro = ROTEIROS[slug];

/* ── Fotos do imóvel, direto do Supabase ── */
const env = existsSync(resolve(ROOT, ".env.local"))
  ? Object.fromEntries(
      readFileSync(resolve(ROOT, ".env.local"), "utf8")
        .split("\n")
        .filter((l) => l.includes("="))
        .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
    )
  : {};

const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SB_URL || !SB_KEY) {
  console.error(c.red("\n✗ .env.local sem as chaves do Supabase. Rode antes: node scripts/configurar.mjs\n"));
  process.exit(1);
}

const resp = await fetch(`${SB_URL}/rest/v1/properties?slug=eq.${slug}&select=title,cover,gallery`, {
  headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
});
const [imovel] = await resp.json();
if (!imovel) {
  console.error(c.red(`\n✗ imóvel "${slug}" não encontrado ou não publicado.\n`));
  process.exit(1);
}

const todas = [imovel.cover, ...imovel.gallery];
const referencias = roteiro.fotos
  .map((frag) => todas.find((m) => m.url.includes(frag))?.url)
  .filter(Boolean);

if (referencias.length < roteiro.fotos.length) {
  console.warn(c.gold(`\n⚠ só ${referencias.length} das ${roteiro.fotos.length} fotos do roteiro foram achadas.`));
  console.warn(c.dim("  A galeria mudou? O resultado pode sair fora do percurso previsto."));
}

console.log(`\n${c.bold(imovel.title)}`);
console.log(c.dim(`${referencias.length} fotos de referência:`));
referencias.forEach((u) => console.log(c.dim("  · " + u.split("/").pop())));

/* ── Chave da API ── */
console.log(
  c.gold(`
Este vídeo será INVENTADO pelo modelo a partir dessas fotos.
Sirva-se dele para avaliar a tecnologia — não para anunciar o imóvel.`),
);

const rl = createInterface({ input: stdin, output: stdout });
const key = (
  process.env.KIE_API_KEY ||
  (await rl.question(`\n${c.bold("Chave da API kie.ai")} ${c.dim("(não é gravada em lugar nenhum)")}\n> `))
).trim();
rl.close();

if (!key) {
  console.error(c.red("\n✗ sem chave, sem geração.\n"));
  process.exit(1);
}

/* ── Geração ── */
const corpo = {
  model: "bytedance/seedance-2-5",
  input: {
    prompt: roteiro.prompt,
    // reference_image_urls e first_frame_url sao mutuamente exclusivos:
    // mandar os dois devolve 422. O ponto de partida vai no prompt,
    // com "STARTS INSIDE" em maiuscula.
    reference_image_urls: referencias,
    aspect_ratio: "16:9",
    // 720p e o teto real, apesar do 4K no marketing. 1080p e recusado.
    resolution: "720p",
    duration: 10,
    generate_audio: false,
  },
};

console.log(c.dim("\nenviando…"));

const criar = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify(corpo),
});

const criado = await criar.json().catch(() => null);
if (!criar.ok || !criado) {
  console.error(c.red(`\n✗ createTask falhou (${criar.status})`));
  console.error(c.dim(JSON.stringify(criado ?? {}, null, 1).slice(0, 600)));
  process.exit(1);
}

const taskId = criado?.data?.taskId ?? criado?.taskId ?? criado?.data?.id;
if (!taskId) {
  console.error(c.red("\n✗ não achei o taskId na resposta:"));
  console.error(c.dim(JSON.stringify(criado, null, 1).slice(0, 600)));
  process.exit(1);
}

console.log(c.dim(`tarefa ${taskId} — gerando, costuma levar 2 a 5 min`));

let url = null;
for (let i = 1; i <= 90; i++) {
  await new Promise((r) => setTimeout(r, 10_000));

  const r = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const j = await r.json().catch(() => ({}));
  const d = j?.data ?? j;
  const estado = String(d?.state ?? d?.status ?? "").toLowerCase();

  process.stdout.write(`\r  ${String(i * 10).padStart(4)}s · ${estado || "…"}      `);

  if (estado.includes("succe")) {
    const bruto = d?.resultJson ?? d?.result ?? d;
    const obj = typeof bruto === "string" ? JSON.parse(bruto) : bruto;
    url =
      obj?.resultUrls?.[0] ??
      obj?.videoUrl ??
      obj?.video_url ??
      obj?.urls?.[0] ??
      (Array.isArray(obj) ? obj[0] : null);
    if (!url) {
      console.log(c.red("\n\n✗ terminou mas não achei a URL do vídeo:"));
      console.log(c.dim(JSON.stringify(obj, null, 1).slice(0, 800)));
      process.exit(1);
    }
    break;
  }

  if (estado.includes("fail") || estado.includes("error")) {
    console.log(c.red(`\n\n✗ a geração falhou: ${d?.failMsg ?? d?.message ?? "sem detalhe"}`));
    process.exit(1);
  }
}

if (!url) {
  console.log(c.red("\n\n✗ passou de 15 min sem terminar. Consulte o painel do kie.ai."));
  process.exit(1);
}

/* ── Download ── */
mkdirSync(SAIDA, { recursive: true });
const destino = resolve(SAIDA, `${slug}-${Date.now()}.mp4`);

console.log(c.dim(`\n\nbaixando…`));
const bin = await fetch(url);
if (!bin.ok) {
  console.log(c.gold(`\n⚠ o download foi bloqueado (${bin.status}). Baixe direto:`));
  console.log("  " + url + "\n");
  process.exit(0);
}
writeFileSync(destino, Buffer.from(await bin.arrayBuffer()));

console.log(c.green(`\n✓ ${destino}`));
console.log(`
${c.bold("Antes de qualquer coisa, assista aos 10 segundos e confira:")}
  · a estrutura é a MESMA das fotos, ou o modelo inventou outro galpão?
  · alguma porta abre para o nada? parede que se deforma?
  · a proporção do pé-direito bate com a realidade?

${c.dim("Se algo destoar, é ilustração — e ilustração não vai para anúncio.")}
`);
