"use client";

import type { FC } from "react";

import { Button, buttonVariants } from "@ui/components/ui/button";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@ui/lib/utils";

import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { ScrollArea, ScrollBar } from "@ui/components/scroll-area";

const links = [
  {
    name: "باني الدورة",
    href: "/courses",
  },
  {
    name: "إعدادات الدورة",
    href: "/courses",
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
    <div className="relative">
      <ScrollArea className="w-full my-4 bg-white  border flex items-center justify-between pl-4 rounded-lg  h-[60px]">
        <div className={cn("mb-4 flex items-center ", className)} {...props}>
          {links.map((example, index) => (
            <Link
              href={example.href}
              key={example.href}
              className={cn(
                "flex h-full items-center justify-center  px-4 text-center text-sm transition-colors hover:text-primary",
                pathname?.startsWith(example.href) ||
                  (index === 0 && pathname === "/")
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground"
              )}
            >
              {example.name}
            </Link>
          ))}
        </div>
        <Button variant="secondary">
          معاينة
          <EyeOpenIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <span className="sr-only">visite website</span>
        </Button>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}

export default CourseHeader;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
