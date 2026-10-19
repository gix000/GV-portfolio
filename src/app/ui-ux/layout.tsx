import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLiveSiteData } from "@/lib/siteDataServer";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getLiveSiteData();
  const t = site.ui.uiux;
  const studio = site.hero.studio || "G.VIISUALS";
  const poster = site.uiuxVideos.find((v) => v.poster)?.poster;
  return {
    title: `${t.title} · UI/UX by ${studio}`,
    description: t.intro,
    alternates: { canonical: "/ui-ux" },
    openGraph: {
      title: `${t.title} · ${studio}`,
      description: t.intro,
      url: "/ui-ux",
      images: poster ? [{ url: poster }] : undefined,
    },
  };
}

export default function UiUxLayout({ children }: { children: ReactNode }) {
  return children;
}
