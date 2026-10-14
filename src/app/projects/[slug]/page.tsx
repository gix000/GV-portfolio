"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useProject } from "@/lib/useSiteData";
import { CaseStudy } from "@/components/CaseStudy";

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;
  const { project, loading } = useProject(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-ink-50 text-sm tracking-[0.15em] uppercase">
        Loading…
      </div>
    );
  }

  if (!project) {
    // Can't call notFound() in a client component — render a safe fallback
    // that matches the site's aesthetic and links back to the grid.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6 text-center">
        <h1
          className="font-serif text-3xl md:text-5xl tracking-tight text-ink mb-4"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Project not found
        </h1>
        <p className="text-ink-70 max-w-md leading-relaxed mb-8">
          The project you're looking for doesn't exist or has been removed.
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

  return <CaseStudy project={project} />;
}