import "@ui/styles/globals.css";
import Providers from "../components/Providers";
import { Toaster } from "react-hot-toast";

import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning dir="rtl" lang="ar">
      <head />
      <body
        className={`selection:bg-[#FC6B00] selection:text-white antialiased `}
      >
        <Providers>{children}</Providers>

        <Analytics />

        <Toaster />
      </body>
    </html>
  );
}
