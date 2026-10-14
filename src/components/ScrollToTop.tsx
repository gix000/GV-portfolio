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
