import { NextResponse } from "next/server";
import { isUsingDefaultPassword } from "@/lib/auth";

/** GET /api/admin/session — কনফিগ স্ট্যাটাস (ডিফল্ট পাসওয়ার্ড কিনা) */
export async function GET() {
  return NextResponse.json({
    defaultPassword: isUsingDefaultPassword(),
  });
}
