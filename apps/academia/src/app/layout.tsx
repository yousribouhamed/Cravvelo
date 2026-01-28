import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Tajawal } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/providers";
import { cookies, headers } from "next/headers";
import { locales, defaultLocale, Locale } from "@/lib/i18n/config";
import { getTenantWebsite } from "@/actions/tanant";
import { preferredLanguageToLocale } from "@/lib/i18n/preferred-language";

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
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  let locale: Locale = defaultLocale;

  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale;
  } else {
    // If no valid cookie, derive from tenant preferredLanguage.
    const headersList = await headers();
    const tenant = headersList.get("x-tenant");

    if (tenant) {
      const website = await getTenantWebsite(tenant);
      const derivedLocale = preferredLanguageToLocale(
        website?.Account?.preferredLanguage
      );
      locale = derivedLocale;
    }
  }

  const dir = locale === "ar" ? "rtl" : "ltr";
  const messages = (await import(`../lib/i18n/messages/${locale}.json`)).default;

  return (
    <html suppressHydrationWarning lang={locale} dir={dir}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
