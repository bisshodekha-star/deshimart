"use client";

import { useState } from "react";
import Image from "next/image";
import { PackageSearch, Loader2, Phone, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { price, enToBn, timeAgoBn } from "@/lib/format";
import { statusColor } from "@/lib/types";
import type { Order } from "@/lib/types";

export function OrdersView() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) {
      setError("সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 01712345678)");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone.trim())}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-stone-900 md:text-3xl">
          অর্ডার ট্র্যাক করুন
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          অর্ডার করার সময় ব্যবহার করা মোবাইল নম্বর দিন — আপনার সব অর্ডারের সর্বশেষ স্ট্যাটাস দেখুন
        </p>
      </div>

      {/* search */}
      <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="01XXXXXXXXX"
            maxLength={11}
            inputMode="numeric"
            className="rounded-full border-stone-200 pl-9"
            aria-label="মোবাইল নম্বর"
          />
        </div>
        <Button
          className="rounded-full bg-emerald-700 font-bold hover:bg-emerald-800"
          onClick={search}
          disabled={loading}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "খুঁজুন"}
        </Button>
      </div>
      {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}

      {/* results */}
      {orders && (
        <div className="mt-8 space-y-4">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border bg-white py-14 text-center shadow-sm">
              <PackageSearch className="size-10 text-stone-300" />
              <p className="font-semibold text-stone-700">কোনো অর্ডার পাওয়া যায়নি</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                এই নম্বরে কোনো অর্ডার নেই। নম্বরটি মিলিয়ে নিন অথবা নতুন অর্ডার করুন।
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                {/* header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-stone-50/70 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 font-mono text-sm font-bold text-emerald-800">
                      {order.orderNo}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {timeAgoBn(order.createdAt)}
                  </span>
                </div>

                {/* items */}
                <div className="space-y-3 px-4 py-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        {item.product && (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 leading-tight">
                        <p className="truncate text-sm font-semibold text-stone-800">
                          {item.product?.name ?? "পণ্য"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enToBn(item.quantity)} × {price(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-stone-800">
                        {price(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="line-clamp-1">{order.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-stone-100 text-stone-600 hover:bg-stone-100">
                      {order.paymentMethod}
                    </Badge>
                    <span className="text-stone-500">
                      মোট:{" "}
                      <span className="font-heading text-base font-extrabold text-emerald-800">
                        {price(order.total)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
