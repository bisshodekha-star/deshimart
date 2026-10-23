import { NextResponse } from "next/server";
import { clearCookie } from "@/lib/auth";

/** POST /api/admin/logout — লগআউট */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearCookie());
  return res;
}
