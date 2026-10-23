"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { enToBn } from "@/lib/format";
import { useAdminSession } from "@/hooks/use-admin-session";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/store-info";
import { NotificationBell } from "./notification-bell";
import type { View } from "./view-types";

const NAV_ITEMS: { label: string; view: View }[] = [
  { label: "হোম", view: "home" },
  { label: "শপ", view: "shop" },
  { label: "অর্ডার ট্র্যাক", view: "orders" },
  { label: "অ্যাডমিন", view: "admin" },
];

const emptySubscribe = () => () => {};

export function SiteHeader({ view, navigate }: { view: View; navigate: (v: View) => void }) {
  const totalQty = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  // hydration-safe "mounted" check
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  // নোটিফিকেশন বেল শুধু লগইন করা অ্যাডমিন দেখবেন
  const { authed } = useAdminSession();

  const go = (v: View) => {
    navigate(v);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2.5"
          aria-label={`${STORE_NAME} হোম`}
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-teal-600 shadow-md shadow-emerald-600/20">
            <ShoppingCart className="size-5 text-white" />
          </span>
          <span className="text-left leading-tight">
            <span className="block font-heading text-xl font-bold text-emerald-900">
              {STORE_NAME}
            </span>
            <span className="block text-[11px] text-muted-foreground">{STORE_TAGLINE}</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="প্রধান মেনু">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.view}
              variant={view === item.view ? "secondary" : "ghost"}
              size="sm"
              className={
                view === item.view
                  ? "bg-emerald-100 font-semibold text-emerald-900 hover:bg-emerald-100"
                  : "text-stone-600 hover:text-emerald-800"
              }
              onClick={() => go(item.view)}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {authed && <NotificationBell />}

          <Button
            variant="ghost"
            size="icon"
            className="relative text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
            onClick={() => go("cart")}
            aria-label={`কার্ট${mounted && totalQty > 0 ? ` (${enToBn(totalQty)} টি)` : ""}`}
          >
            <ShoppingCart className="size-5" />
            {mounted && totalQty > 0 && (
              <span className="badge-pulse absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {enToBn(totalQty)}
              </span>
            )}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-stone-700 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="মেনু"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          className="border-t bg-white px-4 py-2 md:hidden"
          aria-label="মোবাইল মেনু"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.view}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go(item.view);
              }}
              className={`block rounded-lg px-3 py-2.5 text-[15px] font-medium ${
                view === item.view
                  ? "bg-emerald-50 text-emerald-900"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
