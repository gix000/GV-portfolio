"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
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
  const [copied, setCopied] = useState(false);

  // Tapping the email copies it (most visitors don't have a mail app set up);
  // the small envelope next to it still opens the mail app.
  async function copyEmail() {
    const email = siteData.contact.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
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
        <div className="relative inline-flex items-center gap-3">
          <button
            type="button"
            onClick={copyEmail}
            className="group inline-flex items-center gap-2 font-serif text-base md:text-lg text-ink hover:text-accent transition-colors duration-300 active:scale-[0.97]"
            data-cursor-hover
            aria-label={`${t.copyHint}: ${siteData.contact.email}`}
          >
            {siteData.contact.email}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true">
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
          </button>
          <a
            href={`mailto:${siteData.contact.email}`}
            className="glass-btn h-9 w-9 text-ink"
            aria-label={t.mailApp}
            data-cursor-hover
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="glass-btn glass-static absolute left-0 -top-11 h-8 px-3 gap-1.5 text-[10px] tracking-[0.16em] uppercase font-bold text-ink"
                role="status"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {t.copied}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
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

