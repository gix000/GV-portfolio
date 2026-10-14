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
        /* Opening animation instead of a plain loading screen */
        <motion.div
          key="opening"
          className="fixed inset-0 z-50 flex items-center justify-center bg-paper"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Expanding circle reveal */}
          <motion.div
            className="absolute rounded-full bg-ink"
            initial={{ width: 0, height: 0 }}
            animate={{ width: "200vmax", height: "200vmax" }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          />
          {/* Label that fades out as the circle expands */}
          <motion.span
            className="relative z-10 text-[11px] tracking-[0.25em] uppercase font-semibold text-paper"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CaseStudy project={project} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}