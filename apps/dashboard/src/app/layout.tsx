import "@ui/styles/globals.css";
import Providers from "../components/Providers";
import { Toaster } from "react-hot-toast";

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "../components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning dir="rtl" lang="ar">
      <head />
      <body
        className={`selection:bg-[#FC6B00] selection:text-white antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ClerkProvider>
            <Providers>{children}</Providers>
          </ClerkProvider>

          <Analytics />

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
