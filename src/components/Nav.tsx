"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteData } from "@/lib/useSiteData";

export function Nav() {
  const { data } = useSiteData();
  // The bar turns to frosted glass once the page scrolls, so the logo never
  // sits on top of headings. (The old version read the scroll value once at
  // render, so the background never actually appeared.)
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      className={`nav-bar fixed top-0 left-0 right-0 z-50 px-[clamp(20px,5vw,72px)] flex items-center justify-between transition-[padding] duration-500 ${
        scrolled ? "is-scrolled py-2.5" : "py-4"
      }`}
    >
      <Link
        href="#top"
        className="flex items-center"
        data-cursor-hover
        aria-label="G.VIISUALS Home"
      >
        <Image
          src="/assets/img/logo.png"
          alt="GV Logo"
          width={56}
          height={40}
          className="h-9 w-auto"
          priority
        />
      </Link>
      <div className="flex items-center gap-4 text-[10px] tracking-[0.18em] uppercase font-semibold text-ink-70">
        <Link
          href="/ui-ux"
          className="glass-btn gap-1.5 h-9 px-4 text-ink"
          data-cursor-hover
          aria-label="View UI/UX work"
        >
          <svg width="11" height="11" viewBox="0 0 20 24" fill="none" aria-hidden="true">
            <path d="M2 2L18 12L2 22V2Z" fill="currentColor" />
          </svg>
          {data.ui.nav.uiuxButton}
        </Link>
      </div>
    </nav>
  );
}