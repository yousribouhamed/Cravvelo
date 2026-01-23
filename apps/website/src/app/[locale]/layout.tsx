import "@ui/styles/globals.css";
import NavBar from "@/src/components/layout/header/nav-bar";
import { Analytics } from "@vercel/analytics/react";
import { CrispChat } from "@/src/components/crisp-chat";
import { constructMetadata } from "@/src/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import { locales } from "@/src/lib/i18n/config";
import { notFound } from "next/navigation";
import { HtmlAttributes } from "@/src/components/html-attributes";

export const metadata = constructMetadata({
  title: "Cravvelo - أنشئ وبيع دوراتك بسهولة",
  description:
    "Cravvelo يمكنك من بناء أكاديميتك الخاصة عبر الإنترنت. بيع الدورات والمنتجات الرقمية، إدارة الطلاب، والاحتفاظ بجميع الأرباح من خلال منصتنا متعددة المستأجرين.",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Determine text direction based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <>
      <HtmlAttributes dir={dir} lang={locale} />
      <NextIntlClientProvider messages={messages}>
        <CrispChat />
        <NavBar />
        <div className="  w-full h-fit min-h-full overflow-x-hidden">
          {children}
        </div>
        <Toaster />
        <Analytics />
      </NextIntlClientProvider>
    </>
  );
}
