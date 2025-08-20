"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@ui/components/ui/switch";
import { Card, CardContent } from "@ui/components/ui/card";
import { Moon, Sun } from "lucide-react";

export default function SwitchMode() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Card className="w-full">
        <CardContent className="h-[50px] flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <p className="text-gray-900 dark:text-white font-medium">
              الوضع الداكن
            </p>
          </div>
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const isDark = theme === "dark";

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <Card className="w-full transition-colors duration-200">
      <CardContent className="h-[70px] flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Theme Icon */}
          <div className="flex items-center justify-center w-5 h-5 text-gray-600 dark:text-gray-300">
            {isDark ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </div>

          {/* Label */}
          <p className="text-gray-900 dark:text-white font-medium text-base">
            الوضع الداكن
          </p>
        </div>

        {/* Switch */}
        <div dir="ltr">
          <Switch
            checked={isDark}
            onCheckedChange={handleThemeChange}
            aria-label="تبديل الوضع الداكن"
          />
        </div>
      </CardContent>
    </Card>
  );
}
