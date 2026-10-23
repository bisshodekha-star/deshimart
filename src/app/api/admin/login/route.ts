import { NextRequest, NextResponse } from "next/server";
import { checkPassword, sessionCookie, isUsingDefaultPassword } from "@/lib/auth";

/** POST /api/admin/login — পাসওয়ার্ড দিয়ে লগইন */
export async function POST(req: NextRequest) {
  try {
    const { password } = (await req.json()) as { password?: string };
    if (!password) {
      return NextResponse.json({ error: "পাসওয়ার্ড দিন" }, { status: 400 });
    }
    if (!checkPassword(password)) {
      return NextResponse.json({ error: "পাসওয়ার্ড সঠিক নয়" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, defaultPassword: isUsingDefaultPassword() });
    res.cookies.set(sessionCookie());
    return res;
  } catch {
    return NextResponse.json({ error: "লগইন করা যায়নি, আবার চেষ্টা করুন" }, { status: 500 });
  }
}
