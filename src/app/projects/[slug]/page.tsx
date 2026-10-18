import type { Metadata } from "next";
import Link from "next/link";
import { getLiveSiteData } from "@/lib/siteDataServer";
import { ProjectClientPage } from "./ProjectClientPage";

// Pre-rendered from the live admin data and cached at the edge; admin saves
// revalidate it. Projects added later render on first visit, then cache.
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const site = await getLiveSiteData();
  return site.projects.map((p) => ({ slug: p.key }));
}

// Share previews: a project link sent on WhatsApp/Instagram/iMessage shows
// that project's cover, name and line instead of the generic site card.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = decodeURIComponent(slug);
  const site = await getLiveSiteData();
  const project = site.projects.find((p) => p.key === key);
  if (!project) return { title: site.ui.caseStudy.notFoundTitle };

  const studio = site.hero.studio || "G.VIISUALS";
  const title = `${project.name} · ${studio}`;
  const description = project.quote || project.sub || project.desc.slice(0, 160);
  const images = project.cover ? [{ url: project.cover, width: 1600, height: 1000, alt: project.name }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.key}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/projects/${project.key}`,
      siteName: studio,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const key = decodeURIComponent(slug);
  const site = await getLiveSiteData();
  const project = site.projects.find((p) => p.key === key);
  const t = site.ui.caseStudy;

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6 text-center">
        <h1
          className="font-serif text-3xl md:text-5xl tracking-tight text-ink mb-4"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {t.notFoundTitle}
        </h1>
        <p className="text-ink-70 max-w-md leading-relaxed mb-8">
          {t.notFoundText}
        </p>
        <Link
          href="/#works"
          className="px-6 py-3 bg-ink text-paper rounded-full text-[11px] tracking-[0.15em] uppercase font-semibold hover:bg-accent transition-colors"
        >
          {t.notFoundButton}
        </Link>
      </div>
    );
  }

  return <ProjectClientPage project={project} />;
}
