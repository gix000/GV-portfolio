"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    __lenis?: { scrollTo: (to: number, opts?: { immediate?: boolean }) => void };
  }
}

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // If we're returning from a project page to a specific card, scroll to
    // that card instead of the top. The target id is set by CaseStudy's
    // handleBack before navigation and survives the unmount via sessionStorage.
    const targetFlag = "gv_scroll_to_card";
    if (typeof window !== "undefined") {
      const targetId = sessionStorage.getItem(targetFlag);
      if (targetId) {
        sessionStorage.removeItem(targetFlag);
        const scrollToCard = (attempts = 0) => {
          const el = document.getElementById(targetId);
          if (el) {
            const lenis = (window as unknown as { __lenis?: { scrollTo: (to: number | HTMLElement, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
            if (lenis) {
              lenis.scrollTo(el, { offset: -80, duration: 1 });
            } else {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
          }
          if (attempts < 30) {
            setTimeout(() => scrollToCard(attempts + 1), 60);
          }
        };
        // Give the homepage time to mount the ProjectGrid cards.
        setTimeout(scrollToCard, 150);
        return;
      }
    }

    const goTop = () => {
      // Use Lenis if available (it owns the scroll position), else native.
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0 });
      }
    };

    goTop();
    // Re-run after Lenis settles its initial position so it can't restore a cached offset.
    const t1 = setTimeout(goTop, 60);
    const t2 = setTimeout(goTop, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
