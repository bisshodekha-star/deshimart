"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Truck,
  Loader2,
  CheckCircle2,
  Banknote,
  Smartphone as PhoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/store";
import { price, enToBn, DELIVERY_FEE, FREE_DELIVERY_MIN } from "@/lib/format";
import type { Order } from "@/lib/types";
import type { View } from "./view-types";

// ===================== CART =====================
export function CartView({ navigate }: { navigate: (v: View) => void }) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = subtotal >= FREE_DELIVERY_MIN || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-stone-100">
          <ShoppingBag className="size-9 text-stone-300" />
        </span>
        <h1 className="font-heading text-2xl font-bold text-stone-900">কার্ট খালি!</h1>
        <p className="text-sm text-muted-foreground">
          পছন্দের পণ্য কার্টে যোগ করে এখানে ফিরে আসুন
        </p>
        <Button
          size="lg"
          className="bg-emerald-700 font-bold hover:bg-emerald-800"
          onClick={() => navigate("shop")}
        >
          শপিং শুরু করুন
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1.5 text-stone-600"
        onClick={() => navigate("shop")}
      >
        <ArrowLeft className="size-4" />
        আরও শপিং করুন
      </Button>
      <h1 className="mt-2 font-heading text-2xl font-bold text-stone-900 md:text-3xl">
        আপনার কার্ট ({enToBn(items.length)}টি পণ্য)
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-2xl border bg-white p-3.5 shadow-sm"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:size-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 font-semibold text-stone-800">{item.name}</p>
                  <button
                    onClick={() => remove(item.productId)}
                    className="shrink-0 rounded-full p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label={`${item.name} মুছুন`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {price(item.price)} × {enToBn(item.quantity)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 rounded-full border px-1.5 py-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => setQty(item.productId, item.quantity - 1)}
                      aria-label="কমান"
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-7 text-center text-sm font-bold">
                      {enToBn(item.quantity)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => setQty(item.productId, item.quantity + 1)}
                      aria-label="বাড়ান"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <p className="font-heading text-lg font-bold text-emerald-800">
                    {price(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-heading text-lg font-bold text-stone-900">অর্ডার সামারি</h2>
          <div className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>সাবটোটাল</span>
              <span className="font-semibold text-stone-800">{price(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>ডেলিভারি চার্জ</span>
              {delivery === 0 ? (
                <span className="font-bold text-emerald-600">ফ্রি!</span>
              ) : (
                <span className="font-semibold text-stone-800">{price(delivery)}</span>
              )}
            </div>
            {delivery > 0 && (
              <p className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                <Truck className="size-3.5 shrink-0" />
                আর {price(FREE_DELIVERY_MIN - subtotal)} কিনলেই ফ্রি ডেলিভারি!
              </p>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800">সর্বমোট</span>
            <span className="font-heading text-2xl font-extrabold text-emerald-800">
              {price(total)}
            </span>
          </div>
          <Button
            size="lg"
            className="mt-5 w-full bg-emerald-700 font-bold hover:bg-emerald-800"
            onClick={() => navigate("checkout")}
          >
            চেকআউট করুন
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            ক্যাশ অন ডেলিভারি ও বিকাশ — দুটোই সাপোর্টেড
          </p>
        </div>
      </div>
    </div>
  );
}

// ===================== CHECKOUT =====================
export function CheckoutView({ navigate }: { navigate: (v: View) => void }) {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "নাম লিখুন";
    if (!/^01[3-9]\d{8}$/.test(phone.trim()))
      e.phone = "সঠিক ১১ ডিজিটের নম্বর দিন (যেমন: 01712345678)";
    if (address.trim().length < 10) e.address = "বিস্তারিত ঠিকানা লিখুন (কমপক্ষে ১০ অক্ষর)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          note,
          paymentMethod: payment,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "অর্ডার হয়নি", description: data.error, variant: "destructive" });
        return;
      }
      clear();
      sessionStorage.setItem("deshimart-last-order", JSON.stringify(data));
      navigate("success");
    } catch {
      toast({
        title: "সমস্যা হয়েছে",
        description: "ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-10 text-stone-300" />
        <p className="mt-4 font-semibold text-stone-700">চেকআউট করতে অন্তত একটি পণ্য দরকার</p>
        <Button className="mt-4 bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("shop")}>
          শপে যান
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1.5 text-stone-600"
        onClick={() => navigate("cart")}
      >
        <ArrowLeft className="size-4" />
        কার্টে ফিরে যান
      </Button>
      <h1 className="mt-2 font-heading text-2xl font-bold text-stone-900 md:text-3xl">
        চেকআউট
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                আপনার নাম <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মোঃ রহিম উদ্দিন"
                className="border-stone-200"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">
                মোবাইল নম্বর <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="01XXXXXXXXX"
                maxLength={11}
                className="border-stone-200"
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">
              ডেলিভারি ঠিকানা <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="গ্রাম/মহল্লা, রোড, থানা, জেলা..."
              rows={3}
              className="border-stone-200"
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">অতিরিক্ত নোট (ঐচ্ছিক)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="যেমন: বিকাল ৫টার পরে কল করবেন"
              className="border-stone-200"
            />
          </div>

          {/* Payment */}
          <div className="space-y-2.5">
            <Label>পেমেন্ট মেথড</Label>
            <RadioGroup value={payment} onValueChange={setPayment} className="grid gap-3 sm:grid-cols-2">
              <Label
                htmlFor="pay-cod"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                  payment === "cod" ? "border-emerald-600 bg-emerald-50" : "border-stone-200"
                }`}
              >
                <RadioGroupItem value="cod" id="pay-cod" />
                <Banknote className="size-5 text-emerald-700" />
                <div>
                  <p className="font-semibold text-stone-800">ক্যাশ অন ডেলিভারি</p>
                  <p className="text-xs text-muted-foreground">পণ্য পেয়ে টাকা দিন</p>
                </div>
              </Label>
              <Label
                htmlFor="pay-bkash"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                  payment === "bkash" ? "border-emerald-600 bg-emerald-50" : "border-stone-200"
                }`}
              >
                <RadioGroupItem value="bkash" id="pay-bkash" />
                <PhoneIcon className="size-5 text-pink-600" />
                <div>
                  <p className="font-semibold text-stone-800">বিকাশ</p>
                  <p className="text-xs text-muted-foreground">অ্যাডভান্স পেমেন্ট</p>
                </div>
              </Label>
            </RadioGroup>
          </div>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-heading text-lg font-bold text-stone-900">অর্ডার সামারি</h2>
          <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.productId} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  <Image src={i.image} alt={i.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-sm font-medium text-stone-700">{i.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {enToBn(i.quantity)} × {price(i.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-stone-800">{price(i.price * i.quantity)}</p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>সাবটোটাল</span>
              <span className="font-semibold text-stone-800">{price(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>ডেলিভারি চার্জ</span>
              {delivery === 0 ? (
                <span className="font-bold text-emerald-600">ফ্রি!</span>
              ) : (
                <span className="font-semibold text-stone-800">{price(delivery)}</span>
              )}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800">সর্বমোট</span>
            <span className="font-heading text-2xl font-extrabold text-emerald-800">
              {price(total)}
            </span>
          </div>
          <Button
            size="lg"
            className="mt-5 w-full bg-emerald-700 font-bold hover:bg-emerald-800"
            disabled={loading}
            onClick={submit}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                প্রসেস হচ্ছে...
              </>
            ) : (
              "অর্ডার কনফার্ম করুন"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===================== ORDER SUCCESS =====================
export function SuccessView({
  navigate,
}: {
  navigate: (v: View) => void;
}) {
  let order: Order | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem("deshimart-last-order");
      if (raw) order = JSON.parse(raw);
    } catch {
      order = null;
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="size-11 text-emerald-600" />
      </span>
      <h1 className="mt-5 font-heading text-3xl font-bold text-stone-900">
        ধন্যবাদ! অর্ডার সফল হয়েছে
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        আমরা আপনার অর্ডার পেয়ে গেছি। শীঘ্রই আমাদের প্রতিনিধি ফোন করে কনফার্ম করবেন।
      </p>

      {order && (
        <div className="mt-6 rounded-2xl border bg-white p-5 text-left shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">অর্ডার নম্বর</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-sm font-bold text-emerald-800">
              {order.orderNo}
            </span>
          </div>
          <Separator className="my-3.5" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">নাম</span>
              <span className="font-semibold text-stone-800">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">মোবাইল</span>
              <span className="font-semibold text-stone-800">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">পেমেন্ট</span>
              <span className="font-semibold text-stone-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">মোট পরিমাণ</span>
              <span className="font-heading text-lg font-extrabold text-emerald-800">
                {price(order.total)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          size="lg"
          className="bg-emerald-700 font-bold hover:bg-emerald-800"
          onClick={() => navigate("orders")}
        >
          অর্ডার ট্র্যাক করুন
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate("shop")}>
          শপিং চালিয়ে যান
        </Button>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        টিপস: বেল আইকনে ক্লিক করে দেখুন — অ্যাডমিন পক্ষে আপনার অর্ডারের নোটিফিকেশন এসে গেছে!
      </p>
    </div>
  );
}
