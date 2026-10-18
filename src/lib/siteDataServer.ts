import { siteData as defaults, type SiteData } from "@/lib/data";
import { getSupabase, SITE_DATA_ROW_ID } from "@/lib/supabase";
import { mergeSiteData } from "@/lib/mergeSiteData";
import { cache } from "react";

// Server-side read of the live site data (Supabase row merged over the
// compiled defaults). Falls back to the defaults if Supabase is unreachable.
// cache(): one Supabase read per request, shared by layout, metadata and pages.
export const getLiveSiteData = cache(async function getLiveSiteData(): Promise<SiteData> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_data")
      .select("data")
      .eq("id", SITE_DATA_ROW_ID)
      .maybeSingle();
    if (error || !data?.data) return mergeSiteData(defaults);
    return mergeSiteData(data.data);
  } catch {
    return mergeSiteData(defaults);
  }
});
