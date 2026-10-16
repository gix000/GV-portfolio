"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteData, type Project } from "@/lib/useSiteData";

// Track whether the grid has already animated in this browser session so
// return-navigation skips the entrance and avoids the brief card flash.
let hasVisitedWorks = false;

// How many cards are visible in the stack at once
const STACK_SIZE = 4;

function StackCard({
  project,
  stackIndex,
  skipEntrance,
}: {
  project: Project;
  stackIndex: number; // 0 = top of stack
  skipEntrance: boolean;
}) {
  // 3D perspective depth: deeper cards tilt back, scale down, darken
  const depth = stackIndex;
  const scale = 1 - depth * 0.06;
  const yOffset = depth * 18;
  const opacity = 1 - depth * 0.2;
  const rotateX = depth * 4; // tilt back in 3D
  const zOffset = -depth * 60; // push back in Z space

  return (
    <motion.article
      layout
      data-cursor-hover
      className={`absolute left-1/2 top-0 w-[88vw] sm:w-[560px] md:w-[640px] ${
        stackIndex === 0 ? "z-30" : "z-20 pointer-events-none"
      }`}
      style={{
        x: "-50%",
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      initial={skipEntrance ? false : { opacity: 0, y: 100, scale: 0.85, rotateX: 15 }}
      animate={{
        opacity,
        y: yOffset,
        scale,
        rotateX,
        z: zOffset,
      }}
      exit={{
        opacity: 0,
        y: -280,
        scale: 0.85,
        rotateX: -12,
        z: 80,
        transition: { duration: 0.6, ease: [0.32, 0, 0.67, 0] },
      }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 24,
        mass: 0.9,
        delay: skipEntrance ? 0 : depth * 0.07,
      }}
    >
      <Link href={`/projects/${project.key}`} className="block">
        {/* Card Container with 3D shadow */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-500"
          style={{
            boxShadow:
              stackIndex === 0
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)"
                : `0 ${10 + depth * 5}px ${20 + depth * 10}px -${5 + depth * 2}px rgba(0, 0, 0, ${0.3 + depth * 0.1})`,
          }}
        >
          {/* Image container - LANDSCAPE 16/10 */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={project.cover}
              alt={`${project.name} - ${project.sub}`}
              fill
              priority={stackIndex === 0}
              className="object-cover"
              sizes="(max-width: 640px) 88vw, 640px"
              placeholder="blur"
              blurDataURL={project.lqip}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            {project.gallery.length > 1 && (
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-[9px] tracking-[0.13em] uppercase font-bold px-2.5 py-1.5 rounded-full border border-white/10">
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

          {/* Depth darkening overlay for cards behind */}
          {depth > 0 && (
            <div
              className="absolute inset-0 bg-black pointer-events-none"
              style={{ opacity: depth * 0.12 }}
            />
          )}
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
  // Merge branding projects with UI/UX concept videos into one deck.
  // UI/UX entries are VideoProject (poster field) — map poster -> cover and
  // synthesize the fields ProjectGrid needs so their real thumbnails show.
  // useMemo keeps the array identity stable so the sync effect below doesn't
  // re-run on every render.
  const mergedDeck = useMemo<Project[]>(
    () => [
      ...data.projects,
      ...(data.uiuxVideos ?? []).map((v) => ({
        key: v.key,
        name: v.title,
        cat: "UI/UX Concept",
        sub: "Redesign",
        desc: v.description,
        tags: v.tags,
        cover: v.poster,
        lqip: "",
        gallery: [v.poster],
        caps: [],
      })),
    ],
    [data.projects, data.uiuxVideos],
  );
  const [deck, setDeck] = useState<Project[]>(mergedDeck);
  // Key bumped on each shuffle so AnimatePresence re-runs exit on the leaving card
  const [cycleKey, setCycleKey] = useState(0);

  // Scroll-driven shuffle state
  const stackRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollAccum = useRef(0);
  const SCROLL_THRESHOLD = 200; // px of vertical scroll to trigger one shuffle

  useEffect(() => {
    if (!hasVisitedWorks) {
      hasVisitedWorks = true;
    }
  }, []);

  // Sync when data loads async
  useEffect(() => {
    if (mergedDeck.length > 0 && deck.length === 0) {
      setDeck(mergedDeck);
    }
  }, [mergedDeck, deck.length]);

  // Move the top card to the back of the deck (the "shuffle")
  const cycleTopToBack = useCallback(() => {
    setDeck((prev) => {
      if (prev.length <= 1) return prev;
      const [top, ...rest] = prev;
      return [...rest, top];
    });
    setCycleKey((k) => k + 1);
  }, []);

  // Listen to vertical page scroll while the stack is in view; accumulate
  // distance and shuffle the deck each time the threshold is crossed.
  useEffect(() => {
    const onScroll = () => {
      const node = stackRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // Only react while the stack occupies the viewport
      const inView = rect.bottom > vh * 0.15 && rect.top < vh * 0.9;
      if (!inView) {
        lastScrollY.current = window.scrollY;
        scrollAccum.current = 0;
        return;
      }
      const delta = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;
      // Only count downward scroll so scrolling back up doesn't reshuffle
      if (delta > 0) {
        scrollAccum.current += delta;
        if (scrollAccum.current >= SCROLL_THRESHOLD) {
          scrollAccum.current = 0;
          cycleTopToBack();
        }
      }
    };
    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [cycleTopToBack]);

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

        {/* 3D Stacked deck: cards layered with perspective */}
        <div
          ref={stackRef}
          className="relative w-full flex justify-center"
          style={{ minHeight: 480, perspective: "1200px" }}
        >
          <div
            className="relative w-[88vw] sm:w-[560px] md:w-[640px]"
            style={{ height: 440, transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project, i) => (
                <StackCard
                  key={`${project.key}-${cycleKey}-${i}`}
                  project={project}
                  stackIndex={i}
                  skipEntrance={skipEntrance}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Non-interactive "shuffle for more" hint under the stack */}
        <div className="mt-10 flex justify-center">
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.22em] uppercase font-bold text-ink-50 select-none pointer-events-none"
          >
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
              className="inline-block"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.span>
            Shuffle for more
          </span>
        </div>
      </div>
    </section>
  );
}