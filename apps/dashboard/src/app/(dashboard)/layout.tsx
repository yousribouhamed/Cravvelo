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

  return (
    <ClerkProvider>
      <ConnectionStatusAlert>
        <div
          dir={lang === "en" ? "ltr" : "rtl"}
          className={` flex w-full min-h-screen gap-x-2 bg-[#FAFAFA]  `}
        >
          {/* <CrispChat /> */}
          <Sidebar
            className={` lg:block lg:w-[250px] lg:fixed  top-0  bottom-0 ${
              lang === "en" ? "left-5" : "right-5"
            } `}
            lang={lang}
          />
          <main
            className={` w-full lg:w-[calc(100%-250px)]  px-4 md:px-10 ${
              lang === "en" ? "lg:ml-[250px]" : "lg:mr-[250px]"
            } `}
          >
            {children}
          </main>
        </div>
      </ConnectionStatusAlert>
    </ClerkProvider>
  );
}
