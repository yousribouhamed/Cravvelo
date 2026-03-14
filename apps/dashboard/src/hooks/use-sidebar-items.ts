"use client";

import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";
import {
  LayoutGrid,
  CreditCard,
  Settings,
  Users,
  GraduationCap,
  Puzzle,
  User,
  Palette,
  Receipt,
  Wallet,
  Ticket,
  Award,
  MessageSquare,
  // Share2,
  BookOpen,
  Package,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  subitems: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    slug: string;
  }[];
}

export function useSidebarItems(): SidebarItem[] {
  const t = useTranslations("sidebar");
  const locale = useLocale();

  return useMemo(
    () => [
      {
        title: t("home"),
        slug: "/",
        icon: LayoutGrid,
        subitems: [],
      },
      {
        title: t("courses"),
        slug: "/courses",
        icon: BookOpen,
        subitems: [],
      },
      {
        title: t("digitalProducts"),
        slug: "/products",
        icon: Package,
        subitems: [],
      },
      {
        title: t("payments"),
        slug: "/payments",
        icon: CreditCard,
        subitems: [
          {
            title: t("paymentRecords"),
            icon: Receipt,
            slug: "/payments",
          },
          {
            title: t("paymentMethods"),
            icon: Wallet,
            slug: "/payments/payments-methods",
          },
          {
            title: t("coupons"),
            icon: Ticket,
            slug: "/payments/coupons",
          },
          // {
          //   title: t("affiliateMarketing"),
          //   icon: Share2,
          //   slug: "/payments/affiliate-marketing",
          // },
        ],
      },
      {
        title: t("customers"),
        slug: "/students",
        icon: Users,
        subitems: [
          {
            title: t("students"),
            icon: GraduationCap,
            slug: "/students",
          },
          {
            title: t("certificates"),
            icon: Award,
            slug: "/students/certificates",
          },
          {
            title: t("reviews"),
            icon: MessageSquare,
            slug: "/students/comments",
          },
        ],
      },
      // {
      //   title: t("applications"),
      //   slug: "/applications",
      //   icon: Puzzle,
      //   subitems: [],
      // },
      {
        title: t("settings"),
        icon: Settings,
        slug: "/settings",
        subitems: [
          {
            title: t("account"),
            icon: User,
            slug: "/settings",
          },
          {
            title: t("websiteSettings"),
            icon: Palette,
            slug: "/settings/website-settings/appearance",
          },
        ],
      },
    ],
    [t, locale]
  );
}
