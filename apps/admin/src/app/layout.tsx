import "ui/styles/globals.css";

import type { Metadata } from "next";
import Providers from "../components/Provider";

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
        className={`selection:bg-[#FC6B00] selection:text-white antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
