import Link from "next/link";
import { Building2, ExternalLink, Inbox } from "lucide-react";
import { site } from "@/lib/site";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

/**
 * Moldura do painel.
 * Sem cortina de abertura, sem rodapé de marketing, sem scroll com
 * inércia — aqui a pessoa está trabalhando, não sendo encantada.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-noir min-h-screen">
      <header className="border-noir-4 bg-noir/85 sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-baseline gap-3">
              <span className="font-display text-bone text-xl leading-none">YK</span>
              <span className="kicker">Painel</span>
            </Link>

            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                href="/admin"
                className="text-ash hover:text-bone flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
              >
                <Building2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                Imóveis
              </Link>
              <Link
                href="/admin/leads"
                className="text-ash hover:text-bone flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
              >
                <Inbox className="h-3.5 w-3.5" strokeWidth={1.5} />
                Contatos
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-smoke hover:text-gold flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
            >
              <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
              <span className="hidden md:inline">Ver o site</span>
            </a>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">{children}</main>

      <footer className="border-noir-4 mt-20 border-t">
        <div className="text-smoke mx-auto max-w-7xl px-5 py-6 font-mono text-[10px] tracking-[0.18em] uppercase md:px-8">
          {site.name} · {site.creci}
        </div>
      </footer>
    </div>
  );
}
