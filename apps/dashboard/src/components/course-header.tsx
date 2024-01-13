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

interface CourseHeaderAbdullahProps {}

const CourseHeader: FC = ({}) => {
  return (
    <div className="w-full my-4 bg-white shadow border flex items-center justify-between pl-4 rounded-lg  h-[53px]">
      <div className="w-fit h-full flex items-center justify-start gap-x-4">
        {links.map((item) => (
          <Link
            className={cn(buttonVariants({ variant: "ghost" }))}
            href={item.url}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <Button size="icon" variant="secondary">
        <EyeOpenIcon className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">visite website</span>
      </Button>
    </div>
  );
};

export default CourseHeader;
