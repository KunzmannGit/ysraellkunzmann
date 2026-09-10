import Link from "next/link";
import { nav, site, waLink } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Hairline, Reveal, WordReveal } from "@/components/ui/Reveal";
import { AdminLink } from "@/components/layout/AdminLink";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-noir relative overflow-hidden pt-28 md:pt-40">
      {/* Halo de ouro atrás do CTA — muito fraco, quase subconsciente */}
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)" }}
      />

      <div className="container-noir relative">
        <div className="max-w-4xl">
          <p className="kicker mb-8">Próximo passo</p>
          <h2 className="text-hero font-display text-bone">
            <WordReveal text="Me conta o que você" />
            <br />
            <span className="text-gilded italic">
              <WordReveal text="está procurando." delay={0.18} />
            </span>
          </h2>
          <Reveal delay={0.3} className="mt-9 max-w-xl">
            <p className="text-ash text-lg leading-relaxed">
              Resposta no mesmo dia. Se eu não tiver o imóvel, digo isso na primeira
              mensagem — e digo quem tem.
            </p>
          </Reveal>

          <Reveal delay={0.42} className="mt-11 flex flex-wrap gap-4">
            <ButtonLink href={waLink()} variant="gold" size="lg" arrow>
              Chamar no WhatsApp
            </ButtonLink>
            <ButtonLink href="/anuncie" variant="ghost" size="lg">
              Tenho um imóvel
            </ButtonLink>
          </Reveal>
        </div>

        <Hairline className="mt-24" />

        <div className="grid grid-cols-2 gap-y-12 py-16 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-bone text-2xl">Ysraell Kunzmann</p>
            <p className="text-smoke mt-2 max-w-[22rem] text-sm leading-relaxed">
              {site.role} e {site.secondRole}. {site.reach}
            </p>
            <p className="kicker mt-5">{site.creci}</p>
          </div>

          <div>
            <p className="kicker mb-5">Navegar</p>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ash hover:text-gold inline-block py-1.5 text-sm transition-colors duration-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="kicker mb-5">Falar</p>
            {/* O e-mail nao tem espaco onde quebrar e vazava da coluna no
                celular. `anywhere` (e nao `break-word`) e o que realmente
                encolhe a caixa: so ele conta a quebra forcada no calculo
                de largura minima do elemento. */}
            <ul className="space-y-3 text-sm [overflow-wrap:anywhere]">
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ash hover:text-gold inline-block py-1.5 transition-colors duration-400"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-ash hover:text-gold inline-block py-1.5 transition-colors duration-400"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ash hover:text-gold inline-block py-1.5 transition-colors duration-400"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ash hover:text-gold inline-block py-1.5 transition-colors duration-400"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ash hover:text-gold inline-block py-1.5 transition-colors duration-400"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="kicker mb-5">{site.partner.kind}</p>
            <p className="font-display text-bone text-lg leading-tight">{site.partner.name}</p>
            <p className="text-smoke mt-3 text-sm leading-relaxed">
              Captação, contrato e garantia locatícia com respaldo de imobiliária.
            </p>
          </div>
        </div>

        <Hairline />

        <div className="text-smoke flex flex-col gap-3 py-8 font-mono text-[10px] tracking-[0.18em] uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {site.name}
          </span>
          <div className="flex items-center gap-6">
            {/* Só aparece para quem já está autenticado. Ver AdminLink. */}
            <AdminLink />
            <span className="text-smoke/70">Projetado e construído por Ysraell Kunzmann</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
