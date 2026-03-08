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
import { FacebookPixel } from "@/components/facebook-pixel";
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
  const tenant = `${tenantKey}.cravvelo.com`;
  const websiteData = await getTenantWebsite(tenant);

  const title =
    (websiteData as any)?.name ??
    (websiteData as any)?.Account?.user_name ??
    "Academy";

  const favicon = (websiteData as any)?.favicon as string | undefined | null;

  const metadata: Metadata = { title };

  if (favicon) {
    metadata.icons = {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    };
  }

  return metadata;
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant: tenantKey } = await params;

  const tenant = `${tenantKey}.cravvelo.com`;

  const [{ isValid }, websiteData, user] = await Promise.all([
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

  return (
    <div
      className="min-h-screen h-fit bg-neutral-50 dark:bg-[#0E0E10] text-neutral-900 dark:text-neutral-200"
      style={
        {
          "--primary-color": websiteData.primaryColor || "#7C3AED",
        } as React.CSSProperties
      }
    >
      <VisitTracker tenant={tenant} />
      <FacebookPixel pixelId={websiteData.facebookPixelId ?? null} />
      <TenantProvider website={websiteData} tenant={tenant} user={user}>
        <PaymentProvider>
          <SalesBanner />
          <Header />
          <MaxWidthWrapper className="flex flex-col min-h-[calc(100vh-70px)]">
            <main className="flex-1">{children}</main>
            <Footer
              brandName={(websiteData as any)?.name || (websiteData as any)?.Account?.user_name}
              legal={{
                privacyPolicy: (websiteData as any)?.privacy_policy,
                termsOfService: (websiteData as any)?.terms_of_service,
                refundPolicy: (websiteData as any)?.refund_policy,
              }}
            />

            <Toaster />
          </MaxWidthWrapper>
        </PaymentProvider>
      </TenantProvider>
    </div>
  );
}
