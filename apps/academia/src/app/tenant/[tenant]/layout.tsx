import { ReactNode } from "react";

interface TenantLayoutProps {
  children: ReactNode;
  params: {
    tenant: string;
  };
}

export default function TenantLayout({ children, params }: TenantLayoutProps) {
  const { tenant } = params;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">{tenant}</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Tenant
              </span>
            </div>
            <nav className="flex space-x-4">
              <a
                href={`http://${tenant}.localhost:3000`}
                className="text-gray-600 hover:text-gray-900"
              >
                Home
              </a>
              <a
                href={`http://${tenant}.localhost:3000/about`}
                className="text-gray-600 hover:text-gray-900"
              >
                About
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
