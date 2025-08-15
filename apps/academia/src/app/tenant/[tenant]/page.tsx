interface TenantPageProps {
  params: {
    tenant: string;
  };
}

export default function TenantPage({ params }: TenantPageProps) {
  const { tenant } = params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to {tenant}</h1>
      <p className="text-gray-600">This is the homepage for tenant: {tenant}</p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold">Tenant Information:</h2>
        <p>Tenant ID: {tenant}</p>
        <p>URL: {tenant}.localhost:3000</p>
      </div>
    </div>
  );
}

// Optional: Generate metadata for each tenant
export function generateMetadata({ params }: TenantPageProps) {
  return {
    title: `${params.tenant} - Multi-tenant App`,
    description: `Welcome to ${params.tenant}'s space`,
  };
}
