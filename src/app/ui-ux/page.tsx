"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { siteData, type VideoProject } from "@/lib/data";

/* Fullscreen interactive redesign viewer — loads the live HTML concept in an iframe */
function RedesignViewer({
  video,
  onClose,
}: {
  video: VideoProject;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="text-white font-serif text-base md:text-lg tracking-tight truncate">
            {video.title}
          </p>
          <p className="text-white/50 text-[10px] tracking-[0.18em] uppercase font-semibold truncate">
            Interactive concept · tap &amp; try it
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {video.videoUrl && (
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] tracking-[0.15em] uppercase font-bold transition-colors"
            >
              Watch film
            </a>
          )}
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Phone-framed interactive prototype */}
      <div
        className="flex-1 min-h-0 flex items-center justify-center p-4 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full max-h-[88vh] aspect-[9/19] rounded-[2.2rem] overflow-hidden shadow-2xl bg-black ring-1 ring-white/10"
        >
          <iframe
            src={video.redesignUrl}
            title={`${video.title} interactive concept`}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function UiUxPage() {
  const videos = useMemo(() => siteData.uiuxVideos, []);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);

  // Center the first card on load
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const first = scroller.querySelector<HTMLElement>('[data-index="0"]');
    if (!first) return;
    const raf = requestAnimationFrame(() => {
      const cardCenter = first.offsetLeft + first.offsetWidth / 2;
      scroller.scrollTo({ left: cardCenter - scroller.clientWidth / 2, behavior: "auto" });
    });
    return () => cancelAnimationFrame(raf);
  }, [videos.length]);

  // Track centered card
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
  }, [videos.length]);

  // Hide hint after scrolling
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      if (scroller.scrollLeft > 24) setShowHint(false);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-paper">
        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 px-[clamp(28px,6vw,72px)] py-5 flex items-center justify-between bg-paper/80 backdrop-blur-sm">
          <Link
            href="/#top"
            className="text-[11px] tracking-[0.18em] uppercase font-semibold hover:text-accent transition-colors duration-300 text-ink"
            data-cursor-hover
          >
            &larr; Back to Home
          </Link>
          <span className="text-[10px] tracking-[0.15em] uppercase text-ink-50 font-semibold">
            UI/UX Work
          </span>
        </div>

        <section className="pt-28 pb-12">
          <div className="px-[clamp(28px,6vw,72px)] max-w-[1280px] mx-auto mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-6">
                <span className="text-accent">03</span>
                <span>UI/UX Design</span>
                <span className="flex-1 h-px bg-line" />
              </div>
              <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-ink leading-[1.05] mb-4">
                Interface &amp; Experience
              </h1>
              <p className="text-ink-70 max-w-xl leading-relaxed text-lg">
                Independent app redesign concepts you can actually tap through. Each one is a
                working interactive prototype — open it, play with it, feel the flow.
              </p>
            </motion.div>
          </div>

          {/* Swipeable carousel — mirrors the projects carousel */}
          <div className="relative">
            <div
              ref={scrollerRef}
              className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [overscroll-behavior-x:contain]"
              style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
            >
              <div aria-hidden="true" className="shrink-0 gv-spacer" />

              {videos.map((video, i) => (
                <motion.article
                  key={video.key}
                  data-card
                  data-index={i}
                  data-cursor-hover
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: Math.min(i * 0.05, 0.3),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="shrink-0 snap-center [scroll-snap-stop:always] w-[88vw] sm:w-[560px] md:w-[640px] transition-transform duration-500 ease-out will-change-transform"
                  style={{ opacity: activeIndex === i ? 1 : 0.6 }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveVideo(video)}
                    className="block w-full text-left group outline-none"
                  >
                    <div
                      className={`relative overflow-hidden rounded-2xl bg-paper border transition-all duration-500 group-hover:-translate-y-1 ${
                        activeIndex === i ? "border-accent ring-2 ring-accent/30" : "border-line"
                      }`}
                      style={{
                        borderColor: activeIndex === i ? "#7F011F" : "rgba(127, 1, 31, 0.45)",
                        borderWidth: "1.5px",
                        borderStyle: "solid",
                        boxShadow:
                          activeIndex === i
                            ? "0 12px 34px rgba(127, 1, 31, 0.20), inset 0 2px 4px rgba(0, 0, 0, 0.05)"
                            : "0 4px 14px rgba(127, 1, 31, 0.08)",
                      }}
                    >
                      {/* Poster — portrait-ish to hint at a phone app */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                        <Image
                          src={video.poster}
                          alt={video.title}
                          fill
                          priority={i === 0}
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 88vw, 640px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        {/* Tap to try affordance */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <motion.span
                            animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-[10px] tracking-[0.22em] uppercase font-bold text-white bg-black/45 backdrop-blur-sm px-4 py-2 rounded-full border border-white/15 shadow-lg"
                          >
                            Tap to try
                          </motion.span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="font-serif text-xl md:text-2xl tracking-tight text-ink">
                            {video.title}
                          </h3>
                          <span className="text-[10px] tracking-[0.15em] uppercase text-ink-50 font-semibold whitespace-nowrap">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {video.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] tracking-[0.12em] uppercase font-semibold text-ink-50 border border-line rounded-full px-2 py-0.5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-ink-70 mt-2.5 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.article>
              ))}

              <div aria-hidden="true" className="shrink-0 gv-spacer" />
            </div>

            {/* Swipe-for-more pill + dots — same as projects */}
            <div className="mt-6 flex flex-col items-center gap-2">
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
                  Swipe for more
                </motion.span>
                <span className="w-px h-3 bg-line" />
                <span className="text-ink-50">{videos.length} concepts</span>
              </motion.div>

              <div className="flex items-center gap-2">
                {videos.map((v, i) => (
                  <button
                    key={v.key}
                    type="button"
                    aria-label={`Go to ${v.title}`}
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
        </section>
      </div>

      <AnimatePresence>
        {activeVideo && <RedesignViewer video={activeVideo} onClose={() => setActiveVideo(null)} />}
      </AnimatePresence>
    </>
  );
}
