import { Sidebar } from "../../components/layout/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import ConnectionStatusAlert from "@/src/components/connection-status-alert";
import { constructMetadata } from "@/src/lib/utils";

export const metadata = constructMetadata();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConnectionStatusAlert>
        <div className="flex w-full min-h-screen gap-x-2 bg-gray-50">
          <Sidebar className="lg:block lg:w-[250px] lg:fixed right-0 top-0 bottom-0" />
          <main className="w-full lg:w-[calc(100%-250px)] lg:mr-[250px] px-4 md:px-10">
            {children}
          </main>
        </div>
      </ConnectionStatusAlert>
    </ClerkProvider>
  );
}
