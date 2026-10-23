"use client";

import { ShoppingCart, MapPin, Phone, Mail, Heart, HandCoins, Smartphone } from "lucide-react";
import type { View } from "./view-types";
import { STORE_NAME } from "@/lib/store-info";

export function SiteFooter({ navigate }: { navigate: (v: View) => void }) {
  const links: { label: string; view: View }[] = [
    { label: "হোম", view: "home" },
    { label: "শপ", view: "shop" },
    { label: "অর্ডার ট্র্যাক", view: "orders" },
    { label: "কার্ট", view: "cart" },
    { label: "অ্যাডমিন প্যানেল", view: "admin" },
  ];

  return (
    <footer className="mt-auto bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        {/* brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 shadow-md">
              <ShoppingCart className="size-5 text-white" />
            </span>
            <span className="font-heading text-xl font-bold">{STORE_NAME}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-emerald-200/80">
            বাংলাদেশের বিশ্বস্ত অনলাইন শপ। ১০০% অরিজিনাল পণ্য, সারাদেশে দ্রুত ডেলিভারি আর
            ২৪/৭ AI সহকারী — সব এক ঠিকানায়।
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/60 bg-emerald-900/50 px-3 py-1 text-xs">
              <HandCoins className="size-3.5 text-amber-300" />
              ক্যাশ অন ডেলিভারি
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/60 bg-emerald-900/50 px-3 py-1 text-xs">
              <Smartphone className="size-3.5 text-pink-300" />
              বিকাশ
            </span>
          </div>
        </div>

        {/* quick links */}
        <div>
          <h3 className="font-heading text-base font-bold">কুইক লিংক</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.view}>
                <button
                  onClick={() => navigate(l.view)}
                  className="text-emerald-200/80 transition-colors hover:text-amber-300"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div>
          <h3 className="font-heading text-base font-bold">যোগাযোগ</h3>
          <ul className="mt-3 space-y-2.5 text-sm text-emerald-200/80">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-amber-300" />
              ধানমন্ডি, ঢাকা-১২০৫, বাংলাদেশ
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-amber-300" />
              হটলাইন: ০১৭১১-০০০০০০
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-amber-300" />
              hello@deshimart.example
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1.5 px-4 py-4 text-xs text-emerald-300/70 sm:flex-row">
          <p>© ২০২৬ {STORE_NAME} — সর্বস্বত্ব সংরক্ষিত</p>
          <p className="flex items-center gap-1">
            বাংলাদেশে
            <Heart className="size-3.5 fill-red-400 text-red-400" />
            দিয়ে তৈরি
          </p>
        </div>
      </div>
    </footer>
  );
}
