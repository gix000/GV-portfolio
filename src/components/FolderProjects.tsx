"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteData } from "@/lib/data";

const FOLDERS = [
  { key: "socialclub", label: "01 CLUBE P.A.", tabColor: "#E8D44D", bodyColor: "#F5E6A3" },
  { key: "rim", label: "02 BINGO", tabColor: "#7BA3C9", bodyColor: "#B8D4E8" },
  { key: "bijou", label: "03 SCINTILLA", tabColor: "#E8A3C9", bodyColor: "#F5C9D9" },
  { key: "capas", label: "04 CAPAS LIVROS", tabColor: "#C9A3E8", bodyColor: "#E8C9F5" },
];

export function FolderProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const current = siteData.projects.find((p) => p.key === FOLDERS[activeIndex].key);

  return (
    <section id="folder-works" className="py-32 px-[clamp(28px,6vw,72px)]">
      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-8"
          >
            <span className="text-accent">02</span>
            <span>Project Archive</span>
            <span className="flex-1 h-px bg-line" />
            <span className="hidden sm:inline">2026 Collection</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl md:text-6xl tracking-tight text-ink leading-[1.05]"
          >
            PROJETOS
          </motion.h2>
        </div>

        {/* Stacked folder stack — back to front: purple, pink, blue, yellow, green(front) */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          style={{ minHeight: 620 }}
        >
          {/* Back folders (clickable tabs peeking above the front folder) */}
          {FOLDERS.map((folder, i) => {
            const isActive = i === activeIndex;
            // Stack offset: each folder sits a bit lower than the one behind it
            const topOffset = (FOLDERS.length - 1 - i) * 56;
            return (
              <button
                key={folder.key}
                onClick={() => setActiveIndex(i)}
                data-cursor-hover
                className="absolute left-0 right-0 flex items-end transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  top: topOffset,
                  zIndex: i + 1,
                  transform: isActive ? "translateY(-8px)" : "translateY(0)",
                }}
                aria-label={folder.label}
              >
                {/* Tab label */}
                <div
                  className="ml-[12%] px-6 pt-2 pb-1 rounded-t-xl font-serif text-sm md:text-base tracking-wide text-ink shadow-sm"
                  style={{ backgroundColor: folder.tabColor }}
                >
                  {folder.label}
                </div>
                {/* Folder body (only visible strip when not active) */}
                <div
                  className="flex-1 h-14 rounded-tr-xl"
                  style={{
                    backgroundColor: folder.bodyColor,
                    boxShadow: isActive ? "0 -4px 12px rgba(0,0,0,0.08)" : "none",
                  }}
                />
              </button>
            );
          })}

          {/* Front folder — green PROJETOS cover, always on top */}
          <div
            className="absolute left-0 right-0 bottom-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              zIndex: FOLDERS.length + 1,
              backgroundColor: "#C5D8A4",
              minHeight: 380,
            }}
          >
            {/* Top edge highlight */}
            <div className="h-1 w-full" style={{ backgroundColor: "#A8C686" }} />

            {/* Binder clip + pen + 2026 tab row */}
            <div className="relative px-8 pt-6 flex items-center justify-between">
              {/* Pen */}
              <svg width="80" height="14" viewBox="0 0 80 14" fill="none" className="opacity-80">
                <rect x="2" y="5" width="60" height="4" rx="2" fill="#2C2C2C" />
                <path d="M62 4 L78 7 L62 10 Z" fill="#2C2C2C" />
                <circle cx="6" cy="7" r="2" fill="#C0C0C0" />
              </svg>

              {/* Binder clip */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-3">
                <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
                  <path d="M14 4 C14 1 17 0 22 0 C27 0 30 1 30 4 L30 10 L14 10 Z" stroke="#2C2C2C" strokeWidth="2.5" fill="none" />
                  <rect x="6" y="10" width="32" height="22" rx="2" fill="#2C2C2C" />
                  <rect x="10" y="14" width="24" height="3" fill="#4A4A4A" />
                </svg>
              </div>

              {/* 2026 tab */}
              <div
                className="px-5 py-1.5 rounded-t-lg font-serif text-sm tracking-wide text-ink"
                style={{ backgroundColor: "#A8C686" }}
              >
                2026
              </div>
            </div>

            {/* PROJETOS title */}
            <div className="px-8 pt-4 pb-6 text-center">
              <h3 className="font-serif text-5xl md:text-7xl tracking-tight text-ink leading-none">
                PROJETOS
              </h3>
            </div>

            {/* Active project preview */}
            <div className="px-8 pb-8">
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={current.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="grid md:grid-cols-[1.1fr_1fr] gap-6 items-center bg-paper-hi/70 backdrop-blur-sm rounded-xl p-5 border border-ink/5"
                  >
                    <Link href={`/projects/${current.key}`} className="block group" data-cursor-hover>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-paper-lo shadow-md">
                        <Image
                          src={current.cover}
                          alt={`${current.name} cover`}
                          fill
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 500px"
                          placeholder="blur"
                          blurDataURL={current.lqip}
                        />
                      </div>
                    </Link>
                    <div>
                      <div className="text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-2">
                        {current.cat}
                      </div>
                      <h4 className="font-serif text-2xl md:text-3xl tracking-tight text-ink mb-2">
                        {current.name}
                      </h4>
                      <p className="text-sm text-ink-70 leading-relaxed mb-4 line-clamp-3">
                        {current.desc}
                      </p>
                      <Link
                        href={`/projects/${current.key}`}
                        className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-semibold text-ink hover:text-accent transition-colors duration-300"
                        data-cursor-hover
                      >
                        View Case Study
                        <span className="text-base">→</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}