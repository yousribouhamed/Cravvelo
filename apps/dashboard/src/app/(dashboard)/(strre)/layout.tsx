import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { buttonVariants } from "@ui/components/ui/button";
import { X } from "lucide-react";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import SettingsSidebarView from "@/src/modules/settings/sidebar-view";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen z-[999999] bg-black/40 fixed inset-0">
      <div className="w-full flex flex-col gap-y-4 bg-[#FAFAFA] fixed bottom-0 left-0 right-0 top-5 rounded-t-2xl shadow border-input">
        <MaxWidthWrapper>
          <div className="w-full h-[50px] flex items-center justify-end">
            <Link
              href={"/"}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <X className="w-4 h-4 text-gray-700" />
            </Link>
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper>
          <div className="w-full h-full flex ">
            {/* create a sidebar that will navigate throught diffrent pages  */}
            <SettingsSidebarView />
          </div>
        </MaxWidthWrapper>

        {/* create the basic pages such as profile domains apearance payment methods and so on */}
      </div>
    </div>
  );
}
