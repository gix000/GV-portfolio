"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteData, type Project } from "@/lib/useSiteData";

// Track whether the grid has already animated in this browser session so
// return-navigation skips the entrance and avoids the brief card flash.
let hasVisitedWorks = false;

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// How many cards are visible in the stack at once
const STACK_SIZE = 4;

function StackCard({
  project,
  stackIndex,
  skipEntrance,
  onTop,
  onTapTop,
}: {
  project: Project;
  stackIndex: number; // 0 = top of stack
  skipEntrance: boolean;
  onTop: boolean;
  onTapTop: () => void;
}) {
  // Deeper cards sit lower, smaller, and more transparent
  const depth = stackIndex;
  const scale = 1 - depth * 0.05;
  const yOffset = depth * 14;
  const opacity = 1 - depth * 0.18;
  const rotate = (depth % 2 === 0 ? -1 : 1) * depth * 1.4;

  return (
    <motion.article
      layout
      data-cursor-hover
      onClick={onTop ? onTapTop : undefined}
      className={`absolute left-1/2 top-0 w-[88vw] sm:w-[560px] md:w-[640px] ${
        onTop ? "cursor-pointer z-30" : "z-20 pointer-events-none"
      }`}
      style={{ x: "-50%" }}
      initial={skipEntrance ? false : { opacity: 0, y: 80, scale: 0.9 }}
      animate={{
        opacity,
        y: yOffset,
        scale,
        rotate,
      }}
      exit={{
        opacity: 0,
        y: -260,
        x: 140,
        rotate: 14,
        scale: 0.92,
        transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
        mass: 0.9,
        delay: skipEntrance ? 0 : depth * 0.06,
      }}
    >
      <Link
        href={`/projects/${project.key}`}
        className="block"
        onClick={(e) => {
          // Only the top card navigates; tapping it also triggers the shuffle fly-away
          if (!onTop) {
            e.preventDefault();
          }
        }}
      >
        {/* Liquid Glass Card Container */}
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500 group-hover:shadow-2xl">
          {/* Image container - LANDSCAPE 16/10 */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={project.cover}
              alt={`${project.name} - ${project.sub}`}
              fill
              priority={onTop}
              className="object-cover"
              sizes="(max-width: 640px) 88vw, 640px"
              placeholder="blur"
              blurDataURL={project.lqip}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {project.gallery.length > 1 && (
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-[9px] tracking-[0.13em] uppercase font-bold px-2.5 py-1.5 rounded-full border border-white/10">
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

          {/* Info */}
          <div className="p-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-xl md:text-2xl tracking-tight text-ink">
                {project.name}
              </h3>
              <span className="text-[10px] tracking-[0.15em] uppercase text-ink-50 font-semibold whitespace-nowrap">
                {String(stackIndex + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="text-xs tracking-[0.12em] uppercase text-ink-50 font-medium mt-1">
              {project.cat}
            </p>
            <p className="text-sm text-ink-70 mt-2 line-clamp-2 leading-relaxed">
              {project.quote || project.desc.slice(0, 120) + "..."}
            </p>
          </div>

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
  const skipEntrance = hasVisitedWorks;

  // The full shuffled deck; the top of the stack is index 0
  const [deck, setDeck] = useState<Project[]>(data.projects);
  // Key bumped on each shuffle so AnimatePresence re-runs exit on the leaving card
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (!hasVisitedWorks) {
      hasVisitedWorks = true;
    }
  }, []);

  // Sync when data loads async
  useEffect(() => {
    if (data.projects.length > 0 && deck.length === 0) {
      setDeck(data.projects);
    }
  }, [data.projects, deck.length]);

  // Move the top card to the back of the deck (the "shuffle" fly-away)
  const cycleTopToBack = useCallback(() => {
    setDeck((prev) => {
      if (prev.length <= 1) return prev;
      const [top, ...rest] = prev;
      return [...rest, top];
    });
    setCycleKey((k) => k + 1);
  }, []);

  // Full reshuffle of the whole deck
  const reshuffleDeck = useCallback(() => {
    setDeck((prev) => shuffleArray(prev));
    setCycleKey((k) => k + 1);
  }, []);

  const showHeader = skipEntrance || headerInView;
  const visible = deck.slice(0, Math.min(STACK_SIZE, deck.length));

  return (
    <section id="works" className="py-20 px-[clamp(28px,6vw,72px)]">
      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-12">
          <motion.div
            initial={skipEntrance ? false : { opacity: 0, y: 30 }}
            animate={showHeader ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: skipEntrance ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-8"
          >
            <span className="text-accent">02</span>
            <span>Selected Works</span>
            <span className="flex-1 h-px bg-line" />
            <span className="hidden sm:inline">Branding &amp; Packaging</span>
          </motion.div>

          <motion.h2
            initial={skipEntrance ? false : { opacity: 0, y: 40 }}
            animate={showHeader ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: skipEntrance ? 0 : 0.9,
              delay: skipEntrance ? 0 : 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-3xl md:text-5xl tracking-tight text-ink leading-[1.1]"
            dangerouslySetInnerHTML={{ __html: data.works.title }}
          />

          <motion.p
            initial={skipEntrance ? false : { opacity: 0, y: 30 }}
            animate={showHeader ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: skipEntrance ? 0 : 0.9,
              delay: skipEntrance ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-4 text-ink-70 max-w-xl leading-relaxed"
          >
            {data.works.sub}
          </motion.p>
        </div>

        {/* Stacked deck: cards layered behind each other */}
        <div className="relative w-full flex justify-center" style={{ minHeight: 460 }}>
          <div className="relative w-[88vw] sm:w-[560px] md:w-[640px]" style={{ height: 420 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project, i) => (
                <StackCard
                  key={`${project.key}-${cycleKey}-${i}`}
                  project={project}
                  stackIndex={i}
                  total={visible.length}
                  skipEntrance={skipEntrance}
                  onTop={i === 0}
                  onTapTop={cycleTopToBack}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Animated "shuffle for more" link under the stack */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={reshuffleDeck}
            data-cursor-hover
            className="group relative inline-flex items-center gap-2.5 text-[11px] tracking-[0.22em] uppercase font-bold text-ink-70 hover:text-accent transition-colors duration-300"
          >
            <motion.span
              animate={{ rotate: [0, -8, 8, -6, 6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
              className="inline-block"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
            </motion.span>
            <span className="relative">
              Shuffle for more
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-accent transition-all duration-400 group-hover:w-full" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}