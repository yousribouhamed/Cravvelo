"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTenantBranding } from "@/hooks/use-tenant";

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
  const { primaryColor } = useTenantBranding();
  // Exact match, or prefix match so /courses and /products stay active on detail pages
  const isActive =
    pathname === href ||
    (href !== "/" && pathname.startsWith(href + "/"));

  const baseClasses =
    "relative text-card-foreground hover:opacity-90 transition-opacity font-medium h-full flex items-center";

  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <Link href={href} className={combinedClasses} onClick={onClick}>
      {label}
      {isActive && (
        <span
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
      )}
    </Link>
  );
}
