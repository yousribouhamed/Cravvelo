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

const ProfileLinks = [
  { url: "/profile", name: "الملف الشخصي", icon: User },
  { url: "/profile/affiliates", name: "التسويق بالعمولة", icon: Users },
  { url: "/profile/certificate", name: "الشهادات", icon: Award },
  { url: "/profile/courses", name: "الدورات", icon: BookOpen },
  { url: "/profile/products", name: "المنتجات", icon: Package },
  { url: "/profile/payments", name: "المدفوعات", icon: CreditCard },
  { url: "/profile/settings", name: "الإعدادات", icon: Settings },
];

interface ProfileDropdownProps {
  onLogout?: () => void;
}

export default function ProfileDropdown({ onLogout }: ProfileDropdownProps) {
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DropdownMenu>
      {/* Trigger Button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center gap-2 text-gray-800 dark:text-gray-200"
        >
          <User className="w-5 h-5" />
          الحساب
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel dir="rtl">إعدادات الحساب</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {ProfileLinks.map((link) => {
          const Icon = link.icon;
          return (
            <DropdownMenuItem key={link.url} asChild>
              <Link
                dir="rtl"
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
          dir="rtl"
          className="flex items-center justify-start gap-2 cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          {theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          dir="rtl"
          className="text-red-600 focus:text-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
