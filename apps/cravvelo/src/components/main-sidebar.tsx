import { SIDEBAR_ITEMS } from "@/config/sidebar-items";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { getCurrentAdmin } from "@/modules/auth/actions/auth.action";

export default async function MainSidebar() {
  const admin = await getCurrentAdmin();

  console.log(admin);

  return (
    <div className="w-[80px] px-3 py-4 h-full flex flex-col items-center">
      {/* Logo section with proper spacing */}
      <div className="mb-6">
        <Image
          src={"/cravvelo-logo.svg"}
          alt={"cravvelo logo"}
          width={40}
          height={40}
        />
      </div>
      {admin && (
        <div className="flex flex-col gap-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            return (
              <Tooltip key={item.slug} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.slug}
                    className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-muted rounded-xl transition-colors duration-200"
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={12}
                  className="bg-card text-black dark:text-white  p-4 rounded-lg shadow-lg font-medium text-sm"
                >
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
}
