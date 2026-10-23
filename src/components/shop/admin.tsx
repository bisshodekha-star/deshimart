"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingBag,
  Banknote,
  Bell,
  Package,
  Loader2,
  CheckCheck,
  Trash2,
  ShieldCheck,
  LogOut,
  LockKeyhole,
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Star,
  Sparkles,
  AlertTriangle,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { useAdminSession } from "@/hooks/use-admin-session";
import { price, enToBn, timeAgoBn } from "@/lib/format";
import { statusColor, ORDER_STATUSES } from "@/lib/types";
import type { Category, Order, Product } from "@/lib/types";

const NEW_CATEGORY = "__new__";

/* ================= লগইন স্ক্রিন ================= */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error ?? "লগইন হয়নি", variant: "destructive" });
        return;
      }
      toast({ title: "লগইন সফল!", description: "অ্যাডমিন প্যানেলে স্বাগতম" });
      onLogin();
    } catch {
      toast({ title: "সংযোগে সমস্যা, আবার চেষ্টা করুন", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-600 text-white shadow-md">
            <LockKeyhole className="size-7" />
          </span>
          <h1 className="mt-4 font-heading text-xl font-bold text-stone-900">অ্যাডমিন লগইন</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            আপনার দোকানের ডেটা দেখতে পাসওয়ার্ড দিন
          </p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">পাসওয়ার্ড</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ADMIN_PASSWORD"
                className="pr-10"
                autoFocus
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label={show ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={busy || !password.trim()}
            className="w-full gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            লগইন করুন
          </Button>
        </form>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
          এই পাসওয়ার্ডটি আপনি Vercel-এর <b>ADMIN_PASSWORD</b> ভেরিয়েবলে সেট করেছেন।
          ভুলে গেলে Vercel Dashboard → Settings → Environment Variables দেখুন।
        </p>
      </div>
    </div>
  );
}

/* ================= পণ্য ফর্ম ডায়ালগ ================= */

type FormState = {
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  stock: string;
  categoryId: string;
  newCategoryName: string;
  image: string;
  rating: string;
  reviews: string;
  featured: boolean;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  stock: "50",
  categoryId: "",
  newCategoryName: "",
  image: "",
  rating: "4.5",
  reviews: "0",
  featured: false,
};

function ProductFormDialog({
  open,
  onOpenChange,
  categories,
  editing,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categories: Category[];
  editing: Product | null;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErr(null);
      setForm(
        editing
          ? {
              name: editing.name,
              description: editing.description,
              price: String(editing.price),
              oldPrice: editing.oldPrice ? String(editing.oldPrice) : "",
              stock: String(editing.stock),
              categoryId: editing.categoryId,
              newCategoryName: "",
              image: editing.image,
              rating: String(editing.rating),
              reviews: String(editing.reviews),
              featured: editing.featured,
            }
          : emptyForm
      );
    }
  }, [open, editing]);

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!form.name.trim() || !form.description.trim() || !form.price || !form.image.trim()) {
      setErr("নাম, বিবরণ, দাম ও ছবির লিংক — সবগুলো পূরণ করুন");
      return;
    }
    if (!form.categoryId) {
      setErr("ক্যাটাগরি বাছাই করুন অথবা নতুন ক্যাটাগরি লিখুন");
      return;
    }
    if (form.categoryId === NEW_CATEGORY && !form.newCategoryName.trim()) {
      setErr("নতুন ক্যাটাগরির নাম লিখুন");
      return;
    }
    setBusy(true);
    try {
      let categoryId = form.categoryId;
      if (categoryId === NEW_CATEGORY) {
        const catRes = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.newCategoryName }),
        });
        const catData = await catRes.json();
        if (!catRes.ok) {
          setErr(catData.error ?? "ক্যাটাগরি বানানো যায়নি");
          return;
        }
        categoryId = catData.id;
      }
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock) || 0,
        categoryId,
        image: form.image,
        rating: Number(form.rating) || 4.5,
        reviews: Number(form.reviews) || 0,
        featured: form.featured,
      };
      const res = await fetch("/api/admin/products", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...body } : body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "সমস্যা হয়েছে, আবার চেষ্টা করুন");
        return;
      }
      toast({
        title: editing ? "পণ্য আপডেট হয়েছে" : "নতুন পণ্য যোগ হয়েছে!",
        description: form.name,
      });
      onOpenChange(false);
      onSaved();
    } catch {
      setErr("সংযোগে সমস্যা — ইন্টারনেট চেক করে আবার চেষ্টা করুন");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {editing ? "পণ্য এডিট করুন" : "নতুন পণ্য যোগ করুন"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "তথ্য বদলে সেভ করুন — দোকানে সাথে সাথে আপডেট হবে।"
              : "পণ্য যোগ করলেই সেটি দোকানের শপ পেজে দেখা যাবে।"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-name">পণ্যের নাম *</Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="যেমন: খাঁটি সুন্দরবনের মধু"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-desc">বিবরণ *</Label>
            <Textarea
              id="p-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="পণ্যটির বৈশিষ্ট্য, মাপ, ওয়ারেন্টি ইত্যাদি লিখুন..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-price">দাম (৳) *</Label>
              <Input
                id="p-price"
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="850"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-old">পুরনো দাম (ঐচ্ছিক)</Label>
              <Input
                id="p-old"
                type="number"
                min="1"
                value={form.oldPrice}
                onChange={(e) => set("oldPrice", e.target.value)}
                placeholder="1000"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-stock">স্টক (কতটি আছে)</Label>
              <Input
                id="p-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-cat">ক্যাটাগরি *</Label>
              <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
                <SelectTrigger id="p-cat" aria-label="ক্যাটাগরি বাছাই">
                  <SelectValue placeholder="বাছাই করুন" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_CATEGORY} className="text-emerald-800 font-semibold">
                    + নতুন ক্যাটাগরি বানাবো
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {form.categoryId === NEW_CATEGORY && (
            <div className="space-y-1.5">
              <Label htmlFor="p-newcat">নতুন ক্যাটাগরির নাম *</Label>
              <Input
                id="p-newcat"
                value={form.newCategoryName}
                onChange={(e) => set("newCategoryName", e.target.value)}
                placeholder="যেমন: ইলেকট্রনিক্স"
                autoFocus
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="p-img">ছবির লিংক (URL) *</Label>
            <Input
              id="p-img"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://res.cloudinary.com/... অথবা /products/tea-pack.png"
            />
            {form.image.trim() ? (
              <div className="relative mt-2 h-28 overflow-hidden rounded-lg border bg-stone-50">
                <Image
                  src={form.image.trim()}
                  alt="প্রিভিউ"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                টিপস: Cloudinary/ImgBB-তে ছবি আপলোড করে লিংক কপি করে এখানে দিন।
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-rating">রেটিং (০-৫)</Label>
              <Input
                id="p-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-reviews">রিভিউ সংখ্যা</Label>
              <Input
                id="p-reviews"
                type="number"
                min="0"
                value={form.reviews}
                onChange={(e) => set("reviews", e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="p-featured" className="cursor-pointer">
                হোম পেজে ফিচার করুন
              </Label>
              <p className="text-[11px] text-muted-foreground">
                &quot;ফিচার্ড পণ্য&quot; সেকশনে বড় করে দেখাবে
              </p>
            </div>
            <Switch
              id="p-featured"
              checked={form.featured}
              onCheckedChange={(v) => set("featured", v)}
            />
          </div>

          {err && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {err}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={busy}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800"
              disabled={busy}
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {editing ? "আপডেট করুন" : "যোগ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ================= পণ্য ট্যাব ================= */

function ProductsTab({
  products,
  categories,
  reload,
}: {
  products: Product[];
  categories: Category[];
  reload: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const emptyStore = products.length === 0 && categories.length === 0;

  const loadDemo = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error ?? "লোড করা যায়নি", variant: "destructive" });
        return;
      }
      toast({
        title: data.seeded ? "ডেমো দোকান প্রস্তুত!" : "আর ডেমো লোড করা হয়নি",
        description: data.message ?? `${enToBn(data.products)}টি পণ্য যোগ হয়েছে`,
      });
      await reload();
    } catch {
      toast({ title: "সংযোগে সমস্যা", variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const res = await fetch(`/api/admin/products?id=${deleting.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error ?? "মোছা যায়নি", variant: "destructive" });
        return;
      }
      toast({ title: "পণ্য মুছে ফেলা হয়েছে", description: deleting.name });
      setDeleting(null);
      await reload();
    } catch {
      toast({ title: "সংযোগে সমস্যা", variant: "destructive" });
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {emptyStore && (
        <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            <Store className="size-7" />
          </span>
          <h3 className="mt-4 font-heading text-lg font-bold text-stone-900">
            স্বাগতম! আপনার দোকান এখনো খালি
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-stone-600">
            শুরু করার দুটো উপায় — ডেমো পণ্য লোড করে সাথে সাথে সবকিছু দেখে নিন, অথবা
            সরাসরি আপনার নিজের পণ্য যোগ করা শুরু করুন।
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Button
              className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
              onClick={loadDemo}
              disabled={seeding}
            >
              {seeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              ডেমো পণ্য লোড করুন (২২টি)
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-emerald-300 text-emerald-800"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="size-4" />
              নিজে পণ্য যোগ করুন
            </Button>
          </div>
        </div>
      )}

      {!emptyStore && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <h2 className="font-heading font-bold text-stone-900">
              পণ্যসমূহ ({enToBn(products.length)})
            </h2>
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-700 text-white hover:bg-emerald-800"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="size-4" />
              নতুন পণ্য
            </Button>
          </div>
          {products.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <Package className="mx-auto size-9 text-stone-300" />
              <p className="mt-3 text-sm text-muted-foreground">
                ক্যাটাগরি আছে কিন্তু কোনো পণ্য নেই — &quot;নতুন পণ্য&quot; বাটনে ক্লিক করে প্রথম পণ্য যোগ করুন।
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-[520px]">
              <div className="divide-y">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-lg border bg-stone-50">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-stone-800">
                          {p.name}
                        </p>
                        {p.featured && (
                          <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="ফিচার্ড" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {p.category.name} • স্টক{" "}
                        <span className={p.stock === 0 ? "font-bold text-red-600" : ""}>
                          {enToBn(p.stock)}
                        </span>
                      </p>
                    </div>
                    <span className="font-heading text-sm font-bold text-emerald-800">
                      {price(p.price)}
                    </span>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-stone-400 hover:text-emerald-700"
                        onClick={() => {
                          setEditing(p);
                          setFormOpen(true);
                        }}
                        aria-label={`${p.name} এডিট করুন`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-stone-400 hover:text-red-500"
                        onClick={() => setDeleting(p)}
                        aria-label={`${p.name} মুছুন`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories}
        editing={editing}
        onSaved={reload}
      />

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">পণ্যটি মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              <b>{deleting?.name}</b> দোকান থেকে সরে যাবে। এটি ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>না, থাক</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteBusy}
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              {deleteBusy && <Loader2 className="size-4 animate-spin" />}
              হ্যাঁ, মুছুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ================= মূল প্যানেল ================= */

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultPw, setDefaultPw] = useState(false);
  const { notifications, unreadCount, refresh, markAllRead } = useNotifications();

  const load = useCallback(async () => {
    try {
      const [ordersRes, productsRes, catRes, sessionRes] = await Promise.all([
        fetch("/api/orders?phone=all", { cache: "no-store" }),
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
        fetch("/api/admin/session", { cache: "no-store" }),
      ]);
      if (ordersRes.status === 401 || catRes.status === 401) {
        onLogout();
        return;
      }
      const [ordersData, productsData, catData, sessionData] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        catRes.json(),
        sessionRes.json(),
      ]);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(catData) ? catData : []);
      setDefaultPw(!!sessionData.defaultPassword);
      refresh();
      // দোকানের ভিউকে জানান যে পণ্য তালিকা বদলেছে হতে পারে
      window.dispatchEvent(new Event("deshimart:products-changed"));
    } catch {
      toast({
        title: "ডাটা লোড করা যায়নি",
        description: "আবার চেষ্টা করুন",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, onLogout, refresh]);

  useEffect(() => {
    load();
  }, [load]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    toast({ title: "লগআউট হয়েছে" });
    onLogout();
  };

  const updateStatus = async (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "স্ট্যাটাস আপডেট হয়েছে", description: `নতুন স্ট্যাটাস: ${status}` });
    } catch {
      toast({ title: "আপডেট হয়নি", variant: "destructive" });
      load();
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status !== "বাতিল")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { icon: ShoppingBag, label: "মোট অর্ডার", value: enToBn(orders.length) },
    { icon: Banknote, label: "মোট বিক্রি", value: price(totalRevenue) },
    { icon: Package, label: "পণ্য সংখ্যা", value: enToBn(products.length) },
    { icon: Bell, label: "অপঠিত নোটিফিকেশন", value: enToBn(unreadCount) },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-28">
        <Loader2 className="size-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-teal-600 text-white shadow-md">
            <LayoutDashboard className="size-5" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-stone-900">অ্যাডমিন প্যানেল</h1>
            <p className="flex items-center gap-1 text-xs text-emerald-700">
              <ShieldCheck className="size-3.5" />
              লগইন করা আছে — আপনার দোকান, আপনার নিয়ন্ত্রণে
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-emerald-200 text-emerald-800"
            onClick={load}
          >
            <ShieldCheck className="size-4" />
            রিফ্রেশ করুন
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-stone-200 text-stone-600 hover:text-red-600"
            onClick={logout}
          >
            <LogOut className="size-4" />
            লগআউট
          </Button>
        </div>
      </div>

      {defaultPw && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">
            আপনি এখন <b>ডিফল্ট পাসওয়ার্ড</b> ব্যবহার করছেন। নিরাপত্তার জন্য Vercel
            Dashboard → Settings → Environment Variables-এ গিয়ে <b>ADMIN_PASSWORD</b> ভেরিয়েবলে
            নিজের শক্তিশালী পাসওয়ার্ড সেট করুন — সেট করলেই এই মেসেজ চলে যাবে।
          </p>
        </div>
      )}

      {/* stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-white p-4 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <s.icon className="size-5" />
            </span>
            <p className="mt-3 font-heading text-xl font-extrabold text-stone-900">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* tabs */}
      <Tabs defaultValue="orders" className="mt-6">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl bg-stone-100 p-1.5 sm:w-fit">
          <TabsTrigger value="orders" className="gap-1.5 rounded-xl px-4 py-2">
            <ShoppingBag className="size-4" />
            অর্ডার ({enToBn(orders.length)})
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5 rounded-xl px-4 py-2">
            <Package className="size-4" />
            পণ্য ({enToBn(products.length)})
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 rounded-xl px-4 py-2">
            <Bell className="size-4" />
            নোটিফিকেশন
            {unreadCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {enToBn(unreadCount)}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ---------- অর্ডার ট্যাব ---------- */}
        <TabsContent value="orders" className="mt-4">
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {orders.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <ShoppingBag className="mx-auto size-9 text-stone-300" />
                <p className="mt-3 text-sm text-muted-foreground">
                  এখনো কোনো অর্ডার আসেনি। কার্টে পণ্য যোগ করে চেকআউট করে দেখুন!
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[560px]">
                <div className="divide-y">
                  {orders.map((order) => (
                    <div key={order.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-lg bg-emerald-50 px-2 py-0.5 font-mono text-xs font-bold text-emerald-800">
                            {order.orderNo}
                          </span>
                          <span className="text-sm font-semibold text-stone-800">
                            {order.customerName}
                          </span>
                          <span className="text-xs text-muted-foreground">{order.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-emerald-800">
                            {price(order.total)}
                          </span>
                          <Select
                            value={order.status}
                            onValueChange={(v) => updateStatus(order.id, v)}
                          >
                            <SelectTrigger
                              className={`h-8 w-32 rounded-full border text-xs font-bold ${statusColor(order.status)}`}
                              size="sm"
                              aria-label="স্ট্যাটাস বদলান"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ORDER_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p className="mt-1.5 text-xs text-stone-500">
                        {order.items
                          .map((i) => `${i.product?.name ?? ""} × ${enToBn(i.quantity)}`)
                          .join(", ")}
                      </p>
                      <p className="mt-1 text-[11px] text-stone-400">
                        {timeAgoBn(order.createdAt)} • {order.paymentMethod} • {order.address}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </TabsContent>

        {/* ---------- পণ্য ট্যাব ---------- */}
        <TabsContent value="products" className="mt-4">
          <ProductsTab products={products} categories={categories} reload={load} />
        </TabsContent>

        {/* ---------- নোটিফিকেশন ট্যাব ---------- */}
        <TabsContent value="notifications" className="mt-4">
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-3.5">
              <h2 className="font-heading font-bold text-stone-900">নোটিফিকেশন সেন্টার</h2>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-emerald-700 hover:text-emerald-800"
                  onClick={markAllRead}
                  aria-label="সব পড়া হয়েছে"
                  title="সব পড়া হয়েছে"
                >
                  <CheckCheck className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-stone-400 hover:text-red-500"
                  onClick={async () => {
                    await fetch("/api/notifications", { method: "DELETE" });
                    refresh();
                    toast({ title: "সব নোটিফিকেশন মুছে ফেলা হয়েছে" });
                  }}
                  aria-label="সব মুছুন"
                  title="সব মুছুন"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="max-h-[560px]">
              <div className="divide-y">
                {notifications.length === 0 && (
                  <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                    কোনো নোটিফিকেশন নেই
                  </p>
                )}
                {notifications.map((n) => (
                  <div key={n.id} className={`px-5 py-3.5 ${!n.read ? "bg-emerald-50/60" : ""}`}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-stone-800">{n.title}</p>
                      {!n.read && (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                          নতুন
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-stone-600">{n.body}</p>
                    <p className="mt-1 text-[11px] text-stone-400">{timeAgoBn(n.createdAt)}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <p className="px-5 py-3 text-[11px] leading-relaxed text-muted-foreground">
              নতুন অর্ডার এলেই এখানে অটো নোটিফিকেশন যোগ হবে। হেডারের বেল আইকনেও সাথে সাথে দেখা যায়।
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ================= এক্সপোর্ট ================= */

export function AdminView() {
  const { authed, checking, setAuthed } = useAdminSession();

  if (checking) {
    return (
      <div className="flex items-center justify-center py-28">
        <Loader2 className="size-8 animate-spin text-emerald-700" />
      </div>
    );
  }
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminPanel onLogout={() => setAuthed(false)} />;
}
