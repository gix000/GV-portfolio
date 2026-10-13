"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteData } from "@/lib/data";

const FOLDERS = [
  { key: "capas", label: "04 CAPAS LIVROS", tabColor: "#C9A3E8", bodyColor: "#D4B8E8", previewImg: "/assets/img/socialclub-01.webp", previewSide: "left" as const },
  { key: "bijou", label: "03 SCINTILLA", tabColor: "#E8A3C9", bodyColor: "#F0B8D4", previewImg: "/assets/img/bijou-cover.webp", previewSide: "right" as const },
  { key: "rim", label: "02 BINGO", tabColor: "#7BA3C9", bodyColor: "#9BB8D4", previewImg: "/assets/img/rim-cover.webp", previewSide: "left" as const },
  { key: "socialclub", label: "01 CLUBE P.A.", tabColor: "#E8D44D", bodyColor: "#F0E068", previewImg: "/assets/img/socialclub-cover.webp", previewSide: "right" as const },
];

export function FolderProjects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

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
        </div>

        {/* Vertical folder stack matching reference image exactly */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Back folders stacked vertically - purple, pink, blue, yellow */}
          {FOLDERS.map((folder, i) => {
            const project = siteData.projects.find((p) => p.key === folder.key);
            return (
              <Link
                key={folder.key}
                href={`/projects/${folder.key}`}
                data-cursor-hover
                className="block relative group"
                style={{
                  marginBottom: i < FOLDERS.length - 1 ? "-8px" : "0",
                  zIndex: FOLDERS.length - i
                }}
              >
                {/* Folder body */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-2xl group-hover:-translate-y-1"
                  style={{ backgroundColor: folder.bodyColor, minHeight: 160 }}
                >
                  {/* Tab label at TOP of folder */}
                  <div
                    className="absolute top-0 left-[20%] px-8 py-3 rounded-b-xl font-serif text-lg md:text-xl tracking-wide text-ink shadow-md"
                    style={{ backgroundColor: folder.tabColor }}
                  >
                    {folder.label}
                  </div>

                  {/* Preview image peeking out from the side */}
                  <div
                    className={`absolute top-6 ${folder.previewSide === "left" ? "left-8" : "right-8"} w-28 h-36 md:w-36 md:h-44 ${folder.previewSide === "left" ? "-rotate-6" : "rotate-6"} shadow-xl border-4 border-white/80 overflow-hidden rounded-sm`}
                  >
                    <Image
                      src={folder.previewImg}
                      alt={`${project?.name || folder.label} preview`}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-500" />
                </div>
              </Link>
            );
          })}

          {/* Front folder - green PROJETOS cover */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl mt-[-8px]"
            style={{ backgroundColor: "#C5D8A4", minHeight: 280, zIndex: FOLDERS.length + 1 }}
          >
            {/* Top edge */}
            <div className="h-1.5 w-full" style={{ backgroundColor: "#A8C686" }} />

            {/* Pen + Binder clip + 2026 tab row */}
            <div className="relative px-8 pt-8 flex items-center justify-between">
              {/* Pen */}
              <svg width="100" height="16" viewBox="0 0 100 16" fill="none" className="opacity-90 rotate-[-8deg]">
                <rect x="2" y="6" width="75" height="4" rx="2" fill="#1a1a1a" />
                <path d="M77 5 L98 8 L77 11 Z" fill="#1a1a1a" />
                <circle cx="8" cy="8" r="2.5" fill="#C0C0C0" />
                <rect x="15" y="6.5" width="8" height="3" fill="#4a4a4a" />
              </svg>

              {/* Binder clip centered */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-2">
                <svg width="52" height="48" viewBox="0 0 52 48" fill="none">
                  <path d="M16 6 C16 2 20 0 26 0 C32 0 36 2 36 6 L36 14 L16 14 Z" stroke="#1a1a1a" strokeWidth="3" fill="none" />
                  <rect x="8" y="14" width="36" height="28" rx="3" fill="#1a1a1a" />
                  <rect x="12" y="18" width="28" height="4" fill="#3a3a3a" />
                  <rect x="12" y="26" width="28" height="2" fill="#3a3a3a" />
                </svg>
              </div>

              {/* 2026 tab */}
              <div
                className="px-6 py-2 rounded-t-xl font-serif text-base md:text-lg tracking-wide text-ink shadow-sm"
                style={{ backgroundColor: "#A8C686" }}
              >
                2026
              </div>
            </div>

            {/* PROJETOS title */}
            <div className="px-8 pt-6 pb-10 text-center">
              <h2 className="font-serif text-6xl md:text-8xl tracking-tight text-ink leading-none" style={{ color: "#3d2817" }}>
                PROJETOS
              </h2>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}