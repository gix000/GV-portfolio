"use client";

import { useSiteData } from "@/lib/useSiteData";

export function Footer() {
  const { data: siteData } = useSiteData();

  return (
    <footer className="px-[clamp(28px,6vw,72px)] py-6 border-t border-line">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-5 text-sm">
        <a
          href={siteData.contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 font-medium text-ink-70 hover:text-accent transition-colors duration-300"
          data-cursor-hover
        >
          <span className="text-ink-50 text-[10px] tracking-[0.2em] uppercase font-semibold">IG</span>
          {siteData.contact.instagramHandle}
        </a>
        <span className="w-px h-3.5 bg-line" aria-hidden="true" />
        <a
          href={`tel:${siteData.contact.phoneTel}`}
          className="group inline-flex items-center gap-2 font-medium text-ink-70 hover:text-accent transition-colors duration-300"
          data-cursor-hover
        >
          <span className="text-ink-50 text-[10px] tracking-[0.2em] uppercase font-semibold">Tel</span>
          {siteData.contact.phoneDisplay}
        </a>
      </div>
    </footer>
  );
}
