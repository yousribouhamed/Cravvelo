import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { buttonVariants } from "@ui/components/ui/button";
import { X } from "lucide-react";
import SettingsSidebarView from "@/src/features/settings/sidebar-view";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { cookies } from "next/headers";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = cookies().get("lang")?.value ?? "en";

  return (
    <div className="w-full h-screen  bg-black/40 fixed inset-0">
      <div className="w-full modal-enter flex h-fit flex-col gap-y-4  bg-[#F3F3F3]   fixed bottom-0 left-0 right-0 top-5 rounded-t-2xl shadow border-input">
        <ScrollArea className="w-full h-screen flex flex-col relative ">
          <Link
            href={"/"}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "absolute top-5 right-5"
            )}
          >
            <X className="w-4 h-4 text-[#303030] " />
          </Link>

          <div className="h-fit max-w-5xl mx-auto  w-full py-10">
            <div className="w-full h-fit flex  gap-x-4">
              {lang === "en" ? (
                <>
                  <SettingsSidebarView lang={lang} />
                  {children}
                </>
              ) : (
                <>
                  {children}
                  <SettingsSidebarView lang={lang} />
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
