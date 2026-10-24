"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

// Paragraph that "reads itself" as you scroll: words start faint and fill to
// full ink, tied to scroll position. Opacity only, so it stays on the GPU.
export function ScrubText({ html, className = "" }: { html: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 52%", scrub: 0.6 },
          },
        );
        return () => split.revert();
      });
    },
    // Admin edits swap the HTML; the key below remounts the node so the
    // split never reverts onto stale markup.
    { scope: ref, dependencies: [html], revertOnUpdate: true },
  );

  return <p key={html} ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
