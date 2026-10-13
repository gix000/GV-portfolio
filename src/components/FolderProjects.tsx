"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteData } from "@/lib/data";

// Ordered back-to-front: purple (04) → pink (03) → blue (02) → yellow (01) → green (PROJETOS)
const FOLDERS = [
  {
    key: "capas",
    label: "04 CAPAS LIVROS",
    tabColor: "#C4A0D8",
    bodyColor: "#C4A0D8",
    previewImg: "/assets/img/socialclub-01.webp",
    previewSide: "left" as const,
  },
  {
    key: "bijou",
    label: "03 SCINTILLA",
    tabColor: "#E8A0C0",
    bodyColor: "#F0B0CC",
    previewImg: "/assets/img/bijou-cover.webp",
    previewSide: "right" as const,
  },
  {
    key: "rim",
    label: "02 BINGO",
    tabColor: "#7AAED4",
    bodyColor: "#90C0E0",
    previewImg: "/assets/img/rim-cover.webp",
    previewSide: "left" as const,
  },
  {
    key: "socialclub",
    label: "01 CLUBE P.A.",
    tabColor: "#E8D060",
    bodyColor: "#F0DC70",
    previewImg: "/assets/img/socialclub-cover.webp",
    previewSide: "right" as const,
  },
];

const TAB_H = 52; // height of the tab that sticks up
const BODY_H = 130; // visible body strip of each back folder
const FRONT_H = 320; // green PROJETOS folder height

export function FolderProjects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  // Total stack height
  const totalH = FOLDERS.length * (TAB_H + BODY_H) + FRONT_H;

  return (
    <section id="folder-works" className="py-32 px-[clamp(28px,6vw,72px)]">
      <div className="max-w-[900px] mx-auto">
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
        </div>

        {/* Folder stack */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative select-none"
          style={{ height: totalH }}
        >
          {/* ── Back folders: purple → pink → blue → yellow ── */}
          {FOLDERS.map((folder, i) => {
            const project = siteData.projects.find((p) => p.key === folder.key);
            // Each folder sits lower than the one behind it
            const top = i * (TAB_H + BODY_H);
            const zIndex = FOLDERS.length - i; // back folders have lower z

            return (
              <Link
                key={folder.key}
                href={`/projects/${folder.key}`}
                data-cursor-hover
                className="absolute left-0 right-0 block group"
                style={{ top, zIndex, height: TAB_H + BODY_H }}
                aria-label={`Open ${project?.name ?? folder.label}`}
              >
                {/* Tab — sticks up above the body */}
                <div
                  className="absolute rounded-t-2xl flex items-center justify-center font-serif text-base md:text-xl tracking-wide text-ink shadow-md transition-transform duration-300 group-hover:-translate-y-1"
                  style={{
                    backgroundColor: folder.tabColor,
                    height: TAB_H,
                    width: "55%",
                    left: "22%",
                    top: 0,
                  }}
                >
                  {folder.label}
                </div>

                {/* Body strip */}
                <div
                  className="absolute left-0 right-0 rounded-b-sm overflow-hidden shadow-lg transition-shadow duration-300 group-hover:shadow-2xl"
                  style={{
                    backgroundColor: folder.bodyColor,
                    height: BODY_H,
                    top: TAB_H,
                  }}
                >
                  {/* Preview photo peeking out */}
                  <div
                    className={`absolute top-3 ${
                      folder.previewSide === "left" ? "left-6" : "right-6"
                    } w-24 h-32 md:w-32 md:h-40 ${
                      folder.previewSide === "left" ? "-rotate-6" : "rotate-6"
                    } shadow-xl border-[3px] border-white/90 overflow-hidden rounded-sm`}
                  >
                    <Image
                      src={folder.previewImg}
                      alt={`${project?.name ?? folder.label} preview`}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>

                  {/* Hover darken */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.06] transition-colors duration-300" />
                </div>
              </Link>
            );
          })}

          {/* ── Front folder: green PROJETOS ── */}
          <div
            className="absolute left-0 right-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              top: FOLDERS.length * (TAB_H + BODY_H),
              zIndex: FOLDERS.length + 1,
              height: FRONT_H,
              backgroundColor: "#B8CC8A",
            }}
          >
            {/* Darker top edge */}
            <div className="h-1 w-full" style={{ backgroundColor: "#9AB870" }} />

            {/* Pen + binder clip + 2026 tab row */}
            <div className="relative px-8 pt-7 flex items-end justify-between">
              {/* Pen */}
              <svg
                width="90"
                height="14"
                viewBox="0 0 90 14"
                fill="none"
                className="opacity-90 -rotate-6 mb-1"
                aria-hidden="true"
              >
                <rect x="2" y="5" width="68" height="4" rx="2" fill="#1a1a1a" />
                <path d="M70 4 L88 7 L70 10 Z" fill="#1a1a1a" />
                <circle cx="7" cy="7" r="2" fill="#aaa" />
                <rect x="14" y="5.5" width="7" height="3" fill="#444" />
              </svg>

              {/* Binder clip — centred */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-1">
                <svg width="48" height="44" viewBox="0 0 48 44" fill="none" aria-hidden="true">
                  <path
                    d="M15 5 C15 1.5 19 0 24 0 C29 0 33 1.5 33 5 L33 12 L15 12 Z"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <rect x="7" y="12" width="34" height="26" rx="2.5" fill="#1a1a1a" />
                  <rect x="11" y="16" width="26" height="3.5" fill="#333" />
                  <rect x="11" y="23" width="26" height="2" fill="#333" />
                </svg>
              </div>

              {/* 2026 tab */}
              <div
                className="px-6 py-2 rounded-t-xl font-serif text-base md:text-lg tracking-wide text-ink shadow-sm"
                style={{ backgroundColor: "#9AB870" }}
              >
                2026
              </div>
            </div>

            {/* PROJETOS title */}
            <div className="flex items-center justify-center pt-5 pb-8">
              <h2
                className="font-serif text-6xl md:text-8xl tracking-tight leading-none"
                style={{ color: "#3d2210" }}
              >
                PROJETOS
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center text-[10px] tracking-[0.22em] uppercase text-ink-40 font-semibold mt-6"
        >
          Tap any folder to open the project
        </motion.p>
      </div>
    </section>
  );
}