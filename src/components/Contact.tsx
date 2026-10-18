"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSiteData } from "@/lib/useSiteData";

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
  const { data: siteData } = useSiteData();
  const t = siteData.ui.contact;
  return (
    <section
      id="contact"
      className="pt-12 pb-6 px-[clamp(28px,6vw,72px)] max-w-[1280px] mx-auto"
    >
      {/* Kicker */}
      <Reveal className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-8">
        <span className="text-accent">{t.number}</span>
        <span>{t.kicker}</span>
        <span className="flex-1 h-px bg-line" />
        <span className="hidden sm:inline">{t.kickerRight}</span>
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
          className="group inline-flex items-center gap-2 font-serif text-base md:text-lg text-ink hover:text-accent transition-colors duration-300"
          data-cursor-hover
        >
          {siteData.contact.email}
          <span className="text-sm opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
            →
          </span>
        </a>
      </Reveal>

      {/* Links — centered IG + Tel, no Loc */}
      <Reveal delay={0.3}>
        <div className="flex items-center justify-center gap-5 mt-6 pt-5 border-t border-line text-sm">
          <a
            href={siteData.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-medium hover:text-accent transition-colors duration-300"
            data-cursor-hover
          >
            <span className="text-ink-50 text-[10px] tracking-[0.2em] uppercase font-semibold">{t.igLabel}</span>
            {siteData.contact.instagramHandle}
          </a>
          <span className="w-px h-3.5 bg-line" aria-hidden="true" />
          <a
            href={`tel:${siteData.contact.phoneTel}`}
            className="group inline-flex items-center gap-2 font-medium hover:text-accent transition-colors duration-300"
            data-cursor-hover
          >
            <span className="text-ink-50 text-[10px] tracking-[0.2em] uppercase font-semibold">{t.telLabel}</span>
            {siteData.contact.phoneDisplay}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

