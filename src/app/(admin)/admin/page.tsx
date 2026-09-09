import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Compass, Plus, Star } from "lucide-react";

import { listAdminProperties } from "@/lib/admin";
import { KIND_LABEL, type Kind } from "@/lib/types";
import { brl, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  publicado: "border-jade/50 text-jade",
  rascunho: "border-smoke/50 text-smoke",
  reservado: "border-gold/50 text-gold",
  alugado: "border-noir-5 text-ash",
  vendido: "border-noir-5 text-ash",
};

export default async function AdminHome() {
  const result = await listAdminProperties();

  if (!result.ok) {
    return (
      <div className="border-noir-4 bg-noir-2/60 rounded-sm border p-8">
        <AlertTriangle className="text-ember mb-5 h-6 w-6" strokeWidth={1.25} />
        <h1 className="font-display text-bone text-2xl">Não consegui ler o banco.</h1>
        <p className="text-ash mt-3 max-w-xl leading-relaxed">
          {result.reason === "sem-supabase"
            ? "O Supabase ainda não está conectado. Rode a migração em supabase/migrations/20260909190000_init.sql e preencha as variáveis de ambiente — o README tem o passo a passo."
            : `O banco respondeu com erro: ${result.reason}`}
        </p>
        <p className="text-smoke mt-5 text-sm">
          O site público continua no ar normalmente, servindo o catálogo semente.
        </p>
      </div>
    );
  }

  const rows = result.rows;
  const published = rows.filter((r) => r.status === "publicado").length;
  const drafts = rows.filter((r) => r.status === "rascunho").length;
  const withTour = rows.filter((r) => r.tour).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker text-gold mb-3">Carteira</p>
          <h1 className="font-display text-bone text-4xl md:text-5xl">Imóveis</h1>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="bg-gold text-noir hover:bg-gold-lit inline-flex h-11 items-center gap-2 rounded-full px-5 font-mono text-[10px] font-medium tracking-[0.18em] uppercase transition-colors duration-400"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Novo imóvel
        </Link>
      </div>

      {/* Resumo */}
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: rows.length },
          { label: "Publicados", value: published },
          { label: "Rascunhos", value: drafts },
          { label: "Com tour", value: withTour },
        ].map((stat) => (
          <div key={stat.label} className="border-noir-4 bg-noir-2/40 rounded-sm border p-5">
            <p className="font-display text-bone text-3xl leading-none">{stat.value}</p>
            <p className="text-smoke mt-2 font-mono text-[10px] tracking-[0.18em] uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Lista */}
      {rows.length === 0 ? (
        <div className="border-noir-4 mt-12 rounded-sm border border-dashed p-14 text-center">
          <p className="font-display text-bone text-2xl">Nenhum imóvel cadastrado ainda.</p>
          <p className="text-ash mt-3">
            Enquanto a tabela estiver vazia, o site público mostra o catálogo semente.
          </p>
          <Link
            href="/admin/imoveis/novo"
            className="bg-gold text-noir hover:bg-gold-lit mt-8 inline-flex h-11 items-center gap-2 rounded-full px-6 font-mono text-[10px] font-medium tracking-[0.18em] uppercase transition-colors duration-400"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Cadastrar o primeiro
          </Link>
        </div>
      ) : (
        <ul className="mt-12 space-y-3">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/admin/imoveis/${row.id}`}
                className="group border-noir-4 hover:border-gold-deep/60 bg-noir-2/40 flex items-center gap-5 rounded-sm border p-3.5 transition-colors duration-400"
              >
                <div className="bg-noir-3 relative h-16 w-24 shrink-0 overflow-hidden rounded-sm">
                  {row.cover?.url && (
                    <Image
                      src={row.cover.url}
                      alt={row.cover.alt ?? ""}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <p className="font-display text-bone group-hover:text-gold truncate text-lg transition-colors duration-400">
                      {row.title}
                    </p>
                    {row.featured && (
                      <Star className="text-gold h-3.5 w-3.5 shrink-0 fill-current" strokeWidth={0} />
                    )}
                    {row.tour ? (
                      <Compass className="text-gold-deep h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                    ) : null}
                  </div>
                  <p className="text-smoke mt-1 truncate font-mono text-[10px] tracking-[0.14em] uppercase">
                    {KIND_LABEL[row.kind as Kind] ?? row.kind} ·{" "}
                    {row.purpose === "aluguel" ? "Aluguel" : "Venda"} · {row.district ?? "—"} ·{" "}
                    {row.gallery?.length ?? 0} fotos
                  </p>
                </div>

                <p className="text-ash hidden shrink-0 font-mono text-sm sm:block">
                  {brl(row.price)}
                </p>

                <span
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 font-mono text-[9px] tracking-[0.16em] uppercase",
                    STATUS_STYLE[row.status] ?? "border-noir-5 text-ash",
                  )}
                >
                  {row.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
