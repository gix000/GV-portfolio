import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { siteData } from "@/lib/data";

export const metadata: Metadata = {
  title: siteData.meta.title,
  description: siteData.meta.description,
  metadataBase: new URL("https://gviisuals.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: siteData.meta.title,
    description: siteData.meta.description,
    url: "https://gviisuals.com/",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    siteName: "G.VIISUALS",
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.meta.title,
    description: siteData.meta.description,
    images: ["/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "G.VIISUALS",
  alternateName: "George Charbel",
  description:
    "Graphic and brand identity design studio. Branding, packaging and social design.",
  url: "https://gviisuals.com/",
  email: siteData.contact.email,
  founder: {
    "@type": "Person",
    name: "George Charbel",
    jobTitle: "Graphic & Brand Identity Designer",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Beirut",
    addressCountry: "LB",
  },
  sameAs: [siteData.contact.instagramUrl],
  knowsAbout: [
    "Brand Identity",
    "Logo Design",
    "Packaging Design",
    "Social Media Design",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts via CDN — bypasses next/font/lightningcss entirely */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Hanken+Grotesk:wght@300..800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          ["--font-serif" as string]: "'Fraunces', serif",
          ["--font-sans" as string]: "'Hanken Grotesk', sans-serif",
        }}
      >
        <ErrorBoundary>
          <LoadingScreen />
          <ScrollToTop />
          <SmoothScroll>
            <CustomCursor />
            <div className="grain" aria-hidden="true" />
            {children}
          </SmoothScroll>
        </ErrorBoundary>
      </body>
    </html>
  );
}