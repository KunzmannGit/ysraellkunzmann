import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

/* ═══════════════════════════════════════════════════════════
   INVALIDACAO SOB DEMANDA

   As paginas publicas sao estaticas com revalidacao de 1 hora.
   Isso as deixa instantaneas, mas criava um defeito que o dono do
   site sente na hora: trocar a capa no /admin e nao ver mudanca
   nenhuma no site — nem com Ctrl+Shift+R, porque o cache e do
   servidor, nao do navegador. A pessoa fica achando que o painel
   nao salvou.

   O mesmo cache tambem sobrevive a um `vercel --prod`: o Next
   restaura o cache de build da implantacao anterior, entao um
   deploy sem mudanca de codigo nao garante dado fresco — foi
   descoberto na pratica editando um imovel direto no banco (sem
   passar pelo /admin) e o deploy seguinte ainda servir a versao
   velha. Redeploy nao e a ferramenta certa para isto; invalidacao
   sob demanda e.

   Agora o editor avisa aqui depois de salvar, e as paginas
   afetadas sao regeradas na proxima visita. O cache continua
   valendo para quem visita; some so para quem acabou de editar.
   ═══════════════════════════════════════════════════════════ */

export async function POST(request: Request) {
  // Duas portas, um so proposito: so quem e de confianca invalida
  // cache. Um endpoint aberto deixaria qualquer um forcar rebuild
  // das paginas o dia inteiro.
  //
  //   1. Sessao autenticada — o /admin, no navegador do Ysraell.
  //   2. REVALIDATE_SECRET — scripts de manutencao que escrevem
  //      direto no banco (contornando o /admin de proposito, para
  //      curadoria em lote) e precisam do mesmo efeito colateral
  //      sem abrir um navegador e logar.
  const secret = process.env.REVALIDATE_SECRET;
  const auth = request.headers.get("authorization");
  const viaSegredo = Boolean(secret) && auth === `Bearer ${secret}`;

  if (!viaSegredo) {
    const supabase = await getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Banco não conectado." }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
    }
  }

  let slug: string | undefined;
  try {
    const body = await request.json();
    if (typeof body?.slug === "string") slug = body.slug;
  } catch {
    // Sem corpo: revalida só as listagens.
  }

  const alvos = ["/", "/imoveis"];
  if (slug) alvos.push(`/imoveis/${slug}`);

  for (const alvo of alvos) revalidatePath(alvo);

  return NextResponse.json({ ok: true, revalidated: alvos });
}
