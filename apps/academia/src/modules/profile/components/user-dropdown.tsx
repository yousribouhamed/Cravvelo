"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  User,
  Users,
  Award,
  BookOpen,
  Package,
  CreditCard,
  Settings,
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
import { useTranslations } from "next-intl";

interface ProfileDropdownProps {
  onLogout?: () => void;
}

export default function ProfileDropdown({ onLogout }: ProfileDropdownProps) {
  const { theme, setTheme } = useTheme();
  const tProfile = useTranslations("profile");
  const tMenu = useTranslations("profile.menu");

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const ProfileLinks = [
    { url: "/profile", name: tMenu("profile"), icon: User },
    { url: "/profile/affiliates", name: tMenu("affiliates"), icon: Users },
    { url: "/profile/certificate", name: tMenu("certificates"), icon: Award },
    { url: "/profile/courses", name: tMenu("courses"), icon: BookOpen },
    { url: "/profile/products", name: tMenu("products"), icon: Package },
    { url: "/profile/payments", name: tMenu("payments"), icon: CreditCard },
    { url: "/profile/settings", name: tMenu("settings"), icon: Settings },
  ];

  return (
    <DropdownMenu>
      {/* Trigger Button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center gap-2 text-gray-800 dark:text-gray-200"
        >
          <User className="w-5 h-5" />
          {tProfile("account")}
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{tProfile("accountSettings")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {ProfileLinks.map((link) => {
          const Icon = link.icon;
          return (
            <DropdownMenuItem key={link.url} asChild>
              <Link
                href={link.url}
                className="flex items-center justify-start gap-2 w-full"
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Dark Mode Toggle */}
        <DropdownMenuItem
          onClick={toggleDarkMode}
          className="flex items-center justify-start gap-2 cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          {theme === "dark" ? tProfile("lightMode") : tProfile("darkMode")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-600 focus:text-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {tProfile("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
