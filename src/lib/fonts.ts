import { Bodoni_Moda, Inter, JetBrains_Mono } from "next/font/google";

/** Didone de alto contraste: o luxo do site mora aqui. */
export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/** Sans neutra para tudo que precisa ser lido, não admirado. */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Mono para números, CRECI, rótulos — o carimbo de engenheiro. */
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jb",
  weight: ["400", "500"],
});

export const fontVars = `${bodoni.variable} ${inter.variable} ${jetbrains.variable}`;
