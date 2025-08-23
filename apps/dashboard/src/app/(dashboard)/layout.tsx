import { Sidebar } from "../../components/layout/Sidebar";
import ConnectionStatusAlert from "@/src/components/connection-status-alert";
import { constructMetadata } from "@/src/lib/utils";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";

export const metadata = constructMetadata();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConnectionStatusAlert>
      <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] dark:bg-black ">
        <Sidebar className="lg:block lg:w-[250px] lg:fixed right-0 top-0 bottom-0 " />
        <main className="w-full lg:w-[calc(100%-250px)] lg:mr-[250px] px-4 md:px-10">
          <MaxWidthWrapper>
            <main className="w-full flex flex-col justify-start">
              {children}
            </main>
          </MaxWidthWrapper>
        </main>
      </div>
    </ConnectionStatusAlert>
  );
}
