import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { enToBn } from "@/lib/format";
import { STORE_NAME } from "@/lib/store-info";

const STORE_INFO = `তুমি "${STORE_NAME}"-এর AI সহকারী "মেঘ"। ${STORE_NAME} একটি বিশ্বস্ত বাংলাদেশি অনলাইন শপ।

দোকানের নিয়ম:
- ডেলিভারি চার্জ: ৳৮০, কিন্তু ৳১,০০০ বা তার বেশি অর্ডারে ফ্রি ডেলিভারি
- পেমেন্ট: ক্যাশ অন ডেলিভারি অথবা বিকাশ
- রিটার্ন: ডেলিভারির ৭ দিনের মধ্যে সমস্যা থাকলে ফেরত/বদল করা যায়
- ডেলিভারি সময়: ঢাকার ভেতরে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৪ দিন
- হটলাইন: ০১৭১১-০০০০০০ (সকাল ৯টা - রাত ১০টা)

তোমার কাজ:
- সব উত্তর সহজ, বন্ধুত্বপূর্ণ বাংলায় দাও (২-৪ বাক্য, খুব বেশি লম্বা নয়)
- কাস্টমারকে উপরের তালিকা থেকে প্রোডাক্ট সাজেস্ট করো (নাম + দাম বলো)
- দাম সবসময় ৳ চিহ্ন দিয়ে বাংলা সংখ্যায় লেখো (যেমন ৳৪,৫০০)
- তালিকার বাইরের কোনো প্রোডাক্ট বানিয়ে বলো না — না থাকলে ক্ষমাপ্রার্থী হও আর বিকল্প দাও
- অর্ডার করার পরামর্শ দাও: "শপ থেকে কার্টে যোগ করে চেকআউট করতে পারবেন"`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages?: { role: "user" | "assistant"; content: string }[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "মেসেজ খালি!" }, { status: 400 });
    }

    // live product catalog for grounded answers
    const products = await db.product.findMany({
      include: { category: true },
      orderBy: [{ featured: "desc" }, { rating: "desc" }],
      take: 25,
    });
    const catalog = products
      .map(
        (p) =>
          `- ${p.name} [${p.category.name}] — ৳${p.price.toLocaleString("en-IN")}${
            p.oldPrice ? ` (আগে ৳${p.oldPrice.toLocaleString("en-IN")})` : ""
          }, রেটিং ${p.rating}, স্টক ${p.stock}`
      )
      .join("\n");

    const systemPrompt = `${STORE_INFO}\n\nবর্তমান প্রোডাক্ট তালিকা:\n${catalog}`;

    // keep last 10 messages to control token usage
    const recent = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [{ role: "assistant", content: systemPrompt }, ...recent],
      thinking: { type: "disabled" },
    });

    let reply = completion.choices[0]?.message?.content ?? "";
    if (!reply.trim()) {
      reply = "দুঃখিত, এই মুহূর্তে উত্তর দিতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      {
        reply:
          "সরি! এই মুহূর্তে AI সহকারী ডেমো মোডে আছে, তাই উত্তর দিতে পারছি না। কিছু জানতে চাইলে সরাসরি কল বা মেসেজ করুন — আমরা সারাদিন আছি! আর শপ থেকে কার্টে যোগ করে সহজেই অর্ডার করতে পারবেন।",
      },
      { status: 200 }
    );
  }
}
