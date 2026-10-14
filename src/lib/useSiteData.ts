"use client";

import { useEffect, useState } from "react";
import { siteData as defaultSiteData, type SiteData, type Project } from "@/lib/data";

// Client-side hook that fetches the live site data from /api/site (which
// reads Supabase with a fallback to compiled defaults). Components call this
// instead of importing the static `siteData` so admin edits show up on the
// live site without a rebuild/redeploy.
export function useSiteData(): { data: SiteData; loading: boolean } {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json) return;
        // Merge on top of defaults so any field the admin hasn't set still
        // resolves to a sensible value rather than undefined.
        setData({
          ...defaultSiteData,
          ...json,
          hero: { ...defaultSiteData.hero, ...(json.hero ?? {}) },
          about: { ...defaultSiteData.about, ...(json.about ?? {}) },
          works: { ...defaultSiteData.works, ...(json.works ?? {}) },
          contact: { ...defaultSiteData.contact, ...(json.contact ?? {}) },
          meta: { ...defaultSiteData.meta, ...(json.meta ?? {}) },
          projects: Array.isArray(json.projects) ? json.projects : defaultSiteData.projects,
        });
      })
      .catch(() => {
        // Network failure — keep the compiled defaults already in state.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}

export function useProject(key: string | undefined): { project: Project | undefined; loading: boolean } {
  const { data, loading } = useSiteData();
  if (!key) return { project: undefined, loading };
  return { project: data.projects.find((p) => p.key === key), loading };
}

export type { SiteData, Project };