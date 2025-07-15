import "@ui/styles/globals.css";
import Providers from "../components/Providers";
import Script from "next/script";
import { Toaster } from "@ui/components/ui/sonner";

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
      </body>
      <Toaster
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: " rounded-2xl",
          },
        }}
      />

      <Script
        src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"
        async
      />
    </html>
  );
}
