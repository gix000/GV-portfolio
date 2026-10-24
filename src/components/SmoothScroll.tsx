"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Expose the Lenis instance globally so other components (ScrollToTop,
// LoadingScreen) can call lenis.scrollTo(0) instead of window.scrollTo,
// which Lenis overrides with its own virtual scroll position.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  // Lenis hijacks wheel scrolling, which freezes scrollable panels like the
  // admin edit form (its Save button became unreachable). Keep it off there.
  const isAdmin = usePathname()?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdmin) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Drive Lenis from GSAP's ticker so ScrollTrigger animations read the
    // same smoothed scroll position Lenis renders.
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      window.__lenis = undefined;
      lenis.destroy();
    };
  }, [isAdmin]);

  return <>{children}</>;
}
