"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        /* Subtle opening: gentle fade, no dramatic expanding circle */
        <motion.div
          key="opening"
          className="fixed inset-0 z-50 flex items-center justify-center bg-paper"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <motion.span
            className="text-[11px] tracking-[0.25em] uppercase font-semibold text-ink-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Opening&hellip;
          </motion.span>
        </motion.div>
      ) : !project ? (
        <motion.div
          key="not-found"
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
      ) : (
        <motion.div
          key="case-study"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <CaseStudy project={project} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
