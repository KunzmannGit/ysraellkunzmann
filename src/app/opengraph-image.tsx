import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/* ═══════════════════════════════════════════════════════════
   A PREVIA DO LINK

   Isto e o que aparece quando voce cola um link do site no
   WhatsApp, no Instagram ou no e-mail. Para um corretor, esse
   retangulo e trabalho: e ele que o cliente ve antes de decidir
   se toca no link.

   Sem este arquivo, o WhatsApp mostraria uma caixa cinza com a
   URL crua. Com ele, mostra a marca.

   As paginas de imovel tem a propria previa — a foto de capa do
   imovel, definida em generateMetadata. Esta aqui cobre a home
   e as paginas institucionais.
   ═══════════════════════════════════════════════════════════ */

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  // A Bodoni vem de arquivos do repositorio, e nao do Google Fonts.
  // Buscar fonte pela rede durante o build significa que uma
  // instabilidade deles quebraria o deploy — preco alto demais por
  // 120 KB que cabem no git.
  //
  // Sao instancias ESTATICAS, geradas com fontTools a partir das
  // variaveis. O Satori nao renderiza fonte variavel: engasga com
  // "Cannot read properties of undefined" no meio do build.
  const [roman, italic] = await Promise.all([
    readFile(join(process.cwd(), "src/app/_fonts/bodoni.ttf")),
    readFile(join(process.cwd(), "src/app/_fonts/bodoni-italic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08070A",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Halo dourado, o mesmo gesto do site */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: 300,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(201,162,39,0.30) 0%, rgba(8,7,10,0) 68%)",
            display: "flex",
          }}
        />

        {/* Topo: monograma + funcao */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 62,
              height: 62,
              borderRadius: 16,
              border: "2px solid rgba(201,162,39,0.45)",
              color: "#C9A227",
              fontFamily: "Bodoni",
              fontSize: 30,
              letterSpacing: 1,
            }}
          >
            YK
          </div>
          <div
            style={{
              display: "flex",
              color: "#8b8496",
              fontSize: 19,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            {site.role} · {site.creci}
          </div>
        </div>

        {/* Meio: a frase */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              color: "#ede9f2",
              fontFamily: "Bodoni",
              fontSize: 82,
              lineHeight: 1.04,
              letterSpacing: -1,
              maxWidth: 940,
            }}
          >
            Imóveis que você atravessa
          </div>
          <div
            style={{
              display: "flex",
              color: "#e7c65b",
              fontFamily: "Bodoni",
              fontSize: 82,
              lineHeight: 1.04,
              letterSpacing: -1,
              fontStyle: "italic",
            }}
          >
            antes de visitar.
          </div>
        </div>

        {/* Base: regua de ouro + identificacao */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              height: 2,
              width: "100%",
              background:
                "linear-gradient(to right, rgba(201,162,39,0.85), rgba(201,162,39,0.10) 62%, rgba(8,7,10,0))",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontFamily: "Bodoni", color: "#ede9f2", fontSize: 38 }}>{site.name}</div>
            <div style={{ display: "flex", color: "#8b8496", fontSize: 21, letterSpacing: 3 }}>
              {site.region} · {site.state}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bodoni", data: roman, style: "normal", weight: 400 },
        { name: "Bodoni", data: italic, style: "italic", weight: 400 },
      ],
    },
  );
}
