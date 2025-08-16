import Header from "@/components/layout/header";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTenantWebsite, validateTenant } from "@/actions/tanant";
import { TenantProvider } from "@/contexts/tanant";

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

  // Validate tenant exists and is active
  const { isValid, website } = await validateTenant(tenant);

  console.log("this is a test to see if valide :");
  console.log(isValid);

  if (!isValid) {
    notFound(); // Return 404 if tenant doesn't exist or is suspended
  }

  // Get the full website data with account info
  const websiteData = await getTenantWebsite(tenant);

  if (!websiteData) {
    notFound();
  }

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-zinc-800"
      style={
        {
          // Apply tenant's custom color scheme if available
          "--primary-color": websiteData.color || "#FC6B00",
        } as React.CSSProperties
      }
    >
      <TenantProvider website={websiteData} tenant={tenant}>
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </TenantProvider>
    </div>
  );
}
