import "@ui/styles/globals.css";

import Providers from "../components/Providers";
import { Toaster } from "@ui/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = "en";
  return (
    <html
      suppressHydrationWarning
      dir={lang === "en" ? "ltr" : "rtl"}
      lang={lang}
    >
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
    </html>
  );
}
