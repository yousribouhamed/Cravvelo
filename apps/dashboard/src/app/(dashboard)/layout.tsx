import { Sidebar } from "../../components/layout/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import ConnectionStatusAlert from "@/src/components/connection-status-alert";
import { constructMetadata } from "@/src/lib/utils";
import { cookies } from "next/headers";

export const metadata = constructMetadata();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = cookies().get("lang")?.value ?? "en";

  const ltr = lang === "ar" ? false : true;

  return (
    <ClerkProvider>
      <ConnectionStatusAlert>
        <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] ">
          {/* <CrispChat /> */}
          <Sidebar
            className={` lg:block lg:w-[250px] lg:fixed  top-0  bottom-0 ${
              ltr ? "left-5" : "right-5 "
            } `}
            lang={lang}
          />
          <main
            className={` w-full lg:w-[calc(100%-250px)]  px-4 md:px-10 ${
              ltr ? "lg:ml-[250px]" : " lg:mr-[250px]"
            } `}
          >
            {children}
          </main>
        </div>
      </ConnectionStatusAlert>
    </ClerkProvider>
  );
}
