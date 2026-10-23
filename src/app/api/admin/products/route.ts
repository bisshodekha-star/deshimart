import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

type ProductInput = {
  name?: string;
  description?: string;
  price?: number;
  oldPrice?: number | null;
  image?: string;
  categoryId?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  featured?: boolean;
};

function validate(data: ProductInput, requireAll: boolean): string | null {
  if (requireAll || data.name !== undefined) {
    if (!data.name?.trim()) return "প্রোডাক্টের নাম দিন";
  }
  if (requireAll || data.description !== undefined) {
    if (!data.description?.trim()) return "প্রোডাক্টের বিবরণ দিন";
  }
  if (requireAll || data.price !== undefined) {
    if (typeof data.price !== "number" || !Number.isFinite(data.price) || data.price <= 0)
      return "সঠিক দাম দিন (০-এর বেশি)";
  }
  if (requireAll || data.image !== undefined) {
    if (!data.image?.trim()) return "ছবির লিংক দিন";
  }
  if (requireAll || data.categoryId !== undefined) {
    if (!data.categoryId?.trim()) return "ক্যাটাগরি বাছাই করুন";
  }
  if (data.stock !== undefined) {
    if (typeof data.stock !== "number" || data.stock < 0 || !Number.isInteger(data.stock))
      return "স্টক ০ বা তার বেশি হতে হবে";
  }
  if (data.oldPrice !== undefined && data.oldPrice !== null) {
    if (typeof data.oldPrice !== "number" || data.oldPrice <= 0)
      return "পুরনো দাম সঠিক নয়";
  }
  if (data.rating !== undefined) {
    if (typeof data.rating !== "number" || data.rating < 0 || data.rating > 5)
      return "রেটিং ০ থেকে ৫-এর মধ্যে দিন";
  }
  return null;
}

/** POST /api/admin/products — নতুন প্রোডাক্ট যোগ */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    const data = (await req.json()) as ProductInput;
    const error = validate(data, true);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const category = await db.category.findUnique({ where: { id: data.categoryId! } });
    if (!category) {
      return NextResponse.json({ error: "ক্যাটাগরি পাওয়া যায়নি" }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name: data.name!.trim(),
        description: data.description!.trim(),
        price: Math.round(data.price!),
        oldPrice: data.oldPrice ? Math.round(data.oldPrice) : null,
        image: data.image!.trim(),
        categoryId: data.categoryId!,
        stock: data.stock ?? 50,
        rating: data.rating ?? 4.5,
        reviews: data.reviews ?? 0,
        featured: data.featured ?? false,
      },
      include: { category: true },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products error:", err);
    return NextResponse.json({ error: "প্রোডাক্ট যোগ করা যায়নি" }, { status: 500 });
  }
}

/** PATCH /api/admin/products — প্রোডাক্ট এডিট */
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    const { id, ...data } = (await req.json()) as ProductInput & { id?: string };
    if (!id) return NextResponse.json({ error: "প্রোডাক্ট আইডি দরকার" }, { status: 400 });

    const error = validate(data, false);
    if (error) return NextResponse.json({ error }, { status: 400 });

    if (data.categoryId) {
      const category = await db.category.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        return NextResponse.json({ error: "ক্যাটাগরি পাওয়া যায়নি" }, { status: 400 });
      }
    }

    const product = await db.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name.trim() } : {}),
        ...(data.description !== undefined ? { description: data.description.trim() } : {}),
        ...(data.price !== undefined ? { price: Math.round(data.price) } : {}),
        ...(data.oldPrice !== undefined
          ? { oldPrice: data.oldPrice ? Math.round(data.oldPrice) : null }
          : {}),
        ...(data.image !== undefined ? { image: data.image.trim() } : {}),
        ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
        ...(data.stock !== undefined ? { stock: data.stock } : {}),
        ...(data.rating !== undefined ? { rating: data.rating } : {}),
        ...(data.reviews !== undefined ? { reviews: data.reviews } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
      },
      include: { category: true },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error("PATCH /api/admin/products error:", err);
    return NextResponse.json({ error: "প্রোডাক্ট আপডেট করা যায়নি" }, { status: 500 });
  }
}

/** DELETE /api/admin/products — প্রোডাক্ট মুছুন (অর্ডার থাকলে আটকাবে) */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "প্রোডাক্ট আইডি দরকার" }, { status: 400 });

    const orderCount = await db.orderItem.count({ where: { productId: id } });
    if (orderCount > 0) {
      return NextResponse.json(
        {
          error:
            "এই প্রোডাক্টের অর্ডার আছে, তাই মোছা যাবে না (পুরনো অর্ডারের রেকর্ড ঠিক রাখতে)। চাইলে স্টক ০ করে দিন — দোকান থেকে সরে যাবে।",
        },
        { status: 409 }
      );
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/products error:", err);
    return NextResponse.json({ error: "প্রোডাক্ট মোছা যায়নি" }, { status: 500 });
  }
}
