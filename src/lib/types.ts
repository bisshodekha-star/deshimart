export type Category = {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  image: string;
  categoryId: string;
  category: Category;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
};

export type Order = {
  id: string;
  orderNo: string;
  customerName: string;
  phone: string;
  address: string;
  note: string | null;
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const ORDER_STATUSES = ["পেন্ডিং", "কনফার্মড", "শিপড", "ডেলিভারড", "বাতিল"] as const;

export function statusColor(status: string): string {
  switch (status) {
    case "পেন্ডিং":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "কনফার্মড":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "শিপড":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "ডেলিভারড":
      return "bg-green-600 text-white border-green-700";
    case "বাতিল":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-stone-100 text-stone-700 border-stone-200";
  }
}
