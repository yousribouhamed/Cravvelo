"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  User,
  Award,
  BookOpen,
  Package,
  CreditCard,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";

interface ProfileDropdownProps {
  onLogout?: () => void;
}

export default function ProfileDropdown({ onLogout }: ProfileDropdownProps) {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const tProfile = useTranslations("profile");
  const tMenu = useTranslations("profile.menu");
  const dropdownAlign = isRTL ? "start" : "end";

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const ProfileLinks = [
    { url: "/profile", name: tMenu("profile"), icon: User },
    { url: "/profile/certificate", name: tMenu("certificates"), icon: Award },
    { url: "/profile/courses", name: tMenu("courses"), icon: BookOpen },
    { url: "/profile/products", name: tMenu("products"), icon: Package },
    { url: "/profile/payments", name: tMenu("payments"), icon: CreditCard },
  ];

  return (
    <DropdownMenu>
      {/* Trigger Button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          dir={isRTL ? "rtl" : "ltr"}
          className="flex cursor-pointer items-center gap-2 text-card-foreground"
        >
          {isRTL ? (
            <>
              <span>{tProfile("account")}</span>
              <User className="w-5 h-5 shrink-0" />
            </>
          ) : (
            <>
              <User className="w-5 h-5 shrink-0" />
              <span>{tProfile("account")}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent
        dir={isRTL ? "rtl" : "ltr"}
        align={dropdownAlign}
        className={`w-56 ${isRTL ? "text-right" : "text-left"}`}
      >
        <DropdownMenuLabel className={isRTL ? "text-right" : "text-left"}>
          {tProfile("accountSettings")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {ProfileLinks.map((link) => {
          const Icon = link.icon;
          return (
            <DropdownMenuItem key={link.url} asChild>
              <Link
                href={link.url}
                className={`flex items-center gap-2 w-full ${isRTL ? "justify-start text-right" : "justify-start text-left"}`}
              >
                {isRTL ? (
                  <>
                    <span>{link.name}</span>
                    <Icon className="w-4 h-4 shrink-0" />
                  </>
                ) : (
                  <>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.name}</span>
                  </>
                )}
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Dark Mode Toggle */}
        <DropdownMenuItem
          onClick={toggleDarkMode}
          className={`flex items-center gap-2 cursor-pointer ${isRTL ? "justify-start text-right" : "justify-start text-left"}`}
        >
          {isRTL ? (
            <>
              <span>{theme === "dark" ? tProfile("lightMode") : tProfile("darkMode")}</span>
              {theme === "dark" ? (
                <Sun className="w-4 h-4 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 shrink-0" />
              )}
            </>
          ) : (
            <>
              {theme === "dark" ? (
                <Sun className="w-4 h-4 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 shrink-0" />
              )}
              <span>{theme === "dark" ? tProfile("lightMode") : tProfile("darkMode")}</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className={`flex items-center gap-2 text-red-600 focus:text-red-700 ${isRTL ? "justify-start text-right" : "justify-start text-left"}`}
        >
          {isRTL ? (
            <>
              <span>{tProfile("logout")}</span>
              <LogOut className="w-4 h-4 shrink-0" />
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{tProfile("logout")}</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
