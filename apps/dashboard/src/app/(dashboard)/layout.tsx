import { CrispChat } from "@/src/components/crisp-chat";
import { Sidebar } from "../../components/layout/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import ConnectionStatusAlert from "@/src/components/connection-status-alert";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConnectionStatusAlert>
        <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA]  ">
          <CrispChat />
          <Sidebar className="  lg:block lg:w-[250px] lg:fixed right-5  top-0  bottom-0 " />

          <main className=" w-full lg:w-[calc(100%-250px)] lg:mr-[250px]  px-10 ">
            {children}
          </main>
        </div>
      </ConnectionStatusAlert>
    </ClerkProvider>
  );
}
