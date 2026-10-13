"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function Nav() {
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
      <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase font-semibold text-ink-70">
        <span className="hidden sm:inline">Beirut, LB</span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
      </div>
    </motion.nav>
  );
}