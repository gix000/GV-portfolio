"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/lib/data";
import { useSiteData } from "@/lib/useSiteData";

export function CaseStudy({
  project,
  onBack,
  onNext,
}: {
  project: Project;
  onBack?: () => void;
  onNext?: (key: string) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const prefersReduced = useReducedMotion();
  const router = useRouter();
  const site = useSiteData().data;
  const t = site.ui.caseStudy;
  const idx = site.projects.findIndex((p) => p.key === project.key);
  const next = site.projects.length > 1 ? site.projects[(idx + 1) % site.projects.length] : null;

  // Opened from the homepage carousel: the overlay closes itself (history
  // back) and the carousel is still sitting on this card. Opened directly by
  // URL: go home and let the carousel jump to this card.
  function handleBack() {
    if (onBack) return onBack();
    sessionStorage.setItem("gv_return_card", project.key);
    router.push("/");
  }

  const thinking = (
    [
      { key: "challenge", label: t.challenge },
      { key: "idea", label: t.idea },
      { key: "mark", label: t.mark },
      { key: "craft", label: t.craft },
      { key: "type", label: t.type },
    ] as const
  )
    .map((x) => ({ ...x, text: (project.think?.[x.key] ?? "").trim() }))
    .filter((x) => x.text);

  const pageVariants = {
    initial: { opacity: onBack ? 1 : 0 },
    animate: { opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <motion.div
      className="min-h-screen bg-paper"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Top bar - sticky so it works both as a page and inside the overlay */}
      <div className="case-topbar sticky top-0 z-50 px-[clamp(20px,5vw,72px)] pt-[max(14px,env(safe-area-inset-top))] pb-3 flex items-center gap-3 pointer-events-none">
        <button
          type="button"
          onClick={handleBack}
          className="glass-btn pointer-events-auto h-10 px-4 text-[10px] tracking-[0.18em] uppercase font-bold text-ink"
          data-cursor-hover
        >
          {t.back}
        </button>
      </div>

      <div className="pt-3 pb-16 px-[clamp(28px,6vw,72px)]">
        <div className="max-w-[1280px] mx-auto">
          {/* Cover image with tap-to-reveal overlay */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[16/10] rounded-2xl bg-paper-lo mb-8 group cursor-pointer shadow-xl"
            onClick={() => !revealed && setRevealed(true)}
          >
            {project.cover && (
              <div className="clip-rounded absolute inset-0 overflow-hidden rounded-2xl">
                <Image
                  src={project.cover}
                  alt={`${project.name} cover`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                  placeholder={project.lqip ? "blur" : "empty"}
                  blurDataURL={project.lqip || undefined}
                />
              </div>
            )}
            {!revealed && (
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-btn glass-dark absolute bottom-4 right-4 gap-2 px-4 h-9"
                >
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/90">
                    {t.viewGallery}
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
              </div>
            )}
          </motion.div>

          {/* Title + subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            {project.cat && (
              <p className="text-[10px] tracking-[0.18em] uppercase text-ink-50 font-semibold mb-2.5">
                {project.cat}
              </p>
            )}
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-ink leading-[1.05] mb-3">
              {project.name}
            </h1>
            <p className="text-lg md:text-xl text-ink-70 font-serif italic">
              {project.sub}
            </p>
          </motion.div>

          {/* Gallery - animated reveal under the cover */}
          <AnimatePresence initial={false}>
            {revealed && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12"
              >
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setRevealed(false)}
                    className="glass-btn h-9 px-4 text-[10px] tracking-[0.18em] uppercase font-bold text-ink-70"
                    data-cursor-hover
                  >
                    {t.closeGallery}
                  </button>
                </div>
                <div className="flex flex-col gap-5">
                  {project.gallery.map((img, i) => (
                    <motion.div
                      key={i}
                      // Reveal each image as it scrolls into view instead of
                      // staggering 15+ big images at once (that was the jank).
                      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                      transition={{ duration: 0.55, delay: i < 2 ? i * 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
                      className="relative w-full rounded-2xl bg-paper-lo shadow-lg"
                    >
                      <div className="clip-rounded overflow-hidden rounded-2xl">
                        <Image
                          src={img}
                          alt={project.caps?.[i] || `${project.name} - ${i + 1}`}
                          width={1280}
                          height={800}
                          className="w-full h-auto object-cover"
                          sizes="(max-width: 1280px) 100vw, 1280px"
                        />
                      </div>
                      {project.caps?.[i] && (
                        <span className="glass-btn glass-dark absolute left-4 bottom-4 h-8 px-3 text-[10px] tracking-[0.18em] uppercase font-bold">
                          {project.caps[i]}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Description, quote, palette, tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-ink-70 leading-relaxed max-w-2xl mb-6">
              {project.desc}
            </p>
            {project.quote && (
              <blockquote className="font-serif text-xl italic text-ink border-l-2 border-accent pl-4 mb-8">
                &ldquo;{project.quote}&rdquo;
              </blockquote>
            )}

            {/* Design thinking */}
            {thinking.length > 0 && (
              <section className="mt-12 mb-12">
                <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-8">
                  <span className="text-accent">{t.process}</span>
                  <span className="flex-1 h-px bg-line" />
                </div>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {thinking.map((item, i) => (
                    <motion.div
                      key={item.key}
                      initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                      transition={{ duration: 0.55, delay: (i % 2) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="border-t border-line pt-4"
                    >
                      <div className="flex items-baseline gap-3 mb-2.5">
                        <span className="text-[10px] font-semibold text-ink-50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-bold">{item.label}</span>
                      </div>
                      <p className="text-[15px] leading-relaxed text-ink-70">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {project.think?.pal && project.think.pal.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-3">
                  {t.palette}
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {project.think.pal.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-12 h-12 rounded border border-line shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[9px] font-mono text-ink-50">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
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

          {/* Next project */}
          {next && (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 pt-8 border-t border-line"
            >
              <Link
                href={`/projects/${next.key}`}
                prefetch={false}
                onClick={(e) => {
                  if (!onNext || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  onNext(next.key);
                }}
                className="group block active:scale-[0.985] transition-transform duration-300"
                data-cursor-hover
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold">{t.nextProject}</span>
                  <span className="glass-btn h-10 w-10 text-ink" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
                <div className="relative aspect-[16/7] rounded-2xl bg-paper-lo shadow-lg">
                  {next.cover && (
                    <div className="clip-rounded absolute inset-0 overflow-hidden rounded-2xl">
                      <Image
                        src={next.cover}
                        alt={next.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        placeholder={next.lqip ? "blur" : "empty"}
                        blurDataURL={next.lqip || undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    </div>
                  )}
                  <div className="absolute left-5 right-5 bottom-4 text-white">
                    <p className="font-serif text-3xl md:text-5xl tracking-tight leading-none">{next.name}</p>
                    {next.sub && <p className="mt-1.5 text-sm md:text-base font-serif italic text-white/85">{next.sub}</p>}
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}