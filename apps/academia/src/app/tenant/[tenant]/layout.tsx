import Header from "@/components/layout/header";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTenantWebsite, validateTenant } from "@/actions/tanant";
import { TenantProvider } from "@/contexts/tanant";
import Providers from "@/components/providers";
import MaxWidthWrapper from "@/components/max-with-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TenantLayoutProps {
  children: ReactNode;
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant: tanantKey } = await params;

  const tenant = `${tanantKey}.cravvelo.com`;

  const { isValid } = await validateTenant(tenant);

  if (!isValid) {
    notFound();
  }

  const websiteData = await getTenantWebsite(tenant);

  if (!websiteData) {
    notFound();
  }

  return (
    <div
      className="min-h-screen bg-neutral-50 dark:bg-[#0E0E10] text-neutral-900 dark:text-neutral-200"
      style={
        {
          "--primary-color": websiteData.primaryColor || "#7C3AED",
        } as React.CSSProperties
      }
    >
      <TenantProvider website={websiteData} tenant={tenant}>
        <Providers>
          <Header />
          <MaxWidthWrapper className="flex flex-col">
            <ScrollArea className="flex-1 h-[calc(100vh-theme(spacing.16))]">
              {children}
            </ScrollArea>
          </MaxWidthWrapper>
        </Providers>
      </TenantProvider>
    </div>
  );
}
