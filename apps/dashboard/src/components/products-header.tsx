"use client";

import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { getValueFromUrl } from "../lib/utils";
import { useTranslations } from "next-intl";

function ProductsHeader({ className, ...props }: ExamplesNavProps) {
  const pathname = usePathname();
  const t = useTranslations("products.productHeader.links");
  const courseId = getValueFromUrl(pathname, 2);

  const links = [
    {
      name: t("productContent"),
      href: `/products/${courseId}/content`,
    },
    {
      name: t("pricing"),
      href: `/products/${courseId}/pricing`,
    },
    {
      name: t("previewAndPublish"),
      href: `/products/${courseId}/publishing`,
    },
  ];

  return (
    <div className="relative w-full my-2 h-[60px]">
      <div
        className={cn(
          "mb-2 w-full flex items-center justify-start rounded-lg h-full border",
          "bg-card border-border"
        )}
      >
        {links.map((item, index) => {
          const isActive = pathname?.includes(item.href) || (index === 0 && pathname === "/");
          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                "flex h-[60px] items-center justify-center px-4 text-center text-sm transition-colors hover:text-primary text-foreground",
                isActive
                  ? "border-b-2 border-[#F0B110] font-bold text-foreground dark:text-white"
                  : "border-b border-border"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export default ProductsHeader;
