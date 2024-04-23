import "@ui/styles/globals.css";

import Script from "next/script";

export const fetchCache = "force-no-store";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning dir="rtl" lang="ar">
      {children}

      <Script
        src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"
        async
      />
    </html>
  );
}
