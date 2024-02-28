"use client";

import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { getValueFromUrl } from "../lib/utils";
import React from "react";

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

function CourseStepper({ className, ...props }: ExamplesNavProps) {
  const pathname = usePathname();

  const courseId = getValueFromUrl(pathname, 2);

  const links = getLinks({ id: courseId });

  return (
    <div className="relative  w-full my-4 h-[100px]">
      <div
        className={cn(
          "mb-4 w-fit flex items-center ",
          ` w-full  bg-white  border flex items-center justify-center   rounded-lg  h-full p-4 gap-x-4`
        )}
      >
        {links.map((item) => {
          return (
            <div className="flex flex-col justify-center items-center gap-y-2 w-[100px] ">
              <div className="bg-primary z-[10] w-[30px] h-[30px] rounded-[50%] flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <Link
                href={item.href}
                prefetch={false}
                className="text-black font-semibold text-sm"
              >
                {item.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CourseStepper;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
