import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * eslint-config-next v16 ja exporta flat config nativo.
 * A ponte FlatCompat (@eslint/eslintrc) quebra com ele — o plugin
 * do React tem referencia circular e o validador antigo tenta
 * serializar tudo com JSON.stringify.
 */
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
];

export default config;
