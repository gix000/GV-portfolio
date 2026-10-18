import Link from "next/link";
import Image from "next/image";
import { getLiveSiteData } from "@/lib/siteDataServer";

export default async function NotFound() {
  const site = await getLiveSiteData();
  const t = site.ui.notFound;

  return (
    <main data-gv-404 className="relative min-h-[100dvh] overflow-hidden bg-paper flex flex-col items-center justify-center px-6 text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(110% 70% at 50% 40%, rgba(250,243,222,0.95) 0%, rgba(245,235,208,0) 65%)" }}
      />

      <Link href="/" className="absolute top-[max(18px,env(safe-area-inset-top))] left-1/2 -translate-x-1/2" aria-label="G.VIISUALS home">
        <Image src="/assets/img/logo.png" alt="GV" width={56} height={40} className="h-8 w-auto" priority />
      </Link>

      <div className="relative">
        <p
          aria-hidden="true"
          className="font-serif italic leading-none tracking-[-0.04em] text-[clamp(7rem,34vw,15rem)] text-ink/90 select-none"
        >
          {t.code}
        </p>
        <span className="block mx-auto mt-2 h-px w-16 bg-line" />
      </div>

      <h1 className="relative mt-8 font-serif text-3xl md:text-5xl tracking-tight text-ink leading-[1.1] max-w-xl">
        {t.title}
      </h1>
      <p className="relative mt-4 text-ink-70 max-w-md leading-relaxed">{t.text}</p>

      <Link
        href="/"
        className="glass-btn relative mt-10 h-11 px-6 gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M11 19l-7-7 7-7" />
        </svg>
        {t.button}
      </Link>
    </main>
  );
}
