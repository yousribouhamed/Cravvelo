"use client";

import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getValueFromUrl } from "../../../lib/utils";

function CourseHeader({ className, ...props }: ExamplesNavProps) {
  const pathname = usePathname();
  const t = useTranslations("courses.courseHeader");
  const courseId = getValueFromUrl(pathname, 2);

  const links = [
    {
      name: t("links.courseBuilder"),
      href: `/courses/${courseId}/chapters`,
    },
    {
      name: t("links.settings"),
      href: `/courses/${courseId}/settings`,
    },
    // {
    //   name: "المحتوى التدريجي",
    //   href: `/courses/${courseId}/drip-content`,
    // },
    {
      name: t("links.pricing"),
      href: `/courses/${courseId}/pricing`,
    },
    {
      name: t("links.studentEngagement"),
      href: `/courses/${courseId}/students-management`,
    },
    {
      name: t("links.previewAndPublish"),
      href: `/courses/${courseId}/publishing`,
    },
  ];

  return (
    <div className="relative w-full overflow-x-auto overflow-y-hidden my-4 h-[60px]">
      <div
        className={cn(
          "mb-4 w-full flex items-center",
          `bg-card border flex items-center justify-start rounded-lg h-[60px]`
        )}
      >
        {links.map((item, index) => {
          const isActive = pathname?.includes(item.href) || (index === 0 && pathname === "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex w-auto h-[60px] items-center justify-center px-3 sm:px-6 text-center text-xs sm:text-sm transition-colors hover:text-primary whitespace-nowrap text-foreground relative",
                isActive
                  ? "border-b-2 border-[#F0B110] text-foreground font-bold dark:text-white"
                  : "border-b dark:border-gray-700"
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

export default CourseHeader;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
