/**
 * দেশিমার্ট ডেমো ডেটা — এক ক্লিকে দোকান প্রস্তুত করার জন্য।
 * এই ডেটা অ্যাডমিন প্যানেলের "ডেমো লোড" বাটনে ব্যবহার হয়।
 * ছবিগুলো public/products/ ফোল্ডারে আছে — তাই ডিপ্লয়ের পরেও কাজ করবে।
 */

export type DemoCategory = {
  key: string;
  name: string;
  nameEn: string;
  icon: string;
};

export type DemoProduct = {
  categoryKey: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  featured?: boolean;
};

export const DEMO_CATEGORIES: DemoCategory[] = [
  { key: "electronics", name: "ইলেকট্রনিক্স", nameEn: "Electronics", icon: "Smartphone" },
  { key: "fashion", name: "ফ্যাশন", nameEn: "Fashion", icon: "Shirt" },
  { key: "home", name: "ঘর ও লিভিং", nameEn: "Home & Living", icon: "Lamp" },
  { key: "beauty", name: "বিউটি ও কেয়ার", nameEn: "Beauty", icon: "Sparkles" },
  { key: "food", name: "খাবার ও গ্রোসারি", nameEn: "Food", icon: "Coffee" },
  { key: "bags", name: "ব্যাগ ও এক্সেসরিজ", nameEn: "Bags", icon: "Briefcase" },
];

export const DEMO_PRODUCTS: DemoProduct[] = [
  // ---------- ইলেকট্রনিক্স ----------
  {
    categoryKey: "electronics",
    name: "প্রিমিয়াম স্মার্টওয়াচ প্রো",
    description:
      "HD AMOLED ডিসপ্লে, হার্ট-রেট মনিটর, স্লিপ ট্র্যাকিং আর ৭ দিনের ব্যাটারি ব্যাকআপ — স্মার্ট জীবনের জন্য পারফেক্ট সঙ্গী।",
    price: 4500,
    oldPrice: 5600,
    image: "/products/smartwatch-pro.jpg",
    rating: 4.7,
    reviews: 128,
    featured: true,
    stock: 35,
  },
  {
    categoryKey: "electronics",
    name: "স্মার্টফোন এক্স-আল্ট্রা ৫জি",
    description:
      "৬.৭ ইঞ্চির বিশাল ডিসপ্লে, ১০৮MP ক্যামেরা, S-পেন সাপোর্ট আর ব্লেজিং ফাস্ট ৫জি স্পিড — পাওয়ার ইউজারদের জন্য।",
    price: 24999,
    oldPrice: 28000,
    image: "/products/smartphone-x-ultra.jpeg",
    rating: 4.8,
    reviews: 342,
    featured: true,
    stock: 18,
  },
  {
    categoryKey: "electronics",
    name: "পোর্টেবল ব্লুটুথ স্পিকার",
    description:
      "৩৬০° সারাউন্ড সাউন্ড, IPX7 ওয়াটারপ্রুফ আর ১২ ঘণ্টা প্লেটাইম — পিকনিক, ভ্রমণ বা হাউজ পার্টির জন্য দুর্দান্ত।",
    price: 2850,
    oldPrice: 3500,
    image: "/products/bt-speaker.jpg",
    rating: 4.6,
    reviews: 95,
    featured: true,
    stock: 42,
  },
  {
    categoryKey: "electronics",
    name: "ফোল্ডেবল ফ্যাব ফোন",
    description:
      "ভাঁজ করা যায় এমন ফিউচারিস্টিক ডিজাইন, ডুয়াল AMOLED স্ক্রিন আর মাল্টিটাস্কিং সাপোর্ট — টেকনোলজির সেরা নমুনা।",
    price: 89000,
    image: "/products/foldable-phone.jpg",
    rating: 4.9,
    reviews: 47,
    stock: 8,
  },
  {
    categoryKey: "electronics",
    name: "স্মার্ট হোম ডিসপ্লে হাব",
    description:
      "ভয়েস কমান্ডে ঘরের সব স্মার্ট ডিভাইস নিয়ন্ত্রণ করুন — ভিডিও কল, মিউজিক, আবহাওয়া সব এক স্ক্রিনেই।",
    price: 8500,
    oldPrice: 9900,
    image: "/products/smart-display.jpg",
    rating: 4.5,
    reviews: 73,
    stock: 25,
  },
  // ---------- ফ্যাশন ----------
  {
    categoryKey: "fashion",
    name: "প্রিমিয়াম কটন সোয়েটশার্ট",
    description:
      "১০০% এক্সপোর্ট কোয়ালিটি কটন, শীতের জন্য আরামদায়ক ও উষ্ণ — আউটডোর ও ক্যাজুয়াল দুটোতেই মানানসই।",
    price: 1450,
    oldPrice: 1890,
    image: "/products/premium-sweatshirt.jpg",
    rating: 4.4,
    reviews: 210,
    featured: true,
    stock: 60,
  },
  {
    categoryKey: "fashion",
    name: "ফরমাল ব্লেজার স্যুট",
    description:
      "অফিস, ইন্টারভিউ বা বিয়ে বাড়ির জন্য এলিগ্যান্ট টেইলর্ড ফিট — দেখতে দুর্দান্ত, পরতে আরামদায়ক।",
    price: 6900,
    image: "/products/formal-suit.jpg",
    rating: 4.6,
    reviews: 88,
    stock: 22,
  },
  {
    categoryKey: "fashion",
    name: "ফ্লোরাল সামার ড্রেস",
    description:
      "হালকা ফ্রি-সাইজ ফ্যাব্রিকে ফ্রেশ ফ্লোরাল প্রিন্ট — গরমের দিনে স্টাইলিশ আর স্বস্তিদায়ক।",
    price: 2200,
    oldPrice: 2750,
    image: "/products/floral-dress.jpg",
    rating: 4.5,
    reviews: 156,
    stock: 38,
  },
  {
    categoryKey: "fashion",
    name: "কর্ডুরয় উইন্টার জ্যাকেট",
    description:
      "মাস্টার্ড সোয়েটারের সাথে পারফেক্ট ম্যাচ করা সবুজ কর্ডুরয় জ্যাকেট — শীতের ফ্যাশনে আলাদা হয়ে যান।",
    price: 3400,
    image: "/products/corduroy-jacket.jpg",
    rating: 4.3,
    reviews: 64,
    stock: 30,
  },
  // ---------- ঘর ও লিভিং ----------
  {
    categoryKey: "home",
    name: "সিরামিক টেবিল ল্যাম্প",
    description:
      "স্ট্রাইপড সিরামিক বেস আর ফ্যাব্রিক শেড — বেডরুম বা স্টাডি টেবিলে ছড়িয়ে দেবে উষ্ণ আলো।",
    price: 1850,
    oldPrice: 2300,
    image: "/products/ceramic-lamp.jpg",
    rating: 4.6,
    reviews: 112,
    featured: true,
    stock: 26,
  },
  {
    categoryKey: "home",
    name: "ডেকোরেটিভ ল্যাম্প কালেকশন",
    description:
      "রাটান পেন্ডেন্ট সহ বিভিন্ন ডিজাইনের টেবিল ল্যাম্প — ঘরের কর্নারকে দেবে বুটিক লুক।",
    price: 3200,
    image: "/products/lamp-set.jpg",
    rating: 4.4,
    reviews: 57,
    stock: 19,
  },
  {
    categoryKey: "home",
    name: "হ্যান্ডমেড সিরামিক মাগ সেট",
    description:
      "রাস্টিক স্পেকলড ফিনিশের ৪টি মাগ ও সসের সেট — চায়ের আড্ডাকে করে তুলবে আরও মজার।",
    price: 950,
    oldPrice: 1200,
    image: "/products/mug-set.webp",
    rating: 4.7,
    reviews: 189,
    featured: true,
    stock: 54,
  },
  {
    categoryKey: "home",
    name: "ফ্লোরাল প্রিন্ট ল্যাম্প",
    description:
      "মেরুন সিরামিক বেসে সাদা ফ্লোরাল শেড — ক্লাসিক ডেকোর ভালোবাসাদের জন্য আদর্শ।",
    price: 2400,
    image: "/products/floral-lamp.jpg",
    rating: 4.5,
    reviews: 41,
    stock: 15,
  },
  // ---------- বিউটি ও কেয়ার ----------
  {
    categoryKey: "beauty",
    name: "লাক্সারি ওয়াটার পারফিউম",
    description:
      "ফ্লোরাল-উডি নোটের দীর্ঘস্থায়ী আতর — এক স্প্রেতেই সারাদিন ফ্রেশনেস।",
    price: 3600,
    oldPrice: 4200,
    image: "/products/luxury-perfume.jpg",
    rating: 4.8,
    reviews: 234,
    featured: true,
    stock: 33,
  },
  {
    categoryKey: "beauty",
    name: "পারফিউম গিফট সেট (৩ পিস)",
    description:
      "ভ্যানিলা, ক্যারামেল আর উডি — তিন সেন্টের প্রিমিয়াম সেট, উপহার দেওয়ার জন্য পারফেক্ট।",
    price: 4900,
    image: "/products/perfume-set.jpg",
    rating: 4.7,
    reviews: 76,
    stock: 21,
  },
  {
    categoryKey: "beauty",
    name: "স্কিনকেয়ার কম্বো সেট",
    description:
      "ফেসওয়াশ, ক্রিম আর সিরাম — রোজকার স্কিন কেয়ার রুটিনের সম্পূর্ণ প্যাকেজ, সব ধরনের ত্বকের জন্য।",
    price: 1750,
    oldPrice: 2200,
    image: "/products/skincare-set.jpg",
    rating: 4.5,
    reviews: 143,
    stock: 47,
  },
  // ---------- খাবার ও গ্রোসারি ----------
  {
    categoryKey: "food",
    name: "খাঁটি সুন্দরবনের মধু",
    description:
      "সরাসরি মৌয়ালদের কাছ থেকে — কোনো ভেজাল ছাড়া ১০০% খাঁটি বুনো মধু, ৫০০ গ্রামের বোতলে।",
    price: 850,
    image: "/products/honey.jpg",
    rating: 4.9,
    reviews: 312,
    featured: true,
    stock: 65,
  },
  {
    categoryKey: "food",
    name: "প্রিমিয়াম মালবাহী চা প্যাক",
    description:
      "উচ্চমানের পাতা চা, সুগন্ধি ও রঙে সেরা — এক কাপ চায়েই পাবেন সারাদিনের এনার্জি।",
    price: 420,
    oldPrice: 500,
    image: "/products/tea-pack.png",
    rating: 4.6,
    reviews: 275,
    stock: 90,
  },
  {
    categoryKey: "food",
    name: "চকলেট গিফ্ট বক্স",
    description:
      "প্রিমিয়াম মিল্ক ও ডার্ক চকলেটের অ্যাসর্টেড বক্স — প্রিয়জনকে মিষ্টি সারপ্রাইজ দিন।",
    price: 1150,
    image: "/products/chocolate-box.jpg",
    rating: 4.4,
    reviews: 98,
    stock: 44,
  },
  // ---------- ব্যাগ ও এক্সেসরিজ ----------
  {
    categoryKey: "bags",
    name: "লেদার ব্যাকপ্যাক",
    description:
      "প্রিমিয়াম পেবলড লেদার, ল্যাপটপ কম্পার্টমেন্ট আর সিলভার জিপার — অফিস বা কলেজ দুটোর জন্যই ঝামেলামুক্ত।",
    price: 3800,
    oldPrice: 4500,
    image: "/products/leather-backpack.jpg",
    rating: 4.7,
    reviews: 167,
    featured: true,
    stock: 28,
  },
  {
    categoryKey: "bags",
    name: "ট্রাভেল ব্যাকপ্যাক সেট",
    description:
      "ব্যাকপ্যাক + ডিট্যাচেবল পাউচ + ক্লাচ — ভ্রমণের সব জিনিস গুছিয়ে রাখার স্মার্ট সমাধান।",
    price: 4200,
    image: "/products/travel-backpack.jpg",
    rating: 4.6,
    reviews: 84,
    stock: 24,
  },
  {
    categoryKey: "bags",
    name: "লেডিস লেদার টোট ব্যাগ",
    description:
      "গোল্ড জিপারসহ এলিগ্যান্ট পেবলড লেদার টোট — প্রতিদিনের আউটফিটে যোগ করুন ক্লাসি টাচ।",
    price: 2900,
    oldPrice: 3400,
    image: "/products/tote-bag.jpg",
    rating: 4.5,
    reviews: 121,
    stock: 31,
  },
];

export const DEMO_NOTIFICATIONS = [
  { type: "system", title: "দোকান চালু হয়েছে!", body: "দেশিমার্টে স্বাগতম। নতুন কালেকশন এখন স্টকে আছে।" },
  { type: "promo", title: "ফ্রি ডেলিভারি অফার", body: "৳১,০০০+ অর্ডারে সারাদেশে ফ্রি হোম ডেলিভারি চলছে!" },
  { type: "stock", title: "নতুন স্টক এসেছে", body: "ফোল্ডেবল ফ্যাব ফোন এখন সীমিত স্টকে পাওয়া যাচ্ছে।" },
];
