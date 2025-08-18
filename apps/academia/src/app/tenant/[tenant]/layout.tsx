import Header from "@/components/layout/header";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTenantWebsite, validateTenant } from "@/actions/tanant";
import { TenantProvider } from "@/contexts/tenant";
import Providers from "@/components/providers";
import MaxWidthWrapper from "@/components/max-with-wrapper";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import "@smastrom/react-rating/style.css";

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
  const { tenant: tenantKey } = await params;

  const tenant = `${tenantKey}.cravvelo.com`;

  const [{ isValid }, websiteData, user] = await Promise.all([
    validateTenant(tenant),
    getTenantWebsite(tenant),
    getCurrentUser(),
  ]);


  console.log("this is the current logged in user:");
  console.log(user);

  if (!isValid) {
    notFound();
  }

  if (!websiteData) {
    notFound();
  }

  return (
    <div
      dir={"rtl"}
      className="min-h-screen h-fit bg-neutral-50 dark:bg-[#0E0E10] text-neutral-900 dark:text-neutral-200"
      style={
        {
          "--primary-color": websiteData.primaryColor || "#7C3AED",
        } as React.CSSProperties
      }
    >
      <TenantProvider website={websiteData} tenant={tenant} user={user}>
        <Providers>
          <Header />
          <MaxWidthWrapper className="flex flex-col">
            {children}
          </MaxWidthWrapper>
        </Providers>
      </TenantProvider>
    </div>
  );
}
