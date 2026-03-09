"use client";

import { useState, useTransition } from "react";
import MaxWidthWrapper from "../max-with-wrapper";
import NavigationLink from "../navigation-link";
import { useTranslations } from "next-intl";
import {
  useTenantBranding,
  useTenantSettings,
  useTenantAccount,
  useIsAuthenticated,
} from "@/hooks/use-tenant";
import Image from "next/image";
import Link from "next/link";
import ProfileDropdown from "@/modules/profile/components/user-dropdown";
import { logoutUser } from "@/modules/auth/actions/auth";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { logo, name, primaryColor } = useTenantBranding();
  const { userName, avatarUrl } = useTenantAccount();
  const { showCoursesOnHome, showProductsOnHome } = useTenantSettings();
  const tNav = useTranslations("nav");

  const navigationLinks = [
    { href: `/`, label: tNav("home"), show: true },
    { href: `/courses`, label: tNav("courses"), show: showCoursesOnHome },
    { href: `/products`, label: tNav("products"), show: showProductsOnHome },
  ].filter((link) => link.show);

  const isAuthenticated = useIsAuthenticated();
  const displayName = name || userName || "Academy";

  return (
    <div className="w-full h-[70px] border-b bg-card text-card-foreground sticky top-0 z-50">
      <MaxWidthWrapper className="h-full flex items-center justify-between relative">
        {/* Left: Logo + Desktop Nav */}
        <div className="h-full flex items-center justify-start gap-x-6 md:gap-x-8 min-w-0">
          <Link
            href={`/`}
            className="flex items-center gap-x-3 hover:opacity-80 transition-opacity shrink-0"
          >
            {logo ? (
              <div className="relative w-20 h-10 sm:w-24 sm:h-12">
                <Image
                  src={logo}
                  alt={displayName}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : avatarUrl ? (
              <div className="relative w-10 h-10">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            ) : null}
          </Link>

          <nav className="hidden h-full relative md:flex items-center gap-x-6">
            {navigationLinks.map((link) => (
              <NavigationLink
                key={link.href}
                href={link.href}
                label={link.label}
              />
            ))}
          </nav>
        </div>

        {/* Right: Desktop Auth/Profile OR Mobile Hamburger (same row) */}
        <div className="flex items-center justify-end gap-x-4 shrink-0">
          {isAuthenticated ? (
            <ProfileDropdown
              onLogout={() => {
                startTransition(() => {
                  logoutUser();
                });
              }}
            />
          ) : (
            <div className="hidden md:flex items-center gap-x-4">
              <Link href={`/login`}>
                <button className="px-4 py-2 cursor-pointer text-card-foreground hover:opacity-90 transition-opacity font-medium">
                  {tNav("signIn")}
                </button>
              </Link>
              <Link href={`/register`}>
                <button
                  className="px-4 py-2 cursor-pointer text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                >
                  {tNav("signUp")}
                </button>
              </Link>
            </div>
          )}

          <button
            type="button"
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-card-foreground hover:opacity-90 transition-opacity"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </MaxWidthWrapper>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[70px] left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className="px-4 py-4 space-y-1">
            {navigationLinks.map((link) => (
              <NavigationLink
                key={link.href}
                href={link.href}
                label={link.label}
                className="flex items-center py-3 min-h-[44px] w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}

            {!isAuthenticated && (
              <div className="flex flex-col gap-y-1 pt-4 border-t border-border">
                <Link href="/login" className="block">
                  <button
                    type="button"
                    className="w-full px-4 py-3 min-h-[44px] text-left text-card-foreground hover:opacity-90 transition-opacity font-medium rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tNav("signIn")}
                  </button>
                </Link>
                <Link href="/register" className="block">
                  <button
                    type="button"
                    className="w-full px-4 py-3 min-h-[44px] text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-center"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tNav("signUp")}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
