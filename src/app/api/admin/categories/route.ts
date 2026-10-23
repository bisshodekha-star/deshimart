import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

/** GET /api/admin/categories — সব ক্যাটাগরি (অ্যাডমিন) */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET /api/admin/categories error:", err);
    return NextResponse.json({ error: "ক্যাটাগরি লোড করা যায়নি" }, { status: 500 });
  }
}

/** POST /api/admin/categories — নতুন ক্যাটাগরি */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    const { name } = (await req.json()) as { name?: string };
    if (!name?.trim()) {
      return NextResponse.json({ error: "ক্যাটাগরির নাম দিন" }, { status: 400 });
    }
    const existing = await db.category.findFirst({ where: { name: name.trim() } });
    if (existing) {
      return NextResponse.json(
        { error: "এই নামে ক্যাটাগরি আগেই আছে", category: existing },
        { status: 409 }
      );
    }
    const category = await db.category.create({
      data: { name: name.trim(), nameEn: name.trim(), icon: "Package" },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/categories error:", err);
    return NextResponse.json({ error: "ক্যাটাগরি যোগ করা যায়নি" }, { status: 500 });
  }
}
