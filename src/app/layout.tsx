import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/store-info";

export const metadata: Metadata = {
  title: `${STORE_NAME} | ${STORE_TAGLINE}`,
  description:
    `${STORE_NAME} — ইলেকট্রনিক্স, ফ্যাশন, ঘর সাজানো, বিউটি প্রোডাক্ট, খাবার ও ব্যাগের বিশাল কালেকশন। ক্যাশ অন ডেলিভারি, সারাদেশে দ্রুত ডেলিভারি আর ২৪/৭ AI সহকারী।`,
  keywords: ["অনলাইন শপ", "ই-কমার্স", "বাংলাদেশ", STORE_NAME, "শপিং"],
  authors: [{ name: STORE_NAME }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: `${STORE_NAME} | ${STORE_TAGLINE}`,
    description: "সারাদেশে হোম ডেলিভারি, ক্যাশ অন ডেলিভারি আর ১০০% অরিজিনাল পণ্যের নিশ্চয়তা।",
    siteName: STORE_NAME,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
