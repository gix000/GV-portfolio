"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteData } from "@/lib/data";

/* ─────────────────────────────────────────────
   FOLDER CONFIGURATION
   Each entry maps a project key to its visual
   treatment in the stack. Edit here to add/remove
   projects or change colours/positions.
   tabPos: "left" | "center" | "right"
   previewSide: "left" | "right" — where the
   thumbnail peeks out from
   ───────────────────────────────────────────── */
interface FolderConfig {
  key: string;
  num: string;
  tabColor: string;
  bodyColor: string;
  tabPos: "left" | "center" | "right";
  previewSide: "left" | "right";
  previewRotate: number;
}

const FOLDER_CONFIGS: FolderConfig[] = [
  { key: "capas",      num: "15", tabColor: "#C4A0D8", bodyColor: "#D4B8E8", tabPos: "right",  previewSide: "left",  previewRotate: -5 },
  { key: "sahara",     num: "14", tabColor: "#1B2838", bodyColor: "#2A3A4E", tabPos: "left",   previewSide: "right", previewRotate: 4  },
  { key: "casa",       num: "13", tabColor: "#C4B59A", bodyColor: "#D8CCBA", tabPos: "center", previewSide: "left",  previewRotate: -3 },
  { key: "tanmia",     num: "12", tabColor: "#BAC18E", bodyColor: "#CCD4A8", tabPos: "right",  previewSide: "right", previewRotate: 5  },
  { key: "loqmet",     num: "11", tabColor: "#9AA87A", bodyColor: "#B0BC94", tabPos: "left",   previewSide: "left",  previewRotate: -4 },
  { key: "cookiecart", num: "10", tabColor: "#D8A4A4", bodyColor: "#E8BCBC", tabPos: "center", previewSide: "right", previewRotate: 3  },
  { key: "lumiere",    num: "09", tabColor: "#7A624A", bodyColor: "#9A8268", tabPos: "right",  previewSide: "left",  previewRotate: -6 },
  { key: "merci",      num: "08", tabColor: "#E85D3A", bodyColor: "#F08060", tabPos: "left",   previewSide: "right", previewRotate: 4  },
  { key: "carneo",     num: "07", tabColor: "#864F26", bodyColor: "#A06838", tabPos: "center", previewSide: "left",  previewRotate: -3 },
  { key: "balcony",    num: "06", tabColor: "#EC8B33", bodyColor: "#F0A858", tabPos: "right",  previewSide: "right", previewRotate: 5  },
  { key: "byblobel",   num: "05", tabColor: "#5DBDC9", bodyColor: "#80D0D8", tabPos: "left",   previewSide: "left",  previewRotate: -4 },
  { key: "root",       num: "04", tabColor: "#4B5E1C", bodyColor: "#6A7E38", tabPos: "center", previewSide: "right", previewRotate: 3  },
  { key: "bijou",      num: "03", tabColor: "#E8A0C0", bodyColor: "#F0B8D0", tabPos: "left",   previewSide: "right", previewRotate: -5 },
  { key: "rim",        num: "02", tabColor: "#7AAED4", bodyColor: "#98C4E0", tabPos: "center", previewSide: "left",  previewRotate: 4  },
  { key: "socialclub", num: "01", tabColor: "#E8D060", bodyColor: "#F0DC78", tabPos: "right",  previewSide: "right", previewRotate: -3 },
];

/* Resolve config → project data */
function resolveFolders() {
  return FOLDER_CONFIGS.map((cfg) => {
    const project = siteData.projects.find((p) => p.key === cfg.key);
    return { ...cfg, project };
  }).filter((f) => f.project !== undefined);
}

/* Tab horizontal position classes */
function tabPositionClass(pos: "left" | "center" | "right") {
  switch (pos) {
    case "left":   return "left-[8%]";
    case "center": return "left-1/2 -translate-x-1/2";
    case "right":  return "right-[8%]";
  }
}

/* Paper texture SVG data URI */
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E")`;

/* ─── Dimensions ─── */
const TAB_H = 48;
const BODY_VISIBLE = 100; // visible strip of each back folder
const FRONT_H = 340;
const GAP = 4; // gap between folders

export function FolderProjects() {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-60px" });

  const folders = useMemo(() => resolveFolders(), []);
  const totalH = folders.length * (TAB_H + BODY_VISIBLE + GAP) + FRONT_H;

  /* Animation variants */
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.07,
        delayChildren: prefersReduced ? 0 : 0.15,
      },
    },
  };

  const folderVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const frontVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: folders.length * 0.07 + 0.2, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="folder-works"
      className="w-full py-24 md:py-32 px-[clamp(20px,5vw,72px)]"
      aria-label="Project folders"
    >
      <div className="max-w-[860px] mx-auto">
        {/* ── Section label ── */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4 text-[10px] tracking-[0.22em] uppercase text-ink-50 font-semibold mb-10"
        >
          <span className="text-accent">01</span>
          <span>Selected Works</span>
          <span className="flex-1 h-px bg-line" />
          <span className="hidden sm:inline">Vol. 01 · 2026</span>
        </motion.div>

        {/* ── Folder stack ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative select-none"
          style={{ height: totalH }}
          role="list"
          aria-label="Project folders — tap any folder to view the project"
        >
          {/* ── Back folders (back → front) ── */}
          {folders.map((folder, i) => {
            const top = i * (TAB_H + BODY_VISIBLE + GAP);
            const zIndex = i + 1;
            const isDark = folder.tabColor === "#1B2838" || folder.tabColor === "#7A624A" || folder.tabColor === "#864F26" || folder.tabColor === "#4B5E1C";

            return (
              <motion.div
                key={folder.key}
                variants={folderVariants}
                className="absolute left-0 right-0 group"
                style={{ top, zIndex, height: TAB_H + BODY_VISIBLE }}
                role="listitem"
              >
                <Link
                  href={`/projects/${folder.key}`}
                  data-cursor-hover
                  className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-2xl"
                  aria-label={`${folder.num} — ${folder.project!.name}: ${folder.project!.cat}`}
                >
                  {/* ── Tab ─ */}
                  <div
                    className={`absolute top-0 ${tabPositionClass(folder.tabPos)} px-7 md:px-9 py-2.5 rounded-b-2xl font-serif text-sm md:text-lg tracking-wide shadow-md transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-lg group-focus-visible:-translate-y-1.5`}
                    style={{
                      backgroundColor: folder.tabColor,
                      color: isDark ? "#F5F0E8" : "#2C2210",
                      minWidth: 180,
                      textAlign: "center",
                    }}
                  >
                    <span className="font-semibold">{folder.num}</span>
                    <span className="mx-2 opacity-50">·</span>
                    <span>{folder.project!.name.toUpperCase()}</span>
                  </div>

                  {/* ── Body strip ── */}
                  <div
                    className="absolute left-0 right-0 overflow-hidden shadow-lg transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-xl rounded-b-lg"
                    style={{
                      backgroundColor: folder.bodyColor,
                      height: BODY_VISIBLE,
                      top: TAB_H,
                      backgroundImage: PAPER_TEXTURE,
                      backgroundSize: "200px 200px",
                    }}
                  >
                    {/* Fine top outline */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
                    />

                    {/* ── Thumbnail peeking out ── */}
                    <div
                      className={`absolute top-2 ${
                        folder.previewSide === "left" ? "left-5 md:left-8" : "right-5 md:right-8"
                      } w-20 h-28 md:w-28 md:h-36 shadow-xl border-[3px] border-white/90 overflow-hidden rounded-sm transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2`}
                      style={{ transform: `rotate(${folder.previewRotate}deg)` }}
                    >
                      <Image
                        src={folder.project!.cover}
                        alt={`${folder.project!.name} preview`}
                        fill
                        className="object-cover"
                        sizes="112px"
                        loading="lazy"
                      />
                    </div>

                    {/* Category label */}
                    <div
                      className={`absolute bottom-3 ${
                        folder.previewSide === "left" ? "right-5 md:right-8" : "left-5 md:left-8"
                      } text-[9px] md:text-[10px] tracking-[0.18em] uppercase font-semibold`}
                      style={{ color: isDark ? "rgba(245,240,232,0.6)" : "rgba(44,34,16,0.45)" }}
                    >
                      {folder.project!.cat}
                    </div>

                    {/* Hover darken overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-300" />
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* ── Front folder: green PROJETOS cover ── */}
          <motion.div
            variants={frontVariants}
            className="absolute left-0 right-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              top: folders.length * (TAB_H + BODY_VISIBLE + GAP),
              zIndex: folders.length + 1,
              height: FRONT_H,
              backgroundColor: "#B8CC8A",
              backgroundImage: PAPER_TEXTURE,
              backgroundSize: "250px 250px",
            }}
          >
            {/* Darker top edge */}
            <div className="h-1 w-full" style={{ backgroundColor: "#9AB870" }} />

            {/* Pen + binder clip + 2026 tab row */}
            <div className="relative px-6 md:px-8 pt-7 flex items-end justify-between">
              {/* Pen */}
              <svg
                width="80"
                height="12"
                viewBox="0 0 80 12"
                fill="none"
                className="opacity-80 -rotate-6 mb-1 hidden sm:block"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="60" height="4" rx="2" fill="#1a1a1a" />
                <path d="M62 3 L78 6 L62 9 Z" fill="#1a1a1a" />
                <circle cx="7" cy="6" r="2" fill="#aaa" />
                <rect x="13" y="4.5" width="6" height="3" fill="#444" />
              </svg>

              {/* Binder clip — centred */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-1">
                <svg width="44" height="40" viewBox="0 0 44 40" fill="none" aria-hidden="true">
                  <path
                    d="M14 5 C14 1.5 17.5 0 22 0 C26.5 0 30 1.5 30 5 L30 11 L14 11 Z"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <rect x="6" y="11" width="32" height="24" rx="2.5" fill="#1a1a1a" />
                  <rect x="10" y="15" width="24" height="3" fill="#333" />
                  <rect x="10" y="21" width="24" height="2" fill="#333" />
                </svg>
              </div>

              {/* 2026 tab */}
              <div
                className="px-5 md:px-6 py-2 rounded-t-xl font-serif text-sm md:text-base tracking-wide shadow-sm ml-auto"
                style={{ backgroundColor: "#9AB870", color: "#3d2210" }}
              >
                2026
              </div>
            </div>

            {/* PROJETOS title */}
            <div className="flex items-center justify-center pt-4 pb-6 px-4">
              <h2
                className="font-serif text-5xl sm:text-6xl md:text-8xl tracking-tight leading-none text-center"
                style={{ color: "#3d2210" }}
              >
                PROJETOS
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-center text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ color: "rgba(61,34,16,0.5)" }}>
              Tap any folder above to explore
            </p>
          </motion.div>
        </motion.div>

        {/* ── Bottom hint ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: folders.length * 0.07 + 1, duration: 0.8 }}
          className="text-center text-[10px] tracking-[0.22em] uppercase text-ink-40 font-semibold mt-8"
        >
          {folders.length} projects · Click any folder to view
        </motion.p>
      </div>
    </section>
  );
}