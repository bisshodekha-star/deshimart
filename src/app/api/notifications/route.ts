import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

// GET /api/notifications — list + unread count (শুধু অ্যাডমিন)
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
      db.notification.count({ where: { read: false } }),
    ]);
    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "নোটিফিকেশন লোড করা যায়নি" }, { status: 500 });
  }
}

// PATCH /api/notifications — mark read ({id} or {all: true}) — শুধু অ্যাডমিন
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (body.all) {
      await db.notification.updateMany({ where: { read: false }, data: { read: true } });
      return NextResponse.json({ success: true });
    }
    if (body.id) {
      await db.notification.update({
        where: { id: body.id },
        data: { read: true },
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "id অথবা all দরকার" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: "আপডেট করা যায়নি" }, { status: 500 });
  }
}

// DELETE /api/notifications — clear all — শুধু অ্যাডমিন
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }
  try {
    await db.notification.deleteMany();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/notifications error:", error);
    return NextResponse.json({ error: "মুছে ফেলা যায়নি" }, { status: 500 });
  }
}
