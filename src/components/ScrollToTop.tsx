"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  // On every page load or route change, force scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    // Also reset after a tiny delay in case Lenis or browser restores scroll
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 50);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
