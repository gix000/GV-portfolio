"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";

export function CaseStudy({ project }: { project: Project }) {
  const [revealed, setRevealed] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-paper">
      {/* Back link — returns to the exact project card on the homepage */}
      <div className="fixed top-0 left-0 right-0 z-50 px-[clamp(28px,6vw,72px)] py-5 flex items-center justify-between bg-paper/80 backdrop-blur-sm">
        <Link
          href={`/#project-${project.key}`}
          className="text-[11px] tracking-[0.18em] uppercase font-semibold hover:text-accent transition-colors duration-300 text-ink"
          data-cursor-hover
        >
          ← Back to Works
        </Link>
        <span className="text-[10px] tracking-[0.15em] uppercase text-ink-50 font-semibold">
          {project.cat}
        </span>
      </div>

      {/* Main content */}
      <div className="pt-24 pb-16 px-[clamp(28px,6vw,72px)]">
        <div className="max-w-[1280px] mx-auto">
          {/* Cover image with tap-to-reveal overlay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[16/10] overflow-hidden rounded-sm bg-paper-lo mb-12 group cursor-pointer"
            onClick={() => !revealed && setRevealed(true)}
          >
            <Image
              src={project.cover}
              alt={`${project.name} cover`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              placeholder="blur"
              blurDataURL={project.lqip}
            />
            {/* Sleek view-gallery cue — minimal bottom-right pill, no full scrim */}
            {!revealed && (
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-5 right-5 flex items-center gap-2 px-4 py-2 rounded-full bg-ink/55 backdrop-blur-md border border-white/10"
                >
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/90">
                    View gallery
                  </span>
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 20 20"
                    fill="none"
                    animate={prefersReduced ? {} : { y: [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d="M4 8 L10 14 L16 8" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </motion.div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-ink/25 to-transparent" />
              </div>
            )}
          </motion.div>

          {/* Project info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-ink leading-[1.05] mb-4">
              {project.name}
            </h1>
            <p className="text-lg md:text-xl text-ink-70 font-serif italic mb-6">
              {project.sub}
            </p>
            <p className="text-ink-70 leading-relaxed max-w-2xl mb-6">
              {project.desc}
            </p>
            {project.quote && (
              <blockquote className="font-serif text-xl italic text-ink border-l-2 border-accent pl-4 mb-6">
                &ldquo;{project.quote}&rdquo;
              </blockquote>
            )}

            {/* Color palette */}
            {project.think?.pal && project.think.pal.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-3">
                  Color Palette
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {project.think.pal.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-12 h-12 rounded border border-line shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[9px] font-mono text-ink-50">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] tracking-[0.15em] uppercase font-semibold text-ink-70 border border-line rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Gallery — clean vertical stack directly under cover, no black background */}
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col gap-5"
            >
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setRevealed(false)}
                  className="text-[11px] tracking-[0.18em] uppercase font-semibold text-ink-50 hover:text-accent transition-colors"
                  data-cursor-hover
                >
                  Close Gallery ✕
                </button>
              </div>

              {/* Vertical image stack */}
              {project.gallery.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full overflow-hidden rounded-sm bg-paper-lo"
                >
                  <Image
                    src={img}
                    alt={project.caps?.[i] || `${project.name} — ${i + 1}`}
                    width={1280}
                    height={800}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                  {project.caps?.[i] && (
                    <div className="absolute bottom-0 left-0 right-0 py-3 px-5 bg-gradient-to-t from-ink/40 to-transparent">
                      <span className="text-white text-[10px] tracking-[0.18em] uppercase font-bold">
                        {project.caps[i]}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}