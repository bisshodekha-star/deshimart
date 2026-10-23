import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("search")?.trim();
    const categoryId = searchParams.get("category");
    const featured = searchParams.get("featured");

    const products = await db.product.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" as const } },
                { description: { contains: q, mode: "insensitive" as const } },
                {
                  category: {
                    is: {
                      OR: [
                        { name: { contains: q } },
                        { nameEn: { contains: q, mode: "insensitive" as const } },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
        ...(categoryId && categoryId !== "all" ? { categoryId } : {}),
        ...(featured === "true" ? { featured: true } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "প্রোডাক্ট লোড করা যায়নি" }, { status: 500 });
  }
}
