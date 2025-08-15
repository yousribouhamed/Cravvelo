import Header from "@/components/layout/header";
import { ReactNode } from "react";

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
  const { tenant } = await params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-800">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
