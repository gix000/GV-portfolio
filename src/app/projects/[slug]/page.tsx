import Link from "next/link";
import { siteData, type Project } from "@/lib/data";
import { getSupabase, SITE_DATA_ROW_ID } from "@/lib/supabase";
import { ProjectClientPage } from "./ProjectClientPage";

// Read live from Supabase on every request so projects added, renamed or
// deleted in /admin show up here immediately (the old build-time version only
// ever knew the compiled defaults, so new projects 404'd and edits never
// reached the case study pages).
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_data")
      .select("data")
      .eq("id", SITE_DATA_ROW_ID)
      .maybeSingle();
    const live = (data?.data as { projects?: unknown } | undefined)?.projects;
    if (!error && Array.isArray(live)) return live as Project[];
  } catch {
    // Supabase unavailable - fall through to compiled defaults.
  }
  return siteData.projects;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const key = decodeURIComponent(slug);
  const projects = await getProjects();
  const project = projects.find((p) => p.key === key);

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
