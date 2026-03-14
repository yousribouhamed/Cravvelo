import "@ui/styles/globals.css";
import Providers from "../components/Providers";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "../components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { getUserLocale } from "@/src/services/locale";
import { locales, defaultLocale } from "../lib/i18n/config";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let locale = await getUserLocale();
  // Validate locale and fallback to default if invalid
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  const dir = locale === "ar" ? "rtl" : "ltr";
  const messages = (await import(`../lib/i18n/messages/${locale}.json`)).default;

  return (
    <html suppressHydrationWarning dir={dir} lang={locale}>
      <head />
      <body className={`selection:bg-primary selection:text-white antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ClerkProvider>
            <Providers locale={locale} messages={messages}>
              {children}
            </Providers>
          </ClerkProvider>

          <Analytics />

          <Toaster
            toastOptions={{
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
