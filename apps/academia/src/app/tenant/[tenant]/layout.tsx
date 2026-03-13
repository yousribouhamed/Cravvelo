import Header from "@/components/layout/header";
import SalesBanner from "@/components/sales-banner";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTenantWebsite, validateTenant } from "@/actions/tanant";
import { TenantProvider } from "@/contexts/tenant";
import MaxWidthWrapper from "@/components/max-with-wrapper";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import "@smastrom/react-rating/style.css";
import { PaymentProvider } from "@/modules/payments/context/payments-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import { VisitTracker } from "@/components/visit-tracker";
import { TrackingPixels } from "@/components/tracking-pixels";
import { buildThemeStyleAndData } from "@/lib/theme-utils";
import { AcademiaUnavailable } from "@/components/academia-unavailable";

interface TenantLayoutProps {
  children: ReactNode;
  params: Promise<{
    tenant: string;
  }>;
}

export async function generateMetadata({
  params,
}: Pick<TenantLayoutProps, "params">): Promise<Metadata> {
  const { tenant: tenantKey } = await params;
  const tenant = decodeURIComponent(tenantKey);
  const websiteData = await getTenantWebsite(tenant);

  const title =
    (websiteData as any)?.name ??
    (websiteData as any)?.Account?.user_name ??
    "Academy";

  const favicon = (websiteData as any)?.favicon as string | undefined | null;
  const iconUrl = favicon || "/default-favicon.svg";

  const metadata: Metadata = {
    title,
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
  };

  return metadata;
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant: tenantKey } = await params;
  const tenant = decodeURIComponent(tenantKey);

  const [{ isValid, hasActiveSubscription, isAccountSuspended }, websiteData, user] = await Promise.all([
    validateTenant(tenant),
    getTenantWebsite(tenant),
    getCurrentUser(),
  ]);

  if (!isValid) {
    notFound();
  }

  if (!websiteData) {
    notFound();
  }

  const theme = websiteData.themeCustomization as Record<string, unknown> | null | undefined;
  const { style: themeStyle, dataAttributes: themeData, cssOverrides } = buildThemeStyleAndData(theme as import("database").ThemeCustomization);
  const hasPageBg =
    theme &&
    typeof theme === "object" &&
    ((theme as Record<string, unknown>).pageBackgroundLight != null ||
      (theme as Record<string, unknown>).pageBackgroundDark != null);

  const layoutStyle = {
    "--primary-color": websiteData.primaryColor || "#7C3AED",
    ...themeStyle,
  } as React.CSSProperties;

  const primaryFallback =
    websiteData.primaryColor &&
    `.academia-theme-root { --primary: ${websiteData.primaryColor}; } .dark .academia-theme-root { --primary: ${websiteData.primaryColor}; }`;

  const isBlocked = isAccountSuspended || !hasActiveSubscription;

  return (
    <div
      className={`academia-theme-root min-h-screen h-fit text-neutral-900 dark:text-neutral-200 ${hasPageBg ? "academia-theme-page-bg" : "bg-neutral-50 dark:bg-[#0E0E10]"}`}
      style={layoutStyle}
      {...themeData}
    >
      {primaryFallback ? <style dangerouslySetInnerHTML={{ __html: primaryFallback }} /> : null}
      {cssOverrides ? <style dangerouslySetInnerHTML={{ __html: cssOverrides }} /> : null}
      <VisitTracker tenant={tenant} />
      <TrackingPixels
        facebookPixelId={websiteData.facebookPixelId ?? null}
        tiktokPixelId={websiteData.tiktokPixelId ?? null}
      />
      <TenantProvider website={websiteData} tenant={tenant} user={user}>
        <PaymentProvider>
          <SalesBanner />
          <Header />
          <MaxWidthWrapper className="flex flex-col min-h-[calc(100vh-70px)]">
            <main className="flex-1">
              {isBlocked ? (
                <AcademiaUnavailable
                  reason={isAccountSuspended ? "suspended" : "no-subscription"}
                />
              ) : (
                children
              )}
            </main>
            <Footer
              brandName={(websiteData as any)?.name || (websiteData as any)?.Account?.user_name}
              legal={{
                privacyPolicy: (websiteData as any)?.privacy_policy,
                termsOfService: (websiteData as any)?.terms_of_service,
                refundPolicy: (websiteData as any)?.refund_policy,
              }}
              social={{
                facebookUrl: (websiteData as any)?.facebookUrl ?? null,
                twitterUrl: (websiteData as any)?.twitterUrl ?? null,
                instagramUrl: (websiteData as any)?.instagramUrl ?? null,
                linkedinUrl: (websiteData as any)?.linkedinUrl ?? null,
                youtubeUrl: (websiteData as any)?.youtubeUrl ?? null,
              }}
            />

            <Toaster />
          </MaxWidthWrapper>
        </PaymentProvider>
      </TenantProvider>
    </div>
  );
}
