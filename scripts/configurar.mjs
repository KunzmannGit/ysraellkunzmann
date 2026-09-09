#!/usr/bin/env node
/**
 * Configuração do Supabase — local e na Vercel, de uma vez.
 *
 *   node scripts/configurar.mjs
 *
 * Você cola a URL e a chave; o script escreve o .env.local e, se a
 * Vercel já estiver ligada a esta pasta, envia as mesmas variáveis
 * para lá. Nada é impresso na tela depois de colado e nada sai daqui.
 */

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const ENV_PATH = resolve(ROOT, ".env.local");

const c = {
  gold: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const rl = createInterface({ input: stdin, output: stdout });

console.log(`
${c.bold("Configuração do Supabase")}
${c.dim("─".repeat(52))}
Pegue os dois valores em:
  ${c.gold("Supabase → Project Settings → Data API")}
`);

const url = (await rl.question(`${c.bold("URL do projeto")} ${c.dim("(https://xxxx.supabase.co)")}\n> `)).trim();

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) {
  console.log(c.red("\n✗ Isso não parece uma URL de projeto Supabase."));
  console.log(c.dim("  Deve ser algo como https://abcdefghijklm.supabase.co\n"));
  rl.close();
  process.exit(1);
}

const key = (await rl.question(`\n${c.bold("Chave anon / public")} ${c.dim("(começa com eyJ...)")}\n> `)).trim();

if (!key.startsWith("eyJ") || key.length < 60) {
  console.log(c.red("\n✗ Isso não parece a chave anon."));
  console.log(c.dim("  É a longa que começa com eyJ. NÃO use a service_role.\n"));
  rl.close();
  process.exit(1);
}

// A service_role tem "role":"service_role" no payload. Se veio essa, para tudo:
// ela ignora todas as políticas de segurança e não pode ir para o navegador.
try {
  const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64").toString());
  if (payload.role === "service_role") {
    console.log(c.red("\n✗ PARE — essa é a chave service_role."));
    console.log(
      c.dim(
        "  Ela ignora todas as regras de segurança do banco e nunca pode\n" +
          "  ir para o navegador. Volte e copie a chave 'anon public'.\n",
      ),
    );
    rl.close();
    process.exit(1);
  }
} catch {
  // Chave em formato novo (sb_publishable_...) não é JWT: segue o jogo.
}

rl.close();

const cleanUrl = url.replace(/\/$/, "");

// Preserva qualquer outra variável que já exista no arquivo.
const existing = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
const keep = existing
  .split("\n")
  .filter(
    (line) =>
      line.trim() &&
      !line.startsWith("NEXT_PUBLIC_SUPABASE_URL") &&
      !line.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );

writeFileSync(
  ENV_PATH,
  [...keep, `NEXT_PUBLIC_SUPABASE_URL=${cleanUrl}`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${key}`, ""].join(
    "\n",
  ),
  "utf8",
);

console.log(c.green("\n✓ .env.local escrito."));

/* ── Vercel ── */

const linked = existsSync(resolve(ROOT, ".vercel", "project.json"));

if (!linked) {
  console.log(
    c.dim(
      "\n○ A Vercel ainda não está ligada a esta pasta.\n" +
        "  Depois de rodar `vercel link`, rode este script de novo\n" +
        "  para enviar as variáveis para lá.\n",
    ),
  );
  process.exit(0);
}

console.log(c.dim("\nEnviando para a Vercel…"));

for (const [name, value] of [
  ["NEXT_PUBLIC_SUPABASE_URL", cleanUrl],
  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", key],
]) {
  for (const env of ["production", "preview", "development"]) {
    // Remove antes de adicionar: `vercel env add` falha se a variável
    // já existir naquele ambiente, e um erro aqui pararia tudo pela metade.
    spawnSync("vercel", ["env", "rm", name, env, "--yes"], {
      cwd: ROOT,
      stdio: "ignore",
      shell: true,
    });

    const res = spawnSync("vercel", ["env", "add", name, env], {
      cwd: ROOT,
      input: value,
      stdio: ["pipe", "ignore", "pipe"],
      shell: true,
    });

    if (res.status === 0) {
      console.log(c.green(`  ✓ ${name} · ${env}`));
    } else {
      console.log(c.red(`  ✗ ${name} · ${env}`));
      const err = res.stderr?.toString().trim();
      if (err) console.log(c.dim(`    ${err.split("\n")[0]}`));
    }
  }
}

console.log(`
${c.green("Pronto.")}

Próximos passos:
  ${c.gold("npm run dev")}        ${c.dim("→ testar em http://localhost:3000/admin")}
  ${c.gold("vercel --prod")}      ${c.dim("→ publicar com as novas variáveis")}
`);
