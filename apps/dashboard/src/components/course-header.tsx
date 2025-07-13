"use client";

import { Button } from "@ui/components/ui/button";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { getValueFromUrl } from "../lib/utils";

const getLinks = ({ id }: { id: string }) => {
  const links = [
    {
      name: "باني الدورة",
      href: `/courses/${id}/chapters`,
    },
    {
      name: "إعدادات الدورة",
      href: `/courses/${id}/settings`,
    },
    // {
    //   name: "المحتوى التدريجي",
    //   href: `/courses/${id}/drip-content`,
    // },
    {
      name: "التسعير",
      href: `/courses/${id}/pricing`,
    },

    {
      name: "تفاعل الطلاب",
      href: `/courses/${id}/students-management`,
    },
    {
      name: "المعاينة والنشر",
      href: `/courses/${id}/publishing`,
    },
  ];

  return links;
};

function CourseHeader({ className, ...props }: ExamplesNavProps) {
  const pathname = usePathname();

  const courseId = getValueFromUrl(pathname, 2);

  const links = getLinks({ id: courseId });

  return (
    <div className="relative  w-full overflow-x-auto overflow-y-hidden   my-4 h-[60px]">
      <div
        className={cn(
          "mb-4 w-fit flex items-center ",
          ` w-fit  bg-white  border flex items-center justify-start    rounded-lg  h-[60px]`
        )}
      >
        {links.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex w-fit min-w-[100px] h-[60px] items-center justify-center border-b px-1 sm:px-4 text-center text-xs sm:text-sm transition-colors hover:text-primary",
              pathname?.includes(item.href) || (index === 0 && pathname === "/")
                ? "border-b-2 border-[#F0B110] text-black font-bold"
                : ""
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CourseHeader;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
