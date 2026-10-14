"use client";

import { useSiteData } from "@/lib/useSiteData";

export function Footer() {
  const { data: siteData } = useSiteData();
  const year = new Date().getFullYear();

  return (
    <footer className="px-[clamp(28px,6vw,72px)] py-8 border-t border-line">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] tracking-[0.15em] uppercase text-ink-50 font-semibold">
        <span>&copy; {year} {siteData.contact.footerA}</span>
        <span>{siteData.contact.footerB}</span>
      </div>
    </footer>
  );
}