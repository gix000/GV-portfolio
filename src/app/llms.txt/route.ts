import { getLiveSiteData } from "@/lib/siteDataServer";
import { SITE_URL } from "@/lib/siteUrl";

// Plain-text summary for AI assistants (llms.txt convention), generated from
// the same live data as the site so it never goes stale.
export const revalidate = 3600;

const strip = (html: string) => html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

export async function GET() {
  const site = await getLiveSiteData();
  const name = site.hero.topLeft || "George Charbel";
  const studio = site.hero.studio || "G.VIISUALS";
  const profiles = [site.contact.instagramUrl, ...(site.contact.profiles || [])].filter(Boolean);

  const lines: string[] = [
    `# ${studio} — ${name}`,
    "",
    `> ${studio} is the brand identity and packaging design studio of ${name}, a graphic and brand identity designer based in ${site.hero.basedIn || "Beirut, Lebanon"}. Specialities: bilingual Arabic–Latin brand identities, packaging, logo design, social media design and UI/UX. Works with clients in Lebanon, the Middle East and worldwide.`,
    "",
    strip(site.about.lead),
    "",
    ...site.about.paragraphs.map(strip),
    "",
    "## Services",
    ...site.about.services.map((s) => `- ${s}`),
    "",
    "## Contact",
    `- Website: ${SITE_URL}/`,
    `- Email: ${site.contact.email}`,
    site.contact.whatsapp ? `- WhatsApp: https://wa.me/${site.contact.whatsapp}` : "",
    ...profiles.map((p) => `- Profile: ${p}`),
    "",
    "## Selected brand identity & packaging work",
    ...site.projects.map(
      (p) => `- [${p.name}](${SITE_URL}/projects/${p.key}): ${p.cat}. ${p.quote || p.sub || ""}`.trim(),
    ),
    "",
    "## UI/UX redesign concepts (interactive prototypes)",
    ...site.uiuxVideos.map((v) => {
      const proto = v.redesignUrl ? `${SITE_URL}${v.redesignUrl}` : `${SITE_URL}/ui-ux`;
      return `- [${v.title}](${proto}): ${v.description}`;
    }),
    "",
    "## FAQ",
    ...site.faq.flatMap((f) => [`### ${f.q}`, f.a, ""]),
  ];

  return new Response(lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
