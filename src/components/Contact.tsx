"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteData } from "@/lib/data";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      className="py-32 px-[clamp(28px,6vw,72px)] max-w-[1280px] mx-auto"
    >
      {/* Kicker */}
      <Reveal className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-12">
        <span className="text-accent">03</span>
        <span>Contact</span>
        <span className="flex-1 h-px bg-line" />
        <span className="hidden sm:inline">{"Let’s Work"}</span>
      </Reveal>

      {/* Time chip */}
      <Reveal delay={0.05}>
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-line bg-paper-hi text-[11px] tracking-[0.15em] uppercase font-semibold text-ink-70 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
          Beirut &middot; <BeirutTime /> &middot; {siteData.contact.timeChip}
        </div>
      </Reveal>

      {/* Heading */}
      <Reveal delay={0.1}>
        <h2
          className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight text-ink leading-[1.05]"
          dangerouslySetInnerHTML={{ __html: siteData.contact.heading }}
        />
      </Reveal>

      {/* Email CTA */}
      <Reveal delay={0.2} className="mt-10">
        <a
          href={`mailto:${siteData.contact.email}`}
          className="group inline-flex items-center gap-3 font-serif text-2xl md:text-3xl text-ink hover:text-accent transition-colors duration-300"
          data-cursor-hover
        >
          {siteData.contact.email}
          <span className="text-xl opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
            →
          </span>
        </a>
      </Reveal>

      {/* Links grid */}
      <Reveal delay={0.3}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-12 border-t border-line">
          <a
            href={siteData.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
            data-cursor-hover
          >
            <div className="text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-1">
              Instagram
            </div>
            <div className="text-sm font-medium group-hover:text-accent transition-colors duration-300">
              {siteData.contact.instagramHandle}
            </div>
          </a>
          <a
            href={`tel:${siteData.contact.phoneTel}`}
            className="group block"
            data-cursor-hover
          >
            <div className="text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-1">
              Phone
            </div>
            <div className="text-sm font-medium group-hover:text-accent transition-colors duration-300">
              {siteData.contact.phoneDisplay}
            </div>
          </a>
          <div className="block">
            <div className="text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-1">
              Location
            </div>
            <div className="text-sm font-medium">{siteData.contact.location}</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function BeirutTime() {
  // Server-safe: render placeholder, client hydrates
  return <span suppressHydrationWarning>--:--</span>;
}