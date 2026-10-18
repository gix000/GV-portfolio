"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSiteData } from "@/lib/useSiteData";

export function Nav() {
  const { data } = useSiteData();
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 120], [0, 0.85]);
  const blur = useTransform(scrollY, [0, 120], [0, 12]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-[clamp(28px,6vw,72px)] py-4 flex items-center justify-between"
      style={{
        backgroundColor: `rgba(242, 237, 228, ${bgOpacity.get()})`,
        backdropFilter: `blur(${blur.get()}px)`,
      }}
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
    </motion.nav>
  );
}