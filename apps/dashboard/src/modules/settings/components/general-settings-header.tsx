"use client";

import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

function GeneralSettingsHeader({ className, ...props }: ExamplesNavProps) {
  const t = useTranslations("pages");
  const pathname = usePathname();
  const courseId = getValueFromUrl(pathname, 2);
  
  const links = useMemo(
    () => [
      {
        name: t("appearance"),
        href: `/settings`,
      },
      {
        name: t("profile"),
        href: `/settings/profile`,
      },
      {
        name: t("subscription"),
        href: `/settings/subscription`,
      },
      {
        name: t("invoices"),
        href: `/settings/invoices`,
      },
    ],
    [t]
  );

  const isActive = (href: string) => {
    // Exact match
    if (pathname === href) return true;
    // For invoices, also match invoice detail pages
    if (href === "/settings/invoices" && pathname.startsWith("/settings/invoices")) {
      return true;
    }
    // Subscription
    if (href === "/settings/subscription" && pathname.startsWith("/settings/subscription")) {
      return true;
    }
    return false;
  };

  return (
    <div className="relative w-full my-4 h-[60px] min-w-0">
      <div
        className={cn(
          "mb-4 w-full min-w-0 flex items-center justify-start rounded-lg h-full border border-border overflow-x-auto overscroll-x-contain",
          "bg-card text-foreground scroll-snap-x scroll-snap-mandatory [scrollbar-gutter:stable]"
        )}
      >
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-[60px] min-w-[5.5rem] items-center justify-center px-4 text-center text-sm transition-colors shrink-0 snap-center snap-always",
              "hover:text-primary whitespace-nowrap",
              isActive(item.href)
                ? "border-b-2 border-primary font-semibold text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GeneralSettingsHeader;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
