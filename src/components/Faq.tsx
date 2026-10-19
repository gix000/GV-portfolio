"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteData } from "@/lib/useSiteData";

// Plain-language answers in real text: useful for visitors, and exactly the
// kind of content search engines and AI assistants quote.
export function Faq() {
  const { data } = useSiteData();
  const t = data.ui.faq;
  const items = data.faq.filter((f) => f.q && f.a);
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <section id="faq" className="py-16 px-[clamp(28px,6vw,72px)] max-w-[1280px] mx-auto">
      <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-8">
        {t.number && <span className="text-accent">{t.number}</span>}
        <span>{t.kicker}</span>
        <span className="flex-1 h-px bg-line" />
      </div>
      {t.title && (
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-ink leading-[1.1] mb-8">{t.title}</h2>
      )}

      <div className="max-w-3xl border-t border-line">
        {items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left font-serif text-lg md:text-xl text-ink"
                  data-cursor-hover
                >
                  <span>{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-btn glass-static shrink-0 h-8 w-8 text-ink"
                    aria-hidden="true"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 1v10M1 6h10" />
                    </svg>
                  </motion.span>
                </button>
              </h3>
              {/* Answer stays in the HTML when closed (hidden visually) so it is
                  always readable by crawlers. */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-12 text-ink-70 leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isOpen && <p className="sr-only">{f.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
