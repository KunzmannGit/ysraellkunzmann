# Ysraell Kunzmann — site do corretor

Site de captação e vitrine imobiliária, com tour imersivo conduzido pelo scroll,
painel de cadastro próprio e formulários que nunca perdem um contato.

Tudo open source, tudo em camada gratuita.

| Camada | Escolha | Custo |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 | MIT |
| Estilo | Tailwind CSS v4 | MIT |
| Animação | Motion + Lenis | MIT |
| Banco, arquivos e login | Supabase | Free tier |
| Hospedagem | Vercel | Hobby |
| DNS | Cloudflare | Grátis |
| Registro | Porkbun (`ysraellkunzmann.com`) | já pago |

---

## Sumário

1. [Rodar na sua máquina](#1-rodar-na-sua-máquina)
2. [Colocar seus dados reais](#2-colocar-seus-dados-reais)
3. [Criar o e-mail do domínio](#3-criar-o-e-mail-do-domínio)
4. [Ligar o Supabase](#4-ligar-o-supabase)
5. [Publicar na Vercel](#5-publicar-na-vercel)
6. [Apontar o domínio (Porkbun → Cloudflare → Vercel)](#6-apontar-o-domínio)
7. [Cadastrar um imóvel](#7-cadastrar-um-imóvel)
8. [Gravar e preparar o vídeo do tour](#8-gravar-e-preparar-o-vídeo-do-tour)
9. [Mapa do projeto](#9-mapa-do-projeto)
10. [Decisões que valem explicação](#10-decisões-que-valem-explicação)

---

## 1. Rodar na sua máquina

```bash
npm install
```

```bash
npm run dev
```

Abre em `http://localhost:3000`. **Não precisa de banco para rodar** — sem Supabase
configurado o site serve um catálogo semente com 6 imóveis de exemplo
(`src/data/properties.ts`), justamente para você poder ajustar o visual antes de
mexer em infraestrutura.

Comandos:

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run typecheck` | TypeScript sem emitir |
| `npm run lint` | ESLint |

---

## 2. Colocar seus dados reais

Um arquivo só: **`src/lib/site.ts`**. Ele alimenta header, rodapé, SEO, dados
estruturados do Google e todos os links de WhatsApp do site.

Troque estes campos antes de publicar:

```ts
creci:    "CRECI-XX 00000-F",   // ← seu registro
phone:    "+55 00 00000-0000",  // ← como aparece na tela
whatsapp: "5500000000000",      // ← só dígitos, com o 55 na frente
email:    "contato@ysraellkunzmann.com",
city:     "Sua Cidade",
state:    "UF",
social: { instagram: "...", linkedin: "...", github: "..." },
```

> O campo `whatsapp` é o mais fácil de errar: **sem** `+`, **sem** parênteses,
> **sem** traço. Exemplo para um celular de São Paulo: `5511987654321`.

Seu retrato na página **Sobre**: salve em `public/img/ysraell.jpg` (vertical,
~1400×1800, luz lateral, fundo escuro) e troque o `src` marcado com um comentário
em `src/app/(site)/sobre/page.tsx`.

---

## 3. Criar o e-mail do domínio

`contato@ysraellkunzmann.com` não vem junto com o domínio — é um serviço à parte.
Duas opções gratuitas, e a diferença entre elas é **uma só**: dá para *enviar*
como `contato@`, ou só *receber*?

| | Cloudflare Email Routing | **Zoho Mail Free** |
|---|---|---|
| Preço | Grátis | Grátis (até 5 contas, 5 GB cada) |
| Receber em `contato@` | Sim | Sim |
| **Responder como `contato@`** | **Não** — sai do Hotmail | **Sim** |
| Onde você lê | Na sua caixa do Hotmail | Webmail + app Zoho Mail |
| Instalação | ~3 min | ~15 min |

**Recomendo o Zoho.** O motivo é o negócio, não a técnica: um cliente escreve
para `contato@ysraellkunzmann.com` e recebe a resposta de `ouro.imoveis@hotmail.com`.
Isso derruba exatamente a credibilidade que o site está construindo. Um site com
tour imersivo e uma resposta de Hotmail não combinam.

> As duas usam registros **MX**, e um domínio só tem um conjunto de MX.
> **São mutuamente exclusivas** — escolha uma.

### 3.A — Zoho Mail Free (recomendado)

1. [zoho.com/mail](https://www.zoho.com/mail/) → **Sign Up Free** → role até o
   **Forever Free Plan** (é discreto, abaixo dos planos pagos).
2. Escolha *Sign up with a domain I already own* → `ysraellkunzmann.com`.
3. O Zoho pede para provar que o domínio é seu com um registro **TXT**. Crie no
   Cloudflare, em **DNS → Records**, com os valores que o Zoho mostrar.
4. Verificado, crie a conta `contato`.
5. O Zoho entrega os **MX** dele. No Cloudflare, apague os MX que existirem e
   crie os três do Zoho, todos com a nuvem **cinza**.
6. Adicione também o **SPF** e o **DKIM** que ele indicar. Sem eles seu e-mail
   cai no spam — e um corretor no spam é um corretor invisível.
7. Aplicativo **Zoho Mail** no celular, e está pronto.

### 3.B — Cloudflare Email Routing (mais rápido, só recebe)

1. No Cloudflare, painel do domínio → **Email → Email Routing** → **Get started**.
2. Ele cria os MX sozinho. Aceite.
3. **Create address**: `contato@ysraellkunzmann.com` → encaminhar para
   `ouro.imoveis@hotmail.com`.
4. Confirme o e-mail de verificação que chega no Hotmail.

Nas duas, o site já está pronto: `src/lib/site.ts` aponta para `contato@` e
mantém `ouro.imoveis@hotmail.com` como alternativa visível na página de contato.

---

## 4. Ligar o Supabase

O banco guarda os imóveis, os contatos recebidos e as fotos. Enquanto ele não
existir, o site funciona — mas o `/admin` fica inativo e os formulários mandam a
pessoa para o WhatsApp com a mensagem já escrita.

**5.1** Crie um projeto em [supabase.com](https://supabase.com) (plano Free).
Guarde a senha do banco.

**5.2** No projeto: **SQL Editor → New query**. Cole o conteúdo inteiro de
`supabase/migrations/0001_init.sql` e execute. Isso cria as tabelas `properties`
e `leads`, as políticas de segurança e o bucket de arquivos `midia`.

**5.3** Crie seu usuário: **Authentication → Users → Add user**. Marque
*Auto Confirm User*. Esse será o login do painel — **não existe cadastro aberto no
site**, de propósito.

**5.4** Copie as chaves em **Project Settings → Data API** e crie um arquivo
`.env.local` na raiz:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**4.5** Reinicie o `npm run dev` e acesse `http://localhost:3000/admin`.

> **Sobre a chave `anon` no navegador:** ela é pública por design. Quem protege os
> dados são as políticas RLS da migração: um visitante anônimo só **lê** imóveis
> publicados e só **escreve** em `leads` (sem nunca poder lê-los). Rascunho,
> endereço completo e caixa de contatos exigem sessão autenticada.

---

## 5. Publicar na Vercel

**4.1** Suba o código para o GitHub:

```bash
git remote add origin https://github.com/SEU_USUARIO/ysraell-kunzmann.git
```

```bash
git push -u origin main
```

**4.2** Em [vercel.com](https://vercel.com) → **Add New → Project** → importe o
repositório. A Vercel detecta Next.js sozinha; não mude nada no build.

**4.3** Em **Settings → Environment Variables**, adicione as duas variáveis do
`.env.local` (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) para
os ambientes *Production*, *Preview* e *Development*.

**4.4** Deploy. A partir daí, todo `git push` na `main` publica sozinho.

---

## 6. Apontar o domínio

Fluxo: o **Porkbun** continua sendo o registrador, o **Cloudflare** passa a ser o
DNS, e o DNS aponta para a **Vercel**.

### 6.1 Cloudflare assume o DNS

1. Crie conta no [Cloudflare](https://dash.cloudflare.com) → **Add a site** →
   `ysraellkunzmann.com` → plano **Free**.
2. O Cloudflare mostra **dois nameservers** (algo como `iris.ns.cloudflare.com`).
   Copie os dois.
3. No Porkbun: **Domain Management → ysraellkunzmann.com → NS / Authoritative
   Nameservers → Edit**. Apague os do Porkbun e cole os dois do Cloudflare.
4. A propagação costuma levar de minutos a algumas horas.

### 6.2 Vercel entrega os registros

1. No projeto da Vercel: **Settings → Domains → Add** → `ysraellkunzmann.com`.
   Adicione também `www.ysraellkunzmann.com`.
2. A Vercel exibe **exatamente** quais registros criar. **Use os valores que ela
   mostrar na sua tela**, não valores decorados de tutorial — a Vercel já mudou o
   IP do apex mais de uma vez.
3. No Cloudflare, em **DNS → Records**, crie o que a Vercel pediu. Normalmente:
   - um registro **A** em `@` apontando para o IP indicado;
   - um **CNAME** em `www` apontando para o host indicado.

### 6.3 O detalhe que quebra tudo

> **Deixe a nuvem CINZA (DNS only), não laranja.**
>
> Com o proxy do Cloudflare ligado (nuvem laranja), o certificado de origem passa a
> ser negociado entre Cloudflare e Vercel e você cai em erro de TLS ou em laço de
> redirecionamento. A Vercel já é CDN, já emite o certificado e já faz cache na
> borda — proxiar por cima só adiciona um salto e um modo de falha.
>
> Se ainda assim quiser o proxy ligado, o SSL do Cloudflare **precisa** estar em
> **Full (strict)**. Fora isso, mantenha cinza.

### 6.4 Fechar

Em **SSL/TLS → Overview**, escolha **Full (strict)**. Espere a Vercel marcar os
domínios como *Valid Configuration* e defina qual é o principal (recomendo o apex,
`ysraellkunzmann.com`, com o `www` redirecionando).

---

## 7. Cadastrar um imóvel

1. Entre em `/admin` (login em `/entrar`).
2. **Novo imóvel**.
3. Preencha **Título** — o endereço na web se escreve sozinho a partir dele.
4. **Frase de abertura**: uma linha só. É o que aparece no card e sob o título.
   Vale mais uma frase específica ("o último andar tem hora marcada com o pôr do
   sol") do que um adjetivo genérico ("excelente localização").
5. **Descrição**: parágrafos separados por **uma linha em branco**.
6. **Fotos**: envie na ordem em que se caminha pelo imóvel — essa ordem *é* o
   roteiro do tour. Marque a capa com a estrela.
7. **Tour**: ligue a chave. Sem vídeo, ele já funciona com as fotos. Crie
   capítulos para dar nome aos ambientes na trilha lateral.
8. Mude a situação para **publicado** e salve.

O catálogo revalida a cada hora. Para ver na hora, republique pela Vercel ou
espere o cache expirar.

> Enquanto a tabela `properties` estiver **vazia**, o site mostra o catálogo
> semente. Assim que o primeiro imóvel for publicado, o banco assume por completo.

---

## 8. Gravar e preparar o vídeo do tour

**Na gravação:** caminhe devagar e sem parar, celular na horizontal, na altura do
peito, movimento contínuo. Um plano só por imóvel. Comece pela porta de entrada e
termine no melhor ambiente — o tour é lido como uma visita, não como um clipe.

**Na conversão:** o vídeo é controlado pelo scroll, então o navegador precisa
buscar qualquer instante instantaneamente. Vídeo comum tem quadro-chave a cada
5–10 segundos e trava ao ser rebobinado. Instale o [ffmpeg](https://ffmpeg.org) e
force quadros-chave frequentes:

```bash
ffmpeg -i entrada.mp4 -c:v libx264 -crf 23 -preset slow -vf "scale=1920:-2,fps=30" -g 10 -keyint_min 10 -sc_threshold 0 -an -movflags +faststart tour.mp4
```

O que importa nesse comando:

| Trecho | Por quê |
|---|---|
| `-g 10 -keyint_min 10` | Quadro-chave a cada 10 quadros (⅓ de segundo). É isto que faz o scroll parecer um trilho em vez de um slideshow travado. |
| `-sc_threshold 0` | Impede o ffmpeg de decidir sozinho onde colocar os quadros-chave. |
| `-an` | Remove o áudio: o vídeo toca mudo de qualquer forma. |
| `+faststart` | Move o índice para o começo do arquivo — sem isso o navegador baixa tudo antes de mostrar o primeiro quadro. |

Versão WebM (menor, servida antes do MP4 em quem suporta):

```bash
ffmpeg -i entrada.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -vf "scale=1920:-2,fps=30" -g 10 -an tour.webm
```

Mire em **menos de 15 MB**. Acima disso o primeiro carregamento no 4G fica
desagradável e o ganho visual é nenhum.

Envie pelo `/admin`, na seção **Tour → Vídeo walkthrough**.

---

## 9. Mapa do projeto

```
src/
├── app/
│   ├── layout.tsx              Camada raiz: fontes, SEO, grão, cursor
│   ├── globals.css             Design system inteiro (tokens Tailwind v4)
│   ├── (site)/                 Site público — tem header, rodapé e abertura
│   │   ├── page.tsx            Home
│   │   ├── imoveis/            Catálogo e página do imóvel
│   │   ├── anuncie/            Captação de proprietários
│   │   ├── sobre/  contato/
│   ├── (admin)/admin/          Painel — sem moldura de marketing
│   ├── (auth)/entrar/          Login
│   └── api/leads/              Recebimento de contatos
├── components/
│   ├── fx/                     Grão, vinheta, cursor, cortina, scroll suave
│   ├── ui/                     Botão, revelações, magnetismo
│   ├── layout/                 Header, rodapé, cabeçalho de página
│   ├── home/                   Seções da home
│   ├── property/               Card, catálogo, galeria
│   ├── tour/ScrollTour.tsx     ★ O tour imersivo
│   ├── forms/LeadForm.tsx      Formulário com rede de segurança
│   └── admin/                  Editor, upload, caixa de contatos
├── lib/
│   ├── site.ts                 ★ Seus dados
│   ├── types.ts                Modelo de domínio
│   ├── properties.ts           Leitura (Supabase → semente)
│   ├── filters.ts              Filtragem pura (roda no navegador)
│   ├── hooks.ts                Estado do navegador reativo
│   └── supabase/               Clientes de servidor e navegador
├── data/properties.ts          Catálogo semente
└── proxy.ts                    Sessão + proteção do /admin
supabase/migrations/            SQL do banco
```

---

## 10. Decisões que valem explicação

**O site nunca depende do banco para estar no ar.** `lib/properties.ts` tenta o
Supabase e, se ele não responder, serve o catálogo semente. Um site de corretor no
ar vale mais do que um site correto fora do ar.

**Nenhum contato se perde.** Se o banco estiver fora, `/api/leads` responde
`stored: false` e devolve um link de WhatsApp com a mensagem inteira já montada. O
formulário vira um atalho para a conversa em vez de engolir o lead.

**O `/admin` é barrado no servidor,** em `src/proxy.ts`, antes de qualquer HTML
sair. Esconder o painel só no cliente é decoração, não proteção.

**O tour não é um vídeo que você assiste.** A seção tem N telas de altura com o
palco fixo: rolar não desce a página, rolar anda pela casa. Quem visita controla o
ritmo — e é isso que separa a sensação de "visitar" da de "assistir".

**`filters.ts` existe separado de `properties.ts`** porque o catálogo é um
componente de cliente. Importar de um módulo que toca `next/headers` arrastaria o
Supabase de servidor para dentro do bundle do navegador — o build quebra, e se não
quebrasse seria peso morto.

**As media queries usam `useSyncExternalStore`,** não `useEffect`. Assim, ativar
"reduzir movimento" no sistema com o site aberto desliga as animações na hora,
sem recarregar.

**A cortina de abertura vem no HTML do servidor** e tem uma válvula `<noscript>`
que a remove. Sem essa válvula, quem estivesse sem JavaScript veria um site que
abre em preto e nunca mais sai dali.

---

## Acessibilidade e desempenho

- Respeita `prefers-reduced-motion` em toda parte: o tour vira galeria estática,
  cursor customizado desliga, grão para de se mexer.
- Navegação por teclado completa, com atalho "pular para o conteúdo" e foco visível.
- Toda foto tem texto alternativo — o campo está no editor, ao lado da legenda.
- Imagens em AVIF/WebP com tamanhos responsivos pelo `next/image`.
- Páginas de imóvel são estáticas com revalidação de 1 hora.
- Dados estruturados `RealEstateAgent` e `RealEstateListing` para o Google.
