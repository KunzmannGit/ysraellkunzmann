import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "@/lib/site";
import { supabaseEnabled } from "@/lib/supabase/config";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function EntrarPage() {
  return (
    <div className="bg-noir relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full opacity-[0.07] blur-[130px]"
        style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className="text-smoke hover:text-gold mb-12 inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Voltar ao site
        </Link>

        <p className="font-display text-bone text-3xl leading-none">YK</p>
        <p className="kicker mt-3">Painel · {site.creci}</p>

        <h1 className="font-display text-bone mt-10 text-4xl leading-tight">
          Bem-vindo
          <br />
          <span className="text-gilded italic">de volta.</span>
        </h1>

        {supabaseEnabled ? (
          <LoginForm className="mt-10" />
        ) : (
          <div className="border-noir-4 bg-noir-2/60 mt-10 rounded-sm border p-6">
            <p className="text-bone font-display text-xl">Banco ainda não conectado.</p>
            <p className="text-ash mt-3 text-sm leading-relaxed">
              O painel precisa do Supabase. Rode a migração em{" "}
              <code className="text-gold font-mono text-xs">supabase/migrations</code> e
              preencha <code className="text-gold font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
              e{" "}
              <code className="text-gold font-mono text-xs">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              no <code className="text-gold font-mono text-xs">.env.local</code>. O passo a
              passo completo está no README.
            </p>
            <p className="text-smoke mt-4 text-xs leading-relaxed">
              Enquanto isso o site público continua no ar, servindo o catálogo semente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
