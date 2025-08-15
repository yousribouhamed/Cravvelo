"use client";

import { useState } from "react";
import MaxWidthWrapper from "../max-with-wrapper";
import { useTenant } from "@/contexts/tanant";
import {
  useTenantSettings,
  useTenantAccount,
  useTenantBranding,
} from "@/hooks/use-tanant";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { tenant } = useTenant();
  const { logo, name, primaryColor } = useTenantBranding();
  const { userName, verified, avatarUrl } = useTenantAccount();
  const { showCoursesOnHome, showProductsOnHome } = useTenantSettings();

  const navigationLinks = [
    { href: `/`, label: "Home", show: true },
    { href: `/courses`, label: "Courses", show: showCoursesOnHome },
    {
      href: `/products`,
      label: "Products",
      show: showProductsOnHome,
    },
    { href: `/about`, label: "About", show: true },
    { href: `/contact`, label: "Contact", show: true },
  ].filter((link) => link.show);

  return (
    <div className="w-full h-[70px] bg-white border-b dark:bg-zinc-900 sticky top-0 z-50">
      <MaxWidthWrapper className="h-full">
        <div className="w-full h-full flex items-center justify-between">
          {/* Logo/Brand Section */}
          <Link
            href={`/${tenant}`}
            className="flex items-center gap-x-3 hover:opacity-80 transition-opacity"
          >
            {logo ? (
              <div className="relative w-10 h-10">
                <Image
                  src={logo}
                  alt={name || "Academy Logo"}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : avatarUrl ? (
              <div className="relative w-10 h-10">
                <Image
                  src={avatarUrl}
                  alt={userName || "Academy"}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {(name || userName || "A").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {name || userName || "Academy"}
              </h1>
              {verified && (
                <div className="flex items-center gap-x-1">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.259.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs text-blue-500 font-medium">
                    Verified
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center justify-end gap-x-4">
            <Link href={`/${tenant}/auth/signin`}>
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                Sign In
              </button>
            </Link>
            <Link href={`/${tenant}/auth/signup`}>
              <button
                className="px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[70px] left-0 right-0 bg-white dark:bg-zinc-900 border-b shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-y-2 pt-4 border-t">
                <Link href={`/${tenant}/auth/signin`}>
                  <button
                    className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium text-left"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </button>
                </Link>
                <Link href={`/${tenant}/auth/signup`}>
                  <button
                    className="w-full px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
