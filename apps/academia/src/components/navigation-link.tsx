"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationLinkProps {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

export default function NavigationLink({
  href,
  label,
  className = "",
  onClick,
}: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseClasses =
    "relative text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium h-full flex items-center";

  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <Link href={href} className={combinedClasses} onClick={onClick}>
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-current"></span>
      )}
    </Link>
  );
}
