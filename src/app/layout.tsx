import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { getLiveSiteData } from "@/lib/siteDataServer";
import { SiteDataProvider } from "@/lib/useSiteData";
import { siteJsonLd, shareImage, ldJson } from "@/lib/structuredData";
import { SITE_URL } from "@/lib/siteUrl";

// Pages are pre-rendered and served from Vercel's edge cache (fast first
// paint, no per-visit database call). Every admin save calls revalidatePath,
// so edits still go live within a second or two; the hourly revalidate is
// only a safety net.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getLiveSiteData();
  const { meta } = site;
  const image = shareImage(site);
  const images = image ? [{ url: image, width: 1200, height: 630, alt: meta.title }] : undefined;
  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    authors: [{ name: site.hero.topLeft || "George Charbel", url: SITE_URL }],
    creator: site.hero.topLeft || "George Charbel",
    keywords: [
      "brand identity designer Beirut",
      "graphic designer Lebanon",
      "packaging design Lebanon",
      "bilingual Arabic English branding",
      "logo designer Beirut",
      "G.VIISUALS",
      "George Charbel",
    ],
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    verification: {
      google: meta.googleVerification || undefined,
      other: meta.bingVerification ? { "msvalidate.01": meta.bingVerification } : undefined,
    },
    openGraph: {
      type: "website",
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/`,
      images,
      siteName: site.hero.studio || "G.VIISUALS",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: images?.map((i) => i.url),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getLiveSiteData();
  const jsonLd = siteJsonLd(siteData);
  return (
    <html lang="en">
      <head>
        {/* Google Fonts via CDN - bypasses next/font/lightningcss entirely */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM summary" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Hanken+Grotesk:wght@300..800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }}
        />
      </head>
      <body
        style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          ["--font-serif" as string]: "'Fraunces', serif",
          ["--font-sans" as string]: "'Hanken Grotesk', sans-serif",
        }}
      >
        <SiteDataProvider value={siteData}>
        <ErrorBoundary>
          <LoadingScreen />
          <ScrollToTop />
          <SmoothScroll>
            <CustomCursor />
            <div className="grain" aria-hidden="true" />
            {children}
          </SmoothScroll>
        </ErrorBoundary>
        </SiteDataProvider>
      </body>
    </html>
  );
}