"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteData, type Project } from "@/lib/useSiteData";

let hasVisitedWorks = false;

export function ProjectGrid() {
  const { data } = useSiteData();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const skipEntrance = hasVisitedWorks;

  // Merge branding projects with UI/UX concept videos into one deck.
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

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (!hasVisitedWorks) hasVisitedWorks = true;
  }, []);

  // Track which card is centered using IntersectionObserver
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-card]"));
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { root: scroller, threshold: [0.6, 0.8] },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [mergedDeck.length]);

  // Hide the scroll hint after the user starts scrolling
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      if (scroller.scrollLeft > 24) setShowHint(false);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  const showHeader = skipEntrance || headerInView;

  return (
    <section id="works" className="py-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-[clamp(28px,6vw,72px)]">
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
      </div>

      {/* Horizontal snap-scroll carousel — full-bleed so cards can center in viewport */}
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-[clamp(28px,6vw,72px)] px-[clamp(28px,6vw,72px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingLeft: "clamp(28px, 6vw, 72px)" }}
        >
          {/* Leading spacer so the first card can center */}
          <div
            aria-hidden="true"
            className="shrink-0 snap-start"
            style={{ width: "max(0px, calc((100vw - min(88vw, 640px)) / 2 - clamp(28px, 6vw, 72px)))" }}
          />

          {mergedDeck.map((project, i) => (
            <motion.article
              key={project.key}
              data-card
              data-index={i}
              data-cursor-hover
              initial={skipEntrance ? false : { opacity: 0, y: 60 }}
              whileInView={skipEntrance ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px -10% 0px -10%" }}
              transition={{
                duration: skipEntrance ? 0 : 0.7,
                delay: skipEntrance ? 0 : Math.min(i * 0.05, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="shrink-0 snap-center w-[88vw] sm:w-[560px] md:w-[640px]"
            >
              <Link href={`/projects/${project.key}`} className="block group">
                <div
                  className="relative overflow-hidden rounded-2xl bg-paper border border-line transition-all duration-500 group-hover:-translate-y-1"
                  style={{
                    boxShadow:
                      activeIndex === i
                        ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)"
                        : "0 10px 30px -10px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {/* Cover image — landscape 16/10 */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.cover}
                      alt={`${project.name} - ${project.sub}`}
                      fill
                      priority={i === 0}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 88vw, 640px"
                      placeholder="blur"
                      blurDataURL={project.lqip}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    {project.gallery.length > 1 && (
                      <div className="absolute right-3 bottom-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-[9px] tracking-[0.13em] uppercase font-bold px-2.5 py-1.5 rounded-full border border-white/10">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-xs tracking-[0.12em] uppercase text-ink-50 font-medium mt-1">
                      {project.cat}
                    </p>
                    <p className="text-sm text-ink-70 mt-2 line-clamp-2 leading-relaxed">
                      {project.quote || project.desc.slice(0, 120) + "..."}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}

          {/* Trailing spacer so the last card can center */}
          <div
            aria-hidden="true"
            className="shrink-0 snap-start"
            style={{ width: "max(0px, calc((100vw - min(88vw, 640px)) / 2 - clamp(28px, 6vw, 72px)))" }}
          />
        </div>

        {/* Animated scroll hint with arrow */}
        <div className="mt-10 flex justify-center">
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: showHint ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.22em] uppercase font-bold text-ink-50 select-none pointer-events-none"
          >
            Scroll to explore
            <motion.span
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
              className="inline-block"
            >
              <svg width="16" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </motion.span>
          </motion.span>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex justify-center items-center gap-2">
          {mergedDeck.map((p, i) => (
            <button
              key={p.key}
              type="button"
              aria-label={`Go to ${p.name}`}
              onClick={() => {
                const scroller = scrollerRef.current;
                if (!scroller) return;
                const card = scroller.querySelector<HTMLElement>(`[data-index="${i}"]`);
                if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-6 bg-accent" : "w-1.5 bg-ink-30 hover:bg-ink-50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}