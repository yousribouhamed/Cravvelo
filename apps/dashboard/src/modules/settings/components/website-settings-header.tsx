"use client";

import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

function WebsiteSettingsHeader({ className, ...props }: ExamplesNavProps) {
  const t = useTranslations("pages");
  const pathname = usePathname();
  const courseId = getValueFromUrl(pathname, 2);
  
  const links = useMemo(
    () => [
      {
        name: t("appearance"),
        href: `/settings/website-settings/appearance`,
      },
      {
        name: t("domain"),
        href: `/settings/website-settings`,
      },
      {
        name: t("legal"),
        href: `/settings/website-settings/legal`,
      },
      {
        name: t("marketing"),
        href: `/settings/website-settings/marketing`,
      },
    ],
    [t]
  );

  return (
    <div className="relative w-full my-4 h-[60px]">
      <div
        className={cn(
          "mb-4 w-full flex items-center justify-start rounded-lg h-full border",
          "bg-white text-black dark:bg-[#0A0A0C] dark:text-zinc-50"
        )}
      >
        {links.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-[60px] items-center justify-center px-4 text-center text-sm transition-colors",
              "hover:text-primary",
              pathname === item.href
                ? "border-b-2 border-[#F0B110] font-semibold text-black dark:text-white"
                : "text-zinc-600 dark:text-zinc-400"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WebsiteSettingsHeader;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
