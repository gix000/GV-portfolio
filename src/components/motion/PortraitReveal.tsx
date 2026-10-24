"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE_IN_OUT, EASE_OUT, MOTION_OK } from "@/lib/gsap";

// Image frame that wipes open from the bottom while the photo settles from a
// slight zoom. On desktop the photo also drifts a few percent against the
// scroll for depth; the oversized inner layer keeps the edges covered.
export function PortraitReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const drift = useRef<HTMLDivElement>(null);
  const zoom = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: frame.current, start: "top 85%", once: true } })
          .fromTo(
            frame.current,
            { clipPath: "inset(100% 0% 0% 0% round 16px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 16px)",
              duration: 1.4,
              ease: EASE_IN_OUT,
              clearProps: "clipPath", // hands the shadow back once open
            },
          )
          .fromTo(zoom.current, { scale: 1.25 }, { scale: 1, duration: 1.9, ease: EASE_OUT }, 0);
      });

      mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
        gsap.fromTo(
          drift.current,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={className}>
      <div ref={drift} className="absolute inset-x-0 -inset-y-[6%] will-change-transform">
        <div ref={zoom} className="absolute inset-0 will-change-transform">
          {children}
        </div>
      </div>
    </div>
  );
}
