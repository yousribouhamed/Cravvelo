interface TenantAboutProps {
  params: {
    tenant: string;
  };
}

export default function TenantAbout({ params }: TenantAboutProps) {
  const { tenant } = params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">About {tenant}</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          This is the about page for {tenant}.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tenant Details</h2>
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-gray-900">Tenant Name:</dt>
              <dd className="text-gray-600">{tenant}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Subdomain:</dt>
              <dd className="text-gray-600">{tenant}.localhost:3000</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Status:</dt>
              <dd className="text-green-600">Active</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
