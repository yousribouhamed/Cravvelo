"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Navigation {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface HeaderProps {
  backTo?: string;
  title?: string;
  navigations?: Navigation[];
}

export default function Header({ backTo, title, navigations }: HeaderProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="w-full bg-white border-b border-gray-100">
        <h1 className="text-xl font-medium text-gray-900 px-6 py-4">{title}</h1>
      </div>

      <div className="w-full h-12 flex items-center gap-6 bg-white px-6 border-b border-gray-50">
        {backTo && (
          <Link
            href={backTo}
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back
          </Link>
        )}

        {navigations &&
          navigations.map((nav, index) => {
            const isActive = pathname === nav.href;

            return (
              <Link
                key={index}
                href={nav.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors relative py-3 ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {nav.icon}
                {nav.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-px bg-gray-900"></span>
                )}
              </Link>
            );
          })}
      </div>
    </>
  );
}
