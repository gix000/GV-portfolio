import { NextResponse } from "next/server";
import { getLiveSiteData } from "@/lib/siteDataServer";

// Public (no-auth) endpoint used by the live portfolio pages: the Supabase
// `site_data` row merged over the compiled defaults.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(await getLiveSiteData());
}
