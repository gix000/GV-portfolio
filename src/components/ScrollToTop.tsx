"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    __lenis?: { scrollTo: (to: number, opts?: { immediate?: boolean }) => void };
  }
}

let lastPopNav = 0;

export function ScrollToTop() {
  const pathname = usePathname();

  // Back/forward should land where the visitor was, not at the top.
  useEffect(() => {
    const onPop = () => {
      lastPopNav = Date.now();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    // Remember where the visitor came from (used by "Back to Home").
    const w = window as unknown as { __gvPrev?: string; __gvCur?: string };
    if (w.__gvCur !== pathname) {
      w.__gvPrev = w.__gvCur;
      w.__gvCur = pathname;
    }

    // The homepage project overlay changes the URL with pushState; that is
    // not a real page change, so leave the scroll position alone.
    if (window.__gvOverlayNav && Date.now() - window.__gvOverlayNav < 1500) return;
    if (Date.now() - lastPopNav < 1500) return;
    // Coming back to a specific carousel card: ProjectGrid scrolls to it.
    if (sessionStorage.getItem("gv_return_card")) return;

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
