import "ui/styles/globals.css";

import type { Metadata } from "next";
import Providers from "../components/Provider";
import { Toaster } from "@ui/components/ui/sonner";

export const metadata: Metadata = {
  title: "Cravvelo-admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body
        dir="rtl"
        className={`selection:bg-[#FC6B00] selection:text-white antialiased grainy `}
      >
        <Providers>{children}</Providers>
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
