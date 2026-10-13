"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteData } from "@/lib/data";

const FOLDER_TABS = [
  { key: "socialclub", label: "01 CLUBE P.A.", color: "#E8D44D", bgColor: "#F5E6A3" },
  { key: "rim", label: "02 BINGO", color: "#7BA3C9", bgColor: "#B8D4E8" },
  { key: "bijou", label: "03 SCINTILLA", color: "#E8A3C9", bgColor: "#F5C9D9" },
  { key: "capas", label: "04 CAPAS LIVROS", color: "#C9A3E8", bgColor: "#E8C9F5" },
];

export function FolderProjects() {
  const [activeTab, setActiveTab] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const currentProject = siteData.projects.find(p => p.key === FOLDER_TABS[activeTab].key);

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

        {/* Folder container */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Folder tabs */}
          <div className="flex gap-2 mb-0 relative z-10">
            {FOLDER_TABS.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(i)}
                className={`relative px-6 py-3 rounded-t-lg font-serif text-sm md:text-base tracking-wide transition-all duration-300 ${
                  activeTab === i
                    ? "text-ink shadow-lg -mb-px z-20"
                    : "text-ink-50 hover:text-ink-70"
                }`}
                style={{
                  backgroundColor: activeTab === i ? tab.bgColor : "transparent",
                  borderBottom: activeTab === i ? `3px solid ${tab.color}` : "none",
                }}
                data-cursor-hover
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Folder content */}
          <div
            className="relative rounded-b-lg rounded-tr-lg p-8 md:p-12 min-h-[500px] border-t-4"
            style={{
              backgroundColor: FOLDER_TABS[activeTab].bgColor,
              borderColor: FOLDER_TABS[activeTab].color,
            }}
          >
            <AnimatePresence mode="wait">
              {currentProject && (
                <motion.div
                  key={currentProject.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="grid md:grid-cols-2 gap-8 items-start"
                >
                  {/* Project image */}
                  <Link href={`/projects/${currentProject.key}`} className="block group" data-cursor-hover>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-paper-lo shadow-lg">
                      <Image
                        src={currentProject.cover}
                        alt={`${currentProject.name} cover`}
                        fill
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 600px"
                        placeholder="blur"
                        blurDataURL={currentProject.lqip}
                      />
                      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
                    </div>
                  </Link>

                  {/* Project info */}
                  <div>
                    <h3 className="font-serif text-3xl md:text-4xl tracking-tight text-ink mb-3">
                      {currentProject.name}
                    </h3>
                    <p className="text-sm tracking-[0.12em] uppercase text-ink-70 font-medium mb-4">
                      {currentProject.cat}
                    </p>
                    <p className="text-ink-soft leading-relaxed mb-6">
                      {currentProject.desc.slice(0, 200)}...
                    </p>
                    {currentProject.quote && (
                      <blockquote className="font-serif text-xl italic text-ink mb-6 pl-4 border-l-2 border-ink-30">
                        &ldquo;{currentProject.quote}&rdquo;
                      </blockquote>
                    )}
                    <Link
                      href={`/projects/${currentProject.key}`}
                      className="inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase font-semibold text-ink hover:text-accent transition-colors duration-300"
                      data-cursor-hover
                    >
                      View Case Study
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative elements */}
            <div className="absolute bottom-4 right-4 text-[10px] tracking-[0.2em] uppercase text-ink-30 font-semibold">
              2026
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}