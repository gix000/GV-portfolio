import { NextRequest, NextResponse } from "next/server";
import { getSupabase, SITE_DATA_ROW_ID } from "@/lib/supabase";
import { siteData as defaultSiteData } from "@/lib/data";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gv2026admin";

function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return token === ADMIN_PASSWORD;
}

// Read the site data blob from Supabase; fall back to the compiled default
// if Supabase is misconfigured, unreachable, or no row exists yet.
async function readData() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_data")
      .select("data")
      .eq("id", SITE_DATA_ROW_ID)
      .maybeSingle();

    if (error) {
      console.error("Supabase read error:", error.message);
      return { ...defaultSiteData };
    }
    if (!data || !data.data || (typeof data.data === "object" && Object.keys(data.data as object).length === 0)) {
      return { ...defaultSiteData };
    }
    return data.data;
  } catch (e) {
    // Supabase client init failed (missing/wrong env vars) - serve defaults
    // so the public site never crashes. The admin panel will surface the error.
    console.error("Supabase unavailable, serving compiled defaults:", String(e));
    return { ...defaultSiteData };
  }
}

// Strict read for writes: never build a save on top of the compiled defaults
// because of a transient read error - that would wipe every admin edit.
async function readDataForWrite(): Promise<Record<string, unknown>> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("site_data")
    .select("data")
    .eq("id", SITE_DATA_ROW_ID)
    .maybeSingle();
  if (error) throw new Error(explain(error.message));
  const blob = data?.data as Record<string, unknown> | undefined;
  if (!blob || Object.keys(blob).length === 0) {
    return JSON.parse(JSON.stringify(defaultSiteData));
  }
  return blob;
}

function explain(msg: string): string {
  if (/row-level security|permission denied|42501/i.test(msg)) {
    return `${msg} - SUPABASE_SERVICE_ROLE_KEY on Vercel is not the service_role key (it looks like the anon key). Copy the service_role secret from Supabase → Settings → API, update it on Vercel, then redeploy.`;
  }
  if (/relation .*site_data.* does not exist|could not find the table/i.test(msg)) {
    return `${msg} - the site_data table is missing in Supabase.`;
  }
  return msg;
}

async function writeData(data: unknown) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("site_data")
    .upsert(
      { id: SITE_DATA_ROW_ID, data, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );
  if (error) throw new Error(explain(error.message));
}

export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { action, payload } = body;
    const current = await readDataForWrite();

    switch (action) {
      case "update_project": {
        const projects = (current.projects as Array<{ key: string }>) || [];
        const idx = projects.findIndex((p) => p.key === payload.key);
        if (idx === -1) {
          current.projects = [...projects, payload.data];
        } else {
          const next = [...projects];
          next[idx] = payload.data;
          current.projects = next;
        }
        break;
      }
      case "delete_project": {
        const projects = (current.projects as Array<{ key: string }>) || [];
        current.projects = projects.filter((p) => p.key !== payload.key);
        break;
      }
      case "update_meta":
        current.meta = { ...(current.meta as object), ...payload };
        break;
      case "update_hero":
        current.hero = { ...(current.hero as object), ...payload };
        break;
      case "update_about":
        current.about = { ...(current.about as object), ...payload };
        break;
      case "update_contact":
        current.contact = { ...(current.contact as object), ...payload };
        break;
      case "full_replace":
        Object.assign(current, payload);
        break;
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    await writeData(current);
    return NextResponse.json({ success: true, data: current });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  try {
    const current = await readDataForWrite();
    const projects = (current.projects as Array<{ key: string }>) || [];
    current.projects = projects.filter((p) => p.key !== key);
    await writeData(current);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}