"use client";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";

interface NavLink {
  name: string;
  href: string;
}

interface GenericHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  links: NavLink[];
}

function GenericHeader({ links, className, ...props }: GenericHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="relative w-full my-4 h-[60px]" {...props}>
      <div
        className={cn(
          "mb-4 w-full flex items-center justify-start rounded-lg h-full border",
          "bg-card",
          className
        )}
      >
        {links.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-[60px] items-center justify-center px-4 text-center text-sm transition-colors",
              "hover:text-primary",
              pathname === item.href
                ? "border-b-2 border-[#F0B110] font-semibold text-black dark:text-white"
                : "text-zinc-600 dark:text-zinc-400"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GenericHeader;
