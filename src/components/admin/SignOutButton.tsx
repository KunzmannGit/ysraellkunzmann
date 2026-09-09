"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    setBusy(true);
    await supabase.auth.signOut();
    // refresh() antes do push: sem isso o middleware ainda ve a sessao antiga.
    router.refresh();
    router.push("/entrar");
  }

  return (
    <button
      onClick={signOut}
      disabled={busy}
      className="text-smoke hover:text-ember flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-300 disabled:opacity-40"
    >
      <LogOut className="h-3 w-3" strokeWidth={1.5} />
      <span className="hidden md:inline">{busy ? "Saindo…" : "Sair"}</span>
    </button>
  );
}
