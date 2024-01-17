"use client";

import { Button } from "@ui/components/ui/button";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "باني الدورة",
    href: "/courses/id/chapters",
  },
  {
    name: "إعدادات الدورة",
    href: "/",
  },
  {
    name: "المحتوى التدريجي",
    href: "/courses",
  },
  {
    name: "التسعير",
    href: "/courses",
  },

  {
    name: "تفاعل الطلاب",
    href: "/courses",
  },
  {
    name: "المعاينة والنشر",
    href: "/courses",
  },
];

function CourseHeader({ className, ...props }: ExamplesNavProps) {
  const pathname = usePathname();
  return (
    <div className="relative shadow w-full my-4 h-[60px]">
      <div
        className={cn(
          "mb-4 w-fit flex items-center ",
          ` w-full  bg-white  border flex items-center justify-start   rounded-lg  h-full`
        )}
      >
        {links.map((example, index) => (
          <Link
            href={example.href}
            key={example.href}
            className={cn(
              "flex h-[60px] items-center justify-center border-b px-4 text-center text-sm transition-colors hover:text-primary",
              pathname?.startsWith(example.href) ||
                (index === 0 && pathname === "/")
                ? "border-b-2 border-[#F0B110] text-black font-bold"
                : ""
            )}
          >
            {example.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CourseHeader;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
