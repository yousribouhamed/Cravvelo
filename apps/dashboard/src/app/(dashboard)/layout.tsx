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
        <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] ">
          {/* <CrispChat /> */}
          <Sidebar
            className={` lg:block lg:w-[250px] lg:fixed  top-0  bottom-0 ${"left-5"} `}
            lang={"en"}
          />
          <main
            className={` w-full lg:w-[calc(100%-250px)]  px-4 md:px-10 ${"lg:ml-[250px]"} `}
          >
            {children}
          </main>
        </div>
      </ConnectionStatusAlert>
    </ClerkProvider>
  );
}
