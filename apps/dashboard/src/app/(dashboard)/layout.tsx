import { Sidebar } from "../../components/layout/Sidebar";
import ConnectionStatusAlert from "@/src/components/connection-status-alert";
import { constructMetadata } from "@/src/lib/utils";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getCurrentUserSafe } from "@/src/lib/clerk-utils";
import { redirect } from "next/navigation";
import { getUserLocale } from "@/src/services/locale";

export const metadata = constructMetadata();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Additional server-side protection layer (middleware already protects at edge)
  // This provides defense in depth - check user exists even if middleware passes
  const user = await getCurrentUserSafe();
  if (!user) {
    redirect("/sign-in");
  }
  
  const locale = await getUserLocale();
  const isRTL = locale === "ar";
  
  // Dynamic positioning based on locale
  const sidebarPosition = isRTL ? "right-0" : "left-0";
  const mainMargin = isRTL ? "lg:mr-[250px]" : "lg:ml-[250px]";
  
  return (
    <ConnectionStatusAlert>
      <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] dark:bg-black ">
        <Sidebar className={`lg:block lg:w-[250px] lg:fixed ${sidebarPosition} top-0 bottom-0`} />
        <main className={`w-full lg:w-[calc(100%-250px)] ${mainMargin} px-4 md:px-10`}>
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
