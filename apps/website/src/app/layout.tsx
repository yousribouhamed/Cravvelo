import { ReactNode } from "react";

// Root layout - Next.js 15 requires html/body here
// The [locale] layout will set dir/lang attributes via a script
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
