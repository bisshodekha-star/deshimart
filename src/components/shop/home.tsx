"use client";

import Image from "next/image";
import {
  Truck,
  HandCoins,
  RotateCcw,
  BadgeCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  Star,
  Smartphone,
  Shirt,
  Lamp,
  Coffee,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { price, enToBn } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { STORE_NAME } from "@/lib/store-info";
import type { View } from "./view-types";

const CATEGORY_ICONS: Record<string, typeof Smartphone> = {
  Electronics: Smartphone,
  Fashion: Shirt,
  "Home & Living": Lamp,
  Beauty: Sparkles,
  Food: Coffee,
  Bags: Briefcase,
};

const TRUST = [
  { icon: Truck, title: "ফ্রি ডেলিভারি", desc: "৳১,০০০+ অর্ডারে সারাদেশে" },
  { icon: HandCoins, title: "ক্যাশ অন ডেলিভারি", desc: "পণ্য হাতে পেয়ে টাকা দিন" },
  { icon: RotateCcw, title: "সহজ রিটার্ন", desc: "৭ দিনের মধ্যে ফেরত" },
  { icon: BadgeCheck, title: "১০০% অরিজিনাল", desc: "নিশ্চিত কোয়ালিটি পণ্য" },
];

export function HomeView({
  products,
  categories,
  navigate,
  onOpenChat,
}: {
  products: Product[];
  categories: Category[];
  navigate: (v: View) => void;
  onOpenChat: () => void;
}) {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const heroImages = ["smartwatch-pro", "honey", "mug-set"];

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white">
        {/* decorative glows */}
        <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-100">
              <MapPin className="size-3.5" />
              সারা বাংলাদেশে হোম ডেলিভারি
            </span>
            <h1 className="mt-4 font-heading text-4xl font-extrabold leading-snug md:text-5xl md:leading-snug">
              ভরসার জায়গা,
              <br />
              <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                {STORE_NAME}
              </span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-emerald-100/90">
              ইলেকট্রনিক্স থেকে ঘর সাজানো — সব এক ঠিকানায়। ক্যাশ অন ডেলিভারি, ৭ দিনের রিটার্ন
              আর ২৪/৭ AI সহকারীর সাথে শপিং এবার সহজ।
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate("shop")}
                className="bg-amber-400 font-bold text-emerald-950 hover:bg-amber-300"
              >
                এখনই কিনুন
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("orders")}
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                অর্ডার ট্র্যাক করুন
              </Button>
            </div>

            {/* stats */}
            <div className="mt-8 flex divide-x divide-white/15">
              {[
                { n: enToBn(products.length) + "+", l: "নির্বাচিত পণ্য" },
                { n: enToBn(categories.length), l: "ক্যাটাগরি" },
                { n: "২৪/৭", l: "AI সহকারী" },
              ].map((s) => (
                <div key={s.l} className="px-5 first:pl-0">
                  <p className="font-heading text-2xl font-bold text-amber-300">{s.n}</p>
                  <p className="text-xs text-emerald-100/80">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* image collage */}
          <div className="relative mx-auto hidden h-[380px] w-full max-w-md md:block">
            {heroImages.map((slug, i) => {
              const p = products.find((x) => x.image.includes(slug));
              if (!p) return null;
              const pos = [
                "left-0 top-6 rotate-[-6deg] z-10",
                "right-2 top-0 rotate-[5deg]",
                "left-10 bottom-0 rotate-[3deg] z-20",
              ][i];
              return (
                <div
                  key={slug}
                  className={`absolute overflow-hidden rounded-2xl border-4 border-white/90 bg-white shadow-2xl ${pos} w-52 transition-transform hover:scale-105 hover:rotate-0`}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={210}
                    height={210}
                    className="h-52 w-full object-cover"
                  />
                  <div className="px-3 py-2">
                    <p className="truncate text-xs font-semibold text-stone-800">{p.name}</p>
                    <p className="text-xs font-bold text-emerald-700">{price(p.price)}</p>
                  </div>
                </div>
              );
            })}
            <span className="absolute -right-1 top-32 z-30 flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-emerald-950 shadow-lg">
              <Truck className="size-3.5" />
              ফ্রি ডেলিভারি ৳১,০০০+
            </span>
          </div>
        </div>
      </section>

      {/* ============ TRUST BADGES ============ */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <t.icon className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-stone-800">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-stone-900 md:text-3xl">
              ক্যাটাগরি
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              আপনার পছন্দের ক্যাটাগরি বেছে নিন
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => {
            const Icon = CATEGORY_ICONS[c.nameEn] ?? Sparkles;
            const count = products.filter((p) => p.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => navigate("shop")}
                className="group rounded-2xl border bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 transition-colors group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white">
                  <Icon className="size-6" />
                </span>
                <p className="mt-3 text-sm font-bold text-stone-800">{c.name}</p>
                <p className="text-xs text-muted-foreground">{enToBn(count)}টি পণ্য</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="bg-stone-50/80 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-stone-900 md:text-3xl">
                জনপ্রিয় পণ্য
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                কাস্টমারদের সবচেয়ে ভালো লাগা পণ্যগুলো
              </p>
            </div>
            <Button
              variant="ghost"
              className="gap-1 text-emerald-700 hover:text-emerald-800"
              onClick={() => navigate("shop")}
            >
              সব দেখুন
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI ASSISTANT BANNER ============ */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-800 px-6 py-10 text-white md:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles className="size-8 text-amber-300" />
            </span>
            <div className="flex-1">
              <Badge className="mb-2 bg-amber-400 text-emerald-950 hover:bg-amber-400">
                নতুন ফিচার
              </Badge>
              <h3 className="font-heading text-2xl font-bold md:text-3xl">
                AI সহকারী &quot;মেঘ&quot; এখন ২৪/৭ পাশে
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-100/90">
                কোন পণ্য নেবেন, দাম কত, ডেলিভারি কবে — যেকোনো প্রশ্নের উত্তর এখন সাথে সাথে।
                নিচের ডানদিকে চ্যাট বাটনে ক্লিক করেই কথা বলুন!
              </p>
            </div>
            <Button
              size="lg"
              onClick={onOpenChat}
              className="shrink-0 bg-amber-400 font-bold text-emerald-950 hover:bg-amber-300"
            >
              চ্যাট শুরু করুন
              <Sparkles className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-6 text-center font-heading text-2xl font-bold text-stone-900 md:text-3xl">
          কাস্টমাররা যা বলেন
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              name: "রাহাত হোসেন",
              place: "চট্টগ্রাম",
              text: "অর্ডার করার ২ দিনের মধ্যেই পণ্য পেয়ে গেছি। কোয়ালিটি দেখে সত্যিই মুগ্ধ!",
            },
            {
              name: "সুমাইয়া আক্তার",
              place: "ঢাকা",
              text: "AI চ্যাটে জিজ্ঞেস করে দাম জেনে নিয়েছিলাম, ক্যাশ অন ডেলিভারিতে পণ্য নিয়েছি। খুব সুবিধা!",
            },
            {
              name: "মাহমুদুল ইসলাম",
              place: "সিলেট",
              text: "মধুটা একদম খাঁটি। রিটার্ন পলিসিও আছে দেখে নিশ্চিন্তে অর্ডার করতে পারি।",
            },
          ].map((r) => (
            <div key={r.name} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                  {r.name[0]}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-stone-800">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.place}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
