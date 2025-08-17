"use client";

import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";

const getLinks = () => {
  const links = [
    {
      name: "تفاصيل الاشتراك",
      href: `/pricing`,
    },
    {
      name: "الفواتير",
      href: `/settings/billing`,
    },
  ];

  return links;
};

function PaymentSettingsHeader({ className, ...props }: ExamplesNavProps) {
  const links = getLinks();
  const pathname = usePathname();

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
              (pathname === item.href && pathname !== "/") ||
                (index === 0 && pathname === "/")
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

export default PaymentSettingsHeader;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
