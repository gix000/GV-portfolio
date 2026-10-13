"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CaseStudy({ project }: { project: Project }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % project.gallery.length);
  }, [project.gallery.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex(
      (prev) => (prev - 1 + project.gallery.length) % project.gallery.length
    );
  }, [project.gallery.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  return (
    <>
      {/* Back link */}
      <div className="fixed top-0 left-0 right-0 z-50 px-[clamp(28px,6vw,72px)] py-5 flex items-center justify-between">
        <Link
          href="/#works"
          className="text-[11px] tracking-[0.18em] uppercase font-semibold hover:text-accent transition-colors duration-300"
          data-cursor-hover
        >
          ← Back to Works
        </Link>
        <span className="text-[10px] tracking-[0.15em] uppercase text-ink-50 font-semibold">
          {project.cat}
        </span>
      </div>

      <article className="pt-32 pb-24">
        {/* Hero image */}
        <Reveal className="px-[clamp(28px,6vw,72px)] max-w-[1280px] mx-auto mb-20">
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-sm cursor-pointer group"
            onClick={() => openLightbox(0)}
            data-cursor-hover
          >
            <Image
              src={project.cover}
              alt={`${project.name} cover`}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              placeholder="blur"
              blurDataURL={project.lqip}
            />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
          </div>
        </Reveal>

        {/* Title block */}
        <div className="px-[clamp(28px,6vw,72px)] max-w-[1280px] mx-auto mb-24">
          <Reveal>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-ink leading-[0.95]">
              {project.name}
            </h1>
          </Reveal>
          <Reveal delay={0.1} className="mt-6">
            <p className="text-lg md:text-xl text-ink-70 font-serif italic">
              {project.sub}
            </p>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-wrap gap-2 mt-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-[0.15em] uppercase font-semibold text-ink-50 border border-line rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </Reveal>
        </div>

        {/* Description */}
        <div className="px-[clamp(28px,6vw,72px)] max-w-[800px] mx-auto mb-24">
          <Reveal>
            <p className="text-lg md:text-xl leading-relaxed text-ink-soft">
              {project.desc}
            </p>
          </Reveal>
          {project.quote && (
            <Reveal delay={0.1} className="mt-10 pl-6 border-l-2 border-accent">
              <blockquote className="font-serif text-2xl md:text-3xl italic text-ink leading-snug">
                &ldquo;{project.quote}&rdquo;
              </blockquote>
            </Reveal>
          )}
        </div>

        {/* Thinking section */}
        {project.think && (
          <section className="px-[clamp(28px,6vw,72px)] max-w-[1280px] mx-auto mb-24">
            <Reveal className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-12">
              <span className="text-accent">Process</span>
              <span className="flex-1 h-px bg-line" />
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
              {project.think.challenge && (
                <Reveal delay={0.05}>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-accent font-bold mb-3">
                    The Challenge
                  </div>
                  <p className="text-sm leading-relaxed text-ink-70">
                    {project.think.challenge}
                  </p>
                </Reveal>
              )}
              {project.think.idea && (
                <Reveal delay={0.1}>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-accent font-bold mb-3">
                    The Idea
                  </div>
                  <p className="text-sm leading-relaxed text-ink-70">
                    {project.think.idea}
                  </p>
                </Reveal>
              )}
              {project.think.mark && (
                <Reveal delay={0.15}>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-accent font-bold mb-3">
                    The Mark
                  </div>
                  <p className="text-sm leading-relaxed text-ink-70">
                    {project.think.mark}
                  </p>
                </Reveal>
              )}
              {project.think.craft && (
                <Reveal delay={0.2}>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-accent font-bold mb-3">
                    The Craft
                  </div>
                  <p className="text-sm leading-relaxed text-ink-70">
                    {project.think.craft}
                  </p>
                </Reveal>
              )}
              {project.think.type && (
                <Reveal delay={0.25}>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-accent font-bold mb-3">
                    Typography
                  </div>
                  <p className="text-sm leading-relaxed text-ink-70">
                    {project.think.type}
                  </p>
                </Reveal>
              )}
            </div>

            {/* Palette */}
            {project.think.pal && project.think.pal.length > 0 && (
              <Reveal delay={0.3} className="mt-14">
                <div className="text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-4">
                  Colour Palette
                </div>
                <div className="flex gap-3 flex-wrap">
                  {project.think.pal.map((color) => (
                    <div key={color} className="group relative">
                      <div
                        className="w-14 h-14 md:w-20 md:h-20 rounded-full shadow-sm border border-line"
                        style={{ backgroundColor: color }}
                      />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.1em] uppercase font-mono text-ink-50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </section>
        )}

        {/* Gallery grid */}
        <section className="px-[clamp(28px,6vw,72px)] max-w-[1280px] mx-auto">
          <Reveal className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-12">
            <span className="text-accent">Gallery</span>
            <span className="flex-1 h-px bg-line" />
            <span>{project.gallery.length} images</span>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            {project.gallery.map((src, i) => (
              <Reveal key={i} delay={(i % 4) * 0.06}>
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer group"
                  onClick={() => openLightbox(i)}
                  data-cursor-hover
                >
                  <Image
                    src={src}
                    alt={project.caps?.[i] || `${project.name} — ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                    placeholder="blur"
                    blurDataURL={project.lqip}
                  />
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-400" />
                  {project.caps?.[i] && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <span className="text-paper text-[10px] tracking-[0.15em] uppercase font-semibold">
                        {project.caps[i]}
                      </span>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </article>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-ink flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-8 text-paper/80 hover:text-paper text-[12px] tracking-[0.2em] uppercase font-semibold z-10"
              onClick={closeLightbox}
            >
              Close ×
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-paper/30 bg-ink/30 text-paper flex items-center justify-center text-2xl hover:bg-paper/10 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous image"
            >
              ‹
            </button>

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              src={project.gallery[lightboxIndex]}
              alt={
                project.caps?.[lightboxIndex] ||
                `${project.name} — ${lightboxIndex + 1}`
              }
              className="max-w-[94vw] max-h-[88vh] object-contain rounded shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-paper/30 bg-ink/30 text-paper flex items-center justify-center text-2xl hover:bg-paper/10 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
            >
              ›
            </button>

            {/* Caption & count */}
            {project.caps?.[lightboxIndex] && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center max-w-[80vw]">
                <span className="text-paper text-[10px] tracking-[0.18em] uppercase font-bold">
                  {project.caps[lightboxIndex]}
                </span>
              </div>
            )}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-paper/70 text-[11px] tracking-[0.22em] font-semibold">
              {lightboxIndex + 1} / {project.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}