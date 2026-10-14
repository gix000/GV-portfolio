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
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="relative min-h-screen bg-paper">
      {/* Back link — always visible */}
      <div className="fixed top-0 left-0 right-0 z-50 px-[clamp(28px,6vw,72px)] py-5 flex items-center justify-between">
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

      {/* === COVER SCREEN (full viewport) === */}
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex items-center justify-center cursor-pointer"
            onClick={() => setRevealed(true)}
            data-cursor-hover
          >
            {/* Full-screen cover image */}
            <Image
              src={project.cover}
              alt={`${project.name} cover`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL={project.lqip}
            />

            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/30" />

            {/* Content overlay */}
            <div className="relative z-10 text-center px-8 max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-paper leading-[0.95] mb-6"
              >
                {project.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg md:text-xl text-paper/80 font-serif italic mb-8"
              >
                {project.sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-3"
              >
                <span className="text-[11px] tracking-[0.24em] uppercase font-bold text-paper/90">
                  Tap to explore
                </span>
                <motion.div
                  animate={prefersReduced ? {} : { y: [0, 8, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-paper/70">
                    <path d="M6 9 L12 15 L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-2 justify-center mt-10"
              >
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] tracking-[0.15em] uppercase font-semibold text-paper/70 border border-paper/30 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* === GALLERY VIEW (horizontal swipeable) === */
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-ink flex flex-col"
          >
            {/* Top bar with close and counter */}
            <div className="flex items-center justify-between px-[clamp(28px,6vw,72px)] py-5 text-paper">
              <button
                onClick={() => setRevealed(false)}
                className="text-[11px] tracking-[0.18em] uppercase font-semibold hover:text-accent transition-colors"
                data-cursor-hover
              >
                ← Back to Cover
              </button>
              <span className="text-[11px] tracking-[0.2em] font-semibold">
                {currentIndex + 1} / {project.gallery.length}
              </span>
            </div>

            {/* Main gallery area */}
            <div
              ref={containerRef}
              className="flex-1 relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-8"
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
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-paper/30 bg-ink/50 text-paper flex items-center justify-center text-2xl hover:bg-paper/10 transition-colors z-10"
                    aria-label="Previous image"
                    data-cursor-hover
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-paper/30 bg-ink/50 text-paper flex items-center justify-center text-2xl hover:bg-paper/10 transition-colors z-10"
                    aria-label="Next image"
                    data-cursor-hover
                  >
                    ›
                  </button>
                </>
              )}

              {/* Caption */}
              {project.caps?.[currentIndex] && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center max-w-[80vw]">
                  <span className="text-paper text-[10px] tracking-[0.18em] uppercase font-bold">
                    {project.caps[currentIndex]}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom info bar */}
            <div className="px-[clamp(28px,6vw,72px)] py-6 border-t border-paper/10">
              <div className="max-w-3xl mx-auto">
                <p className="text-paper/70 text-sm leading-relaxed mb-4">
                  {project.desc}
                </p>
                {project.quote && (
                  <blockquote className="font-serif text-lg italic text-paper/90 border-l-2 border-accent pl-4">
                    &ldquo;{project.quote}&rdquo;
                  </blockquote>
                )}
              </div>
            </div>

            {/* Dot indicators */}
            {project.gallery.length > 1 && (
              <div className="flex justify-center gap-2 pb-6">
                {project.gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex ? "bg-paper w-6" : "bg-paper/30"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}