import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Icone para quando alguem salva o site na tela inicial do iPhone.
 * O iOS ignora SVG aqui e exige PNG — por isso este arquivo existe
 * separado do icon.svg, em vez de reaproveita-lo.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  // Instancia estatica: o Satori nao renderiza fonte variavel.
  const bodoni = await readFile(join(process.cwd(), "src/app/_fonts/bodoni.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08070A",
          color: "#C9A227",
          fontFamily: "Bodoni",
          fontSize: 84,
          letterSpacing: 3,
        }}
      >
        YK
      </div>
    ),
    { ...size, fonts: [{ name: "Bodoni", data: bodoni, style: "normal", weight: 400 }] },
  );
}
