"use client";

import { createContext, createElement, useContext, type ReactNode } from "react";
import { siteData as defaultSiteData, type SiteData, type Project } from "@/lib/data";
import { mergeSiteData } from "@/lib/mergeSiteData";

// The root layout reads the live site data (Supabase merged over defaults) on
// the server and hands it down here, so every page renders the admin's text
// on first paint - no flash of the old defaults, no client fetch.
const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({ value, children }: { value: SiteData; children: ReactNode }) {
  return createElement(SiteDataContext.Provider, { value }, children);
}

export function useSiteData(): { data: SiteData; loading: boolean } {
  const ctx = useContext(SiteDataContext);
  return { data: ctx ?? mergeSiteData(defaultSiteData), loading: false };
}

export function useProject(key: string | undefined): { project: Project | undefined; loading: boolean } {
  const { data, loading } = useSiteData();
  if (!key) return { project: undefined, loading };
  return { project: data.projects.find((p) => p.key === key), loading };
}

export type { SiteData, Project };
