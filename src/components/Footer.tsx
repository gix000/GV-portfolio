import { siteData } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-[clamp(28px,6vw,72px)] py-12 border-t border-line">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] tracking-[0.15em] uppercase text-ink-50 font-semibold">
        <span className="font-serif text-base tracking-tight text-ink not-uppercase normal-case">
          G.VIISUALS
        </span>
        <span>© {year} {siteData.contact.footerA}</span>
        <span>{siteData.contact.footerB}</span>
      </div>
    </footer>
  );
}