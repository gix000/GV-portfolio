import type { SiteData, Project } from "@/lib/data";
import { SITE_URL } from "@/lib/siteUrl";

const abs = (src?: string) => (!src ? undefined : src.startsWith("http") ? src : `${SITE_URL}${src}`);
const strip = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const PERSON_ID = `${SITE_URL}/#george`;
const STUDIO_ID = `${SITE_URL}/#studio`;
const SITE_ID = `${SITE_URL}/#website`;

export function shareImage(site: SiteData): string | undefined {
  return abs(site.meta.ogImage || site.projects.find((p) => p.cover)?.cover);
}

// One connected graph: the designer, the studio, the website and the FAQ,
// so search engines and AI assistants read them as the same entity.
export function siteJsonLd(site: SiteData) {
  const profiles = [site.contact.instagramUrl, ...(site.contact.profiles || [])].filter(Boolean);
  const services = site.about.services.filter(Boolean);
  const studioName = site.hero.studio || "G.VIISUALS";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: site.hero.topLeft || "George Charbel",
        jobTitle: "Graphic & Brand Identity Designer",
        description: strip(site.about.lead),
        image: abs(site.ui.about.portrait),
        url: `${SITE_URL}/`,
        email: `mailto:${site.contact.email}`,
        worksFor: { "@id": STUDIO_ID },
        address: { "@type": "PostalAddress", addressLocality: "Beirut", addressCountry: "LB" },
        knowsLanguage: ["en", "ar"],
        knowsAbout: [...services, "Bilingual Arabic–Latin typography", "Packaging design", "Brand strategy"],
        sameAs: profiles,
      },
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": STUDIO_ID,
        name: studioName,
        alternateName: ["GViisuals", "G VIISUALS", "GV Visuals"],
        description: site.meta.description,
        url: `${SITE_URL}/`,
        logo: abs("/assets/img/logo.png"),
        image: shareImage(site),
        email: site.contact.email,
        telephone: site.contact.phoneTel,
        founder: { "@id": PERSON_ID },
        address: { "@type": "PostalAddress", addressLocality: "Beirut", addressCountry: "LB" },
        areaServed: ["Lebanon", "Middle East", "Worldwide"],
        knowsLanguage: ["en", "ar"],
        sameAs: profiles,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Design services",
          itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
        },
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: `${SITE_URL}/`,
        name: studioName,
        description: site.meta.description,
        publisher: { "@id": STUDIO_ID },
        inLanguage: "en",
      },
      ...(site.faq.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${SITE_URL}/#faq`,
              mainEntity: site.faq
                .filter((f) => f.q && f.a)
                .map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ]
        : []),
    ],
  };
}

// Each case study as a piece of creative work by George / the studio.
export function projectJsonLd(site: SiteData, project: Project) {
  const url = `${SITE_URL}/projects/${project.key}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: project.name,
        headline: project.sub || project.name,
        description: project.desc,
        abstract: project.quote,
        url,
        image: [project.cover, ...project.gallery].filter(Boolean).slice(0, 8).map(abs),
        genre: project.cat,
        keywords: project.tags.join(", "),
        creator: { "@id": PERSON_ID },
        publisher: { "@id": STUDIO_ID },
        isPartOf: { "@id": SITE_ID },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.hero.studio || "G.VIISUALS", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Works", item: `${SITE_URL}/#works` },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };
}

// Safe for <script type="application/ld+json">.
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
