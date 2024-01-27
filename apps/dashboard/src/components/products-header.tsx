"use client";

import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { getValueFromUrl } from "../lib/utils";

const getLinks = ({ id }: { id: string }) => {
  const links = [
    {
      name: "محتوى المنتج",
      href: `/products/${id}/content`,
    },
    {
      name: "إعدادات الدورة",
      href: `/products/${id}/settings`,
    },

    {
      name: "التسعير",
      href: `/products/${id}/pricing`,
    },

    {
      name: "المعاينة والنشر",
      href: `/products/${id}/publishing`,
    },
  ];

  return links;
};

function ProductsHeader({ className, ...props }: ExamplesNavProps) {
  const pathname = usePathname();

  const courseId = getValueFromUrl(pathname, 2);

  const links = getLinks({ id: courseId });

  return (
    <div className="relative  w-full my-4 h-[60px]">
      <div
        className={cn(
          "mb-4 w-fit flex items-center ",
          ` w-full  bg-white  border flex items-center justify-start   rounded-lg  h-full`
        )}
      >
        {links.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            className={cn(
              "flex h-[60px] items-center justify-center border-b px-4 text-center text-sm transition-colors hover:text-primary",
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

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export default ProductsHeader;
