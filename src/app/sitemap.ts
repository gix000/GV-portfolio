import type { MetadataRoute } from "next";
import { getLiveSiteData } from "@/lib/siteDataServer";
import { SITE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getLiveSiteData();
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/ui-ux`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...site.projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.key}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [p.cover, ...p.gallery.slice(0, 5)].filter(Boolean).map((src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`)),
    })),
    ...site.uiuxVideos
      .filter((v) => v.redesignUrl)
      .map((v) => ({
        url: `${SITE_URL}${v.redesignUrl}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
  ];
}
