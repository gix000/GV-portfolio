"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
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

export function About() {
  return (
    <section
      id="about"
      className="py-32 px-[clamp(28px,6vw,72px)] max-w-[1280px] mx-auto"
    >
      {/* Section kicker */}
      <Reveal className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-16">
        <span className="text-accent">01</span>
        <span>Introduction</span>
        <span className="flex-1 h-px bg-line" />
        <span className="hidden sm:inline">The Designer</span>
      </Reveal>

      <div className="flex flex-col items-center mb-16">
        {/* Portrait — big and centered */}
        <Reveal className="relative flex justify-center w-full">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm w-full max-w-[480px]">
            <Image
              src="/assets/img/about.webp"
              alt="George Charbel, Founder of G.VIISUALS"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 90vw, 480px"
              priority
            />
          </div>
        </Reveal>
        <span className="mt-5 block text-[10px] tracking-[0.18em] uppercase text-ink-50 font-semibold text-center">
          {siteData.about.portraitTag}
        </span>
      </div>

      <div className="max-w-2xl mx-auto">

        {/* Content */}
        <div>
          <Reveal delay={0.1}>
            <p
              className="font-serif text-2xl md:text-3xl leading-relaxed text-ink mb-8"
              dangerouslySetInnerHTML={{ __html: siteData.about.lead }}
            />
          </Reveal>

          <Reveal delay={0.2} className="space-y-5 text-ink-70 leading-relaxed">
            {siteData.about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>

          <Reveal delay={0.3}>
            <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-line">
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-3">
                  Services
                </div>
                <ul className="space-y-1.5 text-sm">
                  {siteData.about.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-3">
                  Based in
                </div>
                <ul className="space-y-1.5 text-sm">
                  {siteData.about.basedList.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}