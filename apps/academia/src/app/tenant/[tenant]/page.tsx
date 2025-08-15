interface TenantPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant } = await params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to {tenant}</h1>
      <p className="text-gray-600">This is the homepage for tenant: {tenant}</p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold">Tenant Information:</h2>
        <p>Tenant ID: {tenant}</p>
        <p className="text-black">URL: {tenant}.localhost:3000</p>
      </div>
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
