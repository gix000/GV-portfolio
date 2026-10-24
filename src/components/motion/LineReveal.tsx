"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, EASE_OUT, MOTION_OK } from "@/lib/gsap";

type Props = {
  html: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
};

// Heading whose lines rise through a mask, the same gesture as the hero
// title. Splits after webfonts load (autoSplit) so line breaks are real, and
// un-splits when finished so descenders and italics are never clipped.
export function LineReveal({ html, className = "", as: Tag = "h2" }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let done = false;
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            if (done) return;
            // Room for descenders while the mask is on.
            gsap.set(self.masks, { paddingBottom: "0.3em", marginBottom: "-0.3em" });
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              ease: EASE_OUT,
              stagger: 0.12,
              scrollTrigger: { trigger: el, start: "top 86%", once: true },
              onComplete() {
                done = true;
                self.revert();
              },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref, dependencies: [html], revertOnUpdate: true },
  );

  // flow-root keeps the masks' descender padding inside the box, so the
  // heading is the same height split or not (no jump when it un-splits).
  return <Tag key={html} ref={ref} className={`flow-root ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
