import Banner from "@/components/banner";

interface TenantPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant } = await params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to {tenant} 👋</h1>

      <Banner />
      <h1 className="text-3xl font-bold mb-4">Latest added products</h1>
    </div>
  );
}

export async function generateMetadata({ params }: TenantPageProps) {
  const awaitedParams = await params;
  return {
    title: `${awaitedParams.tenant} - Multi-tenant App`,
    description: `Welcome to ${awaitedParams.tenant}'s space`,
  };
}
