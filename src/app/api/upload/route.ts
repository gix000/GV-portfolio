import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gv2026admin";
const BUCKET = "portfolio-images";

function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const fileName = `${timestamp}-${random}.${ext}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = () =>
      supabase.storage.from(BUCKET).upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: "31536000",
      });

    let { data, error } = await upload();

    // First upload on a fresh Supabase project: the bucket doesn't exist yet.
    // Create it as a public image bucket and retry once.
    if (error && /bucket not found|not found/i.test(error.message)) {
      const { error: createError } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
        allowedMimeTypes: allowedTypes,
      });
      if (createError && !/already exists/i.test(createError.message)) {
        return NextResponse.json(
          { error: `Couldn't create the "${BUCKET}" storage bucket: ${createError.message}` },
          { status: 500 },
        );
      }
      ({ data, error } = await upload());
    }

    if (error) {
      console.error("Supabase storage upload error:", error.message);
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data!.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data!.path,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}