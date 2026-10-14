"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProject } from "@/lib/useSiteData";
import { CaseStudy } from "@/components/CaseStudy";

export default function ProjectPage() {
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";
  const { project, loading } = useProject(slug);

  // No loading screen at all — render nothing until data is ready,
  // then fade the case study in smoothly. This avoids any flash/jank.
  if (loading) return null;

  if (!project) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center bg-paper px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
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
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <CaseStudy project={project} />
    </motion.div>
  );
}
