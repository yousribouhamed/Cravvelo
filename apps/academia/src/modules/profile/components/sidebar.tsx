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
  Share2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTenantSettings } from "@/hooks/use-tenant";

export interface ProfileSidebarNavContentProps {
  /** Called when a nav link is clicked (e.g. to close mobile Sheet) */
  onLinkClick?: () => void;
}

/** Shared nav links + user block; used by desktop sidebar and mobile Sheet */
export function ProfileSidebarNavContent({
  onLinkClick,
}: ProfileSidebarNavContentProps) {
  const pathname = usePathname();
  const tProfile = useTranslations("profile");
  const tMenu = useTranslations("profile.menu");
  const { enableReferral } = useTenantSettings();
  const showAffiliateTab = enableReferral === true;

  const Links = [
    { url: "/profile", name: tMenu("profile"), icon: User },
    { url: "/profile/certificate", name: tMenu("certificates"), icon: Award },
    { url: "/profile/courses", name: tMenu("courses"), icon: BookOpen },
    { url: "/profile/products", name: tMenu("products"), icon: Package },
    { url: "/profile/payments", name: tMenu("payments"), icon: CreditCard },
    ...(showAffiliateTab
      ? [{ url: "/profile/affiliates" as const, name: tMenu("affiliates"), icon: Share2 }]
      : []),
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-2">
          {tProfile("dashboard")}
        </h2>
        <p className="text-sm text-muted-foreground">
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
              className={`group relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-[var(--academia-sidebar-item-radius,0.75rem)] ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-all duration-200 shrink-0 ${
                  isActive
                    ? "text-sidebar-primary-foreground"
                    : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                }`}
              />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent text-sidebar-accent-foreground">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground">
              {tProfile("user")}
            </p>
            <p className="text-xs text-muted-foreground">
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
    <div
      className="w-full bg-sidebar text-sidebar-foreground border border-sidebar-border p-6 shadow-sm"
      style={{ borderRadius: "var(--academia-sidebar-radius, 1rem)" }}
    >
      <ProfileSidebarNavContent />
    </div>
  );
}
