import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { DEMO_CATEGORIES, DEMO_PRODUCTS, DEMO_NOTIFICATIONS } from "@/lib/demo-data";

/**
 * POST /api/admin/setup — খালি দোকানে ডেমো ক্যাটাগরি ও পণ্য লোড করে।
 * শুধু ডাটাবেস একদম খালি থাকলেই কাজ করবে; নয়তো skip করবে।
 */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    const existing = await db.category.count();
    if (existing > 0) {
      return NextResponse.json({
        seeded: false,
        message: "দোকানে ইতিমধ্যে ডেটা আছে — আর ডেমো লোড করা হয়নি।",
      });
    }

    const catMap = new Map<string, string>();
    for (const c of DEMO_CATEGORIES) {
      const created = await db.category.create({
        data: { name: c.name, nameEn: c.nameEn, icon: c.icon },
      });
      catMap.set(c.key, created.id);
    }

    for (const p of DEMO_PRODUCTS) {
      await db.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          oldPrice: p.oldPrice ?? null,
          image: p.image,
          categoryId: catMap.get(p.categoryKey)!,
          stock: p.stock ?? 50,
          rating: p.rating ?? 4.5,
          reviews: p.reviews ?? 0,
          featured: p.featured ?? false,
        },
      });
    }

    await db.notification.createMany({ data: DEMO_NOTIFICATIONS });

    return NextResponse.json({
      seeded: true,
      categories: DEMO_CATEGORIES.length,
      products: DEMO_PRODUCTS.length,
    });
  } catch (err) {
    console.error("POST /api/admin/setup error:", err);
    return NextResponse.json({ error: "ডেমো ডেটা লোড করা যায়নি" }, { status: 500 });
  }
}
