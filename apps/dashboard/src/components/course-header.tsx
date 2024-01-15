"use client";

import type { FC } from "react";

import { Button, buttonVariants } from "@ui/components/ui/button";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@ui/lib/utils";

const links = [
  {
    name: "باني الدورة",
    url: "",
  },
  {
    name: "إعدادات الدورة",
    url: "",
  },
  {
    name: "المحتوى التدريجي",
    url: "",
  },
  {
    name: "التسعير",
    url: "",
  },

  {
    name: "تفاعل الطلاب",
    url: "",
  },
  {
    name: "المعاينة والنشر",
    url: "",
  },
];

const CourseHeader: FC = ({}) => {
  return (
    <div className="w-full my-4 bg-white  border flex items-center justify-between pl-4 rounded-lg  h-[60px]">
      <div className="w-fit h-full flex items-center justify-start gap-x-4">
        {links.map((item) => (
          <Link
            key={item.name}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "border-b-2 py-0 h-full rounded-[0] text-black font-bold  border-b-[#F0B110]"
            )}
            href={item.url}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <Button variant="secondary" className="gap-x-3">
        معاينة
        <EyeOpenIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
        <span className="sr-only">visite website</span>
      </Button>
    </div>
  );
};

export default CourseHeader;
