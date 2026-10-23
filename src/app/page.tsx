"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SiteHeader } from "@/components/shop/header";
import { SiteFooter } from "@/components/shop/footer";
import { HomeView } from "@/components/shop/home";
import { ShopView, ProductDetailView } from "@/components/shop/shop";
import { CartView, CheckoutView, SuccessView } from "@/components/shop/cart";
import { OrdersView } from "@/components/shop/orders";
import { AdminView } from "@/components/shop/admin";
import { ChatWidget } from "@/components/shop/chat";
import type { Category, Product } from "@/lib/types";
import type { View } from "@/components/shop/view-types";

export default function Home() {
  const { toast } = useToast();
  const [view, setView] = useState<View>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [preselectCategory, setPreselectCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const loadProducts = () =>
      fetch("/api/products", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setProducts(data);
        })
        .catch(() => {
          toast({
            title: "পণ্য লোড করা যায়নি",
            description: "পেজটি রিফ্রেশ করে দেখুন",
            variant: "destructive",
          });
        })
        .finally(() => setLoading(false));
    loadProducts();
    // অ্যাডমিন পণ্য যোগ/এডিট/মুছলে দোকান সাথে সাথে আপডেট হয়
    const onProductsChanged = () => loadProducts();
    window.addEventListener("deshimart:products-changed", onProductsChanged);
    return () => window.removeEventListener("deshimart:products-changed", onProductsChanged);
  }, [toast]);

  const categories: Category[] = useMemo(() => {
    const map = new Map<string, Category>();
    for (const p of products) map.set(p.category.id, p.category);
    return [...map.values()];
  }, [products]);

  const navigate = useCallback(
    (v: View, productId?: string, categoryId?: string) => {
      if (productId) setSelectedProductId(productId);
      if (categoryId !== undefined) setPreselectCategory(categoryId);
      setView(v);
    },
    []
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [view]);

  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader view={view} navigate={navigate} />

      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-28">
            <div className="flex flex-col items-center gap-3">
              <div className="size-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
              <p className="text-sm text-muted-foreground">দোকান প্রস্তুত হচ্ছে...</p>
            </div>
          </div>
        ) : (
          <>
            {view === "home" && (
              <HomeView
                products={products}
                categories={categories}
                navigate={navigate}
                onOpenChat={() => setChatOpen(true)}
              />
            )}
            {view === "shop" && (
              <ShopView
                products={products}
                categories={categories}
                preselectCategory={preselectCategory}
                navigate={navigate}
              />
            )}
            {view === "product" && selectedProduct && (
              <ProductDetailView
                product={selectedProduct}
                products={products}
                navigate={navigate}
              />
            )}
            {view === "product" && !selectedProduct && (
              <div className="py-20 text-center text-muted-foreground">
                পণ্যটি পাওয়া যায়নি
              </div>
            )}
            {view === "cart" && <CartView navigate={navigate} />}
            {view === "checkout" && <CheckoutView navigate={navigate} />}
            {view === "success" && <SuccessView navigate={navigate} />}
            {view === "orders" && <OrdersView />}
            {view === "admin" && <AdminView />}
          </>
        )}
      </main>

      <SiteFooter navigate={navigate} />
      <ChatWidget open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
