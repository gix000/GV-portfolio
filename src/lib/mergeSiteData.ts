import { siteData as defaults, type SiteData, type UiText } from "@/lib/data";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);

// Layer the saved admin data over the compiled defaults so any field the
// admin hasn't touched (or that a newer version of the site added) still
// resolves to a sensible value instead of undefined.
export function mergeSiteData(raw: unknown): SiteData {
  const r = isObj(raw) ? raw : {};
  const section = <K extends keyof SiteData>(k: K): SiteData[K] =>
    ({ ...(defaults[k] as Obj), ...(isObj(r[k]) ? (r[k] as Obj) : {}) }) as SiteData[K];

  const rawUi = isObj(r.ui) ? r.ui : {};
  const ui = Object.fromEntries(
    Object.entries(defaults.ui).map(([k, v]) => [
      k,
      { ...(v as Obj), ...(isObj(rawUi[k]) ? (rawUi[k] as Obj) : {}) },
    ]),
  ) as unknown as UiText;

  return {
    meta: section("meta"),
    hero: section("hero"),
    about: section("about"),
    works: section("works"),
    contact: section("contact"),
    projects: Array.isArray(r.projects) ? (r.projects as SiteData["projects"]) : defaults.projects,
    uiuxVideos: Array.isArray(r.uiuxVideos)
      ? (r.uiuxVideos as SiteData["uiuxVideos"])
      : defaults.uiuxVideos,
    ui,
  };
}
