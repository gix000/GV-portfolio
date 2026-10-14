import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
let initError: string | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  if (initError) throw new Error(initError);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    initError =
      "Missing Supabase env vars on Vercel: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Settings → Environment Variables, then redeploy.";
    throw new Error(initError);
  }

  // Validate that the URL looks like a real Supabase API endpoint, not the dashboard
  if (!url.includes(".supabase.co")) {
    initError =
      "NEXT_PUBLIC_SUPABASE_URL is wrong — it must be your project API URL (https://xxxxx.supabase.co), not the Supabase dashboard URL. Go to Supabase → Settings → API → Project URL and copy that.";
    throw new Error(initError);
  }

  try {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return client;
  } catch (e) {
    initError = `Supabase client init failed: ${String(e)}`;
    throw new Error(initError);
  }
}

export function getSupabaseStatus(): { ok: boolean; error?: string } {
  try {
    getSupabase();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// The single row id we use to store the whole site data blob.
export const SITE_DATA_ROW_ID = "site_data_v1";

export interface SiteDataRow {
  id: string;
  data: unknown;
  updated_at: string;
}