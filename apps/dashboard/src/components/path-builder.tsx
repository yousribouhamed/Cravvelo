"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";

interface Props {
  links: { name: string; url: string }[];
}

const PathBuilder: FC<Props> = ({ links }) => {
  // /courses/b378f6c9-fdf4-4bb5-bf2a-21f595af0e9b/chapters/123/add-text

  return (
    <div className="w-full min-h-[50px] flex mb-6 gap-x-4 items-center ">
      {links.map((item, index) => (
        <>
          <Link key={item.name} href={item.url}>
            {item.name}
          </Link>
          {index !== links.length - 1 && <ChevronLeft className="w-4 h-4" />}
        </>
      ))}
    </div>
  );
};

export default PathBuilder;
