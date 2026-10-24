"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteData, type Project } from "@/lib/useSiteData";
import { CaseStudy } from "@/components/CaseStudy";
import { useScrollLock } from "@/lib/useScrollLock";
import { KickerLine } from "@/components/motion/KickerLine";
import { preloadImage, whenIdle } from "@/lib/preloadImage";

declare global {
  interface Window {
    __gvOverlayNav?: number;
  }
}

const RETURN_KEY = "gv_return_card";

const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
  "Nineteen", "Twenty",
];

// Keep the heading honest: "{count}" or a number before "brands"/"projects"
// is replaced with the real project count, matching the original style
// (word or digits, capitalised or not).
function withProjectCount(title: string, count: number): string {
  const word = NUMBER_WORDS[count] ?? String(count);
  const asWord = (sample: string) =>
    /^\d+$/.test(sample) ? String(count) : sample[0] === sample[0].toLowerCase() ? word.toLowerCase() : word;
  return title
    .replace(/\{count\}/g, word)
    .replace(
      new RegExp(`\\b(${NUMBER_WORDS.join("|")}|\\d+)(?=(\\s|&nbsp;)+(brands?|projects?|identities)\\b)`, "i"),
      (m) => asWord(m),
    );
}

let hasVisitedWorks = false;

export function ProjectGrid() {
  const { data } = useSiteData();
  const t = data.ui.works;
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const skipEntrance = hasVisitedWorks;

  // Only branding/packaging projects here — UI/UX concepts live on /ui-ux.
  const mergedDeck = useMemo<Project[]>(() => data.projects, [data.projects]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openProject = useMemo(() => mergedDeck.find((p) => p.key === openKey) ?? null, [mergedDeck, openKey]);

  // Case studies open as an overlay on top of the homepage: instant (no
  // server round-trip), and closing it reveals the carousel exactly where it
  // was. The URL still changes to /projects/<key> so links and refresh work.
  const showProject = useCallback((key: string) => {
    window.__gvOverlayNav = Date.now();
    window.history.pushState({ ...window.history.state, gvProject: key }, "", `/projects/${key}`);
    setOpenKey(key);
  }, []);

  const closeProject = useCallback(() => {
    window.__gvOverlayNav = Date.now();
    if (window.history.state?.gvProject) window.history.back();
    else {
      window.history.replaceState(window.history.state, "", "/");
      setOpenKey(null);
    }
  }, []);

  // "Next project" inside the overlay: swap the project in place (no new
  // history entry, so Back still returns to the carousel) and move the
  // carousel underneath to that card.
  const overlayRef = useRef<HTMLDivElement>(null);
  const nextProject = useCallback((key: string) => {
    window.__gvOverlayNav = Date.now();
    window.history.replaceState({ ...window.history.state, gvProject: key }, "", `/projects/${key}`);
    setOpenKey(key);
    const scroller = scrollerRef.current;
    const card = scroller?.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`);
    if (scroller && card) {
      scroller.scrollTo({ left: card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      window.__gvOverlayNav = Date.now();
      const m = window.location.pathname.match(/^\/projects\/([^/]+)/);
      setOpenKey(m && window.history.state?.gvProject ? decodeURIComponent(m[1]) : null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openKey && closeProject();
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
    };
  }, [openKey, closeProject]);

  // Fetch the big case-study cover of the centred card (and its neighbours)
  // ahead of time, so tapping a card opens with the image already there.
  useEffect(() => {
    return whenIdle(() => {
      [activeIndex, activeIndex + 1, activeIndex - 1].forEach((i) => preloadImage(mergedDeck[i]?.cover));
    });
  }, [activeIndex, mergedDeck]);

  // Freeze the page behind the overlay.
  useScrollLock(!!openKey);

  useEffect(() => {
    if (!hasVisitedWorks) hasVisitedWorks = true;
  }, []);

  // On first paint, center a card: the one the visitor just came back from
  // (opened by direct link, then "Back to works"), otherwise the first one.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const returnKey = sessionStorage.getItem(RETURN_KEY);
    const returnIdx = returnKey ? mergedDeck.findIndex((p) => p.key === returnKey) : -1;
    const idx = Math.max(0, returnIdx);
    const card = scroller.querySelector<HTMLElement>(`[data-index="${idx}"]`);
    if (!card) return;
    const raf = requestAnimationFrame(() => {
      scroller.scrollTo({ left: card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2, behavior: "auto" });
      if (returnIdx >= 0) {
        setActiveIndex(returnIdx);
        const section = document.getElementById("works");
        const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
        if (section) {
          if (lenis) lenis.scrollTo(section, { immediate: true, offset: 0 });
          else section.scrollIntoView({ block: "start" });
        }
        setTimeout(() => sessionStorage.removeItem(RETURN_KEY), 800);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [mergedDeck]);

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

  // Fallback lock: once the swipe has fully settled (finger up + no scroll
  // events for a moment), nudge to the nearest card center if CSS snap left
  // it slightly off. Never runs mid-gesture, so it can't fight momentum.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let touching = false;
    const snapToNearest = () => {
      if (touching) return;
      const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-card]"));
      if (cards.length === 0) return;
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let target = scroller.scrollLeft;
      let minDist = Infinity;
      cards.forEach((c: HTMLElement) => {
        const dist = c.offsetLeft + c.offsetWidth / 2 - center;
        if (Math.abs(dist) < Math.abs(minDist)) minDist = dist;
      });
      if (Math.abs(minDist) < 2) return;
      target = scroller.scrollLeft + minDist;
      scroller.scrollTo({ left: target, behavior: "smooth" });
    };
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(snapToNearest, 180);
    };
    const onTouchStart = () => {
      touching = true;
      if (timer) clearTimeout(timer);
    };
    const onTouchEnd = () => {
      touching = false;
      schedule();
    };
    scroller.addEventListener("scroll", schedule, { passive: true });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });
    scroller.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", schedule);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("touchcancel", onTouchEnd);
      if (timer) clearTimeout(timer);
    };
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
    <section id="works" className="pt-28 pb-12">
      <div className="max-w-[1280px] mx-auto px-[clamp(28px,6vw,72px)]">
        {/* Section header */}
        <div ref={headerRef} className="mb-8">
          <motion.div
            initial={skipEntrance ? false : { opacity: 0, y: 30 }}
            animate={showHeader ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: skipEntrance ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-8"
          >
            <span className="text-accent">{t.number}</span>
            <span>{t.kicker}</span>
            <KickerLine skip={skipEntrance} />
            <span className="hidden sm:inline">{t.kickerRight}</span>
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
            dangerouslySetInnerHTML={{ __html: withProjectCount(data.works.title, mergedDeck.length) }}
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
          className="flex items-stretch gap-6 md:gap-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory -mt-4 pt-4 pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [overscroll-behavior-x:contain]"
          style={{ touchAction: "pan-x pan-y" }}
        >
          {/* Leading spacer tracks half-card at every breakpoint so card 1 snaps dead-center */}
          <div
            aria-hidden="true"
            className="shrink-0 gv-spacer"
          />

          {mergedDeck.map((project, i) => (
            // No slide-in transform on cards: on iOS it sometimes never
            // finished, leaving a card stuck 60px low and cut off.
            <article
              key={project.key}
              data-card
              data-key={project.key}
              data-index={i}
              data-cursor-hover
              className="shrink-0 snap-center [scroll-snap-stop:always] w-[88vw] sm:w-[560px] md:w-[640px] flex transition-opacity duration-500"
              style={{
                opacity: activeIndex === i ? 1 : 0.6,
              }}
            >
              <Link
                href={`/projects/${project.key}`}
                prefetch={false}
                scroll={false}
                className="flex w-full group active:scale-[0.985] transition-transform duration-300"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  showProject(project.key);
                }}
              >
                <div
                  className="relative w-full flex flex-col overflow-hidden rounded-2xl bg-paper transition-[box-shadow,border-color] duration-500"
                  style={{
                    border: `1.5px solid ${activeIndex === i ? "#7F011F" : "rgba(127, 1, 31, 0.45)"}`,
                    boxShadow:
                      activeIndex === i
                        ? "0 18px 40px -12px rgba(0, 0, 0, 0.35)"
                        : "0 10px 24px -12px rgba(0, 0, 0, 0.18)",
                  }}
                >
                  {/* Cover image — landscape 16/10 */}
                  <div className="clip-rounded relative aspect-[16/10] shrink-0 overflow-hidden rounded-t-[calc(1rem-1.5px)]">
                    {project.cover && (
                      <Image
                        src={project.cover}
                        alt={`${project.name} - ${project.sub}`}
                        fill
                        priority={i === 0}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 88vw, 640px"
                        placeholder={project.lqip ? "blur" : "empty"}
                        blurDataURL={project.lqip || undefined}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    {project.gallery.length > 1 && (
                      <div className="glass-btn glass-clear absolute right-3 bottom-3 gap-1.5 text-[9px] tracking-[0.13em] uppercase font-bold px-2.5 h-7">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                        {project.gallery.length} {t.imagesLabel}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1">
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
                    <p className={`text-sm text-ink-70 mt-2 leading-relaxed ${project.quote ? "" : "line-clamp-3"}`}>
                      {project.quote || project.desc}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))}

          {/* Trailing spacer mirrors leading so the last card centers too */}
          <div
            aria-hidden="true"
            className="shrink-0 gv-spacer"
          />
        </div>

        {/* Prominent "more projects" cue — sits right under the carousel */}
        <div className="flex flex-col items-center gap-2">
          {/* Animated swipe pill */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: showHint ? 1 : 0.45, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-paper-hi text-[11px] tracking-[0.18em] uppercase font-bold text-ink-70 select-none pointer-events-none"
          >
            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.4, ease: "easeInOut" }}
              className="inline-flex items-center gap-1.5"
            >
              <svg width="14" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
              {t.swipeHint}
            </motion.span>
            <span className="w-px h-3 bg-line" />
            <span className="text-ink-50">{mergedDeck.length} {t.countLabel}</span>
          </motion.div>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
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
      </div>
      <AnimatePresence>
        {openProject && (
          <motion.div
            key="project-overlay"
            ref={overlayRef}
            className="fixed inset-0 z-[90] bg-paper overflow-y-auto overscroll-contain"
            data-lenis-prevent
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={openProject.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onAnimationStart={() => overlayRef.current?.scrollTo({ top: 0 })}
              >
                <CaseStudy project={openProject} onBack={closeProject} onNext={nextProject} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}