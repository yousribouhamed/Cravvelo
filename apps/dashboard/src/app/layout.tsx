import type { Metadata } from "next";
import "@ui/styles/globals.css";
import "@ui/font/stylesheet.css";
import Providers from "../components/Providers";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@ui/components/ui/sonner";

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
      <Toaster
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: "bg-white rounded-2xl",
          },
        }}
      />
      <Script src="//code.tidio.co/f4ntqdkrkcmkov2pbgapiuevig4fhtbq.js" async />
      <Script
        src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"
        async
      />
    </html>
  );
}
