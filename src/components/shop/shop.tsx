"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, ArrowLeft, Minus, Plus, ShoppingCart, Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/store";
import { price, enToBn } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import type { View } from "./view-types";

// ===================== SHOP LISTING =====================
export function ShopView({
  products,
  categories,
  preselectCategory,
  navigate,
}: {
  products: Product[];
  categories: Category[];
  preselectCategory: string;
  navigate: (v: View) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(preselectCategory || "all");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.categoryId === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.name.includes(q)
      );
    }
    switch (sort) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, category, search, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-stone-900 md:text-3xl">সব পণ্য</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        মোট {enToBn(filtered.length)}টি পণ্য পাওয়া গেছে
      </p>

      {/* Controls */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্য খুঁজুন..."
            className="rounded-full border-stone-200 bg-white pl-9"
            aria-label="পণ্য সার্চ"
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full rounded-full border-stone-200 bg-white sm:w-52" aria-label="সাজানোর নিয়ম">
            <SelectValue placeholder="সাজান" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">জনপ্রিয়তা অনুযায়ী</SelectItem>
            <SelectItem value="price-low">দাম: কম → বেশি</SelectItem>
            <SelectItem value="price-high">দাম: বেশি → কম</SelectItem>
            <SelectItem value="rating">রেটিং অনুযায়ী</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category pills */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CategoryPill
          active={category === "all"}
          label="সব"
          onClick={() => setCategory("all")}
        />
        {categories.map((c) => (
          <CategoryPill
            key={c.id}
            active={category === c.id}
            label={c.name}
            onClick={() => setCategory(c.id)}
          />
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Search className="size-10 text-stone-300" />
          <p className="font-semibold text-stone-700">কোনো পণ্য পাওয়া যায়নি</p>
          <p className="text-sm text-muted-foreground">অন্য কিছু লিখে খুঁজে দেখুন</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-700 text-white shadow-sm"
          : "bg-white text-stone-600 border hover:border-emerald-300 hover:text-emerald-800"
      }`}
    >
      {label}
    </button>
  );
}

// ===================== PRODUCT DETAIL =====================
export function ProductDetailView({
  product,
  products,
  navigate,
}: {
  product: Product;
  products: Product[];
  navigate: (v: View) => void;
}) {
  const { toast } = useToast();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = (goCart: boolean) => {
    if (product.stock <= 0) return;
    add(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
      },
      qty
    );
    toast({
      title: "কার্টে যোগ হয়েছে",
      description: `${product.name} × ${enToBn(qty)}`,
    });
    if (goCart) navigate("cart");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1.5 text-stone-600"
        onClick={() => navigate("shop")}
      >
        <ArrowLeft className="size-4" />
        শপে ফিরে যান
      </Button>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border bg-stone-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              {enToBn(discount)}% ছাড়
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <Badge
            variant="secondary"
            className="w-fit border-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
          >
            {product.category.name}
          </Badge>
          <h1 className="mt-2 font-heading text-3xl font-bold text-stone-900">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i < Math.round(product.rating) ? "fill-amber-400" : "fill-stone-200 text-stone-200"
                  }`}
                />
              ))}
            </span>
            <span className="font-semibold">{enToBn(product.rating)}</span>
            <span className="text-muted-foreground">
              ({enToBn(product.reviews)}টি রিভিউ)
            </span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <p className="font-heading text-4xl font-extrabold text-emerald-800">
              {price(product.price)}
            </p>
            {product.oldPrice && (
              <p className="pb-1 text-lg text-stone-400 line-through">
                {price(product.oldPrice)}
              </p>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-stone-600">{product.description}</p>

          <Separator className="my-5" />

          {/* stock + qty */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">স্টক</p>
              {product.stock > 0 ? (
                <p className="text-sm font-semibold text-emerald-700">
                  স্টকে আছে — {enToBn(product.stock)}টি
                </p>
              ) : (
                <p className="text-sm font-semibold text-red-600">স্টক শেষ</p>
              )}
            </div>
            <div className="flex items-center gap-3 rounded-full border px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="কমান"
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-8 text-center font-bold">{enToBn(qty)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                aria-label="বাড়ান"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5 flex gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-emerald-700 text-emerald-800 hover:bg-emerald-50"
              disabled={product.stock <= 0}
              onClick={() => handleAdd(false)}
            >
              <ShoppingCart className="size-4" />
              কার্টে যোগ করুন
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-emerald-700 font-bold hover:bg-emerald-800"
              disabled={product.stock <= 0}
              onClick={() => handleAdd(true)}
            >
              এখনই কিনুন
            </Button>
          </div>

          {/* delivery info */}
          <div className="mt-5 space-y-2.5 rounded-2xl bg-stone-50 p-4 text-sm">
            <div className="flex items-center gap-2.5 text-stone-700">
              <Truck className="size-4 shrink-0 text-emerald-700" />
              ৳১,০০০+ অর্ডারে ফ্রি ডেলিভারি, নাহলে মাত্র ৳৮০
            </div>
            <div className="flex items-center gap-2.5 text-stone-700">
              <ShieldCheck className="size-4 shrink-0 text-emerald-700" />
              ক্যাশ অন ডেলিভারি অথবা বিকাশে পেমেন্ট
            </div>
            <div className="flex items-center gap-2.5 text-stone-700">
              <RotateCcw className="size-4 shrink-0 text-emerald-700" />
              ৭ দিনের মধ্যে সহজ রিটার্নের সুযোগ
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-heading text-xl font-bold text-stone-900 md:text-2xl">
            একই ধরনের পণ্য
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
