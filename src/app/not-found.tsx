import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

/**
 * 404 global: pega URLs que nao casam com nenhum grupo de rota
 * e por isso nao passa pelo layout de (site) — precisa trazer a
 * moldura por conta propria.
 */
export default function GlobalNotFound() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
