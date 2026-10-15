import { NextResponse } from "next/server";
import { siteData as defaultSiteData } from "@/lib/data";
import { getSupabase, SITE_DATA_ROW_ID } from "@/lib/supabase";

// Public (no-auth) endpoint used by the live portfolio pages. Reads the
// Supabase `site_data` row and falls back to the compiled defaults if
// Supabase is misconfigured, unreachable, or the row is empty - so the
// public site always renders something even before the first admin save.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_data")
      .select("data")
      .eq("id", SITE_DATA_ROW_ID)
      .maybeSingle();

    if (error) {
      console.error("[/api/site] Supabase read error:", error.message);
      return NextResponse.json(defaultSiteData);
    }
    if (
      !data ||
      !data.data ||
      (typeof data.data === "object" &&
        Object.keys(data.data as object).length === 0)
    ) {
      return NextResponse.json(defaultSiteData);
    }
    // Merge defaults underneath so any field the admin hasn't touched yet
    // still resolves to a sensible value rather than undefined.
    return NextResponse.json({ ...defaultSiteData, ...(data.data as object) });
  } catch (e) {
    console.error("[/api/site] serving compiled defaults:", String(e));
    return NextResponse.json(defaultSiteData);
  }
}