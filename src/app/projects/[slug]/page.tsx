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
