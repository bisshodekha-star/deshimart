"use client";

import Image from "next/image";
import { Star, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/store";
import { price, enToBn } from "@/lib/format";
import type { Product } from "@/lib/types";
import type { View } from "./view-types";

export function ProductCard({
  product,
  navigate,
}: {
  product: Product;
  navigate: (v: View) => void;
}) {
  const { toast } = useToast();
  const add = useCart((s) => s.add);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    add({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
    toast({
      title: "কার্টে যোগ হয়েছে",
      description: `${product.name} — ${price(product.price)}`,
    });
  };

  return (
    <div
      onClick={() => navigate("product", product.id)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
            -{enToBn(discount)}%
          </span>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-stone-700">
              স্টক শেষ
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <Badge
          variant="secondary"
          className="w-fit border-0 bg-emerald-50 px-2 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50"
        >
          {product.category.name}
        </Badge>
        <p className="mt-1.5 line-clamp-1 text-[15px] font-semibold text-stone-800">
          {product.name}
        </p>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {enToBn(product.rating)}
          <span>({enToBn(product.reviews)})</span>
        </div>
        <div className="mt-2 flex flex-1 items-end justify-between gap-2">
          <div className="leading-tight">
            <p className="text-[17px] font-extrabold text-emerald-800">{price(product.price)}</p>
            {product.oldPrice && (
              <p className="text-xs text-stone-400 line-through">{price(product.oldPrice)}</p>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            aria-label={`${product.name} কার্টে যোগ করুন`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm transition-all hover:scale-105 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <Plus className="size-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
