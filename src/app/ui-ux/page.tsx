"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type VideoProject } from "@/lib/data";
import { useSiteData } from "@/lib/useSiteData";

type ViewMode = "try" | "film";

/* Fullscreen viewer: the live HTML prototype (iframe) or the concept film (mp4),
   with a toggle between them when a concept has both. */
function ConceptViewer({
  video,
  initialMode,
  onClose,
}: {
  video: VideoProject;
  initialMode: ViewMode;
  onClose: () => void;
}) {
  const t = useSiteData().data.ui.uiux;
  const canTry = !!video.redesignUrl;
  const canFilm = !!video.videoUrl;
  const [mode, setMode] = useState<ViewMode>(initialMode === "try" && !canTry ? "film" : initialMode === "film" && !canFilm ? "try" : initialMode);

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
      className="fixed inset-0 z-[9999] flex flex-col bg-black/90"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-4 shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0">
          <p className="text-white font-serif text-base md:text-lg tracking-tight truncate">{video.title}</p>
          <p className="text-white/50 text-[10px] tracking-[0.18em] uppercase font-semibold truncate">{t.viewerSubtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {canTry && canFilm && (
        <div className="flex justify-center pb-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="inline-flex p-1 rounded-full bg-white/10">
            {(["try", "film"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 h-8 rounded-full text-[10px] tracking-[0.18em] uppercase font-bold transition-colors ${
                  mode === m ? "bg-white text-black" : "text-white/80"
                }`}
              >
                {m === "try" ? t.tryButton : t.watchFilm}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 flex items-center justify-center p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-full max-h-[86vh] aspect-[9/19] rounded-[2.2rem] overflow-hidden shadow-2xl bg-black ring-1 ring-white/10">
          {mode === "try" ? (
            <iframe
              src={video.redesignUrl}
              title={`${video.title} interactive concept`}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <video
              key={video.videoUrl}
              src={video.videoUrl}
              poster={video.poster || undefined}
              className="w-full h-full object-contain bg-black"
              controls
              autoPlay
              playsInline
              loop
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function UiUxPage() {
  const { data } = useSiteData();
  const t = data.ui.uiux;
  const videos = useMemo(() => data.uiuxVideos, [data.uiuxVideos]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [activeVideo, setActiveVideo] = useState<{ video: VideoProject; mode: ViewMode } | null>(null);

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
            {t.back}
          </Link>
          <span className="text-[10px] tracking-[0.15em] uppercase text-ink-50 font-semibold">
            {t.topRight}
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
                <span className="text-accent">{t.number}</span>
                <span>{t.kicker}</span>
                <span className="flex-1 h-px bg-line" />
              </div>
              <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-ink leading-[1.05] mb-4">
                {t.title}
              </h1>
              <p className="text-ink-70 max-w-xl leading-relaxed text-lg">
                {t.intro}
              </p>
            </motion.div>
          </div>

          {/* Swipeable carousel — mirrors the projects carousel */}
          <div className="relative">
            <div
              ref={scrollerRef}
              className="flex items-stretch gap-6 md:gap-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory -mt-4 pt-4 pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [overscroll-behavior-x:contain]"
              style={{ touchAction: "pan-x pan-y" }}
            >
              <div aria-hidden="true" className="shrink-0 gv-spacer" />

              {videos.map((video, i) => (
                <article
                  key={video.key}
                  data-card
                  data-index={i}
                  data-cursor-hover
                  className="shrink-0 snap-center [scroll-snap-stop:always] w-[88vw] sm:w-[560px] md:w-[640px] flex transition-opacity duration-500"
                  style={{ opacity: activeIndex === i ? 1 : 0.6 }}
                >
                  <div
                    className="relative w-full flex flex-col overflow-hidden rounded-2xl bg-paper transition-[box-shadow,border-color] duration-500 group"
                    style={{
                      border: `1.5px solid ${activeIndex === i ? "#7F011F" : "rgba(127, 1, 31, 0.45)"}`,
                      boxShadow:
                        activeIndex === i
                          ? "0 18px 40px -12px rgba(0, 0, 0, 0.35)"
                          : "0 10px 24px -12px rgba(0, 0, 0, 0.18)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveVideo({ video, mode: video.redesignUrl ? "try" : "film" })}
                      className="relative block w-full aspect-[16/10] shrink-0 overflow-hidden rounded-t-2xl outline-none"
                      aria-label={`${t.tapToTry}: ${video.title}`}
                    >
                      {video.poster && (
                        <Image
                          src={video.poster}
                          alt={video.title}
                          fill
                          priority={i === 0}
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 88vw, 640px"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.span
                          animate={
                            activeIndex === i
                              ? { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }
                              : { scale: 1, opacity: 0.85 }
                          }
                          transition={
                            activeIndex === i
                              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                              : { duration: 0.3 }
                          }
                          className="text-[10px] tracking-[0.22em] uppercase font-bold text-white bg-black/60 px-4 py-2 rounded-full border border-white/15 shadow-lg"
                        >
                          {video.redesignUrl ? t.tapToTry : t.watchFilm}
                        </motion.span>
                      </div>
                    </button>

                    {/* Info - grows so every card matches the tallest one */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-serif text-xl md:text-2xl tracking-tight text-ink">{video.title}</h3>
                        <span className="text-[10px] tracking-[0.15em] uppercase text-ink-50 font-semibold whitespace-nowrap">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {video.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] tracking-[0.12em] uppercase font-semibold text-ink-50 border border-line rounded-full px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-ink-70 mt-2.5 leading-relaxed">{video.description}</p>

                      <div className="flex flex-wrap gap-2 mt-auto pt-4">
                        {video.redesignUrl && (
                          <button
                            type="button"
                            onClick={() => setActiveVideo({ video, mode: "try" })}
                            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-ink text-paper text-[10px] tracking-[0.18em] uppercase font-bold"
                          >
                            {t.tryButton}
                          </button>
                        )}
                        {video.videoUrl && (
                          <button
                            type="button"
                            onClick={() => setActiveVideo({ video, mode: "film" })}
                            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-ink/30 text-ink text-[10px] tracking-[0.18em] uppercase font-bold"
                          >
                            <svg width="9" height="10" viewBox="0 0 20 24" fill="none" aria-hidden="true">
                              <path d="M2 2L18 12L2 22V2Z" fill="currentColor" />
                            </svg>
                            {t.watchFilm}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <div aria-hidden="true" className="shrink-0 gv-spacer" />
            </div>

            {/* Swipe-for-more pill + dots — same as projects */}
            <div className="flex flex-col items-center gap-2">
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
                <span className="text-ink-50">{videos.length} {t.countLabel}</span>
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
        {activeVideo && (
          <ConceptViewer video={activeVideo.video} initialMode={activeVideo.mode} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
