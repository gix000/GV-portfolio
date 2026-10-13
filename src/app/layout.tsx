import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { siteData } from "@/lib/data";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

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
    <html lang="en" className={`${fraunces.variable} ${hanken.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll>
          <CustomCursor />
          <div className="grain" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}