import type { Metadata } from "next";
import "@ui/styles/globals.css";
import "@ui/font/stylesheet.css";
import Providers from "@/src/components/Providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "جدير",
  description: "انت جدير بامتلاك اكادميتي الخاصة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning dir="rtl" lang="ar">
      <head />
      <body className={`selection:bg-[#FC6B00] selection:text-white`}>
        <Providers>{children}</Providers>
      </body>

      <Script
        src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"
        async
      />
    </html>
  );
}
