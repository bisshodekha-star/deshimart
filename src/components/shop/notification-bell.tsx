"use client";

import { Bell, ShoppingBag, Megaphone, Package, Info, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { timeAgoBn, enToBn } from "@/lib/format";
import { useNotifications } from "@/hooks/use-notifications";

const TYPE_META: Record<string, { icon: typeof Bell; className: string }> = {
  order: { icon: ShoppingBag, className: "bg-emerald-100 text-emerald-700" },
  promo: { icon: Megaphone, className: "bg-amber-100 text-amber-700" },
  stock: { icon: Package, className: "bg-teal-100 text-teal-700" },
  system: { icon: Info, className: "bg-stone-100 text-stone-600" },
};

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
          aria-label={`নোটিফিকেশন${unreadCount ? ` (${enToBn(unreadCount)}টি অপঠিত)` : ""}`}
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="badge-pulse absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "৯+" : enToBn(unreadCount)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0 sm:w-[380px]">
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
          <p className="font-heading text-[15px] font-bold text-stone-800">নোটিফিকেশন</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-emerald-700 hover:text-emerald-800"
              onClick={markAllRead}
            >
              <CheckCheck className="size-3.5" />
              সব পড়া হয়েছে
            </Button>
          )}
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <Bell className="size-8 text-stone-300" />
            <p className="text-sm text-muted-foreground">এখনো কোনো নোটিফিকেশন নেই</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[380px]">
            <div className="divide-y">
              {notifications.map((n) => {
                const meta = TYPE_META[n.type] ?? TYPE_META.system;
                const Icon = meta.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50 ${
                      !n.read ? "bg-emerald-50/60" : ""
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${meta.className}`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-stone-800">
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[13px] leading-relaxed text-stone-600">
                        {n.body}
                      </span>
                      <span className="mt-1 block text-[11px] text-stone-400">
                        {timeAgoBn(n.createdAt)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
