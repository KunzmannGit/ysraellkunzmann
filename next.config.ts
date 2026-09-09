import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...(supabaseHost
        ? ([{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] as const)
        : []),
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  async redirects() {
    // Um endereco canonico, sempre.
    //
    // Sem isto, ysraellkunzmann.com e www.ysraellkunzmann.com servem o
    // mesmo site com status 200 nos dois — e o Google trata como duas
    // paginas concorrentes, dividindo a autoridade do dominio entre elas.
    // A tag canonical ajuda, mas redirecionar de verdade e o que resolve.
    //
    // Fica aqui, e nao no painel da Vercel, para viver junto do codigo:
    // versionado, revisavel e portavel se um dia a hospedagem mudar.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ysraellkunzmann.com" }],
        destination: "https://ysraellkunzmann.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
      {
        // panoramas e videos sao imutaveis: cache agressivo
        source: "/:all*(mp4|webm|jpg|jpeg|png|avif|webp)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
