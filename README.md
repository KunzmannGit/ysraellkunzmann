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
| Código | [KunzmannGit/ysraellkunzmann](https://github.com/KunzmannGit/ysraellkunzmann) | privado |

---

## Sumário

1. [Rodar na sua máquina](#1-rodar-na-sua-máquina)
2. [Seus dados no site](#2-seus-dados-no-site)
3. [Criar o e-mail do domínio](#3-criar-o-e-mail-do-domínio)
4. [Ligar o Supabase](#4-ligar-o-supabase)
5. [Publicar na Vercel](#5-publicar-na-vercel)
6. [Apontar o domínio](#6-apontar-o-domínio)
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

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run typecheck` | TypeScript sem emitir |
| `npm run lint` | ESLint |
| `node scripts/configurar.mjs` | Grava as chaves do Supabase (local + Vercel) |
| `npm run login` | Autentica nas duas CLIs (Vercel e Supabase) |
| `npm run vc -- <cmd>` | Vercel CLI |
| `npm run sb -- <cmd>` | Supabase CLI |

> As duas CLIs sao chamadas por script npm de proposito: o `npm run` coloca
> `node_modules/.bin` no PATH sozinho, e assim funcionam sem depender do PATH do
> Windows — que teima em servir uma copia velha do ambiente para terminais novos.
>
> O Supabase nao suporta instalacao global via npm, entao ele e dependencia do
> projeto. O Vercel foi instalado com `npm i --no-save vercel`, para nao entrar no
> `package.json` e nao ser reinstalado a cada build na Vercel. Se um dia voce
> apagar o `node_modules`, rode `npm i --no-save vercel` de novo.

---

## 2. Seus dados no site

Um arquivo só: **`src/lib/site.ts`**. Ele alimenta header, rodapé, SEO, dados
estruturados do Google e todos os links de WhatsApp.

Já está preenchido com o que é real:

```ts
creci:    "CRECI-ES 15225-F",
phone:    "(27) 99689-0805",
whatsapp: "5527996890805",        // só dígitos, com o 55 na frente
email:    "contato@ysraellkunzmann.com",   // ← criar (seção 3)
emailAlt: "ouro.imoveis@hotmail.com",
city:     "Vila Velha",
state:    "ES",
region:   "Grande Vitória",
```

**Falta preencher:** os links de `social` (Instagram e LinkedIn) ainda apontam
para o perfil vazio das duas redes.

**Seu retrato** na página *Sobre*: salve em `public/img/ysraell.jpg` (vertical,
~1400×1800, luz lateral, fundo escuro) e troque o `src` marcado com um comentário
em `src/app/(site)/sobre/page.tsx`.

> Os 6 imóveis do catálogo semente usam bairros reais da Grande Vitória — Praia da
> Costa, Coqueiral de Itaparica, Praia do Canto, Jardim da Penha, Enseada do Suá e
> Mata da Praia — mas as **fotos e os textos são de demonstração**. Eles somem
> sozinhos assim que você publicar o primeiro imóvel de verdade no `/admin`.

---

## 3. Criar o e-mail do domínio

`contato@ysraellkunzmann.com` não vem junto com o domínio — é um serviço à parte.
Duas opções gratuitas, e a diferença que importa é **uma só**: dá para *enviar*
como `contato@`, ou só *receber*?

| | Cloudflare Email Routing | **Zoho Mail Free** |
|---|---|---|
| Preço | Grátis | Grátis (até 5 contas, 5 GB cada) |
| Receber em `contato@` | Sim | Sim |
| **Responder como `contato@`** | **Não** — sai do Hotmail | **Sim** |
| Onde você lê | Na sua caixa do Hotmail | Webmail + app Zoho Mail |
| Instalação | ~3 min | ~15 min |

**Recomendo o Zoho.** O motivo é comercial, não técnico: o cliente escreve para
`contato@ysraellkunzmann.com` e recebe resposta de `ouro.imoveis@hotmail.com`.
Isso derruba exatamente a credibilidade que o site está construindo. Tour imersivo
com resposta de Hotmail não combinam.

> As duas usam registros **MX**, e um domínio só tem um conjunto de MX.
> **São mutuamente exclusivas** — escolha uma.

### 3.A — Zoho Mail Free (recomendado)

1. [zoho.com/mail](https://www.zoho.com/mail/) → **Sign Up Free** → role até o
   **Forever Free Plan** (fica discreto, abaixo dos planos pagos).
2. *Sign up with a domain I already own* → `ysraellkunzmann.com`.
3. O Zoho pede um registro **TXT** para provar que o domínio é seu. Crie no
   Cloudflare, em **DNS → Records**, com o valor que ele mostrar.
4. Verificado, crie a conta `contato`.
5. O Zoho entrega os **MX** dele. No Cloudflare, apague os MX que existirem e crie
   os três do Zoho, todos com a nuvem **cinza**.
6. Adicione também o **SPF** e o **DKIM** que ele indicar. Sem eles seu e-mail cai
   no spam — e corretor no spam é corretor invisível.
7. Instale o app **Zoho Mail** no celular.

### 3.B — Cloudflare Email Routing (mais rápido, só recebe)

1. No Cloudflare, painel do domínio → **Email → Email Routing** → **Get started**.
2. Ele cria os MX sozinho. Aceite.
3. **Create address**: `contato@ysraellkunzmann.com` → encaminha para
   `ouro.imoveis@hotmail.com`.
4. Confirme o e-mail de verificação que chega no Hotmail.

Nos dois casos o site já está pronto: aponta para `contato@` e mantém
`ouro.imoveis@hotmail.com` visível como alternativa na página de contato.

---

## 4. Ligar o Supabase

O banco guarda os imóveis, os contatos e as fotos. Enquanto ele não existir o site
funciona — mas o `/admin` fica inativo e os formulários mandam a pessoa para o
WhatsApp com a mensagem já escrita.

**4.1** Crie um projeto em [supabase.com](https://supabase.com), plano **Free**.
Região: **South America (São Paulo)** — é a mais perto do Espírito Santo. Guarde a
senha do banco no seu gerenciador; ela não é usada pelo site, mas é pedida em
operações administrativas.

**4.2** No projeto: **SQL Editor → New query**. Cole o conteúdo inteiro de
`supabase/migrations/0001_init.sql` e execute. Isso cria as tabelas `properties` e
`leads`, as políticas de segurança e o bucket de arquivos `midia`.

**4.3** Crie seu usuário: **Authentication → Users → Add user**. Marque
*Auto Confirm User*. Esse é o login do painel — **não existe cadastro aberto no
site**, de propósito.

**4.4** Rode o configurador. Ele pede a URL e a chave, escreve o `.env.local` e —
se a Vercel já estiver ligada a esta pasta — envia as mesmas variáveis para lá:

```bash
node scripts/configurar.mjs
```

Os dois valores estão em **Project Settings → Data API**. O script recusa a chave
`service_role` se você colar a errada: ela ignora todas as regras de segurança do
banco e nunca pode ir para o navegador.

**4.5** Reinicie o `npm run dev` e acesse `http://localhost:3000/admin`.

> **Sobre a chave `anon` no navegador:** ela é pública por design. Quem protege os
> dados são as políticas RLS da migração — um visitante anônimo só **lê** imóveis
> publicados e só **escreve** em `leads` (sem nunca poder lê-los). Rascunho,
> endereço completo e caixa de contatos exigem sessão autenticada.

---

## 5. Publicar na Vercel

O código já está em
[github.com/KunzmannGit/ysraellkunzmann](https://github.com/KunzmannGit/ysraellkunzmann).
A partir daqui, todo `git push` na `main` publica sozinho.

### Pelo navegador

1. [vercel.com](https://vercel.com) → **Add New → Project** → importe
   `KunzmannGit/ysraellkunzmann`. A Vercel detecta Next.js; não mude nada.
2. **Settings → Environment Variables**: adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` em *Production*, *Preview* e *Development*.
3. **Deploy**.

### Ou pela linha de comando

```bash
vercel login
```

```bash
vercel link
```

```bash
node scripts/configurar.mjs
```

```bash
vercel --prod
```

---

## 6. Apontar o domínio

Fluxo: o **Porkbun** continua sendo o registrador, o **Cloudflare** passa a ser o
DNS, e o DNS aponta para a **Vercel**.

### 6.1 Cloudflare assume o DNS

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Add a site** →
   `ysraellkunzmann.com` → plano **Free**.
2. O Cloudflare mostra **dois nameservers** (algo como `iris.ns.cloudflare.com`).
   Copie os dois.
3. No Porkbun: **Domain Management → ysraellkunzmann.com → NS / Authoritative
   Nameservers → Edit**. Apague os do Porkbun e cole os dois do Cloudflare.
4. A propagação leva de minutos a algumas horas.

### 6.2 Vercel entrega os registros

1. No projeto da Vercel: **Settings → Domains → Add** → `ysraellkunzmann.com`.
   Adicione também `www.ysraellkunzmann.com`.
2. A Vercel exibe **exatamente** quais registros criar. **Use os valores que ela
   mostrar na sua tela**, não valores decorados de tutorial — a Vercel já trocou o
   IP do apex mais de uma vez.
3. No Cloudflare, em **DNS → Records**, crie o que a Vercel pediu. Normalmente um
   **A** em `@` e um **CNAME** em `www`.

### 6.3 O detalhe que quebra tudo

> **Deixe a nuvem CINZA (DNS only), não laranja.**
>
> Com o proxy do Cloudflare ligado, o certificado passa a ser negociado entre
> Cloudflare e Vercel e você cai em erro de TLS ou em laço de redirecionamento. A
> Vercel já é CDN, já emite o certificado e já faz cache na borda — proxiar por
> cima só adiciona um salto e um modo de falha.
>
> Se ainda assim quiser o proxy ligado, o SSL do Cloudflare **precisa** estar em
> **Full (strict)**.

### 6.4 Fechar

Em **SSL/TLS → Overview**, escolha **Full (strict)**. Espere a Vercel marcar os
domínios como *Valid Configuration* e defina o principal — recomendo o apex
`ysraellkunzmann.com`, com o `www` redirecionando.

---

## 7. Cadastrar um imóvel

1. Entre em `/admin` (login em `/entrar`).
2. **Novo imóvel**.
3. **Título** — o endereço na web se escreve sozinho a partir dele.
4. **Frase de abertura**: uma linha. Vale mais algo específico ("o último andar tem
   hora marcada com o pôr do sol") do que um adjetivo genérico ("excelente
   localização").
5. **Descrição**: parágrafos separados por **uma linha em branco**.
6. **Fotos**: envie na ordem em que se caminha pelo imóvel — essa ordem *é* o
   roteiro do tour. Marque a capa com a estrela.
7. **Tour**: ligue a chave. Sem vídeo, ele já funciona com as fotos. Crie capítulos
   para dar nome aos ambientes na trilha lateral.
8. Situação **publicado** → salvar.

O catálogo revalida a cada hora. Para ver na hora, republique pela Vercel.

> Enquanto a tabela `properties` estiver **vazia**, o site mostra o catálogo
> semente. No primeiro imóvel publicado, o banco assume por completo.

---

## 8. Gravar e preparar o vídeo do tour

**Na gravação:** caminhe devagar e sem parar, celular na horizontal, na altura do
peito. Um plano só por imóvel. Comece pela porta de entrada e termine no melhor
ambiente — o tour é lido como uma visita, não como um clipe.

**Na conversão:** o vídeo é controlado pelo scroll, então o navegador precisa
buscar qualquer instante instantaneamente. Vídeo comum tem quadro-chave a cada
5–10 s e trava ao ser rebobinado. Instale o [ffmpeg](https://ffmpeg.org) e force
quadros-chave frequentes:

```bash
ffmpeg -i entrada.mp4 -c:v libx264 -crf 23 -preset slow -vf "scale=1920:-2,fps=30" -g 10 -keyint_min 10 -sc_threshold 0 -an -movflags +faststart tour.mp4
```

| Trecho | Por quê |
|---|---|
| `-g 10 -keyint_min 10` | Quadro-chave a cada ⅓ de segundo. É isto que faz o scroll parecer um trilho em vez de um slideshow travado. |
| `-sc_threshold 0` | Impede o ffmpeg de decidir sozinho onde põe os quadros-chave. |
| `-an` | Remove o áudio: o vídeo toca mudo de qualquer forma. |
| `+faststart` | Move o índice para o começo do arquivo — sem isso o navegador baixa tudo antes do primeiro quadro. |

Versão WebM (menor, servida antes do MP4 em quem suporta):

```bash
ffmpeg -i entrada.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -vf "scale=1920:-2,fps=30" -g 10 -an tour.webm
```

Mire em **menos de 15 MB**. Acima disso o primeiro carregamento no 4G fica
desagradável e o ganho visual é nenhum. Envie pelo `/admin`, em **Tour → Vídeo
walkthrough**.

---

## 9. Mapa do projeto

```
src/
├── app/
│   ├── layout.tsx              Camada raiz: fontes, SEO, grão, cursor
│   ├── globals.css             Design system inteiro (tokens Tailwind v4)
│   ├── (site)/                 Site público — header, rodapé e abertura
│   │   ├── page.tsx            Home
│   │   ├── imoveis/            Catálogo e página do imóvel
│   │   ├── anuncie/            Captação de proprietários
│   │   └── sobre/  contato/
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
scripts/configurar.mjs          Chaves do Supabase (local + Vercel)
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
ritmo — e é isso que separa "visitar" de "assistir".

**`filters.ts` existe separado de `properties.ts`** porque o catálogo é um
componente de cliente. Importar de um módulo que toca `next/headers` arrastaria o
Supabase de servidor para dentro do bundle do navegador — o build quebra, e se não
quebrasse seria peso morto.

**As media queries usam `useSyncExternalStore`,** não `useEffect`. Ativar "reduzir
movimento" no sistema com o site aberto desliga as animações na hora.

**A cortina de abertura vem no HTML do servidor,** com duas válvulas: um
`<noscript>` que a esconde e uma animação CSS que a remove aos 6 s. Sem elas, um
bundle que não carrega deixaria o site preto para sempre — aconteceu uma vez
durante o desenvolvimento.

---

## Acessibilidade e desempenho

- Respeita `prefers-reduced-motion` em toda parte: o tour vira galeria estática, o
  cursor customizado desliga, o grão para de se mexer.
- Navegação por teclado completa, com atalho "pular para o conteúdo" e foco visível.
- Toda foto tem texto alternativo — o campo está no editor, ao lado da legenda.
- Imagens em AVIF/WebP com tamanhos responsivos pelo `next/image`.
- Páginas de imóvel estáticas com revalidação de 1 hora.
- Dados estruturados `RealEstateAgent` (Vila Velha, Vitória, Serra, Cariacica) e
  `RealEstateListing`.
