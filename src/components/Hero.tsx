"use client";
import { motion } from "framer-motion";
import { useSiteData } from "@/lib/useSiteData";

export function Hero() {
  const { data: siteData } = useSiteData();

  return (
    <section
      id="top"
      className="relative flex flex-col justify-start pt-24 md:pt-28 pb-16 px-[clamp(28px,6vw,72px)] overflow-hidden"
    >
      {/* Top bar — volume chip on the right only */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 right-0 flex justify-end items-start p-[clamp(28px,6vw,72px)] pt-20 text-[11px] tracking-[0.22em] uppercase text-ink-70 font-semibold"
      >
        <div className="flex flex-col gap-1 text-right">
          <span className="hidden sm:inline">
            Selected Works · Vol. {siteData.hero.volume.split(",")[0]}
          </span>
        </div>
      </motion.div>

      {/* Main title block — no parallax transforms (kills scroll lag) */}
      <div className="relative z-10 w-full max-w-[1280px]">
        {/* "Ideas Into Reality" — big serif italic, fade-and-rise entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2 md:mb-4 overflow-hidden"
        >
          <h2 className="font-serif italic leading-none tracking-[-0.02em] text-[clamp(2rem,6vw,4.5rem)] text-ink">
            Ideas Into Reality
          </h2>
        </motion.div>

        <h1 className="font-serif leading-[0.88] tracking-[-0.03em] text-[clamp(3.2rem,11vw,9.5rem)]">
          <motion.span
            className="block overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">{siteData.hero.line1}</span>
          </motion.span>
          <motion.span
            className="block overflow-hidden italic"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">{siteData.hero.line2}</span>
          </motion.span>
        </h1>
      </div>

      {/* Sub info grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 mt-8 md:mt-12 max-w-[1280px]"
      >
        {[
          { label: "Studio", value: siteData.hero.studio },
          { label: "Discipline", value: "Brand Identity" },
          { label: "Based in", value: siteData.hero.basedIn, serif: true },
          { label: "Volume", value: siteData.hero.volume, serif: true },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.8 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-1">
              {item.label}
            </div>
            <div
              className={`text-sm font-medium ${item.serif ? "font-serif italic" : ""}`}
            >
              {item.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator — animated chevron that bounces */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-12 md:mt-16 flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold"
      >
        <span>Scroll</span>
        <motion.svg
          width="12"
          height="18"
          viewBox="0 0 12 18"
          fill="none"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M6 0 L6 14 M1 9 L6 14 L11 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
