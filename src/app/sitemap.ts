import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/imoveis`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/anuncie`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/sobre`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/contato`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${site.url}/imoveis/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "weekly",
    priority: p.featured ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
