"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteData, type Project } from "@/lib/useSiteData";

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.article
      ref={ref}
      id={`project-${project.key}`}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: (index % 3) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative scroll-mt-24"
      data-cursor-hover
    >
      <Link href={`/projects/${project.key}`} className="block">
        {/* Liquid Glass Card Container */}
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:bg-white/20 group-hover:border-white/40">
          {/* Image container — LANDSCAPE 16/10 */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={project.cover}
              alt={`${project.name} — ${project.sub}`}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={project.lqip}
            />

            {/* Overlay on hover - Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Gallery badge - Glassmorphism style */}
            {project.gallery.length > 1 && (
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-[9px] tracking-[0.13em] uppercase font-bold px-2.5 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
                {project.gallery.length} images
              </div>
            )}
          </div>

          {/* Info - Inside the glass card */}
          <div className="p-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-xl md:text-2xl tracking-tight text-ink group-hover:text-accent transition-colors duration-300">
                {project.name}
              </h3>
              <span className="text-[10px] tracking-[0.15em] uppercase text-ink-50 font-semibold whitespace-nowrap">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="text-xs tracking-[0.12em] uppercase text-ink-50 font-medium mt-1">
              {project.cat}
            </p>
            <p className="text-sm text-ink-70 mt-2 line-clamp-2 leading-relaxed">
              {project.quote || project.desc.slice(0, 120) + "..."}
            </p>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
      </Link>
    </motion.article>
  );
}

export function ProjectGrid() {
  const { data } = useSiteData();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="works" className="py-20 px-[clamp(28px,6vw,72px)]">
      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-8"
          >
            <span className="text-accent">02</span>
            <span>Selected Works</span>
            <span className="flex-1 h-px bg-line" />
            <span className="hidden sm:inline">Branding & Packaging</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-3xl md:text-5xl tracking-tight text-ink leading-[1.1]"
            dangerouslySetInnerHTML={{ __html: data.works.title }}
          />

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-4 text-ink-70 max-w-xl leading-relaxed"
          >
            {data.works.sub}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {data.projects.map((project, i) => (
            <ProjectCard key={project.key} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}