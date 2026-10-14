"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";

export function CaseStudy({ project }: { project: Project }) {
  const [revealed, setRevealed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % project.gallery.length);
  }, [project.gallery.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + project.gallery.length) % project.gallery.length
    );
  }, [project.gallery.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!revealed) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setRevealed(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [revealed, nextImage, prevImage]);

  // Touch/swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Back link */}
      <div className="fixed top-0 left-0 right-0 z-50 px-[clamp(28px,6vw,72px)] py-5 flex items-center justify-between bg-paper/80 backdrop-blur-sm">
        <Link
          href="/#works"
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
          {/* Cover image — stays at top, landscape */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[16/10] overflow-hidden rounded-sm bg-paper-lo mb-12"
          >
            <Image
              src={project.cover}
              alt={`${project.name} cover`}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              placeholder="blur"
              blurDataURL={project.lqip}
            />
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

          {/* Tap to reveal gallery */}
          {!revealed ? (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setRevealed(true)}
              className="w-full py-16 border-2 border-dashed border-line rounded-lg flex flex-col items-center justify-center gap-4 hover:border-accent hover:bg-paper-lo/50 transition-all duration-500 group"
              data-cursor-hover
            >
              <span className="text-[11px] tracking-[0.24em] uppercase font-bold text-ink-50 group-hover:text-accent transition-colors">
                Tap to reveal {project.gallery.length} project image{project.gallery.length > 1 ? "s" : ""}
              </span>
              <motion.div
                animate={prefersReduced ? {} : { y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-ink-50 group-hover:text-accent transition-colors">
                  <path d="M4 8 L10 14 L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </motion.button>
          ) : (
            /* Gallery view — horizontal swipeable */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Close button */}
              <button
                onClick={() => setRevealed(false)}
                className="absolute -top-12 right-0 text-[11px] tracking-[0.18em] uppercase font-semibold text-ink-50 hover:text-accent transition-colors"
                data-cursor-hover
              >
                Close Gallery ✕
              </button>

              {/* Gallery container */}
              <div
                className="relative aspect-[16/10] bg-ink rounded-sm overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -80 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center p-4"
                  >
                    <img
                      src={project.gallery[currentIndex]}
                      alt={project.caps?.[currentIndex] || `${project.name} — ${currentIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded shadow-2xl"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                {project.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-paper/30 bg-ink/50 text-paper flex items-center justify-center text-2xl hover:bg-paper/10 transition-colors z-10"
                      aria-label="Previous image"
                      data-cursor-hover
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-paper/30 bg-ink/50 text-paper flex items-center justify-center text-2xl hover:bg-paper/10 transition-colors z-10"
                      aria-label="Next image"
                      data-cursor-hover
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Counter */}
                <div className="absolute top-4 right-4 text-paper text-[11px] tracking-[0.2em] font-semibold bg-ink/50 px-3 py-1.5 rounded-full">
                  {currentIndex + 1} / {project.gallery.length}
                </div>

                {/* Caption */}
                {project.caps?.[currentIndex] && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                    <span className="text-paper text-[10px] tracking-[0.18em] uppercase font-bold bg-ink/50 px-3 py-1.5 rounded-full">
                      {project.caps[currentIndex]}
                    </span>
                  </div>
                )}
              </div>

              {/* Dot indicators */}
              {project.gallery.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {project.gallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentIndex ? "bg-ink w-6" : "bg-ink/30"
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}