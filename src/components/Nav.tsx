"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export function Nav() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const blur = useTransform(scrollY, [0, 120], [0, 12]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-[clamp(28px,6vw,72px)] py-5 flex items-center justify-between"
      style={{
        backgroundColor: `rgba(242, 237, 228, ${bgOpacity.get()})`,
        backdropFilter: `blur(${blur.get()}px)`,
      }}
    >
      <Link
        href="#top"
        className="font-serif text-lg font-bold tracking-tight"
        data-cursor-hover
      >
        G.VIISUALS
      </Link>

      <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.18em] uppercase font-semibold">
        {[
          { label: "About", href: "#about" },
          { label: "Works", href: "#works" },
          { label: "Contact", href: "#contact" },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-accent transition-colors duration-300"
            data-cursor-hover
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase font-semibold text-ink-70">
        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
        Available
      </div>
    </motion.nav>
  );
}