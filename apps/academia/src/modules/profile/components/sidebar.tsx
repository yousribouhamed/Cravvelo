"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Award,
  BookOpen,
  Package,
  CreditCard,
} from "lucide-react";
import { useTenantBranding } from "@/hooks/use-tenant";
import { useTranslations } from "next-intl";

export interface ProfileSidebarNavContentProps {
  /** Called when a nav link is clicked (e.g. to close mobile Sheet) */
  onLinkClick?: () => void;
}

/** Shared nav links + user block; used by desktop sidebar and mobile Sheet */
export function ProfileSidebarNavContent({
  onLinkClick,
}: ProfileSidebarNavContentProps) {
  const pathname = usePathname();
  const { primaryColor } = useTenantBranding();
  const tProfile = useTranslations("profile");
  const tMenu = useTranslations("profile.menu");

  const Links = [
    { url: "/profile", name: tMenu("profile"), icon: User },
    { url: "/profile/certificate", name: tMenu("certificates"), icon: Award },
    { url: "/profile/courses", name: tMenu("courses"), icon: BookOpen },
    { url: "/profile/products", name: tMenu("products"), icon: Package },
    { url: "/profile/payments", name: tMenu("payments"), icon: CreditCard },
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {tProfile("dashboard")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {tProfile("manageAccount")}
        </p>
      </div>

      <nav className="space-y-1">
        {Links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.url;

          return (
            <Link
              key={link.url}
              href={link.url}
              onClick={onLinkClick}
              className={`
                group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1A1A1D] hover:text-gray-900 dark:hover:text-white"
                }
              `}
              style={
                isActive
                  ? { backgroundColor: primaryColor }
                  : undefined
              }
            >
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                }`}
              />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-200/60 dark:border-[#1A1A1D]">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1A1A1D] dark:to-[#1F1F23]">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {tProfile("user")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tProfile("premiumMember")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

interface SidebarProps {}

export default function ProfileSidebar({}: SidebarProps) {
  return (
    <div className="w-full bg-card text-card-foreground border border-gray-200/80 dark:border-[#1A1A1D] rounded-2xl p-6 shadow-sm">
      <ProfileSidebarNavContent />
    </div>
  );
}
