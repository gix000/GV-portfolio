"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE_IN_OUT, MOTION_OK } from "@/lib/gsap";

// The hairline rule in each section kicker. Draws left to right the first
// time its section scrolls into view.
export function KickerLine({ className = "", skip = false }: { className?: string; skip?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (skip) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.4,
          delay: 0.15,
          ease: EASE_IN_OUT,
          scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return <span ref={ref} aria-hidden="true" className={`flex-1 h-px bg-line ${className}`} />;
}
