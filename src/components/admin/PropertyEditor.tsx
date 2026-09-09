"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, ExternalLink, Loader2, Plus, Trash2, X } from "lucide-react";

import type { Kind, Media, Purpose, Status, Tour, TourChapter } from "@/lib/types";
import { KIND_LABEL, KINDS, PURPOSES, STATUSES } from "@/lib/types";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { cn, slugify } from "@/lib/utils";
import { MediaList, MediaUploader } from "@/components/admin/MediaManager";

/* ═══════════════════════════════════════════════════════════
   EDITOR DE IMOVEL

   Escreve direto no Supabase pelo navegador. Nao ha rota de API
   no meio porque as politicas RLS ja garantem que so quem esta
   autenticado escreve — uma camada a mais so adicionaria latencia
   e um lugar a mais para o bug morar.
   ═══════════════════════════════════════════════════════════ */

interface DraftState {
  slug: string;
  title: string;
  headline: string;
  story: string;
  purpose: Purpose;
  kind: Kind;
  status: Status;
  price: string;
  condo_fee: string;
  iptu: string;
  area: string;
  bedrooms: string;
  suites: string;
  bathrooms: string;
  parking: string;
  district: string;
  city: string;
  state: string;
  street: string;
  zip: string;
  featured: boolean;
  via_partner: boolean;
  published_at: string;
  features: string[];
  cover: Media | null;
  gallery: Media[];
  tour: Tour | null;
}

const EMPTY: DraftState = {
  slug: "",
  title: "",
  headline: "",
  story: "",
  purpose: "aluguel",
  kind: "apartamento",
  status: "rascunho",
  price: "",
  condo_fee: "",
  iptu: "",
  area: "",
  bedrooms: "",
  suites: "",
  bathrooms: "",
  parking: "",
  district: "",
  city: "",
  state: "",
  street: "",
  zip: "",
  featured: false,
  via_partner: false,
  published_at: new Date().toISOString().slice(0, 10),
  features: [],
  cover: null,
  gallery: [],
  tour: null,
};

const num = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")));
const int = (v: string) => (v.trim() === "" ? null : Math.trunc(Number(v)));

/* ── Peças de formulário ── */

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-noir-4 border-t pt-8">
      <h2 className="font-display text-bone text-2xl">{title}</h2>
      {hint && <p className="text-smoke mt-1.5 max-w-2xl text-sm leading-relaxed">{hint}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

const fieldClass =
  "w-full border-b border-noir-5 bg-transparent pb-2 pt-1 text-bone outline-none " +
  "transition-colors duration-300 focus:border-gold placeholder:text-smoke";

function Text({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="kicker mb-1.5 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-cursor="text"
        className={fieldClass}
      />
      {hint && <span className="text-smoke mt-1.5 block text-xs">{hint}</span>}
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="kicker mb-1.5 block">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        data-cursor="text"
        className={cn(fieldClass, "resize-y leading-relaxed")}
      />
      {hint && <span className="text-smoke mt-1.5 block text-xs">{hint}</span>}
    </label>
  );
}

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="kicker mb-2.5 block">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-300",
              value === option.value
                ? "border-gold bg-gold text-noir font-medium"
                : "border-noir-5 text-ash hover:border-smoke hover:text-bone",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-start gap-3.5 text-left"
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-300",
          value ? "border-gold bg-gold text-noir" : "border-noir-5 text-transparent",
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span>
        <span className="text-bone block text-sm">{label}</span>
        {hint && <span className="text-smoke mt-0.5 block text-xs leading-relaxed">{hint}</span>}
      </span>
    </button>
  );
}

/* ── Editor ── */

export function PropertyEditor({
  initial,
  id,
}: {
  /** Linha do banco, quando editando. `null` cria um novo. */
  initial: Record<string, unknown> | null;
  id: string | null;
}) {
  const router = useRouter();

  const [draft, setDraft] = useState<DraftState>(() => {
    if (!initial) return EMPTY;
    const r = initial as Record<string, never>;
    const asText = (v: unknown) => (v == null ? "" : String(v));
    return {
      ...EMPTY,
      slug: asText(r.slug),
      title: asText(r.title),
      headline: asText(r.headline),
      story: asText(r.story),
      purpose: (r.purpose ?? "aluguel") as Purpose,
      kind: (r.kind ?? "apartamento") as Kind,
      status: (r.status ?? "rascunho") as Status,
      price: asText(r.price),
      condo_fee: asText(r.condo_fee),
      iptu: asText(r.iptu),
      area: asText(r.area),
      bedrooms: asText(r.bedrooms),
      suites: asText(r.suites),
      bathrooms: asText(r.bathrooms),
      parking: asText(r.parking),
      district: asText(r.district),
      city: asText(r.city),
      state: asText(r.state),
      street: asText(r.street),
      zip: asText(r.zip),
      featured: Boolean(r.featured),
      via_partner: Boolean(r.via_partner),
      published_at: asText(r.published_at) || EMPTY.published_at,
      features: (r.features as unknown as string[]) ?? [],
      cover: (r.cover as unknown as Media) ?? null,
      gallery: (r.gallery as unknown as Media[]) ?? [],
      tour: (r.tour as unknown as Tour) ?? null,
    };
  });

  const [featureInput, setFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "erro"; text: string } | null>(null);

  const set = <K extends keyof DraftState>(key: K, value: DraftState[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  // Pasta do Storage: slug quando existe, senão o id. Mantém a mídia
  // do imóvel junta e fácil de achar pelo painel do Supabase.
  const folder = useMemo(() => draft.slug || id || "rascunho", [draft.slug, id]);

  function addFeature() {
    const value = featureInput.trim();
    if (!value || draft.features.includes(value)) return;
    set("features", [...draft.features, value]);
    setFeatureInput("");
  }

  function onTitleChange(value: string) {
    setDraft((d) => ({
      ...d,
      title: value,
      // O slug só acompanha o título enquanto ninguém o editou à mão
      // e o imóvel ainda não foi publicado — mudar slug publicado quebra link.
      slug: d.slug === slugify(d.title) || d.slug === "" ? slugify(value) : d.slug,
    }));
  }

  function updateTour(changes: Partial<Tour>) {
    setDraft((d) => ({
      ...d,
      tour: {
        kind: "frames",
        poster: d.cover?.url ?? "",
        chapters: [],
        ...(d.tour ?? {}),
        ...changes,
      },
    }));
  }

  function updateChapter(index: number, changes: Partial<TourChapter>) {
    if (!draft.tour) return;
    updateTour({
      chapters: draft.tour.chapters.map((c, i) => (i === index ? { ...c, ...changes } : c)),
    });
  }

  async function save() {
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setMessage({ tone: "erro", text: "Supabase não conectado." });
      return;
    }

    if (!draft.title.trim() || !draft.slug.trim()) {
      setMessage({ tone: "erro", text: "Título e endereço (slug) são obrigatórios." });
      return;
    }

    setSaving(true);
    setMessage(null);

    const payload = {
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      headline: draft.headline.trim() || null,
      story: draft.story.trim() || null,
      purpose: draft.purpose,
      kind: draft.kind,
      status: draft.status,
      price: num(draft.price),
      condo_fee: num(draft.condo_fee),
      iptu: num(draft.iptu),
      area: num(draft.area),
      bedrooms: int(draft.bedrooms),
      suites: int(draft.suites),
      bathrooms: int(draft.bathrooms),
      parking: int(draft.parking),
      district: draft.district.trim() || null,
      city: draft.city.trim() || null,
      state: draft.state.trim() || null,
      street: draft.street.trim() || null,
      zip: draft.zip.trim() || null,
      features: draft.features,
      cover: draft.cover,
      gallery: draft.gallery,
      tour: draft.tour,
      featured: draft.featured,
      via_partner: draft.via_partner,
      published_at: draft.published_at,
    };

    const query = id
      ? supabase.from("properties").update(payload).eq("id", id).select("id").single()
      : supabase.from("properties").insert(payload).select("id").single();

    const { data, error } = await query;
    setSaving(false);

    if (error) {
      setMessage({
        tone: "erro",
        text: error.message.includes("duplicate")
          ? "Já existe um imóvel com esse endereço (slug). Escolha outro."
          : error.message,
      });
      return;
    }

    setMessage({ tone: "ok", text: "Salvo." });
    router.refresh();
    if (!id && data?.id) router.replace(`/admin/imoveis/${data.id}`);
  }

  async function remove() {
    if (!id) return;
    if (!window.confirm(`Apagar "${draft.title}" definitivamente? Isso não volta atrás.`)) return;

    const supabase = getBrowserSupabase();
    if (!supabase) return;

    setDeleting(true);
    const { error } = await supabase.from("properties").delete().eq("id", id);
    setDeleting(false);

    if (error) {
      setMessage({ tone: "erro", text: error.message });
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="pb-32">
      {/* ── Cabeçalho fixo com as ações ── */}
      <div className="border-noir-4 bg-noir/90 sticky top-16 z-40 -mx-5 mb-10 border-b px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="kicker">{id ? "Editando" : "Novo imóvel"}</p>
            <p className="font-display text-bone mt-1 truncate text-xl">
              {draft.title || "Sem título"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {message && (
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.16em] uppercase",
                  message.tone === "ok" ? "text-jade" : "text-ember",
                )}
              >
                {message.text}
              </span>
            )}

            {id && draft.status === "publicado" && (
              <a
                href={`/imoveis/${draft.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-smoke hover:text-gold flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
              >
                <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                Ver no site
              </a>
            )}

            {id && (
              <button
                type="button"
                onClick={remove}
                disabled={deleting}
                className="text-smoke hover:text-ember flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 disabled:opacity-40"
                title="Apagar imóvel"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="bg-gold text-noir hover:bg-gold-lit inline-flex h-11 items-center gap-2 rounded-full px-6 font-mono text-[10px] font-medium tracking-[0.18em] uppercase transition-colors duration-400 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />}
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div className="space-y-12">
          <Section title="Identificação">
            <Text label="Título" value={draft.title} onChange={onTitleChange} placeholder="Cobertura Aurora" />
            <Text
              label="Endereço na web (slug)"
              value={draft.slug}
              onChange={(v) => set("slug", slugify(v))}
              hint={`O imóvel ficará em /imoveis/${draft.slug || "…"}. Depois de publicado, evite mudar — links antigos param de funcionar.`}
            />
            <Text
              label="Frase de abertura"
              value={draft.headline}
              onChange={(v) => set("headline", v)}
              placeholder="O último andar tem hora marcada com o pôr do sol."
              hint="Uma linha. É o que aparece no card e logo abaixo do título."
            />
            <Area
              label="Descrição"
              value={draft.story}
              onChange={(v) => set("story", v)}
              rows={10}
              hint="Separe os parágrafos com uma linha em branco. Conte o que a foto não mostra: a luz, o barulho, quem morava antes."
            />
          </Section>

          <Section
            title="Fotos"
            hint="A primeira coisa que a pessoa vê e a matéria-prima do tour. Envie na ordem em que se caminha pelo imóvel."
          >
            <MediaUploader
              folder={folder}
              onUploaded={(items) =>
                setDraft((d) => ({
                  ...d,
                  gallery: [...d.gallery, ...items],
                  cover: d.cover ?? items[0] ?? null,
                }))
              }
            />

            {draft.cover && (
              <div className="border-gold/40 bg-noir-2/40 mt-4 rounded-sm border p-3">
                <p className="kicker text-gold mb-2">Capa atual</p>
                <p className="text-ash truncate font-mono text-xs">{draft.cover.url}</p>
              </div>
            )}

            <MediaList
              items={draft.gallery}
              onChange={(next) => set("gallery", next)}
              coverUrl={draft.cover?.url}
              onSetCover={(item) => set("cover", item)}
            />
          </Section>

          <Section
            title="Tour"
            hint="Com as fotos acima já dá para montar o tour navegável. Se você tiver um vídeo walkthrough, ele substitui as fotos no palco."
          >
            <Toggle
              label="Ativar tour imersivo neste imóvel"
              hint="Ligado, a página ganha a seção em que o visitante caminha pelo imóvel rolando a tela."
              value={draft.tour !== null}
              onChange={(on) =>
                set(
                  "tour",
                  on
                    ? {
                        kind: "frames",
                        poster: draft.cover?.url ?? "",
                        chapters: [],
                      }
                    : null,
                )
              }
            />

            {draft.tour && (
              <>
                <Choice
                  label="Modo"
                  value={draft.tour.kind}
                  options={[
                    { value: "frames" as const, label: "Pelas fotos" },
                    { value: "video" as const, label: "Vídeo walkthrough" },
                  ]}
                  onChange={(v) => updateTour({ kind: v })}
                />

                {draft.tour.kind === "video" && (
                  <div className="space-y-4">
                    <MediaUploader
                      folder={`${folder}/tour`}
                      label="Enviar vídeo do tour"
                      onUploaded={(items) => {
                        const file = items[0];
                        if (!file) return;
                        const type = file.url.endsWith(".webm") ? "video/webm" : "video/mp4";
                        updateTour({ sources: [{ src: file.url, type }] });
                      }}
                    />
                    {draft.tour.sources?.map((s) => (
                      <p key={s.src} className="text-ash truncate font-mono text-xs">
                        {s.src}
                      </p>
                    ))}
                    <p className="text-smoke text-xs leading-relaxed">
                      Grave andando devagar, em plano contínuo, 1080p. Exporte com{" "}
                      <code className="text-ash">keyframes a cada 1 s</code> — sem isso o vídeo
                      trava ao ser controlado pelo scroll. O comando de conversão está no README.
                    </p>
                  </div>
                )}

                {/* Capítulos */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="kicker">Capítulos</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateTour({
                          chapters: [
                            ...(draft.tour?.chapters ?? []),
                            {
                              id: `c${Date.now()}`,
                              label: "Novo ambiente",
                              at: draft.tour?.chapters.length ?? 0,
                            },
                          ],
                        })
                      }
                      className="text-gold hover:text-gold-lit flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase"
                    >
                      <Plus className="h-3 w-3" strokeWidth={2} />
                      Adicionar
                    </button>
                  </div>

                  {draft.tour.chapters.length === 0 ? (
                    <p className="text-smoke border-noir-4 rounded-sm border border-dashed px-4 py-5 text-xs leading-relaxed">
                      Sem capítulos, cada foto vira um passo automático do tour. Crie capítulos
                      para dar nome aos ambientes na trilha lateral.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {draft.tour.chapters.map((chapter, i) => (
                        <li key={chapter.id} className="flex items-center gap-3">
                          <input
                            value={chapter.label}
                            onChange={(e) => updateChapter(i, { label: e.target.value })}
                            placeholder="Nome do ambiente"
                            className="border-noir-5 text-bone focus:border-gold flex-1 border-b bg-transparent pb-1.5 text-sm outline-none"
                          />
                          <input
                            value={chapter.note ?? ""}
                            onChange={(e) => updateChapter(i, { note: e.target.value })}
                            placeholder="Nota (opcional)"
                            className="border-noir-5 text-ash focus:border-gold flex-1 border-b bg-transparent pb-1.5 text-sm italic outline-none"
                          />
                          <input
                            type="number"
                            value={chapter.at}
                            onChange={(e) => updateChapter(i, { at: Number(e.target.value) })}
                            title={
                              draft.tour?.kind === "video"
                                ? "Segundo do vídeo"
                                : "Índice da foto (0 = capa)"
                            }
                            className="border-noir-5 text-ash focus:border-gold w-16 border-b bg-transparent pb-1.5 text-center font-mono text-sm outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateTour({
                                chapters: draft.tour!.chapters.filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-smoke hover:text-ember"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </Section>
        </div>

        {/* ── Coluna lateral ── */}
        <div className="space-y-12">
          <Section title="Publicação">
            <Choice
              label="Situação"
              value={draft.status}
              options={STATUSES.map((s) => ({ value: s, label: s }))}
              onChange={(v) => set("status", v)}
            />
            <Choice
              label="Finalidade"
              value={draft.purpose}
              options={PURPOSES.map((p) => ({
                value: p,
                label: p === "aluguel" ? "Aluguel" : "Venda",
              }))}
              onChange={(v) => set("purpose", v)}
            />
            <Choice
              label="Tipo"
              value={draft.kind}
              options={KINDS.map((k) => ({ value: k, label: KIND_LABEL[k] }))}
              onChange={(v) => set("kind", v)}
            />
            <Text
              label="Data de publicação"
              type="date"
              value={draft.published_at}
              onChange={(v) => set("published_at", v)}
            />
            <div className="space-y-4 pt-2">
              <Toggle
                label="Destacar na home"
                hint="Imóveis destacados abrem a home e aparecem primeiro no catálogo."
                value={draft.featured}
                onChange={(v) => set("featured", v)}
              />
              <Toggle
                label="Captado em parceria"
                hint="Mostra o selo da imobiliária parceira na página do imóvel."
                value={draft.via_partner}
                onChange={(v) => set("via_partner", v)}
              />
            </div>
          </Section>

          <Section title="Valores">
            <Text label="Valor (R$)" value={draft.price} onChange={(v) => set("price", v)} placeholder="4200" />
            <Text label="Condomínio (R$)" value={draft.condo_fee} onChange={(v) => set("condo_fee", v)} />
            <Text label="IPTU mensal (R$)" value={draft.iptu} onChange={(v) => set("iptu", v)} />
          </Section>

          <Section title="Ficha técnica">
            <div className="grid grid-cols-2 gap-5">
              <Text label="Área (m²)" value={draft.area} onChange={(v) => set("area", v)} />
              <Text label="Dormitórios" value={draft.bedrooms} onChange={(v) => set("bedrooms", v)} />
              <Text label="Suítes" value={draft.suites} onChange={(v) => set("suites", v)} />
              <Text label="Banheiros" value={draft.bathrooms} onChange={(v) => set("bathrooms", v)} />
              <Text label="Vagas" value={draft.parking} onChange={(v) => set("parking", v)} />
            </div>
          </Section>

          <Section title="Localização" hint="Rua e número não aparecem no card público — só na conversa.">
            <Text label="Bairro" value={draft.district} onChange={(v) => set("district", v)} />
            <div className="grid grid-cols-[2fr_1fr] gap-5">
              <Text label="Cidade" value={draft.city} onChange={(v) => set("city", v)} />
              <Text label="UF" value={draft.state} onChange={(v) => set("state", v)} />
            </div>
            <Text label="Rua e número" value={draft.street} onChange={(v) => set("street", v)} />
            <Text label="CEP" value={draft.zip} onChange={(v) => set("zip", v)} />
          </Section>

          <Section title="Diferenciais">
            <div className="flex gap-3">
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="Terraço privativo 54 m²"
                className={fieldClass}
              />
              <button
                type="button"
                onClick={addFeature}
                className="border-noir-5 text-ash hover:border-gold hover:text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {draft.features.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {draft.features.map((feature) => (
                  <li key={feature}>
                    <button
                      type="button"
                      onClick={() =>
                        set("features", draft.features.filter((f) => f !== feature))
                      }
                      className="border-noir-5 text-ash hover:border-ember hover:text-ember group flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-300"
                    >
                      {feature}
                      <X className="h-3 w-3 opacity-50 group-hover:opacity-100" strokeWidth={2} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
