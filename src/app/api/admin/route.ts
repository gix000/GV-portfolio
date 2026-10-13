import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "lib", "data.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gv2026admin";

// Helper to read current data
async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    // If JSON doesn't exist yet, return null (will use TS fallback)
    return null;
  }
}

// Helper to write data
async function writeData(data: unknown) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Verify password from header
function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return token === ADMIN_PASSWORD;
}

// GET — return all site data
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readData();
  if (!data) {
    return NextResponse.json({ error: "No data file found. Run initial setup." }, { status: 404 });
  }
  return NextResponse.json(data);
}

// POST — update site data (full replace or partial merge)
export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { action, payload } = body;

    const current = await readData() || {};

    switch (action) {
      case "update_project": {
        // payload: { key, data }
        const idx = current.projects?.findIndex((p: { key: string }) => p.key === payload.key);
        if (idx === -1) {
          current.projects = current.projects || [];
          current.projects.push(payload.data);
        } else {
          current.projects[idx] = payload.data;
        }
        break;
      }
      case "delete_project": {
        // payload: { key }
        current.projects = (current.projects || []).filter((p: { key: string }) => p.key !== payload.key);
        break;
      }
      case "update_meta": {
        current.meta = { ...current.meta, ...payload };
        break;
      }
      case "update_hero": {
        current.hero = { ...current.hero, ...payload };
        break;
      }
      case "update_about": {
        current.about = { ...current.about, ...payload };
        break;
      }
      case "update_contact": {
        current.contact = { ...current.contact, ...payload };
        break;
      }
      case "full_replace": {
        Object.assign(current, payload);
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    await writeData(current);
    return NextResponse.json({ success: true, data: current });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE — delete a project by key
export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const current = await readData();
  if (!current) return NextResponse.json({ error: "No data" }, { status: 404 });

  current.projects = (current.projects || []).filter((p: { key: string }) => p.key !== key);
  await writeData(current);
  return NextResponse.json({ success: true });
}