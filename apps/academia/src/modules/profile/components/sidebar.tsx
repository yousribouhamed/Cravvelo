"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Users,
  Award,
  BookOpen,
  Package,
  CreditCard,
  Settings,
} from "lucide-react";
import { useTenantBranding } from "@/hooks/use-tenant";

interface SidebarProps {}

export const Links = [
  {
    url: "/profile",
    name: "الملف الشخصي",
    icon: User,
  },
  {
    url: "/profile/affiliates",
    name: "التسويق بالعمولة",
    icon: Users,
  },
  {
    url: "/profile/certificate",
    name: "الشهادات",
    icon: Award,
  },
  {
    url: "/profile/courses",
    name: "الدورات",
    icon: BookOpen,
  },
  {
    url: "/profile/products",
    name: "المنتجات",
    icon: Package,
  },
  {
    url: "/profile/payments",
    name: "المدفوعات",
    icon: CreditCard,
  },
  {
    url: "/profile/settings",
    name: "الإعدادات",
    icon: Settings,
  },
];

export default function ProfileSidebar({}: SidebarProps) {
  const pathname = usePathname();
  const { primaryColor, primaryColorDark } = useTenantBranding();

  return (
    <div className="w-full bg-card text-card-foreground border border-gray-200/80 dark:border-[#1A1A1D] rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          لوحة التحكم
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          إدارة حسابك وإعداداتك
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
                  ? {
                      backgroundColor: primaryColor,
                    }
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
              المستخدم
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">عضو مميز</p>
          </div>
        </div>
      </div>
    </div>
  );
}
