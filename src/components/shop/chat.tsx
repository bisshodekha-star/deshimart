"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { STORE_NAME } from "@/lib/store-info";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "কোন প্রোডাক্টগুলো সবচেয়ে জনপ্রিয়?",
  "ডেলিভারি চার্জ কত?",
  "পেমেন্ট কীভাবে করব?",
];

const WELCOME: ChatMessage = {
  role: "assistant",
  content: `আসসালামু আলাইকুম! আমি মেঘ 🌸 ${STORE_NAME}এর AI সহকারী। প্রোডাক্ট, দাম, ডেলিভারি বা অর্ডার নিয়ে যেকোনো প্রশ্ন করুন — আমি সাহায্য করতে প্রস্তুত!`,
};

export function ChatWidget({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.filter((m) => m !== WELCOME) }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "দুঃখিত, উত্তর আসেনি। আবার চেষ্টা করুন।",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "ইন্টারনেট সংযোগে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-700/30 transition-transform hover:scale-105 active:scale-95"
          aria-label="AI চ্যাট খুলুন"
        >
          <Bot className="size-6" />
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-emerald-950">
            AI
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[min(600px,75vh)] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-800 to-teal-700 px-4 py-3.5 text-white">
            <span className="relative flex size-10 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="size-5" />
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-emerald-800 bg-lime-400" />
            </span>
            <div className="flex-1 leading-tight">
              <p className="font-heading font-bold">মেঘ — AI সহকারী</p>
              <p className="text-xs text-emerald-100">অনলাইন • ২৪/৭ আপনার সেবায়</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/15 hover:text-white"
              onClick={() => setOpen(false)}
              aria-label="চ্যাট বন্ধ করুন"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                  m.role === "user"
                    ? "ml-auto rounded-br-md bg-emerald-700 text-white"
                    : "mr-auto rounded-bl-md bg-white text-stone-800"
                )}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
                <span className="typing-dot size-2 rounded-full bg-emerald-500" />
                <span className="typing-dot size-2 rounded-full bg-emerald-500" />
                <span className="typing-dot size-2 rounded-full bg-emerald-500" />
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            className="flex items-center gap-2 border-t bg-white p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="আপনার প্রশ্ন লিখুন..."
              className="flex-1 rounded-full border-stone-200 bg-stone-50 focus-visible:ring-emerald-600"
              aria-label="মেসেজ লিখুন"
            />
            <Button
              type="submit"
              size="icon"
              className="shrink-0 rounded-full bg-emerald-700 hover:bg-emerald-800"
              disabled={loading || !input.trim()}
              aria-label="পাঠিয়ে দিন"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
