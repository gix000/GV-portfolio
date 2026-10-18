import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

// The admin password lives only in the ADMIN_PASSWORD environment variable on
// Vercel. There is deliberately no fallback: a default written in this (public)
// repo would let anyone into /admin.
export function adminPasswordConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8;
}

export function verifyAdmin(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) return false;
  const header = req.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice(7));
  const want = Buffer.from(expected);
  // Constant-time compare so the password can't be guessed by timing.
  return given.length === want.length && timingSafeEqual(given, want);
}

export const NOT_CONFIGURED_MESSAGE =
  "Admin is locked: set ADMIN_PASSWORD (8+ characters) in Vercel → Settings → Environment Variables, then redeploy.";
