import Header from "@/components/layout/header";
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

  const favicon = (websiteData as any)?.favicon as string | undefined | null;
  if (!favicon) return {};

  return {
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
  };
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
      <TenantProvider website={websiteData} tenant={tenant} user={user}>
        <PaymentProvider>
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
