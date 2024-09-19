"use client";

import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { getValueFromUrl } from "../../../../lib/utils";
import Ripples from "react-ripples";

const getLinks = ({ id }: { id: string }) => {
  const links = [
    {
      name: "إعدادات المجال",
      href: `/settings/website-settings`,
    },
    {
      name: "  إعدادات المظهر ",
      href: `/settings/website-settings/appearance`,
    },

    {
      name: " إعدادات القانوني ",
      href: `/settings/website-settings/legal`,
    },
    {
      name: "الصلاحيات",
      href: `/settings/website-settings/marketing`,
    },
  ];

  return links;
};

function WebsiteSettingsHeader({ className, ...props }: ExamplesNavProps) {
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
          <Ripples key={item.href} color="#fc69005c" during={1200}>
            <Link
              href={item.href}
              className={cn(
                "flex h-[60px] items-center justify-center border-b px-4 text-center text-sm transition-colors  hover:text-primary",
                (pathname === item.href && pathname !== "/") ||
                  (index === 0 && pathname === "/")
                  ? "border-b-2 border-[#F0B110] text-black font-bold"
                  : ""
              )}
            >
              {item.name}
            </Link>
          </Ripples>
        ))}
      </div>
    </div>
  );
}

export default WebsiteSettingsHeader;

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}
