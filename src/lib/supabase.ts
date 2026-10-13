import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

// The single row id we use to store the whole site data blob.
export const SITE_DATA_ROW_ID = "site_data_v1";

export interface SiteDataRow {
  id: string;
  data: unknown;
  updated_at: string;
}