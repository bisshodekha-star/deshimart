/**
 * দোকানের ব্র্যান্ড ইনফো — কোড না বদলেই প্রতিটি ক্লায়েন্টের দোকানের নাম বদলানো যায়।
 *
 * Vercel → Settings → Environment Variables-এ দিন:
 *   NEXT_PUBLIC_STORE_NAME    = আপনার দোকানের নাম (যেমন: রাহাত স্টোর)
 *   NEXT_PUBLIC_STORE_TAGLINE = ছোট ট্যাগলাইন (যেমন: ঘরে ঘরে বিশ্বস্ত সেবা)
 *
 * না দিলে ডিফল্ট "দেশিমার্ট" দেখাবে। নাম বদলানোর পর Vercel-এ একবার
 * Redeploy করতে হবে (Deployments → সর্বশেষ ডিপ্লয়ের ⋯ মেনু → Redeploy)।
 */
export const STORE_NAME =
  process.env.NEXT_PUBLIC_STORE_NAME?.trim() || "দেশিমার্ট";

export const STORE_TAGLINE =
  process.env.NEXT_PUBLIC_STORE_TAGLINE?.trim() || "বিশ্বস্ত অনলাইন শপ";
