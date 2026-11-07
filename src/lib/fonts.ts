import { Bodoni_Moda, Inter, Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";

/** Sans geométrica e pesada: a voz da página de engenharia (/software). */
export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

/** Serifa fina em itálico: o contraponto editorial dos títulos da /software. */
export const instrument = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
  weight: ["400"],
  style: ["normal", "italic"],
});

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

export const fontVars = `${bodoni.variable} ${inter.variable} ${jetbrains.variable} ${manrope.variable} ${instrument.variable}`;
