import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/data";
import { CaseStudy } from "@/components/CaseStudy";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.name} — G.VIISUALS`,
    description: project.desc.slice(0, 160),
    openGraph: {
      title: `${project.name} — G.VIISUALS`,
      description: project.desc.slice(0, 160),
      images: [{ url: project.cover, width: 1200, height: 630 }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <CaseStudy project={project} />;
}