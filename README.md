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
| Código | [KunzmannGit/ysraellkunzmann](https://github.com/KunzmannGit/ysraellkunzmann) | público |

---

## Estado atual — no ar

| | |
|---|---|
| **Site** | https://ysraellkunzmann.com |
| **Painel** | https://ysraellkunzmann.com/admin |
| **Supabase** | `zobkmtqckibdfckjgmcp` · South America (São Paulo) |
| **Vercel** | `ysraell-kunzmann/ysraellkunzmann` · Hobby |
| **DNS** | Cloudflare (nuvem cinza) · registro no Porkbun |

Verificado em produção:

```
11 rotas + 404          200 / 404 corretos, TLS válido
www → apex              308, preservando o caminho
http → https            308
/admin sem sessão       307 → /entrar
ler imóveis (anônimo)   200  permitido
ler contatos (anônimo)  401  BLOQUEADO
criar contato (anônimo) 201  permitido
criar imóvel (anônimo)  401  BLOQUEADO
storage público         200  fotos carregam sem chave
POST /api/leads         stored: true
```

---

## Sumário

1. [Rodar na sua máquina](#1-rodar-na-sua-máquina)
2. [Seus dados no site](#2-seus-dados-no-site)
3. [Criar o e-mail do domínio](#3-criar-o-e-mail-do-domínio) · [aviso de contato](#3d--aviso-por-e-mail-a-cada-contato-recebido) · [agenda](#3e--agenda-de-compromissos)
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

`contato@ysraellkunzmann.com` não vem junto com o domínio — é serviço à parte.

> **Zoho não serve mais.** O "Forever Free Plan" que circula em tutoriais **não
> existe na página brasileira**: lá só há Mail Lite (R$ 5/usuário/mês), Workplace
> (R$ 12), Premium (R$ 20) e um teste de 15 dias. Verificado em setembro de 2026.

**Escolha feita: Cloudflare Email Routing.** Grátis para sempre, três minutos, e
o DNS já está no Cloudflare. Ele **recebe** em `contato@ysraellkunzmann.com` e
encaminha para a caixa que você já usa.

O que ele **não** faz: enviar *como* `contato@`. As respostas saem do seu
endereço pessoal. Foi uma troca consciente — custo e simplicidade acima do
remetente na resposta. Se um dia isso incomodar, as saídas são Zoho Mail Lite
(R$ 5/mês) ou um relay SMTP ligado ao Gmail.

### Passo a passo

1. Cloudflare → domínio `ysraellkunzmann.com` → **Email → Email Routing** →
   **Get started**.
2. **Antes de aceitar os MX dele, apague os registros do Porkbun** que sobraram:
   - MX `fwd1.porkbun.com` (prioridade 10)
   - MX `fwd2.porkbun.com` (prioridade 20)
   - TXT `v=spf1 include:_spf.porkbun.com ~all`

   Dois conjuntos de MX convivendo entregam seu e-mail para ninguém.
3. Aceite os MX que o Cloudflare cria.
4. **Create address**: `contato@ysraellkunzmann.com` → encaminhar para
   `ouro.imoveis@hotmail.com`.
5. Confirme o e-mail de verificação que chega no Hotmail.

### Como usar no dia a dia

Não muda nada na sua rotina: continua lendo tudo no Hotmail. A diferença é que o
endereço que você divulga — no site, no cartão, no anúncio — passa a ser
`contato@ysraellkunzmann.com`, e ele cai na mesma caixa.

A página de contato do site mostra os dois endereços, com o do domínio primeiro.

## 3.D — Aviso por e-mail a cada contato recebido

Todo contato do site já aparece no `/admin`. Para também chegar um e-mail:

**Por que num subdomínio.** Um domínio só pode ter **um** registro SPF. Se o Zoho
publicar o dele em `ysraellkunzmann.com` e o serviço de envio publicar outro, os
dois se anulam e o seu e-mail passa a cair no spam. Separando os papéis, cada um
tem o próprio SPF e não há conflito:

```
ysraellkunzmann.com        Zoho     você lendo e respondendo cliente
send.ysraellkunzmann.com   Resend   o site avisando você
```

**Passo a passo**

1. [resend.com](https://resend.com) → conta gratuita (3.000 e-mails/mês, 100/dia —
   sobra muito para um site de corretor).
2. **Domains → Add Domain** → digite **`send.ysraellkunzmann.com`**, e não o
   domínio principal.
3. O Resend entrega registros **TXT** (SPF e DKIM) e um **MX**. Crie todos no
   Cloudflare com a nuvem **cinza**. Repare que o `Name` deles termina em `.send`
   — é isso que mantém tudo separado do Zoho.
4. Espere ficar **Verified**.
5. **API Keys → Create API Key**, permissão *Sending access*.
6. Grave a chave:

```bash
npx vercel env add RESEND_API_KEY production --type secret
```

Repita para `preview` e `development`, e refaça o deploy.

Não precisa mexer em `LEAD_NOTIFY_FROM` nem `LEAD_NOTIFY_TO`: sem elas o site já
envia de `site@send.ysraellkunzmann.com` para os dois endereços de
`src/lib/site.ts`.

**Para onde o aviso vai**

Como o `contato@` é **encaminhado** para o Hotmail, mandar o aviso para os dois
endereços faria chegar **duas cópias idênticas na mesma caixa**. Por isso o
padrão é enviar só para `ouro.imoveis@hotmail.com` — um salto a menos, sem
duplicata. Para mudar, é uma variável:

```bash
npx vercel env add LEAD_NOTIFY_TO production
```

**Como o aviso se comporta**

- O **Reply-To** aponta para quem escreveu: responder na sua caixa já vai direto
  para o cliente, sem copiar endereço.
- Se o banco estiver fora no momento, o e-mail avisa em destaque que **ele é o
  único registro** daquele contato.
- Se o Resend estiver fora, **o contato não se perde**: já foi gravado no banco e
  está no `/admin`.

---

## 3.E — Agenda de compromissos

`/admin/agenda`: cadastre visitas e compromissos, com dois avisos automáticos por
e-mail — um na hora que você cadastra (confirmação) e outro na manhã do dia (o
lembrete).

**Configuração** — as mesmas variáveis do item 3.D cobrem o remetente. Só falta o
destino, se você quiser diferente do padrão (que já é o seu Gmail):

```bash
npx vercel env add AGENDA_NOTIFY_TO production   # padrão: ysraellffkunzmann13@gmail.com
```

**O lembrete diário precisa de duas peças a mais**, porque ele roda sozinho, sem
ninguém logado:

1. **Segredo do cron** — protege `/api/cron/lembretes` para que só a própria
   Vercel consiga chamá-la:

   ```bash
   openssl rand -hex 32
   ```

   ```bash
   npx vercel env add CRON_SECRET production
   ```

2. **Chave de serviço do Supabase** — *Project Settings → API → service_role*.
   É a única rota do projeto que usa essa chave: como o cron não tem sessão de
   usuário, não há como a RLS validar um "autenticado" que não existe.

   ```bash
   npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
   ```

O agendamento em si já está em `vercel.json` (`0 11 * * *`, ou seja, 8h de
Brasília todo dia — o Brasil não tem mais horário de verão desde 2019, então o
deslocamento -03:00 é fixo o ano inteiro). A Vercel lê esse arquivo sozinha; não
precisa configurar nada no painel dela.

> Um compromisso criado depois que o cron já rodou no dia só recebe o lembrete
> no dia seguinte. Para o dia de hoje, a confirmação do cadastro já cumpre esse
> papel.

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
`supabase/migrations/20260909190000_init.sql` e execute. Isso cria as tabelas `properties` e
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
│   │   └── agenda/             Compromissos e visitas
│   ├── (auth)/entrar/          Login
│   └── api/
│       ├── leads/              Recebimento de contatos
│       ├── agenda/             Cria compromisso + confirmação por e-mail
│       └── cron/lembretes/     Lembrete diário (chamado pela Vercel)
├── components/
│   ├── fx/                     Grão, vinheta, cursor, cortina, scroll suave
│   ├── ui/                     Botão, revelações, magnetismo
│   ├── layout/                 Header, rodapé, cabeçalho de página
│   ├── home/                   Seções da home
│   ├── property/               Card, catálogo, galeria
│   ├── tour/ScrollTour.tsx     ★ O tour imersivo
│   ├── forms/LeadForm.tsx      Formulário com rede de segurança
│   └── admin/                  Editor, upload, caixa de contatos, agenda
├── lib/
│   ├── site.ts                 ★ Seus dados
│   ├── types.ts                Modelo de domínio
│   ├── properties.ts           Leitura (Supabase → semente)
│   ├── filters.ts              Filtragem pura (roda no navegador)
│   ├── hooks.ts                Estado do navegador reativo
│   ├── email.ts                Envio por Resend (camada comum)
│   ├── notify.ts                Aviso de novo contato
│   ├── notify-agenda.ts        Confirmação + lembrete de compromisso
│   └── supabase/
│       ├── server.ts           Cliente com sessão (/admin, rotas comuns)
│       ├── public.ts           Cliente sem sessão (catálogo, sitemap)
│       └── service.ts          Chave service_role — só o cron usa
├── data/properties.ts          Catálogo semente
└── proxy.ts                    Sessão + proteção do /admin
scripts/configurar.mjs          Chaves do Supabase (local + Vercel)
supabase/migrations/            SQL do banco
vercel.json                     Agendamento do lembrete diário
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

**A chave `service_role` vive isolada em `lib/supabase/service.ts`,** importada
em um único arquivo do projeto: o cron do lembrete diário. Ela ignora toda regra
de RLS, e existe só porque o cron roda sem sessão de usuário — não há como a
RLS validar um "autenticado" que não existe às 8h da manhã, sozinho. Todo o
resto do site (catálogo, painel, formulários) continua funcionando com a chave
`anon`, que é segura no navegador por design.

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
