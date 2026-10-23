import crypto from "crypto";
import type { NextRequest } from "next/server";

/**
 * অ্যাডমিন সেশন — পাসওয়ার্ড-ভিত্তিক সহজ ও নিরাপদ লগইন।
 * পাসওয়ার্ড: ADMIN_PASSWORD env var (না দিলে ডিফল্ট ডেমো পাসওয়ার্ড)।
 * কুকি: HttpOnly, HMAC-signed টোকেন — পাসওয়ার্ড বদলালে পুরনো সেশন অটো বাতিল।
 */

export const ADMIN_COOKIE = "dm_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // ৭ দিন

const DEFAULT_PASSWORD = "deshimart2026"; // ডিফল্ট — ADMIN_PASSWORD না সেট করলে

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_PASSWORD;
}

export function isUsingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD?.trim();
}

export function checkPassword(pw: string): boolean {
  return typeof pw === "string" && pw === adminPassword();
}

/** বর্তমান পাসওয়ার্ড থেকে ডেরাইভ করা সেশন টোকেন */
export function sessionToken(): string {
  return crypto
    .createHmac("sha256", adminPassword())
    .update("deshimart-admin-v1")
    .digest("hex");
}

export function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  // timing-safe comparison
  const expected = sessionToken();
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function sessionCookie() {
  return {
    name: ADMIN_COOKIE,
    value: sessionToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function clearCookie() {
  return {
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
