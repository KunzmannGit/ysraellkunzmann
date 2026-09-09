"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border-b border-noir-5 bg-transparent pt-6 pb-2.5 text-bone " +
  "outline-none transition-colors duration-400 focus:border-gold placeholder:text-smoke";

function LoginFormInner({ className }: { className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    setBusy(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      // A mensagem do Supabase vem em inglês e genérica de propósito
      // (não revela se o e-mail existe). Mantemos o sigilo, em português.
      setError("E-mail ou senha incorretos.");
      setBusy(false);
      return;
    }

    // refresh() faz o middleware reavaliar a sessão antes da navegação.
    router.refresh();
    router.push(params.get("de") ?? "/admin");
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-7", className)}>
      <div>
        <label htmlFor="email" className="kicker mb-1 block">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-cursor="text"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="kicker mb-1 block">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-cursor="text"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-ember text-sm" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={busy}>
        {busy ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}

export function LoginForm({ className }: { className?: string }) {
  // useSearchParams exige limite de Suspense em rota estática.
  return (
    <Suspense fallback={<div className={cn("h-72", className)} />}>
      <LoginFormInner className={className} />
    </Suspense>
  );
}
