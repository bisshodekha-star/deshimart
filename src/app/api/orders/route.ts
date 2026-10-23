import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DELIVERY_FEE, FREE_DELIVERY_MIN } from "@/lib/format";
import { isAdmin } from "@/lib/auth";

type IncomingItem = { productId: string; quantity: number };

// POST /api/orders — place a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, address, note, paymentMethod, items } = body as {
      customerName?: string;
      phone?: string;
      address?: string;
      note?: string;
      paymentMethod?: string;
      items?: IncomingItem[];
    };

    if (!customerName?.trim() || !phone?.trim() || !address?.trim()) {
      return NextResponse.json(
        { error: "নাম, মোবাইল নম্বর ও ঠিকানা পূরণ করা আবশ্যক" },
        { status: 400 }
      );
    }
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) {
      return NextResponse.json(
        { error: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)" },
        { status: 400 }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "কার্ট খালি!" }, { status: 400 });
    }

    // Never trust client prices — recompute from DB
    const ids = items.map((i) => i.productId);
    const products = await db.product.findMany({ where: { id: { in: ids } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    for (const item of items) {
      const p = productMap.get(item.productId);
      if (!p) {
        return NextResponse.json(
          { error: "কিছু প্রোডাক্ট পাওয়া যায়নি, কার্ট আপডেট করুন" },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.floor(item.quantity));
      if (p.stock < qty) {
        return NextResponse.json(
          { error: `দুঃখিত! "${p.name}"-এর স্টক যথেষ্ট নেই (বাকি: ${p.stock})` },
          { status: 400 }
        );
      }
      subtotal += p.price * qty;
    }

    const deliveryFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    const orderNo = `DM${Date.now().toString().slice(-8)}`;

    const order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNo,
          customerName: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          note: note?.trim() || null,
          paymentMethod: paymentMethod === "bkash" ? "বিকাশ" : "ক্যাশ অন ডেলিভারি",
          total,
          status: "পেন্ডিং",
          items: {
            create: items.map((item) => {
              const p = productMap.get(item.productId)!;
              return {
                productId: p.id,
                quantity: Math.max(1, Math.floor(item.quantity)),
                price: p.price,
              };
            }),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // decrement stock
      for (const item of items) {
        const p = productMap.get(item.productId)!;
        await tx.product.update({
          where: { id: p.id },
          data: { stock: { decrement: Math.max(1, Math.floor(item.quantity)) } },
        });
      }

      // admin notification
      await tx.notification.create({
        data: {
          type: "order",
          title: "নতুন অর্ডার এসেছে!",
          body: `${created.customerName} — ${created.orderNo} — মোট ৳${created.total.toLocaleString(
            "en-IN"
          )} (${created.items.length}টি পণ্য)`,
        },
      });

      return created;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "অর্ডার নিতে সমস্যা হয়েছে, আবার চেষ্টা করুন" }, { status: 500 });
  }
}

// GET /api/orders?phone=01XXXXXXXXX — track orders
// GET /api/orders?phone=all — admin: list all orders
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone")?.trim();
    if (!phone) {
      return NextResponse.json({ error: "মোবাইল নম্বর দিন" }, { status: 400 });
    }
    // সব অর্ডার দেখা = শুধু লগইন করা অ্যাডমিনের জন্য
    if (phone === "all" && !isAdmin(req)) {
      return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
    }
    const orders = await db.order.findMany({
      ...(phone === "all" ? {} : { where: { phone } }),
      include: { items: { include: { product: { include: { category: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "অর্ডার খুঁজতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

// PATCH /api/orders — admin: update status
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id ও status দরকার" }, { status: 400 });
    }
    const order = await db.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json({ error: "স্ট্যাটাস আপডেট করা যায়নি" }, { status: 500 });
  }
}
