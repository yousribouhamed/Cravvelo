import Header from "@/components/layout/header";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTenantWebsite, validateTenant } from "@/actions/tanant";
import { TenantProvider } from "@/contexts/tanant";
import Providers from "@/components/providers";

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
          "--primary-color": websiteData.color || "#7C3AED",
        } as React.CSSProperties
      }
    >
      <TenantProvider website={websiteData} tenant={tenant}>
        <Providers>
          <Header />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </TenantProvider>
    </div>
  );
}
