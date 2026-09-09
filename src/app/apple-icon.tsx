import { ImageResponse } from "next/og";

/**
 * Icone para quando alguem salva o site na tela inicial do iPhone.
 * O iOS ignora SVG aqui e exige PNG — por isso este arquivo existe
 * separado do icon.svg, em vez de reaproveita-lo.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        YK
      </div>
    ),
    size,
  );
}
