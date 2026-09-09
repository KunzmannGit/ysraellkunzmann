"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════════════════
   ATALHO PARA O PAINEL

   Aparece no rodapé apenas para quem já tem sessão aberta —
   ou seja, só para o Ysraell, e só no navegador onde ele
   entrou. Visitante nenhum vê.

   Duas razões para ser assim, e não um link fixo:

   1. Link "admin" exposto não passa credibilidade. Passa
      "sistema caseiro", e entrega a todo robô o endereço
      exato do formulário de login.

   2. A verificação roda no NAVEGADOR, não no servidor. Ler
      o cookie de sessão no rodapé — que aparece em todas as
      páginas — tornaria o site inteiro dinâmico e mataria a
      geração estática. O atalho de uma pessoa não pode custar
      a velocidade de todas as outras.

   O preço é que ele surge um instante depois do carregamento.
   Para um atalho pessoal, é troca barata.
   ═══════════════════════════════════════════════════════════ */

export function AdminLink() {
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    let vivo = true;
    // O cliente do navegador é criado sem tipos de banco, então os
    // retornos do auth chegam soltos: anotar aqui evita `any` implícito.
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (vivo) setLogado(Boolean(data.session));
    });

    // Sair em outra aba some com o atalho aqui também.
    const { data: sub } = supabase.auth.onAuthStateChange((_evento: string, sessao: Session | null) => {
      if (vivo) setLogado(Boolean(sessao));
    });

    return () => {
      vivo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!logado) return null;

  return (
    <Link
      href="/admin"
      className="text-gold-deep hover:text-gold inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-400"
    >
      <LayoutDashboard className="h-3 w-3" strokeWidth={1.5} />
      Painel
    </Link>
  );
}
