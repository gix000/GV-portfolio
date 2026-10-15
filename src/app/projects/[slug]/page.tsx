import Link from "next/link";
import { siteData } from "@/lib/data";
import { ProjectClientPage } from "./ProjectClientPage";

// Static generation: resolve the project at build time so there is zero
// fetch wait on navigation - the case study renders immediately.
export function generateStaticParams() {
  return siteData.projects.map((p) => ({ slug: p.key }));
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 15 App Router: params is async; unwrap synchronously here since
  // generateStaticParams guarantees the slug exists at build time.
  const { slug } = (params as unknown as { slug: string }) ?? { slug: "" };
  const project = siteData.projects.find((p) => p.key === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6 text-center">
        <h1
          className="font-serif text-3xl md:text-5xl tracking-tight text-ink mb-4"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Project not found
        </h1>
        <p className="text-ink-70 max-w-md leading-relaxed mb-8">
          The project you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/#works"
          className="px-6 py-3 bg-ink text-paper rounded-full text-[11px] tracking-[0.15em] uppercase font-semibold hover:bg-accent transition-colors"
        >
          Back to Works
        </Link>
      </div>
    );
  }

  return <ProjectClientPage project={project} />;
}