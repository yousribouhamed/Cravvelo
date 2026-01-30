import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Tajawal } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/providers";
import { Locale } from "@/lib/i18n/config";
import { getUserLocale } from "@/services/locale";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// const tajawal = Tajawal({
//   variable: "--font-tajawal",
//   subsets: ["arabic"],
//   weight: ["400", "500", "700"],
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Cravvelo",
  description: "cravvelo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale: Locale = await getUserLocale();

  const dir = locale === "ar" ? "rtl" : "ltr";
  const messages = (await import(`../lib/i18n/messages/${locale}.json`)).default;

  return (
    <html suppressHydrationWarning lang={locale} dir={dir}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers locale={locale} messages={messages}>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
