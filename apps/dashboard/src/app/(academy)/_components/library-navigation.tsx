"use client";

import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";

const getLinks = () => {
  const links = [
    {
      name: "الدورات",
      href: `/student-library`,
    },
    {
      name: "المنتجات الرقمية",
      href: `/student-library/products`,
    },
    {
      name: " الشهادات",
      href: `/student-library/certificates`,
    },
  ];

  return links;
};

function LibraryNavigation({ className, ...props }: ExamplesNavProps) {
  const pathname = usePathname();

  const courseId = getValueFromUrl(pathname, 2);

  const links = getLinks();

  return (
    <div className="relative  w-full my-4 h-[60px]">
      <div
        className={cn(
          "mb-4 w-fit flex items-center ",
          ` w-full  bg-white max-w-2xl ml-auto shadow border flex items-center justify-start   rounded-lg  h-full`
        )}
      >
        {links.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            className={cn(
              "flex h-[60px] items-center justify-center border-b px-4 text-center text-sm transition-colors ",
              pathname?.includes(item.href) || (index === 0 && pathname === "/")
                ? "border-b-2 border-black text-black font-bold"
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

export default LibraryNavigation;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
