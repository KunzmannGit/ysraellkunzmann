import Link from "next/link";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";

/** Corpo do 404, compartilhado entre o 404 do site e o 404 global. */
export function NotFoundContent() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-32 pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-[0.08] blur-[130px]"
        style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)" }}
      />

      <div className="container-noir relative">
        <p className="kicker text-gold mb-8">Erro 404</p>

        <h1 className="font-display text-bone text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.92]">
          Esta porta não
          <br />
          <span className="text-gilded italic">abre para nada.</span>
        </h1>

        <p className="text-ash mt-8 max-w-lg text-lg leading-relaxed">
          O endereço que você tentou não existe — ou o imóvel já foi alugado e saiu do ar.
          Acontece, e costuma acontecer rápido.
        </p>

        <div className="mt-11 flex flex-wrap gap-4">
          <ButtonLink href="/imoveis" variant="gold" size="lg" arrow>
            Ver o que está disponível
          </ButtonLink>
          <ButtonLink href="/" variant="ghost" size="lg">
            Voltar ao início
          </ButtonLink>
        </div>

        <p className="text-smoke mt-14 text-sm">
          Procurava algo específico?{" "}
          <Link
            href="/contato"
            className="text-ash hover:text-gold underline underline-offset-4 transition-colors duration-400"
          >
            Me diga o que era
          </Link>{" "}
          — eu costumo ter mais imóveis do que os publicados aqui.
        </p>

        <p className="kicker mt-10">{site.creci}</p>
      </div>
    </section>
  );
}
