"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImageUp, Loader2, Star, Trash2 } from "lucide-react";
import type { Media } from "@/lib/types";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { cn, slugify } from "@/lib/utils";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm";
const MAX_MB = 50;

/**
 * Envia arquivos para o Storage e devolve URLs públicas.
 *
 * O nome do arquivo é reescrito (slug + carimbo de tempo): nome
 * original com acento, espaço ou parêntese quebra URL, e "IMG_0042.JPG"
 * repetido em dois imóveis sobrescreveria o primeiro.
 */
export function MediaUploader({
  folder,
  onUploaded,
  label = "Enviar fotos",
}: {
  folder: string;
  onUploaded: (items: Media[]) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Supabase não conectado — não dá para enviar arquivo.");
      return;
    }

    setBusy(true);
    setError(null);

    const uploaded: Media[] = [];
    const list = Array.from(files);

    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      setProgress(`${i + 1} de ${list.length}`);

      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`"${file.name}" passa de ${MAX_MB} MB. Comprima antes de enviar.`);
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 60) || "arquivo";
      const path = `${folder}/${Date.now()}-${base}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) {
        setError(`Falha em "${file.name}": ${uploadError.message}`);
        continue;
      }

      const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      uploaded.push({ url: data.publicUrl, alt: "" });
    }

    if (uploaded.length > 0) onUploaded(uploaded);
    setBusy(false);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="border-noir-5 text-ash hover:border-gold hover:text-gold inline-flex h-11 items-center gap-2.5 rounded-full border border-dashed px-5 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-400 disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
        ) : (
          <ImageUp className="h-3.5 w-3.5" strokeWidth={1.5} />
        )}
        {busy ? `Enviando ${progress}…` : label}
      </button>
      {error && (
        <p className="text-ember mt-3 text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Lista editável de mídias: ordem, texto alternativo, legenda, capa. */
export function MediaList({
  items,
  onChange,
  coverUrl,
  onSetCover,
}: {
  items: Media[];
  onChange: (next: Media[]) => void;
  coverUrl?: string;
  onSetCover?: (item: Media) => void;
}) {
  function patch(index: number, changes: Partial<Media>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...changes } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  if (items.length === 0) {
    return (
      <p className="text-smoke border-noir-4 rounded-sm border border-dashed px-5 py-8 text-center text-sm">
        Nenhuma foto ainda.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const isCover = coverUrl === item.url;
        const isVideo = /\.(mp4|webm)$/i.test(item.url);

        return (
          <li
            key={item.url}
            className={cn(
              "border-noir-4 bg-noir-2/40 flex gap-4 rounded-sm border p-3",
              isCover && "border-gold/50",
            )}
          >
            <div className="bg-noir-3 relative h-20 w-28 shrink-0 overflow-hidden rounded-sm">
              {isVideo ? (
                <video src={item.url} className="h-full w-full object-cover" muted playsInline />
              ) : (
                <Image src={item.url} alt="" fill sizes="112px" className="object-cover" />
              )}
              <span className="bg-noir/80 text-mist absolute bottom-1 left-1 rounded px-1.5 py-0.5 font-mono text-[9px] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <input
                value={item.alt}
                onChange={(e) => patch(i, { alt: e.target.value })}
                placeholder="Descrição da foto (acessibilidade e SEO)"
                className="border-noir-5 text-bone placeholder:text-smoke focus:border-gold w-full border-b bg-transparent pb-1.5 text-sm outline-none transition-colors duration-300"
              />
              <input
                value={item.caption ?? ""}
                onChange={(e) => patch(i, { caption: e.target.value })}
                placeholder="Legenda que aparece no tour e na galeria (opcional)"
                className="border-noir-5 text-ash placeholder:text-smoke focus:border-gold w-full border-b bg-transparent pb-1.5 text-sm italic outline-none transition-colors duration-300"
              />
            </div>

            <div className="flex shrink-0 flex-col gap-1">
              {onSetCover && !isVideo && (
                <button
                  type="button"
                  onClick={() => onSetCover(item)}
                  title="Usar como capa"
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded transition-colors duration-300",
                    isCover ? "text-gold" : "text-smoke hover:text-gold",
                  )}
                >
                  <Star className={cn("h-3.5 w-3.5", isCover && "fill-current")} strokeWidth={1.5} />
                </button>
              )}
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Subir"
                className="text-smoke hover:text-bone flex h-7 w-7 items-center justify-center rounded transition-colors duration-300 disabled:opacity-25"
              >
                <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                title="Descer"
                className="text-smoke hover:text-bone flex h-7 w-7 items-center justify-center rounded transition-colors duration-300 disabled:opacity-25"
              >
                <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                title="Remover da lista"
                className="text-smoke hover:text-ember flex h-7 w-7 items-center justify-center rounded transition-colors duration-300"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
