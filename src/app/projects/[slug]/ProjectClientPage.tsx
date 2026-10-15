"use client";

import { motion } from "framer-motion";
import { CaseStudy } from "@/components/CaseStudy";
import type { Project } from "@/lib/data";

// Receives the fully-resolved project from the Server Component parent,
// so there is zero fetch wait and no blank/loading state on navigation.
export function ProjectClientPage({ project }: { project: Project }) {
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